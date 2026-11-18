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
- [x] M2 Auth — Firebase Auth, httpOnly session cookies, email verification, password reset, middleware protection, roles, account settings — build passes
- [x] M3 Data — Turso schema.sql, @libsql/client wrapper, Firestore rules, Firestore server lib, seed script — build passes
- [x] M4 Public pages — path landings (6), all-products catalog, blog (list/post/category with generateStaticParams), legal pages (contact, about, testimonials, ccs-testimonials, terms, privacy, refund, appointment), blog.json content — build passes
- [x] M5 Commerce — Stripe test-mode checkout, webhook signature + idempotency, order states, enrollment after confirmed payment, memberships + gating — build passes
- [x] M6 Learning — dashboard, course page, lesson player, per-lesson progress API (upsert), client "Mark complete", certificates page + SVG download endpoint — build passes
- [x] M7 Engagement — community (groups/posts/comments/likes APIs + feed UI matching reference), coaching/appointments + webinars (with .ics), lead magnets/forms, AI assistant (mock streaming provider, per-user limits) — build passes
- [x] M8 Admin — role-guarded admin area: overview, courses CRUD, lessons, blog posts CRUD, books, users, orders, memberships, settings — build passes
- [x] M9 Hardening — zod validation on all mutating APIs, in-memory rate limiting (session/checkout/progress/community/appointments/webinars/leads/forms/AI), security headers, SECURITY.md, GAPS.md updated — build passes
- [x] Phase 4 Verification — tsc, ESLint, 11 Vitest tests, production build, brand scan PASS, route coverage 181/181 — all green
- [x] Phase 5 Deliver — README with feature table, PRODUCTION-CHECKLIST.md, BRAND-AUDIT.md, GAPS.md, SECURITY.md

## Verification-gap closure (user request, 2026-11-19)

### Step 1 — Browser tooling — DONE
- `npx playwright install --with-deps chromium` FAILED: `sudo: A terminal is
  required to authenticate` (running as uid 1000 without passwordless sudo).
- `npx playwright install chromium` SUCCEEDED (exit 0); browsers present in
  `~/.cache/ms-playwright/chromium-1255` and `chromium_headless_shell-1255`.
- Smoke test: `chromium.launch({headless:true})` + `page.setContent('<h1>hello</h1>')`
  returned `LAUNCH OK: hello`. Browser is usable; no extra system deps needed.
- On a machine where `--with-deps` is required, run it from an interactive
  terminal with sudo access.

Remaining steps: layout comparison, sitemap crawl, E2E/integration tests +
axe/Lighthouse, GAPS.md completion, final report.
