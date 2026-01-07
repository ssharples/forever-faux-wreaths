import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
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
    stock: v.number(),
    categoryId: v.id("categories"),
    featured: v.boolean(),
    sizeCategory: v.union(v.literal("small"), v.literal("large")),
    status: v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("sold-out")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"])
    .index("by_category", ["categoryId"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  orders: defineTable({
    orderNumber: v.string(),
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
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("dispatched"),
      v.literal("delivered"),
      v.literal("collected")
    ),
    trackingNumber: v.optional(v.string()),
    paymentMethod: v.union(v.literal("paypal"), v.literal("sumup")),
    paymentId: v.string(),
    createdAt: v.number(),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  bespokeEnquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    arrangementType: v.string(),
    colourTheme: v.string(),
    customColour: v.optional(v.string()),
    ribbon: v.boolean(),
    ribbonColour: v.optional(v.string()),
    wreathBase: v.string(),
    size: v.string(),
    customSize: v.optional(v.string()),
    occasion: v.string(),
    inspirationImages: v.array(v.id("_storage")),
    notes: v.optional(v.string()),
    estimatedPrice: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("in-discussion"),
      v.literal("quoted"),
      v.literal("accepted"),
      v.literal("in-progress"),
      v.literal("complete"),
      v.literal("cancelled")
    ),
    internalNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  reviews: defineTable({
    customerName: v.string(),
    rating: v.number(),
    text: v.string(),
    productId: v.optional(v.id("products")),
    visible: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_visible", ["visible"])
    .index("by_product", ["productId"]),

  galleryImages: defineTable({
    imageId: v.id("_storage"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    sortOrder: v.number(),
    visible: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_visible", ["visible"])
    .index("by_sortOrder", ["sortOrder"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),

  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("admin")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  cart: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      })
    ),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),
});
