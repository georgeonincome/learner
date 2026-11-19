import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium } from '@playwright/test'
const ROOT = process.cwd()
const REF_DIR = path.resolve(ROOT, 'captured-browser')
const CSS_SITE = path.resolve(ROOT, '..', '_reference', 'site', 'www.savvypro.org')
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8' }
const server = http.createServer((req, res) => {
  let f = path.join(REF_DIR, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html')
  if (!fs.existsSync(f)) { res.writeHead(404).end('x'); return }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' })
  fs.createReadStream(f).pipe(res)
})
await new Promise((r) => server.listen(3106, '127.0.0.1', r))
const b = await chromium.launch({ headless: true })
const c = await b.newContext()
await c.route('**/*', (r) => {
  const u = r.request().url()
  if (u.startsWith('http://127.0.0.1:3106')) return r.continue()
  const m = u.match(/cdn\.ezycourse\.net\/_next\/static\/css\/([\w.-]+\.css)/)
  if (m) {
    const f = [path.join(CSS_SITE, '_next', 'static', 'css', m[1]), path.join(CSS_SITE, '_next', 'static', 'css', 'bba21c04c9008d1b.css')].find((x) => fs.existsSync(x))
    if (f) return r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(f) })
  }
  return r.abort()
})
const p = await c.newPage({ viewport: { width: 1280, height: 900 } })
for (const f of ['courses.html', 'books.html']) {
  await p.goto('http://127.0.0.1:3106/' + f, { waitUntil: 'domcontentloaded' })
  const css = f.replace('.html', '.css')
  if (fs.existsSync(path.join(REF_DIR, css))) await p.addStyleTag({ content: fs.readFileSync(path.join(REF_DIR, css), 'utf8') }).catch(() => {})
  await p.waitForTimeout(900)
  const r = await p.evaluate(() => {
    const h1 = document.querySelector('h1')
    if (!h1) return { h1: null }
    const cs = getComputedStyle(h1)
    let node = h1, bg = 'none'
    while (node && node !== document.documentElement) {
      const b = getComputedStyle(node).backgroundColor
      if (b && b !== 'rgba(0, 0, 0, 0)') { bg = b; break }
      node = node.parentElement
    }
    return { h1Text: h1.textContent.trim().slice(0, 40), color: cs.color, bgFound: bg, cls: h1.className.slice(0, 50) }
  })
  console.log('REF', f, JSON.stringify(r))
}
await b.close(); server.close()
