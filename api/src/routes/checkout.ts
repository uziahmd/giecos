import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import stripe from '../lib/stripe'
import { FRONTEND_URL, STRIPE_WEBHOOK_SECRET } from '../env'
import { sendOrderReceipt } from '../lib/mailer'
import Stripe from 'stripe'

const checkoutRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/checkout', { preHandler: fastify.authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      items: z.array(z.object({ id: z.string(), qty: z.number() })),
    })

    const { items } = bodySchema.parse(request.body)
    const productIds = items.map((i) => i.id)

    const products = await fastify.prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    for (const item of items) {
      const product = products.find((p) => p.id === item.id)
      if (!product) continue
      lineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(product.price * 100),
          product_data: { name: product.name },
        },
        quantity: item.qty,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cart`,
    })

    const userId = (request.user as { id: string }).id
    await fastify.prisma.order.create({
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

    reply.code(200)
    return { url: session.url }
  })

  fastify.post('/stripe/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
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
}

export default checkoutRoutes
