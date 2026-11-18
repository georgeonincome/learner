# UI-SPEC/library.md — Library/media template (`/video-library`, `/audio-library`, `/video-details`, `/audio-details`)

Source: `_reference/SPECIFICATION.md` §2; captured library HTML. All measurements [inferred]. See TOKENS.md.

## Routes
`/video-library/`, `/audio-library/`, `/video-details/`, `/audio-details/`

## Sections (library index)
- Header / nav
- Page heading: "Video Library" / "Audio Library"
- Media grid: cards (thumbnail, title, duration, type badge `#e6f1fb`, free/locked indicator)
- [inferred] Filter by category/type

## Sections (media details)
- Header / nav
- Media player: video/audio player (Cloudinary stream URL)
- Title, description, duration
- [inferred] Progress/resume if enrolled
- [inferred] Related media

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Media grid | 1 col | 2 col | 3 col | 4 col | 4 col |
| Player | full-width | full-width | 2 col (player + info) | 2 col | 2 col |

## States
- Loading: skeleton grid / player placeholder
- Empty: "No media available"
- Error: player error + retry

## Access / gating
- Public view; play requires auth+paid (enrollment/membership) — [inferred]

## Accessibility
- Player controls accessible; media alt/captions [inferred]

## Gaps
- Media catalog, player implementation, resume position — [inferred].
