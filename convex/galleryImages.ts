import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    visible: v.optional(v.boolean()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Fetch images - use visibility index if specified, otherwise get all
    const images =
      args.visible !== undefined
        ? await ctx.db
            .query("galleryImages")
            .withIndex("by_visible", (q) => q.eq("visible", args.visible!))
            .collect()
        : await ctx.db.query("galleryImages").collect();

    // Sort by sortOrder in memory
    const sortedImages = images.sort((a, b) => a.sortOrder - b.sortOrder);

    // Get URLs for images
    const imagesWithUrls = await Promise.all(
      sortedImages.map(async (image) => {
        const url = await ctx.storage.getUrl(image.imageId);
        return {
          ...image,
          url,
        };
      })
    );

    if (args.category) {
      return imagesWithUrls.filter((img) => img.category === args.category);
    }

    return imagesWithUrls;
  },
});

export const getVisible = query({
  args: {},
  handler: async (ctx) => {
    const images = await ctx.db
      .query("galleryImages")
      .withIndex("by_visible", (q) => q.eq("visible", true))
      .collect();

    const sortedImages = images.sort((a, b) => a.sortOrder - b.sortOrder);

    const imagesWithUrls = await Promise.all(
      sortedImages.map(async (image) => {
        const url = await ctx.storage.getUrl(image.imageId);
        return {
          ...image,
          url,
        };
      })
    );

    return imagesWithUrls;
  },
});

export const create = mutation({
  args: {
    imageId: v.id("_storage"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    sortOrder: v.number(),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("galleryImages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("galleryImages"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("galleryImages") },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.id);
    if (image) {
      await ctx.storage.delete(image.imageId);
      await ctx.db.delete(args.id);
    }
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
