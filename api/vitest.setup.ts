import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { vi } from 'vitest'

const CLI_DB_URL = 'file:./test.db'
const RUNTIME_DB_URL = 'file:/workspace/giecos/api/prisma/test.db'
process.env.DATABASE_URL = CLI_DB_URL
process.env.JWT_SECRET = 'testsecret'
process.env.RESEND_API_KEY = 'test'
process.env.RESEND_FROM = 'test@example.com'
process.env.OTP_EXP_MINUTES = '15'
process.env.FRONTEND_URL = 'http://localhost:5173'
process.env.AIRWALLEX_CLIENT_ID = 'test_id'
process.env.AIRWALLEX_API_KEY = 'test_key'
process.env.AIRWALLEX_WEBHOOK_SECRET = 'whsec_test'
process.env.ALLOW_REFUNDS = 'true'

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ token: 'tok' })
}) as unknown as typeof fetch

if (fs.existsSync('prisma/test.db')) {
  fs.rmSync('prisma/test.db')
}
execSync('pnpm exec prisma migrate deploy --schema=prisma/schema.prisma', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: CLI_DB_URL },
})
execSync('pnpm exec prisma generate --schema=prisma/schema.prisma', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: CLI_DB_URL },
})
process.env.DATABASE_URL = RUNTIME_DB_URL
