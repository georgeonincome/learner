/**
 * capture-live.mjs — fetch every sitemap URL from the live source site and
 * store the raw SSR HTML under captured/ for analysis and spec extraction.
 *
 * The reference archive `_reference/` is read-only; new captures land in
 * `captured/` inside the project.
 *
 * Usage: node scripts/capture-live.mjs [--concurrency 2] [--delay 250]
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'captured')
const SITEMAP = path.resolve(ROOT, '..', '_reference', 'sitemap.xml')
const HOST = process.env.CAPTURE_HOST || 'https://www.savvypro.org'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/122.0.0.0 Safari/537.36'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? Number(process.argv[i + 1]) : fallback
}
const CONCURRENCY = arg('concurrency', 2)
const DELAY = arg('delay', 250)

const xml = fs.readFileSync(SITEMAP, 'utf8')
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
console.log(`sitemap urls: ${urls.length}`)

fs.mkdirSync(OUT, { recursive: true })

function fileNameFor(u) {
  const p = new URL(u).pathname.replace(/^\/+|\/+$/g, '')
  if (!p) return 'index.html'
  return p.replace(/\//g, '__') + '.html'
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchOne(u) {
  const file = path.join(OUT, fileNameFor(u))
  if (fs.existsSync(file) && fs.statSync(file).size > 20000) {
    return { url: u, file: path.basename(file), status: 'cached', size: fs.statSync(file).size }
  }
  const res = await fetch(u, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: HOST + '/',
    },
    redirect: 'follow',
  })
  const text = await res.text()
  if (res.status !== 200 || text.length < 5000) {
    return { url: u, file: path.basename(file), status: res.status, size: text.length, error: 'short/blocked' }
  }
  fs.writeFileSync(file, text)
  return { url: u, file: path.basename(file), status: res.status, size: text.length }
}

const queue = [...urls]
const results = []
async function worker() {
  while (queue.length) {
    const u = queue.shift()
    try {
      const r = await fetchOne(u)
      results.push(r)
      console.log(`${String(r.status).padEnd(4)} ${String(r.size).padStart(8)}  ${r.file}`)
    } catch (e) {
      results.push({ url: u, status: 'ERR', error: e.message })
      console.log(`ERR  ${u} ${e.message}`)
    }
    await sleep(DELAY)
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

const failed = results.filter((r) => r.status !== 200 && r.status !== 'cached')
fs.writeFileSync(
  path.join(OUT, '_capture-report.json'),
  JSON.stringify({ host: HOST, at: new Date().toISOString(), results }, null, 2),
)
console.log(`\ncaptured: ${results.length - failed.length}/${results.length}  failed: ${failed.length}`)
for (const f of failed) console.log('  FAIL', f.status, f.url, f.error || '')
