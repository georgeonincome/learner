import { chromium } from '@playwright/test'
const b = await chromium.launch({ headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
const urls = [
  '/', '/courses', '/books', '/login', '/contact-us', '/blog',
  '/course-detail/ebook-whatsapp-marketing-for-smes-copy-1792144385987/49798',
  '/read/zero-to-hero-social-media-manager-book',
  '/checkout?course=content-creation-school-2026',
]
for (const u of urls) {
  await p.goto('http://127.0.0.1:3000' + u, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(e => console.log(u, 'GOTO FAIL', String(e).split('\n')[0]))
  await p.waitForTimeout(1800)
  const r = await p.evaluate(() => {
    const bodyBg = getComputedStyle(document.body).backgroundColor
    const els = [...document.querySelectorAll('h1,h2,p,a,span,div')]
    let bad = 0, samples = []
    for (const el of els) {
      const cs = getComputedStyle(el)
      const txt = (el.textContent || '').trim()
      if (!txt || el.children.length > 0) continue
      const c = cs.color
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      if (!m) continue
      const [_, rr, gg, bb, aa] = m
      const alpha = aa === undefined ? 1 : Number(aa)
      if (alpha < 0.1) continue
      // effective background: walk up for a non-transparent bg
      let bg = bodyBg, node = el
      while (node && node !== document.documentElement) {
        const b = getComputedStyle(node).backgroundColor
        if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') { bg = b; break }
        node = node.parentElement
      }
      const lum = (s) => { const q = s.match(/\d+/g).map(Number); return 0.2126*q[0] + 0.7152*q[1] + 0.0722*q[2] }
      const l1 = lum(c), l2 = lum(bg)
      const ratio = (Math.max(l1,l2) + 5) / (Math.min(l1,l2) + 5)
      if (ratio < 2.2) { bad++; if (samples.length < 3) samples.push(`${el.tagName} "${txt.slice(0,26)}" color=${c} bg=${bg} ratio=${ratio.toFixed(2)}`) }
    }
    return { title: document.title, bodyBg, bad, samples }
  })
  console.log(u.padEnd(70), 'title=', (r.title||'').slice(0,32).padEnd(34), 'lowContrast=', r.bad, r.samples[0] || '')
}
await b.close()
