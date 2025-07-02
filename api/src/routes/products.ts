import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import multer from 'fastify-multer'
import sharp from 'sharp'
import { join } from 'path'
import { IMG_BASE } from '../env'

const productsRoutes: FastifyPluginAsync = async (fastify) => {
  const upload = multer({ storage: multer.memoryStorage() })
  fastify.register(multer.contentParser)

  fastify.get('/', async () => {
    return fastify.prisma.product.findMany()
  })

  fastify.post(
    '/upload',
    { preHandler: upload.single('image') },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const file = (request as any).file as Express.Multer.File | undefined
      if (!file) {
        reply.code(400)
        return { error: 'No file uploaded' }
      }
      const name = `${Date.now()}_${file.originalname}.jpg`
      const filepath = join(
        __dirname,
        '..',
        '..',
        IMG_BASE.replace(/^\//, ''),
        name,
      )
      await sharp(file.buffer).resize(800).jpeg().toFile(filepath)
      return { url: `${IMG_BASE}/${name}` }
    },
  )

  fastify.post(
    '/',
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const bodySchema = z.object({
        name: z.string(),
        price: z.number(),
        description: z.string(),
        images: z.array(z.string()).optional(),
        inStock: z.boolean().optional(),
        category: z.string(),
        slug: z.string(),
      })

      const data = bodySchema.parse(request.body)
      const product = await fastify.prisma.product.create({ data })
      reply.code(201)
      return product
    },
  )

  fastify.patch(
    '/:id',
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({ id: z.string() })
      const bodySchema = z
        .object({
          name: z.string().optional(),
          price: z.number().optional(),
          description: z.string().optional(),
          images: z.array(z.string()).optional(),
          inStock: z.boolean().optional(),
          category: z.string().optional(),
          slug: z.string().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
          message: 'No fields to update',
        })

      const { id } = paramsSchema.parse(request.params)
      const data = bodySchema.parse(request.body)
      const product = await fastify.prisma.product.update({
        where: { id },
        data,
      })
      return product
    },
  )

  fastify.delete(
    '/:id',
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({ id: z.string() })
      const { id } = paramsSchema.parse(request.params)
      await fastify.prisma.product.delete({ where: { id } })
      reply.code(204)
    },
  )
}

export default productsRoutes
