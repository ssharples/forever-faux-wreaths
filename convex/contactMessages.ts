import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

function normaliseEmail(email: string) {
  const normalised = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) {
    throw new Error("Please enter a valid email address.");
  }
  return normalised;
}

function requireTrimmed(value: string, field: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${field} is required.`);
  }
  return trimmed;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
    consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.consent) {
      throw new Error("Please agree to the privacy policy to continue.");
    }

    const name = requireTrimmed(args.name, "Name");
    const email = normaliseEmail(args.email);
    const message = requireTrimmed(args.message, "Message");
    const subject = args.subject?.trim() || "Website contact message";
    const now = Date.now();

    const messageId = await ctx.db.insert("contactMessages", {
      name,
      email,
      subject,
      message,
      consent: true,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendAdminNotification, {
      subject: `New contact message: ${subject}`,
      htmlBody: `
        <p><strong>${escapeHtml(name)}</strong> sent a contact message from the website.</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
      notificationType: "notifyContactMessages",
    });

    return messageId;
  },
});

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("read"),
        v.literal("replied"),
        v.literal("archived")
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const messages = args.status
      ? await ctx.db
          .query("contactMessages")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db.query("contactMessages").order("desc").collect();

    return messages;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("contactMessages"),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
