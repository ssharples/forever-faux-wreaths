import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("dispatched"),
        v.literal("delivered"),
        v.literal("collected")
      )
    ),
  },
  handler: async (ctx, args) => {
    return args.status
      ? await ctx.db
          .query("orders")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db.query("orders").order("desc").collect();
  },
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

export const getByCustomer = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FFW-${timestamp}-${random}`;
}

export const create = mutation({
  args: {
    customerId: v.optional(v.id("users")),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    shippingAddress: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      county: v.optional(v.string()),
      postcode: v.string(),
      country: v.string(),
    }),
    deliveryMethod: v.union(v.literal("standard"), v.literal("collection")),
    items: v.array(
      v.object({
        productId: v.id("products"),
        title: v.string(),
        price: v.number(),
        quantity: v.number(),
        imageId: v.optional(v.id("_storage")),
      })
    ),
    subtotal: v.number(),
    deliveryCost: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),
    paymentMethod: v.union(v.literal("paypal"), v.literal("sumup")),
    paymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const orderNumber = generateOrderNumber();
    const orderId = await ctx.db.insert("orders", {
      ...args,
      orderNumber,
      status: "pending",
      createdAt: Date.now(),
    });

    // Decrease stock for purchased items
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await ctx.db.patch(item.productId, {
          stock: newStock,
          status: newStock === 0 ? "sold-out" : product.status,
          updatedAt: Date.now(),
        });
      }
    }

    return { orderId, orderNumber };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("dispatched"),
      v.literal("delivered"),
      v.literal("collected")
    ),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
