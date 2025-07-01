import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import {
  hashPassword,
  comparePassword,
  generateOtp,
  hashOtp,
  compareOtp,
  otpExpiry,
  isOtpValid,
} from '../lib/auth'
import { sendOtpEmail, sendWelcomeEmail } from '../lib/mailer'

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
}

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/signup', async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
    const { name, email, password } = bodySchema.parse(request.body)

    const existing = await fastify.prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.code(400).send({ error: 'Email already in use' })
    }

    const passwordHash = await hashPassword(password)
    const code = generateOtp()
    const otpHash = await hashOtp(code)
    const expiry = otpExpiry()

    const user = await fastify.prisma.user.create({
      data: { name, email, password: passwordHash, otpHash, otpExpiry: expiry },
    })

    await sendOtpEmail(email, code)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    }
  })

  fastify.post('/otp/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      code: z.string(),
    })
    const { email, code } = bodySchema.parse(request.body)

    const user = await fastify.prisma.user.findUnique({ where: { email } })
    if (!user || !user.otpHash || !user.otpExpiry) {
      return reply.code(400).send({ error: 'Invalid code' })
    }

    const isValid = await compareOtp(code, user.otpHash)
    if (!isValid || !isOtpValid(user.otpExpiry)) {
      return reply.code(400).send({ error: 'Invalid code' })
    }

    await fastify.prisma.user.update({
      where: { id: user.id },
      data: { otpHash: null, otpExpiry: null },
    })
    await sendWelcomeEmail(email)
    const token = fastify.jwt.sign({ id: user.id })
    reply.setCookie('token', token, cookieOptions)
    return { success: true }
  })

  fastify.post(
    '/otp/resend',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 hour',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const bodySchema = z.object({ email: z.string().email() })
      const { email } = bodySchema.parse(request.body)

      const user = await fastify.prisma.user.findUnique({ where: { email } })
      if (!user || !user.otpHash || !user.otpExpiry) {
        return reply.code(400).send({ error: 'Cannot resend code' })
      }

      const code = generateOtp()
      const otpHash = await hashOtp(code)
      const expiry = otpExpiry()

      await fastify.prisma.user.update({
        where: { id: user.id },
        data: { otpHash, otpExpiry: expiry },
      })

      await sendOtpEmail(email, code)
      return { success: true }
    },
  )

  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })
    const { email, password } = bodySchema.parse(request.body)

    const user = await fastify.prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.code(401).send({ error: 'Invalid email or password' })
    }

    const match = await comparePassword(password, user.password)
    if (!match) {
      return reply.code(401).send({ error: 'Invalid email or password' })
    }

    const token = fastify.jwt.sign({ id: user.id })
    reply.setCookie('token', token, cookieOptions)
    return { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }
  })

  fastify.get('/me', { preHandler: fastify.authenticate }, async (request: FastifyRequest) => {
    const userId = (request.user as { id: string }).id
    return fastify.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, isAdmin: true },
    })
  })
}

export default authRoutes
