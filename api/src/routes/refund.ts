import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ALLOW_REFUNDS } from '../env'
import { getAirwallexToken } from '../lib/airwallex'

const refundRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/api/orders/:id/refund',
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!ALLOW_REFUNDS) {
        reply.code(404)
        return { error: 'Refunds disabled' }
      }

      const paramsSchema = z.object({ id: z.string() })
      const parsed = paramsSchema.safeParse(request.params)
      if (!parsed.success) {
        const msg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        return reply.code(400).send({ error: msg })
      }
      const { id } = parsed.data

      const order = await fastify.prisma.order.findUnique({
        where: { id },
        include: { items: true },
      })

      if (!order || order.status !== 'PAID' || !order.paymentIntentId) {
        reply.code(400)
        return { error: 'Order not refundable' }
      }

      await fastify.prisma.$transaction(async (tx) => {
        const token = await getAirwallexToken()
        await fetch('https://api.airwallex.com/api/v1/pa/refunds/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ payment_intent_id: order.paymentIntentId }),
        })
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        }
        await tx.order.update({ where: { id }, data: { status: 'REFUNDED' } })
      })

      return { status: 'ok' }
    },
  )
}

export default refundRoutes
