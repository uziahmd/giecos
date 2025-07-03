import { test, expect } from '@playwright/test'

// mock server behavior via request interception

test('admin adds product and shopper purchases it', async ({ page }) => {
  await page.addInitScript(() => {
    window.Airwallex = {
      loadAirwallex: () => Promise.resolve(),
      createElement: () => ({
        mount: () => {},
        confirm: () => Promise.resolve(),
      }),
    }
  })
  const adminEmail = 'admin@example.com'
  const shopperEmail = 'shopper@example.com'
  const products: Array<Record<string, unknown>> = []
  let currentUser: { email: string; isAdmin: boolean } | null = null
  const inbox: string[] = []

  await page.route('**/api/login', async (route) => {
    const body = JSON.parse(route.request().postData() || '{}')
    if (body.email === adminEmail) {
      currentUser = { email: adminEmail, isAdmin: true }
    } else {
      currentUser = { email: shopperEmail, isAdmin: false }
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(currentUser) })
  })

  await page.route('**/api/me', async (route) => {
    await route.fulfill({ status: currentUser ? 200 : 401, contentType: 'application/json', body: JSON.stringify(currentUser) })
  })

  await page.route('**/api/products', async (route) => {
    const req = route.request()
    if (req.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(products) })
    } else {
      const body = JSON.parse(req.postData() || '{}')
      const product = { ...body, id: `p${products.length + 1}`, images: body.images ?? [] }
      products.push(product)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(product) })
    }
  })

  await page.route('**/api/checkout', async (route) => {
    inbox.push('receipt')
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'pi_1', client_secret: 'secret' }) })
  })

  await page.route('**/api/orders/latest', async (route) => {
    const order = {
      id: 'order1',
      orderNumber: 'ORD-99',
      total: products[0].price,
      firstName: 'A',
      lastName: 'B',
      phone: '1',
      secondaryPhone: '2',
      address1: '123',
      address2: 'apt',
      city: 'C',
      state: 'ST',
      postalCode: '000',
      country: 'US',
      instructions: 'n/a',
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(order) })
  })

  // admin login and add product
  await page.goto('/login')
  await page.fill('input[name="email"]', adminEmail)
  await page.fill('input[name="password"]', 'secret')
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/login')),
    page.getByRole('button', { name: /sign in/i }).click(),
  ])

  await page.goto('/admin')
  await page.getByText('Add Product').click()
  await page.fill('input[name="name"]', 'Playwright Product')
  await page.fill('input[name="price"]', '99.99')
  await page.fill('input[name="category"]', 'Tools')
  await page.fill('textarea[name="description"]', 'Test item')
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/products') && res.status() === 201),
    page.getByRole('button', { name: 'Add Product' }).click(),
  ])
  await expect(page.getByText('Playwright Product')).toBeVisible()

  // shopper login
  await page.goto('/login')
  await page.fill('input[name="email"]', shopperEmail)
  await page.fill('input[name="password"]', 'secret')
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/login')),
    page.getByRole('button', { name: /sign in/i }).click(),
  ])

  await page.goto('/shop')
  await page.getByText('Playwright Product').click()
  await page.getByRole('button', { name: /add to cart/i }).click()

  await page.goto('/cart')
  await page.getByRole('button', { name: /proceed to checkout/i }).click()
  await expect(page).toHaveURL(/\/shipping$/)

  await page.fill('input[name="orderNumber"]', 'ORD-99')
  await page.fill('input[name="firstName"]', 'A')
  await page.fill('input[name="address1"]', '123 St')
  await page.fill('input[name="city"]', 'City')
  await page.fill('input[name="state"]', 'ST')
  await page.fill('input[name="postalCode"]', '00000')
  await page.fill('input[name="country"]', 'US')

  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith('/api/checkout')),
    page.getByRole('button', { name: /continue to payment/i }).click(),
  ])

  await expect(page).toHaveURL(/\/checkout\?/)

  await page.getByRole('button', { name: /pay now/i }).click()
  await expect(page).toHaveURL(/\/success$/)
  await expect(page.getByText('ORD-99')).toBeVisible()
  expect(inbox.length).toBeGreaterThan(0)
})
