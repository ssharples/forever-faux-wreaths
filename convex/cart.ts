import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      const cart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .first();
      return cart;
    }

    if (args.sessionId) {
      const cart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
      return cart;
    }

    return null;
  },
});

export const getWithProducts = query({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let cart = null;

    if (args.userId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .first();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
    }

    if (!cart) return null;

    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product) return null;

        const imageUrl =
          product.images.length > 0
            ? await ctx.storage.getUrl(product.images[0])
            : null;

        return {
          ...item,
          product: {
            ...product,
            imageUrl,
          },
        };
      })
    );

    return {
      ...cart,
      items: itemsWithProducts.filter((item) => item !== null),
    };
  },
});

export const addItem = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    let cart = null;

    if (args.userId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .first();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
    }

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === args.productId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...cart.items];
        newItems[existingItemIndex].quantity += args.quantity;
      } else {
        newItems = [
          ...cart.items,
          { productId: args.productId, quantity: args.quantity },
        ];
      }

      await ctx.db.patch(cart._id, {
        items: newItems,
        updatedAt: Date.now(),
      });
      return cart._id;
    } else {
      const cartId = await ctx.db.insert("cart", {
        userId: args.userId,
        sessionId: args.sessionId,
        items: [{ productId: args.productId, quantity: args.quantity }],
        updatedAt: Date.now(),
      });
      return cartId;
    }
  },
});

export const updateItemQuantity = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    let cart = null;

    if (args.userId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .first();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
    }

    if (!cart) return;

    const newItems = cart.items
      .map((item) =>
        item.productId === args.productId
          ? { ...item, quantity: args.quantity }
          : item
      )
      .filter((item) => item.quantity > 0);

    await ctx.db.patch(cart._id, {
      items: newItems,
      updatedAt: Date.now(),
    });
  },
});

export const removeItem = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    let cart = null;

    if (args.userId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .first();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
    }

    if (!cart) return;

    const newItems = cart.items.filter(
      (item) => item.productId !== args.productId
    );

    await ctx.db.patch(cart._id, {
      items: newItems,
      updatedAt: Date.now(),
    });
  },
});

export const clear = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let cart = null;

    if (args.userId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .first();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
    }

    if (cart) {
      await ctx.db.delete(cart._id);
    }
  },
});

export const mergeGuestCart = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const guestCart = await ctx.db
      .query("cart")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!guestCart || guestCart.items.length === 0) return;

    const userCart = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (userCart) {
      const mergedItems = [...userCart.items];

      for (const guestItem of guestCart.items) {
        const existingIndex = mergedItems.findIndex(
          (item) => item.productId === guestItem.productId
        );
        if (existingIndex >= 0) {
          mergedItems[existingIndex].quantity += guestItem.quantity;
        } else {
          mergedItems.push(guestItem);
        }
      }

      await ctx.db.patch(userCart._id, {
        items: mergedItems,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("cart", {
        userId: args.userId,
        sessionId: undefined,
        items: guestCart.items,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(guestCart._id);
  },
});
