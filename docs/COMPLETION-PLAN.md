# COMPLETION-PLAN — lena to 100% of audited scope (Phase 3)

Status: AWAITING GEORGE'S APPROVAL. No Phase 4 execution until approved.
Basis: docs/AUDIT-REPORT.md (2026-11-19, manual re-audit of working tree @ 7110a8d+dirty).
Item IDs below refer to that report. Decisions D1–D9 are listed at the end of the audit
report; this plan assumes the RECOMMENDED option for each unless George overrides.

## 0. Architecture decisions (justified)

### 0.1 Data architecture: Turso authoritative, Firestore for realtime only (D4)

Decision: **Turso/libSQL is the single source of truth for ALL content and commerce**
(courses, chapters, lessons, prices, books, programs, blog, pages, testimonials, FAQs,
memberships, products, community spaces metadata, webinars, appointments, lead magnets,
navigation, settings, orders, enrollments, progress, certificates, coupons, revisions,
audit log, slug redirects, media metadata). **Firebase Auth** for identity (custom claims
for roles). **Firestore** keeps exactly one job: realtime community feed/presence
(listeners), with Turso holding the canonical group/post records and Firestore as the
realtime projection written by the same API transaction (outbox pattern). **Cloudinary**
for all media binaries (signed uploads). **Stripe test mode** for payments.

Why not Firestore-for-content (the current seed's direction):
- Catalog needs relational queries: search + category filter + sort + pagination across
  courses/books/programs; curriculum is a 3-level join (course→chapter→lesson); pricing
  is multi-row multi-currency with tiers. Firestore needs denormalized copies and client
  joins — the exact dual-write inconsistency the audit found (I9).
- CMS needs revisions, audit log, slug-redirect lookups, scheduled publish queries
  (WHERE status='scheduled' AND publish_at<=now) — trivial in SQL, awkward in Firestore.
- Commerce already lives in Turso (orders/enrollments/progress, ACID, unique indexes,
  idempotency). Keeping content there removes the split-brain.
- Local dev: Turso runs as a file: URL — no emulator suite needed for the DB; Firebase
  Auth emulator covers identity; Stripe test mode covers payments. Matches the brief's
  "run everything locally with emulators and test-mode credentials".
- The existing firestore.rules stay for the community projection + users role docs;
  everything else moves out of Firestore. Seed writes become Turso-first.

Migration: schema v2 (additive) + one-time importer from the reference dump; the current
Firestore course/book seed docs are retired (nothing reads them today — audit I6).

### 0.2 Rendering architecture: Tailwind templates + content data (D2)

Decision: **replace the DOM-replay layer with ~12 real Tailwind templates** fed by the
CMS, using the captured specs ONLY as (a) the measurement oracle for UI-SPEC and (b) the
source for extracting structured content (section order, block anatomy, per-device
styles) into the content model. vendor.css (antd) and reference.css (captured
styled-components) are deleted; all styling becomes Tailwind v4 utilities + theme tokens.

Why: the brief mandates Tailwind-only, original palette/copy/images, and a CMS that
actually drives rendering. DOM replay satisfies none of those three; it freezes reference
branding into 110 pages and makes admin edits invisible (G24). The reference's own block
vocabulary (Section/Container/Row/Column/Heading/Text/RichText/Button/Img/List/AllBlogs)
maps 1:1 to a typed block editor, so fidelity is preserved as DATA, not copied code.

Template set (from ROUTE-TABLE template classes): home, path-landing, catalog
(courses/all-products/mini-courses), course-detail, book-detail, books-list, blog-list,
blog-post, blog-category, community-group, legal/text-page, lead-magnet/form-page,
auth, checkout, dashboard, admin, lesson-player, reader, library, certificate. Builder
pages (96 sitemap URLs) render through a generic BlockPage template driven by page
blocks in the DB — distinct structure per page comes from its block tree, not a catch-all.

### 0.3 CMS design

Content types (Turso tables, all with: id, slug, status[draft|published|scheduled|
archived], publish_at, seo_title, seo_description, og_image, canonical, no_index,
created_by, updated_by, created_at, updated_at, deleted_at):
courses, chapters, lessons, books, programs, blog_posts, blog_categories, pages,
testimonials, faqs, membership_tiers, products, community_spaces, webinars,
appointment_services, lead_magnets, navigation_items, site_settings (singleton),
media, revisions, audit_log, slug_redirects, coupons.

- courses: + course_type SINGLE|BUNDLE, progressive_mode, max_enrollments,
  enrollment_days, course_level, language, includes_list, learning_list, guarantee_text,
  faq (json), instructor_ids, bundle_course_ids, preview_video, landing_block_tree.
- chapters: course_id, position, title, is_published. lessons: chapter_id, position,
  lesson_type[video|text|audio|pdf|download|asgmt|quiz], title, is_free, content (json:
  video url / richtext / audio url / file media_id / assignment prompt / quiz questions),
  duration_sec, attachments (media ids), drip_offset_days, prerequisite_lesson_id.
- prices: entity_type+entity_id, currency[USD|ZMW|…], price, strike_through,
  price_type[ONE_TIME|FREE|RECURRING], interval, trial_days, enrollment_days,
  tier_type[VOLUME], tiers json, is_default, stripe_price_id.
- books: + author, format[ebook|audiobook|pdf], pages, cover_media_id, file_media_id,
  preview_chapters, chapter bodies (json or child rows), access[purchase|membership|free].
- pages/blog_posts: block_tree json (typed blocks below) + taxonomy.
- revisions: entity_type, entity_id, version, snapshot json, author, created_at; restore
  = write snapshot as new revision. audit_log: actor, action, entity, diff, ip, at.
- slug_redirects: from_slug unique, to_slug, entity_type; middleware consults it (cached).

Block editor: typed blocks matching the reference vocabulary — section, row, column,
heading, text, richtext (TipTap or Lexical, no MUI/Emotion), image, button, list, embed
(video/audio/file/code/callout), faq, testimonial-grid, course-grid, book-grid, blog-grid
(the AllBlogs equivalent), form (lead/contact/booking), spacer. Each block carries
per-device style overrides (desktop/tablet/mobile JSON) compiled to Tailwind responsive
utilities at render; spacing/typography tokens come from the theme, not arbitrary hex.

Editing features: role-protected /admin (admin|editor|instructor claims); drafts +
publish + scheduled publish (status+publish_at; a cron tick + on-publish revalidation);
revision history with restore; duplication; drag-and-drop reorder (chapters/lessons via
position integers, dnd-kit); bulk publish/archive/delete; slug management with automatic
redirect rows; per-item SEO fields; preview via signed draft token (?preview=jwt) that
bypasses status filter for the author; audit log on every mutation; JSON import/export
per entity + full-site export; CLI: scripts/seed.ts (full reference import),
scripts/import-content.ts, scripts/export-content.ts.

Rendering contract: every public content route uses generateStaticParams (from DB at
build) + dynamicParams with ISR; every admin mutation calls revalidateTag(entity) /
revalidatePath for affected routes (list + detail + sitemap). Scheduled publish triggers
the same revalidation. This closes G25 and makes "admin creates → appears on site" true.

Roles: admin (all), editor (content CRUD, no settings/users), instructor (own courses/
lessons/books, read-only analytics), student (learn/community). Claims set via
/api/admin/users/[uid]/role (admin-only, audit-logged) + users/{uid}.role Firestore doc
for rules compatibility.

### 0.4 Brand reset (D3)

content/brand.json: BRAND_NAME (decision needed; working placeholder "Lena"), logo,
palette seed → Tailwind @theme tokens (original palette, NOT #6662ff/#00a3ff/#ff007a).
All copy rewritten original (the reference dump's marketing text is NOT imported as
copy — only structure/measurements/prices/slugs/ids; course titles are factual product
names, kept where they describe George's own products, otherwise renamed per brand).
Images: original placeholders generated locally (SVG/Cloudinary) — zero ezycourse/
savvypro CDN references; CSP media hosts reduced to self + Cloudinary. Tracking: none.
Brand scan (scripts/brand-scan.mjs extended to text+palette+URLs) must pass clean.

## 1. Milestones (ordered; each ends with: tests green, audit items re-verified,
AUDIT-REPORT.md updated, commit; push after George's approval)

### M0 — Decisions, local env, demo-fallback removal (prereq for everything)
Tasks: confirm D1–D9; create firebase.json (auth+firestore emulators), .env.local from
vault (Firebase emulator vars, TURSO_DATABASE_URL=file:./local.db, Stripe TEST keys,
Cloudinary, SMTP dev sink); wire firebase-admin to emulator; remove getCurrentUserId
demo-user fallback and admin-guard dev fallback (fail closed); DEMO_MODE deleted.
Files: firebase.json, .env.local (gitignored), src/lib/session.ts, src/lib/admin-guard.ts,
src/lib/firebase-admin.ts, src/lib/turso.ts, .env.example.
Acceptance: `firebase emulators:start` + `next dev` boots; signup→verify→login works
against emulator with real session cookie; unauthenticated /dashboard redirects;
unauthenticated /api/enrollments POST → 401; no demo-user rows created.
Closes: B10, D8 decision, I7 prereq. Unblocks: all journey tests.

### M1 — Data architecture + full reference seed
Tasks: schema v2 (all §0.3 tables, additive migration runner scripts/migrate.ts with
version table); importer scripts/import-reference.ts reading scratch/all-courses.json +
next-data.json slices → 32 courses / 305 chapters / 1106 lessons / prices (USD+ZMW,
tiers) / 6 book products (free model per D5) / 22 blog posts + 6 categories / 5 community
spaces / page block trees for 96 builder pages (structure extracted, copy flagged for
original rewrite); lessons get lesson_type + is_free + position from dump; content bodies
that are reference marketing text → original rewrite queue (docs/evidence/copy-queue.md);
retire Firestore content seed; seed CLI idempotent.
Files: database/schema.sql (v2), database/migrations/*, scripts/migrate.ts,
scripts/import-reference.ts, scripts/seed.ts, src/lib/turso.ts, src/content/*.json
(becomes export artifacts, not runtime source).
Acceptance: SQL counts match ref-census.json exactly (32/305/1106; lesson-type census
video 324/asgmt 443/text 185/audio 135/download 11/pdf 2/quiz 6; USD 30+ZMW 3 prices);
slug sets equal; re-running seed is idempotent; `node scripts/export-content.ts` round-
trips.
Closes: C3, C4, C5(data), D3(model), D10, I5, I9, G1, G26, G27.

### M2 — Routing, SEO, redirects, spec re-extraction
Tasks: src/app/sitemap.ts (181 URLs from DB+static register) + robots.ts; wire
spec.meta canonical/OG/Twitter/JSON-LD into metadata (BlogPosting+BreadcrumbList posts,
CollectionPage+BreadcrumbList categories, Course/Product schema on detail pages);
unique per-URL descriptions (from content, no template fallback; kill the 9 "null"s);
next.config redirects() for alias families (/signin→/login, /forgot-password→
/reset-password, terms/privacy/refund dual families, /kcpay-redirect→/kcpay--redirect,
legacy root blog slugs→/blog/… per D6); true 404 status for the 3 live-404 URLs (D1);
replace 10 ReferenceLanding stubs with real templates or registered redirects;
re-extract catalog/blog/groups/program specs from HYDRATED captures (H2); fix
layout-compare harness symmetry + hydrated container detection (H1/H5).
Files: src/app/sitemap.ts, robots.ts, src/lib/seo.ts, src/components/layout/PublicPage.tsx
(interim), next.config.js, src/middleware.ts, scripts/extract-page-specs.mjs,
scripts/layout-compare.mjs, scripts/compare-report.mjs, 10 stub page files.
Acceptance: /sitemap.xml lists 181 URLs (200); /robots.txt 200; crawler re-run: 181×200,
181 unique titles AND descriptions, 0 console errors, 0 "null"; every blog post has
BlogPosting JSON-LD (curl raw HTML); alias redirects 301/308 verified; harness re-run
shows ref-empty=0 and count-only=0.
Closes: A2, A4, A5, A6, A7, A10, H1, H2, H5, J8.

### M3 — Auth engine completion
Tasks: enforce email verification (middleware + API guard: session cookie with
email_verified claim false → /verify gate, reference parity); persist first/last name
(updateProfile + profiles row at signup); role assignment API + admin UI (claims +
users doc); account settings (/user: profile, change-email, change-password with
re-auth); auth route aliases (B12) as redirects; server rate-limit on signup/reset
endpoints (move mutating auth behind /api/auth/* with zod); generic error messages;
session revocation check on sensitive routes; logout everywhere.
Files: src/middleware.ts, src/lib/session.ts, src/lib/auth-client.ts,
src/components/auth/RefAuthForm.tsx (→ Tailwind AuthForm in M9), src/app/api/auth/*
(register, reset-request, reset-confirm, verify, change-email, change-password),
src/app/user/page.tsx, src/app/(auth)/*, src/app/api/admin/users/[uid]/role/route.ts.
Acceptance: Playwright: signup → unverified access blocked → verify via emulator link →
access granted; names persisted; reset flow end-to-end; role change reflects in guards;
change-email/password re-auth enforced; 429 after limit; non-admin /admin → 403.
Closes: B1, B3, B6, B7, B8, B9, B12.

### M4 — CMS core (the engine that feeds courses/books)
Tasks: implement §0.3 in full: admin UI for every content type (list/create/edit with
block editor, media library with Cloudinary signed uploads, drafts/publish/schedule,
revisions+restore, duplication, dnd reorder, bulk actions, slug+redirect management,
per-item SEO, preview tokens, audit log viewer, roles matrix); every mutation zod-
validated + rate-limited + audit-logged + revalidateTag/Path; scheduled-publish tick
(cron route or middleware time-check) ; JSON import/export endpoints + CLI; replace
adminStore/communityStore in-memory writes with Turso (community projection to Firestore).
Files: src/app/admin/** (courses, chapters, lessons, books, posts, pages, programs,
testimonials, faqs, memberships, products, communities, webinars, appointments, leads,
navigation, settings, media, revisions, audit, users/roles), src/app/api/admin/**,
src/lib/cms/* (store, blocks, revalidate, preview, schedule), src/components/editor/*,
src/lib/cloudinary.ts, database/migrations.
Acceptance: Playwright admin journey: create course+chapter+lesson (each type) → draft
invisible publicly → publish → appears on /courses + detail without rebuild (ISR);
scheduled publish appears after tick; revision restore reverts; duplicate creates copy;
drag reorder persists position; slug change creates redirect (old URL 301); media upload
returns signed Cloudinary URL; bulk archive works; preview token shows draft to author
only; audit log records actor+diff; editor role cannot touch settings/users; export→
import round-trip identical.
Closes: G2–G25, G27, F2(persistence), I2(admin), I4.

### M5 — Courses rendering + lesson player (priority 1)
Tasks: catalog template with DB-backed search/filter/sort/pagination/categories
(reference Search input parity); course-detail template per UI-SPEC (hero, price box
multi-currency USD+ZMW + strike-through + VOLUME tiers, curriculum accordion from DB
with type icons/free flags/durations, includes/learning lists, FAQ, reviews, instructor,
sticky CTA → /checkout?product_id=&product_type=course); enrollment integrity (free-only
self-enroll; paid requires order; closed/max_enrollments/bundle expansion); lesson player
for ALL 7 types (video via Cloudinary/Bunny-embed iframe, text richtext, audio player,
pdf viewer, protected download signed URL, assignment submit+grade queue, quiz engine
with question bank); progress + resume (last_position_sec) + completion rules +
progressive_mode sequential unlock + drip offsets; certificates engine (issue on
completion, /certificate/[slug] public verify, signed SVG/PDF download, records table);
reviews submission (enable_course_review parity).
Files: src/app/courses/*, all-products, mini-courses, course-detail/[slug]/[id]/*,
src/components/catalog/*, src/components/course/*, src/app/dashboard/course/**,
src/components/learning/* (players per type), src/app/api/{enrollments,progress,
certificates,lessons,quizzes,assignments,reviews}/*, src/app/certificate/[slug]/*,
src/lib/learning.ts, src/lib/catalog.ts (→ DB queries).
Acceptance: Playwright: browse→search/filter→detail→enroll free→learn each lesson type→
resume after reload→complete→certificate issued+verifies+downloads; paid course locked
until paid order (M7); progressive mode locks lesson N+1 until N complete; quiz grades;
assignment uploads; catalog counts match DB; course-detail H-measurement vs UI-SPEC ±4px.
Closes: C1, C2, C6, C7, C8, C9, C11, C12, C13, F1(learning routes).

### M6 — Books system (priority 2)
Tasks: books-list template (hero + category tabs + 6 product cards, free model per D5);
book-detail template (cover, metadata, formats, preview chapters, CTA); reader with
access = purchase OR membership OR free (DB check, not preview-only); protected file
delivery (Cloudinary signed/authenticated URLs, download endpoint with access check);
audiobook player (audio lessons); library page (/dashboard/library + digital-products
parity); admin book CRUD (M4 UI) with formats/files/preview settings; /ebooks,
/audio-library, /audio-details data-driven; /books-stripe-payment → redirect (D6).
Files: src/app/books/*, ebooks, read/[slug]/*, audio-details/[slug]/[id]/*,
src/app/dashboard/library/*, src/components/books/* (Reader, AudioPlayer, BookCard),
src/app/api/books/* (access, download), src/lib/books.ts.
Acceptance: Playwright: free book → claim → full reader + download; paid book (if D5
overrides) → preview only → Stripe test pay → full reader + download unlocked; anonymous
download URL → 403; audiobook plays; library lists owned books; all 6 reference products
present with correct slugs; admin creates book → appears on /books (ISR).
Closes: D1–D10.

### M7 — Commerce + memberships
Tasks: server-side price resolution (checkout accepts product_id+product_type ONLY;
prices from DB; client never sends amounts); checkout template per reference store shape
(guest vs logged-in, currency selector USD+ZMW, quantity, minimal address mode);
Stripe session metadata {auth_user_id, product_type, product_id, order_id}; order created
pending BEFORE redirect; webhook: persisted event-id idempotency table, real secret
required (no fallback), handles checkout.session.completed (course enrollment / book
access / membership activation), payment_intent.payment_failed, invoice.paid/
payment_failed for subscriptions, charge.refunded; receipts + invoice page (/invoice,
orders list user-scoped); memberships: CMS tiers, subscription lifecycle, cancel with
ownership check + Stripe portal/cancel_at_period_end, gate from session (not query param);
coupons (validate/apply/admin CRUD); cart guest+user (reference parity); upsells/order
bumps (optional stretch — reference admin routes evidenced; mark GAPS if deferred);
success pages real (/you-have-paid with order summary).
Files: src/app/checkout/*, src/app/api/checkout/*, src/app/api/webhooks/stripe/*,
src/app/api/{orders,memberships,coupons,cart}/*, src/app/{you-have-paid,invoice,membership}/*,
src/lib/commerce/*, database/migrations (processed_events, coupons, cart).
Acceptance: Playwright Stripe test mode: enroll paid course → pay 4242 → webhook →
enrollment active → lesson unlocked; tampered amount rejected (server price); duplicate
webhook event idempotent; forged signature 400; missing secret → boot error; book
purchase unlocks reader; membership subscribe→gate allows→cancel→gate denies at period
end; coupon discounts; orders list shows ONLY own orders; receipt email in dev sink.
Closes: E1–E12, C10, D5.

### M8 — Dashboard, admin surfaces, engagement features
Tasks: student dashboard subroutes (orders, memberships, communities, appointments,
billing, profile, digital-products/library, video-library, badges/coins if gamification
evidenced — else GAPS); community: GroupFeed wired to /community/[id] with Firestore
realtime posts/comments/likes, posting auth+verified-gated, paid group checkout;
appointments: services CMS + booking UI (slot picker, form, confirmation, .ics, email)
wired to existing API; webinars: registration forms wired + .ics + reminder email;
lead magnets: LeadCaptureForm wired per page, /api/leads/claim + PDF delivery email
(101-digital-skills pdf via Cloudinary), double-opt-in; AI assistant: ChatPanel wired to
/savvybot-ai-agent, streaming, per-user limits, provider interface with REAL adapter via
env (OpenAI-compatible/Anthropic) + mock fallback documented; blog rendering from DB
(list/post/category + AllBlogs-equivalent block); emails: Nodemailer + React Email
templates (verification handled by Firebase, receipt, booking, webinar, lead delivery,
reset) with SMTP env; testimonials/FAQs content types rendered.
Files: src/app/dashboard/** (new subroutes), src/app/community/[id]/*, src/components/
community/GroupFeed.tsx (wired), src/app/appointment/* + src/components/booking/*,
src/components/forms/* (wired), src/app/savvybot-ai-agent/* + src/components/ai/ChatPanel
(wired) + src/lib/ai-provider.ts (real adapter), src/app/blog/** (DB-driven),
src/lib/email/* + src/emails/*, src/app/api/{community,appointments,webinars,leads,ai}/*.
Acceptance: Playwright: community post→comment→like realtime across 2 sessions; booking
creates appointment + .ics + email; webinar register + .ics; lead claim → PDF email;
AI chat streams (mock + real adapter with test key); blog admin edit → site update;
dashboard subroutes show real user data only.
Closes: F1, F3–F12, G8.

### M9 — UI fidelity, template by template (Tailwind rebuild + brand reset)
Tasks: build the ~20 templates (§0.2) in Tailwind v4 from docs/UI-SPEC measurements at
375/768/1024/1280/1536; delete vendor.css/reference.css/DOM-replay layer (RefNode/
PublicPage/specs become build-time data only); brand reset per §0.4 (name/logo/palette/
copy/images original; CSP hosts reduced); complete UI-SPEC for every template (DOM
structure, computed type scale, spacing, radii, shadows, states: hover/focus/active/
disabled/loading/empty/error); re-run fixed harness per template; iterate to ±4px on
structure/spacing/typography (copy-length height deltas registered as localisations).
Files: src/components/templates/*, src/app/**/page.tsx (rewired), src/app/globals.css,
src/styles/tokens.css, tailwind theme, content/brand.json, src/content/pages/* (retired
from runtime), scripts/brand-scan.mjs (extended), docs/UI-SPEC/*.md (completed).
Acceptance: COMPARISON.md re-run: every template PASS at all 5 breakpoints on structure/
spacing/typography (registered localisations excluded); brand scan: 0 reference names/
copy/asset-hashes/CDN URLs/palette literals/tracking IDs; grep vendor.css/reference.css
imports = 0; axe 0 violations on all templates; states verified per UI-SPEC.
Closes: H3, H4, H6–H8, J4, J5, A10 (residual), G24.

### M10 — Full verification (Phase 5) + handoff
Tasks: tsc/lint/build/vitest; Playwright full journeys (signup→verify→browse→enroll→
Stripe test pay→learn→complete→certificate→logout; book purchase→read/download; admin
course+chapter+lesson→publish→site; admin book→site; scheduled publish; revision
restore; community post; booking; forms); sitemap crawler 181 (200, unique title+desc,
0 console errors); axe + Lighthouse ≥90 mobile/desktop on key templates (fix under 90);
security re-test (price tampering, IDOR, webhook forgery, open enrollment, orders leak,
cert forgery — all must fail closed); brand scan; PRODUCTION-CHECKLIST.md updated with
the exact production keys George must supply; docs/AUDIT-REPORT.md final scoreboard.
Acceptance: every audit item ID re-verified with output pasted into AUDIT-REPORT.md;
no item left missing/partial without a registered GAPS entry + George decision.
Closes: J7, J8, I7, I8, all residual.

## 2. Risk list

R1. Copy rewrite volume: 96 builder pages + 22 posts + 32 course descriptions need
    original copy. Mitigation: copy-queue.md batched by template; structure preserved so
    rewrite is text-only; George sign-off per brand voice (drafts-only guardrail).
R2. Fidelity vs originality tension: ±4px with different copy/images is not always
    possible (text length changes heights). Mitigation: registered localisation rule
    (structure/spacing/type scale scored; content-driven height deltas exempt), agreed
    in D2/D3.
R3. Lesson content absent from reference dump (gated watch pages): video URLs/audio
    files/text bodies were NOT captured. Mitigation: GAPS.md "unknown"; conservative
    standard = lesson records with type+title+placeholder media slots George fills via
    CMS; player fully functional with any supplied media. No invented content.
R4. Book 50150 uncaptured (paid book identity unknown). Mitigation: GAPS; free-model
    default (D5) with a CMS-editable slot.
R5. Membership tier shapes unknown. Mitigation: conservative standard tiers (D7),
    CMS-editable; no invented prices presented as reference facts.
R6. 3 GB RAM / 4-core machine: Playwright + emulators + build concurrently will OOM.
    Mitigation: sequential harness runs (already practiced this session), emulator suite
    limited to auth+firestore, Turso file DB, one Chromium worker.
R7. Firebase Admin emulator quirks (session cookies against emulator). Mitigation:
    M0 acceptance test proves the full cookie flow before any other milestone.
R8. Stripe webhook local delivery: needs stripe CLI listen or a signed-test-event
    injector. Mitigation: integration test injects constructEvent-signed events (exists);
    journey test uses stripe CLI if available, else documented manual step for George.
R9. Scope creep toward 668-route EzyCourse parity. Mitigation: capability parity per
    REFERENCE-MODEL §9, not route-for-route; admin/CMS scope frozen at §0.3.
R10. Working-tree divergence: 210 uncommitted changes mix the DOM-replay pivot with
     fixes. Mitigation: M0 starts with a commit of the audited baseline (tag
     audit-baseline-2026-11-19) so every milestone diff is clean; push after approval.
R11. Reference site redeployed mid-audit (build 4315b58e, +2 routes). Mitigation: live
     manifest archived; captures are dated; re-capture only if Phase 5 diffs demand it.
R12. SEO uniqueness vs reference duplicate titles: brief requires unique — lena will
     intentionally diverge from reference duplicates (registered).

## 3. Effort shape (rough, for planning)

M0 0.5d · M1 1–1.5d · M2 1d · M3 1d · M4 3–4d (largest) · M5 2–3d · M6 1.5d ·
M7 2d · M8 2–3d · M9 3–4d (110 pages → templates + brand) · M10 1–1.5d.
Total ≈ 18–24 working days of agent execution, milestone-by-milestone with George's
review at each commit boundary. Books/courses/CMS (M1/M4/M5/M6) are ~40% of the effort
and carry the priority weight.

## 4. What happens on approval

1. Commit audited baseline + docs (tag), push if D9 approved.
2. Execute M0 → M10 in order; after each milestone: re-run its acceptance tests, update
   docs/AUDIT-REPORT.md statuses with evidence, update docs/PROGRESS.md (3-line report:
   matches / verified / open), commit.
3. Stop only at M10 completion or a blocker requiring George's decision.
