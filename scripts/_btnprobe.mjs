import { chromium } from '@playwright/test'
const b = await chromium.launch({ headless: true })
const ctx = await b.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' })
const p = await ctx.newPage()
await p.goto('https://www.savvypro.org/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await p.waitForTimeout(2500)
const out = await p.evaluate(() => {
  const res = []
  const seen = new Set()
  for (const el of document.querySelectorAll('button, a')) {
    const pk = Object.keys(el).find((k) => k.startsWith('__reactProps$'))
    if (!pk) continue
    const props = el[pk] || {}
    const txt = (el.textContent || '').trim().slice(0, 44)
    if (seen.has(txt)) continue
    seen.add(txt)
    res.push({ tag: el.tagName, txt, href: el.getAttribute('href'), onClick: typeof props.onClick === 'function' ? props.onClick.toString().replace(/\s+/g,' ').slice(0,180) : null })
  }
  return res
})
for (const r of out) console.log(r.tag, JSON.stringify(r.txt), '| href=', r.href, '| onClick=', r.onClick ? r.onClick.slice(0,150) : null)
await b.close()
