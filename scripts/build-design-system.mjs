/**
 * build-design-system.mjs — assemble the project stylesheet from the reference:
 *
 *   src/styles/vendor.css    <- the reference's compiled app CSS (Bootstrap grid,
 *                               utilities, EzyCourse theme classes, Font Awesome)
 *   src/styles/reference.css <- the union of every styled-components rule that the
 *                               captured pages emit (hashed class names preserved so
 *                               the reproduced markup renders identically)
 *
 * The reference is read-only; output lands in src/styles/.
 * Usage: node scripts/build-design-system.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  STYLES_DIR,
  REF_SITE,
  allSources,
  styledCssUnion,
} from './lib/extract.mjs'

fs.mkdirSync(STYLES_DIR, { recursive: true })

const sources = allSources()
console.log(`sources: ${sources.length}`)

const styled = styledCssUnion(sources)
fs.writeFileSync(path.join(STYLES_DIR, 'reference.css'), styled + '\n')
console.log(`reference.css: ${styled.length} bytes`)

const vendorSrc = path.join(REF_SITE, '_next', 'static', 'css', 'bba21c04c9008d1b.css')
const vendor = fs.readFileSync(vendorSrc, 'utf8')
fs.writeFileSync(path.join(STYLES_DIR, 'vendor.css'), vendor)
console.log(`vendor.css: ${vendor.length} bytes`)

// The media-player stylesheet is only needed by the lesson player; keep a copy
// so the player chrome matches the reference.
const playerSrc = path.join(
  path.dirname(REF_SITE),
  'cdn.ezycourse.net',
  '_next',
  'static',
  'css',
  'cd84a991e9b07933.css',
)
if (fs.existsSync(playerSrc)) {
  fs.writeFileSync(path.join(STYLES_DIR, 'media-player.css'), fs.readFileSync(playerSrc))
  console.log('media-player.css: copied')
}

// Class names that the reference's own markup relies on, so we can assert the
// stylesheet actually covers them.
const used = new Set()
for (const file of sources) {
  const html = fs.readFileSync(file, 'utf8')
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) {
      if (c && !c.startsWith('sc-') && !c.startsWith('_') && c.includes('-') === false) used.add(c)
    }
  }
}
const missing = [...used].filter((c) => !vendor.includes('.' + c) && !styled.includes('.' + c))
console.log(`utility classes referenced: ${used.size}, not found in stylesheets: ${missing.length}`)
if (missing.length) console.log('  ' + missing.slice(0, 40).join(' '))
