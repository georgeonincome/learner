# PROGRESS — SavvyPro-equivalent rebuild (lena/)

Target: rebuild the SavvyPro-equivalent platform from scratch at
`web/clone/savvypro/lena/`, with functional parity + structural fidelity to the
reference at `web/clone/savvypro/_reference/`. Brand identity stays original
(content/*.json + Tailwind theme). Stack: Next.js 15 App Router + TypeScript,
Tailwind CSS v4, Radix UI primitives, Firebase Auth + Firestore, Turso/libSQL,
Cloudinary, Nodemailer + React Email, Stripe test mode.

## Evidence (Phase 0) — verified
- `_reference/` exists at `web/clone/savvypro/_reference/` and is now read-only (chmod a-w).
- `site/`: 301 files (58M) — 193 captured HTML pages, 92 real JS chunks, 5 CSS files, images + fonts.
- `sitemap.xml`: 181 URLs.
- `SPECIFICATION.md`, `ASSETS.md`, `CAPTURE-NOTES.md`, `homepage_copy.txt`: present.
- `capture\` directory: MISSING from reference.
- `pages\*.md`: MISSING from reference (SPECIFICATION references ~50 captured markdown pages; HTML equivalents exist in `site/`).
- Re-download of savvypro.org: NOT feasible — WAF (Cloudflare/OpenResty) blocks subsequent requests; backend is hosted EzyCourse SaaS, not capturable.

## Milestone status
- [x] M0 Setup & evidence — Phase 0 complete: _reference verified (read-only), lena/ initialized, git repo created, PROGRESS.md + GAPS.md written, file counts/sizes reported.
- [ ] M1 Foundation (Tailwind theme from TOKENS.md, component library, layout shell, SEO helpers, ESLint @mui/@emotion rule)
- [ ] M2 Auth (Firebase Auth, httpOnly session cookies, email verification, password reset, middleware protection, roles, account settings)
- [ ] M3 Data (Turso migrations, Firestore rules + emulator tests, seed from content)
- [ ] M4 Public pages (home, path landings, catalog, course detail, mini-courses/programs, books, blog, legal, about, contact, testimonials; generateStaticParams for all 181 URLs)
- [ ] M5 Commerce (Stripe test mode adapter, webhook signature verification, idempotency, order states, receipts, enrollment after confirmed payment, memberships + gating)
- [ ] M6 Learning (dashboard, lesson player, per-lesson progress, resume, completion, certificates)
- [ ] M7 Engagement (community, coaching/appointments + webinars, lead magnets/forms, AI assistant mock provider + streaming + limits)
- [ ] M8 Admin (courses, lessons, posts, books, users, orders, memberships, settings)
- [ ] M9 Hardening (rate limiting, auth guard on every API route, CSP/security headers, validation everywhere, .env.example)
- [ ] Phase 4 Verification (tsc/lint/build, tests, Playwright journeys, sitemap crawler, layout comparison, Axe/Lighthouse, brand grep)
- [ ] Phase 5 Deliver (feature table, README, production checklist)

## Current step
Phase 1 analysis documents: COVERAGE.md, FEATURES.md, API-CONTRACT.md, DATA-MODEL.md, UI-SPEC/TOKENS.md + per-template specs, GAPS.md.

## Next action
Draft COVERAGE.md mapping all 181 sitemap URLs to template + content entry + auth requirement.
