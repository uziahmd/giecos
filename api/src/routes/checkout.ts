import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import stripe from '../lib/stripe'
import { FRONTEND_URL, STRIPE_WEBHOOK_SECRET } from '../env'
import { sendOrderReceipt } from '../lib/mailer'
import Stripe from 'stripe'

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

    let session: Stripe.Checkout.Session | null = null

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

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
        for (const item of items) {
          const product = products.find((p) => p.id === item.id)!
          lineItems.push({
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(product.price * 100),
              product_data: { name: product.name },
            },
            quantity: item.qty,
          })
        }

        session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: lineItems,
          success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${FRONTEND_URL}/cart`,
        })

        await tx.order.create({
          data: {
            userId,
            stripeSessionId: session.id,
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
    return { url: session!.url }
  })

  fastify.post(
    '/stripe/webhook',
    {
      config: { rawBody: true },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const sig = request.headers['stripe-signature'] as string
      const rawBody = (request as FastifyRequest & { rawBody: Buffer }).rawBody
      let event: Stripe.Event
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET as string)
      } catch (err) {
        return reply.code(400).send({ error: 'Invalid signature' })
      }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const order = await fastify.prisma.order.update({
        where: { stripeSessionId: session.id },
        data: { status: 'PAID' },
        include: { items: true, user: true },
      })

      const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )

      await sendOrderReceipt(order.id, order.user.email, total)
    }

    reply.send({ received: true })
  })

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
