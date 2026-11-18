# UI-SPEC/blog.md — Blog templates (`/blog`, `/blog/<slug>`, `/blog/category/<name>/<id>`)

Source: `_reference/SPECIFICATION.md` §2; captured blog HTML. All measurements [inferred]. See TOKENS.md.

## Routes
`/blog/` (list), 22 `/blog/<slug>/` posts, 6 `/blog/category/<name>/<id>/` categories (see COVERAGE.md)

## Sections (blog list)
- Header / nav
- Page heading: "Blog"
- Search input
- Category filter chips
- Post grid: cards (thumbnail, title, excerpt, date, read-time, category badge `#e6f1fb`)
- Pagination (prev/next + page numbers)

## Sections (blog post)
- Header / nav
- Post hero: featured image + `#090e21` or light bg; title (Verdana), date, author, category
- Post content (rich text)
- [inferred] Related posts
- [inferred] Comments (if enabled)

## Sections (blog category)
- Header / nav
- Category heading + description
- Post grid filtered by category
- Pagination

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Post grid | 1 col | 2 col | 3 col | 3 col | 3 col |
| Search + filters | stacked | inline wrap | inline | inline | inline |

## States
- Loading: skeleton posts
- Empty: "No posts found"
- Error: error banner + retry

## Accessibility
- Search input with label; post cards as links; pagination aria-label

## Gaps
- Comment system, author bios, related-posts algorithm — [inferred] minimal.
