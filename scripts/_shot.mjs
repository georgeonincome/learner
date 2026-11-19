import { chromium } from '@playwright/test'
const url = process.argv[2]
const out = process.argv[3]
const b = await chromium.launch({ headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
await p.waitForTimeout(2500)
const styles = await p.evaluate(() => {
  const h1 = document.querySelector('h1')
  const cs = h1 ? getComputedStyle(h1) : null
  const app = document.querySelector('.app-surface')
  return {
    bodyBg: getComputedStyle(document.body).backgroundColor,
    appBg: app ? getComputedStyle(app).backgroundColor : null,
    h1Color: cs ? cs.color : null,
    h1Text: h1 ? h1.textContent.trim().slice(0, 50) : null,
  }
})
console.log(JSON.stringify(styles))
await p.screenshot({ path: out, fullPage: false })
await b.close()
