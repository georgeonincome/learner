import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  { name: 'home', url: '/' },
  { name: 'course-detail', url: '/course-detail/content-creation-school-2026/36467' },
  { name: 'dashboard', url: '/dashboard' },
  { name: 'lesson-player', url: '/dashboard/course/content-creation-school-2026/lesson/1' },
]

for (const { name, url } of pages) {
  test(`axe: ${name}`, async ({ page, context }) => {
    // Middleware only checks cookie presence for protected routes; a dummy
    // value is enough to render the page for a static accessibility audit.
    await context.addCookies([
      { name: 'lena_session', value: 'e2e-audit', url: 'http://127.0.0.1:3000' },
    ])
    await page.goto(url)
    const results = await new AxeBuilder({ page }).analyze()
    const violations = results.violations.map((v) => `${v.id}: ${v.nodes.length}`)
    expect(violations, `${name} axe violations: ${violations.join(', ')}`).toEqual([])
  })
}
