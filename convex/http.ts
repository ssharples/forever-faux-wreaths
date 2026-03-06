import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const http = httpRouter();

async function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts = signature.split(",");
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const sigPart = parts.find((p) => p.startsWith("v1="));

  if (!timestampPart || !sigPart) return false;

  const timestamp = timestampPart.slice(2);
  const expectedSig = sigPart.slice(3);

  // Check timestamp tolerance (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;

  const payload = `${timestamp}.${body}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  const computedSig = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computedSig === expectedSig;
}

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const isValid = await verifyStripeSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error("Webhook signature verification failed");
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const items = JSON.parse(metadata.items || "[]");
      const deliveryMethod = (metadata.deliveryMethod || "standard") as
        | "standard"
        | "collection";
      const deliveryCost = parseFloat(metadata.deliveryCost || "0");

      const shippingDetails = session.shipping_details;
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

      await ctx.runMutation(internal.orders.createFromStripe, {
        stripeSessionId: session.id,
        customerName:
          shippingDetails?.name ||
          session.customer_details?.name ||
          "Customer",
        customerEmail: session.customer_details?.email || "",
        shippingAddress,
        deliveryMethod,
        items: items.map(
          (item: {
            productId: string;
            title: string;
            price: number;
            quantity: number;
          }) => ({
            productId: item.productId as Id<"products">,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })
        ),
        subtotal,
        deliveryCost,
        total: (session.amount_total || 0) / 100,
        sessionId: metadata.cartSessionId || undefined,
      });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;
