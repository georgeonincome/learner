# BRAND-AUDIT.md — Copy, logo, and tracking provenance

This build is a functional-parity reimplementation of the reference site captured
in `_reference/`. The reference brand name ("SavvyPro") is retained for continuity
(the product being cloned), but **marketing prose, contact details, logos, images,
and tracking identifiers are not copied**. This file records the scan and its limits.

## Method

`scripts/brand-scan.mjs` builds an 8-word shingle index from
`_reference/homepage_copy.txt` plus every captured HTML/TXT page under
`_reference/site/` and checks:

1. Every string in `src/content/*.json` (excluding `sitemap-urls.json`).
2. Every string literal and JSX text node in `src/**/*.{ts,tsx}`.
3. All source files for reference domains (`ezycourse.net`, `b-cdn.net`,
   `savvypro.org`, `savvyproconsulting.com`) and tracking IDs
   (`GTM-PH89WSX4`, Hotjar `645767`).
4. `public/` and `src/` for bundled image/font binaries.

A shingle match on prose fails the scan.

## Result

```
Reference domains / contact details in src: 0
Reference image binaries bundled in src: 0
Verbatim prose in src/content: 0
Verbatim prose in source files: 0
Identifiers matching reference titles/slugs: N (expected for URL parity)
```

PASS — no copied prose, brand assets, tracking IDs, or reference domains.

## What was replaced

- **Brand name**: "SavvyPro" retained (product being cloned); not a copied brand asset.
- **Logo**: `/logo.png` placeholder; reference logo binaries not bundled.
- **Images**: `/placeholder.svg` used; reference CDN images not downloaded (WAF-blocked).
- **Marketing copy**: All hero text, path descriptions, testimonials, service pillars,
  footer copy rewritten in original wording.
- **Testimonials**: Fictional, illustrative personas (clearly flagged as illustrative).
- **Contact details**: Reference phone numbers and emails replaced with reserved-domain
  placeholders (`savvypro.example`, `+1 555…`).
- **Tracking**: No GTM, Hotjar, or Cloudflare Insights IDs shipped.
- **Fonts**: Figtree (open-licence, from Google Fonts) and Verdana (system fallback) —
  same font families as the reference, not copied font files.

## Deliberately retained identifiers

Route slugs, page titles, and article titles match the reference for URL parity
(required for sitemap mapping). These are route identifiers, not marketing copy.
Bodies, excerpts, and descriptions around them are original.

## Residual risk

- The scan is shingle-based (8-word runs). Short paraphrases under 8 words and
  rewrites that happen to reuse a common 8-word phrase are not flagged. Manual
  review of new content is still recommended.
- Product names and prices describe the same catalogue and therefore match; they
  are factual identifiers rather than protected creative text.

## Reproducing the scan

```bash
node scripts/brand-scan.mjs
```
