import { expect, test } from '@playwright/test'

test('admin creates a course and it appears in the catalog', async ({ page }) => {
  await page.goto('/admin/courses')
  await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible()

  const title = `E2E Course ${Date.now()}`
  const slug = `e2e-course-${Date.now()}`
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Slug').fill(slug)
  await page.getByLabel('Category').fill('E2E')
  await page.getByLabel('Price (USD)').fill('49')
  await page.getByRole('button', { name: 'Create course' }).click()
  await expect(page.getByText(title)).toBeVisible()

  await page.goto('/courses')
  await expect(page.getByRole('heading', { name: title })).toBeVisible({ timeout: 15_000 })
})
