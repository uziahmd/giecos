import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'

import { JWT_SECRET } from './env'
import prismaPlugin from './plugins/prisma'
import productsRoutes from './routes/products'
import authRoutes from './routes/auth'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: 'http://localhost:8080',
    credentials: true,
  })
  app.register(cookie)
  if (JWT_SECRET) {
    app.register(jwt, { secret: JWT_SECRET })
  }
  app.register(rateLimit, { global: false })
  app.register(prismaPlugin)

  declare module 'fastify' {
    interface FastifyInstance {
      authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
    }
  }

  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.cookies.token
      await request.jwtVerify({ token })
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' })
    }
  })

  app.register(productsRoutes, { prefix: '/api/products' })
  app.register(authRoutes, { prefix: '/api' })

  return app
}
