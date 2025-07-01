import { PORT } from './env'
import { buildApp } from './app'

const app = buildApp()

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
