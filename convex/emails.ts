"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "resend";
import { internal } from "./_generated/api";

const adminEmailFallback = "info@foreverfauxwreaths.co.uk";
const storeNameFallback = "Forever Faux Wreaths";

type NotificationType =
  | "notifyNewOrders"
  | "notifyBespokeEnquiries"
  | "notifyContactMessages"
  | "notifyNewsletterSignups"
  | "notifyMemorialRetailWaitlist"
  | "notifyMemorialWholesaleInterest";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  return new Resend(process.env.RESEND_API_KEY);
}

async function getEmailContext(ctx: unknown) {
  const { runQuery } = ctx as {
    runQuery: (query: unknown, args: Record<string, never>) => Promise<unknown>;
  };

  const settings = (await runQuery(
    internal.siteSettings.getAllInternal,
    {}
  )) as Record<string, unknown>;
  return {
    settings,
    storeName: (settings.storeName as string | undefined) || storeNameFallback,
    fromEmail: process.env.RESEND_FROM_EMAIL!,
    adminEmail:
      ((settings.contactEmail as string | undefined) || adminEmailFallback).toLowerCase(),
  };
}

function renderEmailLayout(title: string, intro: string, content: string, storeName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #3f3a37;">
      <div style="border: 1px solid #e8dfd4; border-radius: 16px; overflow: hidden; background: #fffdf9;">
        <div style="padding: 24px; background: #c8d6c1; color: #ffffff;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">${storeName}</p>
          <h1 style="margin: 8px 0 0; font-size: 28px; font-weight: 600;">${title}</h1>
        </div>
        <div style="padding: 24px;">
          <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">${intro}</p>
          <div style="font-size: 15px; line-height: 1.7;">${content}</div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPlainTextMessage(value: string) {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, "<br />"))
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function renderOrderRows(
  items: Array<{ title: string; price: number; quantity: number }>
) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #efe7dc;">${escapeHtml(item.title)} × ${item.quantity}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #efe7dc; text-align: right;">£${item.price.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  const resend = getResendClient();
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
  });
}

export const sendOrderConfirmation = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(internal.orders.getByIdInternal, { id: args.orderId });
    if (!order) {
      throw new Error(`Order not found: ${args.orderId}`);
    }

    const { storeName } = await getEmailContext(ctx);
    const addressHtml =
      order.deliveryMethod === "collection"
        ? "<p><strong>Collection:</strong> We will email collection details shortly.</p>"
        : `<p><strong>Delivery address:</strong><br />${escapeHtml(order.shippingAddress.line1)}<br />${
            order.shippingAddress.line2 ? `${escapeHtml(order.shippingAddress.line2)}<br />` : ""
          }${escapeHtml(order.shippingAddress.city)}<br />${escapeHtml(order.shippingAddress.postcode)}</p>`;

    const html = renderEmailLayout(
      "Order confirmation",
      `Dear ${escapeHtml(order.customerName)}, thank you for your order. Your order number is <strong>${escapeHtml(order.orderNumber)}</strong>.`,
      `
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0 24px;">
          ${renderOrderRows(order.items)}
          <tr>
            <td style="padding: 12px 0 0; text-align: right;"><strong>Delivery</strong></td>
            <td style="padding: 12px 0 0; text-align: right;"><strong>£${order.deliveryCost.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0 0; text-align: right;"><strong>Total</strong></td>
            <td style="padding: 8px 0 0; text-align: right;"><strong>£${order.total.toFixed(2)}</strong></td>
          </tr>
        </table>
        ${addressHtml}
        <p>Each wreath is made to order. Please allow 1-2 weeks for making and careful preparation before delivery or collection.</p>
        <p>We’ll be in touch if we need anything further.</p>
      `,
      storeName
    );

    await sendEmail({
      to: [order.customerEmail],
      subject: `Order confirmation – ${order.orderNumber}`,
      html,
    });
  },
});

export const sendDeliveryStatusUpdate = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(internal.orders.getByIdInternal, { id: args.orderId });
    if (!order) {
      throw new Error(`Order not found: ${args.orderId}`);
    }

    const statusCopy: Record<string, string> = {
      shipped: "has been shipped and is on the way.",
      completed: "has been completed.",
      issue: "needs a quick update from us.",
      dispatched: "has been dispatched and is on the way.",
      delivered: "has been marked as delivered.",
      collected: "has been marked as collected.",
    };

    if (!statusCopy[order.status]) return;

    const { storeName } = await getEmailContext(ctx);
    const trackingHtml = order.trackingNumber
      ? `<p><strong>Tracking number:</strong> ${escapeHtml(order.trackingNumber)}</p>`
      : "";

    const html = renderEmailLayout(
      "Order update",
      `Dear ${escapeHtml(order.customerName)}, your order <strong>${escapeHtml(order.orderNumber)}</strong> ${statusCopy[order.status]}`,
      `${trackingHtml}<p>Thank you again for shopping with ${storeName}.</p>`,
      storeName
    );

    await sendEmail({
      to: [order.customerEmail],
      subject: `Order update – ${order.orderNumber}`,
      html,
    });
  },
});

export const sendOrderCustomerMessage = internalAction({
  args: { communicationId: v.id("orderCommunications") },
  handler: async (ctx, args) => {
    const communication = await ctx.runQuery(
      internal.orders.getCommunicationByIdInternal,
      { id: args.communicationId }
    );
    if (!communication) {
      throw new Error(`Order communication not found: ${args.communicationId}`);
    }

    const order = await ctx.runQuery(internal.orders.getByIdInternal, {
      id: communication.orderId,
    });
    if (!order) {
      throw new Error(`Order not found: ${communication.orderId}`);
    }

    const { storeName } = await getEmailContext(ctx);
    const html = renderEmailLayout(
      escapeHtml(communication.subject),
      `Dear ${escapeHtml(order.customerName)},`,
      `
        <p><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
        ${renderPlainTextMessage(communication.message)}
      `,
      storeName
    );

    try {
      await sendEmail({
        to: [communication.recipientEmail],
        subject: communication.subject,
        html,
      });
      await ctx.runMutation(internal.orders.markCommunicationSentInternal, {
        id: args.communicationId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send customer email";
      await ctx.runMutation(internal.orders.markCommunicationFailedInternal, {
        id: args.communicationId,
        error: message,
      });
      throw error;
    }
  },
});

export const sendBespokeEnquiryAcknowledgement = internalAction({
  args: { enquiryId: v.id("bespokeEnquiries") },
  handler: async (ctx, args) => {
    const enquiry = await ctx.runQuery(internal.bespokeEnquiries.getByIdInternal, {
      id: args.enquiryId,
    });
    if (!enquiry) {
      throw new Error(`Enquiry not found: ${args.enquiryId}`);
    }

    const { storeName } = await getEmailContext(ctx);
    const html = renderEmailLayout(
      "Bespoke enquiry received",
      `Dear ${escapeHtml(enquiry.name)}, thank you for your bespoke enquiry.`,
      `<p>We’ve received your request for a ${escapeHtml(enquiry.arrangementType)} and will reply within 24–48 hours.</p>
       <p><strong>Chosen size:</strong> ${escapeHtml(enquiry.size)}${enquiry.customSize ? ` (${escapeHtml(enquiry.customSize)})` : ""}</p>
       <p><strong>Colour theme:</strong> ${escapeHtml(enquiry.colourTheme)}${enquiry.customColour ? ` – ${escapeHtml(enquiry.customColour)}` : ""}</p>`,
      storeName
    );

    await sendEmail({
      to: [enquiry.email],
      subject: "We’ve received your bespoke enquiry",
      html,
    });
  },
});

export const sendAdminNotification = internalAction({
  args: {
    subject: v.string(),
    htmlBody: v.string(),
    notificationType: v.union(
      v.literal("notifyNewOrders"),
      v.literal("notifyBespokeEnquiries"),
      v.literal("notifyContactMessages"),
      v.literal("notifyNewsletterSignups"),
      v.literal("notifyMemorialRetailWaitlist"),
      v.literal("notifyMemorialWholesaleInterest")
    ),
  },
  handler: async (ctx, args) => {
    const { settings, storeName, adminEmail } = await getEmailContext(ctx);
    const notificationType = args.notificationType as NotificationType;
    const adminUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://foreverfauxwreaths.co.uk";

    if (settings[notificationType] === false) {
      return;
    }

    const html = renderEmailLayout(
      args.subject,
      "This is an automated admin notification.",
      `${args.htmlBody}<p style="margin-top: 24px;"><a href="${adminUrl}/admin" style="color: #6c8a66;">Open admin</a></p>`,
      storeName
    );

    await sendEmail({
      to: [adminEmail],
      subject: `[Admin] ${args.subject}`,
      html,
    });
  },
});
