import { test, expect } from '@playwright/test'
import fs from 'node:fs/promises'

// Simulate a user signing up and purchasing a product end to end

test('user signs up and completes purchase flow', async ({ page }) => {
  const email = `buyer-${Date.now()}@example.com`
  const product = {
    id: 'p1',
    name: 'Playwright Toaster',
    price: 49.99,
    description: 'Test item',
    images: ['/placeholder.svg'],
    stock: 5,
    inStock: true,
    category: 'Kitchen',
    slug: 'playwright-toaster',
  }

  const order = {
    id: 'order1',
    createdAt: new Date().toISOString(),
    status: 'PAID',
    items: [
      {
        id: 'item1',
        quantity: 1,
        price: product.price,
        product,
      },
    ],
  }

  const signupFixture = JSON.parse(
    await fs.readFile('tests/fixtures/signup.json', 'utf-8'),
  )

  await page.route('**/api/signup', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...signupFixture, email }),
    })
  })

  await page.route('**/api/otp/verify', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.route('**/api/me', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ email, isAdmin: false }),
    })
  })

  await page.route('**/api/products', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([product]),
    })
  })

  await page.route('**/api/checkout', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: '/success' }),
    })
  })

  await page.route('**/api/orders/latest', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: order.id, items: order.items, total: product.price }),
    })
  })

  await page.route('**/api/orders', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([order]),
    })
  })

  // sign up flow
  await page.goto('http://localhost:5173/signup')
  await page.getByLabel('Full Name').fill('E2E Buyer')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('secret')
  const [signupRes] = await Promise.all([
    page.waitForResponse(res => res.url().endsWith('/api/signup') && res.ok()),
    page.getByRole('button', { name: /create account/i }).click(),
  ])
  const signupData = await signupRes.json()
  const code = signupData.otp as string
  await page.fill('input[name="otp"]', code)
  await Promise.all([
    page.waitForResponse(res => res.url().endsWith('/api/otp/verify') && res.ok()),
    page.getByRole('button', { name: /verify account/i }).click(),
  ])

  // shopping flow
  await page.goto('http://localhost:5173/shop')
  await page.getByText(product.name).click()

  // SEO title check
  await expect(page).toHaveTitle(product.name)

  await page.getByRole('button', { name: /add to cart/i }).click()

  await page.goto('http://localhost:5173/cart')
  await Promise.all([
    page.waitForResponse(res => res.url().endsWith('/api/checkout')),
    page.getByRole('button', { name: /proceed to checkout/i }).click(),
  ])

  await expect(page).toHaveURL(/\/success$/)

  await page.goto('http://localhost:5173/account/orders')
  await expect(page.getByText(product.name)).toBeVisible()
})
