"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const MAX_CHECKOUT_QUANTITY_PER_PRODUCT = 10;

export const createCheckoutSession = action({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      })
    ),
    deliveryMethod: v.union(v.literal("standard"), v.literal("collection")),
    deliveryCost: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!Number.isFinite(args.deliveryCost) || args.deliveryCost < 0) {
      throw new Error("Delivery cost is invalid.");
    }

    const settings = await ctx.runQuery(api.siteSettings.getStorefront, {});
    if (settings.holidayMode) {
      throw new Error("Orders are temporarily paused while holiday mode is enabled.");
    }

    const deliveryPrices = settings.deliveryPrices ?? {
      small: 4.99,
      large: 7.99,
      collection: 0,
    };

    const aggregatedItems = Array.from(
      args.items.reduce((items, item) => {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error("Each checkout item must have a quantity of at least 1.");
        }
        items.set(
          item.productId,
          (items.get(item.productId) ?? 0) + item.quantity
        );
        return items;
      }, new Map<Id<"products">, number>())
        .entries()
    ).map(([productId, quantity]) => {
      if (quantity > MAX_CHECKOUT_QUANTITY_PER_PRODUCT) {
        throw new Error(
          `Please enquire for quantities above ${MAX_CHECKOUT_QUANTITY_PER_PRODUCT}.`
        );
      }
      return { productId, quantity };
    });

    const productDetails = await Promise.all(
      aggregatedItems.map(async (item) => {
        const product = await ctx.runQuery(api.products.getById, {
          id: item.productId,
        });

        if (!product || product.status !== "active") {
          throw new Error("One or more wreaths are no longer available.");
        }

        return {
          product,
          quantity: item.quantity,
        };
      })
    );

    if (productDetails.length === 0) {
      throw new Error("Your cart is empty.");
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured.");
    }
    if (!process.env.SITE_URL) {
      throw new Error("SITE_URL is not configured.");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    const siteUrl = process.env.SITE_URL;

    const usesLargeDelivery = productDetails.some(
      ({ product }) => product.sizeCategory === "large"
    );
    const expectedDeliveryCost =
      args.deliveryMethod === "collection"
        ? deliveryPrices.collection ?? 0
        : usesLargeDelivery
          ? deliveryPrices.large ?? 7.99
          : deliveryPrices.small ?? 4.99;

    if (Math.abs(args.deliveryCost - expectedDeliveryCost) > 0.001) {
      throw new Error("Delivery cost no longer matches current store settings.");
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = productDetails.map(
      ({ product, quantity }) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.title,
            ...(product.imageUrls[0] ? { images: [product.imageUrls[0]] } : {}),
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      })
    );

    if (args.deliveryCost > 0) {
      lineItems.push({
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
      payment_method_types: ["card", "paypal", "klarna"],
      line_items: lineItems,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        items: JSON.stringify(
          productDetails.map(({ product, quantity }) => ({
            productId: product._id,
            title: product.title,
            price: product.price,
            quantity,
            imageId: product.images[0],
          }))
        ),
        deliveryMethod: args.deliveryMethod,
        deliveryCost: String(args.deliveryCost),
        ...(args.sessionId ? { cartSessionId: args.sessionId } : {}),
      },
    };

    if (args.deliveryMethod === "standard") {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ["GB"],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return { url: session.url };
  },
});
