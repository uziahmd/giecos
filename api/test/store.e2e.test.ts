import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { createHmac } from 'node:crypto'
import request from 'supertest'
import { buildApp } from '../src/app'

let app: ReturnType<typeof buildApp>
let fetchMock: vi.Mock
import { sendAdminOrderNotification, sendOrderReceipt } from '../src/lib/mailer'

vi.mock('../src/lib/airwallex', () => ({
  getAirwallexToken: vi.fn().mockResolvedValue('tok'),
}))

beforeAll(() => {
  fetchMock = vi.fn()
  global.fetch = fetchMock as unknown as typeof fetch
})

vi.mock('../src/lib/mailer', () => ({
  sendOrderReceipt: vi.fn(() => Promise.resolve()),
  sendAdminOrderNotification: vi.fn(() => Promise.resolve()),
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
      .send({
        name: 'Test',
        price: 1,
        description: 'd',
        category: 'c',
        slug: 'test-admin',
        stock: 5,
      })
      .expect(201)

    expect(res.body.id).toBeDefined()
  })

  it('returns 403 for non admin', async () => {
    const token = app.jwt.sign({ id: 'user', isAdmin: false })
    await request(app.server)
      .post('/api/products')
      .set('Cookie', `token=${token}`)
      .send({
        name: 'Fail',
        price: 1,
        description: 'd',
        category: 'c',
        slug: 'test-guest',
        stock: 5,
      })
      .expect(403)
  })

  it('checkout marks order as paid', async () => {
    const user = await app.prisma.user.create({ data: { email: 'shopper@example.com', password: 'x' } })
    const product = await app.prisma.product.create({
      data: { name: 'Item', price: 2, description: 'd', category: 'c', slug: 'item', images: [], stock: 5 },
    })
    const token = app.jwt.sign({ id: user.id, isAdmin: user.isAdmin })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'pi_1', client_secret: 'secret' }),
    })
    const webhookBody = JSON.stringify({ type: 'payment_intent.succeeded', data: { id: 'pi_1' } })

    const res = await request(app.server)
      .post('/api/checkout')
      .set('Cookie', `token=${token}`)
      .send({
        items: [{ id: product.id, qty: 1 }],
        orderNumber: 'ORD-1',
        firstName: 'A',
        lastName: 'B',
        phone: '111',
        secondaryPhone: '222',
        address1: 'addr1',
        address2: 'addr2',
        city: 'City',
        state: 'ST',
        postalCode: '12345',
        country: 'US',
        instructions: 'none',
      })
      .expect(200)

    expect(res.body.id).toBe('pi_1')

    await request(app.server)
      .post('/api/airwallex/webhook')
      .set('awx-signature', createHmac('sha256', 'whsec_test').update(webhookBody).digest('hex'))
      .set('Content-Type', 'application/json')
      .send(webhookBody)
      .expect(200)

    const order = await app.prisma.order.findFirst({ where: { paymentIntentId: 'pi_1' } })
    expect(order?.status).toBe('PAID')
    expect(order?.orderNumber).toBe('ORD-1')
    expect(order?.firstName).toBe('A')
    expect(order?.address1).toBe('addr1')
    expect((sendAdminOrderNotification as unknown as vi.Mock).mock.calls.length).toBe(1)
    const [calledOrder, adminEmail] = (sendAdminOrderNotification as unknown as vi.Mock).mock.calls[0]
    expect(calledOrder.id).toBe(order?.id)
    expect(adminEmail).toBe('admin@example.com')
  })

  it('rejects checkout with invalid quantity', async () => {
    const user = await app.prisma.user.create({ data: { email: 'bad@example.com', password: 'x' } })
    const product = await app.prisma.product.create({
      data: { name: 'BadItem', price: 1, description: 'd', category: 'c', slug: 'bad', images: [], stock: 5 },
    })
    const token = app.jwt.sign({ id: user.id, isAdmin: user.isAdmin })

    await request(app.server)
      .post('/api/checkout')
      .set('Cookie', `token=${token}`)
      .send({
        items: [{ id: product.id, qty: 0 }],
        orderNumber: 'ORD-2',
        firstName: 'Bad',
        lastName: 'User',
        phone: '999',
        address1: 'addr',
        city: 'C',
        state: 'ST',
        postalCode: '123',
        country: 'US',
      })
      .expect(400)
  })
})
