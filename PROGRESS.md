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

### Step 2 — Layout fidelity — DONE
- `scripts/layout-compare.mjs` measures the captured reference (`captured-browser/*.html`
  + re-injected CSSOM) against the clone at 375/768/1024/1280/1536px, ±4px.
- Result: 10/18 templates pass at 375px, 13/18 at 768, 15/18 at 1024, 15/18 at 1280,
  16/18 at 1536. Residual failures are single-section height deltas of 7–23px.
- Full table and method notes in `COMPARISON.md`.

### Step 3 — Sitemap crawl — DONE
- `scripts/sitemap-audit.mjs` visits all 181 sitemap URLs and reports status, title,
  meta description, console/page errors and the handler that serves each route.
- Output: `sitemap-audit.json` (summary + per-route rows).

### Step 4 — Tests / journeys — PARTIAL
- `npx vitest run`: 20/20 pass (validation, rate limit, ics, ai-provider, checkout
  webhook idempotency, lesson progress, auth session).
- Playwright journeys (signup → verify → browse → enroll → pay → learn → complete →
  logout) and axe/Lighthouse runs: NOT DONE. Requires configured Firebase/Turso/Stripe
  credentials and a running sandbox.

### Step 5 — GAPS.md — DONE
- Every remaining item is listed and marked `unknown from the reference` or
  `not yet built`.

### Step 6 — Final report — DONE
- See the feature → status → evidence table in the delivery summary.

## Control-wiring work (user report: "most of the buttons are not working")

Root cause: the reference renders CTAs as styled-components `<button>` elements with
minified React `onClick` closures, and wraps some in `<a href="#uuid">`. A static
capture carries neither, so every CTA was inert.

- `scripts/capture-button-targets.mjs` clicked 173 controls across 24 live reference
  pages and recorded their destinations → `src/content/button-targets.json`.
- `src/lib/button-targets.ts` resolves a control label to its destination (route-specific
  first, then a site-wide label index; same-page "navigate" targets are treated as
  in-page anchors and skipped).
- `src/components/ref/RefNode.tsx` attaches the recorded destination to `<button>` and
  to `<a>` elements whose href is missing or a `#fragment`.

## Course engine work (user report: course/book pages blank or white text)

- 22 of the 54 course-detail URLs the reference links to are absent from the sitemap, so
  they had no captured spec and rendered a blank page.
  `scripts/build-course-index.mjs` harvested all 54 from the reference's own anchors →
  `src/content/course-index.json`; `src/app/course-detail/[slug]/[id]/page.tsx` now falls
  back to `src/components/commerce/CourseDetail.tsx`.
- Functional screens (checkout, dashboard, course, lesson, book reader) used the
  off-white text tokens on a white body — white-on-white. They now sit on
  `AppSurface` (brand ink) with the site header. Measured contrast: 0 low-contrast
  elements on those screens.
- `/checkout` (was missing entirely) resolves a course or book and creates a Stripe
  session; `/dashboard` lists real enrollments and progress; the course page renders a
  real curriculum with an enrollment gate; the lesson player records real progress;
  `/read/<slug>` renders the book's real chapters behind a paywall.
