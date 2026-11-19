import { expect, test } from '@playwright/test'

// This journey requires real Firebase + Stripe test credentials. It is skipped
// (not reported as passing) when they are absent. Set:
//   E2E_FIREBASE_EMAIL, E2E_FIREBASE_PASSWORD, STRIPE_TEST_CARD_OK
// Stripe checkout must be exercised in test mode with the test card 4242...
const email = process.env.E2E_FIREBASE_EMAIL
const password = process.env.E2E_FIREBASE_PASSWORD
const card = process.env.STRIPE_TEST_CARD_OK || '4242424242424242'

test.describe('full learner journey (requires Firebase + Stripe test credentials)', () => {
  test.skip(!email || !password, 'E2E_FIREBASE_EMAIL / E2E_FIREBASE_PASSWORD not set')

  test('signup → verify → browse → enroll → pay → learn → complete → logout', async ({ page }) => {
    await page.goto('/signup')
    await page.getByLabel('Email').fill(email!)
    await page.getByLabel('Password').fill(password!)
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page).toHaveURL('/')

    // Email verification: Firebase sends a link; the test harness must inject
    // the oobCode from the test user's email inbox.
    const oobCode = process.env.E2E_VERIFY_OOB_CODE
    test.skip(!oobCode, 'E2E_VERIFY_OOB_CODE not provided')
    await page.goto(`/verify?oobCode=${oobCode}`)
    await expect(page.getByText('Verified!')).toBeVisible()

    await page.goto('/courses')
    await page.getByRole('heading', { name: 'Courses' }).click()
    await page.goto('/course-detail/content-creation-school-2026/36467')
    await page.getByRole('button', { name: 'Enroll Now' }).click()

    // Stripe hosted checkout in test mode.
    await page.getByLabel('Card number').fill(card)
    await page.getByLabel('Expiration date').fill('12/30')
    await page.getByLabel('CVC').fill('123')
    await page.getByRole('button', { name: /Pay|Subscribe/ }).click()
    await expect(page).toHaveURL(/you-have-paid/)

    await page.goto('/dashboard')
    await page.getByRole('link', { name: 'Resume learning' }).first().click()
    await page.getByRole('button', { name: 'Mark complete' }).click()
    await expect(page.getByText('✓ Completed')).toBeVisible()

    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL('/')
  })
})
