# PLAN.md — Milestone order, stack confirmation, folder structure

This is the Phase 2 plan. Per the mission rules, I STOP HERE and wait for your go-ahead before writing any app code
(M1+). Everything in this document is a proposal for your approval.

## Stack confirmation (from pre-existing package.json + mission requirements)

| Layer | Choice | Evidence |
|---|---|---|
| Framework | Next.js 15 App Router | `package.json` has `next: 15.0.3` |
| Language | TypeScript | `typescript`, `eslint-config-next`, `tsc --noEmit` script |
| Styling | Tailwind CSS v4 (never MUI/Emotion) | `tailwindcss: ^4.3.5`, `postcss`, `autoprefixer` |
| UI primitives | Radix UI (to add) or Headless UI | accessible primitives; ESLint rule fails on `@mui/*` / `@emotion/*` |
| Auth | Firebase Auth | `firebase`, `firebase-admin` in package.json |
| Session | server-verified httpOnly cookie | Next.js middleware/cookies (to implement) |
| Content DB | Firestore | Firebase admin SDK available |
| Relational/payments DB | Turso/libSQL | `@libsql/client` in package.json |
| File storage | Cloudinary | to add |
| Email | Nodemailer + React Email | `nodemailer` in package.json; React Email to add |
| Payments | Stripe test mode | to add (`stripe`) |
| Testing | Vitest + Playwright | `vitest`, `@playwright/test`, `lighthouse` in package.json |

Dependencies to add: `@radix-ui/react-*` (or `@headlessui/react`), `stripe`, `cloudinary`, `react-email`,
`resend`/SMTP transport, `zod` (validation), `class-variance-authority` / `tailwind-variants` (component variants),
`lucide-react` (icons), `date-fns`.

ESLint rule: fail on any `@mui/*` or `@emotion/*` import (M1).

## Folder structure (Next.js 15 App Router)

```
lena/                              # project root (git repo)
├── .env.example                   # all secrets (no real keys)
├── .gitignore
├── package.json                   # exists (stack above)
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs              # @mui/@emotion ban rule
├── README.md                      # Phase 5
├── PROGRESS.md                    # milestone status (updated each milestone)
├── GAPS.md
├── content/                       # ORIGINAL brand identity (JSON only — no reference copy)
│   └── brand.json                 # BRAND_NAME, logo, copy, color palette
├── public/
│   ├── fonts/                     # Figtree (self-hosted) + fallback
│   ├── images/                    # original imagery (placeholders — no reference images)
│   └── favicon.svg
├── app/                           # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                   # /
│   ├── globals.css                # Tailwind v4
│   ├── blog/...                   # /blog, /blog/[slug], /blog/category/[cat]/[id]
│   ├── course-detail/[slug]/[id]/page.tsx
│   ├── [path-landing pages]...
│   ├── (auth)/login, signin, signup
│   ├── (account)/user, membership
│   ├── (checkout)/...
│   ├── (dashboard)/...            # post-login
│   ├── api/                       # route handlers (all guarded)
│   │   ├── auth/session, logout, ...
│   │   ├── webhooks/stripe
│   │   └── ...
│   ├── sitemap.ts, robots.ts, metadata.ts
│   └── generateStaticParams (M4)  # all 181 URLs
├── components/
│   ├── ui/                        # Button, Input, Card, Modal, Tabs, Accordion, Carousel, Badge, Alert, Nav, Footer, Toast (cva)
│   └── sections/                  # page sections (Hero, PathPicker, Testimonials, ...)
├── lib/
│   ├── firebase.ts                # client + admin SDK
│   ├── turso.ts                   # libSQL client (server only)
│   ├── stripe.ts                  # test mode
│   ├── cloudinary.ts
│   ├── email.ts                   # Nodemailer + React Email
│   ├── auth.ts                    # session cookie helpers
│   └── validators.ts              # zod schemas
├── docs/                          # Phase 1 analysis (COVERAGE, FEATURES, API-CONTRACT, DATA-MODEL, DATA-ARCHITECTURE, UI-SPEC, GAPS)
└── tests/                         # unit + integration + Playwright journeys
```

## Milestone order

| Milestone | Focus | Done before next? |
|---|---|---|
| M1 | Foundation: Tailwind theme from TOKENS.md, component library (cva), layout shell, SEO helpers, ESLint @mui/@emotion ban | tsc/lint/build clean |
| M2 | Auth: Firebase Auth, httpOnly session cookies, email verification, password reset, middleware protection, roles, account settings | signup→verify→login journey works |
| M3 | Data: Turso migrations, Firestore rules (emulator-tested), seed from content | emulator rules pass, seed loads |
| M4 | Public pages: home, path landings, catalog, course detail, programs, books, blog, legal, about, contact, testimonials; generateStaticParams for all 181 URLs | all 181 URLs → 200 + unique title/meta |
| M5 | Commerce: Stripe test-mode adapter, webhook signature + idempotency, order states, receipts, enrollment after confirmed payment, memberships + gating | test-mode pay → enroll works |
| M6 | Learning: dashboard, lesson player, per-lesson progress, resume, completion, certificates | learn→complete journey works |
| M7 | Engagement: community, coaching/appointments + webinars, lead magnets/forms, AI assistant (mock provider, streaming, limits) | community post + booking form work |
| M8 | Admin: manage courses, lessons, posts, books, users, orders, memberships, settings | admin creates course → appears in catalog |
| M9 | Hardening: rate limiting (shared store + local fallback), auth guard on every API route, CSP/security headers, validation everywhere, .env.example | SECURITY.md route list |
| Phase 4 | Verification: tsc/lint/build, tests, Playwright journeys, sitemap crawler, layout comparison (±4px), Axe/Lighthouse ≥90, brand grep | COMPARISON.md + Lighthouse reports |
| Phase 5 | Deliver: feature table, README (setup + prod checklist), production keys handed to you | — |

## What waits on your approval

I will NOT create `app/`, `components/`, `lib/`, install packages, or write any application code until you confirm:
1. The stack above (Next.js 15 + Tailwind v4 + Firebase + Turso + Stripe test mode, etc.) is acceptable.
2. The Firestore vs Turso split in DATA-ARCHITECTURE.md is acceptable.
3. The milestone order and folder structure are acceptable.

On your go-ahead, I begin M1 Foundation and commit after every milestone, keeping PROGRESS.md current.
