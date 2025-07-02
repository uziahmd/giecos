import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { sendMail } from '../lib/mailer'
import { RESEND_FROM } from '../env'

const contactRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/contact', async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string(),
    })

    const parsed = bodySchema.safeParse(request.body)
    if (!parsed.success) {
      reply.code(400)
      return { error: 'Invalid request body' }
    }

    const { name, email, message } = parsed.data
    const html = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>${message}</p>
    `

    await sendMail({
      to: RESEND_FROM as string,
      subject: 'Contact form submission',
      html,
    })

    return { success: true }
  })
}

export default contactRoutes
