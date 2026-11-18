# UI-SPEC/path-landing.md — Path-landing template (`/getting-started-page`, `/learn-digital-skills`, `/grow-my-business`, `/build-your-expert-business`, `/business-solutions`, `/choose-your-path`)

Source: `_reference/SPECIFICATION.md` §2.3, §3 (path picker); captured HTML for the 5 paths. All measurements [inferred]. See TOKENS.md.

## Routes
`/getting-started-page/`, `/learn-digital-skills/`, `/grow-my-business/`, `/build-your-expert-business/`, `/business-solutions/`, `/choose-your-path/`

## Sections
- Header / nav (same as home): logo + nav links + auth (STUDENT LOGIN / Sign up / Login)
- Page heading: path name (e.g. "Starting a Business")
- Intro copy: path-specific sub-copy theme (from SPECIFICATION §3 table)
- Path cards / next steps: suggested courses, programs, books relevant to the path
- CTA buttons: "Get Started" / "Start Free" / "Grow My Business" / "Build My Brand" / "Business Solutions" — blue `#00a3ff`, radius 5px
- [inferred] "Already have an account? Log in" → `/signin/` card (as on home path-picker footer)

## Breakpoint behavior (inferred)
| Element | 375px | 768px | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| Path cards | 1 col | 2 col | 3 col | 3 col | 3 col |
| Next-steps grid | 1 col | 2 col | 3–4 col | 4 col | 4 col |

## States
- Loading: nProgress bar + skeleton cards
- Empty: "No programs available for this path yet" with CTA to catalog
- Error: page error banner + retry

## Accessibility
- Semantic sections, heading hierarchy, focus-visible buttons, alt text on images

## Gaps
- Exact copy per path beyond SPECIFICATION §3 themes — [inferred]; measured spacing/gaps not live-verified.
