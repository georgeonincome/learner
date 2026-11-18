# UI-SPEC/TOKENS.md — Type, spacing, radius, breakpoint scales

Source: `_reference/SPECIFICATION.md` §4 "Design system (reconstructed from homepage tokens)" plus
`_reference/homepage_copy.txt` and the captured `index.html`.

## Measurement method (gap)
Playwright is not available in this environment, so computed font sizes/weights/line heights, margins, paddings,
gaps, widths, radii and shadows could NOT be measured live by loading the captured HTML+CSS. Every token below is
[inferred] from SPECIFICATION.md §4 (the authoritative reconstruction) and the homepage HTML/CSS class structure.
These are the authoritative values for the rebuild Tailwind theme (see M1).

---

## Color palette

| Token | Value | Use (reference) |
|---|---|---|
| `primary` | `#6662FF` (rgb 102 98 255, `--ezyPrimaryRGB`) | brand primary |
| `blue` | `#00a3ff` (hover `#3b3b3b`) | primary action buttons |
| `magenta` | `#ff007a` (hover `#3b3b3b`) | big rounded CTA ("Find My Path") |
| `dark-navy` | `#101b2f` | dark section backgrounds |
| `dark-slate` | `#16243e` | cards / dark panels |
| `near-black` | `#110011` | bordered dark cards |
| `light-gray-bg` | `#d9d9d9` | placeholder / section backgrounds |
| `off-white-text` | `rgb(248,247,247)` / `rgb(247,243,243)` | body copy on dark sections |
| `gray-text` | `#94a3b8` / `#5B6475` | secondary text |
| `border` | `#64748b` | card borders |
| `badge` | `#e6f1fb` | small labels |
| `hero-bg` | `#090e21` | hero section background |
| `nprogress` | `#29D` | top loading bar (fixed top, z-index 9999) |

Tailwind theme mapping (M1): extend `colors` with `savvy-primary`, `savvy-blue`, `savvy-magenta`, `savvy-dark-navy`,
`savvy-dark-slate`, `savvy-near-black`, `savvy-light-gray`, `savvy-off-white`, `savvy-gray-text`, `savvy-border`,
`savvy-badge`, `savvy-hero-bg`, `savvy-nprogress`.

---

## Typography

| Token | Value | Use |
|---|---|---|
| `font-primary` | Figtree (Google Fonts), weights 300–900, italic + normal, extended Latin + Vietnamese | body, UI |
| `font-headings` | Verdana | hero + headings |
| `font-fallback` | Lucida Sans Unicode, Arial, `anthropic-sans`, `Twemoji Country Flags` | fallback |
| `text-hero` | 50px Verdana | hero headline |
| `text-hero-sub` | 25px Verdana | hero sub-headline |
| `text-body` | ~14–19px Figtree | body copy |
| `line-height-copy` | 48px (with 25px Verdana copy block) | hero copy block |
| `text-off-white-dark` | `rgb(248,247,247)` | body copy on dark |

Figtree is self-hosted or loaded from Google Fonts (`fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap`);
18 font variants (weights 300–900 × italic/normal, extended Latin + Vietnamese) from `fonts.gstatic.com/s/figtree/v9/`.

Tailwind theme mapping (M1): `fontFamily.sans = ['Figtree', ...fallbacks]`, `fontFamily.serif = ['Verdana', ...]` for headings,
`fontWeight` 300–900, `fontSize` values per section specs below.

---

## Spacing scale

| Token | Value | Use |
|---|---|---|
| `space-button` | 10px 20px | blue button padding |
| `space-cta` | 42px height, 40px side padding | big magenta CTA |
| `space-hero-tb` | 100px top + 100px bottom | hero wrapper padding |
| `space-card-min-h` | 430px | card min-height |
| `space-forgot-margin` | 8px 0 0 | forgot-password link margin |

Tailwind theme mapping (M1): extend `spacing` with `button-px`, `cta-side`, `hero-py`, etc. or use arbitrary values.

---

## Border radius

| Token | Value | Use |
|---|---|---|
| `radius-button` | 5px | blue buttons, cards |
| `radius-card` | 10px | cards |
| `radius-cta` | 50px (pill) | big magenta CTA |
| `radius-dark-card` | 10px | dark cards |

---

## Breakpoints

Responsive checkpoints from the Phase 4 screenshot list, mapped to Tailwind defaults:

| Name | Width | Tailwind |
|---|---|---|
| `xs` | 375px | (custom, below sm) |
| `sm` | 640px | `sm` |
| `md` | 768px | `md` |
| `lg` | 1024px | `lg` |
| `xl` | 1280px | `xl` |
| `2xl` | 1536px | `2xl` |

Playwright screenshots at 375, 768, 1024, 1280, 1536px are the verification checkpoints (Phase 4).

---

## Component anatomy (from SPECIFICATION §4, hashed styled-components classes)

| Component | Classes (reference) | Anatomy |
|---|---|---|
| Button (blue) | `gCOmeJ`, `cxQQUf`, `bZKYXQ`, `jNJZse` | `#00a3ff`, 10px 20px padding, inline-flex, radius 5px, hover `#3b3b3b` |
| Big CTA | `clbXah` | `#ff007a`, 42px, rounded 50px, 40px side padding |
| Card (light) | `ChDcr`, `blRumF` | `#ffffff`, radius 10px, min-height 430px |
| Card (dark) | `bZcclz`, `cPSjgn` | `#101b2f` |
| Hero wrapper | `kjhSPO` | padding 100px top/bottom, hero bg image + `#090e21` |
| Copy block | `bkpsqR` | 25px Verdana, `#d1d5db`, line-height 48px |
| Loading bar | nProgress | `#29D`, fixed top, z-index 9999 |

CSS vars observed: `--ezy-header-height: 0px`, `--ezyPrimaryRGB: 102 98 255`.

---

## Anti-copy (observed in inline JS, NOT replicated)
`killCopy`/`reEnable`: `document.onselectstart = return false` — text selection disabled. [inferred decision] omitted
from rebuild (accessibility); decision deferred to product owner. See GAPS.md.

---

## Shadows
No shadow tokens were observable in the reference. [inferred] Cards use subtle shadow (`0 1px 3px rgba(0,0,0,0.1)`)
in light mode; dark cards use border only.

## Gaps
- Computed per-breakpoint measurements (font sizes, margins, paddings, gaps, widths, radii, shadows at 375/768/1024/1280/1536) — [inferred] only; not live-measured. See GAPS.md.
- Animations beyond nProgress bar — [inferred] minimal (fade-in, slide-up).
