// Recover missing public/student route chunks from the LIVE build (additive only).
import fs from 'node:fs'
import path from 'node:path'

const ROOT = '/home/george_jackson/Projects/web/clone/savvypro'
const CDN = path.join(ROOT, '_reference/site/cdn.ezycourse.net')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
const H = { 'User-Agent': UA, 'Accept': '*/*', 'Accept-Language': 'en-US,en;q=0.9', 'Referer': 'https://www.savvypro.org/', 'Sec-Fetch-Dest': 'script', 'Sec-Fetch-Mode': 'no-cors', 'Sec-Fetch-Site': 'cross-site' }

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: H, signal: AbortSignal.timeout(30000) })
      if (r.ok) return { status: r.status, body: Buffer.from(await r.arrayBuffer()) }
      if (r.status === 404) return { status: 404, body: null }
      await new Promise(res => setTimeout(res, 1500 * (i + 1)))
    } catch (e) { await new Promise(res => setTimeout(res, 1500 * (i + 1))) }
  }
  return { status: 0, body: null }
}

// 1. current build id
const home = await get('https://www.savvypro.org/')
if (!home.body) { console.log('FATAL: homepage unreachable'); process.exit(1) }
const html = home.body.toString('utf8')
const m = html.match(/_next\/static\/([^/]+)\/_buildManifest\.js/)
const buildId = m ? m[1] : null
console.log('live build id:', buildId)
fs.writeFileSync(path.join(ROOT, 'lena/docs/evidence/live-build-id-2026-11-20.txt'), String(buildId))

// 2. manifest (reuse archived if same build)
let manifestSrc
const archived = path.join(ROOT, 'lena/docs/evidence/live-buildManifest-4315b58e.js')
if (buildId && buildId.startsWith('4315b58e') && fs.existsSync(archived)) {
  manifestSrc = fs.readFileSync(archived, 'utf8')
  console.log('using archived manifest (same build)')
} else {
  const mr = await get(`https://cdn.ezycourse.net/_next/static/${buildId}/_buildManifest.js`)
  if (!mr.body) { console.log('FATAL: manifest download failed', mr.status); process.exit(1) }
  manifestSrc = mr.body.toString('utf8')
  fs.writeFileSync(path.join(ROOT, `lena/docs/evidence/live-buildManifest-${buildId.slice(0, 8)}.js`), manifestSrc)
  console.log('downloaded fresh manifest')
}
const self = {}
new Function('self', manifestSrc)(self)
const bm = self.__BUILD_MANIFEST
const keys = Object.keys(bm).filter(k => !k.startsWith('__'))
const want = keys.filter(k =>
  k === '/' || /^\/\[page_slug\]/.test(k) || /^\/blog(\/|$)/.test(k) ||
  /^\/course-detail\//.test(k) || /^\/audio-details\//.test(k) ||
  /^\/community-detail\//.test(k) || /^\/community\/\[community_id\]$/.test(k) ||
  /^\/certificate\//.test(k) || /^\/coaching/.test(k) || /^\/student\//.test(k) ||
  /^\/(checkout|login|signup|verify|reset-password|forgot-password|books|ebooks|read|video-library|audio-library|library|courses|all-products|mini-courses|you-have-paid|invoice|membership|user|account)(\/|$)/.test(k)
)
// existing files
const have = new Set()
function walk(d, base = '') {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const rel = base ? base + '/' + e.name : e.name
    if (e.isDirectory()) walk(path.join(d, e.name), rel)
    else { have.add(rel); have.add(path.basename(rel)) }
  }
}
walk(path.join(CDN, '_next/static/chunks'))
for (const e of fs.readdirSync(CDN, { withFileTypes: true })) if (e.isFile()) have.add(e.name)
const missing = new Set()
for (const k of want) {
  const deps = bm[k]
  if (!Array.isArray(deps)) continue
  for (const d of deps) {
    if (typeof d !== 'string' || !d.endsWith('.js')) continue
    const rel = d.replace(/^static\/chunks\//, '')
    if (!have.has(rel) && !have.has(path.basename(rel)) && !have.has(decodeURIComponent(rel)) && !have.has(path.basename(decodeURIComponent(rel)))) missing.add(d)
  }
}
console.log('routes:', want.length, '| missing chunks to fetch:', missing.size)

// 3. download (additive; _reference write bit restored after)
const results = []
let ok = 0, fail = 0
for (const d of missing) {
  const url = 'https://cdn.ezycourse.net/_next/' + d
  const dest = path.join(CDN, '_next', d)
  const r = await get(url)
  if (r.body && r.body.length > 0) {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, r.body)
    ok++
    results.push({ chunk: d, status: r.status, bytes: r.body.length })
  } else {
    fail++
    results.push({ chunk: d, status: r.status, bytes: 0 })
    console.log('FAIL', r.status, d)
  }
}
console.log(`downloaded ${ok}, failed ${fail}`)
fs.writeFileSync(path.join(ROOT, 'lena/docs/evidence/chunk-recovery-2026-11-20.json'), JSON.stringify({ buildId, at: new Date().toISOString(), ok, fail, results }, null, 2))