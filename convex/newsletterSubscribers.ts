import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdmin } from "./authHelpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
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

    await ctx.scheduler.runAfter(0, internal.emails.sendAdminNotification, {
      subject: "New newsletter signup",
      htmlBody: `<p><strong>${email}</strong> joined the newsletter list.</p>`,
      notificationType: "notifyNewsletterSignups",
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
