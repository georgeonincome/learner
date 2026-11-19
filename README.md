# lena — SavvyPro-equivalent platform

Rebuild of the captured reference platform in `web/clone/savvypro/_reference/`
(181 sitemap URLs). Next.js 15 App Router, TypeScript, Tailwind CSS v4, Firebase Auth,
Turso/libSQL, Stripe test mode.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the public site renders without credentials
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

Nothing in the public marketing site requires credentials. Firebase is only needed for
login/signup, and Turso only for the commerce/learning APIs.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Dev server / production build / serve |
| `npm run type-check` | `tsc --noEmit` |
| `npm test` | Vitest (unit + integration) |
| `npm run lint` | ESLint (fails on `@mui/*` and `@emotion/*` imports) |
| `node scripts/route-coverage.mjs` | Sitemap URL → app route coverage |
| `node scripts/sitemap-audit.mjs` | Crawl all 181 URLs: status, title, description, console errors, handler |
| `node scripts/layout-compare.mjs` | Visual fidelity vs the captured reference |
| `node scripts/capture-browser.mjs` | Re-capture the live reference (HTML + CSSOM) |
| `node scripts/extract-page-specs.mjs` | Rebuild `src/content/pages/*.json` |
| `node scripts/build-design-system.mjs` | Rebuild `src/styles/{reference,vendor}.css` |
| `node scripts/capture-button-targets.mjs` | Click reference CTAs and record destinations |
| `node scripts/build-course-index.mjs` | Index every course-detail slug the reference links to |
| `node scripts/generate-routes.mjs` | Regenerate spec-driven route files |

## How the UI parity works

The reference is a styled-components v5 app. Its per-page rules are captured to
`src/styles/reference.css`; its compiled theme stylesheet (Bootstrap + EzyCourse) is
`src/styles/vendor.css`. Page markup is **data**, not hand-written:

```
scripts/capture-browser.mjs      →  captured-browser/*.html + *.css (CSSOM)
scripts/extract-page-specs.mjs   →  src/content/pages/<key>.json
scripts/generate-routes.mjs      →  src/app/<route>/page.tsx  (PublicPage)
src/components/ref/RefNode.tsx   →  renders a spec as React, class names preserved
src/components/layout/PublicPage →  SiteHeader + spec blocks
```

Class names are carried over verbatim, so the reference's own CSS applies unchanged.
Brand name, logo and palette stay editable in `src/styles/tokens.css`; every piece of copy
lives in `src/content/pages/*.json`.

Do **not** hand-write page markup — edit the spec JSON or the capture pipeline instead.

## Commerce and learning engines

- `/checkout?course=<id|slug>` / `/checkout?book=<id|slug>` — resolves the product,
  shows price, and creates a Stripe session (`/api/checkout/session`). Free products
  enrol immediately (`/api/enrollments`).
- `/dashboard` — real enrollments (`enrollments` table) and real per-lesson progress.
- `/dashboard/course/<id>` — real curriculum from `src/content/courses.json`, gated on
  enrollment, with a working buy/enrol path.
- `/dashboard/course/<id>/lesson/<lessonId>` — lesson player with a working
  "Mark complete" (`/api/progress`).
- `/read/<slug>` — book reader rendering the book's real chapters, with the chapters
  beyond `preview_chapters` behind a purchase CTA.
- `/course-detail/<slug>/<id>` — renders the captured reference page where one exists;
  otherwise the catalog-driven `CourseDetail` page. Every course-detail slug the
  reference links to resolves (see `src/content/course-index.json`).

## Verified status

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | exit 0, 191 static pages |
| `npm test` | 20/20 pass |
| `node scripts/route-coverage.mjs` | 181 sitemap URLs, **0 unmatched** |
| `node scripts/layout-compare.mjs` | see COMPARISON.md |

## Architecture

- **Turso/libSQL** — system of record for orders, order items, enrollments, memberships,
  lesson progress, appointments, webinar registrations, lead claims, form submissions.
  Schema: `database/schema.sql`. Firebase `uid` is the join key.
- **Firebase Auth** — email/password + OAuth redirect; idToken exchanged for an HttpOnly
  session cookie (`src/lib/session.ts`).
- **Firestore** — scaffolded (`src/lib/firestore-server.ts`, security rules) but currently
  unused; community and admin run on in-memory stores seeded from `src/content/*.json`.
- **Spec-driven pages** — 106 static routes + 5 dynamic routes render captured reference
  content. 26 functional routes (auth, cart, checkout, dashboard, admin, API) are real
  implementation code.

See `DATA-ARCHITECTURE.md`.

## Docs

- `AUDIT.md` — route audit + feature status with evidence
- `COMPARISON.md` — measured visual fidelity per template and breakpoint
- `DATA-ARCHITECTURE.md` — stores, tables, indexes, ID linking
- `GAPS.md` — inferred / unknown / missing
- `docs/FEATURES.md`, `docs/API-CONTRACT.md`, `docs/COVERAGE.md`
- `docs/UI-SPEC/` — tokens and template specs

## Production notes

Community, admin and progress data fall back to in-memory storage when external services
are not configured. Email sending, Cloudinary uploads, `sitemap.xml`/`robots.txt`, OG tag
emission and the Turso migration runner are not implemented — see `GAPS.md`.
