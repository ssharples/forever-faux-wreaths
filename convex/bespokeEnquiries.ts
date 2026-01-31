import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("in-discussion"),
        v.literal("quoted"),
        v.literal("accepted"),
        v.literal("in-progress"),
        v.literal("complete"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const enquiries = args.status
      ? await ctx.db
          .query("bespokeEnquiries")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db.query("bespokeEnquiries").order("desc").collect();

    // Get image URLs
    const enquiriesWithImages = await Promise.all(
      enquiries.map(async (enquiry) => {
        const imageUrls = await Promise.all(
          enquiry.inspirationImages.map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return url;
          })
        );
        return {
          ...enquiry,
          imageUrls: imageUrls.filter((url): url is string => url !== null),
        };
      })
    );

    return enquiriesWithImages;
  },
});

export const getById = query({
  args: { id: v.id("bespokeEnquiries") },
  handler: async (ctx, args) => {
    const enquiry = await ctx.db.get(args.id);
    if (!enquiry) return null;

    const imageUrls = await Promise.all(
      enquiry.inspirationImages.map(async (imageId) => {
        const url = await ctx.storage.getUrl(imageId);
        return url;
      })
    );

    return {
      ...enquiry,
      imageUrls: imageUrls.filter((url): url is string => url !== null),
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    arrangementType: v.string(),
    colourTheme: v.string(),
    customColour: v.optional(v.string()),
    ribbon: v.boolean(),
    ribbonColour: v.optional(v.string()),
    wreathBase: v.string(),
    size: v.string(),
    customSize: v.optional(v.string()),
    occasion: v.string(),
    inspirationImages: v.array(v.id("_storage")),
    notes: v.optional(v.string()),
    estimatedPrice: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bespokeEnquiries", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("bespokeEnquiries"),
    status: v.union(
      v.literal("new"),
      v.literal("in-discussion"),
      v.literal("quoted"),
      v.literal("accepted"),
      v.literal("in-progress"),
      v.literal("complete"),
      v.literal("cancelled")
    ),
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getNewCount = query({
  args: {},
  handler: async (ctx) => {
    const newEnquiries = await ctx.db
      .query("bespokeEnquiries")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .collect();
    return newEnquiries.length;
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const enquiries = await ctx.db
      .query("bespokeEnquiries")
      .order("desc")
      .take(limit);

    const enquiriesWithImages = await Promise.all(
      enquiries.map(async (enquiry) => {
        const imageUrls = await Promise.all(
          enquiry.inspirationImages.map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return url;
          })
        );
        return {
          ...enquiry,
          imageUrls: imageUrls.filter((url): url is string => url !== null),
        };
      })
    );

    return enquiriesWithImages;
  },
});
