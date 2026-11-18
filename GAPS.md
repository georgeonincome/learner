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
