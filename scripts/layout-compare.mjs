/**
 * Layout fidelity comparison: loads captured reference HTML+CSS from
 * _reference and our rebuilt pages at 375/768/1024/1280/1536px, measures
 * section heights, bounding boxes and computed typography, and writes
 * COMPARISON.md with pass/fail per template and breakpoint.
 *
 * Usage:
 *   1. npm run build && npx next start -p 3000   (our site)
 *   2. node scripts/layout-compare.mjs            (this script)
 *
 * Our pages are instrumented with data-layout-section on the top-level
 * blocks; the reference is measured with a generic section selector.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium } from '@playwright/test'

const ROOT = process.cwd()
const REF_SITE = path.resolve(ROOT, '..', '_reference', 'site', 'www.savvypro.org')
const OUR_BASE = process.env.OUR_BASE || 'http://127.0.0.1:3000'
const REF_PORT = 3100
const WIDTHS = [375, 768, 1024, 1280, 1536]
const TOLERANCE = 4

const PAIRS = [
  { template: 'home', ref: 'index.html', ours: '/' },
  { template: 'catalog', ref: 'courses.html', ours: '/courses' },
  { template: 'all-products', ref: 'all-products.html', ours: '/all-products' },
  { template: 'course-detail', ref: 'course-detail-content-creation-school-2026-36467.html', ours: '/course-detail/content-creation-school-2026/36467' },
  { template: 'books', ref: 'books.html', ours: '/books' },
  { template: 'book', ref: 'zero-to-hero-social-media-manager-book.html', ours: '/book/zero-to-hero-social-media-manager-book' },
  { template: 'blog', ref: 'blog.html', ours: '/blog' },
  { template: 'blog-post', ref: 'blog.html', ours: '/blog/making-your-own-salary-stay-home-mums' },
  { template: 'blog-category', ref: 'blog-category-freelancer-listings.html', ours: '/blog/category/freelancer-listings/2817' },
  { template: 'community', ref: 'community-834.html', ours: '/community/834' },
  { template: 'groups', ref: 'groups.html', ours: '/groups' },
  { template: 'path-landing', ref: 'getting-started-page.html', ours: '/getting-started-page' },
  { template: 'legal', ref: 'contact-us.html', ours: '/contact-us' },
  { template: 'program', ref: 'private-1-on-1-consultation.html', ours: '/private-1-on-1-consultation' },
  { template: 'webinar', ref: 'freelancer-webinar.html', ours: '/freelancer-webinar' },
  { template: 'savvybot', ref: 'savvybot-ai-agent.html', ours: '/savvybot-ai-agent' },
  { template: 'lead-magnet', ref: 'join-our-mailing-list.html', ours: '/join-our-mailing-list' },
  { template: 'auth', ref: 'login.html', ours: '/login' },
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

function startStaticServer(root, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
      let file = path.join(root, urlPath)
      if (!file.startsWith(root)) {
        res.writeHead(403).end()
        return
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index.html')
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404).end('not found')
        return
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      })
      fs.createReadStream(file).pipe(res)
    })
    server.listen(port, '127.0.0.1', () => resolve(server))
  })
}

async function measure(page, url, isRef) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.waitForTimeout(400)
  return page.evaluate((isRefLocal) => {
    const px = (v, fontPx = 0) => {
      const n = parseFloat(v)
      if (!Number.isNaN(n)) return Math.round(n)
      // Computed `normal` line-height: use browser-typical 1.2 ratio.
      return fontPx ? Math.round(fontPx * 1.2) : 0
    }
    const selector = isRefLocal ? 'section' : '[data-layout-section]'
    const sections = [...document.querySelectorAll(selector)]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.height > 20 && r.width > 100
      })
      .slice(0, 8)
      .map((el) => {
        const r = el.getBoundingClientRect()
        const heading = el.querySelector('h1,h2,h3')
        const cs = heading ? getComputedStyle(heading) : null
        const elCs = getComputedStyle(el)
        const hFont = cs ? px(cs.fontSize) : 0
        return {
          y: Math.round(r.y + window.scrollY),
          h: Math.round(r.height),
          w: Math.round(r.width),
          tag: el.tagName.toLowerCase(),
          headingFont: hFont,
          headingLine: cs ? px(cs.lineHeight, hFont) : 0,
          padTop: px(elCs.paddingTop),
          padBottom: px(elCs.paddingBottom),
        }
      })
    const h1 = document.querySelector('h1')
    const h1cs = h1 ? getComputedStyle(h1) : null
    const h1r = h1 ? h1.getBoundingClientRect() : null
    const h1Font = h1cs ? px(h1cs.fontSize) : 0
    return {
      docWidth: document.documentElement.scrollWidth,
      sections,
      h1: h1
        ? {
            w: Math.round(h1r.width),
            h: Math.round(h1r.height),
            font: h1Font,
            line: px(h1cs.lineHeight, h1Font),
            family: h1cs.fontFamily.split(',')[0].replace(/["']/g, ''),
            weight: h1cs.fontWeight,
          }
        : null,
    }
  }, isRef)
}

function diffMetrics(ref, ours) {
  const checks = []
  const cmp = (name, a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      checks.push({ name, ref: a, ours: b, pass: a === b })
      return
    }
    checks.push({ name, ref: a, ours: b, pass: Math.abs(a - b) <= TOLERANCE })
  }
  cmp('docWidth', ref.docWidth, ours.docWidth)
  if (ref.h1 && ours.h1) {
    cmp('h1.width', ref.h1.w, ours.h1.w)
    cmp('h1.fontSize', ref.h1.font, ours.h1.font)
    cmp('h1.lineHeight', ref.h1.line, ours.h1.line)
    checks.push({
      name: 'h1.fontFamily',
      ref: ref.h1.family,
      ours: ours.h1.family,
      pass: ref.h1.family.toLowerCase() === ours.h1.family.toLowerCase(),
    })
  } else {
    checks.push({ name: 'h1.present', ref: !!ref.h1, ours: !!ours.h1, pass: !!ref.h1 === !!ours.h1 })
  }
  const count = Math.min(ref.sections.length, ours.sections.length)
  for (let i = 0; i < count; i++) {
    const r = ref.sections[i]
    const o = ours.sections[i]
    cmp(`section[${i}].height`, r.h, o.h)
    cmp(`section[${i}].paddingTop`, r.padTop, o.padTop)
    cmp(`section[${i}].headingFont`, r.headingFont, o.headingFont)
  }
  checks.push({
    name: 'section.count',
    ref: ref.sections.length,
    ours: ours.sections.length,
    pass: ref.sections.length === ours.sections.length,
  })
  return checks
}

async function main() {
  const server = await startStaticServer(REF_SITE, REF_PORT)
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  // Block external network (fonts/CDN) so reference pages render deterministically.
  await context.route('**/*', (route) => {
    const u = route.request().url()
    if (u.startsWith(`http://127.0.0.1:${REF_PORT}`) || u.startsWith(OUR_BASE)) return route.continue()
    // The captured HTML references its CSS on cdn.ezycourse.net. Serve the
    // captured copy from _reference instead of blocking it.
    const m = u.match(/cdn\.ezycourse\.net\/_next\/static\/css\/([\w.-]+\.css)/)
    if (m) {
      const file = path.join(REF_SITE, '_next', 'static', 'css', m[1])
      if (fs.existsSync(file)) {
        return route.fulfill({
          status: 200,
          contentType: 'text/css',
          body: fs.readFileSync(file),
        })
      }
    }
    return route.abort()
  })

  const results = []
  for (const pair of PAIRS) {
    const row = { template: pair.template, breakpoints: [] }
    for (const width of WIDTHS) {
      const page = await context.newPage()
      await page.setViewportSize({ width, height: 900 })
      let ref, ours, error
      try {
        ref = await measure(page, `http://127.0.0.1:${REF_PORT}/${pair.ref}`, true)
        ours = await measure(page, `${OUR_BASE}${pair.ours}`, false)
      } catch (e) {
        error = e.message.split('\n')[0]
      }
      await page.close()
      const checks = error ? [] : diffMetrics(ref, ours)
      const failed = checks.filter((c) => !c.pass)
      row.breakpoints.push({ width, error, ref, ours, failed })
    }
    results.push(row)
    const summary = row.breakpoints
      .map((b) => `${b.width}:${b.error ? 'ERR' : b.failed.length ? 'FAIL' : 'PASS'}`)
      .join(' ')
    console.log(`${pair.template.padEnd(16)} ${summary}`)
  }

  await browser.close()
  server.close()

  // Write machine-readable output for report generation.
  fs.writeFileSync(
    path.join(ROOT, 'layout-results.json'),
    JSON.stringify({ tolerance: TOLERANCE, widths: WIDTHS, results }, null, 2),
  )
  console.log('\nWrote layout-results.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
