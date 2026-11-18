# UI-SPEC/catalog.md — Catalog template (`/all-products`, `/courses`)

Source: `_reference/SPECIFICATION.md` §2; captured `/courses.html`. All measurements [inferred]. See TOKENS.md.

## Routes
`/all-products/`, `/courses/`

## Sections
- Header / nav
- Page heading: "All Products" or "Courses"
- Filter/chip bar: category filters (Courses, Programs, Books, Mini-courses), price filter, sort
- Product/course grid: cards (`#ffffff`, radius 10px, min-height 430px), each with thumbnail, title, category badge (`#e6f1fb`), price, "Enroll"/"Buy" blue button
- [inferred] Pagination controls at bottom

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Product grid | 1 col | 2 col | 3 col | 4 col | 4 col |
| Filter bar | stacked | inline wrap | inline | inline | inline |

## States
- Loading: skeleton grid
- Empty: "No products found" + CTA
- Error: error banner + retry

## Accessibility
- Filter buttons aria-pressed; grid role=list; card links focus-visible

## Gaps
- Filter set and sort options not observable — [inferred] minimal set.
