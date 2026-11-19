import { chromium } from '@playwright/test'
const b = await chromium.launch({ headless: true })
const p = await b.newPage()
const results = {}
for (const [label, expect] of [['Get Started','/getting-started-page'],['Start Free','/learn-digital-skills'],['Grow My Business','/grow-my-business']]) {
  await p.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 90000 })
  await p.waitForTimeout(2200)
  const btn = p.getByRole('button', { name: label, exact: true }).first()
  if (!(await btn.count())) { results[label] = 'NOT FOUND'; continue }
  await btn.click({ timeout: 8000 }).catch((e) => { results[label] = 'click error ' + String(e).split('\n')[0] })
  await p.waitForTimeout(2500)
  const url = new URL(p.url())
  results[label] = `${url.pathname} ${url.pathname.replace(/\/$/,'') === expect.replace(/\/$/,'') ? 'OK' : 'EXPECTED ' + expect}`
}
console.log(JSON.stringify(results, null, 1))
await b.close()
