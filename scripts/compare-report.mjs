// Generates COMPARISON.md from layout-results.json (produced by layout-compare.mjs).
import fs from 'node:fs'

const data = JSON.parse(fs.readFileSync('layout-results.json', 'utf8'))
const { results, widths, tolerance } = data

const passMark = (b) => (b.error ? 'ERROR' : b.failed.length === 0 ? 'PASS' : 'FAIL')

const lines = []
lines.push('# COMPARISON.md — Reference vs rebuild layout fidelity')
lines.push('')
lines.push(
  `Measured with Playwright/Chromium at ${widths.join(', ')}px. Tolerance ±${tolerance}px. ` +
    'Reference HTML+CSS loaded from `_reference/site/www.savvypro.org` (CSS served from the captured local copy). ' +
    'Our pages served from a production `next start` build.',
)
lines.push('')
lines.push('Method: `node scripts/layout-compare.mjs` → `layout-results.json` → `node scripts/compare-report.mjs`.')
lines.push('')
lines.push('## Summary (pass/fail per template and breakpoint)')
lines.push('')
lines.push('| Template | ' + widths.map((w) => `${w}px`).join(' | ') + ' |')
lines.push('|---|---|' + widths.map(() => '---|').join(''))
for (const t of results) {
  const cells = widths.map((w) => {
    const b = t.breakpoints.find((x) => x.width === w)
    return `${passMark(b)} (${b.failed.length})`
  })
  lines.push(`| ${t.template} | ${cells.join(' | ')} |`)
}
lines.push('')
lines.push('## What the failures are')
lines.push('')
lines.push(
  'Every template fails on **section height** (and several on section padding). ' +
    'The reference sections contain the original site’s course catalogue, testimonial set and marketing blocks; ' +
    'our sections contain original branding, copy and imagery. Matching raw section heights to ±4px would require ' +
    'duplicating the reference content, which the brand/copy constraint forbids. These are reported as **failing** ' +
    'rather than hidden.',
)
lines.push('')
lines.push(
  'Structural tokens that are directly measurable and were brought into alignment: ' +
    'section count/order, h1 font-size and line-height, container width, and the grid column classes. ' +
    'The detailed failures below show which of these still differ.',
)
lines.push('')
for (const t of results) {
  lines.push(`### ${t.template}`)
  lines.push('')
  for (const w of [375, 1280]) {
    const b = t.breakpoints.find((x) => x.width === w)
    if (!b) continue
    lines.push(
      `- **${w}px** — ${passMark(b)}. ` +
        (b.error ? `Error: ${b.error}` : `${b.failed.length} failing metric(s): ` +
          b.failed.map((f) => `${f.name} (ref ${f.ref} vs ours ${f.ours})`).join('; ')),
    )
  }
  lines.push('')
}

fs.writeFileSync('COMPARISON.md', lines.join('\n'))
console.log(`Wrote COMPARISON.md (${results.length} templates × ${widths.length} breakpoints)`)
