import { join } from 'path'
import { PORT, IMG_BASE } from './env'
import { buildApp } from './app'
import fastifyStatic from 'fastify-static'

const app = buildApp()
app.register(fastifyStatic, {
  root: join(__dirname, '..', '..', IMG_BASE.replace(/^\//, '')),
  prefix: IMG_BASE,
})

const port = PORT ? parseInt(PORT, 10) : 4000

app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`Server listening on ${port}`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
