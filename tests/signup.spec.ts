import { test, expect } from '@playwright/test'

// This script assumes the dev server and API are running locally.
// The OTP email is mocked by intercepting the API response.

test('user can sign up and verify account', async ({ page }) => {
  const email = `user-${Date.now()}@example.com`

  await page.goto('http://localhost:8080/signup')
  await page.getByLabel('Full Name').fill('E2E User')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('secret')

  const [requestPromise] = await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/signup') && res.ok()),
    page.getByRole('button', { name: /create account/i }).click(),
  ])

  const signupResponse = await requestPromise.json()
  expect(signupResponse.email).toBe(email)

  // In tests the OTP email would be intercepted; replace with actual mocked code
  const otpCode = '123456'

  await page.fill('input[name="otp"]', otpCode)
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/otp/verify') && res.ok()),
    page.getByRole('button', { name: /verify account/i }).click(),
  ])

  await page.goto('http://localhost:8080/account')
  await expect(page.getByText(email)).toBeVisible()
})
