# UI-SPEC/book.md — Book/ebook template (`/books`, `/ebooks`, and individual book pages)

Source: `_reference/SPECIFICATION.md` §2; captured book HTML. All measurements [inferred]. See TOKENS.md.

## Routes
`/books/`, `/ebooks/`, `/zero-to-hero-social-media-manager-book/`, `/social-media-content-creation-book/`, `/infopreneur-roadmap-book/`, `/start-where-you-are-book/`, `/7-steps-to-better-sales-book/`, `/words-that-sell-copywriting-secrets-that-make-customers-buy/`, `/the-11-elements-behind-a-high-value-expert-brand/`, `/social-media-strategy-book/` (10 URLs)

## Sections (index)
- Header / nav
- Page heading: "Books" / "Ebooks"
- Book grid: cards (cover image, title, author, price, blue "Buy" button)

## Sections (book detail)
- Header / nav
- Book hero: cover image, title, author, category badge (`#e6f1fb`), price
- Description / synopsis
- Chapters / contents list
- Purchase: price, blue `#00a3ff` "Buy" button; if purchased → "Read / Download" (PDF)
- [inferred] PDF download via Cloudinary signed URL after confirmed payment

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Book grid | 1 col | 2 col | 3 col | 4 col | 4 col |
| Detail hero | stacked | stacked | image + info side-by-side | side-by-side | side-by-side |

## States
- Loading: skeleton grid / detail
- Empty: "No books available"
- Error: error banner

## Accessibility
- Book cards as links; cover image alt text; price as text

## Gaps
- Book catalog contents and pricing — [inferred].

## Measured 2026-11-19

Measured h1: 37px/47 at both breakpoints.

See `COMPARISON.md` for pass/fail per template and breakpoint and `layout-results.json` for raw measurements.
