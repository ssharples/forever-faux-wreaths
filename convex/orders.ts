import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { requireAdmin } from "./authHelpers";

const orderStatusValidator = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("shipped"),
  v.literal("completed"),
  v.literal("issue"),
  v.literal("dispatched"),
  v.literal("delivered"),
  v.literal("collected")
);

export const list = query({
  args: {
    status: v.optional(orderStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const getCommunications = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("orderCommunications")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .order("desc")
      .collect();
  },
});

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    if (!user) return [];

    const orders = await ctx.db.query("orders").order("desc").collect();
    const email = user.email.toLowerCase().trim();

    return orders.filter(
      (order) =>
        order.customerId === userId ||
        order.customerEmail.toLowerCase().trim() === email
    );
  },
});

export const getByIdInternal = internalQuery({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCommunicationByIdInternal = internalQuery({
  args: { id: v.id("orderCommunications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FFW-${timestamp}-${random}`;
}

function normaliseEmail(email: string) {
  const normalised = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) {
    throw new Error("A valid customer email is required.");
  }
  return normalised;
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
    await requireAdmin(ctx);
    const orderNumber = generateOrderNumber();
    const customerEmail = normaliseEmail(args.customerEmail);
    const orderId = await ctx.db.insert("orders", {
      ...args,
      customerEmail,
      orderNumber,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { orderId, orderNumber };
  },
});

export const getByStripeSession = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .first();
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
    const dup = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .first();
    if (dup) return { orderId: dup._id, orderNumber: dup.orderNumber };

    const customerEmail = normaliseEmail(args.customerEmail);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", customerEmail))
      .first();

    const orderNumber = generateOrderNumber();
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerId: existingUser?._id,
      customerName: args.customerName,
      customerEmail,
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
      updatedAt: Date.now(),
    });

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
    status: orderStatusValidator,
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...updates } = args;
    const order = await ctx.db.get(id);
    if (!order) {
      throw new Error("Order not found");
    }
    const trackingNumber = updates.trackingNumber?.trim() || undefined;
    const statusChanged = order.status !== updates.status;

    await ctx.db.patch(id, {
      status: updates.status,
      trackingNumber,
      updatedAt: Date.now(),
    });

    if (
      statusChanged &&
      ["shipped", "completed", "dispatched", "delivered", "collected"].includes(
        updates.status
      )
    ) {
      await ctx.scheduler.runAfter(0, internal.emails.sendDeliveryStatusUpdate, {
        orderId: id,
      });
    }
  },
});

export const sendCustomerMessage = mutation({
  args: {
    orderId: v.id("orders"),
    subject: v.string(),
    message: v.string(),
    markAsIssue: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const subject = args.subject.trim();
    const message = args.message.trim();
    const recipientEmail = normaliseEmail(order.customerEmail);
    if (subject.length < 3) {
      throw new Error("Subject must be at least 3 characters.");
    }
    if (message.length < 10) {
      throw new Error("Message must be at least 10 characters.");
    }

    const communicationId = await ctx.db.insert("orderCommunications", {
      orderId: args.orderId,
      recipientEmail,
      subject,
      message,
      status: "queued",
      createdAt: Date.now(),
    });

    if (args.markAsIssue) {
      await ctx.db.patch(args.orderId, {
        status: "issue",
        updatedAt: Date.now(),
      });
    }

    await ctx.scheduler.runAfter(0, internal.emails.sendOrderCustomerMessage, {
      communicationId,
    });

    return communicationId;
  },
});

export const markCommunicationSentInternal = internalMutation({
  args: { id: v.id("orderCommunications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: Date.now(),
    });
  },
});

export const markCommunicationFailedInternal = internalMutation({
  args: {
    id: v.id("orderCommunications"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
      error: args.error,
    });
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
