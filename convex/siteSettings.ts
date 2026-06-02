import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return setting?.value ?? null;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").collect();
    const settingsMap: Record<string, unknown> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    return settingsMap;
  },
});

export const getStorefront = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").collect();
    const settingsMap: Record<string, unknown> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    return {
      holidayMode: Boolean(settingsMap.holidayMode),
      seasonalBanner:
        (settingsMap.seasonalBanner as
          | { enabled?: boolean; text?: string; variant?: string }
          | undefined) ?? null,
      deliveryPrices:
        (settingsMap.deliveryPrices as
          | { small?: number; large?: number; collection?: number }
          | undefined) ?? null,
      deliveryOptions:
        (settingsMap.deliveryOptions as
          | {
              small?: { enabled?: boolean; time?: string };
              large?: { enabled?: boolean; time?: string };
              collection?: { enabled?: boolean; address?: string };
            }
          | undefined) ?? null,
      storeName: (settingsMap.storeName as string | undefined) ?? null,
      contactEmail: (settingsMap.contactEmail as string | undefined) ?? null,
      location: (settingsMap.location as string | undefined) ?? null,
    };
  },
});

export const getAllInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").collect();
    const settingsMap: Record<string, unknown> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    return settingsMap;
  },
});

export const set = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("siteSettings", {
        key: args.key,
        value: args.value,
      });
    }
  },
});

export const remove = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const setting = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (setting) {
      await ctx.db.delete(setting._id);
    }
  },
});

// Default settings initialization
export const initializeDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const defaults = [
      {
        key: "seasonalBanner",
        value: {
          enabled: false,
          text: "Welcome to Forever Faux Wreaths!",
          variant: "sage",
        },
      },
      {
        key: "deliveryPrices",
        value: {
          small: 4.99,
          large: 7.99,
          collection: 0,
        },
      },
      {
        key: "deliveryOptions",
        value: {
          small: {
            enabled: true,
            time: "1-2 weeks",
          },
          large: {
            enabled: true,
            time: "1-2 weeks",
          },
          collection: {
            enabled: true,
            address: "Preston, Lancashire (exact address provided after order)",
          },
        },
      },
      {
        key: "bespokePricing",
        value: {
          "20cm": 45,
          "30cm": 55,
          "40cm": 70,
          "50cm": 85,
          ribbon: 5,
        },
      },
      {
        key: "socialLinks",
        value: {
          facebook: "",
          instagram: "",
          tiktok: "",
        },
      },
    ];

    for (const setting of defaults) {
      const existing = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", setting.key))
        .first();

      if (!existing) {
        await ctx.db.insert("siteSettings", setting);
      }
    }
  },
});
