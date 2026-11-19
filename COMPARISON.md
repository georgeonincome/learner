# COMPARISON.md — Reference vs rebuild layout fidelity

Measured with Playwright/Chromium at 375, 768, 1024, 1280, 1536px. Tolerance ±4px. Reference HTML+CSS loaded from `_reference/site/www.savvypro.org` (CSS served from the captured local copy). Our pages served from a production `next start` build.

Method: `node scripts/layout-compare.mjs` → `layout-results.json` → `node scripts/compare-report.mjs`.

## Summary (pass/fail per template and breakpoint)

| Template | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|---|
| home | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |
| catalog | FAIL (3) | FAIL (3) | FAIL (3) | FAIL (3) | FAIL (3) |
| all-products | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) |
| course-detail | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) |
| books | FAIL (2) | PASS (0) | FAIL (2) | PASS (0) | PASS (0) |
| book | PASS (0) | PASS (0) | PASS (0) | PASS (0) | PASS (0) |
| blog | FAIL (3) | FAIL (3) | FAIL (3) | FAIL (3) | FAIL (3) |
| blog-post | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) |
| blog-category | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |
| community | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |
| groups | FAIL (8) | FAIL (8) | FAIL (10) | FAIL (10) | FAIL (10) |
| path-landing | FAIL (3) | FAIL (2) | FAIL (2) | FAIL (2) | FAIL (2) |
| legal | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |
| program | FAIL (3) | FAIL (3) | FAIL (3) | FAIL (3) | FAIL (3) |
| webinar | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |
| savvybot | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |
| lead-magnet | FAIL (2) | FAIL (2) | FAIL (1) | FAIL (1) | FAIL (1) |
| auth | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) | FAIL (1) |

## What the failures are

Every template fails on **section height** (and several on section padding). The reference sections contain the original site’s course catalogue, testimonial set and marketing blocks; our sections contain original branding, copy and imagery. Matching raw section heights to ±4px would require duplicating the reference content, which the brand/copy constraint forbids. These are reported as **failing** rather than hidden.

Structural tokens that are directly measurable and were brought into alignment: section count/order, h1 font-size and line-height, container width, and the grid column classes. The detailed failures below show which of these still differ.

### home

- **375px** — FAIL. 1 failing metric(s): section[0].height (ref 624 vs ours 569)
- **1280px** — FAIL. 1 failing metric(s): section[0].height (ref 574 vs ours 567)

### catalog

- **375px** — FAIL. 3 failing metric(s): section[0].height (ref 3023 vs ours 6041); section[1].height (ref 186 vs ours 1127); section.count (ref 3 vs ours 4)
- **1280px** — FAIL. 3 failing metric(s): section[0].height (ref 1725 vs ours 2230); section[1].height (ref 186 vs ours 418); section.count (ref 3 vs ours 4)

### all-products

- **375px** — FAIL. 2 failing metric(s): section[1].height (ref 2790 vs ours 5728); section.count (ref 2 vs ours 3)
- **1280px** — FAIL. 2 failing metric(s): section[1].height (ref 1035 vs ours 2050); section.count (ref 2 vs ours 3)

### course-detail

- **375px** — FAIL. 2 failing metric(s): h1.present (ref false vs ours true); section.count (ref 0 vs ours 2)
- **1280px** — FAIL. 2 failing metric(s): h1.present (ref false vs ours true); section.count (ref 0 vs ours 2)

### books

- **375px** — FAIL. 2 failing metric(s): section[1].height (ref 1380 vs ours 1360); section[3].height (ref 1324 vs ours 1304)
- **1280px** — PASS. 0 failing metric(s): 

### book

- **375px** — PASS. 0 failing metric(s): 
- **1280px** — PASS. 0 failing metric(s): 

### blog

- **375px** — FAIL. 3 failing metric(s): section[1].height (ref 304 vs ours 5114); section[1].headingFont (ref 0 vs ours 24); section.count (ref 2 vs ours 3)
- **1280px** — FAIL. 3 failing metric(s): section[1].height (ref 344 vs ours 2137); section[1].headingFont (ref 0 vs ours 24); section.count (ref 2 vs ours 3)

### blog-post

- **375px** — FAIL. 2 failing metric(s): h1.present (ref false vs ours true); section.count (ref 0 vs ours 2)
- **1280px** — FAIL. 2 failing metric(s): h1.present (ref false vs ours true); section.count (ref 0 vs ours 2)

### blog-category

- **375px** — FAIL. 1 failing metric(s): section.count (ref 0 vs ours 2)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 0 vs ours 2)

### community

- **375px** — FAIL. 1 failing metric(s): section.count (ref 0 vs ours 2)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 0 vs ours 2)

### groups

- **375px** — FAIL. 8 failing metric(s): h1.fontSize (ref 30 vs ours 36); h1.lineHeight (ref 36 vs ours 43); section[0].height (ref 1097 vs ours 2170); section[0].paddingTop (ref 100 vs ours 80); section[1].height (ref 990 vs ours 184); section[1].paddingTop (ref 50 vs ours 20); section[1].headingFont (ref 70 vs ours 0); section.count (ref 8 vs ours 2)
- **1280px** — FAIL. 10 failing metric(s): h1.width (ref 576 vs ours 1176); h1.fontSize (ref 30 vs ours 48); h1.lineHeight (ref 36 vs ours 58); section[0].height (ref 679 vs ours 1037); section[0].paddingTop (ref 100 vs ours 80); section[0].headingFont (ref 72 vs ours 48); section[1].height (ref 420 vs ours 88); section[1].paddingTop (ref 50 vs ours 20); section[1].headingFont (ref 70 vs ours 0); section.count (ref 8 vs ours 2)

### path-landing

- **375px** — FAIL. 3 failing metric(s): section[1].height (ref 1380 vs ours 1360); section[2].height (ref 1178 vs ours 1185); section.count (ref 7 vs ours 8)
- **1280px** — FAIL. 2 failing metric(s): section[2].height (ref 638 vs ours 665); section.count (ref 7 vs ours 8)

### legal

- **375px** — FAIL. 1 failing metric(s): section.count (ref 3 vs ours 4)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 3 vs ours 4)

### program

- **375px** — FAIL. 3 failing metric(s): section[7].height (ref 737 vs ours 987); section[7].paddingTop (ref 50 vs ours 0); section[7].headingFont (ref 16 vs ours 0)
- **1280px** — FAIL. 3 failing metric(s): section[7].height (ref 369 vs ours 924); section[7].paddingTop (ref 40 vs ours 0); section[7].headingFont (ref 16 vs ours 0)

### webinar

- **375px** — FAIL. 1 failing metric(s): section.count (ref 2 vs ours 3)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 2 vs ours 3)

### savvybot

- **375px** — FAIL. 1 failing metric(s): section.count (ref 3 vs ours 4)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 3 vs ours 4)

### lead-magnet

- **375px** — FAIL. 2 failing metric(s): section[0].height (ref 305 vs ours 645); section.count (ref 2 vs ours 3)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 2 vs ours 3)

### auth

- **375px** — FAIL. 1 failing metric(s): section.count (ref 1 vs ours 2)
- **1280px** — FAIL. 1 failing metric(s): section.count (ref 1 vs ours 2)

## Session-2 diagnosis (2026-11-19, authoritative interpretation)

The pass/fail table above is the raw harness verdict. Classifying all 90 cells
(18 templates × 5 breakpoints) from layout-results.json:

| Class | Cells | Meaning |
|---|---|---|
| PASS | 8 | book (all 5), books (768/1280/1536) |
| minor-height | 4 | home 768–1536: ONE section height delta ≤7px (hero 574 vs 567 at 1280); h1 and all other sections match EXACTLY (50px Verdana, 776×120) |
| count-only | 23 | legal/webinar/savvybot/auth (all 5) + lead-magnet (1024–1536): identical section heights, but our side reports ONE extra 88px top-level div (header instrumentation asymmetry — harness counts data-layout-section wrappers on our side vs generic section selector on reference) |
| ref-empty | 20 | course-detail/blog-post/blog-category/community (all 5): reference side measured 0 sections — harness container selector does not match the hydrated capture structure (e.g. blog-post capture has no #__next-content). HARNESS ARTIFACT, not a lena layout result |
| real-diff | 35 | catalog/all-products/blog/groups/program (all 5), home 375, books 375/1024, lead-magnet 375/768, path-landing (all 5) |

Root causes of the real-diff cells (evidence at 1280px):
- catalog: h1 identical (32px Figtree 904×38); section[0] 1725 vs 2230px, section[1]
  186 vs 418px, count 3 vs 4 → our /courses spec was extracted from a raw SSR capture
  (pre-hydration product grid) while the reference measure uses the hydrated DOM.
  Spec-source state mismatch, not CSS drift.
- blog: section[1] 344 vs 2137px → same skeleton-vs-hydrated AllBlogs grid mismatch.
- groups: h1 30px/36 vs 48px/58, heading 72 vs 48, padding 100 vs 80 → spec extracted
  from a different capture state; genuine typography/spacing divergence to fix.
- path-landing: h1 identical; one section +27px and one extra wrapper → near-match.

Required harness fixes before Phase 5 verdicts (tracked in COMPLETION-PLAN M9):
1. Symmetric node selection: measure the SAME top-level block set on both sides
   (container children, not tag-name guessing); drop the extra header wrapper from
   our instrumented set or add it to the reference set.
2. Reference container detection for hydrated captures (no #__next-content assumption).
3. Re-extract page specs from HYDRATED captures (captured-browser) for catalog/blog/
   groups/program so content state matches; keep raw SSR only for SEO/JSON-LD.
4. Re-measure after the Tailwind template rebuild (Decision D2) — today's numbers are
   the baseline, not the target.

Brand colors/copy/images are expected to differ and are NOT scored. Height deltas caused
purely by original copy length are registered localisations; the deltas above are
capture-state/harness issues, which is why they are fixable without copying content.
