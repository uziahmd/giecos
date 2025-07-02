import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest'
import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import rolesPlugin from '../src/plugins/roles'
import request from 'supertest'

let app: ReturnType<typeof Fastify>
const handler = vi.fn()

beforeAll(async () => {
  app = Fastify()
  await app.register(jwt, { secret: 'testsecret' })
  await app.register(rolesPlugin)
  app.get('/admin', { preHandler: app.requireAdmin }, async () => {
    handler()
    return { ok: true }
  })
  await app.listen({ port: 0 })
})

afterAll(async () => {
  await app.close()
})

describe('requireAdmin', () => {
  it('blocks non admin users', async () => {
    const token = app.jwt.sign({ id: 'user', isAdmin: false })
    await request(app.server)
      .get('/admin')
      .set('Cookie', `token=${token}`)
      .expect(403)
    expect(handler).not.toHaveBeenCalled()
  })
})
