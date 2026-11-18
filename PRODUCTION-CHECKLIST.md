# Production checklist

## Required before launch
- [ ] Copy `.env.example` to `.env.local` with real Firebase client + Admin credentials.
- [ ] Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`; apply `database/schema.sql`.
- [ ] Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live keys if taking payments).
- [ ] Configure the Stripe webhook endpoint to `/api/webhooks/stripe` for `checkout.session.completed` and `payment_intent.payment_failed`.
- [ ] Seed content: `npx tsx scripts/seed.ts`.
- [ ] Deploy `firestore.rules` to the Firebase project.
- [ ] Set admin/teacher custom claims on staff Firebase Auth accounts.
- [ ] Replace placeholder legal copy (terms, privacy, refund) with reviewed legal text.
- [ ] Replace placeholder email (`hello@savvypro.example`) and WhatsApp number.
- [ ] Configure Cloudinary (or remove image references) and SMTP credentials.

## Code / data review
- [ ] Replace in-memory demo stores with real services (see `GAPS.md`):
  - `src/lib/community-store.ts` → Firestore `communityGroups` hierarchy.
  - `src/lib/admin-store.ts` → Firestore content collections.
  - `src/lib/ai-provider.ts` → real LLM provider.
  - `src/lib/rate-limit.ts` → shared store (Turso/Redis) for multi-instance deployments.
  - `src/lib/session.ts` demo fallback → strict auth in production.
- [ ] Scope read APIs (`/api/orders`, `/api/enrollments`, `/api/memberships`) to the authenticated user.
- [ ] Wire Nodemailer/React Email for verification, reset, receipts and webinar/appointment confirmations.
- [ ] Add real payment success page at `/you-have-paid` reading the Stripe session.

## Verification (run all)
- [ ] `npm run type-check`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `node scripts/brand-scan.mjs` → PASS
- [ ] `node scripts/route-coverage.mjs` → 0 unmatched sitemap URLs

## Security
- [ ] Confirm CSP and HSTS headers in `next.config.js`.
- [ ] Confirm no secrets committed (`git grep` for `sk_live_`, private keys).
- [ ] Review `SECURITY.md` and `firestore.rules`.
