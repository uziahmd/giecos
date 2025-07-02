import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import stripe from '../lib/stripe'
import { ALLOW_REFUNDS } from '../env'

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

      if (!order || order.status !== 'PAID' || !order.stripeSessionId) {
        reply.code(400)
        return { error: 'Order not refundable' }
      }

      await fastify.prisma.$transaction(async (tx) => {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId!)
        if (session.payment_intent) {
          await stripe.refunds.create({ payment_intent: session.payment_intent as string })
        }
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
