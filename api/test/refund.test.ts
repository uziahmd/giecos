import { describe, it, beforeAll, expect, vi } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'

vi.mock('../src/lib/stripe', () => ({
  default: {
    checkout: { sessions: { retrieve: vi.fn().mockResolvedValue({ payment_intent: 'pi_1' }) } },
    refunds: { create: vi.fn().mockResolvedValue({}) }
  }
}))

let app: ReturnType<typeof buildApp>

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
  const user = await app.prisma.user.create({ data: { email: 'a', password: 'x', isAdmin: true } })
  const product = await app.prisma.product.create({ data: { name: 'p', price: 1, description: 'd', category: 'c', slug: 's', images: [] } })
  await app.prisma.order.create({ data: { id: 'o1', userId: user.id, status: 'PAID', stripeSessionId: 'sess', items: { create: { productId: product.id, quantity: 1, price: 1 } } } })
  const token = app.jwt.sign({ id: user.id, isAdmin: true })
  app.decorateRequest('cookies', null)
  app.addHook('preHandler', (req, _, done) => { req.cookies = { token }; done() })
})

describe('refund order', () => {
  it('updates status', async () => {
    await request(app.server).post('/api/orders/o1/refund').expect(200)
    const order = await app.prisma.order.findUnique({ where: { id: 'o1' } })
    expect(order?.status).toBe('REFUNDED')
  })
})
