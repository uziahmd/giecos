import { test, expect } from '@playwright/test'
import fs from 'node:fs/promises'

// Assumes the dev server and API are running locally.
// The signup request is intercepted with a fixture so the OTP can be read
// from the mocked response and used in the verification step.

test('user can sign up and verify account', async ({ page }) => {
  const email = `user-${Date.now()}@example.com`

  const fixture = JSON.parse(
    await fs.readFile('tests/fixtures/signup.json', 'utf-8'),
  )

  await page.route('**/api/signup', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...fixture, email }),
    })
  })

  await page.route('**/api/otp/verify', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.route('**/api/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ email, isAdmin: false }),
    })
  })

  await page.goto('http://localhost:5173/signup')
  await page.getByLabel('Full Name').fill('E2E User')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('secret')

  const [requestPromise] = await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/signup') && res.ok()),
    page.getByRole('button', { name: /create account/i }).click(),
  ])

  const signupResponse = await requestPromise.json()
  expect(signupResponse.email).toBe(email)

  const otpCode = signupResponse.otp as string

  await page.fill('input[name="otp"]', otpCode)
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/otp/verify') && res.ok()),
    page.getByRole('button', { name: /verify account/i }).click(),
  ])

  await page.goto('http://localhost:5173/account')
  await expect(page.getByText(email)).toBeVisible()
})
