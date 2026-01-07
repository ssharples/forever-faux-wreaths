import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("newsletterSubscribers").order("desc").collect();
  },
});

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    // Check for existing subscription
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { success: false, message: "Email already subscribed" };
    }

    await ctx.db.insert("newsletterSubscribers", {
      email,
      subscribedAt: Date.now(),
    });

    return { success: true, message: "Successfully subscribed" };
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (subscriber) {
      await ctx.db.delete(subscriber._id);
      return { success: true };
    }

    return { success: false, message: "Email not found" };
  },
});
