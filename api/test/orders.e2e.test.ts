import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'

let app: ReturnType<typeof buildApp>

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
})

afterAll(async () => {
  await app.close()
})

describe('latest order endpoint', () => {
  it('returns most recent order for user', async () => {
    const user = await app.prisma.user.create({ data: { email: 'order@example.com', password: 'x' } })
    const product = await app.prisma.product.create({ data: { name: 'Item', price: 5, description: 'd', category: 'c', slug: 'order-item', images: [], stock: 5 } })

    await app.prisma.order.create({
      data: {
        userId: user.id,
        status: 'PAID',
        items: { create: [{ productId: product.id, quantity: 1, price: 5 }] },
      },
    })
    const latest = await app.prisma.order.create({
      data: {
        userId: user.id,
        status: 'PAID',
        items: { create: [{ productId: product.id, quantity: 2, price: 5 }] },
      },
    })

    const token = app.jwt.sign({ id: user.id, isAdmin: user.isAdmin })
    const res = await request(app.server)
      .get('/api/orders/latest')
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(res.body.id).toBe(latest.id)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.total).toBe(10)
  })
})
