## Forever Faux Wreaths

Customer-facing ecommerce site built with Next.js App Router, TypeScript, Tailwind CSS, Convex, Stripe Checkout, and Resend.

## Local Development

Install dependencies with `pnpm`, then run the app:

```bash
pnpm install
pnpm dev
```

Other useful commands:

```bash
pnpm lint
pnpm build
pnpm seed
```

## Environment

Copy `.env.example` to `.env.local` and provide:

- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_SITE_URL`
- `SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

## Integrations

- Convex powers application data, admin operations, and the Stripe webhook backend.
- Stripe Checkout handles customer payments.
- Resend sends order, admin, and bespoke enquiry emails.

## Deployment

Deploy with Vercel. Ensure both `Preview` and `Production` environments include the required Convex, Stripe, Resend, and site URL variables.

If Convex schema or functions change, deploy them with the Convex CLI referenced in the repo.
