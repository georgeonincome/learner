# API-CONTRACT.md — Endpoint inventory

Endpoints discovered in the reference JS chunks (`_reference/site/**/*.js`) are marked **[observed]**.
All other endpoints (auth, catalog, checkout, orders, memberships, dashboard, lessons, community, appointments, webinars,
lead magnets, AI assistant, admin) are **[inferred]** — the backend is a hosted EzyCourse SaaS and was NOT capturable;
only request/response shape, method and auth requirement are conservatively inferred.

Base URL: `NEXT_PUBLIC_BASE_URL` (env). In production-like local dev, API routes live under `/api` on the same origin.
All mutating API routes require a server-verified session (httpOnly cookie). See SECURITY.md (Phase M9).

---

## Observed endpoints (from JS chunks)

| # | Method | Endpoint | Payload (request) | Response | Auth | Evidence |
|---|---|---|---|---|---|---|
| O1 | GET | `/api/public/setting/custom/font` | none | font stylesheet (CSS) | public | Homepage `<link rel="stylesheet" href="/api/public/setting/custom/font">`; JS chunk [observed] |
| O2 | GET | `/api/public/miscellaneous/send-error-log` | none (or body) | success/failure | public (or session) | JS chunk string literal [observed] |
| O3 | POST | `/api/teacher/gallery/uploadFile` | multipart file (image upload) | upload result (url) | teacher/session | JS chunk string literal [observed] |
| O4 | GET | `/api/teacher/setting/get-language/{{lng}}?ns={{ns}}` | path params `lng`, query `ns` | translation strings (i18n namespace) | public | JS chunk string literal [observed] |

Observed runtime config (env vars read by the client, found in JS chunks):
- `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_BACKEND_PORT`, `NEXT_PUBLIC_COACH_API_BASE_URL`, `NEXT_PUBLIC_NEW_API_BASE_URL`, `NEXT_PUBLIC_SOCKET_URL`, `NEXT_PUBLIC_ZOOM_SDK_KEY`, `NEXT_PUBLIC_AZURE_BLOB_CDN_HOST`, `NEXT_PUBLIC_BUGSNAG_API_KEY`, `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_VERSION` [observed in chunks]

Third-party calls observed in chunks (not part of our API contract, listed for completeness):
- `fetch("https://api.giphy.com/v1/gifs/...?api_key=...")` — GIF search/trending [observed]
- `fetch("https://ping.ezycourse.net/api/ping", {method:"POST", ...})` — keep-alive ping [observed]

---

## Inferred endpoints (rebuild-supplied backend)

### Auth (Firebase Auth + server-verified httpOnly session cookie)

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I1 | POST | `/api/auth/session` | `{idToken}` | `{user}` (sets httpOnly session cookie) | public |
| I2 | POST | `/api/auth/logout` | none | `{ok}` | session |
| I3 | POST | `/api/auth/verify-email` | `{oobCode}` | `{ok}` | public |
| I4 | POST | `/api/auth/password-reset` | `{email}` | `{ok}` (sends reset email) | public |
| I5 | POST | `/api/auth/password-reset-confirm` | `{oobCode, newPassword}` | `{ok}` | public |
| I6 | GET | `/api/auth/me` | none | `{user}` | session |

### Catalog & courses

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I7 | GET | `/api/courses` | query filters | `{courses[], meta}` | public |
| I8 | GET | `/api/courses/:id` | path id | `{course, lessons[]}` | public |
| I9 | GET | `/api/products` | query | `{products[], meta}` | public |
| I10 | GET | `/api/products/:slug` | path slug | `{product}` | public |

### Books

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I11 | GET | `/api/books` | query | `{books[], meta}` | public |
| I12 | GET | `/api/books/:slug` | path slug | `{book, downloadUrl}` | public |

### Blog

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I13 | GET | `/api/blog/posts` | query (search, category, page) | `{posts[], meta}` | public |
| I14 | GET | `/api/blog/posts/:slug` | path slug | `{post}` | public |
| I15 | GET | `/api/blog/categories` | none | `{categories[]}` | public |

### Commerce / orders

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I16 | POST | `/api/checkout/session` | `{lineItems[], mode}` | `{sessionId, url}` | session |
| I17 | POST | `/api/webhooks/stripe` | Stripe webhook body + signature header | `{received}` | webhook signature (no session) |
| I18 | GET | `/api/orders` | none | `{orders[]}` | session |
| I19 | GET | `/api/orders/:id` | path id | `{order, lineItems}` | session |
| I20 | GET | `/api/enrollments` | none | `{enrollments[]}` | session |
| I21 | POST | `/api/enrollments` | `{courseId/productId}` | `{enrollment}` | session (only after confirmed payment) |

### Memberships

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I22 | GET | `/api/memberships` | none | `{memberships[], active}` | session |
| I23 | POST | `/api/memberships/purchase` | `{tierId}` | `{sessionId, url}` | session |
| I24 | POST | `/api/memberships/cancel` | `{membershipId}` | `{ok}` | session |
| I25 | GET | `/api/memberships/gate/:resource` | path resource | `{allowed, reason}` | session |

### Learning (dashboard, lessons, progress, certificates)

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I26 | GET | `/api/dashboard` | none | `{courses, progress, upcoming}` | session |
| I27 | GET | `/api/lessons/:id/progress` | path id | `{completed, percent, lastPosition}` | session |
| I28 | POST | `/api/lessons/:id/progress` | `{completed, position}` | `{ok}` | session |
| I29 | GET | `/api/certificates` | none | `{certificates[]}` | session |
| I30 | GET | `/api/certificates/:id` | path id | `{certificate, pdfUrl}` | session |

### Community

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I31 | GET | `/api/community/groups` | none | `{groups[]}` | public |
| I32 | GET | `/api/community/groups/:id` | path id | `{group, posts[]}` | public |
| I33 | POST | `/api/community/posts` | `{groupId, content}` | `{post}` | session |
| I34 | POST | `/api/community/posts/:id/comments` | `{content}` | `{comment}` | session |
| I35 | POST | `/api/community/posts/:id/like` | none | `{liked, count}` | session |
| I36 | POST | `/api/community/contests/enter` | `{contestId}` | `{ok}` | session |

### Library

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I37 | GET | `/api/library/videos` | query | `{videos[]}` | public |
| I38 | GET | `/api/library/audio` | query | `{audio[]}` | public |
| I39 | GET | `/api/library/:type/:id` | path type, id | `{item, streamUrl}` | session |

### Coaching / appointments / webinars

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I40 | GET | `/api/appointments/availability` | query (date, staff) | `{slots[]}` | public |
| I41 | POST | `/api/appointments` | `{slotId, notes}` | `{appointment}` | session |
| I42 | POST | `/api/webinars/register` | `{webinarId}` | `{registration, icsUrl}` | session |

### Lead magnets / forms

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I43 | POST | `/api/lead-magnets/:slug/claim` | `{email}` | `{ok, downloadUrl}` | public |
| I44 | POST | `/api/forms/contact` | `{name, email, message}` | `{ok}` | public |
| I45 | POST | `/api/forms/mailing-list` | `{email}` | `{ok}` | public |

### AI assistant

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I46 | POST | `/api/ai/chat` | `{message, conversationId}` | `{reply}` (streaming) | session |
| I47 | GET | `/api/ai/limits` | none | `{used, limit, reset}` | session |

### Admin

| # | Method | Endpoint | Payload | Response | Auth |
|---|---|---|---|---|---|
| I48 | GET | `/api/admin/courses` | none | `{courses[]}` | admin |
| I49 | POST | `/api/admin/courses` | `{course}` | `{course}` | admin |
| I50 | PUT | `/api/admin/courses/:id` | `{course}` | `{course}` | admin |
| I51 | DELETE | `/api/admin/courses/:id` | none | `{ok}` | admin |
| I52 | GET | `/api/admin/users` | query | `{users[]}` | admin |
| I53 | GET | `/api/admin/orders` | query | `{orders[]}` | admin |
| I54 | GET | `/api/admin/settings` | none | `{settings}` | admin |
| I55 | PUT | `/api/admin/settings` | `{settings}` | `{settings}` | admin |

---

## Observed vs inferred summary

| Category | Observed | Inferred |
|---|---|---|
| Public font/language/upload/error-log | O1–O4 | — |
| Auth | — | I1–I6 |
| Catalog/courses/books/blog | — | I7–I15 |
| Commerce/checkout/orders/enrollments | — | I16–I21 |
| Memberships | — | I22–I25 |
| Learning/dashboard/lessons/certificates | — | I26–I30 |
| Community | — | I31–I36 |
| Library | — | I37–I39 |
| Appointments/webinars | — | I40–I42 |
| Lead magnets/forms | — | I43–I45 |
| AI assistant | — | I46–I47 |
| Admin | — | I48–I55 |

---

## Gaps
- Only O1–O4 and env vars are [observed] in the reference JS chunks. Everything else is [inferred].
- Request/response payloads, status codes, and exact auth enforcement for I1–I55 are not observable; conservative REST shapes used.
- Webhook signature verification and idempotency keys [inferred] — Stripe test mode in rebuild.
