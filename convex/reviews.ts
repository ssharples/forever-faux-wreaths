import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    visible: v.optional(v.boolean()),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const reviews =
      args.visible !== undefined
        ? await ctx.db
            .query("reviews")
            .withIndex("by_visible", (q) => q.eq("visible", args.visible!))
            .order("desc")
            .collect()
        : await ctx.db.query("reviews").order("desc").collect();

    if (args.productId) {
      return reviews.filter((r) => r.productId === args.productId);
    }

    return reviews;
  },
});

export const getVisible = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_visible", (q) => q.eq("visible", true))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    customerName: v.string(),
    rating: v.number(),
    text: v.string(),
    productId: v.optional(v.id("products")),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const toggleVisibility = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id);
    if (review) {
      await ctx.db.patch(args.id, { visible: !review.visible });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
