import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'

let app: ReturnType<typeof buildApp>
let checkoutCreate: any
let constructEvent: any

vi.mock('../src/lib/stripe', () => {
  checkoutCreate = vi.fn().mockResolvedValue({ id: 'sess_checkout', url: 'https://example.com/c' })
  constructEvent = vi.fn()
  return {
    default: {
      checkout: { sessions: { create: checkoutCreate } },
      webhooks: { constructEvent },
    },
  }
})

vi.mock('../src/lib/mailer', () => ({
  sendOrderReceipt: vi.fn(() => Promise.resolve()),
}))

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
})

afterAll(async () => {
  await app.close()
})

describe('product and checkout flow', () => {
  it('allows admin to create product', async () => {
    const token = app.jwt.sign({ id: 'admin', isAdmin: true })
    const res = await request(app.server)
      .post('/api/products')
      .set('Cookie', `token=${token}`)
      .send({ name: 'Test', price: 1, description: 'd', category: 'c', slug: 'test-admin' })
      .expect(201)

    expect(res.body.id).toBeDefined()
  })

  it('returns 403 for non admin', async () => {
    const token = app.jwt.sign({ id: 'user' })
    await request(app.server)
      .post('/api/products')
      .set('Cookie', `token=${token}`)
      .send({ name: 'Fail', price: 1, description: 'd', category: 'c', slug: 'test-guest' })
      .expect(403)
  })

  it('checkout marks order as paid', async () => {
    const user = await app.prisma.user.create({ data: { email: 'shopper@example.com', password: 'x' } })
    const product = await app.prisma.product.create({
      data: { name: 'Item', price: 2, description: 'd', category: 'c', slug: 'item', images: [] },
    })
    const token = app.jwt.sign({ id: user.id })

    checkoutCreate.mockResolvedValueOnce({ id: 'sess_checkout', url: 'https://example.com/c' })
    constructEvent.mockReturnValueOnce({
      type: 'checkout.session.completed',
      data: { object: { id: 'sess_checkout' } },
    })

    const res = await request(app.server)
      .post('/api/checkout')
      .set('Cookie', `token=${token}`)
      .send({ items: [{ id: product.id, qty: 1 }] })
      .expect(200)

    expect(res.body.url).toBe('https://example.com/c')

    await request(app.server)
      .post('/api/stripe/webhook')
      .set('stripe-signature', 'test')
      .set('Content-Type', 'application/json')
      .send('{}')
      .expect(200)

    const order = await app.prisma.order.findFirst({ where: { stripeSessionId: 'sess_checkout' } })
    expect(order?.status).toBe('PAID')
  })
})
