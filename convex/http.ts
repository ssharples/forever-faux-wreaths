import Stripe from "stripe";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/.well-known/openid-configuration",
  method: "GET",
  handler: httpAction(async () => {
    const issuer = process.env.CONVEX_SITE_URL;

    if (!issuer) {
      return new Response("CONVEX_SITE_URL not configured", { status: 500 });
    }

    return new Response(
      JSON.stringify({
        issuer,
        jwks_uri: `${issuer}/.well-known/jwks.json`,
        authorization_endpoint: `${issuer}/oauth/authorize`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
        },
      }
    );
  }),
});

http.route({
  path: "/.well-known/jwks.json",
  method: "GET",
  handler: httpAction(async () => {
    const jwks = process.env.JWKS;

    if (!jwks) {
      return new Response("JWKS not configured", { status: 500 });
    }

    return new Response(jwks, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
      },
    });
  }),
});

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Stripe webhook environment variables are not configured");
      return new Response("Webhook configuration missing", { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("Webhook signature verification failed", error);
      return new Response("Invalid signature", { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
      return new Response("OK", { status: 200 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const shouldProcess = await ctx.runMutation(internal.stripe.beginWebhookProcessing, {
      eventId: event.id,
      eventType: event.type,
      stripeSessionId: session.id,
    });

    if (!shouldProcess) {
      return new Response("OK", { status: 200 });
    }

    try {
      const metadata = session.metadata || {};
      const items = JSON.parse(metadata.items || "[]");
      const deliveryMethod = (metadata.deliveryMethod || "standard") as
        | "standard"
        | "collection";
      const deliveryCost = parseFloat(metadata.deliveryCost || "0");

      const shippingDetails = session.collected_information?.shipping_details;
      const shippingAddress = shippingDetails?.address
        ? {
            line1: shippingDetails.address.line1 || "",
            line2: shippingDetails.address.line2 || undefined,
            city: shippingDetails.address.city || "",
            county: shippingDetails.address.state || undefined,
            postcode: shippingDetails.address.postal_code || "",
            country: shippingDetails.address.country || "GB",
          }
        : {
            line1: "Collection",
            city: "Preston",
            postcode: "",
            country: "GB",
          };

      const subtotal = (session.amount_total || 0) / 100 - deliveryCost;

      const orderResult = await ctx.runMutation(internal.orders.createFromStripe, {
        stripeSessionId: session.id,
        customerName:
          shippingDetails?.name || session.customer_details?.name || "Customer",
        customerEmail: session.customer_details?.email || "",
        shippingAddress,
        deliveryMethod,
        items: items.map(
          (item: {
            productId: string;
            title: string;
            price: number;
            quantity: number;
            imageId?: string;
          }) => ({
            productId: item.productId as Id<"products">,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            imageId: item.imageId as Id<"_storage"> | undefined,
          })
        ),
        subtotal,
        deliveryCost,
        total: (session.amount_total || 0) / 100,
        sessionId: metadata.cartSessionId || undefined,
      });

      await ctx.runAction(internal.emails.sendOrderConfirmation, {
        orderId: orderResult.orderId,
      });

      await ctx.runAction(internal.emails.sendAdminNotification, {
        subject: `New order received – ${orderResult.orderNumber}`,
        htmlBody: `
          <p>A new order (<strong>${orderResult.orderNumber}</strong>) has been placed by ${session.customer_details?.email || "Customer"}.</p>
          <p><strong>Total:</strong> £${((session.amount_total || 0) / 100).toFixed(2)}</p>
        `,
        notificationType: "notifyNewOrders",
      });

      await ctx.runMutation(internal.stripe.completeWebhookProcessing, {
        eventId: event.id,
      });

      return new Response("OK", { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown webhook processing error";
      await ctx.runMutation(internal.stripe.failWebhookProcessing, {
        eventId: event.id,
        error: message,
      });
      console.error("Failed to process Stripe webhook", error);
      return new Response("Webhook processing failed", { status: 500 });
    }
  }),
});

export default http;
