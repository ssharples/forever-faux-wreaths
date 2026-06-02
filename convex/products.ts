import { v } from "convex/values";
import {
  query,
  mutation,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdmin } from "./authHelpers";

const DEFAULT_PRODUCTION_LEAD_TIME = "1-2 weeks";

function requireTrimmed(value: string, field: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${field} is required.`);
  }
  return trimmed;
}

function validatePrice(price: number) {
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than zero.");
  }
  return price;
}

function cleanStringArray(values: string[]) {
  return Array.from(
    new Set(
      values.map((value) => value.trim()).filter((value) => value.length > 0)
    )
  );
}

function validateImages(images: Id<"_storage">[]) {
  if (images.length === 0) {
    throw new Error("Please upload at least one product image.");
  }
  return images;
}

async function validateCategory(ctx: MutationCtx, categoryId: Id<"categories">) {
  const category = await ctx.db.get(categoryId);
  if (!category) {
    throw new Error("Selected category no longer exists.");
  }
}

async function assertUniqueSlug(
  ctx: MutationCtx,
  slug: string,
  currentProductId?: Id<"products">
) {
  const existing = await ctx.db
    .query("products")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();

  if (existing && existing._id !== currentProductId) {
    throw new Error("A product with this slug already exists.");
  }
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

export const adminList = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const products = await ctx.db.query("products").collect();
    return Promise.all(products.map((product) => enrichProduct(ctx, product)));
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
    await requireAdmin(ctx);
    const slug = requireTrimmed(args.slug, "Slug");
    await assertUniqueSlug(ctx, slug);
    await validateCategory(ctx, args.categoryId);

    const now = Date.now();
    const productId = await ctx.db.insert("products", {
      title: requireTrimmed(args.title, "Title"),
      slug,
      price: validatePrice(args.price),
      description: requireTrimmed(args.description, "Description"),
      images: validateImages(args.images),
      size: requireTrimmed(args.size, "Size"),
      colours: cleanStringArray(args.colours),
      style: args.style,
      suitableFor: cleanStringArray(args.suitableFor),
      categoryId: args.categoryId,
      featured: args.featured,
      sizeCategory: args.sizeCategory,
      status: args.status,
      madeToOrder: true,
      productionLeadTime: DEFAULT_PRODUCTION_LEAD_TIME,
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
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
    sizeCategory: v.optional(v.union(v.literal("small"), v.literal("large"))),
    status: v.optional(
      v.union(v.literal("active"), v.literal("draft"), v.literal("sold-out"))
    ),
    madeToOrder: v.optional(v.boolean()),
    productionLeadTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Product not found");
    }

    const patch: Partial<Omit<Doc<"products">, "_id" | "_creationTime">> = {
      madeToOrder: true,
      productionLeadTime: DEFAULT_PRODUCTION_LEAD_TIME,
      updatedAt: Date.now(),
    };

    if (updates.title !== undefined) {
      patch.title = requireTrimmed(updates.title, "Title");
    }
    if (updates.slug !== undefined) {
      patch.slug = requireTrimmed(updates.slug, "Slug");
      await assertUniqueSlug(ctx, patch.slug, id);
    }
    if (updates.price !== undefined) {
      patch.price = validatePrice(updates.price);
    }
    if (updates.description !== undefined) {
      patch.description = requireTrimmed(updates.description, "Description");
    }
    if (updates.images !== undefined) {
      patch.images = validateImages(updates.images);
    }
    if (updates.size !== undefined) {
      patch.size = requireTrimmed(updates.size, "Size");
    }
    if (updates.colours !== undefined) {
      patch.colours = cleanStringArray(updates.colours);
    }
    if (updates.style !== undefined) {
      patch.style = updates.style;
    }
    if (updates.suitableFor !== undefined) {
      patch.suitableFor = cleanStringArray(updates.suitableFor);
    }
    if (updates.categoryId !== undefined) {
      await validateCategory(ctx, updates.categoryId);
      patch.categoryId = updates.categoryId;
    }
    if (updates.featured !== undefined) {
      patch.featured = updates.featured;
    }
    if (updates.sizeCategory !== undefined) {
      patch.sizeCategory = updates.sizeCategory;
    }
    if (updates.status !== undefined) {
      patch.status = updates.status;
    }

    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
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
