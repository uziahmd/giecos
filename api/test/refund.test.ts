import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'
import { getAirwallexToken } from '../src/lib/airwallex'

vi.mock('../src/lib/airwallex', () => ({
  getAirwallexToken: vi.fn().mockResolvedValue('tok'),
}))

let fetchMock: vi.Mock

beforeAll(() => {
  fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
  global.fetch = fetchMock as unknown as typeof fetch
})

let app: ReturnType<typeof buildApp>
let token: string
let userId: string
let productId: string

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
  const user = await app.prisma.user.create({ data: { email: 'a', password: 'x', isAdmin: true } })
  userId = user.id
  const product = await app.prisma.product.create({ data: { name: 'p', price: 1, description: 'd', category: 'c', slug: 's', images: [] } })
  productId = product.id
  await app.prisma.order.create({ data: { id: 'o1', userId: userId, status: 'PAID', paymentIntentId: 'pi_refund_1', items: { create: { productId: productId, quantity: 1, price: 1 } } } })
  token = app.jwt.sign({ id: user.id, isAdmin: true })
})

afterAll(async () => {
  await app.close()
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

  it('returns error when refund fails', async () => {
    await app.prisma.order.create({
      data: {
        id: 'o2',
        userId,
        status: 'PAID',
        paymentIntentId: 'pi_refund_fail',
        items: { create: { productId, quantity: 1, price: 1 } },
      },
    })

    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'bad request' }),
    })

    const res = await request(app.server)
      .post('/api/orders/o2/refund')
      .set('Cookie', `token=${token}`)
      .expect(400)

    expect(res.body.error).toContain('bad request')
    const order = await app.prisma.order.findUnique({ where: { id: 'o2' } })
    expect(order?.status).toBe('PAID')
  })
})
