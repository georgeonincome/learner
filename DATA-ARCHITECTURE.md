# DATA ARCHITECTURE

Decision: **Turso (libSQL/SQLite) is the system of record for everything transactional.
Firebase Auth is the identity provider. Firestore is scaffolded but currently unused.**
Community and admin content use in-memory stores seeded from `src/content/*.json`
(local/demo mode).

## Why

- Orders, enrollments, progress, appointments and form submissions need ACID guarantees,
  unique constraints and relational reporting → SQL.
- Identity is email/password + OAuth redirect, already implemented with Firebase Auth
  (`src/lib/auth-client.ts`, `src/lib/session.ts`).
- The reference is a marketing + course platform; its content is read-mostly and already
  captured as data in `src/content/pages/*.json`.

## Turso tables (`database/schema.sql`)

| Table | Owner | Key fields | Indexes |
| --- | --- | --- | --- |
| `profiles` | user | `auth_user_id` (Firebase uid) PK, full_name, phone, timezone | PK |
| `orders` | order | `id` PK, `auth_user_id`, `stripe_session_id` UNIQUE, status, total (cents), currency, `idempotency_key` UNIQUE | user, status, idempotency |
| `order_items` | order | `id` PK, `order_id` FK→orders, product_type, product_id, price | order |
| `enrollments` | enrollment | `id` PK, `auth_user_id`, `course_id`, status | UNIQUE(user, course), user |
| `memberships` | membership | `id` PK, `auth_user_id`, tier, status, starts_at, ends_at, auto_renew | user, status |
| `lesson_progress` | progress | `id` PK, `auth_user_id`, `lesson_id`, completed, percent, last_position_sec | UNIQUE(user, lesson), user |
| `appointments` | booking | `id` PK, `auth_user_id`, `staff_id`, starts_at, ends_at, status, ics_url | user, staff, time |
| `webinar_registrations` | booking | `id` PK, `auth_user_id`, `webinar_id`, ics_url | user |
| `lead_claims` | lead | `id` PK, email, lead_magnet_slug, claimed_at | email, slug |
| `form_submissions` | form | `id` PK, form_type, name, email, message, `page`, `fields` (JSON) | type, page |

`page` and `fields` were added so a submission from any reference form (which carries its
own field set) is stored without a schema change per form.

## ID linking across stores

- **Firebase uid** is the join key. `profiles.auth_user_id`, `orders.auth_user_id`,
  `enrollments.auth_user_id`, `memberships.auth_user_id`, `lesson_progress.auth_user_id`
  all store the raw uid — no mapping table needed.
- **Course/lesson ids** are denormalized strings that match the content slugs in
  `src/content/pages/*.json` and `src/content/courses.json`, so a Turso row and a static
  page spec refer to the same entity.
- **Stripe** links by `orders.stripe_session_id` and `idempotency_key` (unique).

## Firestore (currently unused)

`src/lib/firestore-server.ts`, `src/lib/firestore.rules` and the `community-store` /
`admin-store` comments describe a Firestore hierarchy (`communityGroups`, posts,
comments, likes). The implementations are in-memory. **Gap:** migrate these to Firestore
or Turso before production (see GAPS.md).

## Security rules / access

- Session cookie `lena_session`: HttpOnly, Secure, SameSite=Lax, constant-time comparison
  (`src/lib/session.ts`).
- Every mutating API route resolves the session server-side; `src/middleware.ts` redirects
  unauthenticated users away from `/user`, `/dashboard`, `/checkout`, `/orders`, `/library`.
- Rate limiting on auth/contact/lead endpoints (`src/lib/rate-limit.ts`).
- CSRF double-submit cookie on form posts.
- Secrets only in `.env.local`; `.env.example` is the sanitized template.

## Migrations

Apply with the Turso CLI:

```bash
turso db shell <db> < database/schema.sql
```

No migration runner is implemented yet — **gap**.
