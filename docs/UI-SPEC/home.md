# UI-SPEC/home.md — Homepage template (`/`, `/savvypro-home`, `/savvypro-main`, `/savvypro`, `/savvypro-lp1`)

Source: `_reference/site/www.savvypro.org/index.html` (359 KB captured) + `homepage_copy.txt` +
`_reference/SPECIFICATION.md` §3–§4. All measurements are [inferred] from the reconstruction; live per-breakpoint
computed measurements were not possible (no Playwright). See TOKENS.md.

## Global
- `<html lang="default">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`
- `<title>Savvypro</title>`; OG tags: `og:locale=en_US`, `og:type=website`, `og:title=Savvypro`, `og:url`, `og:site_name=Savvypro`, `og:image 1600×840`
- Favicon: `https://letcheck.b-cdn.net/1887/clnizq4lo015wgq9nh2425qsy.jpg`
- Tracking (replace with owner placeholders): GTM `GTM-PH89WSX4`, Hotjar `hjid:645767`, Cloudflare Insights beacon
- Anti-copy `killCopy`/`reEnable` (text selection disabled) — [inferred] NOT replicated in rebuild
- Font stylesheet: `<link href="/api/public/setting/custom/font" rel="stylesheet">` + Figtree from Google Fonts
- CSS: `cdn.ezycourse.net/_next/static/css/bba21c04c9008d1b.css`

## Header / nav (top of page)
- Logo: "Savvypro" (top-left)
- Nav links: Home · Starting a Business · Learn Digital Skills · Grow My Business · Build Your Expert Business · Business Solutions · Books · Contact Us · STUDENT LOGIN · Sign up · Login
- [inferred] Responsive: mobile hamburger below md; desktop horizontal nav at lg+
- [inferred] Height: `--ezy-header-height: 0px` (reference); sticky header not observed

## Hero
- Wrapper: padding 100px top/bottom; hero background image + `#090e21` (hero bg); class `kjhSPO`
- Headline: "Build the Skills and Digital Systems to Grow Your Business." — Verdana 50px, off-white text
- Sub-headline: "Practical systems, skills, training and hands-on help to grow revenue and build your brand." — copy block `bkpsqR`: 25px Verdana, `#d1d5db`, line-height 48px
- Trust stats (4): 3,000+ students · 12+ Countries · 30+ corporate clients · 14+ years of real results
- CTAs (2): "Start a Free Class", "Explore CEO Digital Strategies" — blue `#00a3ff` buttons, 10px 20px padding, radius 5px, hover `#3b3b3b`
- [inferred] Layout at breakpoints:
  - 375px: single column, hero text centered, stats stacked, buttons full-width or stacked
  - 768px: hero text left-aligned or centered, stats row
  - 1024px+: max-width container, headline full size, stats inline row, buttons side-by-side

## Path picker ("Pick an option: Where are you right now?")
- Section heading: "Pick an option: Where are you right now?"
- 5 audience paths, each: heading + sub-copy + button:
  1. "I am Starting A Business" — "turn your idea into something real" — "Get Started" → `/getting-started-page/`
  2. "I want to learn Digital Skills" — "hands-on training to work, create, grow, market" — "Start Free" → `/learn-digital-skills/`
  3. "I have a Small Business" — "marketing, sales, business systems, grow revenue" — "Grow My Business" → `/grow-my-business/`
  4. "I have Expertise to Build On" — "turn what you know into brand/business/product" — "Build My Brand" → `/build-your-expert-business/`
  5. "My Business is Established" — "systems, digital capability, team capacity, next level" — "Business Solutions" → `/business-solutions/`
- [inferred] 5-column grid at 1024px+; stacked single column at 375px; 2–3 column at 768px
- Each card: heading (Verdana or Figtree), sub-copy, button

## Path-picker footer card
- "Already have an account? ... Login Here" → `/signin/`
- "Something else ... Chat with us" → `/contact-us/`

## Social proof — "STUDENT & CLIENT STORIES"
- Heading: "Real People. Real Skills. Real Results." / sub: "Hear from students at every stage of their business journey."
- 6 testimonial cards (name, role, segment, quote, result, image):
  1. Ken Gunsalu — Nutritionist & Agribusiness owner, NutriCare Malawi — Small Business — quote — "Saves on designer fees and creates his own packaging."
  2. Wyonna Jean Britten — CEO, The Organic Biochemist, Zimbabwe — Established business — quote — "Stronger online presence, now helping other small businesses grow."
  3. Timothy Choongo — Teacher & web programmer, Zambia — Expertise — quote — "Facebook page grew from 4,000 to almost 6,000 followers."
  4. Marian K. Shevtsov — Economist & parenting coach, Netherlands — Startup — quote — "Building the foundation to launch her own digital business."
  5. Chisanga Simwenwa — Founder, digital marketing agency, Zambia — Established business — quote — "Now attracting high-end clients."
  6. Suwilanji Phiri — Clinician & social media manager, Zambia — Freelancer - Digital Skills — quote — "Now landing jobs, local and international."
- Testimonial images (6 URLs, BunnyCDN `ezycourse.b-cdn.net/1887/...`) [observed URLs; binaries partially in `site/`]
- [inferred] Cards `#ffffff`, radius 10px, min-height 430px; grid 3-col at 1024px+, 2-col at 768px, 1-col at 375px

## Service pillars (bottom)
- Section heading: "MORE THAN COURSES" — "Practical ways to build your digital capacity"
- 4 pillars, each heading + sub-copy:
  - LEARNING — "Learn to do it yourself. Courses, programs and practical resources to build the skills and knowledge you need."
  - COACHING — "Get expert guidance. Coaching, feedback and strategic support to help you make better decisions and move forward."
  - HIRE HANDS-ON HELP — "Bring in an expert. Hands-on consulting and implementation support for bigger problems, bigger businesses and bigger moves."
- CTA: "Find My Path" — magenta `#ff007a`, 42px, rounded 50px, 40px side padding (big rounded CTA)
- [inferred] 4-col grid at 1024px+, stacked at 375px

## Footer
- Brand: "SavvyPro — Explore — Learn. Get Guidance. Get Hands-On Help. Courses, coaching and expert support for people building what's next."
- "Learn · Get Guidance · Get Hands-On Help"
- "Already have an account? Log in" · "Something else? Contact Us"

## Breakpoint behavior (inferred, to be verified against UI-SPEC measurements in Phase 4)
| Section | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Hero | stacked, centered | left/center | full container | full container | full container |
| Path picker | 1 col | 2–3 col | 5 col | 5 col | 5 col |
| Testimonials | 1 col | 2 col | 3 col | 3 col | 3 col |
| Service pillars | 1 col | 2 col | 4 col | 4 col | 4 col |
| Nav | hamburger | hamburger | horizontal | horizontal | horizontal |

## Loading / empty / error states
- nProgress bar `#29D` fixed top z-index 9999 during navigation (reference loading indicator)
- [inferred] Page-level skeleton/placeholder while hero + testimonials load

## Accessibility (inferred)
- Semantic header/nav/main/footer; heading hierarchy h1→h2→h3; alt text on testimonial images; focus-visible on buttons/links
- Buttons and links meet contrast on dark hero bg (off-white text)

## Gaps
- Exact computed spacing/gap/width per breakpoint — [inferred]; to be validated in Phase 4 layout comparison within ±4px.
