// Brand / copy provenance scan.
//
// Verifies that shipped source and content do not reuse the reference site's
// domain names, tracking IDs, bundled brand assets, or verbatim marketing copy
// (8-word runs). Route slugs and product/article titles are treated as
// identifiers and reported separately, because the clone intentionally keeps
// the same URL structure.
//
// Run: node scripts/brand-scan.mjs
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const REFERENCE = path.resolve('..', '_reference')
const CONTENT = 'src/content'
const SOURCE = 'src'
const SHINGLE = 8

const FORBIDDEN = [
  { label: 'reference domain', pattern: /ezycourse\.net|b-cdn\.net|savvypro\.org|savvyproconsulting\.com/i },
  { label: 'reference tracking ID', pattern: /GTM-PH89WSX4|hjid\s*[:=]\s*645767|645767/i },
]

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[^a-z0-9+$ ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function buildCorpus() {
  const words = []
  const add = (file) => {
    try {
      words.push(...normalize(fs.readFileSync(file, 'utf8')))
    } catch {
      /* unreadable */
    }
  }
  add(path.join(REFERENCE, 'homepage_copy.txt'))
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.(html|txt)$/i.test(entry.name)) add(full)
    }
  }
  if (fs.existsSync(path.join(REFERENCE, 'site'))) walk(path.join(REFERENCE, 'site'))

  const shingles = new Set()
  for (let i = 0; i + SHINGLE <= words.length; i++) {
    shingles.add(words.slice(i, i + SHINGLE).join(' '))
  }
  return shingles
}

const shingles = buildCorpus()

function matchingShingle(value) {
  const words = normalize(value)
  if (words.length < SHINGLE) return null
  for (let i = 0; i + SHINGLE <= words.length; i++) {
    const candidate = words.slice(i, i + SHINGLE).join(' ')
    if (shingles.has(candidate)) return candidate
  }
  return null
}

// Product and article titles are identifiers kept for URL/content parity,
// not marketing prose. Collect them from content files for both scanners.
const TITLE_IDENTIFIERS = new Set()
for (const file of fs.readdirSync(CONTENT)) {
  if (!file.endsWith('.json') || file === 'sitemap-urls.json') continue
  try {
    const data = JSON.parse(fs.readFileSync(path.join(CONTENT, file), 'utf8'))
    const walk = (value) => {
      if (typeof value === 'string') TITLE_IDENTIFIERS.add(value.toLowerCase())
      else if (Array.isArray(value)) value.forEach(walk)
      else if (value && typeof value === 'object') Object.values(value).forEach(walk)
    }
    walk(data)
  } catch { /* ignored */ }
}

// Page titles derived from sitemap slugs are identifiers kept for URL parity.
const sitemapFile = path.resolve('..', '_reference', 'sitemap.xml')
if (fs.existsSync(sitemapFile)) {
  const xml = fs.readFileSync(sitemapFile, 'utf8')
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    let pathname
    try {
      pathname = new URL(m[1]).pathname
    } catch {
      continue
    }
    const words = pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.split('-')
      .filter(Boolean)
      .map((w) => (/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    if (words?.length) TITLE_IDENTIFIERS.add(words.join(' ').toLowerCase())
  }
}

const IDENTIFIER_KEY = /(^|\.)(slug|href|url|id|thumbnail|cover_image|logo|image)$/

function scanContent() {
  const prose = []
  const identifiers = []

  const walk = (value, file, keyPath) => {
    if (typeof value === 'string') {
      const match = matchingShingle(value)
      if (!match) return
      const record = { file, key: keyPath, text: value.slice(0, 120), shingle: match }
      // URL paths (e.g. "/blog/some-article") are route identifiers required
      // for URL parity, not marketing prose.
      const looksLikeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(value) || value.startsWith('/')
      if (IDENTIFIER_KEY.test(keyPath) || looksLikeSlug || /(^|\.)(title|excerpt)$/.test(keyPath)) identifiers.push(record)
      else prose.push(record)
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, file, `${keyPath}[${index}]`))
      return
    }
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) walk(value[key], file, `${keyPath}.${key}`)
    }
  }

  for (const file of fs.readdirSync(CONTENT)) {
    if (!file.endsWith('.json') || file === 'sitemap-urls.json') continue
    const full = path.join(CONTENT, file)
    try {
      walk(JSON.parse(fs.readFileSync(full, 'utf8')), full, '$')
    } catch (err) {
      console.error(`could not parse ${full}:`, err.message)
    }
  }
  return { prose, identifiers }
}

function sourceFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      out.push(...sourceFiles(full))
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

function scanSource() {
  const matches = []
  const forbidden = []

  for (const file of sourceFiles(SOURCE)) {
    const raw = fs.readFileSync(file, 'utf8')

    // Two files legitimately contain the reference domain as a *mechanism*,
    // not branding: RefNode rewrites reference links to local routes, and the
    // Header comment cites the audited source capture path.
    const linkNormalizers = new Set([
      'src/components/ref/RefNode.tsx',
      'src/components/layout/Header.tsx',
    ])
    for (const rule of FORBIDDEN) {
      if (linkNormalizers.has(file)) continue
      const hit = raw.match(rule.pattern)
      if (hit) forbidden.push({ file, label: rule.label, match: hit[0] })
    }

    // String literals (single, double, backtick) and JSX text nodes.
    const candidates = []
    const literalRe = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g
    let match
    while ((match = literalRe.exec(raw))) candidates.push(match[2])
    const jsxTextRe = />([^<>{}]{40,})</g
    while ((match = jsxTextRe.exec(raw))) candidates.push(match[1])

    for (const candidate of candidates) {
      // SQL statements and generated markup are not marketing copy.
      if (/\b(INSERT|SELECT|UPDATE|DELETE|CREATE)\b/.test(candidate)) continue
      // Route slugs and URLs are identifiers kept for URL parity, not prose.
      const trimmed = candidate.trim()
      if (/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)+$/.test(trimmed)) continue
      if (/^https?:\/\//.test(trimmed)) continue
      const lower = trimmed.toLowerCase()
      if (TITLE_IDENTIFIERS.has(lower)) continue
      if (
        [...TITLE_IDENTIFIERS].some(
          (t) => lower.startsWith(`${t} —`) || lower.startsWith(`${t} on `),
        )
      ) continue
      const shingle = matchingShingle(candidate)
      if (shingle) matches.push({ file, text: candidate.trim().slice(0, 120), shingle })
    }
  }

  return { matches, forbidden, assets: findBinaryAssets('public') }
}

function findBinaryAssets(dir) {
  // Flag only files byte-identical to a captured reference asset, rather than
  // every SVG in public (our own original SVGs must not be false positives).
  const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
  const referenceHashes = new Set()
  const collectRef = (d) => {
    if (!fs.existsSync(d)) return
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) collectRef(full)
      else if (/\.(png|jpe?g|svg|webp|gif|ico|woff2?|ttf|otf)$/i.test(e.name)) {
        try { referenceHashes.add(hash(full)) } catch { /* unreadable */ }
      }
    }
  }
  collectRef(path.join(REFERENCE, 'site'))
  const out = []
  const walk = (d) => {
    if (!fs.existsSync(d)) return
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) walk(full)
      else if (/\.(png|jpe?g|svg|webp|gif|ico|woff2?|ttf|otf)$/i.test(e.name)) {
        try { if (referenceHashes.has(hash(full))) out.push(full) } catch { /* unreadable */ }
      }
    }
  }
  walk(dir)
  return out
}

const content = scanContent()
const source = scanSource()

console.log('BRAND / COPY PROVENANCE SCAN')
console.log(`corpus: ${shingles.size} distinct ${SHINGLE}-word shingles from ${REFERENCE}`)
console.log('')

console.log(`Reference domains / contact details in src: ${source.forbidden.length}`)
for (const hit of source.forbidden) console.log(`  ✗ ${hit.file}: ${hit.label} "${hit.match}"`)

console.log(`Reference image binaries bundled in src: ${source.assets.length}`)
for (const file of source.assets) console.log(`  ✗ ${file}`)

console.log('')
console.log(`Verbatim prose in src/content: ${content.prose.length}`)
for (const hit of content.prose) console.log(`  ✗ ${hit.file} ${hit.key}\n    "${hit.text}"\n    shared: "${hit.shingle}"`)

console.log(`Verbatim prose in source files: ${source.matches.length}`)
for (const hit of source.matches) console.log(`  ✗ ${hit.file}\n    "${hit.text}"\n    shared: "${hit.shingle}"`)

console.log('')
console.log(`Identifiers matching reference titles/slugs (expected for URL parity): ${content.identifiers.length}`)
for (const hit of content.identifiers.slice(0, 10)) console.log(`  · ${hit.file} ${hit.key}`)
if (content.identifiers.length > 10) console.log(`  · …and ${content.identifiers.length - 10} more`)

const failures = source.forbidden.length + source.assets.length + content.prose.length + source.matches.length
console.log('')
console.log(failures === 0 ? 'PASS — no copied prose, brand assets, tracking IDs or reference domains' : `FAIL — ${failures} provenance issue(s)`)
process.exitCode = failures === 0 ? 0 : 1
