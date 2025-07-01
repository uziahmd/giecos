import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'

import { PORT, JWT_SECRET } from './env'
import prismaPlugin from './plugins/prisma'
import productsRoutes from './routes/products'
import authRoutes from './routes/auth'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: 'http://localhost:8080',
  credentials: true,
})
app.register(cookie)
if (JWT_SECRET) {
  app.register(jwt, { secret: JWT_SECRET })
}
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

const port = PORT ? parseInt(PORT, 10) : 4000

app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`Server listening on ${port}`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
