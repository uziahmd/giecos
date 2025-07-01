import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'

let app: ReturnType<typeof buildApp>
let sentCode = ''

vi.mock('../src/lib/mailer', () => ({
  sendOtpEmail: vi.fn((email: string, code: string) => {
    sentCode = code
    return Promise.resolve()
  }),
  sendWelcomeEmail: vi.fn(() => Promise.resolve()),
}))

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
})

afterAll(async () => {
  await app.close()
})

describe('signup verify flow', () => {
  it('signup -> verify -> me', async () => {
    const signup = await request(app.server)
      .post('/api/signup')
      .send({ name: 'Test', email: 'test@example.com', password: 'secret' })
      .expect(200)

    expect(sentCode).toMatch(/^\d{6}$/)

    const verify = await request(app.server)
      .post('/api/otp/verify')
      .send({ email: 'test@example.com', code: sentCode })
      .expect(200)

    const cookie = Array.isArray(verify.headers['set-cookie'])
      ? verify.headers['set-cookie'][0]
      : verify.headers['set-cookie']
    const tokenCookie = cookie.split(';')[0]

    const me = await request(app.server)
      .get('/api/me')
      .set('Cookie', tokenCookie)
      .expect(200)

    expect(me.body.email).toBe('test@example.com')
  })
})
