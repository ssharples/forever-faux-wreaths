import { v, type Infer } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

const MEMORIAL_TOPPER_PRODUCT_KEY = "memorial-topper";

const requestedInfoValidator = v.union(
  v.literal("wholesale-pricing"),
  v.literal("minimum-order-quantities"),
  v.literal("sample-availability"),
  v.literal("launch-dates"),
  v.literal("trade-packs")
);

const leadStatusValidator = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("converted"),
  v.literal("archived")
);

type RequestedInfo = Infer<typeof requestedInfoValidator>;

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

function optionalTrimmed(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanRequestedInfo(values: RequestedInfo[]) {
  return Array.from(new Set(values));
}

function requestedInfoLabel(value: RequestedInfo) {
  const labels: Record<RequestedInfo, string> = {
    "wholesale-pricing": "Wholesale pricing",
    "minimum-order-quantities": "Minimum order quantities",
    "sample-availability": "Sample availability",
    "launch-dates": "Launch dates",
    "trade-packs": "Trade packs",
  };
  return labels[value];
}

export const list = query({
  args: {
    leadType: v.optional(
      v.union(v.literal("retail-waitlist"), v.literal("wholesale-interest"))
    ),
    status: v.optional(leadStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const leads = args.leadType
      ? await ctx.db
          .query("memorialLeads")
          .withIndex("by_leadType", (q) => q.eq("leadType", args.leadType!))
          .order("desc")
          .collect()
      : args.status
        ? await ctx.db
            .query("memorialLeads")
            .withIndex("by_status", (q) => q.eq("status", args.status!))
            .order("desc")
            .collect()
        : await ctx.db.query("memorialLeads").order("desc").collect();

    return args.status
      ? leads.filter((lead) => lead.status === args.status)
      : leads;
  },
});

export const createRetailWaitlistLead = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    interestType: v.union(
      v.literal("waiting-list"),
      v.literal("early-access")
    ),
    privacyConsent: v.boolean(),
    marketingConsent: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (!args.privacyConsent) {
      throw new Error("Please agree to the privacy policy to continue.");
    }

    const email = normaliseEmail(args.email);
    const name = optionalTrimmed(args.name);
    const now = Date.now();
    const existing = await ctx.db
      .query("memorialLeads")
      .withIndex("by_email_type_product", (q) =>
        q
          .eq("email", email)
          .eq("leadType", "retail-waitlist")
          .eq("productKey", MEMORIAL_TOPPER_PRODUCT_KEY)
      )
      .first();

    const updates = {
      name,
      email,
      leadType: "retail-waitlist" as const,
      productKey: MEMORIAL_TOPPER_PRODUCT_KEY,
      interestType: args.interestType,
      requestedInfo: [],
      privacyConsent: true,
      marketingConsent: args.marketingConsent ?? false,
      status: "new" as const,
      updatedAt: now,
    };

    const leadId = existing
      ? (await ctx.db.patch(existing._id, updates), existing._id)
      : await ctx.db.insert("memorialLeads", {
          ...updates,
          createdAt: now,
        });

    await ctx.scheduler.runAfter(0, internal.emails.sendAdminNotification, {
      subject: "Memorial Topper waitlist signup",
      htmlBody: `
        <p><strong>${escapeHtml(name ?? email)}</strong> joined the Forever Faux Memorial Topper ${args.interestType === "early-access" ? "early access list" : "waiting list"}.</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      `,
      notificationType: "notifyMemorialRetailWaitlist",
    });

    return {
      id: leadId,
      isNew: !existing,
      message: existing
        ? "You're already on the Memorial Topper list. We've updated your details."
        : "You're on the Memorial Topper list.",
    };
  },
});

export const createWholesaleInterestLead = mutation({
  args: {
    businessName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    businessType: v.string(),
    website: v.optional(v.string()),
    requestedInfo: v.array(requestedInfoValidator),
    message: v.optional(v.string()),
    privacyConsent: v.boolean(),
    marketingConsent: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (!args.privacyConsent) {
      throw new Error("Please agree to the privacy policy to continue.");
    }

    const requestedInfo = cleanRequestedInfo(args.requestedInfo);
    if (requestedInfo.length === 0) {
      throw new Error("Please select at least one trade information request.");
    }

    const email = normaliseEmail(args.email);
    const businessName = requireTrimmed(args.businessName, "Business name");
    const contactName = requireTrimmed(args.contactName, "Contact name");
    const businessType = requireTrimmed(args.businessType, "Business type");
    const phone = optionalTrimmed(args.phone);
    const website = optionalTrimmed(args.website);
    const message = optionalTrimmed(args.message);
    const now = Date.now();

    const existing = await ctx.db
      .query("memorialLeads")
      .withIndex("by_email_type_product", (q) =>
        q
          .eq("email", email)
          .eq("leadType", "wholesale-interest")
          .eq("productKey", MEMORIAL_TOPPER_PRODUCT_KEY)
      )
      .first();

    const updates = {
      leadType: "wholesale-interest" as const,
      productKey: MEMORIAL_TOPPER_PRODUCT_KEY,
      email,
      name: contactName,
      phone,
      businessName,
      businessType,
      website,
      requestedInfo,
      message,
      privacyConsent: true,
      marketingConsent: args.marketingConsent ?? false,
      status: "new" as const,
      updatedAt: now,
    };

    const leadId = existing
      ? (await ctx.db.patch(existing._id, updates), existing._id)
      : await ctx.db.insert("memorialLeads", {
          ...updates,
          createdAt: now,
        });

    await ctx.scheduler.runAfter(0, internal.emails.sendAdminNotification, {
      subject: "Memorial Topper wholesale enquiry",
      htmlBody: `
        <p><strong>${escapeHtml(contactName)}</strong> sent a wholesale enquiry for the Forever Faux Memorial Topper.</p>
        <p><strong>Business:</strong> ${escapeHtml(businessName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Business type:</strong> ${escapeHtml(businessType)}</p>
        <p><strong>Requested:</strong> ${requestedInfo.map(requestedInfoLabel).map(escapeHtml).join(", ")}</p>
        ${message ? `<p><strong>Message:</strong><br />${escapeHtml(message).replace(/\n/g, "<br />")}</p>` : ""}
      `,
      notificationType: "notifyMemorialWholesaleInterest",
    });

    return {
      id: leadId,
      isNew: !existing,
      message: existing
        ? "We've updated your Memorial Topper wholesale enquiry."
        : "Your Memorial Topper wholesale enquiry has been sent.",
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("memorialLeads"),
    status: leadStatusValidator,
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(args.id);
    if (!lead) {
      throw new Error("Memorial lead not found.");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      internalNotes: optionalTrimmed(args.internalNotes),
      updatedAt: Date.now(),
    });
  },
});
