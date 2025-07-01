import { execSync } from 'node:child_process'
import fs from 'node:fs'

process.env.DATABASE_URL = 'file:./test.db'
process.env.JWT_SECRET = 'testsecret'
process.env.RESEND_API_KEY = 'test'
process.env.RESEND_FROM = 'test@example.com'
process.env.OTP_EXP_MINUTES = '15'

if (fs.existsSync('api/prisma/test.db')) {
  fs.rmSync('api/prisma/test.db')
}
execSync('pnpm exec prisma migrate deploy --schema=api/prisma/schema.prisma', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: 'file:./test.db' },
})
