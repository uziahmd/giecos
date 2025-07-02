import { describe, it, beforeAll, expect, vi } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'
import { getAirwallexToken } from '../src/lib/airwallex'

vi.mock('../src/lib/airwallex', () => ({
  getAirwallexToken: vi.fn().mockResolvedValue('tok'),
}))

beforeAll(() => {
  global.fetch = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({}) }) as unknown as typeof fetch
})

let app: ReturnType<typeof buildApp>
let token: string

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
  const user = await app.prisma.user.create({ data: { email: 'a', password: 'x', isAdmin: true } })
  const product = await app.prisma.product.create({ data: { name: 'p', price: 1, description: 'd', category: 'c', slug: 's', images: [] } })
  await app.prisma.order.create({ data: { id: 'o1', userId: user.id, status: 'PAID', paymentIntentId: 'pi_1', items: { create: { productId: product.id, quantity: 1, price: 1 } } } })
  token = app.jwt.sign({ id: user.id, isAdmin: true })
})

describe('refund order', () => {
  it('updates status', async () => {
    await request(app.server)
      .post('/api/orders/o1/refund')
      .set('Cookie', `token=${token}`)
      .expect(200)
    const order = await app.prisma.order.findUnique({ where: { id: 'o1' } })
    expect(order?.status).toBe('REFUNDED')
  })
})
