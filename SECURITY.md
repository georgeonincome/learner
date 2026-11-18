# Security notes — SavvyPro rebuild (`lena/`)

## Authentication & sessions
- Firebase Auth issues ID tokens in the browser. The client exchanges the ID
  token for an httpOnly, `Secure` (production), `SameSite=Lax` session cookie
  via `POST /api/auth/session`. The token is verified server-side with the
  Firebase Admin SDK before a session cookie is created.
- `GET /api/auth/me` verifies the session cookie with revocation checks.
- All admin routes and APIs are guarded by `getAdminIdentity()` which requires
  an `admin` or `teacher` custom claim. In local demo mode a demo admin is used
  so the UI can be exercised (see `GAPS.md`).
- Middleware redirects unauthenticated users away from protected page prefixes.

## Authorization on data
- `firestore.rules` restricts content writes to teachers/admins, user documents
  to their owner, community posts/comments to their author, and certificates to
  their owner.
- Turso tables are accessed only through route handlers; user-owned records are
  scoped by the authenticated `uid` where applicable.
- Note: some read APIs return all records in demo mode. Scope them to the
  authenticated user before production (tracked in `GAPS.md`).

## Validation
- All mutating API routes validate request bodies with zod schemas in
  `src/lib/validation.ts` and reject malformed payloads with HTTP 400.

## Rate limiting
- `src/lib/rate-limit.ts` provides an in-memory sliding-window limiter applied
  to session creation, checkout, progress updates, community posts/comments,
  appointments, webinars, lead claims, form submissions and the AI chat.
- In-memory state is per-process; use a shared store (Turso/Redis) in a
  multi-instance production deployment.

## Headers
- `next.config.js` sets CSP, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `X-DNS-Prefetch-Control` and (production only) HSTS.

## Payments
- Stripe Checkout is created server-side; the webhook verifies the
  `stripe-signature` header and enforces idempotency before creating orders and
  enrollments. Never trust client-supplied payment amounts.

## Secrets
- `.env.local` is git-ignored; `.env.example` documents all required keys.
  Never commit real API keys or service-account credentials.

## Known limitations
See `GAPS.md` for [inferred]/[unknown] items that need production decisions.
