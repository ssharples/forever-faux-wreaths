# AGENTS.md

## Project overview
- Customer-facing ecommerce site for Forever Faux Wreaths.
- Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Convex backend, Stripe checkout.
- Main user flows: browse products, manage cart, submit bespoke enquiries, view gallery/reviews, complete Stripe checkout, manage inventory/content in `/admin`.

## Package manager and commands
- Prefer `pnpm` because `pnpm-lock.yaml` is present. Do not introduce a second package manager in new instructions or scripts.
- Common commands:
  - `pnpm dev` to run the Next.js app locally
  - `pnpm lint` to run ESLint
  - `pnpm build` to verify the production build
  - `pnpm seed` to seed categories/products into Convex storage and database
- If Convex functions or schema change, use the Convex CLI already referenced in the repo (`npx convex ...`) rather than inventing custom wrappers.

## Environment and integrations
- Env vars are documented in `.env.example`.
- Current code depends on:
  - `NEXT_PUBLIC_CONVEX_URL`
  - `CONVEX_DEPLOYMENT`
  - `NEXT_PUBLIC_SITE_URL` for sitemap/robots canonical URLs
  - `SITE_URL` for Stripe checkout redirects
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- `scripts/seed-products.ts` loads `.env.local` directly and fails fast if `NEXT_PUBLIC_CONVEX_URL` is missing.

## Repo structure
- `app/`: App Router pages and layouts for storefront, checkout, legal pages, and admin.
- `components/`: shared UI, storefront sections, admin UI, and forms.
- `components/ui/`: shadcn-style primitives built on Radix.
- `convex/`: schema, queries, mutations, HTTP webhook handlers, generated API bindings.
- `lib/`: utilities, fonts, cart/session helpers.
- `public/images/`: product, gallery, and brand assets used by the storefront and seed script.
- `scripts/seed-products.ts`: seeds categories/products and uploads product images into Convex storage.

## Coding conventions
- Use TypeScript with strict typing. Do not weaken types without a concrete reason.
- Use the `@/*` import alias instead of deep relative imports when importing from the app source.
- Preserve the existing App Router structure and server/client component split. Only add `"use client"` where required.
- Reuse existing `components/ui` primitives before adding new bespoke UI elements.
- Preserve the current visual language: editorial serif display type, warm neutral palette, floral/luxury brand tone. Avoid generic SaaS-looking changes.
- Keep copy and formatting UK-oriented where relevant; the site metadata and business context are UK-specific.

## Convex guidance
- Treat `convex/_generated/*` as generated output. Do not hand-edit generated files.
- Update `convex/schema.ts` and the corresponding functions together when data model changes are required.
- Check for downstream usage in both storefront and admin pages before renaming schema fields.
- Stripe webhook handling lives in `convex/http.ts`; checkout/session creation logic lives in `convex/stripe.ts`.

## Data and content guidance
- Product images are stored in `public/images/products` and uploaded to Convex storage by the seed script.
- Seed data is idempotent in intent: the script checks for existing categories/products before creating new records. Preserve that behavior if you modify it.
- Admin routes assume operational data exists for products, orders, enquiries, gallery images, settings, and users. Avoid schema or UI changes that silently break empty-state handling.

## Agent workflow expectations
- Before substantial edits, inspect the relevant route, component, and any connected Convex functions instead of changing only one side.
- After code changes, run the narrowest useful validation first, then broader validation if warranted.
- Prefer small, surgical edits that match the existing patterns in this repo.
- If a task affects checkout, admin data, or Convex schema, call that out explicitly in your final summary and note what was or was not verified.
