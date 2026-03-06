import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

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
    paymentMethod: v.literal("stripe"),
    paymentId: v.string(),
    stripeSessionId: v.optional(v.string()),
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

export const getByStripeSession = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").collect();
    return orders.find((o) => o.stripeSessionId === args.stripeSessionId) ?? null;
  },
});

export const createFromStripe = internalMutation({
  args: {
    stripeSessionId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
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
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Idempotency check - don't create duplicate orders
    const existing = await ctx.db.query("orders").collect();
    const dup = existing.find((o) => o.stripeSessionId === args.stripeSessionId);
    if (dup) return { orderId: dup._id, orderNumber: dup.orderNumber };

    const orderNumber = generateOrderNumber();
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      shippingAddress: args.shippingAddress,
      deliveryMethod: args.deliveryMethod,
      items: args.items,
      subtotal: args.subtotal,
      deliveryCost: args.deliveryCost,
      total: args.total,
      status: "pending",
      paymentMethod: "stripe",
      paymentId: args.stripeSessionId,
      stripeSessionId: args.stripeSessionId,
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

    // Clear the guest cart if sessionId provided
    if (args.sessionId) {
      const cart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
      if (cart) {
        await ctx.db.delete(cart._id);
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

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").collect();

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const lastMonthStart = new Date(thisMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const thisMonthOrders = allOrders.filter(
      (o) => o.createdAt >= thisMonthStart.getTime()
    );
    const lastMonthOrders = allOrders.filter(
      (o) =>
        o.createdAt >= lastMonthStart.getTime() &&
        o.createdAt < thisMonthStart.getTime()
    );

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);

    const revenueChange =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : thisMonthRevenue > 0
        ? 100
        : 0;

    const ordersChange =
      lastMonthOrders.length > 0
        ? ((thisMonthOrders.length - lastMonthOrders.length) /
            lastMonthOrders.length) *
          100
        : thisMonthOrders.length > 0
        ? 100
        : 0;

    return {
      totalRevenue,
      thisMonthRevenue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersThisMonth: thisMonthOrders.length,
      ordersChange: Math.round(ordersChange * 10) / 10,
    };
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    return await ctx.db.query("orders").order("desc").take(limit);
  },
});
