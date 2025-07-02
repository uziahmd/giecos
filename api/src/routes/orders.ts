import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

const ordersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/orders', { preHandler: fastify.authenticate }, async (request) => {
    const userId = (request.user as { id: string }).id
    return fastify.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    })
  })

  fastify.get('/orders/:id', { preHandler: fastify.authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const paramsSchema = z.object({ id: z.string() })
    const { id } = paramsSchema.parse(request.params)
    const userId = (request.user as { id: string }).id

    const order = await fastify.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } },
    })

    if (!order) {
      reply.code(404)
      return { error: 'Order not found' }
    }

    return order
  })

  fastify.post('/orders/:id/cancel', { preHandler: fastify.authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const paramsSchema = z.object({ id: z.string() })
    const { id } = paramsSchema.parse(request.params)
    const userId = (request.user as { id: string }).id

    const order = await fastify.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    })

    if (!order || order.status !== 'PENDING') {
      reply.code(400)
      return { error: 'Order not cancellable' }
    }

    await fastify.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }
      await tx.order.update({ where: { id }, data: { status: 'CANCELLED' } })
    })

    return { status: 'ok' }
  })
}

export default ordersRoutes
