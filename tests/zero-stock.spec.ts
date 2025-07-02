import { test, expect } from '@playwright/test'

// Ensure a zero stock product displays as unavailable and cannot be added to cart

test('product with zero stock shows Unavailable and disables add to cart', async ({ page }) => {
  const product = {
    id: 'p1',
    name: 'Out Item',
    price: 20,
    description: 'none',
    images: ['/placeholder.svg'],
    stock: 0,
    inStock: false,
    category: 'Tools',
    slug: 'out-item',
  }

  await page.route('**/api/me', async route => {
    await route.fulfill({ status: 401, body: '{}' })
  })

  await page.route('**/api/products', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([product]),
    })
  })

  await page.goto('http://localhost:8080/product/out-item')
  await expect(page.getByText('Unavailable')).toBeVisible()
  await expect(page.getByRole('button', { name: /add to cart/i })).toBeDisabled()
})
