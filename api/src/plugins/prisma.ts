import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient()
  await prisma.$connect()
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (app) => {
    await app.prisma.$disconnect()
  })
}

export default fp(prismaPlugin)
