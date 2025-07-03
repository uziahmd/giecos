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
        orderNumber: 'ORD-1',
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
    expect(res.body.orderNumber).toBe('ORD-1')
    expect(res.body.firstName).toBe('A')
    expect(res.body.lastName).toBe('B')
    expect(res.body.phone).toBe('1')
    expect(res.body.secondaryPhone).toBe('2')
    expect(res.body.address1).toBe('123')
    expect(res.body.address2).toBe('apt')
    expect(res.body.city).toBe('C')
    expect(res.body.state).toBe('ST')
    expect(res.body.postalCode).toBe('000')
    expect(res.body.country).toBe('US')
    expect(res.body.instructions).toBe('n/a')
  })
})
