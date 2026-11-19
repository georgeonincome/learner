# AUDIT — SavvyPro clone vs `_reference`

Last verified: build `next build` exit 0 (191 static pages), `tsc --noEmit` 0 errors,
`vitest run` 20/20 pass, `node scripts/route-coverage.mjs` 0 unmatched.

## 1. Route audit (sitemap → handler)

Source of truth: `_reference/sitemap.xml` (181 URLs) + `scripts/route-coverage.mjs`.

| Metric | Value |
| --- | --- |
| Sitemap URLs | 181 |
| App page routes | 137 |
| Unmatched sitemap URLs | **0** |
| Generated spec routes (static) | 106 |
| Generated dynamic spec routes | 5 (`blog/[slug]`, `blog/category/[cat]/[id]`, `course-detail/[slug]/[id]`, `community/[id]`, `book/[slug]`) |
| Functional routes kept as code | 26 (`/user`, `/cart`, `/checkout`, `/dashboard/*`, `/admin/*`, `/offers`, `/payments`, `/you-have-paid`, `/books-stripe-payment`, `/payforcontentcreationschool`, `/testkcpayment`, `/kcpay--redirect`, `/kcpay-registration-success`, `/membership`, `/(auth)/reset-password`, `/(auth)/verify`) |
| Page specs extracted | 181 JSON files in `src/content/pages/` (5.39 MB) |

Handler types:

- **spec-driven** — `PublicPage` renders `src/content/pages/<key>.json` (the reference's own
  DOM: tags, classes, text, links, images) through `RefNode`. Class names are preserved
  verbatim so the reference's compiled CSS applies unchanged.
- **functional** — real implementation code (auth, cart, checkout, dashboard, admin, API).
- **generic fallback** — none. Every sitemap URL maps to a spec or a functional route.

## 2. Feature status (against FEATURES.md)

| Feature | Status | Evidence |
| --- | --- | --- |
| Design tokens / theme file | working | `src/styles/tokens.css` (`--brand-*`, `--ezy_variable_*`, Tailwind `@theme`) |
| Reference CSS parity | working | `src/styles/vendor.css` (1.89 MB) + `src/styles/reference.css` (styled union) |
| Header + nav + logged-in state | working | `src/components/layout/Header.tsx`, `SiteHeader.tsx` |
| Footer | working | Rendered by each page spec (`cPSjgn` blocks), not duplicated in layout |
| Per-route SEO (title) | working | `specMetadata()` from `src/content/pages/*.json` |
| Per-route SEO (description) | partial | Reference emits no meta description; `src/lib/seo.ts` supplies template fallbacks |
| OG / Twitter / canonical / JSON-LD | partial | Extracted into spec `meta`, not yet emitted into `<head>` |
| Sitemap.xml / robots.txt | missing | Not implemented |
| Auth (login/signup) UI | working | `RefAuthForm.tsx` reproduces reference `_login_page_form` |
| Auth backend (Firebase) | unverified | `src/lib/firebase.ts` guards missing creds; no live project configured |
| Password reset / verify | partial | `/(auth)/reset-password`, `/(auth)/verify` pages exist; flow untested |
| Catalog / course detail | partial | Routes + reference markup render; no live catalog data |
| Cart / checkout | partial | Routes exist; no end-to-end payment test |
| Orders / receipts | partial | `api/orders`, `api/checkout/session` exist; untested |
| Memberships / access gating | partial | `api/memberships*` exist; untested |
| Student dashboard / progress | partial | `dashboard/*`, `api/progress`, `api/enrollments` exist; untested |
| Certificates | partial | `api/certificates/download`, `dashboard/certificates` exist; untested |
| Community | partial | `api/community/*` exist; pages render reference markup |
| Admin | partial | 8 admin routes + 5 admin APIs exist; untested |
| AI assistant | partial | `api/ai/chat`, `src/lib/ai-provider.ts` exist; untested |
| Forms / lead capture | working | `RefNode` → `POST /api/forms/submit`; `fields` + `page` persisted |
| Transactional email | missing | No mail service wired |
| Cloudinary uploads | missing | No upload endpoint |
| Unit / integration tests | working | 20/20 pass (`npx vitest run`) |
| Playwright E2E | partial | `tests/e2e/` exists; no full journey run yet |
| Visual fidelity harness | working | `scripts/layout-compare.mjs` (see COMPARISON.md) |

## 3. Known defects found and fixed in this pass

- `(account)/user/page.tsx` collided with the generated `/user` route → duplicate path build
  error. Removed the route group; `/user` is now the spec-driven reference page.
- `src/middleware.ts` matched route-group folder names (`/(auth)`, `/(account)`) that never
  appear in the request pathname, so protection and auth redirects never fired. Replaced with
  real URL prefixes.
- `src/lib/firebase.ts` initialised Firebase at module scope; with no
  `NEXT_PUBLIC_FIREBASE_*` credentials the client bundle threw
  `FirebaseError: auth/invalid-api-key` and **every spec page rendered blank after
  hydration**. Now `isFirebaseConfigured()` gates initialisation and public pages render
  without credentials.
- `next.config.js` CSP `img-src` blocked the BunnyCDN hosts the captured content references.
  Now configurable via `NEXT_PUBLIC_MEDIA_HOSTS`.
- `RefNode` did not emit `data-layout-section`, so the fidelity harness could not measure our
  pages. Added.
- `scripts/layout-compare.mjs` measured the reference with a bare `section` selector (all
  nested sections) while measuring ours with top-level blocks only. Now both sides measure
  the `#__next` container's element children.
- `page.content()` drops styled-components "speedy" sheets, so `captured-browser/*.html`
  rendered unstyled when replayed. `capture-browser.mjs` now dumps each page's CSSOM to a
  sibling `.css`, and the harness re-injects it.
