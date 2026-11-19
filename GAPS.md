# GAPS.md — Unverifiable / inferred items

Everything below cannot be verified from the reference evidence. Each item is marked
`[inferred]` (conservative best guess based on observable patterns) or `[unknown]`
(no evidence at all). Conservative implementation: build the smallest thing that
satisfies the observable behavior; do not add features the reference does not show.

## Implementation status

Completed (Tailwind CSS v4 rebuild):
- Layout shell: Header (sticky, 75px, backdrop-blur, nav, auth buttons) + Footer
- Home page: Hero, Path picker, Social proof/testimonials, Service pillars
- Course catalog: `/courses/` with search, filters, pagination
- Course detail: `/course-detail/<slug>/<id>/` with curriculum, pricing, enrollment CTA
- Books catalog: `/books/` with preview/purchase gating
- Book detail: `/book/<slug>/` with chapter list and preview gating

Built after the initial audit (M2–M9):
- Auth pages: login, signup, forgot-password, reset-password, verify-email — build passes
- Checkout session + Stripe webhook (no dedicated checkout page yet) — build passes
- Dashboard, course page, lesson player, progress API, certificates — build passes
- Community feed (groups/posts/comments/likes), groups, contest — build passes
- Appointment + webinar registration endpoints with .ics — build passes
- Admin panel (courses, lessons, posts, books, users, orders, memberships, settings) — build passes
- Blog index/post/category, legal/static pages, lead magnets, AI assistant — build passes

Still outstanding / conservative-inferred:
- [inferred] Many captured sitemap routes (e.g. video/audio libraries, mini-course
  detail pages, PDF download pages) use generic content because backend data was
  not capturable.
- [inferred] Demo-mode fallbacks: community content store, admin store, progress
  and certificate records use in-memory/globalThis storage when external
  services (Firestore/Turso) are not configured. Wire to the real services for
  production.
- [unknown] Exact UI internals of the captured pages beyond visible HTML text
  were reconstructed from class names and structure; pixel-perfect fidelity is
  not verifiable from the evidence.
- [inferred] Rate limiting and admin identity are per-process in-memory; use a
  shared store for multi-instance deployments.
- [unknown] Playwright end-to-end journeys, Axe accessibility audit and Lighthouse
  performance scoring were not run in this environment (no browser tooling
  configured). Static checks (tsc/ESLint/build/unit tests/brand scan/route
  coverage) all pass.

## 2026-11-19 (later pass) — current gap list

Every item below is either **unknown from the reference** (cannot be determined from
`_reference` or from the live site) or **not yet built**.

### Unknown from the reference

| Item | Note |
| --- | --- |
| Server-side auth, payment, enrollment and progress behaviour | EzyCourse is a hosted SaaS; only the rendered HTML is observable |
| Login/signup validation rules | The reference's rules live in minified JS closures |
| What every CTA does | 173 controls were clicked on 24 pages, but controls outside those pages (and carousel/accordion controls) are unmapped |
| Course curriculum content | Only marketing copy and `curriculum_sample` titles are observable |
| Book chapter body text | Only the chapters the reference publishes openly |
| Membership tiers, admin capabilities, AI assistant provider | Not observable |
| Email templates, Cloudinary upload behaviour | Not observable |
| Reference defect reproduced faithfully | `/courses` renders the H1 "All products" in `#fff` on `#fff` (invisible) — measured identical on the live reference; the clone matches it |

### Not yet built

| Item | Impact |
| --- | --- |
| `sitemap.xml` / `robots.txt` | SEO |
| OG / Twitter / canonical / JSON-LD emission | SEO — data is captured in each page spec but not written to `<head>` |
| Transactional email (welcome, receipt, reset, lead magnet) | Auth and lead flows have no mailed copy |
| Cloudinary upload + signed-upload endpoints | No media pipeline |
| Turso migration runner | `database/schema.sql` must be applied by hand |
| Playwright end-to-end journeys | See PROGRESS.md step 4 |
| axe accessibility audit | Not run |
| Lighthouse performance audit | Not run |
| Firestore-backed community / admin persistence | Both run on in-memory stores |
| Per-instance shared rate limiting | In-memory per process |

### Fixed in this pass (was broken)

| Item | Fix |
| --- | --- |
| All reference CTAs inert | `capture-button-targets.mjs` → `button-targets.json` → `RefNode` |
| 22 course-detail URLs rendered blank | `build-course-index.mjs` → `course-index.json` → `CourseDetail` fallback |
| White-on-white text on checkout/dashboard/course/lesson/book screens | `AppSurface` (brand ink) wrapper |
| React "Invalid DOM property" warnings (`tabindex`, `clip-path`, `maxlength`, `autocomplete`, `readonly`) | Extended `ATTR_MAP` in `src/lib/ref-attrs.ts` |
| React `value` without `onChange` warnings | `RefNode` marks captured inputs `readOnly` |
| `next build` could not resolve `./tokens.css` | Import path corrected |
| Duplicate `/user` route (route group vs generated) | Route group removed |
| Middleware matched route-group folder names | Real URL prefixes |
| Every spec page blank after hydration when Firebase is unconfigured | `isFirebaseConfigured()` guard |
| Responsive CSS overrides dead | Removed the alphabetical sort in `styledCssUnion()` |


The following earlier statements are now **false** and are superseded:

- "~130 sitemap routes have no captured HTML" — all 181 sitemap URLs were fetched
  (`captured/`, 178 OK + 3 genuine 404s) and 180 were rendered in Chromium
  (`captured-browser/`). `scripts/route-coverage.mjs` reports **0 unmatched URLs**.
- "Playwright is not installed" — `@playwright/test` is installed and
  `scripts/layout-compare.mjs` measures both the reference and the clone at
  375/768/1024/1280/1536px.
- "Auth form fields ... are WAF-blocked (not capturable)" — the hydrated login/signup
  markup was captured and is reproduced by `src/components/auth/RefAuthForm.tsx`.
- "pixel-perfect fidelity is not verifiable" — it is now measured; see COMPARISON.md.

Newly established facts:

- The reference's styled-components CSS is captured per page (`captured-browser/*.css`,
  read from the CSSOM because `page.content()` drops speedy-mode sheets).
- `src/content/pages/*.json` holds the reference's own DOM for all 181 routes; the clone
  renders it through `src/components/ref/RefNode.tsx` with class names preserved.
- `next build` exits 0 with 191 static pages; `tsc --noEmit` is clean; `vitest run` is 20/20.

Remaining gaps from the earlier notes that still hold: server-side auth/payment/enrollment
behaviour, email sending, Cloudinary uploads, migration runner, Playwright journeys,
Lighthouse/axe, and Firestore-backed community/admin persistence.

## Reference capture gaps
- `capture\` directory — MISSING from `_reference/`. [unknown] No capture metadata available.
- `pages\*.md` — MISSING from `_reference/` (SPECIFICATION.md §2.2 references ~50 captured markdown pages). HTML equivalents exist in `site/www.savvypro.org/*.html`. [inferred] Treat captured HTML pages as the source of truth for those routes.
- Backend / server source — NOT capturable (hosted EzyCourse SaaS). [unknown] All API routes, controllers, and server logic must be supplied by the rebuild.
- Database schema — NOT observable. [inferred] Derived from observable entities (users, courses, lessons, orders, memberships, posts, community groups, certificates).
- Auth form fields, validation rules, and provider — login/signup pages are WAF-blocked (not capturable). [inferred] Email + password, Firebase Auth, standard validation (required email, min password length).
- Password reset flow — NOT observable. [inferred] Firebase password-reset email + reset form.
- Email verification flow — NOT observable. [inferred] Firebase email verification + verification page.

## API contract gaps (API-CONTRACT.md)
- Only 4 endpoint paths observable in JS chunks [observed]:
  - GET /api/public/setting/custom/font
  - GET /api/public/miscellaneous/send-error-log
  - POST /api/teacher/gallery/uploadFile
  - GET /api/teacher/setting/get-language/{{lng}}?ns={{ns}}
- All other endpoints (auth, catalog, checkout, orders, memberships, dashboard, lessons, community, appointments, webinars, lead magnets, AI, admin) — [inferred] from route names and conventional REST patterns. Marked [inferred] in API-CONTRACT.md.
- Request/response payloads, auth requirements, status codes — [inferred] except the 4 observed endpoints.

## Design / UI gaps
- Computed typography, spacing, radii, shadows per breakpoint — NOT directly measurable because Playwright is not installed and captured CSS is minified/styled-components hashed classes. [inferred] TOKENS.md uses values reconstructed from SPECIFICATION.md §4 (primary #6662FF, blue #00a3ff, magenta #ff007a, dark #101b2f, Figtree/Verdana, radius 5px/10px/50px).
- Animations (beyond nProgress bar) — [inferred] minimal, conservative (fade-in, slide-up).
- Copy-protection killCopy/reEnable (text selection disabled on homepage) — [inferred] NOT reproduced (harmful to accessibility/UX; decision deferred).
- Hero background image + all image binaries — URLs known; some binaries present in `site/`, but WAF blocks re-download of the rest. [inferred] Use placeholder/unsourced imagery; do not reference reference trademarks.

## Route / content gaps
- ~130 sitemap routes have no captured HTML (known by path only). [inferred] Template assigned by URL pattern (course-detail → course detail, blog/* → blog post, etc.).
- Dynamic segment semantics (e.g. course-detail/<slug>/<id>/) — [inferred] id is numeric course identifier.
- Community detail, video/audio details, appointment, membership internals — [inferred].

## Brand / third-party
- GTM container GTM-PH89WSX4, Hotjar hjid:645767, Cloudflare Insights — reference-specific; [inferred] replaced with placeholders to be configured by the owner (never copied into brand content).
- Figtree font from Google Fonts — [inferred] self-host or CDN; not bundled as brand asset.

---

## Session-2 corrections (2026-11-19, supersede stale claims above)

- "Playwright is not installed" — STALE. Chromium installed and used today (crawl,
  layout-compare, captures). Typography/spacing ARE measured (docs/UI-SPEC, COMPARISON.md).
- "~130 sitemap routes have no captured HTML" — STALE. All 181 URLs captured live today
  (lena/captured raw SSR + lena/captured-browser hydrated DOM+CSSOM, 181/181).
- TOKENS.md reference palette values are REFERENCE MEASUREMENTS ONLY; lena must use an
  original palette (brief). The working tree currently uses the reference palette —
  scored as deviation J4/J5, fixed in plan M9.

## New unknowns logged this session (conservative standard implementation per plan)

- U1. Lesson CONTENT (video URLs, audio files, text bodies, quiz questions, assignment
  prompts) — gated behind the reference watch page; NOT in any capture. Conservative:
  lesson records carry type/title/position/is_free from the dump; media slots empty until
  George supplies files via CMS. Player implements all 7 types against any supplied media.
- U2. Book product 50150 (the one uncaptured /books card) — identity/price unknown.
  Conservative: free-model slot editable in CMS (plan D5).
- U3. Membership tier shapes/prices — dashboard/membership routes evidenced, payloads not
  captured. Conservative: CMS-editable free + monthly/yearly paid tiers (plan D7).
- U4. Drip configuration UI/rules — /seller/courses/[course_id]/drip route exists; no
  config captured. Conservative: drip_offset_days per lesson, off by default;
  progressive_mode=1 honored where evidenced (CCS).
- U5. Catalog search/filter/sort exact behavior — Search inputs observed (courses 24
  inputs, all-products "Product name", blog "Search..."); filter facets/pagination sizes
  not captured. Conservative: text search + category filter + sort (newest/price/title) +
  12-per-page pagination.
- U6. Appointment booking widget provider — /appointment uses external CTA/embed; no
  provider captured. Conservative: native slot-picker booking (plan M8).
- U7. Quiz/assignment grading logic — routes evidenced (quiz-submissions,
  assignment_submission, question-bank); rules unknown. Conservative: auto-grade MCQ,
  manual-grade written assignments, pass mark configurable per course.
- U8. Certificate design/verification semantics — /certificate/[slug] route evidenced;
  design not captured. Conservative: original-design SVG/PDF, public verify by slug+id.
- U9. Email template contents — not captured. Conservative: original React Email
  templates for the evidenced triggers.
- U10. Reference shared chunk 1e468093-22a0a530… permanently 404 (superseded by live
  build 4315b58e). Impact: none material — page chunks + hydrated DOM + __NEXT_DATA__
  cover the behavior; logged for completeness.
- U11. Live reference build changed mid-audit: 4315b58e0a021a23f2f524abc2c40aed1d628f7b,
  670 routes (+/dashboard/settings/trusted-ips, +/verify-ip). Captured evidence remains
  build fb86cad/6d3b623; the 4 expired page chunks were re-downloaded from the current
  build (docs/evidence/live-chunk-report.json). No sitemap change.
- U12. Reference admin UI layouts — route census only (437 dashboard + 89 seller routes);
  no admin screenshots/chunks for most pages. CMS capability floor = REFERENCE-MODEL §9;
  modern LMS standards fill the silence (plan §0.3).
