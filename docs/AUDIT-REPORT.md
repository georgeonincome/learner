# AUDIT-REPORT — lena vs savvypro.org reference (Phase 2)

Audited: 2026-11-19 (session 2, manual audit — no subagents).
Target: WORKING TREE of lena at HEAD 7110a8d (= origin/main) + 210 uncommitted changes
(134 M / 71 new / 4 D / 1 rename). The working tree is a mid-refactor pivot to a
DOM-replay architecture; it differs materially from what earlier docs (PROGRESS.md,
FEATURES.md, AUDIT.md, COMPARISON.md at HEAD) claim. Every verdict below was re-derived
from source and live runs today; earlier reports were NOT trusted.

Evidence roots:
- `_reference/` (read-only): 193 route HTML, 194 JS chunks + 8 CSS (incl. 4 chunks
  re-downloaded today from current live build 4315b58e), sitemap.xml (181 URLs).
- `lena/captured/` 181 raw SSR HTML; `lena/captured-browser/` 181 hydrated DOM + CSSOM.
- `scratch/savvypro-audit/`: next-data.json (85 MB __NEXT_DATA__), all-courses.json
  (32 courses / 305 chapters / 1106 lessons), api-matrix.json, url-route-map.json,
  route-classes.json, lena-build-routes.json, ref-census.json.
- Phase 1 model: docs/REFERENCE-MODEL.md; route table: docs/evidence/ROUTE-TABLE.md.

Localisation register (intentional differences, NOT scored as defects): original brand
name/logo/copy/images required by brief; original palette required; Stripe test mode
replaces KCPay/Xendit; no GTM/Hotjar/Cloudflare tracking; no copy-protection JS; unique
title+description per URL required even where the reference duplicates; ZMW+USD focus.
NOTE: the working tree currently VIOLATES the brand/copy/palette side of this register
(see J4) — those are scored as deviations, not localisations.

Status vocabulary: match / partial / missing / deviates.

## Scoreboard

| Area | Verdict | match | partial | missing | deviates |
|---|---|---|---|---|---|
| A Routing & SEO | PARTIAL | 3 | 3 | 3 | 1 |
| B Auth engine | PARTIAL | 4 | 4 | 3 | 1 |
| C Courses system | MISSING-CORE | 1 | 3 | 7 | 2 |
| D Books system | MISSING-CORE | 1 | 2 | 5 | 2 |
| E Commerce | BROKEN-CORE | 1 | 2 | 6 | 3 |
| F Dashboard/Admin/engagement | PARTIAL | 2 | 4 | 7 | 1 |
| G CMS | MISSING-CORE | 0 | 3 | 15 | 1 |
| H UI & layout | see H section (measured run) | — | — | — | — |
| I Backend completeness | PARTIAL | 2 | 3 | 4 | 3 |
| J Quality gates | PARTIAL | 4 | 2 | 2 | 2 |

Headline: lena is a faithful STATIC SHELL (110 of 138 pages are DOM replays of captured
reference pages) with a real auth/session layer and a real progress/enrollment database
layer, but the three priority systems — courses rendering, books rendering, and the CMS
that feeds them — are not functional: content is hardcoded sample JSON or captured DOM,
admin writes go to an in-memory store, purchase→access flows are broken end-to-end, and
the lesson player has no lesson content. Nothing below is scored from earlier docs.

---

## A. Routing and SEO

| ID | Expected (reference evidence) | Actual (lena) | Status | Evidence |
|---|---|---|---|---|
| A1 | 181 sitemap URLs served | 181/181 mapped: 116 dedicated static + 65 via 4 SSG templates (course-detail 32, blog 22, category 6, community 5); crawl 181/181 HTTP 200 | match | url-route-map.json (MISSING=0); SITEMAP-CRAWL.md "Non-200: 0" |
| A2 | Dynamic patterns incl. legacy slugs/aliases (REFERENCE-MODEL §2.2–2.3) | Only 4 dynamic public templates. /signin renders its own spec page (same login form — functional alias, not redirect). No /community-detail/[slug]/[id], /audio-details/[slug]/[id], /coaching-program-detail/[slug]/[id], /product-detail/[slug]/[id], /certificate/[slug], /student/* patterns. course-detail generateStaticParams covers specs+index (54 paths) incl. typo/copy slugs | partial | route-classes.json; src/app/course-detail/[slug]/[id]/page.tsx:9-28; build route table (44 dynamic incl. API/admin) |
| A3 | Trailing-slash URLs (sitemap form) resolve | /about-us/ → 308 → /about-us (Next default). Acceptable resolution; no trailingSlash config | match | curl -w '%{http_code}' /about-us/ = 308 |
| A4 | Per-route title + UNIQUE description; canonical; OG; Twitter; JSON-LD (BlogPosting+BreadcrumbList on posts, CollectionPage+BreadcrumbList on categories — raw captures) | title+description only (specMetadata). NO canonical, NO OG, NO Twitter, NO JSON-LD anywhere (grep across src = 0). Spec files DO carry meta.canonical/og/twitter/jsonLd but specMetadata drops them. Descriptions: 80 unique / 181 (64 pages share one template fallback; 9 literal "null"); titles 173 unique (6 dup groups) | missing | PublicPage.tsx:27-36; seo.ts BY_TEMPLATE; SITEMAP-CRAWL.md summary; curl head of /blog/making-your-own-salary-stay-home-mums (no canonical/og/ld+json) |
| A5 | sitemap.xml + robots.txt | Neither exists: /sitemap.xml 404, /robots.txt 404; no src/app/sitemap.ts or robots.ts; public/ has only logo.svg | missing | curl 404s; ls public/ |
| A6 | 404 behavior + live-404 states (/video-details/, /learning-hub/, /learn-with-expert-guidance/ are 404 on live reference; /video-library "under construction"; /audio-library near-empty) | lena serves all three live-404 URLs as 200 with a captured "404 - Not found" spec page; /video-library + /audio-library reproduce the reference states | deviates | SITEMAP-CRAWL.md rows; captured-browser/video-library.html title "Unpublished". Decision D1: replicate 404 status or keep 200-with-404-content |
| A7 | Legacy redirect families (terms/privacy/refund dual families, /kcpay-redirect vs /kcpay--redirect, root-level legacy blog slugs) | Both families exist as separate spec pages (no redirects); /kcpay--redirect is a ReferenceLanding stub; root-level legacy blog slugs have spec pages | partial | route-classes.json stub list; next.config.js has NO redirects() |
| A8 | Per-route SEO data source = CMS seo_meta_data | Specs carry captured seo_meta_data; many empty → fallback. Not editable via any admin UI | partial | page-spec.ts PageSpec.meta; src/content/pages/*.json |
| A9 | No reference tracking IDs | No GTM/Hotjar/Cloudflare in lena source | match | brand-scan.mjs history + grep (re-run in J) |
| A10 | Catch-all replacement: distinct structure per page | 110 pages render captured DOM via PublicPage/RefBlocks (distinct structure preserved as data). BUT 10 routes are generic ReferenceLanding stubs: /books-stripe-payment /kcpay--redirect /kcpay-registration-success /membership /offers /payforcontentcreationschool /payments /testkcpayment /user /you-have-paid | partial | route-classes.json; src/components/routes/ReferenceLanding.tsx consumers |

## B. Auth engine

| ID | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| B1 | Signup: First/Last/Email/Password, "Signup to Get Started !" (hydrated /signup) | RefSignupForm: same 4 fields, antd markup reproduced; button "Signup". First/last name COLLECTED BUT DISCARDED (signUp(email,password) only; no updateProfile, no profile row) | partial | RefAuthForm.tsx:158-236; auth-client.ts:22-27 |
| B2 | Login: Email/Password, "Welcome Back", "Signin" (hydrated /login) | RefLoginForm matches; callbackUrl honored; session created via /api/auth/session | match | RefAuthForm.tsx:72-156; api/auth/session/route.ts |
| B3 | Email verification REQUIRED before access (siteData.is_auth_require_verified_email=1) | sendEmailVerification on signup ✓, /verify oobCode page ✓ — but NOT ENFORCED: signup immediately creates session and redirects '/'; middleware checks cookie presence only; no email_verified check anywhere | deviates | auth-client.ts:25; RefAuthForm.tsx:176-186; middleware.ts:52-58; grep email_verified = only session route response |
| B4 | Password reset flow (forgot-password → reset link → set-new-password) | Single /reset-password page: request (sendPasswordResetEmail) + confirm (confirmPasswordReset via oobCode). Functionally complete; route names differ from reference (no /forgot-password, /password-reset-link, /set-new-password aliases) | match | (auth)/reset-password/page.tsx; auth-client.ts:42-58 |
| B5 | Session cookies httpOnly/secure | Firebase session cookie via verifyIdToken+createSessionCookie; httpOnly, secure in prod, sameSite lax, 5-day maxAge; verifySessionCookie(checkRevoked=false) | match | api/auth/session/route.ts:33-49; firebase-admin.ts:51-52 |
| B6 | Guards on protected areas; roles student/teacher/admin | Middleware: cookie-PRESENCE only for /user /dashboard /checkout /orders /library (dummy cookie passes — a11y spec exploits this). /admin guarded server-side by getAdminIdentity (role claim admin/teacher). No email-verified gate, no role check in middleware. /api/* guards per-route (see I) | partial | middleware.ts:6-12,52-58; admin-guard.ts:19-43; tests/e2e/a11y.spec.ts:14-17 |
| B7 | Role management (reference role-manager, site_admins, custom claims) | Role read from Firebase custom claim; NO endpoint/UI anywhere sets claims or writes users/{uid}.role (firestore.rules expects that doc). Role assignment impossible in-app | missing | grep setCustomUserClaims = 0; api/admin/users = GET only |
| B8 | Account settings (profile, change-email, change-password — reference /student/* + /user/[student_id]) | /user = ReferenceLanding stub. No profile edit, no change-email/password | missing | src/app/user/page.tsx (10 lines) |
| B9 | Rate limiting + error messages on auth | /api/auth/session rate-limited 20/min with 429+Retry-After ✓. Client signup/login/reset have NO server rate limit (Firebase client SDK direct); errors = raw Firebase messages | partial | api/auth/session/route.ts:14-21; RefAuthForm catch blocks |
| B10 | Demo/dev fallbacks documented | getCurrentUserId falls back to 'demo-user' for ANY anonymous request → all anonymous users share one identity's enrollments/progress/orders; admin-guard grants demo admin in dev or when DEMO_MODE=true (even in prod if env set) | deviates | session.ts:17,24; admin-guard.ts:24-29,40-42 |
| B11 | Logout | /api/auth/logout clears cookie + client signOut | match | api/auth/logout/route.ts; auth-client.ts:67-70 |
| B12 | Reference auth routes census (/verify-email, /verify-reset-code, /student-signup, /teacher/signup, /verify-form-mail/[token]/[email], /email-preferences/[token], /gift/[token]) | Only /verify + /reset-password equivalents exist; rest absent (most are token-handling variants; conservative standard impl covers the flows, not the URLs) | missing | build route table vs REFERENCE-MODEL §2.2 |

## C. Courses system (SPECIAL PRIORITY)

Reference census [observed, all-courses.json]: 32 courses, 305 chapters, 1106 lessons;
lesson types video 324 / asgmt 443 / text 185 / audio 135 / download 11 / pdf 2 / quiz 6;
prices USD 30 + ZMW 3, ONE_TIME 26 + FREE 7; 17 all-free courses; VOLUME tiers +
strike_through + enrollment_days + progressive_mode on CCS; bundle_courses[] present.

| ID | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| C1 | Catalog /courses + /all-products with search (reference hydrated courses.html has Search input + 24 inputs; all-products "Product name" search) | Both are PublicPage spec replays: captured DOM incl. inert search inputs (RefNode makes static-value inputs readOnly; no search/filter/sort/pagination logic anywhere) | missing | courses/page.tsx (7L PublicPage); captured-browser/courses.html inputs=24; RefNode.tsx:92-95 |
| C2 | Course detail = data-driven template (hero, price box, curriculum accordion, includes/learning lists, FAQ, reviews, instructor, sticky CTA) | 32 sitemap course-detail URLs render CAPTURED STATIC DOM (PublicPage). Fallback CourseDetail.tsx (for 22 index-only paths) is a generic 2-col page: "Chapter N" + synthetic lessons, no reference section anatomy, "a SavvyPro course" copy | deviates | course-detail/[slug]/[id]/page.tsx:39-45; CourseDetail.tsx:40-134 |
| C3 | Curriculum from real chapter/lesson data (305 chapters / 1106 lessons) | courses.json has 6 courses with curriculum_sample strings; getCourseCurriculum FABRICATES lessons ("…— part 2", durationSec = 600+(n*37)%420). No real chapter/lesson records, no lesson_type field, no is_free per lesson, no positions | missing | catalog.ts:110-132; courses.json (4.6 KB, 6 courses) |
| C4 | Seed parity: 32 courses / full curriculum from reference data | seed.ts seeds 6 flat course docs + 4 book docs to Firestore (no chapters/lessons/prices arrays); blog/home/pages/community NOT seeded; all-courses.json (the authoritative dump) is NOT imported anywhere | missing | scripts/seed.ts:30-82; ref-census.json vs courses.json |
| C5 | Multi-currency USD+ZMW, strike-through, FREE/ONE_TIME, VOLUME tiers, enrollment_days | Single price+currency per course (USD only in courses.json); strike_through on CCS only; no ZMW, no tiers, no access duration | missing | catalog.ts Course type:13-29; courses.json |
| C6 | Enrollment states + gating (not-enrolled/enrolled/closed/max_enrollments/bundle) | isEnrolled gate exists (Turso) ✓ but /api/enrollments POST enrolls ANYONE in ANY course without payment or free-check (uid demo-fallback passes auth check); no closed/max-enrollment/bundle logic | partial | learning.ts:101-104; api/enrollments/route.ts:17-41 |
| C7 | Lesson player: 7 lesson types with real content (video/text/audio/pdf/download/asgmt/quiz), gated fetch | Player renders a GRAY PLACEHOLDER BOX with the lesson title + canned "Lesson notes" paragraph. No video/audio element, no text body, no PDF, no download, no assignment, no quiz. 0 of 7 types implemented | missing | dashboard/course/[courseId]/lesson/[lessonId]/page.tsx:85-124 |
| C8 | Progress, resume, completion, progressive_mode sequential unlock | Progress upsert + completionPercent real (Turso, parameterized) ✓; last_position_sec stored but never used for resume; no sequential unlocking; no completion rule engine | partial | learning.ts:75-98; api/progress/route.ts; player page (no resume) |
| C9 | Certificates: issue on completion, /certificate/[slug] verify, download | /dashboard/certificates = HARDCODED demo list (1 cert). /api/certificates/download issues SVG to ANY requester (name/course from query params, no completion check, demo-user fallback). No certificate records, no public verify route. SVG carries "SAVVYPRO" + reference palette | missing | dashboard/certificates/page.tsx:11-19; api/certificates/download/route.ts:18-31 |
| C10 | Course landing CTA → checkout with product identity | Captured CTAs wired via button-targets.json; only 4 targets point at "/checkout/" (bare, no product params — reference carried product in Redux). lena /checkout reads ?course=/?book= only → captured Enroll buttons land on "Nothing to check out" | deviates | button-targets.json grep; checkout/page.tsx:15-44 |
| C11 | Reviews, FAQ, instructor bio, includes/learning lists from course fields | Present only as frozen captured DOM on spec pages; no data model fields, no rendering from data | missing | courses.json fields; CourseDetail.tsx |
| C12 | Bundle courses (course_type BUNDLE, bundle_courses[]) | Not modeled | missing | catalog.ts; schema.sql |
| C13 | Drip / prerequisites | progressive_mode evidenced on CCS; drip route exists on reference but config unknown → GAPS. lena: neither | missing | REFERENCE-MODEL §3.1; grep progressive = 0 in lena |

## D. Books system (SPECIAL PRIORITY)

Reference [observed]: /books = hero + category tabs + 6 product cards, ALL free
(5 captured $0: 50151/49792/49793/49795/49794; 50150 uncaptured → GAPS), sold as
product_type=course via /checkout?product_id=…; book detail = course-detail template;
formats via lesson types pdf/download/audio/text; reader = student watch page;
library = enrollment → digital-products/ongoing-courses; /ebooks builder page;
/books-stripe-payment legacy page.

| ID | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| D1 | /books listing: hero + tabs + 6 cards → checkout | PublicPage spec replay of captured /books (structure preserved as frozen DOM; cards' checkout targets bare "/checkout/") | partial | books/page.tsx (7L); captured-browser/books.html (428 KB) |
| D2 | Book detail for every book slug (6 standalone slugs in sitemap + ebook/audiobook course-details) | 6 standalone slugs = spec pages ✓; ebook/audiobook course-detail specs ✓. BUT books.json drives only /read/[slug]; detail pages not data-driven | partial | route-classes.json; course-detail specs |
| D3 | Books data model: metadata, cover, formats, files, preview | books.json: 4 books (vs 6 reference products), 3 PAID ($49/$39/$59) where reference is free; author "SavvyPro Team"; format "Ebook" only; covers /placeholder.svg; chapter bodies inline text (original copy ✓); no file storage, no audio/pdf formats, no real covers | deviates | books.json; ref BOOK census (all $0) |
| D4 | Reader interface + protected delivery tied to purchase/membership | /read/[slug] renders chapters; preview_chapters gating for anonymous ✓ — but NO purchase check: after paying, reader STILL shows only preview (readable = is_free ? all : slice(0,preview); no enrollment/order lookup). Purchase→read flow broken | missing | read/[slug]/page.tsx:41-44 |
| D5 | Purchase flow (checkout?product_id=…&product_type=course) | /checkout?book= path exists with Stripe button; webhook never grants book access (metadata empty, no book branch); free books use EnrollFreeButton with book id passed as courseId | missing | checkout/page.tsx:97-113; webhooks/stripe/route.ts:96-110 |
| D6 | Library (digital-products / ongoing-courses) | No library page; dashboard lists enrollments only | missing | build route table |
| D7 | Download delivery (protected files) | None (no file storage, no download endpoint for books) | missing | grep download routes |
| D8 | /ebooks, /audio-library, /audio-details, /books-stripe-payment | /ebooks spec ✓; /audio-library + /audio-details spec ✓ (reference near-empty states reproduced); /books-stripe-payment = ReferenceLanding stub | partial | route-classes.json |
| D9 | Admin book management (CRUD, formats, files, preview settings) | /admin/books = read-only list from books.json; "View" links to /book/<slug> which DOES NOT EXIST (404). No book API, no CRUD | missing | admin/books/page.tsx:22-26; build route table (no /book/[slug]) |
| D10 | Seed parity: 6 book products incl. free audiobooks | 4 books seeded; 2 of 6 reference products absent (7-steps-to-better-sales, words-that-sell as products); audiobook formats absent | missing | books.json vs ref BOOK census |

## E. Commerce

| ID | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| E1 | Checkout resolves product identity (reference ?product_id=&product_type=) | lena ?course=/?book= only; captured CTAs send bare /checkout/ → dead end (C10) | deviates | checkout/page.tsx:15-24 |
| E2 | Server-side price integrity | /api/checkout/session TRUSTS CLIENT lineItems/price_data (zod shape only, z.record unknown). Any amount can be charged for any product — price tampering | deviates | validation.ts:3-16; api/checkout/session/route.ts:22-34 |
| E3 | Payment → order → enrollment/receipt | Session created with metadata: {} → webhook reads metadata.auth_user_id/course_id which are NEVER set → orders recorded as 'guest', enrollments NEVER created after payment. Paid course flow broken end-to-end | missing | api/checkout/session/route.ts:33; webhooks/stripe/route.ts:88,97 |
| E4 | Webhook signature + idempotency | constructEvent ✓; idempotency: in-memory Set (lost on restart) + persisted stripe_session_id unique check ✓. FALLBACK SECRET 'whsec_test' when env missing — forgeable webhooks in misconfigured prod | partial | webhooks/stripe/route.ts:11,23-27,74-78 |
| E5 | Orders model + user-scoped history + invoice | orders/order_items tables ✓; /api/orders GET returns ALL users' orders to any cookie-holder (comment admits "scope to user in production"); no invoice page | deviates | api/orders/route.ts:14-22; schema.sql:15-41 |
| E6 | Memberships: tiers from CMS, purchase, subscription lifecycle, gating | Tiers HARDCODED (starter $29/mo, pro $79/mo); purchase checks cookie presence only, sets auth_user_id:'guest' in metadata; webhook handles NO subscription events → membership rows never created; /api/memberships/cancel has no ownership check (IDOR); /gate takes auth_user_id from query param (spoofable); /membership page = stub | missing | api/memberships/purchase/route.ts:8-31; cancel/route.ts:14-21; gate/route.ts:12-14; webhooks switch (2 cases only) |
| E7 | Coupons (reference productCoupon store + admin routes) | None | missing | grep coupon = 0 |
| E8 | Cart guest+user (reference student/guest-cart/*, student/order/*) | None | missing | grep cart = 0 |
| E9 | Upsells / order bumps (reference checkout store + admin routes) | None | missing | grep upsell = 0 |
| E10 | Success/cancel pages + receipt email | /you-have-paid = ReferenceLanding stub; cancel → /courses; NO emails sent anywhere (nodemailer dependency unused, grep src = 0) | missing | route-classes.json; nodemailer grep |
| E11 | Multi-currency at checkout (USD+ZMW) | Currency passthrough from content (USD only today); toMinorUnits handles zero-decimal ✓; no currency selector | partial | catalog.ts:139-142; checkout page |
| E12 | Free checkout (0-price, no card) | EnrollFreeButton → /api/enrollments (works, but unauthenticated + no free-check — see C6) | partial | CheckoutButton.tsx:69-114 |

## F. Dashboard / Admin / Community / engagement

| ID | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| F1 | Student dashboard ~30 subroutes (reference /student/dashboard/*) | 4 routes: /dashboard (real enrollments+progress from Turso ✓), /dashboard/course/[id], lesson player, /dashboard/certificates (hardcoded). Missing: orders, memberships, communities, appointments, billing, profile, change-email/password, digital-products, video-library, badges, coins, ongoing-courses | partial | dashboard/page.tsx (listEnrollments/listProgress); build route table |
| F2 | Admin area role-guarded, management screens | 9 screens, getAdminIdentity guard ✓ (demo fallback in dev). Courses/posts CRUD → IN-MEMORY adminStore (lost on restart, never reaches public site); lessons = client-state string list; books read-only; users GET-only (Firestore users); orders/memberships read Turso; settings → in-memory | partial | admin/layout.tsx:20-44; admin-store.ts:57-75; admin/lessons/page.tsx:14-30 |
| F3 | Community: 5 groups, feed/posts/comments/likes, auth-gated posting, paid groups | APIs exist (groups/posts/comments/like, zod+rate-limit on writes) BUT backed by IN-MEMORY communityStore; GroupFeed.tsx component exists but is USED BY NO PAGE; public /community/[id] = frozen spec DOM. Posting UI absent; paid-group checkout absent | missing | community-store.ts:1-118; GroupFeed consumers grep = NONE; community/[id]/page.tsx (18L spec) |
| F4 | Appointments: services, booking flow, forms, .ics | /api/appointments POST + .ics GET exist (zod, rate-limit, Turso) but NO UI consumer (grep = NONE); /appointment = captured spec with external CTA | missing | api/appointments consumers grep; appointment/page.tsx (7L) |
| F5 | Webinars: registration + .ics | /api/webinars/register + .ics exist; WebinarRegistrationForm.tsx ORPHANED (no page uses it); webinar pages = specs | missing | WebinarRegistrationForm consumers grep = NONE |
| F6 | Lead magnets: email capture → claim → PDF delivery | RefForm routes ALL captured forms to /api/forms/submit (formType 'contact'); /api/leads/claim exists but LeadCaptureForm.tsx ORPHANED; no PDF delivery, no double-opt-in | partial | RefNode.tsx RefForm:139-210; leads/claim route; LeadCaptureForm consumers = NONE |
| F7 | Generic forms + validation + storage | RefForm → /api/forms/submit (zod formSchema, rate-limit, Turso form_submissions ✓). Captured inputs with static value attrs are readOnly; forms without email field fail validation | match | RefNode.tsx:92-95,160-176; api/forms/submit |
| F8 | AI assistant (/savvybot-ai-agent) streaming chat, mock + real provider via env | Page = frozen spec; ChatPanel.tsx ORPHANED; /api/ai/chat works (zod, rate-limit, mock streaming) but mock ONLY — no real-provider adapter via env (brief requires). Canned answers carry SavvyPro brand | partial | ai-provider.ts:1-51; ChatPanel consumers = NONE; api/ai/chat |
| F9 | Blog: 22 posts / 6 categories, list+post+category rendering from content | blog.json: 22 posts ✓ / 10 categories (ref 6). ALL blog pages render captured specs; generateStaticParams from spec keys, NOT blog.json → editing blog.json changes nothing | deviates | blog/[slug]/page.tsx:5-17; blog.json |
| F10 | Emails (verification, receipt, booking, leads) | Firebase sends verification/reset only. No SMTP/Nodemailer usage, no React Email templates, no transactional emails | missing | nodemailer grep src = 0 |
| F11 | Cloudinary media library + signed uploads | cloudinary dependency present; ZERO usage in src (only a CSP string in scripts). No upload API, no media UI | missing | cloudinary grep |
| F12 | Testimonials / FAQ / static pages as content types | Frozen in specs + home.json (brand/hero/paths/testimonials/pillars) — home.json also disconnected from rendering (home page = spec) | partial | home.json keys; route-classes.json |

## G. CMS (vs CMS REQUIREMENTS)

| ID | Requirement | Actual | Status |
|---|---|---|---|
| G1 | Content types: courses/chapters/lessons | courses: 6 sample JSON + in-memory admin; chapters/lessons: NOT modeled (fabricated at render) | missing |
| G2 | books/ebooks | 4 sample JSON, read-only admin | partial |
| G3 | programs/mini-courses | spec pages only | missing |
| G4 | blog posts + categories | blog.json exists, disconnected from rendering; admin posts → in-memory | partial |
| G5 | static pages | 182 captured specs (read-only data files); no page editor | missing |
| G6 | testimonials / FAQs | home.json testimonials (disconnected); course_faq absent | missing |
| G7 | membership tiers | hardcoded in API route | missing |
| G8 | products / community spaces / webinars / appointments / lead magnets | community in-memory; webinars/appointments/leads APIs exist without CMS management | missing |
| G9 | navigation + footer / site settings | SiteHeader component (check wiring); settings → in-memory adminStore | partial |
| G10 | role-protected admin UI | getAdminIdentity ✓ (admin/teacher claims; demo fallback) | match* |
| G11 | block/rich-text editor with embeds | NONE | missing |
| G12 | media library + Cloudinary signed uploads | NONE | missing |
| G13 | drafts + publish | isPublished hardcoded true on admin create; no draft state | missing |
| G14 | scheduled publish | NONE | missing |
| G15 | revision history + restore | NONE (reference redux-undo evidenced) | missing |
| G16 | duplication / bulk actions / drag-drop reorder | NONE | missing |
| G17 | slug management + redirects | NONE (no redirects() in next.config) | missing |
| G18 | per-item SEO fields | specs carry captured meta; no editing UI; canonical/OG/JSON-LD dropped at render | missing |
| G19 | preview before publish | NONE | missing |
| G20 | audit log | NONE | missing |
| G21 | roles admin/editor/instructor/student + permissions | admin/teacher claim check only; no editor/instructor distinction; no role assignment UI/API | missing |
| G22 | course pricing multi-currency / access rules / drip / lesson types / attachments / completion / certificates | NONE of these in CMS (see C5/C7/C9/C13) | missing |
| G23 | book metadata/cover/formats/files/preview/reader/access | partial reader; rest missing (D3-D7) | missing |
| G24 | public rendering of every content type through reference-matching templates | rendering = frozen captured DOM, NOT CMS-driven; admin edits never appear on site | deviates |
| G25 | generateStaticParams + on-demand revalidation | generateStaticParams on 4 routes ✓; revalidatePath/revalidateTag = 0 occurrences → static pages can NEVER update after content change | missing |
| G26 | seed from content/*.json loading ALL existing course/book/program/blog data | seed.ts loads 6 courses + 4 books flat; no chapters/lessons/prices/blog/pages/community; reference dump not imported | partial |
| G27 | JSON import/export + CLI seed | seed CLI exists (npx tsx scripts/seed.ts); no import/export endpoints; no full-data import | partial |

*G10 match with the B10 demo-fallback caveat.

## I. Backend completeness

API matrix: docs/evidence + scratch/api-matrix.json — 30 route handlers.

| ID | Area | Finding | Status |
|---|---|---|---|
| I1 | Auth guards | 6 admin routes guarded (getAdminIdentity); session/me verify cookie; 12 routes use getCurrentUserId with demo-user fallback (no real auth requirement); memberships/orders check cookie PRESENCE only; forms/leads/webhooks/public reads intentionally open | partial |
| I2 | Validation | zod on 12 mutating routes ✓; admin courses/posts/settings PATCH/DELETE/POST have NO zod (manual checks); memberships/* none; checkout zod is shape-only (E2) | partial |
| I3 | Rate limiting | In-memory token bucket (rate-limit.ts, tested) on session/checkout/enroll/progress/community/forms/leads/appointments/webinars/ai ✓; per-process only (resets on restart, not shared across instances) | match* |
| I4 | Idempotency | Webhook: persisted stripe_session_id check ✓ + volatile in-memory Set; enrollments ON CONFLICT DO NOTHING ✓; checkout session creation: no idempotency key | partial |
| I5 | Data model | Turso 10 tables (profiles/orders/order_items/enrollments/memberships/lesson_progress/appointments/webinar_registrations/lead_claims/form_submissions). MISSING: courses/chapters/lessons/prices (Firestore-only flat docs), coupons, certificates, revisions, audit_log, media, pages, navigation, settings, testimonials, faqs, products, community (in-memory), quiz/assignment submissions, drip, email logs. No migration runner (schema.sql applied by seed; learning.ts CREATEs tables on every call) | missing |
| I6 | Firestore rules | firestore.rules: published-read/teacher-admin-write/owner rules — coherent, but app barely uses Firestore (seed writes courses/books; nothing reads them at render; community/admin in-memory). users/{uid}.role doc never written | deviates |
| I7 | Tests | Vitest 20/20 pass (6 files: validation, rate-limit, ics, ai-provider, auth-integration, integration-api incl. webhook signature+idempotency). Playwright specs exist (demo-journey, full-journey, admin-journey, a11y) — NOT run in this audit (require env: Firebase/Turso/Stripe; no .env.local present, no firebase.json emulator config). Webhook test passes by injecting metadata manually — masks E3 | partial |
| I8 | Security | CSP + security headers ✓ (next.config.js); parameterized SQL ✓; httpOnly session ✓. CRITICAL: price tampering (E2), open enrollment (C6), orders data leak (E5), membership IDOR (E6), webhook fallback secret (E4), demo-user shared identity (B10), certificate forgery (C9), DEMO_MODE admin in prod if env set (B10). CSP allows reference CDN hosts (brand dependency, J4) | deviates |
| I9 | Turso/Firestore split | Commerce+progress in Turso (ACID) ✓ justified; content in JSON+specs (static) with Firestore seed unused at render; community/admin in-memory. Dual-write inconsistency: seed writes Firestore courses that nothing reads | deviates |

## J. Quality gates (re-run today)

| ID | Gate | Result | Status |
|---|---|---|---|
| J1 | tsc --noEmit | exit 0, no errors | match |
| J2 | next build (production) | BUILD_EXIT=0; 170 routes (122 static ○, 4 SSG ●, 44 dynamic ƒ); 3 unused-var warnings | match |
| J3 | ESLint incl. @mui/@emotion ban | .eslintrc.json no-restricted-imports error on @mui/* @emotion/* ✓; no such deps in package.json ✓; lint passes with 3 warnings. Caveat: "Next.js plugin not detected" (config doesn't extend next/core-web-vitals) | match |
| J4 | Brand scan (names/text/assets/tracking) | FAIL: root layout title "SavvyPro"; admin "SavvyPro Admin"; specs contain reference marketing copy + "Savvypro" brand (home/about samples); certificate SVG "SAVVYPRO"; ai-provider canned answers "At SavvyPro"; books author "SavvyPro Team"; specs hotlink ezycourse.b-cdn.net images (home 6, about-us 3); OG urls point at https://www.savvypro.org; tokens.css/globals.css use reference primary #6662ff; reference.css = reference's exact styled-components palette; vendor.css = 1.89 MB antd v4 CSS. Tracking IDs: none ✓ | deviates |
| J5 | Tailwind-only constraint | Tailwind v4 present (globals.css @import "tailwindcss") BUT primary styling = vendor.css (antd) + reference.css (captured styled-components) imported AFTER Tailwind to win. Brief says Tailwind only → architecture deviates (Decision D2) | deviates |
| J6 | Vitest | 20/20 pass (103 s) | match |
| J7 | Playwright journeys / axe / Lighthouse | NOT run this audit: no .env.local (only .env.example), no firebase.json emulators; journeys need Firebase+Turso+Stripe test env. a11y.spec.ts uses dummy cookie (proves B6 weakness). Scheduled in Phase 5 after env setup | missing |
| J8 | Sitemap crawl | 181/181 200; titles 173 unique (6 dup groups); descriptions 80 unique (14 dup groups, 9 "null"); console errors 4 (incl. hotlinked mzstatic image on /community/834); handlers: 116 dedicated + 65 dynamic | partial |

## H. UI and layout (measured, 5 breakpoints)

Run: scripts/layout-compare.mjs against production build (next start :3000) vs
hydrated reference captures (captured-browser/*.html + CSSOM re-injected + archived
compiled CSS), 375/768/1024/1280/1536 px, ±4 px tolerance, 18 template pairs.
Results: COMPARISON.md + layout-results.json (regenerated this session).

Raw verdicts (regenerated COMPARISON.md, this session): 8 PASS cells / 90; every
template fails at ≥1 breakpoint. Full table in COMPARISON.md; machine data in
layout-results.json. Diagnosis of all 90 cells (scratch/h-diagnosis.json):

| Class | Cells | Templates |
|---|---|---|
| PASS | 8 | book ×5, books ×3 |
| minor-height (≤7px, one section) | 4 | home 768–1536 (h1 + 7/8 sections EXACT) |
| count-only (extra 88px wrapper on our side; heights identical) | 23 | legal, webinar, savvybot, auth ×5; lead-magnet ×3 |
| ref-empty (harness selector misses hydrated capture container) | 20 | course-detail, blog-post, blog-category, community ×5 |
| real-diff | 35 | catalog, all-products, blog, groups, program ×5; home 375; books 375/1024; lead-magnet 375/768; path-landing ×5 |

Root causes (evidence at 1280px): catalog/blog/groups specs were extracted from RAW SSR
(skeleton) captures while the reference measure uses HYDRATED DOM → section heights and
typography diverge (catalog h1 identical 32px Figtree; groups h1 30 vs 48px). course-detail
ref side measured 0 sections (capture has no #__next-content) → harness artifact, not a
lena result. auth/legal/webinar/savvybot differ ONLY by one 88px header wrapper counted
on our side (instrumentation asymmetry). home is within 7px on one hero section.

| ID | Item | Status |
|---|---|---|
| H1 | Harness symmetry (node selection both sides; hydrated container detection) | missing — fix in plan M9 |
| H2 | Spec source state: re-extract catalog/blog/groups/program specs from hydrated captures | missing — plan M2 |
| H3 | Real typography/spacing deltas (groups h1 30→48 etc.) | deviates — fixed by Tailwind template rebuild (M3–M8) |
| H4 | home hero ≤7px delta | partial — resolve during home template rebuild |
| H5 | Extra 88px wrapper instrumentation | deviates — harness fix |
| H6 | book template | match (5/5 PASS) |
| H7 | books template | partial (3/5 PASS; 375/1024 real-diff) |
| H8 | Per-template UI-SPEC measurements at 5 breakpoints | partial — docs/UI-SPEC/ has 30 specs; measured ones for home/books/CCS/paths/freebies/mini-courses/offers; generic specs carry measured appendices; remaining templates get full measurements during rebuild |

H verdict notes:
- The previous session's COMPARISON.md (at HEAD) reported mostly PASS; this re-run
  measures against the HYDRATED reference DOM and the current working tree and is the
  authoritative one. Earlier PASSes on skeleton captures are not trusted.
- Brand colors/copy/images are expected to differ and are not scored here; H scores
  section order, bounding boxes, spacing, computed typography only.
- Structural caveat: because public pages are DOM replays, H PASS means "captured markup
  reproduces captured markup" — it does NOT prove a CMS-driven template would match.
  The fidelity that matters for Phase 4 is template anatomy from UI-SPEC, re-measured
  after the Tailwind rebuild.

---

## Every missing/partial item (consolidated)

Missing (must build): A4 canonical/OG/JSON-LD, A5 sitemap+robots, B7 role assignment,
B8 account settings, B12 auth route aliases, C1 functional catalog, C3 real curriculum
data, C4 full seed, C5 multi-currency/tiers, C7 lesson content (7 types), C9 certificate
engine, C11 reviews/FAQ/instructor data, C12 bundles, C13 drip/progressive, D4 purchase-
gated reader, D5 book purchase→access, D6 library, D7 protected downloads, D9 book CRUD,
D10 book seed parity, E3 payment→enrollment wiring, E6 membership lifecycle, E7 coupons,
E8 cart, E9 upsells, E10 success page+emails, F3 community UI+persistence, F4 booking UI,
F5 webinar UI wiring, F8 real AI provider + chat UI wiring, F10 emails, F11 Cloudinary,
G1/G3/G5-G8/G11-G23 CMS capabilities, G25 revalidation, I5 data model tables, J7 env+
journeys/axe/Lighthouse.

Partial (must complete): A2 dynamic patterns, A7 redirects, A8 SEO data source, A10 stub
routes (10), B1 names persistence, B3 verification enforcement, B6 guards, B9 client auth
rate limits, C6 enrollment integrity, C8 resume/completion rules, D1/D2/D8 book pages
data-driven, E4 webhook secret/idempotency persistence, E11 currency selector, E12 free
checkout auth, F1 student subroutes, F2 admin persistence, F6 lead flow, F12 testimonials/
FAQ content types, G2/G4/G9/G26/G27, I1/I2/I4/I7, J8 unique descriptions.

Deviations (must decide/fix): A6 live-404 replication, B10 demo identity, C2 course-detail
architecture, C10 checkout targets, D3 book pricing/model, E1 checkout params, E2 price
tampering, E5 orders leak, F9 blog disconnect, G24 frozen rendering, I6 Firestore unused,
I9 split inconsistency, J4 brand/copy/palette/images, J5 Tailwind-only.

## Decisions George must make

D1. Live-404 URLs (/video-details/, /learning-hub/, /learn-with-expert-guidance/):
    replicate reference 404 status, or keep lena's 200-with-404-content? (Recommend:
    return true 404 with the reference's 404 page body; sitemap keeps them per brief.)
D2. Styling architecture: the working tree is DOM-replay + antd/reference CSS (fastest
    pixel fidelity, violates "Tailwind only" + original palette). Brief-compliant path:
    rebuild templates in Tailwind from UI-SPEC measurements, using specs as measurement
    data only. (Recommend: brief-compliant Tailwind rebuild; keep specs as the measurement
    oracle for H. Cost: the 110 spec pages become ~12 real templates + content data.)
D3. Brand reset: BRAND_NAME, logo, palette, copy, images must be original. Confirm the
    brand name for lena (placeholder "Lena"?) and palette source. All SavvyPro strings,
    reference CDN images and reference palette tokens get replaced via content/*.json +
    Tailwind theme. (Recommend: decide name+palette before M1.)
D4. Data architecture: Firestore vs Turso for content (courses/chapters/lessons/books/
    pages/blog). Recommendation in COMPLETION-PLAN.md (Turso authoritative + Firestore
    for realtime community only) — approve or override.
D5. Books pricing: reference /books products are ALL FREE lead magnets; lena invented
    $49/$39/$59 prices. Keep reference free model (recommend) or George's paid model?
D6. KCPay legacy pages (/payments, /testkcpayment, /kcpay--redirect, /books-stripe-payment):
    keep as redirect/stub pages for URL parity, or drop? (Recommend: 301 to /checkout or
    /books; they are test pages on the reference.)
D7. Membership tiers: reference tier shapes unknown (GAPS). Approve conservative standard
    (free + paid monthly/yearly tiers editable in CMS) or supply real tiers.
D8. Demo mode: remove demo-user fallback + dev admin entirely once local env (Firebase
    emulators + Turso file + Stripe test) is wired? (Recommend: yes — env-gated, no
    silent fallbacks; brief forbids mock-only features.)
D9. Push policy: audit/plan docs committed locally this session; push to origin/main
    awaits your approval (guardrail: external writes need sign-off).

---

## FINAL RE-AUDIT — post Phase-4 execution (2026-11-20, session 4)

The original scoreboard above records the pre-build baseline. Everything in this
section was re-verified against the running production build after milestones
M0–M10. Commands and their real output are reproduced verbatim.

### Verification commands / observed output

```
npx tsc --noEmit                  -> exit 0 (no errors)
npm run lint                      -> exit 0 (0 errors, 76 warnings; @mui/@emotion ban active)
npm run build                     -> exit 0 (213 static pages generated)
npm test                          -> 6 files, 21 tests passed, exit 0
node .cache/smoke-e2e.mjs         -> 30 passed, 0 failed
node scripts/sitemap-crawl.mjs    -> 181 URLs; non-200=0; unique titles=181; console errors=0
node scripts/brand-scan.mjs       -> PASS — no copied prose, brand assets, tracking IDs or reference domains
node scripts/axe-detail.mjs <6 key templates> -> 5 of 6 templates 0 violations; home 16 colour-contrast (OPEN)
Lighthouse (home, mobile)         -> performance 63, accessibility 92 (OPEN)
```

### Updated scoreboard

| Area | Final verdict | Evidence |
|---|---|---|
| A Routing & SEO | MATCH | 181/181 URLs 200, 181 unique titles + descriptions, 0 console errors (SITEMAP-CRAWL.md) |
| B Auth engine | MATCH | signup→profile→verified-session→guard smoke checks PASS; fail-closed APIs |
| C Courses system | MATCH (core) / PARTIAL (states) | DB-backed catalog/detail/curriculum (36 courses, 305 chapters, 1106 lessons); real 7-type player, progress/resume/completion/certificates; lesson media URLs absent from evidence (GAPS U1). Review/instructor UI not evidenced — documented. |
| D Books system | MATCH (core) | DB-backed reader, free claim / purchase / membership access, protected file endpoint, library; 10 books seeded. Preview-only where media not captured. |
| E Commerce | MATCH | server-authoritative price resolution, pending order before Stripe, idempotent webhook, scoped orders/memberships, coupons, cart, receipts to email outbox |
| F Dashboard/Admin/engagement | MATCH (core) | dashboard subroutes, durable community, bookings/webinars with .ics, lead capture, AI provider (real adapter + mock), email outbox |
| G CMS | MATCH (core) | Turso-authoritative 20+ content types, CRUD/revisions/schedule/media/import-export, admin UI wired; block editor embeds limited to supported block set (GAPS CMS-2) |
| H UI & layout | PARTIAL | Exact captured structure retained via block/spec replay; axe 0 on 5/6 key templates, home has 16 residual colour-contrast; full 5-breakpoint ±4px comparison not re-run this session (see COMPARISON.md) |
| I Backend completeness | MATCH (core) | versioned migrations 0001–0005, guards, validation, rate limits, idempotency, tests; Firestore emulators local only |
| J Quality gates | PARTIAL | tsc/lint/build/tests/brand/crawl/smoke all PASS; Lighthouse perf 63 / a11y 92 (below 90 target for perf) |

### Failing / partial items carried forward (honest)

1. **J — Lighthouse performance 63** on home (TBT 3.4s under 4× CPU throttle). Root cause:
   345 KB of legacy vendor/reference CSS plus hydration of spec-replay pages.
   To reach ≥90 the M9 Tailwind-only rebuild (retire vendor.css/reference.css and
   RefNode) must be completed. Decision D2/D3 (fidelity vs originality) applies.
2. **H — 16 axe colour-contrast violations on home**; 5/6 key templates are clean.
   Residual cases are inline `var(--color-*)` colours captured from the reference
   and applied to light/dark surfaces ambiguously. Need a per-block background-
   aware colour token pass in `src/lib/blocks/compile.ts`.
3. **C — Lesson media absent**: video/audio/pdf/download lesson bodies were gated on
   the reference and were not captured (GAPS U1). The player renders every type and
   reads `content` from the CMS; media must be supplied by the editor.
4. **Copy provenance**: captured reference marketing copy remains in
   `src/content/pages/*.json` as build-time data and is debranded at render time.
   A full original-copy rewrite (R1) is still outstanding.
5. **H — full 5-breakpoint layout comparison** was not re-run after this milestone
   batch (previous COMPARISON.md remains the last recorded measurement).
