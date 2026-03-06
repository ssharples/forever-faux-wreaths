"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";
import { api } from "./_generated/api";

export const createCheckoutSession = action({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        title: v.string(),
        price: v.number(),
        quantity: v.number(),
        imageUrl: v.optional(v.string()),
      })
    ),
    deliveryMethod: v.union(v.literal("standard"), v.literal("collection")),
    deliveryCost: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      const product = await ctx.runQuery(api.products.getById, {
        id: item.productId,
      });

      if (!product || product.status !== "active" || product.stock <= 0) {
        throw new Error(`${item.title} is no longer available.`);
      }

      if (item.quantity > product.stock) {
        throw new Error(`Only ${product.stock} of ${item.title} available.`);
      }
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      args.items.map((item) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.title,
            ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

    // Add delivery as a line item if applicable
    if (args.deliveryCost > 0) {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Standard Delivery",
          },
          unit_amount: Math.round(args.deliveryCost * 100),
        },
        quantity: 1,
      });
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        items: JSON.stringify(
          args.items.map((i) => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
          }))
        ),
        deliveryMethod: args.deliveryMethod,
        deliveryCost: String(args.deliveryCost),
        ...(args.sessionId ? { cartSessionId: args.sessionId } : {}),
      },
    };

    // Only collect shipping address for standard delivery
    if (args.deliveryMethod === "standard") {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ["GB"],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return { url: session.url };
  },
});
