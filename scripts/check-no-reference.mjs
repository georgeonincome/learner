/**
 * CI guard for Decision 1: fail the build if the retired reference rendering
 * layer is imported anywhere in shipped source.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const FORBIDDEN_IMPORTS = [
  /styles\/vendor\.css/,
  /styles\/reference\.css/,
  /styles\/block-safelist\.css/,
  /styles\/a11y-overrides\.css/,
  /components\/ref\/RefNode/,
  /components\/layout\/BlockPage/,
  /components\/layout\/PublicPage/,
  /components\/blocks\/BlockRenderer/,
  /lib\/page-spec/,
  /lib\/blocks\/compile/,
  /lib\/ref-attrs/,
  /lib\/button-targets/,
]
const FORBIDDEN_FILES = [
  'src/styles/vendor.css',
  'src/styles/reference.css',
  'src/components/ref/RefNode.tsx',
  'src/components/layout/BlockPage.tsx',
  'src/components/layout/PublicPage.tsx',
  'src/lib/page-spec.ts',
]

const violations = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(full)
    } else if (/\.(ts|tsx|css|mjs|mts)$/.test(entry.name)) {
      const text = fs.readFileSync(full, 'utf8')
      for (const pattern of FORBIDDEN_IMPORTS) {
        if (pattern.test(text)) {
          violations.push(`${path.relative(ROOT, full)} imports retired reference layer (${pattern})`)
        }
      }
    }
  }
}
walk(path.join(ROOT, 'src'))
for (const f of FORBIDDEN_FILES) {
  if (fs.existsSync(path.join(ROOT, f))) violations.push(`${f} still exists`)
}

if (violations.length) {
  console.error('REFERENCE-LAYER CHECK FAILED:')
  for (const v of violations) console.error('  ✗', v)
  process.exit(1)
}
console.log('REFERENCE-LAYER CHECK PASS — no reference CSS or captured-markup renderer imported')
