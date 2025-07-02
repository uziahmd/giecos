import { describe, it, beforeAll, expect } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'

let app: ReturnType<typeof buildApp>
let userId: string
let productId: string
let token: string

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
  const user = await app.prisma.user.create({ data: { email: 'cancel@example.com', password: 'x' } })
  userId = user.id
  const product = await app.prisma.product.create({ data: { name: 'cprod', price: 1, description: 'd', category: 'c', slug: 'cprod', images: [], stock: 1 } })
  productId = product.id
  await app.prisma.order.create({
    data: {
      id: 'oc1',
      userId,
      status: 'PENDING',
      items: { create: { productId, quantity: 1, price: 1 } },
    },
  })
  await app.prisma.product.update({ where: { id: productId }, data: { stock: 0 } })
  token = app.jwt.sign({ id: userId, isAdmin: false })
})

describe('cancel order', () => {
  it('updates status and restocks inventory', async () => {
    await request(app.server)
      .post('/api/orders/oc1/cancel')
      .set('Cookie', `token=${token}`)
      .expect(200)
    const order = await app.prisma.order.findUnique({ where: { id: 'oc1' } })
    expect(order?.status).toBe('CANCELLED')
    const product = await app.prisma.product.findUnique({ where: { id: productId } })
    expect(product?.stock).toBe(1)
  })
})
