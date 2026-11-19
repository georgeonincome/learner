import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
await context.addCookies([
  { name: 'lena_session', value: 'e2e-audit', url: 'http://127.0.0.1:3000' },
])
const urls = process.argv.slice(2)
for (const url of urls) {
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:3000${url}`)
  const r = await new AxeBuilder({ page }).analyze()
  console.log(`\n=== ${url} ===`)
  for (const v of r.violations) {
    console.log(`${v.id} (${v.nodes.length}): ${v.help}`)
    for (const n of v.nodes.slice(0, 5)) {
      console.log(`  ${n.target.join(' ')} | ${n.failureSummary?.replace(/\n/g, ' ').slice(0, 180)}`)
    }
  }
  await page.close()
}
await browser.close()
