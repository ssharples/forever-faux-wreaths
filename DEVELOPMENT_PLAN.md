# Forever Faux Wreaths - Development Plan

## Project Overview
A Next.js 16 e-commerce site for handmade faux wreaths, using Convex for the backend.

**Current State:** Frontend largely complete, admin UI scaffolded with placeholder data, no payment integration or admin authentication.

---

## Phase 1: Admin Backend - Connect to Real Data 🔴 Priority
*Estimated: 2-3 days*

### 1.1 Admin Authentication
- [ ] Implement simple admin auth (password-protected or email link)
- [ ] Create `/admin/login` page
- [ ] Add middleware to protect `/admin/*` routes
- [ ] Store admin users in Convex `users` table with `role: "admin"`

### 1.2 Products Management (Connect to Convex)
- [ ] **`/admin/products`** - Replace placeholder data with `useQuery(api.products.list)`
- [ ] **`/admin/products/new`** - Create new product form
  - Image upload (multi-image with drag & drop)
  - All fields: title, slug (auto-generate), price, description, size, colours, style, suitableFor, stock, category, featured, sizeCategory, status
- [ ] **`/admin/products/[id]`** - Edit existing product
- [ ] Bulk actions: archive, delete, set featured
- [ ] Product image management (reorder, delete, add)

### 1.3 Orders Management
- [ ] **`/admin/orders`** - List all orders from Convex
- [ ] Order detail view with all customer/shipping info
- [ ] Update order status (pending → processing → dispatched → delivered)
- [ ] Add tracking number
- [ ] Order filtering by status, date range

### 1.4 Bespoke Enquiries (Connect to Convex)
- [ ] Connect enquiries page to `useQuery(api.bespokeEnquiries.list)`
- [ ] View enquiry details with inspiration images
- [ ] Update status workflow: new → in-discussion → quoted → accepted → in-progress → complete
- [ ] Add internal notes
- [ ] Send quote (record quote amount in Convex)

### 1.5 Dashboard Stats
- [ ] Real revenue calculation from orders
- [ ] Order count by status
- [ ] Active product count
- [ ] New enquiries count
- [ ] Recent orders list (real data)
- [ ] Recent enquiries list (real data)

### 1.6 Gallery Management
- [ ] **`/admin/gallery`** - List gallery images from Convex
- [ ] Upload new images
- [ ] Reorder images (drag & drop)
- [ ] Set visibility, title, category
- [ ] Delete images

### 1.7 Site Settings
- [ ] **`/admin/settings`** - Manage:
  - Delivery costs (small/large items)
  - Contact info
  - Social media links
  - Business hours
  - Featured product selection

---

## Phase 2: Payment Integration 🔴 Priority
*Estimated: 2-3 days*

### 2.1 Checkout Flow
- [ ] Create `/checkout` page
  - Customer details form (name, email, phone)
  - Shipping address form (with UK postcode lookup optional)
  - Delivery method selection
  - Order summary
  - Payment method selection (PayPal / SumUp)

### 2.2 PayPal Integration
- [ ] Install `@paypal/react-paypal-js`
- [ ] Set up PayPal sandbox/production credentials
- [ ] Implement PayPal Smart Payment Buttons
- [ ] Handle payment success → create order in Convex
- [ ] Handle payment failure → show error

### 2.3 SumUp Integration
- [ ] Research SumUp online payments (SumUp Checkouts API)
- [ ] Implement redirect-based or embedded payment
- [ ] Handle webhooks for payment confirmation
- [ ] Create order on success

### 2.4 Order Confirmation
- [ ] **`/order-confirmation/[orderNumber]`** - Success page
  - Display order number
  - Order summary
  - Estimated delivery
- [ ] Email confirmation (optional - use Resend/SendGrid)

### 2.5 Cart Persistence
- [ ] Connect cart to Convex `cart` table
- [ ] Use session ID for guest carts
- [ ] Sync cart on checkout

---

## Phase 3: Special Offers & Discounts
*Estimated: 1 day*

### 3.1 Schema Updates
- [ ] Add `offers` table to Convex schema:
  ```ts
  offers: defineTable({
    name: v.string(),
    code: v.optional(v.string()),  // discount code
    discountType: v.union(v.literal("percentage"), v.literal("fixed")),
    discountValue: v.number(),
    productIds: v.optional(v.array(v.id("products"))),  // specific products
    categoryIds: v.optional(v.array(v.id("categories"))),  // specific categories
    minOrderValue: v.optional(v.number()),
    startDate: v.number(),
    endDate: v.number(),
    active: v.boolean(),
  })
  ```

### 3.2 Admin Offers Management
- [ ] **`/admin/offers`** - List/create/edit offers
- [ ] Apply offer to products/categories
- [ ] Discount codes

### 3.3 Frontend Integration
- [ ] Show sale prices on products
- [ ] "SALE" badge on discounted items
- [ ] Discount code input at checkout
- [ ] Calculate discounts in cart/checkout

---

## Phase 4: Customer Features (Optional)
*Estimated: 2 days*

### 4.1 Customer Accounts
- [ ] Email-based auth (magic links)
- [ ] Order history page
- [ ] Saved addresses
- [ ] Wishlist

### 4.2 Reviews
- [ ] Connect reviews page to Convex
- [ ] Submit review form (post-purchase)
- [ ] Admin review moderation

---

## Phase 5: Email Notifications
*Estimated: 1 day*

- [ ] Order confirmation email to customer
- [ ] New order notification to admin
- [ ] Dispatch notification with tracking
- [ ] New bespoke enquiry notification to admin
- [ ] Quote sent notification to customer

**Suggested Provider:** Resend (simple, free tier)

---

## Technical Debt / Polish

- [ ] Error boundaries for all pages
- [ ] Loading states for all data fetching
- [ ] SEO metadata for all pages
- [ ] Sitemap generation
- [ ] Performance audit (images, bundle size)
- [ ] Accessibility audit
- [ ] Mobile testing on real devices

---

## Environment Variables Needed

```env
# Existing
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Payment - PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Payment - SumUp
SUMUP_API_KEY=
SUMUP_MERCHANT_CODE=

# Email (optional)
RESEND_API_KEY=

# Admin Auth
ADMIN_SECRET_KEY=  # For simple auth, or use Clerk/Auth0
```

---

## Recommended Order of Work

1. **Week 1: Admin Backend**
   - Day 1-2: Products CRUD (connect to Convex, add/edit forms)
   - Day 2-3: Orders & Enquiries connected to real data
   - Day 3: Dashboard stats, Gallery management

2. **Week 2: Payments & Checkout**
   - Day 1: Checkout page + cart persistence
   - Day 2: PayPal integration
   - Day 3: SumUp integration + order confirmation

3. **Week 3: Polish & Launch**
   - Offers/discounts
   - Email notifications
   - Testing & bug fixes
   - Deploy to production

---

## Files Structure (New/Modified)

```
app/
├── admin/
│   ├── login/page.tsx           # NEW
│   ├── products/
│   │   ├── new/page.tsx         # NEW
│   │   └── [id]/page.tsx        # NEW
│   ├── orders/page.tsx          # UPDATE (connect to Convex)
│   ├── offers/page.tsx          # NEW
│   └── settings/page.tsx        # UPDATE
├── checkout/page.tsx            # NEW
├── order-confirmation/
│   └── [orderNumber]/page.tsx   # NEW
└── api/
    ├── paypal/
    │   └── create-order/route.ts  # NEW
    └── sumup/
        └── webhook/route.ts       # NEW

convex/
├── schema.ts                    # UPDATE (add offers table)
├── offers.ts                    # NEW
└── auth.ts                      # NEW (admin auth helpers)

components/
├── admin/
│   ├── ProductForm.tsx          # NEW
│   ├── ImageUpload.tsx          # NEW
│   └── OrderStatusBadge.tsx     # NEW
└── checkout/
    ├── CustomerForm.tsx         # NEW
    ├── PayPalButton.tsx         # NEW
    └── SumUpCheckout.tsx        # NEW
```

---

## Questions for Client

1. **PayPal Account:** Do they have a PayPal Business account ready?
2. **SumUp Account:** Do they have a SumUp merchant account?
3. **Email:** Preferred email for order notifications?
4. **Domain:** Is foreverfauxwreaths.co.uk ready for production?
5. **Delivery Zones:** UK only, or international shipping?
6. **Admin Users:** Who needs admin access? (for auth setup)

---

*Plan created: 2026-01-28*
*Repo: ssharples/forever-faux-wreaths*
