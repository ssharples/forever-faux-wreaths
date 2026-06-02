import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const beginWebhookProcessing = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.string(),
    stripeSessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeWebhookEvents")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .first();

    if (!existing) {
      await ctx.db.insert("stripeWebhookEvents", {
        ...args,
        status: "processing",
        attempts: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return true;
    }

    if (existing.status === "completed" || existing.status === "processing") {
      return false;
    }

    await ctx.db.patch(existing._id, {
      status: "processing",
      attempts: existing.attempts + 1,
      lastError: undefined,
      updatedAt: Date.now(),
    });
    return true;
  },
});

export const completeWebhookProcessing = internalMutation({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeWebhookEvents")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "completed",
        processedAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const failWebhookProcessing = internalMutation({
  args: {
    eventId: v.string(),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeWebhookEvents")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "error",
        lastError: args.error,
        updatedAt: Date.now(),
      });
    }
  },
});
