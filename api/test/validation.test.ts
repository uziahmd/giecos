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

describe('input validation', () => {
  it('returns 400 for invalid signup', async () => {
    await request(app.server)
      .post('/api/signup')
      .send({ email: 'bad', password: 'secret' })
      .expect(400)
  })

  it('returns 400 for invalid login body', async () => {
    await request(app.server)
      .post('/api/login')
      .send({ email: 'bad', password: 123 })
      .expect(400)
  })

  it('returns 400 for invalid product create', async () => {
    const token = app.jwt.sign({ id: 'admin', isAdmin: true })
    await request(app.server)
      .post('/api/products')
      .set('Cookie', `token=${token}`)
      .send({ name: 'p', price: 'x' })
      .expect(400)
  })

  it('returns 400 for empty product update', async () => {
    const product = await app.prisma.product.create({
      data: { name: 'p', price: 1, description: 'd', category: 'c', slug: 'p', images: [] },
    })
    const token = app.jwt.sign({ id: 'admin', isAdmin: true })
    await request(app.server)
      .patch(`/api/products/${product.id}`)
      .set('Cookie', `token=${token}`)
      .send({})
      .expect(400)
  })
})
