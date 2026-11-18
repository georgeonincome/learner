# COVERAGE.md — Route map: all 181 sitemap URLs -> template -> content entry -> auth requirement

Source: `_reference/sitemap.xml` (181 `<loc>` entries, captured 2026-11-04).
Route categories per `_reference/SPECIFICATION.md` §2 plus `homepage_copy.txt` nav.
Auth requirement key: `public` = no session required; `auth` = signed-in session required;
`auth+paid` = signed-in + active enrollment/membership required; `n/a` = API/redirect, not a rendered page.

Every rendered route below must exist in the rebuild and be reachable via `generateStaticParams`
(Phase M4) so all 181 URLs return 200 with a unique `<title>` and `<meta description>`.

## Template inventory

| Template | Description | Auth |
|---|---|---|
| `home` | Homepage + alternate home / LP variants (hero, path picker, testimonials, service pillars, footer) | public |
| `path-landing` | Audience self-segmentation landing pages (5 paths + choose-your-path) | public |
| `catalog` | Full product/all-products catalog + courses listing | public |
| `course-detail` | Course detail page (`course-detail/<slug>/<id>/`) with purchase/enroll CTA | public (view), auth+paid (enroll/learn) |
| `program` | Mini-course / program / coaching / bootcamp / club landing | public (view), auth+paid (enroll) |
| `book` | Book/ebook product page | public (view), auth+paid (read/download) |
| `blog-list` | Blog index (list + search + pagination) | public |
| `blog-post` | Blog article detail | public |
| `blog-category` | Blog category listing | public |
| `auth` | Login / signin / signup | public (redirect if already authed) |
| `account` | User profile + membership page | auth |
| `checkout` | Offer/payment pages (offers, payments, Stripe redirect, success) | auth |
| `lead-magnet` | Freebies, PDF downloads, mailing-list signup | public (email capture) |
| `community` | Community index, group detail, groups index, contest | public (read), auth (post/comment/like) |
| `library` | Video/audio library + details | public (view), auth+paid (play) |
| `legal` | About, contact, testimonials, terms, privacy, refund, appointment | public |
| `other` | Mobile apps, AI agent/chatbot, calculators, consultant profiles, enrollment pages | mixed |
| `api` | Public API endpoint (not a rendered page) | n/a |

## Complete URL coverage (181 entries)

### `home` — 5 URLs (all public)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 1 | `/` (home) | Homepage (hero, trust stats, path picker, testimonials, pillars, footer) | public | Captured HTML: `site/www.savvypro.org/index.html`; copy: `homepage_copy.txt` |
| 1 | `/savvypro-home` | Alternate home variant | public | LP variant; same template as home |
| 2 | `/savvypro-main` | Alternate home variant | public | LP variant |
| 3 | `/savvypro` | Home variant | public | |
| 4 | `/savvypro-lp1` | Landing-page variant 1 | public | |

### `path-landing` — 6 URLs (all public)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 5 | `/getting-started-page` | "Starting a Business" path | public | Captured HTML present |
| 6 | `/learn-digital-skills` | "Learn Digital Skills" path | public | Captured HTML present |
| 7 | `/grow-my-business` | "Small Business" path | public | Captured HTML present |
| 8 | `/build-your-expert-business` | "Expertise" path | public | Captured HTML present |
| 9 | `/business-solutions` | "Established business" path | public | Captured HTML present |
| 10 | `/choose-your-path` | Audience self-segmentation | public | Maps to one of the 5 path landings |

### `catalog` — 2 URLs (all public)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 11 | `/all-products` | Full product catalog | public | |
| 12 | `/courses` | Courses listing | public | Captured HTML present |

### `course-detail` — 32 URLs (`course-detail/<slug>/<id>/`)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 13 | `/course-detail/infoprenuer-roadmap-ebook/3982` | Course detail | public view | Numeric id = course identifier |
| 14 | `/course-detail/infopreneur-audiobook/3986` | Course detail | public view | |
| 15 | `/course-detail/social-media-content-creation-ebook/3995` | Course detail | public view | |
| 16 | `/course-detail/infoprenuer-how-to-make-money-from-your-passion-knowledge-and-experience/4885` | Course detail | public view | |
| 17 | `/course-detail/content-creation-school/7107` | Course detail | public view | Captured HTML present |
| 18 | `/course-detail/audiobook-zero-to-hero-social-media-manager/10199` | Course detail | public view | Captured HTML present |
| 19 | `/course-detail/ebook-zero-to-hero-social-media-manager/10317` | Course detail | public view | |
| 20 | `/course-detail/audiobook-social-media-content-creation/12514` | Course detail | public view | |
| 21 | `/course-detail/digital-tools/17996` | Course detail | public view | |
| 22 | `/course-detail/digital-marketing-conversion-mastery/18127` | Course detail | public view | Captured HTML present |
| 23 | `/course-detail/copywriting-crash-course/23197` | Course detail | public view | Captured HTML present |
| 24 | `/course-detail/digital-skills-fasttrack/24115` | Course detail | public view | Captured HTML present |
| 25 | `/course-detail/content-creation-school-2026/36467` | Course detail | public view | Captured HTML present |
| 26 | `/course-detail/visbility-course-why-you-are-invible-and-how-to-change-it/40331` | Course detail | public view | |
| 27 | `/course-detail/1-year-content-plan-in-3-days/41281` | Course detail | public view | Captured HTML present |
| 28 | `/course-detail/content-creation-school-2026-copy-1776429703034/41634` | Course detail | public view | |
| 29 | `/course-detail/manage-and-grow-your-business/42538` | Course detail | public view | Captured HTML present |
| 30 | `/course-detail/content-creation-school-2026-copy-1790672869460/49068` | Course detail | public view | |
| 31 | `/course-detail/content-creation-school-2026-tutor-1790673216325/49070` | Course detail | public view | |
| 32 | `/course-detail/start-smallthink-big/49186` | Course detail | public view | |
| 33 | `/course-detail/start-where-you-are-audiobook/49791` | Course detail | public view | |
| 34 | `/course-detail/ebook-zero-to-hero-social-media-manager-copy-1792212437299/49792` | Course detail | public view | |
| 35 | `/course-detail/audiobook-zero-to-hero-social-media-manager-copy-1792212460894/49793` | Course detail | public view | |
| 36 | `/course-detail/infopreneur-audiobook-copy-1792213073560/49794` | Course detail | public view | |
| 37 | `/course-detail/infoprenuer-roadmap-ebook-copy-1792213119365/49795` | Course detail | public view | |
| 38 | `/course-detail/social-media-content-creation-ebook-copy-1792214265244/49796` | Course detail | public view | |
| 39 | `/course-detail/audiobook-social-media-content-creation-copy-1792214327806/49797` | Course detail | public view | |
| 40 | `/course-detail/free-audiobook-social-media-paid-ads/49801` | Course detail | public view | Captured HTML present |
| 41 | `/course-detail/how-to-create-and-sell-your-first-online-course/49870` | Course detail | public view | |
| 42 | `/course-detail/free-audiobook-how-to-create-and-sell-your-first-online-course/49906` | Course detail | public view | |
| 43 | `/course-detail/free-audiobook-autopilot-sales-system/49908` | Course detail | public view | |
| 44 | `/course-detail/start-where-you-are-audiobook-copy-1792925319820/50151` | Course detail | public view | |

### `program` — 33 URLs (public view; auth+paid to enroll/access)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 45 | `/mini-courses` | Mini-courses index | public | Captured HTML present |
| 46 | `/digital-entreprenuership-program` | Digital entrepreneurship program | public | Captured HTML present |
| 47 | `/content-creation-school` | Content creation school program | public | Captured HTML present |
| 48 | `/content-creation-school-main` | Content creation school main | public | |
| 49 | `/digital-skills-class` | Digital skills class | public | |
| 50 | `/digital-skills-classes` | Digital skills classes | public | |
| 51 | `/digital-savvypro` | Digital SavvyPro | public | |
| 52 | `/savvypro-digital-skills-class` | SavvyPro digital skills class | public | |
| 53 | `/savvypro-digital-skills-club` | SavvyPro digital skills club | public | Captured HTML present |
| 54 | `/savvypro-digital-skills-certification` | SavvyPro digital skills certification | public | Captured HTML present |
| 55 | `/pay-for-savvypro-digital-skills-certification` | Pay for certification | public | Captured HTML present |
| 56 | `/ccp-pdf-program` | CCP PDF program (lead magnet) | public | |
| 57 | `/ccs-program-outline-download` | CCS program outline download | public | |
| 58 | `/launch-your-expert-business-bootcamp` | Expert business bootcamp | public | |
| 59 | `/inner-circle` | Inner circle program | public | Captured HTML present |
| 60 | `/for-businesses` | For businesses program | public | Captured HTML present |
| 61 | `/private-1-on-1-consultation` | Private 1-on-1 consultation | public | Captured HTML present |
| 62 | `/coaching-program-detail` | Coaching program detail | public | Captured HTML present |
| 63 | `/learn-with-expert-guidance` | Learn with expert guidance | public | |
| 64 | `/learning-with-a-coach` | Learning with a coach | public | |
| 65 | `/ceo-digital-strategy` | CEO digital strategy | public | Captured HTML present |
| 66 | `/magnetic-personal-branding` | Magnetic personal branding | public | |
| 67 | `/marketing-software` | Marketing software | public | |
| 68 | `/freelancers` | Freelancers program | public | Captured HTML present |
| 69 | `/freelancer-bundle` | Freelancer bundle | public | Captured HTML present |
| 70 | `/freelancer-fasttrack-bundle` | Freelancer fasttrack bundle | public | |
| 71 | `/freelancer-connect` | Freelancer connect | public | Captured HTML present |
| 72 | `/microgigs` | Microgigs | public | |
| 73 | `/freelancer-webinar` | Freelancer webinar | public | Captured HTML present |
| 74 | `/webinar-registration-freelancing` | Webinar registration (freelancing) | public | |
| 75 | `/freelancing-free-tips` | Freelancing free tips | public | Captured HTML present |
| 76 | `/freelancing-tips-signup` | Freelancing tips signup | public | |
| 77 | `/ccs-vsl1` | CCS video sales letter page | public | Captured HTML present (ccs-vsl1.html) |

### `book` — 10 URLs (public view; auth+paid to read/download)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 78 | `/books` | Books index | public | Captured HTML present |
| 79 | `/ebooks` | Ebooks index | public | |
| 80 | `/zero-to-hero-social-media-manager-book` | Zero to Hero Social Media Manager book | public | Captured HTML present |
| 81 | `/social-media-content-creation-book` | Social media content creation book | public | Captured HTML present |
| 82 | `/infopreneur-roadmap-book` | Infopreneur Roadmap book | public | |
| 83 | `/start-where-you-are-book` | Start Where You Are book | public | Captured HTML present |
| 84 | `/7-steps-to-better-sales-book` | 7 Steps to Better Sales book | public | |
| 85 | `/words-that-sell-copywriting-secrets-that-make-customers-buy` | Words That Sell copywriting book | public | Captured HTML present |
| 86 | `/the-11-elements-behind-a-high-value-expert-brand` | 11 Elements high-value expert brand | public | Blog-format book article |
| 87 | `/social-media-strategy-book` | Social media strategy book | public | |
| 88 | `/7-steps-to-better-sales-book` | (duplicate path, same template) | public | |

### `blog-list` — 1 URL (public)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 89 | `/blog` | Blog index (list, search, pagination) | public | Captured HTML present |

### `blog-post` — 22 URLs (public)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 90 | `/blog/making-your-own-salary-stay-home-mums` | Blog post | public | |
| 91 | `/blog/how-to-make-your-own-salary-part-2` | Blog post | public | Captured HTML present |
| 92 | `/blog/how-to-make-your-own-salary-part-3` | Blog post | public | |
| 93 | `/blog/7-ways-to-find-mentorship` | Blog post | public | |
| 94 | `/blog/learn-content-creation-skills` | Blog post | public | Captured HTML present |
| 95 | `/blog/learn-digital-marketing` | Blog post | public | Captured HTML present |
| 96 | `/blog/5-types-of-expert-businesses-you-can-start` | Blog post | public | |
| 97 | `/blog/1-page-sales-and-marketing-strategy` | Blog post | public | |
| 98 | `/blog/ceo-mistakes-in-digital-growth-and-how-to-avoid-them` | Blog post | public | Captured HTML present |
| 99 | `/blog/17-proven-ways-to-make-your-brand-unmissable-online-even-on-a-tiny-budget` | Blog post | public | |
| 100 | `/blog/11-reasons-customers-dont-buy-and-how-to-fix-them-fast` | Blog post | public | |
| 101 | `/blog/99-online-gigs-you-can-start-right-now-african-edition` | Blog post | public | |
| 102 | `/blog/14-types-of-clients-you-can-work-with-as-a-content-creator` | Blog post | public | Captured HTML present |
| 103 | `/blog/12-savvy-ways-to-use-whatsapp-for-marketing` | Blog post | public | Captured HTML present |
| 104 | `/blog/why-you-avoid-creating-content` | Blog post | public | |
| 105 | `/blog/marketing-budget-recommendations-zambia-edition` | Blog post | public | Captured HTML present |
| 106 | `/blog/marketing-budget-recommendations-global-edition` | Blog post | public | |
| 107 | `/blog/susan-lumba-mwenda` | Blog post | public | |
| 108 | `/blog/the-11-elements-behind-a-high-value-expert-brand` | Blog post | public | |
| 109 | `/blog/are-linkedin-ads-really-the-cure-for-your-broke-ass-lead-problem` | Blog post | public | |
| 110 | `/blog/17-ways-african-businesses-use-whatsapp-to-get-customers-with-real-examples` | Blog post | public | Captured HTML present |
| 111 | `/blog/stop-losing-sales-to-unanswered-whatsapp-messages` | Blog post | public | Captured HTML present |

### `blog-category` — 6 URLs (public)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 112 | `/blog/category/ceo-digital-strategies/766` | Blog category | public | |
| 113 | `/blog/category/digital-biz-ideas/1147` | Blog category | public | |
| 114 | `/blog/category/growth-marketing/1149` | Blog category | public | |
| 115 | `/blog/category/freelancer-listings/2817` | Blog category | public | |
| 116 | `/blog/category/personal-branding/3821` | Blog category | public | |
| 117 | `/blog/category/susan-lumba-mwenda/3870` | Blog category | public | |

### `auth` — 3 URLs (public; redirect if authed)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 118 | `/login` | Login | public | Captured HTML present; form fields not observable (WAF) -> [inferred] |
| 119 | `/signin` | Signin (student login) | public | Captured HTML present |
| 120 | `/signup` | Signup | public | Captured HTML present |

### `account` — 2 URLs (auth required)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 121 | `/user` | User profile | auth | |
| 122 | `/membership` | Membership page | auth | Captured HTML present |

### `checkout` — 8 URLs (auth required; payment flows)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 123 | `/offers` | Offers index | auth | Captured HTML present |
| 124 | `/payments` | Payments index | auth | |
| 125 | `/payforcontentcreationschool` | Pay for content creation school | auth | Captured HTML present |
| 126 | `/testkcpayment` | Test KC payment | auth | |
| 127 | `/kcpay--redirect` | KC pay redirect | auth | |
| 128 | `/kcpay-registration-success` | KC pay registration success | auth | |
| 129 | `/books-stripe-payment` | Books Stripe payment | auth | |
| 130 | `/you-have-paid` | Payment success | auth | |

### `lead-magnet` — 11 URLs (public; email capture)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 131 | `/freebies` | Freebies index | public | |
| 132 | `/free` | Free index | public | Captured HTML present |
| 133 | `/signup-for-free-email-tips` | Signup for free email tips | public | |
| 134 | `/join-our-mailing-list` | Join mailing list | public | |
| 135 | `/visibility-tips-signup` | Visibility tips signup | public | |
| 136 | `/101-digital-skills-pdf-download` | 101 Digital Skills PDF download | public | |
| 137 | `/pdf-file-101-digital-skills` | PDF file 101 digital skills | public | Captured HTML present |
| 138 | `/pdf-download-file-7-step-whatsapp-automation` | 7-step WhatsApp automation PDF | public | |
| 139 | `/win-a-book` | Win a book (contest lead magnet) | public | |
| 140 | `/ccp-pdf-program` | CCP PDF program | public | (also program) |
| 141 | `/ccs-program-outline-download` | CCS program outline download | public | (also program) |

### `community` — 9 URLs (public read; auth to post/comment/like)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 142 | `/community` | Community index | public | |
| 143 | `/community-detail` | Community detail | public | |
| 144 | `/community/650` | Community group detail | public read | |
| 145 | `/community/834` | Community group detail | public read | Captured HTML present |
| 146 | `/community/853` | Community group detail | public read | Captured HTML present |
| 147 | `/community/4943` | Community group detail | public read | |
| 148 | `/community/4944` | Community group detail | public read | |
| 149 | `/groups` | Groups index | public | Captured HTML present |
| 150 | `/contest` | Contest | public | Captured HTML present |

### `library` — 4 URLs (public view; auth+paid to play)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 151 | `/video-library` | Video library | public | Captured HTML present |
| 152 | `/audio-library` | Audio library | public | Captured HTML present |
| 153 | `/video-details` | Video details | public | |
| 154 | `/audio-details` | Audio details | public | |

### `legal` — 11 URLs (all public)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 155 | `/contact-us` | Contact Us | public | Captured HTML present |
| 156 | `/about-us` | About Us | public | Captured HTML present |
| 157 | `/testimonials` | Testimonials | public | Captured HTML present |
| 158 | `/ccs-testimonials` | CCS testimonials | public | Captured HTML present |
| 159 | `/savvypro-terms-and-conditions` | Terms and conditions | public | |
| 160 | `/terms-and-conditions` | Terms and conditions (alias) | public | |
| 161 | `/savvypro-privacy-policy` | Privacy policy | public | |
| 162 | `/privacy-policy` | Privacy policy (alias) | public | |
| 163 | `/savvypro-refund-policy` | Refund policy | public | Captured HTML present |
| 164 | `/refund-policy` | Refund policy (alias) | public | |
| 165 | `/appointment` | Appointment booking | public | |

### `other` — 23 URLs (mixed)

| # | Sitemap URL | Content entry | Auth | Notes |
|---|---|---|---|---|
| 166 | `/savvypro-mobile-apps` | Mobile apps page | public | Captured HTML present |
| 167 | `/savvybot-ai-agent` | Savvybot AI agent | public | Captured HTML present |
| 168 | `/chatbot-test-page` | Chatbot test page | public | |
| 169 | `/vacostcalculator` | VA cost calculator | public | |
| 170 | `/pabbly-form-test` | Pabbly form test | public | |
| 171 | `/kinsumo-test` | Kinsumo test | public | |
| 172 | `/susan-mwenda-mulongoti` | Consultant profile | public | Captured HTML present |
| 173 | `/susan-mwenda-mulongoti-consultant` | Consultant profile | public | Captured HTML present |
| 174 | `/enroll-in-digital-ntreprenuership-academy` | Enroll in academy | public | Captured HTML present |
| 175 | `/7-daily-sales-and-marketing-actions-for-your-sales-team` | 7 daily sales & marketing actions | public | Captured HTML present |
| 176 | `/5-types-of-expert-businesses-you-can-launch` | 5 types of expert businesses | public | Captured HTML present |
| 177 | `/3keys-to-getting-more-customers` | 3 keys to getting customers | public | |
| 178 | `/digital-skills-and-tools-to-build-your-business-signup` | Digital skills/tools signup | public | Captured HTML present |
| 179 | `/digital-skills-fasttrack` | Digital skills fasttrack | public | (also course detail) |
| 180 | `/savvypro-digital-skills-certification` | Certification (dup of #55) | public | |
| 181 | `/pay-for-savvypro-digital-skills-certification` | Pay for certification (dup of #56) | public | |
| 182 | `/learning-hub` | Learning hub page | public | Captured HTML present (learning-hub.html) |
| 183 | `/testing-social-media-sharing-buttons-for-pages` | Social media sharing buttons test page | public | |
| 184 | `/botpenguin-images` | Botpenguin images (WhatsApp chatbot) | public | |
| 185 | `/7-sytem-whatsapp-automation-setup` | WhatsApp automation setup | public | |
| 186 | `/7-step-whatspp-automation-system-setup` | WhatsApp automation system setup | public | |
| 187 | `/whatsapp-automation-toolkit` | WhatsApp automation toolkit | public | |
| 188 | `/whatsapp-marketing-for-smes` | WhatsApp marketing for SMEs | public | |

### `api` — not a rendered page (n/a)

- `/api/public/setting/custom/font` — public font-setting endpoint [observed in JS chunks + homepage `<link rel="stylesheet">`]. Listed for completeness; not part of the 181 rendered-page count.

## Coverage summary

| Template | URLs | Public | Auth | Auth+paid |
|---|---|---|---|---|
| home | 5 | 5 | 0 | 0 |
| path-landing | 6 | 6 | 0 | 0 |
| catalog | 2 | 2 | 0 | 0 |
| course-detail | 32 | 32 | 0 | (enroll) |
| program | 33 | 33 | 0 | (enroll) |
| book | 10 | 10 | 0 | (read/download) |
| blog-list | 1 | 1 | 0 | 0 |
| blog-post | 22 | 22 | 0 | 0 |
| blog-category | 6 | 6 | 0 | 0 |
| auth | 3 | 3 | 0 | 0 |
| account | 2 | 0 | 2 | 0 |
| checkout | 8 | 0 | 8 | 0 |
| lead-magnet | 11 | 11 | 0 | 0 |
| community | 9 | 9 | (write) | 0 |
| library | 4 | 4 | 0 | (play) |
| legal | 11 | 11 | 0 | 0 |
| other | 23 | 23 | 0 | 0 |
| **Total rendered (unique)** | **181** | **179** | **10** | — |

Note: per-section counts list each URL under every category it appears in (e.g. `digital-skills-fasttrack` is both a course detail and a mobile/other page; certification pages are both program and other), so section counts sum to more than 181 unique URLs. `/api/public/setting/custom/font` is an API endpoint, not a rendered page, and is excluded from the rendered-page total.

## Verification target (Phase 4)
- All 181 rendered URLs return HTTP 200.
- Each has a unique `<title>` and `<meta description>`.
- No console errors on any route.

## Gaps
- `capture\` and `pages\*.md` missing from reference (see GAPS.md); HTML equivalents used where present.
- ~130 routes known by path only (no captured HTML); template assignment by URL pattern is [inferred].
- Duplicate/alias routes (terms/privacy/refund ×2, course-detail duplicates) normalized to a single template each.
