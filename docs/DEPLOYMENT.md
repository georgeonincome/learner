# DEPLOYMENT.md — Production deployment checklist

Everything needed to take this build from local development to a deployed
environment. Commands assume the repository root (`lena/`).

## 1. Prerequisites

- Node.js 20+ (developed on Node 24) and npm
- A Firebase project (Auth + Firestore)
- A Turso (libSQL) database
- Stripe account (optional; sandbox payments work without it)
- SMTP credentials (optional; emails log to the server console when unset)
- Cloudinary account (optional; local file fallback is used when unset)
- Upstash Redis (optional; rate limiting falls back to Turso then memory)

## 2. Environment variables

Copy `.env.example` to `.env.local` for local development, or set these in your
host's secret manager. Never commit real values.

### Firebase (client — safe to expose)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Web SDK API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web app id |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | Must be `false` in production |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, e.g. `https://example.com` |

### Firebase Admin (server only)

| Variable | Purpose |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full service-account JSON on one line |
| `FIREBASE_AUTH_EMULATOR_HOST` | Leave **unset** in production |
| `FIRESTORE_EMULATOR_HOST` | Leave **unset** in production |

### Database

| Variable | Purpose |
|---|---|
| `TURSO_DB_URL` | `libsql://<db>-<org>.turso.io` |
| `TURSO_DB_AUTH_TOKEN` | Turso database token |

### Payments

| Variable | Purpose |
|---|---|
| `PAYMENT_GATEWAY` | `sandbox` or `stripe` |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_…` / `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for webhook verification |

### Email

| Variable | Purpose |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP connection |
| `SMTP_USER` / `SMTP_PASSWORD` | SMTP credentials |
| `EMAIL_FROM` | From header, e.g. `Your Site <noreply@example.com>` |

### Media

| Variable | Purpose |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloud name |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret (server only) |

### AI assistant

| Variable | Purpose |
|---|---|
| `AI_PROVIDER` | `mock` (default), `canned`, or `none` |
| `AI_MAX_DAILY_MESSAGES` | Per-user daily message cap (default `50`) |

### Rate limiting

| Variable | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash REST endpoint (recommended for multi-instance) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST token |
| `REDIS_REST_URL` / `REDIS_REST_TOKEN` | Accepted aliases |

Selection order: Upstash → Turso (`rate_limit_hits`) → in-memory counter.
If a shared backend errors at request time, the hit is counted in memory so
requests are not blocked by a Redis outage.

## 3. Firebase setup

1. Enable **Email/Password** in Authentication → Sign-in method.
2. Add your production domain under Authentication → Settings → Authorized domains.
3. Deploy Firestore rules: `firebase deploy --only firestore:rules`.
4. Create the first admin:
   `node scripts/set-admin.mjs admin@example.com admin`
   (with `FIREBASE_SERVICE_ACCOUNT_JSON` set).
   The admin must sign out and back in to receive a token containing
   `role=admin`; every admin page and `/api/admin/*` route enforces it
   server-side.
5. Create service-account credentials (Project settings → Service accounts) and
   store the JSON in `FIREBASE_SERVICE_ACCOUNT_JSON`.

## 4. Database

```bash
# Apply every migration (idempotent; tracked in _migrations)
node scripts/migrate.mjs

# Optional demo data
node scripts/seed.mjs
```

Migrations live in `migrations/` and are applied once each, tolerating
"duplicate column"/"already exists" DDL from older databases.

## 5. Payments

- Sandbox (default): checkout creates an order and the confirm endpoint
  fulfills it. No external calls.
- Stripe: set `PAYMENT_GATEWAY=stripe`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`. Add the webhook endpoint in the Stripe dashboard:
  `https://<your-domain>/api/webhooks/stripe`. Subscribe to
  `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
  The route verifies the `Stripe-Signature` header against the **raw** body
  before fulfilling the order.

## 6. Build and deploy

```bash
npm ci
npm run build
npm run start        # or run the Next.js server behind your platform
```

Post-deploy checks:

```bash
# Security headers
curl -sI https://<your-domain>/ | grep -Ei 'content-security-policy|strict-transport|x-content-type|x-frame'

# Public pages
for p in / /courses /books /membership /appointment /contact-us; do
  curl -s -o /dev/null -w "%{http_code} $p\n" "https://<your-domain>$p"
done

# Brand/copy provenance and client-secret checks
node scripts/brand-scan.mjs
```

## 7. Known production decisions

See `GAPS.md` for reference-unknowable behaviour and `BRAND-AUDIT.md` for copy
provenance. The sandbox payment adapter and console email transport are
deliberate local defaults; switch them with the env vars above.

## 8. Health

No dedicated health route; use `/` (200) and `/api/courses` (200) for
liveness/readiness probes.
