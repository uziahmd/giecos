import dotenv from 'dotenv'

dotenv.config()

const { DATABASE_URL, JWT_SECRET, PORT } = process.env

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

export { DATABASE_URL, JWT_SECRET, PORT }
