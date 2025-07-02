import { describe, it, beforeAll, expect, vi } from 'vitest'
import request from 'supertest'
import { buildApp } from '../src/app'

vi.mock('sharp', () => ({
  default: () => ({ resize: () => ({ jpeg: () => ({ toFile: vi.fn() }) }) })
}))

let app: ReturnType<typeof buildApp>

beforeAll(async () => {
  app = buildApp()
  await app.listen({ port: 0 })
})

describe('upload image', () => {
  it('returns url', async () => {
    const res = await request(app.server)
      .post('/api/products/upload')
      .attach('image', Buffer.from('test'), 'a.png')
      .expect(200)
    expect(res.body.url).toContain('/uploads/')
  })
})
