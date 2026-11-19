# REFERENCE-MODEL — savvypro.org (EzyCourse platform)

Phase 1 deliverable. Re-derived 2026-11-19 from raw evidence, NOT from the stale Nov-4
SPECIFICATION.md. Every claim is tagged [observed] (directly in evidence) or [inferred].
Evidence roots: `_reference/site/` (read-only), `lena/captured/` + `lena/captured-browser/`
(fresh live captures 2026-11-19), extracted artifacts in scratch/savvypro-audit/.

## 1. Platform architecture [observed]

- Hosted **EzyCourse** SaaS (school_id 1887), Next.js **pages router**, build IDs
  `fb86cadcd0f7c0d9f113a46c4e063c128f49de49` (CDN) and `6d3b62336dc78e146fa209e0bc87305a3d24e1da`
  (site copy) — identical 668-route manifests.
- Assets: JS/CSS on `cdn.ezycourse.net/_next/static/…`; images on `ezycourse.b-cdn.net/1887/…`
  (BunnyCDN) + `f.ezycourse.net`; fonts Google Fonts **Figtree** (300–900) + Verdana headings.
- Styling: **Bootstrap 5 grid** (main.css 1.89 MB; containers 540/720/960/1140/1320px at
  576/768/992/1200/1400px) + **styled-components** (hashed classes, CSSOM-injected) +
  per-block inline styles from the page builder. Font Awesome 6 icons. KaTeX present (math).
- State: Redux with redux-undo on the builder (`past/present/future`), stores: user, course,
  community, chat, setting, productCoupon, gallery_store, courseWatch, teacherCourseWatch,
  settingsData, builder, notifications, siteMenu, siteCourse, siteCommunity, siteCourseDetails,
  siteSellerDetails, siteGroupChat, checkout, cart, galleryV2, payment, productPricing,
  liveProductChat, billing, ezyflow, coaching. [observed in __NEXT_DATA__.initialState]
- Every page ships `__NEXT_DATA__` with `props.pageProps`: siteData (full site settings),
  seo_meta_data, page_settings, initialState, and route-specific data (course / community /
  builder page). Server-rendered data = the API response shapes. [observed]
- Tracking on reference: GTM-PH89WSX4, Hotjar 645767, Cloudflare beacon — MUST NOT be copied
  into lena (brand/tracking scan). [observed]
- Copy-protection inline JS (killCopy/reEnable disabling selection) on some pages. [observed]
  Decision: do not replicate (hostile UX); logged in GAPS/decisions.

## 2. Route map

### 2.1 Sitemap surface (181 URLs) — full table in docs/evidence/ROUTE-TABLE.md
Template class counts [observed]: builder-page 96, course-detail 32, blog-post 22,
blog-category 6, community-feed 5, checkout-family 7, library 4, catalog 3, books 2,
auth-login 2 (/login, /signin), auth-signup 1, home 1.

### 2.2 Dynamic patterns (from _buildManifest.js) [observed]
Public templates that serve the sitemap URLs:
- `/[page_slug]`, `/[page_slug]/[inner_page_slug]`, `/[page_slug]/login`,
  `/[page_slug]/[inner_page_slug]/login` — the CMS catch-all for ALL builder pages
  (incl. /login /signup which are pages with auth blocks).
- `/course-detail/[page_slug]/[id]` — course/product landing (32 sitemap URLs)
- `/blog/[slug]`, `/blog/category/[category_slug]/[category_id]`
- `/community/[community_id]`, `/community/[community_id]/[post]/[id]`,
  `/community/single-community-post/[id]`, `/community/checkout`
- `/community-detail/[slug]/[id]`, `/coaching-program-detail/[product_slug]/[id]`,
  `/coaching/[program_slug]`, `/product-detail/[product_slug]/[id]`,
  `/audio-details/[slug]/[id]`, `/video-details/[slug]/[id]`,
  `/live-details/[page_slug]/[live_id]`, `/event/[slug]/[id]`, `/feed/[slug]/[id]`,
  `/creator/[creator_slug]`, `/seller-detail/[page_slug]/[id]`
- `/certificate/[slug]` (+ /certificateCard, /courseCard), `/playlist/[id]`, `/share/[id]`,
  `/share-lesson`, `/invoice`, `/leaderboard`, `/feeds`, `/notifications`
- Auth/account: `/forgot-password`, `/password-reset-link`, `/set-password`, `/set-new-password`,
  `/verify`, `/verify-email`, `/verify-reset-code`, `/verify-phone-number`,
  `/verify-form-mail/[token]/[email]`, `/student-signup`, `/teacher/signup`, `/user/[student_id]`,
  `/email-preferences/[token]`, `/automation-email-preferences/[token]`, `/gift/[token]`
- Commerce: `/checkout`, `/checkout/webViewRedirecPage`, `/commoncheckout`,
  `/onboarding/purchase`, `/ltd-pricing`
- Student area: `/student`, `/student/dashboard` + 30 subroutes (courses, ongoing-courses,
  certificates, orders, memberships, communities, appointments, billing, profile,
  change-email/password, digital-products, video-library, badges, coins, …),
  `/student/courses/[course_id]/watch/[lesson_id]` — the lesson player.
- Admin/CMS: `/dashboard/*` (437 routes), `/seller/*` (89 routes) — see §6.
- System: `/404`, `/_error`, `/ErrorView`, `/UnderConstruction`, `/maintenance`, `/inactive`,
  `/site-inactive`, `/cookiespage`, `/startPage`, `/meeting/join`, `/messenger/chat`,
  `/blocks/[id]/preview`, `/templates/[id]/preview`, `/sitebuilder/page/[page_id]`,
  `/sitebuilder/preview/[page_id]`, `/test-matching/exam`, `/help-article/[slug]`,
  `/help-category/[slug]/sub-category/[subcatslug]`, `/new-feature/[slug]`.

### 2.3 Legacy slugs & aliases [observed]
Captured HTML shows legacy/alternate URLs that must redirect or render:
- `/home` (nav "Home" points here; separate capture home.html)
- `/signin` ≡ `/login` (both captured, same auth form)
- Root-level legacy blog slugs: `/7-ways-to-find-mentorship`,
  `/making-your-own-salary-stay-home-mums`, `/how-to-make-your-own-salary-part-2`,
  `/how-to-make-your-own-salary-part-3` (also exist under /blog/…)
- `/kcpay-redirect` vs sitemap `/kcpay--redirect` (double dash) — both captured
- Course copy variants: `course-detail/…-copy-<timestamp>-<id>` (e.g. 49792–49797, 41634,
  49068, 49070) — duplicate courses created by the seller; sitemap lists several.
- `/course-detail/visibility-course/40331` captured vs sitemap
  `/course-detail/visbility-course-why-you-are-invible-and-how-to-change-it/40331` (typo slug).
- `/savvypro-home`, `/savvypro-main`, `/savvypro`, `/savvypro-lp1` — home/LP variants (sitemap).
- `/terms-and-conditions`, `/privacy-policy`, `/refund-policy` vs `/savvypro-terms-and-conditions`,
  `/savvypro-privacy-policy`, `/savvypro-refund-policy` (both families in sitemap/nav).

### 2.4 Live-404s [observed 2026-11-19]
`/video-details/`, `/learning-hub/`, `/learn-with-expert-guidance/` return 404 on the live
site today despite being in the sitemap. `/video-library` renders "Page under construction"
(status Unpublished). `/audio-library` renders "Default audio page" (near-empty).
Conservative implementation: serve the same states (construction page / empty library),
do not invent content. See GAPS.md.## 3. Content model (from __NEXT_DATA__ — authoritative)

### 3.1 Course [observed: sample-course.json, all-courses.json — 32 courses]
Fields: id, title, content (HTML), image, cover_image, course_slug, creator_id, school_id,
course_type (SINGLE|BUNDLE), pricing_type (FREE label — legacy; real gating via prices[]),
course_category, published_date, short_description, is_published, presell_charge_option,
enrollment_count_hidden, landing_page, checkout_page_slug, preview_video_meta,
course_preview_type, course_includes_list, course_learning_list, guarantee_text, course_level,
course_faq, course_language, video_duration, approval_status, progressive_mode (0/1 —
sequential unlocking), enable_course_review, total_reviews, avg_review, landing_template_id,
max_enrollments, course_visibility, meta{videos_count, assingments_count,
download_able_source_count, chapter_count, enrolled_count, lessons_count, quizes_count},
custom_course_page, categories_names[], user{creator}, course_instructors[], videoHours,
bundle_courses[], chapter[], prices[], isEnrolmentClosed, course_meta.
- chapter: {id, title, content, is_published, course_id, position, lessons[], meta}
- lesson: {id, title, is_free (0/1), lesson_type, is_published ("PUBLISHED"), position,
  chapter_id, meta}. Lesson content is NOT in the landing payload — fetched by the watch
  page (gated). [observed absence]
- Lesson type census across 32 courses / 305 chapters / 1106 lessons [observed]:
  video 324, asgmt 443, text 185, audio 135, download 11, pdf 2, quiz 6.
- Drip: `/seller/courses/[course_id]/drip` route exists [observed route]; no drip config in
  landing payloads → drip rules unknown (GAPS). progressive_mode=1 evidenced on CCS.
- Prerequisites: not evidenced → GAPS.

### 3.2 Pricing [observed]
prices[]: {id, currency (USD|ZMW), price, strike_through_price, price_type (ONE_TIME|FREE),
interval, interval_count, trial_period_days, enrollment_days (access duration), tier_type
(VOLUME), tiers, tiers_flat_price (JSON: first_unit/last_unit/amount/price/stripe_price_uuid),
multi_price, multi_tiers, is_default, total_installments, without_card_enable, school_id,
paddle_price_uuid, price_model, meta}.
- Site payment settings [observed]: currency USD, multi_currency ["USD","NGN","MWK","UGX",
  "KES","ZMW"], is_enable_multi_currency=1, stripe_status=1, xendit_status=0,
  shurjapay_status=0, bunny_cdn_video_* fields (Bunny stream video hosting option).
- Example: CCS 2026 = USD 75 ONE_TIME default + USD 0 VOLUME tier (seat-based).
- Books/ebooks/audiobooks are courses with price 0 (free lead magnets) or paid; sold via
  `/checkout?product_id=<courseId>&product_type=course`. [observed links in /books blocks]

### 3.3 Books & ebooks [observed]
- `/books` = builder page, 6 product cards → checkout product_ids 50150, 50151, 49792,
  49793, 49795, 49794 (all product_type=course). 5 map to captured free ebook/audiobook
  courses; 50150 not captured (paid book — likely "Words That Sell" or "7 Steps to Better
  Sales"; GAPS).
- `/ebooks` in sitemap (builder page). Book detail = course-detail template for the
  ebook/audiobook course (e.g. /course-detail/infoprenuer-roadmap-ebook/3982).
- Formats evidenced by lesson types: pdf, download, audio, text. Reader interface: the
  student watch page renders text/pdf/audio lessons; no separate epub reader evidenced.
- Library access = enrollment (free checkout) → student/dashboard/digital-products +
  ongoing-courses. [inferred from routes + is_free flags]
- `/books-stripe-payment` page exists (legacy Stripe payment page for books). [observed]

### 3.4 Blog [observed]
- `/blog` = builder page with an **AllBlogs** dynamic block (card style settings) + hero.
- Posts = builder pages (page_type CUSTOM) with RichText blocks; slug = page_slug.
- Categories: `/blog/category/<slug>/<id>` — 6 categories: ceo-digital-strategies (766),
  digital-biz-ideas (1147), growth-marketing (1149), freelancer-listings (2817),
  personal-branding (3821), susan-lumba-mwenda (3870).
- Post payload = same builder pageProps (no separate post object) → blog model is
  page + category taxonomy + publish metadata (created_at/updated_at on currentPage).

### 3.5 Pages (CMS builder) [observed: home-present.json, sample-books-present.json]
- currentPage: {id, school_id, creator_id, site_menu_id, page_slug, page_name, page_type
  (CUSTOM), seo_meta_data, page_settings, header_script, footer_script, status ("everyone"
  = public; other values inferred: members/logged-in), is_cached, pricing_type, created_at,
  updated_at, no_index, has_footer, deleted_at, version, cache_status (STALE), meta,
  page_blocks[]}.
- Block tree: normalized nodes {id, rootId, parent, type, componentName, isDroppzone,
  nodes[children], settings{general, style{desktop, tablet, mobile}, className, link}}.
  nodeTreeIDS = top-level section order.
- Block types observed: Section, Container, Row, Column, Box, Heading, Text, InlineText,
  RichText, Button, IconButton, Icon, Img, List, AllBlogs (+ video/embed links, checkout
  links, external links). Row supports isSlider/sliderAutoplay/sliderSpeed/sliderArrows.
- Link types: {type: "checkout"|"external-link"|…, url}. Buttons carry per-device style.
- Styles are literal CSS props per device (paddingTop "80px", background linear-gradient,
  fontSize, gap, display flex…). This is the measurement source for UI-SPEC.
- Builder has undo/redo history (redux-undo past/future) → revision model [observed];
  scheduled publish / draft-publish workflow inferred from dashboard/pages routes (GAPS).

### 3.6 Community [observed: sample-community-data.json]
data: {id, group_name, short_description, about, profile_pic, cover, school_id, slug,
seller_id, max_enrollments, prices[], meta}. 5 communities in sitemap: 650 (VIP), 834,
853, 4943, 4944. Feed/posts via /community/[id]/[post]/[id]; posting gated (auth).
Community checkout exists (/community/checkout) → paid groups.

### 3.7 Programs / coaching / appointments / webinars [observed routes + pages]
- /coaching/[program_slug], /coaching-program-detail/[product_slug]/[id] — coaching products
  with sessions (dashboard/pages/coaching-program/compontents/Session, VideoSession).
- /appointment — builder page with booking CTA ("Book an Appointment – Schedule Your
  Session Online"); dashboard/appointments/* (create/edit/booked lists, appointment-forms/
  [eventId]) → appointment services with forms. Public booking widget provider not
  evidenced (page uses external embed/CTA — GAPS).
- Webinars: /freelancer-webinar, /webinar-registration-freelancing (builder pages);
  dashboard/event-create/*, /event/[slug]/[id], live_webinar/live_streaming routes.
- Lead magnets: /freebies, /free, /signup-for-free-email-tips, /join-our-mailing-list,
  /101-digital-skills-pdf-download, /pdf-file-101-digital-skills,
  /pdf-download-file-7-step-whatsapp-automation, /win-a-book, /contest — builder pages
  with email-capture forms; email automation stores (ezyflow, automation-workflows).

### 3.8 Site settings [observed: sample-sitedata.json]
siteData: name, currency USD, site_name, site_mood, site_url, custom_domain_url, favico_icon,
logo, dark_logo, ga4_code, gtm_id, fb_pixel, site_authentication, is_auth_disable_signups=0,
is_auth_require_verified_email=1, is_auth_require_manual_approval=0, gamification_mode,
is_private_chat_enabled, is_site_builder, checkout_address_mode, has_app, terms_and_services,
checkout_terms_text, google_no_index, enable_email_verification_from_checkout,
support_email, countryCode ZM, default_country_code ZM, font_settings, primary_menu (JSON
menu tree: menuId/menuUrl/pageType OTHER|CUSTOM/openInNewTab/submenu/content.default),
global_settings, cart_checkout_settings, sidebar_hidden_list, is_role_manager_enabled,
global_role_manager_status, siteGlobalCss, siteVariables (theme tokens per device),
passwordSetting.
- siteVariables tokens [observed]: Primary #6662ff, Primary hover #3a34df, Heading text
  #000000, Body text #000000, Banner text #ffffff, Primary button text #ffffff (+hover),
  Secondary button bg #ffffff (+hover), Secondary button text #000000, … (full list in
  UI-SPEC/TOKENS.md). NOTE: lena must use its OWN palette (brief) — these are reference
  measurements, not lena's theme.

### 3.9 Memberships, testimonials, FAQ [observed/inferred]
- myMemberships in pageProps (empty for anonymous) → membership plans exist as products;
  dashboard/membership/* (pricing plans, enrolled students/sellers, groups, settings).
  Public /membership route in nav spec. Tier shapes unknown → GAPS.
- Testimonials: /testimonials + /ccs-testimonials builder pages; homepage has 6 testimonial
  cards (name/role/segment/quote/result/image) [observed copy].
- course_faq field on course (null in captures) + FAQ blocks on pages → FAQ content type.

## 4. API surface

### 4.1 Observed endpoints [observed in JS chunks]
- GET /api/public/setting/custom/font — public font settings
- POST /api/public/miscellaneous/send-error-log — client error reporting
- POST /api/teacher/gallery/uploadFile — media upload (teacher)
- https://ping.ezycourse.net/api/online, /api/ping — presence/heartbeat
- Fragment paths (client builds base + path; base = same-origin /api prefix [inferred]):
  student/auth/login, student/auth/register, student/auth/uploadFile,
  student/order/add-to-cart, student/order/getUserCart, student/order/removeCartItem,
  student/order/getSingleOrder/, student/order/get-password-less-order,
  student/guest-cart/add-to-cart, student/guest-cart/removeCartItem, student/guest-cart/,
  student/course/getCourseWithEnrollment/, student/checkout/xendit/create,
  student/chatting/getLinkPreview, teacher/gallery/uploadFile,
  teacher/setting/connected-schools, teacher/setting/generate-admin-token,
  teacher/setting/generate-non-admin-token, teacher/password/password-setting,
  teacher/upsells/get-upsells-for-checkout, teacher/setting/latest-feature-updates-for-addon.

### 4.2 Inferred API contract [inferred from routes + state shapes]
Auth: register (first/last/email/password) → verification email → verify-email token →
login (session cookie) → forgot-password → password-reset-link token → set-new-password.
Catalog: public course list/detail (SSR), blog list/category (SSR), community detail (SSR).
Commerce: checkout session create (Stripe), cart CRUD (user + guest), coupon validate
(productCoupon store), order fetch, upsell fetch, webhook (Stripe) → enrollment.
Learning: courseWatch store → lesson content fetch gated by enrollment, progress submit,
quiz/assignment submission (quiz-submissions, assignment_submission routes), certificate
issue (certificate/[slug]).
CMS: page CRUD + block tree save (builder.pageSavingState), cache revalidation
(cache_status STALE → is_cached), menu CRUD, media gallery, role manager.
All admin endpoints auth-gated (teacher/admin token; generate-admin-token observed).
Exact payload/response schemas beyond the SSR shapes are UNKNOWN → GAPS.md; lena defines
its own contract documented in docs/API-CONTRACT.md and tests against it.

## 5. Auth engine (reference behavior)
- Signup form: First Name, Last Name, Email, Password; button "Signup"; heading
  "Signup to Get Started !" [observed hydrated /signup].
- Login form: Email, Password; button "Signin"; heading "Welcome Back" [observed /login].
- Email verification REQUIRED before access (is_auth_require_verified_email=1) [observed].
- Signups enabled; manual approval off [observed].
- Routes: /verify, /verify-email, /verify-reset-code, /forgot-password, /password-reset-link,
  /set-password, /set-new-password, /student-signup, /teacher/signup [observed].
- Cookie/session mechanics, rate-limit messages, password rules: not capturable → GAPS
  (conservative standard implementation: httpOnly session cookie, bcrypt, zod validation,
  rate limiting, generic error messages).
- Roles evidenced: student, teacher/seller, admin (dashboard/site_admins, role-manager,
  is_role_manager_enabled) + instructor (course_instructors) [observed routes/fields].## 6. Commerce flow (reference)
1. Product card/button → `/checkout?product_id=<id>&product_type=course` [observed links].
2. Checkout state: currentProvider, currency/checkoutCurrency, product, pp_quantity/
   pp_unit_price/pp_total_price, existing_user (guest vs logged-in), saved_card_details,
   upsellProducts/downsellProduct, payment_gateway_settings [observed store shape].
3. Guest cart + user cart (student/guest-cart/*, student/order/*) [observed fragments].
4. Stripe enabled; multi-currency USD/NGN/MWK/UGX/KES/ZMW; address mode configurable
   (checkout_address_mode null = minimal) [observed].
5. After purchase: enrollment → student dashboard; /you-have-paid, /kcpay-registration-success
   success pages; /invoice, orders list [observed routes].
6. Coupons: productCoupon store + dashboard/product-coupons/*, seller/coupons/* [observed].
7. Memberships: dashboard/membership/* incl. subscription pricing, tax settings per plan
   [observed routes]; public purchase flow shape unknown → GAPS.
8. Legacy payment pages: /payments, /books-stripe-payment, /testkcpayment, /kcpay--redirect
   (KCPay = Zambian gateway test pages) [observed]. lena: Stripe test mode + documented
   provider interface; KCPay not required unless George decides (decision list).

## 7. SEO model (per-route)
- head: title, meta description, canonical, OG (og:title/og:description/og:image), Twitter
  cards. JSON-LD [observed in 28 raw captures]: blog posts emit **BlogPosting** +
  **BreadcrumbList**; blog categories emit **CollectionPage** (with ItemList of posts) +
  **BreadcrumbList**. No JSON-LD on other templates. Hydrated DOM drops these scripts —
  audit must read raw SSR HTML.
- seo_meta_data (page-level JSON string): {meta_title, meta_description, og:title,
  og:description, title}; many pages empty "{}" → fallback to page_name/site name [observed].
- google_no_index flag per page + site-level; no_index on currentPage [observed].
- sitemap.xml: 181 URLs, trailing-slash form [observed].
- Titles captured per URL: docs/evidence/ROUTE-TABLE.md. Duplicate titles exist on the
  reference itself (e.g. "Content Creation School Zambia" reused) — lena brief demands
  UNIQUE title+description per URL, so lena must improve on reference here (registered
  intentional difference).

## 8. Design system & template structure
Measurements are derived from CODE (block-tree settings.style per device + compiled CSS),
per user directive (no screenshots). Full per-template specs: docs/UI-SPEC/<template>.md;
tokens: docs/UI-SPEC/TOKENS.md. Summary:
- Grid: Bootstrap 5 containers (540/720/960/1140/1320), 12-col row/col, gutters 1.5rem
  (24px) [observed main.css]. Builder pages use .container/.row classes inside blocks.
- Breakpoints in compiled CSS: 576/768/992/1200/1400 (Bootstrap) + 767/991 (max-width
  overrides) + 480/599/980/1024 (component CSS). Audit viewports 375/768/1024/1280/1536
  map: 375→mobile styles, 768→tablet boundary, 1024→desktop (992+), 1280→desktop,
  1536→desktop (1400+ container 1320).
- Type: Figtree 300–900 body; Verdana headings on hero (50px desktop / 28px mobile observed
  in prior measurement run — re-verified against block styles in UI-SPEC).
- Home: 10 sections [observed nodeTreeIDS]: hero (padding 100px desktop, bg #090e21 +
  image), path-picker (5 audience cards), testimonials (6 cards), service pillars
  (LEARNING/COACHING/HIRE), footer CTA. Section padding commonly 80px desktop.
- course-detail: hero (title, creator, preview video/image), price box, curriculum
  (chapters/lessons accordion), includes/learning lists, FAQ, reviews, instructor bio,
  sticky enroll CTA [observed HTML structure + course fields].
- books: hero + category tabs (Start a Product/Service Business, Start Freelancing, Build
  an Expert Business, Content Creation, WhatsApp Marketing) + 6 product cards [observed].
- blog: hero ("Digital Growth, Simplified.") + AllBlogs card grid [observed].
- auth: centered card form, "Welcome Back"/"Signup to Get Started !" [observed].
- Buttons: primary #00a3ff (hover #3b3b3b) radius 5px padding 10px 20px; big CTA #ff007a
  radius 50px 42px [observed homepage styled-components] — reference values only; lena
  keeps its own palette with equivalent anatomy.

## 9. Admin/CMS capability inference (from 437 dashboard + 89 seller routes)
Evidence = route names + store shapes; hosted backend not captured. Capabilities the
reference platform demonstrably has [observed routes]:
- Courses: seller/courses/create, [course_id]/chapter/create, chapter/[chapter_id]/lesson/
  create, lesson/[lesson_id], drip, pricing, setting (accessibility, advance-info,
  after-checkout-page, certificate, gamification, grade-settings, landing-page, motivation,
  progressive-mode, tax-settings), watch/[lesson_id] (preview), sort (mycourses/sort).
- Books/products: dashboard/products/* (create, edit, categories, import-digital-products,
  in-app-products), physical-products, preorders, bonus-items, bundle-courses/create.
- Blog: dashboard/blogs/* (create, [id]/edit, categories, sticky-note, membership pricing).
- Pages: dashboard/pages/* ([id]/edit, design variants, coaching-program sessions),
  sitebuilder/page/[page_id] + preview, blocks/[id]/preview, templates/[id]/preview.
- Media: gallery_store, video-gallery/* (create, add-video, edit-video, sort-video,
  categories, pricing, landingPage), video-data, video-category, storage-usage.
- Commerce: orders/[id], manual-orders, transactions, earning-transactions, subscriptions,
  product-coupons/*, upsells/*, one-click-upsells/*, order-bumps/*, payment settings,
  invoice-billing-addresses, price-settings, tax-settings.
- People: students/* (import, details, order), instructors, site_admins, role-manager,
  b2b-users, affiliate-* (levels, users, transactions), revenue_partner/share.
- Marketing: campaigns/* (create wizard: recipient/sender/template/publish-schedule steps,
  rule-builder, activity, logs, details: bounce/complaint/link stats), email-templates/*,
  email-automation/*, automation-workflows/*, automation-topics, push-notifications/*,
  banners, popup, global-javascript, redirect-url, link-tracking.
- Community: seller/communities/* (create, edit, pricing, members, settings, tab-setting,
  dashboard), groups/*, messenger/chat, private-chat-settings.
- Appointments/events: appointments/* (create, edit, booked lists, forms), event-create/*
  (recurrence, categories, participants, landing page), meeting/*, live/*.
- Learning ops: assignment, assignment_submission, quiz-submissions, question-bank,
  import-questions, certificates (seller/certificates/*), reviews, feedbacks, surveys,
  gamification/leaderboard, help-center tickets.
- Settings: global-settings, site-menu/* (edit), language/* (translation), variables,
  settings/checkout|email|fonts|login-sessions|review-settings|student-dashboard-settings,
  developers (API keys), web-hook/data-in|data-out, exports.
This route census is the floor for lena's CMS capability matrix (Phase 3 maps each to
lena's admin scope; full 668-route parity is NOT the goal — the goal is the capability
set the evidence shows, focused on courses/books/CMS per brief).

## 10. What is NOT verifiable (→ docs/GAPS.md)
Backend internals, exact API payloads beyond SSR shapes, session cookie flags, rate-limit
texts, password policy, drip configuration UI, membership tier shapes, appointment widget
provider, email template contents, admin UI layouts (no admin screenshots/chunks captured
for most dashboard pages), video hosting provider in use (Bunny fields present but null),
search/filter/sort behavior of catalogs (client chunks for catalog not fully captured),
pagination sizes, certificate design, quiz/assignment grading logic.
Each gets the most conservative standard implementation in the plan, never a silent guess.