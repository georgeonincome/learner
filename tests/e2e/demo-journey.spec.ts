import { expect, test } from '@playwright/test'

test('browse → course detail → community post → forms → logout (demo mode)', async ({ page }) => {
  // 1. Browse home and catalog
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  await page.goto('/courses')
  await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible()

  // 2. Open a course detail page
  await page.goto('/course-detail/content-creation-school-2026/36467')
  await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Content Creation School')

  // 3. Community post (demo user; the API stores it in the community store)
  await page.goto('/community/834')
  await page.getByPlaceholder('Post title').fill('E2E verification post')
  await page.getByPlaceholder('Share something with the group…').fill('Posted by the automated journey.')
  await page.getByRole('button', { name: 'Post', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'E2E verification post' }).first()).toBeVisible({ timeout: 15_000 })

  // 4. Contact form
  await page.goto('/contact-us')
  await page.getByLabel('Name').fill('E2E Tester')
  await page.getByLabel('Email').fill('e2e@example.com')
  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(page.getByText('This is a demo contact form.')).toBeVisible()

  // 5. Lead capture form
  await page.goto('/join-our-mailing-list')
  await page.getByLabel('Name').fill('E2E Tester')
  await page.getByLabel('Email').fill('e2e@example.com')
  await page.getByRole('button', { name: 'Join the list' }).click()
  await expect(page.getByText('Welcome aboard!')).toBeVisible({ timeout: 15_000 })

  // 6. Webinar booking form
  await page.goto('/webinar-registration-freelancing')
  await page.getByLabel('Full name').fill('E2E Tester')
  await page.getByLabel('Email').fill('e2e@example.com')
  await page.getByRole('button', { name: 'Register for the webinar' }).click()
  await expect(page.getByText("You're registered!")).toBeVisible({ timeout: 15_000 })

  // 7. Logout endpoint (no session in demo mode)
  const res = await page.request.post('/api/auth/logout')
  expect(res.ok()).toBeTruthy()
})
