import { v } from "convex/values";
import {
  query,
  mutation,
  type QueryCtx,
} from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

function normalizeStatus(
  stock: number,
  status: "active" | "draft" | "sold-out"
) {
  return stock === 0 ? "sold-out" : status;
}

async function enrichProduct<
  T extends {
    images: Doc<"products">["images"];
    categoryId: Doc<"products">["categoryId"];
  },
>(ctx: QueryCtx, product: T) {
  const imageUrls = await Promise.all(
    product.images.map(async (imageId) => {
      const url = await ctx.storage.getUrl(imageId);
      return url;
    })
  );
  const category = await ctx.db.get(product.categoryId);

  return {
    ...product,
    categoryName: category?.name ?? null,
    imageUrls: imageUrls.filter((url): url is string => url !== null),
  };
}

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("active"), v.literal("draft"), v.literal("sold-out"))
    ),
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const products = args.status
      ? await ctx.db
          .query("products")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("products").collect();

    // Filter in memory for additional conditions
    let filtered = products;
    if (args.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === args.categoryId);
    }
    if (args.featured !== undefined) {
      filtered = filtered.filter((p) => p.featured === args.featured);
    }

    // Get image URLs for each product
    const productsWithImages = await Promise.all(
      filtered.map((product) => enrichProduct(ctx, product))
    );

    return productsWithImages;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!product) return null;

    return await enrichProduct(ctx, product);
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(8);

    const productsWithImages = await Promise.all(
      products.map((product) => enrichProduct(ctx, product))
    );

    return productsWithImages;
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;

    return await enrichProduct(ctx, product);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    price: v.number(),
    description: v.string(),
    images: v.array(v.id("_storage")),
    size: v.string(),
    colours: v.array(v.string()),
    style: v.union(
      v.literal("classic"),
      v.literal("modern"),
      v.literal("rustic"),
      v.literal("seasonal"),
      v.literal("memorial")
    ),
    suitableFor: v.array(v.string()),
    stock: v.number(),
    categoryId: v.id("categories"),
    featured: v.boolean(),
    sizeCategory: v.union(v.literal("small"), v.literal("large")),
    status: v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("sold-out")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const productId = await ctx.db.insert("products", {
      ...args,
      status: normalizeStatus(args.stock, args.status),
      createdAt: now,
      updatedAt: now,
    });
    return productId;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    images: v.optional(v.array(v.id("_storage"))),
    size: v.optional(v.string()),
    colours: v.optional(v.array(v.string())),
    style: v.optional(
      v.union(
        v.literal("classic"),
        v.literal("modern"),
        v.literal("rustic"),
        v.literal("seasonal"),
        v.literal("memorial")
      )
    ),
    suitableFor: v.optional(v.array(v.string())),
    stock: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
    sizeCategory: v.optional(v.union(v.literal("small"), v.literal("large"))),
    status: v.optional(
      v.union(v.literal("active"), v.literal("draft"), v.literal("sold-out"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Product not found");
    }

    const nextStock = updates.stock ?? existing.stock;
    const nextStatus = normalizeStatus(nextStock, updates.status ?? existing.status);

    await ctx.db.patch(id, {
      ...updates,
      status: nextStatus,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getActiveCount = query({
  args: {},
  handler: async (ctx) => {
    const activeProducts = await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    return activeProducts.length;
  },
});
