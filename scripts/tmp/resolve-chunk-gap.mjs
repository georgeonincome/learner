// Resolve live-build manifest deps for public/priority routes; list chunks missing from _reference.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = '/home/george_jackson/Projects/web/clone/savvypro'
const manifestPath = path.join(ROOT, 'lena/docs/evidence/live-buildManifest-4315b58e.js')
const cdnDir = path.join(ROOT, '_reference/site/cdn.ezycourse.net')

const src = fs.readFileSync(manifestPath, 'utf8')
const self = {}
// manifest is plain JS assigning self.__BUILD_MANIFEST with shared-group vars
new Function('self', src)(self)
const bm = self.__BUILD_MANIFEST
const keys = Object.keys(bm).filter(k => !k.startsWith('__'))
console.log('route keys:', keys.length)

// public + student-learning priority routes (capability scope, not 668-route admin parity)
const want = keys.filter(k =>
  k === '/' ||
  /^\/\[page_slug\]/.test(k) ||
  /^\/blog(\/|$)/.test(k) ||
  /^\/course-detail\//.test(k) ||
  /^\/audio-details\//.test(k) ||
  /^\/community-detail\//.test(k) ||
  /^\/community\/\[community_id\]$/.test(k) ||
  /^\/certificate\//.test(k) ||
  /^\/coaching/.test(k) ||
  /^\/student\//.test(k) ||
  /^\/(checkout|login|signup|verify|reset-password|forgot-password|books|ebooks|read|video-library|audio-library|library|courses|all-products|mini-courses|you-have-paid|invoice|membership|user|account)(\/|$)/.test(k)
)
console.log('selected routes:', want.length)

const have = new Set()
for (const f of fs.readdirSync(path.join(cdnDir, '_next/static/chunks'), { recursive: true })) {
  // recursive readdir returns relative paths
}
function walk(d, base = '') {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const rel = base ? base + '/' + e.name : e.name
    if (e.isDirectory()) walk(path.join(d, e.name), rel)
    else have.add(rel)
  }
}
walk(path.join(cdnDir, '_next/static/chunks'))
// also flat files directly under cdn host dir (downloaders may flatten)
for (const e of fs.readdirSync(cdnDir, { withFileTypes: true })) {
  if (e.isFile()) have.add(e.name)
}
const norm = s => decodeURIComponent(s)
const haveNorm = new Set([...have].map(norm))
const haveBase = new Set([...have].map(h => path.basename(norm(h))))

const missing = new Map() // chunk -> routes needing it
for (const k of want) {
  const deps = bm[k]
  if (!Array.isArray(deps)) continue
  for (const d of deps) {
    if (typeof d !== 'string' || !d.endsWith('.js')) continue
    const rel = d.replace(/^static\/chunks\//, '')
    if (!haveNorm.has(rel) && !haveBase.has(path.basename(norm(rel)))) {
      if (!missing.has(d)) missing.set(d, [])
      missing.get(d).push(k)
    }
  }
}
console.log('missing chunks for selected routes:', missing.size)
const out = [...missing.entries()].map(([chunk, routes]) => ({ chunk, routes: routes.slice(0, 4), n: routes.length }))
fs.writeFileSync(path.join(ROOT, 'lena/docs/evidence/chunk-gap-live.json'), JSON.stringify(out, null, 2))
for (const o of out) console.log(o.chunk, '<-', o.routes.join(', '), o.n > 4 ? `(+${o.n - 4})` : '')