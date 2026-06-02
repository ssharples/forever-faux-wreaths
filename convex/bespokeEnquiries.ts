import { v } from "convex/values";
import { query, mutation, internalQuery, type MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdmin } from "./authHelpers";
import type { Id } from "./_generated/dataModel";

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

async function validateSourceProduct(
  ctx: MutationCtx,
  sourceProductId?: Id<"products">
) {
  if (!sourceProductId) return;
  const product = await ctx.db.get(sourceProductId);
  if (!product) {
    throw new Error("Selected source product no longer exists.");
  }
}

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
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
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

export const getByIdInternal = internalQuery({
  args: { id: v.id("bespokeEnquiries") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
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
    sourceProductId: v.optional(v.id("products")),
    sourceProductTitle: v.optional(v.string()),
    sourceProductSlug: v.optional(v.string()),
    notes: v.optional(v.string()),
    estimatedPrice: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.inspirationImages.length > 5) {
      throw new Error("Please upload no more than 5 inspiration images.");
    }
    if (args.colourTheme === "custom" && !args.customColour?.trim()) {
      throw new Error("Please describe your custom colour preferences.");
    }
    if (args.size === "custom" && !args.customSize?.trim()) {
      throw new Error("Please describe your custom size requirements.");
    }
    await validateSourceProduct(ctx, args.sourceProductId);

    const now = Date.now();
    const enquiryId = await ctx.db.insert("bespokeEnquiries", {
      ...args,
      name: requireTrimmed(args.name, "Name"),
      email: normaliseEmail(args.email),
      phone: args.phone?.trim() || undefined,
      arrangementType: requireTrimmed(args.arrangementType, "Arrangement type"),
      colourTheme: requireTrimmed(args.colourTheme, "Colour theme"),
      customColour: args.customColour?.trim() || undefined,
      ribbonColour: args.ribbonColour?.trim() || undefined,
      wreathBase: requireTrimmed(args.wreathBase, "Wreath base"),
      size: requireTrimmed(args.size, "Size"),
      customSize: args.customSize?.trim() || undefined,
      occasion: requireTrimmed(args.occasion, "Occasion"),
      sourceProductTitle: args.sourceProductTitle?.trim() || undefined,
      sourceProductSlug: args.sourceProductSlug?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
      estimatedPrice: args.estimatedPrice?.trim() || undefined,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendBespokeEnquiryAcknowledgement, {
      enquiryId,
    });
    await ctx.scheduler.runAfter(0, internal.emails.sendAdminNotification, {
      subject: "New bespoke enquiry received",
      htmlBody: `<p><strong>${escapeHtml(requireTrimmed(args.name, "Name"))}</strong> requested a bespoke ${escapeHtml(args.arrangementType)}.</p><p>Email: ${escapeHtml(normaliseEmail(args.email))}</p>${
        args.sourceProductTitle
          ? `<p>Inspired by: <strong>${escapeHtml(args.sourceProductTitle)}</strong></p>`
          : ""
      }`,
      notificationType: "notifyBespokeEnquiries",
    });

    return enquiryId;
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
    await requireAdmin(ctx);
    const { id, ...updates } = args;
    const enquiry = await ctx.db.get(id);
    if (!enquiry) {
      throw new Error("Enquiry not found");
    }
    await ctx.db.patch(id, {
      ...updates,
      internalNotes: updates.internalNotes?.trim() || undefined,
      updatedAt: Date.now(),
    });
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
