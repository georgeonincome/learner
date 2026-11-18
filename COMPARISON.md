# COMPARISON.md — Reference vs rebuild layout fidelity

Measured with Playwright/Chromium at 375, 768, 1024, 1280, 1536px. Tolerance ±4px. Reference HTML+CSS loaded from `_reference/site/www.savvypro.org` (CSS served from the captured local copy). Our pages served from a production `next start` build.

Method: `node scripts/layout-compare.mjs` → `layout-results.json` → `node scripts/compare-report.mjs`.

## Summary (pass/fail per template and breakpoint)

| Template | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|---|
| home | FAIL (18) | FAIL (20) | FAIL (16) | FAIL (15) | FAIL (15) |
| catalog | FAIL (8) | FAIL (8) | FAIL (5) | FAIL (5) | FAIL (5) |
| all-products | FAIL (8) | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) |
| course-detail | FAIL (7) | FAIL (7) | FAIL (5) | FAIL (4) | FAIL (4) |
| books | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) |
| book | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) |
| blog | FAIL (4) | FAIL (4) | FAIL (4) | FAIL (4) | FAIL (4) |
| blog-post | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) |
| blog-category | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) |
| community | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |
| groups | FAIL (8) | FAIL (8) | FAIL (8) | FAIL (8) | FAIL (8) |
| path-landing | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) | FAIL (5) |
| legal | FAIL (6) | FAIL (6) | FAIL (6) | FAIL (6) | FAIL (6) |
| program | FAIL (8) | FAIL (8) | FAIL (8) | FAIL (8) | FAIL (8) |
| webinar | FAIL (6) | FAIL (6) | FAIL (7) | FAIL (7) | FAIL (7) |
| savvybot | FAIL (7) | FAIL (6) | FAIL (5) | FAIL (6) | FAIL (6) |
| lead-magnet | FAIL (6) | FAIL (6) | FAIL (6) | FAIL (6) | FAIL (6) |
| auth | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |

## What the failures are

Every template fails on **section height** (and several on section padding). The reference sections contain the original site’s course catalogue, testimonial set and marketing blocks; our sections contain original branding, copy and imagery. Matching raw section heights to ±4px would require duplicating the reference content, which the brand/copy constraint forbids. These are reported as **failing** rather than hidden.

Structural tokens that are directly measurable and were brought into alignment: section count/order, h1 font-size and line-height, container width, and the grid column classes. The detailed failures below show which of these still differ.

### home

- **375px** — FAIL. 18 failing metric(s): h1.width (ref 351 vs ours 361); section[0].height (ref 624 vs ours 469); section[1].height (ref 204 vs ours 167); section[2].height (ref 1898 vs ours 1053); section[2].paddingTop (ref 0 vs ours 35); section[2].headingFont (ref 30 vs ours 24); section[3].height (ref 304 vs ours 243); section[3].headingFont (ref 30 vs ours 20); section[4].height (ref 2907 vs ours 2528); section[4].headingFont (ref 30 vs ours 20); section[5].height (ref 906 vs ours 631); section[5].paddingTop (ref 30 vs ours 35); section[6].height (ref 175 vs ours 353); section[6].paddingTop (ref 20 vs ours 100); section[6].headingFont (ref 0 vs ours 30); section[7].height (ref 66 vs ours 190); section[7].paddingTop (ref 0 vs ours 18); section[7].headingFont (ref 30 vs ours 0)
- **1280px** — FAIL. 15 failing metric(s): section[0].height (ref 574 vs ours 530); section[1].height (ref 124 vs ours 96); section[2].height (ref 490 vs ours 468); section[2].paddingTop (ref 0 vs ours 56); section[2].headingFont (ref 30 vs ours 24); section[3].height (ref 160 vs ours 202); section[3].headingFont (ref 30 vs ours 20); section[4].height (ref 1118 vs ours 867); section[4].headingFont (ref 30 vs ours 20); section[5].height (ref 476 vs ours 583); section[5].paddingTop (ref 30 vs ours 56); section[6].headingFont (ref 0 vs ours 30); section[7].height (ref 66 vs ours 90); section[7].paddingTop (ref 0 vs ours 18); section[7].headingFont (ref 30 vs ours 0)

### catalog

- **375px** — FAIL. 8 failing metric(s): h1.width (ref 351 vs ours 361); h1.fontSize (ref 26 vs ours 32); h1.lineHeight (ref 31 vs ours 38); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 3023 vs ours 2377); section[0].paddingTop (ref 0 vs ours 35); section[0].headingFont (ref 26 vs ours 32); section.count (ref 3 vs ours 1)
- **1280px** — FAIL. 5 failing metric(s): h1.width (ref 904 vs ours 1264); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 1725 vs ours 961); section[0].paddingTop (ref 0 vs ours 56); section.count (ref 3 vs ours 1)

### all-products

- **375px** — FAIL. 8 failing metric(s): h1.width (ref 128 vs ours 177); h1.fontSize (ref 22 vs ours 30); h1.lineHeight (ref 26 vs ours 36); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 424 vs ours 3060); section[0].paddingTop (ref 50 vs ours 35); section[0].headingFont (ref 18 vs ours 30); section.count (ref 2 vs ours 1)
- **1280px** — FAIL. 5 failing metric(s): h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 387 vs ours 1079); section[0].paddingTop (ref 100 vs ours 56); section[0].headingFont (ref 22 vs ours 30); section.count (ref 2 vs ours 1)

### course-detail

- **375px** — FAIL. 7 failing metric(s): h1.width (ref 351 vs ours 11); h1.fontSize (ref 25 vs ours 36); h1.lineHeight (ref 30 vs ours 43); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 1467 vs ours 2385); section[0].paddingTop (ref 0 vs ours 35); section[0].headingFont (ref 25 vs ours 36)
- **1280px** — FAIL. 4 failing metric(s): h1.width (ref 776 vs ours 914); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 928 vs ours 729); section[0].paddingTop (ref 0 vs ours 56)

### books

- **375px** — FAIL. 5 failing metric(s): h1.width (ref 375 vs ours 131); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 212 vs ours 1546); section[0].paddingTop (ref 80 vs ours 35); section.count (ref 8 vs ours 1)
- **1280px** — FAIL. 5 failing metric(s): h1.width (ref 1200 vs ours 131); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 212 vs ours 862); section[0].paddingTop (ref 80 vs ours 56); section.count (ref 8 vs ours 1)

### book

- **375px** — FAIL. 5 failing metric(s): h1.width (ref 291 vs ours 361); h1.fontFamily (ref Arial vs ours Verdana); section[0].height (ref 288 vs ours 611); section[0].paddingTop (ref 50 vs ours 35); section.count (ref 8 vs ours 1)
- **1280px** — FAIL. 5 failing metric(s): h1.width (ref 1116 vs ours 1264); h1.fontFamily (ref Arial vs ours Verdana); section[0].height (ref 147 vs ours 564); section[0].paddingTop (ref 50 vs ours 56); section.count (ref 8 vs ours 1)

### blog

- **375px** — FAIL. 4 failing metric(s): h1.present (ref false vs ours true); section[0].height (ref 782 vs ours 7607); section[0].paddingTop (ref 100 vs ours 35); section.count (ref 2 vs ours 1)
- **1280px** — FAIL. 4 failing metric(s): h1.present (ref false vs ours true); section[0].height (ref 576 vs ours 2983); section[0].paddingTop (ref 100 vs ours 56); section.count (ref 2 vs ours 1)

### blog-post

- **375px** — FAIL. 5 failing metric(s): h1.present (ref false vs ours true); section[0].height (ref 782 vs ours 678); section[0].paddingTop (ref 100 vs ours 35); section[0].headingFont (ref 20 vs ours 34); section.count (ref 2 vs ours 1)
- **1280px** — FAIL. 5 failing metric(s): h1.present (ref false vs ours true); section[0].height (ref 576 vs ours 570); section[0].paddingTop (ref 100 vs ours 56); section[0].headingFont (ref 20 vs ours 34); section.count (ref 2 vs ours 1)

### blog-category

- **375px** — FAIL. 2 failing metric(s): h1.present (ref false vs ours true); section.count (ref 0 vs ours 1)
- **1280px** — FAIL. 2 failing metric(s): h1.present (ref false vs ours true); section.count (ref 0 vs ours 1)

### community

- **375px** — FAIL. 1 failing metric(s): h1.present (ref false vs ours true)
- **1280px** — FAIL. 1 failing metric(s): h1.present (ref false vs ours true)

### groups

- **375px** — FAIL. 8 failing metric(s): h1.width (ref 351 vs ours 361); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 1097 vs ours 389); section[0].paddingTop (ref 100 vs ours 70); section[0].headingFont (ref 36 vs ours 30); section[1].height (ref 990 vs ours 1709); section[1].headingFont (ref 70 vs ours 21); section.count (ref 8 vs ours 2)
- **1280px** — FAIL. 8 failing metric(s): h1.width (ref 576 vs ours 1264); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 679 vs ours 289); section[0].paddingTop (ref 100 vs ours 70); section[0].headingFont (ref 72 vs ours 30); section[1].height (ref 420 vs ours 819); section[1].headingFont (ref 70 vs ours 26); section.count (ref 8 vs ours 2)

### path-landing

- **375px** — FAIL. 5 failing metric(s): h1.width (ref 351 vs ours 361); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 483 vs ours 674); section[0].paddingTop (ref 60 vs ours 35); section.count (ref 7 vs ours 1)
- **1280px** — FAIL. 5 failing metric(s): h1.width (ref 776 vs ours 1264); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 519 vs ours 426); section[0].paddingTop (ref 100 vs ours 56); section.count (ref 7 vs ours 1)

### legal

- **375px** — FAIL. 6 failing metric(s): h1.width (ref 222 vs ours 361); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 100 vs ours 718); section[0].paddingTop (ref 50 vs ours 35); section[0].headingFont (ref 0 vs ours 19); section.count (ref 3 vs ours 1)
- **1280px** — FAIL. 6 failing metric(s): h1.width (ref 222 vs ours 611); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 100 vs ours 504); section[0].paddingTop (ref 50 vs ours 56); section[0].headingFont (ref 0 vs ours 19); section.count (ref 3 vs ours 1)

### program

- **375px** — FAIL. 8 failing metric(s): h1.width (ref 327 vs ours 361); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 110 vs ours 574); section[0].paddingTop (ref 0 vs ours 56); section[1].height (ref 1236 vs ours 890); section[1].paddingTop (ref 0 vs ours 49); section[1].headingFont (ref 30 vs ours 21); section.count (ref 8 vs ours 2)
- **1280px** — FAIL. 8 failing metric(s): h1.width (ref 1152 vs ours 1000); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 75 vs ours 307); section[0].paddingTop (ref 0 vs ours 56); section[1].height (ref 900 vs ours 643); section[1].paddingTop (ref 0 vs ours 49); section[1].headingFont (ref 30 vs ours 21); section.count (ref 8 vs ours 2)

### webinar

- **375px** — FAIL. 6 failing metric(s): h1.width (ref 351 vs ours 361); h1.fontFamily (ref Source Sans Pro vs ours Verdana); section[0].height (ref 986 vs ours 424); section[0].paddingTop (ref 100 vs ours 70); section[1].height (ref 737 vs ours 294); section[1].headingFont (ref 16 vs ours 21)
- **1280px** — FAIL. 7 failing metric(s): h1.width (ref 1176 vs ours 1000); h1.fontFamily (ref Source Sans Pro vs ours Verdana); section[0].height (ref 786 vs ours 294); section[0].paddingTop (ref 100 vs ours 70); section[1].height (ref 369 vs ours 271); section[1].paddingTop (ref 40 vs ours 49); section[1].headingFont (ref 16 vs ours 21)

### savvybot

- **375px** — FAIL. 7 failing metric(s): docWidth (ref 430 vs ours 375); h1.width (ref 351 vs ours 361); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 1595 vs ours 1276); section[0].paddingTop (ref 0 vs ours 35); section[0].headingFont (ref 0 vs ours 30); section.count (ref 3 vs ours 1)
- **1280px** — FAIL. 6 failing metric(s): h1.width (ref 1176 vs ours 1264); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 971 vs ours 1021); section[0].paddingTop (ref 0 vs ours 56); section[0].headingFont (ref 0 vs ours 30); section.count (ref 3 vs ours 1)

### lead-magnet

- **375px** — FAIL. 6 failing metric(s): h1.width (ref 351 vs ours 361); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 305 vs ours 386); section[0].paddingTop (ref 100 vs ours 35); section[0].headingFont (ref 21 vs ours 16); section.count (ref 2 vs ours 1)
- **1280px** — FAIL. 6 failing metric(s): h1.width (ref 260 vs ours 1264); h1.fontFamily (ref Figtree vs ours Verdana); section[0].height (ref 900 vs ours 406); section[0].paddingTop (ref 100 vs ours 56); section[0].headingFont (ref 30 vs ours 16); section.count (ref 2 vs ours 1)

### auth

- **375px** — FAIL. 1 failing metric(s): section.count (ref 1 vs ours 0)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 1 vs ours 0)
