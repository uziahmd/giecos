import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { AIRWALLEX_WEBHOOK_SECRET } from '../env'
import { createHmac } from 'node:crypto'
import { getAirwallexToken } from '../lib/airwallex'
import { sendOrderReceipt } from '../lib/mailer'

const checkoutRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/checkout', { preHandler: fastify.authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      items: z.array(
        z.object({
          id: z.string(),
          qty: z.number().min(1),
        }),
      ),
    })

    const parsed = bodySchema.safeParse(request.body)
    if (!parsed.success) {
      reply.code(400)
      return { error: 'Invalid request body' }
    }
    const { items } = parsed.data
    const productIds = items.map((i) => i.id)
    const userId = (request.user as { id: string }).id

    let paymentIntent: { id: string; client_secret: string } | null = null

    try {
      await fastify.prisma.$transaction(async (tx) => {
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        })

        for (const item of items) {
          const product = products.find((p) => p.id === item.id)
          if (!product) {
            throw new Error('Product not found')
          }
          const updated = await tx.product.updateMany({
            where: { id: item.id, stock: { gte: item.qty } },
            data: { stock: { decrement: item.qty } },
          })
          if (updated.count === 0) {
            throw new Error(`Insufficient stock for ${product.name}`)
          }
        }

        const token = await getAirwallexToken()
        const total = items.reduce((sum, it) => {
          const p = products.find((pp) => pp.id === it.id)!
          return sum + p.price * it.qty
        }, 0)
        const resp = await fetch(
          'https://api.airwallex.com/api/v1/pa/payment_intents/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: Math.round(total * 100),
              currency: 'USD',
            }),
          },
        )
        if (!resp.ok) throw new Error('Failed creating payment intent')
        paymentIntent = (await resp.json()) as {
          id: string
          client_secret: string
        }

        await tx.order.create({
          data: {
            userId,
            paymentIntentId: paymentIntent.id,
            status: 'PENDING',
            items: {
              create: items.map((it) => {
                const product = products.find((p) => p.id === it.id)!
                return {
                  productId: it.id,
                  quantity: it.qty,
                  price: product.price,
                }
              }),
            },
          },
        })
      })
    } catch (err) {
      reply.code(400)
      return { error: (err as Error).message }
    }

    reply.code(200)
    return { id: paymentIntent!.id, client_secret: paymentIntent!.client_secret }
  })

  fastify.post(
    '/airwallex/webhook',
    {
      config: { rawBody: true },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const sig = request.headers['awx-signature'] as string
      const raw = (request as FastifyRequest & { rawBody: string }).rawBody
      const hmac = createHmac('sha256', AIRWALLEX_WEBHOOK_SECRET as string)
        .update(raw)
        .digest('hex')
      if (sig !== hmac) {
        return reply.code(400).send({ error: 'Invalid signature' })
      }

      const event = JSON.parse(raw) as { type: string; data: { id: string } }
      if (event.type === 'payment_intent.succeeded') {
        const intent = event.data
        const order = await fastify.prisma.order.update({
          where: { paymentIntentId: intent.id },
          data: { status: 'PAID' },
          include: { items: true, user: true },
        })
        const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        await sendOrderReceipt(order.id, order.user.email, total)
      } else if (event.type === 'payment_intent.failed') {
        await fastify.prisma.order.update({
          where: { paymentIntentId: event.data.id },
          data: { status: 'CANCELLED' },
        })
      }

      reply.send({ received: true })
    },
  )

  fastify.get('/orders/latest', { preHandler: fastify.authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { id: string }).id
    const order = await fastify.prisma.order.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    })

    if (!order) {
      reply.code(404)
      return { error: 'No orders found' }
    }

    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return { id: order.id, items: order.items, total }
  })
}

export default checkoutRoutes
