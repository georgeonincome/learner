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
await new Promise((r) => server.listen(3105, '127.0.0.1', r))
const b = await chromium.launch({ headless: true })
const c = await b.newContext()
await c.route('**/*', (r) => {
  const u = r.request().url()
  if (u.startsWith('http://127.0.0.1:3105')) return r.continue()
  const m = u.match(/cdn\.ezycourse\.net\/_next\/static\/css\/([\w.-]+\.css)/)
  if (m) {
    const f = [path.join(CSS_SITE, '_next', 'static', 'css', m[1]), path.join(CSS_SITE, '_next', 'static', 'css', 'bba21c04c9008d1b.css')].find((x) => fs.existsSync(x))
    if (f) return r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(f) })
  }
  return r.abort()
})
const p = await c.newPage()
for (const [f, css] of [['index.html','index.css'],['courses.html','courses.html'.replace('.html','.css')],['login.html','login.css']]) {
  await p.goto('http://127.0.0.1:3105/'+f, { waitUntil: 'domcontentloaded' })
  if (fs.existsSync(path.join(REF_DIR, css))) await p.addStyleTag({ content: fs.readFileSync(path.join(REF_DIR, css), 'utf8') }).catch(()=>{})
  await p.waitForTimeout(700)
  const r = await p.evaluate(() => {
    const bs = getComputedStyle(document.body)
    const hs = getComputedStyle(document.documentElement)
    return { bodyBg: bs.backgroundColor, bodyColor: bs.color, htmlBg: hs.backgroundColor }
  })
  console.log(f, JSON.stringify(r))
}
await b.close(); server.close()
