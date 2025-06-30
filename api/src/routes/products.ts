import { FastifyPluginAsync } from 'fastify'

const productsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return fastify.prisma.product.findMany()
  })
}

export default productsRoutes
