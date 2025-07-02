import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import rawBody from '@fastify/raw-body'

import { JWT_SECRET, FRONTEND_URL } from './env'
import prismaPlugin from './plugins/prisma'
import rolesPlugin from './plugins/roles'
import productsRoutes from './routes/products'
import authRoutes from './routes/auth'
import checkoutRoutes from './routes/checkout'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}

export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: FRONTEND_URL,
    credentials: true,
  })
  app.register(cookie)
  if (JWT_SECRET) {
    app.register(jwt, { secret: JWT_SECRET })
    app.register(rolesPlugin)
  }
  app.register(rateLimit, { global: false })
  app.register(rawBody, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
  })
  app.register(prismaPlugin)

  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.cookies.token
      request.user = (this as typeof app).jwt.verify(token)
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' })
    }
  })

  app.register(productsRoutes, { prefix: '/api/products' })
  app.register(authRoutes, { prefix: '/api' })
  app.register(checkoutRoutes, { prefix: '/api' })

  return app
}
