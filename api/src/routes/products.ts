import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import multer from 'fastify-multer'
import sharp from 'sharp'
import { join } from 'path'
import { IMG_BASE } from '../env'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

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
      const file = (request as FastifyRequest & { file?: Express.Multer.File }).file
      if (!file) {
        reply.code(400)
        return { error: 'No file uploaded' }
      }
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        reply.code(400)
        return { error: 'Invalid file type' }
      }
      if (file.size > MAX_FILE_SIZE) {
        reply.code(400)
        return { error: 'File too large' }
      }
      const name = `${Date.now()}_${file.originalname}.jpg`
      const filepath = join(
        __dirname,
        '..',
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
        stock: z.number(),
      })

      const parsed = bodySchema.safeParse(request.body)
      if (!parsed.success) {
        const msg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        return reply.code(400).send({ error: msg })
      }
      const {
        name,
        price,
        description,
        images,
        inStock,
        category,
        slug,
        stock,
      } = parsed.data

      const product = await fastify.prisma.product.create({
        data: {
          name,
          price,
          description,
          images,
          inStock,
          category,
          slug,
          stock,
        },
      })
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
          stock: z.number().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
          message: 'No fields to update',
        })

      const paramsParsed = paramsSchema.safeParse(request.params)
      if (!paramsParsed.success) {
        const msg = paramsParsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        return reply.code(400).send({ error: msg })
      }
      const bodyParsed = bodySchema.safeParse(request.body)
      if (!bodyParsed.success) {
        const msg = bodyParsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        return reply.code(400).send({ error: msg })
      }
      const { id } = paramsParsed.data
      const {
        name,
        price,
        description,
        images,
        inStock,
        category,
        slug,
        stock,
      } = bodyParsed.data
      const product = await fastify.prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          description,
          images,
          inStock,
          category,
          slug,
          stock,
        },
      })
      return product
    },
  )

  fastify.delete(
    '/:id',
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({ id: z.string() })
      const parsed = paramsSchema.safeParse(request.params)
      if (!parsed.success) {
        const msg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        return reply.code(400).send({ error: msg })
      }
      const { id } = parsed.data
      await fastify.prisma.product.delete({ where: { id } })
      reply.code(204)
    },
  )
}

export default productsRoutes
