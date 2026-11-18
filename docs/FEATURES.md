# FEATURES.md — Feature & user-flow inventory with source of evidence

Every feature below is tied to the reference evidence that proves it. Evidence key:
- `[observed]` — route/page captured in `_reference/site/` (HTML) or copy in `homepage_copy.txt`/`SPECIFICATION.md`.
- `[inferred]` — backend logic, form fields, validation, payments, dashboard, lesson player, etc. are NOT observable (EzyCourse SaaS server-side; login/payment pages WAF-blocked). Conservative implementation: smallest thing matching observable behavior; no silent invention.

Source files live in `_reference/`:
- `site/www.savvypro.org/index.html` — homepage (359 KB, captured)
- `site/www.savvypro.org/<route>.html` — captured route pages (193 HTML total)
- `homepage_copy.txt` — clean extracted homepage copy
- `sitemap.xml` — 181 URLs
- `SPECIFICATION.md`, `ASSETS.md`, `CAPTURE-NOTES.md` — capture context

---

## Build Status (Tailwind CSS v4 Migration)

| Template | Status | Evidence |
|---|---|---|
| Layout shell (Header + Footer) | working | `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` |
| Home page | working | `src/app/page.tsx`, `src/components/home/index.tsx` |
| Course catalog | working | `src/app/courses/page.tsx` |
| Course detail | working | `src/app/course-detail/[slug]/[id]/page.tsx` |
| Books catalog | working | `src/app/books/page.tsx` |
| Book detail | working | `src/app/book/[slug]/page.tsx` |
| Path landings | inferred | `src/components/templates/index.tsx` (PathLanding, PathPicker) |
| Blog index/post/category | inferred | not yet rebuilt |
| Auth pages | inferred | not yet rebuilt |
| Checkout | inferred | not yet rebuilt |
| Dashboard | inferred | not yet rebuilt |
| Lesson player | inferred | not yet rebuilt |
| Community | inferred | not yet rebuilt |
| Appointment | inferred | not yet rebuilt |
| Admin | inferred | not yet rebuilt |

Design system: `src/app/globals.css` (Tailwind base + design tokens).
Component library: `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx` (more components to be added).

---

## 1. Homepage / landing

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Hero | Headline "Build the Skills and Digital Systems to Grow Your Business.", sub-copy, trust stats (3,000+ students, 12+ Countries, 30+ corporate clients, 14+ years), 2 CTAs | `/` | `index.html`, `homepage_copy.txt` [observed] | public |
| Path picker | "Pick an option: Where are you right now?" — 5 audience paths, each with heading, sub-copy, button | `/` | `index.html`, `homepage_copy.txt` [observed] | public |
| Path-picker footer card | "Already have an account? ... Login Here" → `/signin/`; "Something else ... Chat with us" → `/contact-us/` | `/` | `index.html` [observed] | public |
| Testimonials ("STUDENT & CLIENT STORIES") | 6 cards: name, role, segment, quote, result, image (Ken Gunsalu, Wyonna Jean Britten, Timothy Choongo, Marian K. Shevtsov, Chisanga Simwenwa, Suwilanji Phiri) | `/` | `index.html`, `homepage_copy.txt` [observed] | public |
| Service pillars | MORE THAN COURSES / LEARNING / COACHING / HIRE HANDS-ON HELP, each heading + sub-copy, "Find My Path" CTA | `/` | `index.html`, `homepage_copy.txt` [observed] | public |
| Footer | Brand line, "Learn · Get Guidance · Get Hands-On Help", "Already have an account? Log in", "Something else? Contact Us" | `/` | `index.html`, `homepage_copy.txt` [observed] | public |
| Header / nav | Logo "Savvypro", nav links (Home, Starting a Business, Learn Digital Skills, Grow My Business, Build Your Expert Business, Business Solutions, Books, Contact Us, STUDENT LOGIN, Sign up, Login) | `/` | `index.html`, `homepage_copy.txt` [observed] | public |
| Alternate home / LP variants | `/savvypro-home`, `/savvypro-main`, `/savvypro`, `/savvypro-lp1` | various | `sitemap.xml` [observed] | public |

---

## 2. Path landings (audience self-segmentation)

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Starting a Business | Path landing | `/getting-started-page/` | `index.html` links + captured HTML [observed] | public |
| Learn Digital Skills | Path landing | `/learn-digital-skills/` | captured HTML [observed] | public |
| Small Business | Path landing | `/grow-my-business/` | captured HTML [observed] | public |
| Expertise | Path landing | `/build-your-expert-business/` | captured HTML [observed] | public |
| Established business | Path landing | `/business-solutions/` | captured HTML [observed] | public |
| Choose your path | Audience self-segmentation landing | `/choose-your-path/` | `sitemap.xml` [observed] | public |

Flow A (observed): `/` → pick a path → click path button → navigate to corresponding path-landing page.

---

## 3. Catalog

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Full product catalog | All products listing | `/all-products/` | `sitemap.xml`, nav [observed] | public |
| Courses listing | Course catalog | `/courses/` | captured HTML [observed] | public |

---

## 4. Course detail

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Course detail page | Course detail with slug + numeric id; purchase/enroll CTA | `/course-detail/<slug>/<id>/` (32 URLs) | captured HTML for several (e.g. content-creation-school, digital-skills-fasttrack, copywriting-crash-course) [observed] | public view; auth+paid to enroll/learn |
| Course list in catalog | `/courses/` surfaces course detail links | `/courses/` | captured HTML [observed] | public |

---

## 5. Mini-courses / programs

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Mini-courses index | `/mini-courses/` | captured HTML [observed] | public |
| Digital entrepreneurship program | `/digital-entreprenuership-program/` | captured HTML [observed] | public |
| Content creation school | `/content-creation-school/`, `/content-creation-school-main/` | captured HTML [observed] | public |
| Digital skills class / classes | `/digital-skills-class/`, `/digital-skills-classes/` | `sitemap.xml` [observed] | public |
| Digital SavvyPro | `/digital-savvypro/` | `sitemap.xml` [observed] | public |
| SavvyPro digital skills class / club / certification | `/savvypro-digital-skills-class/`, `/savvypro-digital-skills-club/`, `/savvypro-digital-skills-certification/` | captured HTML [observed] | public |
| Pay for certification | `/pay-for-savvypro-digital-skills-certification/` | captured HTML [observed] | public |
| CCP PDF program / CCS program outline download | `/ccp-pdf-program/`, `/ccs-program-outline-download/` | `sitemap.xml` [observed] | public |
| Launch your expert business bootcamp | `/launch-your-expert-business-bootcamp/` | `sitemap.xml` [observed] | public |
| Inner circle | `/inner-circle/` | captured HTML [observed] | public |
| For businesses | `/for-businesses/` | captured HTML [observed] | public |
| Private 1-on-1 consultation | `/private-1-on-1-consultation/` | captured HTML [observed] | public |
| Coaching program detail | `/coaching-program-detail/` | captured HTML [observed] | public |
| Learn with expert guidance / learning with a coach | `/learn-with-expert-guidance/`, `/learning-with-a-coach/` | `sitemap.xml` [observed] | public |
| CEO digital strategy | `/ceo-digital-strategy/` | captured HTML [observed] | public |
| Magnetic personal branding | `/magnetic-personal-branding/` | `sitemap.xml` [observed] | public |
| Marketing software | `/marketing-software/` | `sitemap.xml` [observed] | public |
| Freelancers / bundle / fasttrack / connect | `/freelancers/`, `/freelancer-bundle/`, `/freelancer-fasttrack-bundle`, `/freelancer-connect/` | captured HTML [observed] | public |
| Microgigs | `/microgigs/` | `sitemap.xml` [observed] | public |

---

## 6. Books / ebooks

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Books index | `/books/` | captured HTML [observed] | public |
| Ebooks index | `/ebooks/` | `sitemap.xml` [observed] | public |
| Individual book pages | Zero to Hero Social Media Manager, Social Media Content Creation, Infopreneur Roadmap, Start Where You Are, 7 Steps to Better Sales, Words That Sell, 11 Elements, Social Media Strategy | `/<slug>-book/`, etc. (10 URLs) | captured HTML for several [observed] | public view; auth+paid to read/download |

---

## 7. Blog

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Blog index | List + search + pagination | `/blog/` | captured HTML [observed] | public |
| Blog post | Article detail | `/blog/<slug>/` (22 URLs) | captured HTML for several [observed] | public |
| Blog category | Category listing | `/blog/category/<name>/<id>/` (6 URLs) | `sitemap.xml` [observed] | public |

---

## 8. Auth / account

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Login | Login page (form fields NOT observable — WAF-blocked) | `/login/` | captured HTML [observed page], fields [inferred] | public |
| Signin | Student login | `/signin/` | captured HTML [observed page], fields [inferred] | public |
| Signup | Signup | `/signup/` | captured HTML [observed page], fields [inferred] | public |
| User profile | `/user/` | `sitemap.xml` [observed route] | auth |
| Membership | Membership page | `/membership/` | captured HTML [observed] | auth |

Nav links "STUDENT LOGIN" / "Sign up" / "Login" and footer "Already have an account? Log in" → `/signin/` [observed].

Flow B (partially observed): nav → `/signin`/`/signup`/`/login`; login page server-side (EzyCourse) — provider, fields, validation [inferred].

---

## 9. Commerce / checkout / payments

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Offers | Offers index | `/offers/` | captured HTML [observed] | auth |
| Payments | Payments index | `/payments/` | `sitemap.xml` [observed] | auth |
| Pay for content creation school | `/payforcontentcreationschool/` | captured HTML [observed] | auth |
| Test KC payment | `/testkcpayment/` | `sitemap.xml` [observed] | auth |
| KC pay redirect | `/kcpay--redirect/` | `sitemap.xml` [observed] | auth |
| KC pay registration success | `/kcpay-registration-success/` | `sitemap.xml` [observed] | auth |
| Books Stripe payment | `/books-stripe-payment/` | `sitemap.xml` [observed] | auth |
| You have paid | Payment success | `/you-have-paid/` | `sitemap.xml` [observed] | auth |

Checkout/payment flow [inferred]: cart → checkout → payment (Stripe test mode in rebuild) → success → enrollment only after confirmed payment. Webhook signature verification, idempotency, order states, receipts [inferred].

---

## 10. Lead magnets / freebies / mailing list

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Freebies index | `/freebies/` | `sitemap.xml` [observed] | public |
| Free index | `/free/` | captured HTML [observed] | public |
| Signup for free email tips | `/signup-for-free-email-tips/` | `sitemap.xml` [observed] | public |
| Join mailing list | `/join-our-mailing-list/` | `sitemap.xml` [observed] | public |
| Visibility tips signup | `/visibility-tips-signup` | `sitemap.xml` [observed] | public |
| 101 Digital Skills PDF download | `/101-digital-skills-pdf-download/` | `sitemap.xml` [observed] | public |
| PDF file 101 digital skills | `/pdf-file-101-digital-skills/` | captured HTML [observed] | public |
| PDF download 7-step WhatsApp automation | `/pdf-download-file-7-step-whatsapp-automation/` | `sitemap.xml` [observed] | public |
| Win a book | Contest lead magnet | `/win-a-book/` | `sitemap.xml` [observed] | public |

---

## 11. Community / groups

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Community index | `/community/` | `sitemap.xml` [observed] | public |
| Community detail | `/community-detail/` | `sitemap.xml` [observed] | public |
| Community group detail | `/community/650/`, `/community/834/`, `/community/853/`, `/community/4943/`, `/community/4944/` | captured HTML for 834, 853 [observed] | public read; auth to post/comment/like |
| Groups index | `/groups/` | captured HTML [observed] | public |
| Contest | `/contest/` | captured HTML [observed] | public |

Community internals (groups, posts, comments, likes, libraries, contests, realtime, moderation) [inferred] — not observable beyond route paths.

---

## 12. Library / media

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Video library | `/video-library/` | captured HTML [observed] | public view; auth+paid to play |
| Audio library | `/audio-library/` | captured HTML [observed] | public view; auth+paid to play |
| Video details | `/video-details/` | `sitemap.xml` [observed] | public |
| Audio details | `/audio-details/` | `sitemap.xml` [observed] | public |

---

## 13. Legal / policy / about / contact

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Contact Us | `/contact-us/` | captured HTML [observed] | public |
| About Us | `/about-us/` | captured HTML [observed] | public |
| Testimonials | `/testimonials/` | captured HTML [observed] | public |
| CCS testimonials | `/ccs-testimonials/` | captured HTML [observed] | public |
| Terms and conditions | `/terms-and-conditions`, `/savvypro-terms-and-conditions/` | `sitemap.xml` [observed] | public |
| Privacy policy | `/privacy-policy`, `/savvypro-privacy-policy/` | `sitemap.xml` [observed] | public |
| Refund policy | `/refund-policy/`, `/savvypro-refund-policy` | captured HTML for refund [observed] | public |
| Appointment booking | `/appointment/` | `sitemap.xml` [observed] | public |

---

## 14. Coaching / appointments / webinars

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Appointment | `/appointment/` | `sitemap.xml` [observed] | public |
| Private 1-on-1 consultation | `/private-1-on-1-consultation/` | captured HTML [observed] | public |
| Freelancer webinar | `/freelancer-webinar/` | captured HTML [observed] | public |
| Webinar registration (freelancing) | `/webinar-registration-freelancing/` | `sitemap.xml` [observed] | public |

Booking, availability, emails, .ics [inferred].

---

## 15. AI assistant / chatbot

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Savvybot AI agent | `/savvybot-ai-agent/` | captured HTML [observed] | public |
| Chatbot test page | `/chatbot-test-page/` | `sitemap.xml` [observed] | public |

AI assistant provider interface, streaming, per-user limits, graceful failure [inferred]. Mock provider used in rebuild.

---

## 16. WhatsApp automation (recurring theme)

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| WhatsApp automation setup / system setup | `/7-sytem-whatsapp-automation-setup/`, `/7-step-whatspp-automation-system-setup/` | `sitemap.xml` [observed] | public |
| WhatsApp automation toolkit | `/whatsapp-automation-toolkit/` | `sitemap.xml` [observed] | public |
| WhatsApp marketing for SMEs | `/whatsapp-marketing-for-smes/` | `sitemap.xml` [observed] | public |
| 12 savvy ways to use WhatsApp for marketing | `/12-savvy-ways-to-use-whatsapp-for-marketing/` | `sitemap.xml` + blog [observed] | public |
| 17 ways African businesses use WhatsApp | `/17-ways-african-businesses-use-whatsapp-to-get-customers-with-real-examples/` | `sitemap.xml` + blog [observed] | public |
| Stop losing sales to unanswered WhatsApp messages | `/stop-losing-sales-to-unanswered-whatsapp-messages/` | `sitemap.xml` + blog [observed] | public |
| Botpenguin images | `/botpenguin-images/` | `sitemap.xml` [observed] | public |
| 7 Steps to Better Sales (WhatsApp-related book) | `/7-steps-to-better-sales-book/` | `sitemap.xml` [observed] | public |

---

## 17. Certificates

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| SavvyPro digital skills certification | `/savvypro-digital-skills-certification/` | captured HTML [observed] | public view; auth+paid to earn |

Certificate issuance logic [inferred] — reference shows a certification page but not the certificate template or issuance flow.

---

## 18. Dashboard / lesson player / learning

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Dashboard | Student dashboard | — | NOT in sitemap (post-login, not capturable) [inferred] | auth |
| Lesson player | Per-lesson progress, resume, completion | — | NOT observable [inferred] | auth+paid |
| Certificates on completion | — | NOT observable [inferred] | auth+paid |

These are implied by the platform type (course/coaching SaaS) and `/user`, `/membership` routes, but no dashboard/lesson-player HTML was captured. [inferred] — conservative implementation.

---

## 19. Mobile / apps / other

| Feature | Description | Routes | Source | Auth |
|---|---|---|---|---|
| Mobile apps page | `/savvypro-mobile-apps/` | captured HTML [observed] | public |
| VA cost calculator | `/vacostcalculator/` | `sitemap.xml` [observed] | public |
| Pabbly form test | `/pabbly-form-test/` | `sitemap.xml` [observed] | public |
| Kinsumo test | `/kinsumo-test/` | `sitemap.xml` [observed] | public |
| Consultant profiles | `/susan-mwenda-mulongoti/`, `/susan-mwenda-mulongoti-consultant/` | captured HTML [observed] | public |
| Enroll in digital entrepreneurship academy | `/enroll-in-digital-ntreprenuership-academy/` | captured HTML [observed] | public |
| 7 daily sales & marketing actions | `/7-daily-sales-and-marketing-actions-for-your-sales-team/` | captured HTML [observed] | public |
| 5 types of expert businesses | `/5-types-of-expert-businesses-you-can-launch/` | captured HTML [observed] | public |
| 3 keys to getting customers | `/3keys-to-getting-more-customers/` | `sitemap.xml` [observed] | public |
| Digital skills and tools signup | `/digital-skills-and-tools-to-build-your-business-signup/` | captured HTML [observed] | public |
| Testing social media sharing buttons | `/testing-social-media-sharing-buttons-for-pages/` | `sitemap.xml` [observed] | public |

---

## 20. Anti-copy (copy protection)

`killCopy` / `reEnable`: `document.onselectstart = return false`, text selection disabled on homepage [observed in inline JS]. [inferred decision] NOT reproduced in rebuild — harmful to accessibility/UX; decision deferred to product owner.

---

## 21. Third-party integrations (to reconfigure, NOT copied)

| Integration | Reference value | Rebuild handling |
|---|---|---|
| Google Tag Manager | `GTM-PH89WSX4` | placeholder, owner-configurable [observed] |
| Hotjar | `hjid:645767` | placeholder, owner-configurable [observed] |
| Cloudflare Insights beacon | `static.cloudflareinsights.com` | removed or replaced [observed] |
| Google Fonts | Figtree (fonts.gstatic.com) | self-host or CDN [observed] |

---

## Gaps
- Backend/server source, DB schema, API controllers: NOT capturable (hosted EzyCourse SaaS). All [inferred].
- Login/signup form fields, validation, auth provider: pages WAF-blocked. [inferred] email + password, Firebase Auth.
- Payment webhook details, order states: [inferred] Stripe test mode.
- Dashboard, lesson player, certificates issuance: not observable. [inferred] conservative.
