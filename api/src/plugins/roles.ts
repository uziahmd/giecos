import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    isAdmin(request: FastifyRequest): boolean
    requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}

const rolesPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('isAdmin', function (request: FastifyRequest) {
    try {
      const token = request.cookies.token
      if (!token) return false
      const payload = fastify.jwt.verify<{ isAdmin?: boolean }>(token)
      return !!payload.isAdmin
    } catch {
      return false
    }
  })

  fastify.decorate(
    'requireAdmin',
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (!fastify.isAdmin(request)) {
        reply.code(403).send({ error: 'Forbidden' })
      }
    },
  )
}

export default fp(rolesPlugin)
