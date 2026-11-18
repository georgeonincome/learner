# learner — SavvyPro-equivalent platform rebuild

A from-scratch rebuild of the captured reference platform at
`web/clone/savvypro/_reference/`, using original branding, copy, imagery and
design tokens. Built with Next.js 15 App Router, TypeScript, Tailwind CSS v4,
Firebase Auth + Firestore, Turso/libSQL, Stripe test mode and Radix UI.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (includes `@mui/*` / `@emotion/*` ban) |
| `npm run type-check` | TypeScript check |
| `npm test` | Vitest unit tests |
| `node scripts/brand-scan.mjs` | Copy / brand / tracking provenance scan |
| `node scripts/route-coverage.mjs` | Sitemap URL → app route coverage |
| `node scripts/generate-route-pages.mjs` | Generate missing sitemap route pages |
| `npx tsx scripts/seed.ts` | Seed Turso + Firestore from `src/content/*.json` |

## What is built

| Area | Routes / features | Status |
|---|---|---|
| Foundation | Tailwind v4 theme from `docs/UI-SPEC/TOKENS.md`, component library, layout shell, SEO metadata | ✅ |
| Auth | Firebase Auth, httpOnly session cookies, email verification, password reset, middleware route protection, roles | ✅ |
| Data | Turso schema (orders, enrollments, memberships, lesson progress, appointments, webinar registrations, leads, forms), Firestore rules, seed script | ✅ |
| Public pages | Home, 6 path landings, all-products catalog, course & book detail, blog list/post/category, legal, about, contact, testimonials, appointment, 181 sitemap routes | ✅ |
| Commerce | Stripe test-mode checkout, webhook signature + idempotency, order states, enrollment after payment, memberships + gating | ✅ |
| Learning | Dashboard, course page, lesson player, per-lesson progress API, mark-complete, certificates + SVG download | ✅ |
| Engagement | Community feed (groups/posts/comments/likes), appointments + webinars with `.ics`, lead magnets/forms, streaming mock AI assistant with rate limits | ✅ |
| Admin | Role-guarded area: courses/posts CRUD, lessons, books, users, orders, memberships, settings | ✅ |
| Hardening | zod validation, rate limiting, security headers, `SECURITY.md` | ✅ |
| Verification | tsc, ESLint, Vitest (11 tests), build, brand scan, route coverage | ✅ |

## Architecture

- **Firestore**: auth profiles, content (courses, lessons, books, blog posts), community, certificates, settings.
- **Turso/libSQL**: orders, enrollments, memberships, lesson progress, appointments, webinar registrations, lead claims, form submissions.
- Firebase Auth `uid` links the two stores. See `docs/DATA-ARCHITECTURE.md`.

## Docs

- `PROGRESS.md` — milestone status
- `docs/COVERAGE.md` — all 181 sitemap URLs mapped to templates
- `docs/FEATURES.md` — feature inventory with evidence markers
- `docs/API-CONTRACT.md`, `docs/DATA-MODEL.md`, `docs/DATA-ARCHITECTURE.md`
- `docs/UI-SPEC/` — tokens and template specs
- `docs/BRAND-AUDIT.md` — copy / brand provenance audit
- `docs/DEPLOYMENT.md`, `PRODUCTION-CHECKLIST.md` — deployment guidance
- `GAPS.md` — inferred / unknown items
- `SECURITY.md` — security notes

## Production notes

Demo-mode fallbacks exist for community, admin and progress data when external
services are not configured. Review `GAPS.md` and `PRODUCTION-CHECKLIST.md`
before deploying.
