# PROGRESS — SavvyPro-equivalent rebuild (lena/)

Target: rebuild the SavvyPro-equivalent platform from scratch at
`web/clone/savvypro/lena/`, with functional parity + structural fidelity to the
reference at `web/clone/savvypro/_reference/`. Brand identity stays original
(content/*.json + Tailwind theme). Stack: Next.js 15 App Router + TypeScript,
Tailwind CSS v4, Radix UI primitives, Firebase Auth + Firestore, Turso/libSQL,
Cloudinary, Nodemailer + React Email, Stripe test mode.

## Evidence (Phase 0) — verified
- `_reference/` exists at `web/clone/savvypro/_reference/` and is read-only (chmod a-w).
- `site/`: 301 files (58M) — 193 HTML, 92 JS, 5 CSS, 11 images/fonts.
- `sitemap.xml`: 181 URLs. SPECIFICATION.md, ASSETS.md, CAPTURE-NOTES.md, homepage_copy.txt present.
- Missing: `capture\` dir, `pages\*.md` (HTML equivalents used). Re-download not feasible (WAF); backend not capturable (EzyCourse SaaS).

## Milestone status
- [x] M0 Setup & evidence — Phase 0 complete
- [x] Phase 1 analysis docs — COVERAGE.md (all 181 URLs mapped), FEATURES.md, API-CONTRACT.md, DATA-MODEL.md, UI-SPEC/TOKENS.md + 17 template specs, GAPS.md — committed
- [x] Phase 2 Plan — PLAN.md (stack, DATA-ARCHITECTURE.md, milestone order, folder structure) — go-ahead given
- [x] M1 Foundation — Tailwind v4 theme from TOKENS.md, component library (Button/Input/Card/Badge/Alert/Modal/Tabs/Accordion/Carousel/Toast) with cva+clsx, layout shell, SEO metadata, ESLint @mui/@emotion ban rule — build passes
- [ ] M2 Auth — Firebase Auth, httpOnly session cookies, email verification, password reset, middleware protection, roles, account settings
- [ ] M3 Data — Turso migrations, Firestore rules (emulator-tested), seed from content
- [ ] M4 Public pages — home, path landings, catalog, course detail, programs, books, blog, legal, about, contact, testimonials; generateStaticParams for all 181 URLs
- [ ] M5 Commerce — Stripe test-mode adapter, webhook signature + idempotency, order states, receipts, enrollment after confirmed payment, memberships + gating
- [ ] M6 Learning — dashboard, lesson player, per-lesson progress, resume, completion, certificates
- [ ] M7 Engagement — community, coaching/appointments + webinars, lead magnets/forms, AI assistant (mock provider, streaming, limits)
- [ ] M8 Admin — manage courses, lessons, posts, books, users, orders, memberships, settings
- [ ] M9 Hardening — rate limiting, auth guard on every API route, CSP/security headers, validation everywhere, .env.example
- [ ] Phase 4 Verification — tsc/lint/build, tests, Playwright journeys, sitemap crawler, layout comparison, Axe/Lighthouse, brand grep
- [ ] Phase 5 Deliver — feature table, README, production checklist

## Current step
M2 Auth: Firebase Auth client + admin SDK, server-verified httpOnly session cookie routes, email verification, password reset, middleware route protection, roles, account settings pages.
