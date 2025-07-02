import dotenv from 'dotenv'

dotenv.config()

const {
  DATABASE_URL,
  JWT_SECRET,
  RESEND_API_KEY,
  RESEND_FROM,
  OTP_EXP_MINUTES,
  AIRWALLEX_CLIENT_ID,
  AIRWALLEX_API_KEY,
  AIRWALLEX_WEBHOOK_SECRET,
  FRONTEND_URL,
  PORT,
  IMG_BASE: IMG_BASE_RAW,
  ALLOW_REFUNDS: ALLOW_REFUNDS_RAW,
} = process.env

// Defaults and validation
export const IMG_BASE = IMG_BASE_RAW || '/uploads'

if (ALLOW_REFUNDS_RAW && ALLOW_REFUNDS_RAW !== 'true' && ALLOW_REFUNDS_RAW !== 'false') {
  throw new Error('ALLOW_REFUNDS must be "true" or "false"')
}
export const ALLOW_REFUNDS = ALLOW_REFUNDS_RAW === 'true'

if (!DATABASE_URL) throw new Error('DATABASE_URL is required')
if (!JWT_SECRET) throw new Error('JWT_SECRET is required')
if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is required')
if (!RESEND_FROM) throw new Error('RESEND_FROM is required')
if (!OTP_EXP_MINUTES) throw new Error('OTP_EXP_MINUTES is required')
if (!AIRWALLEX_CLIENT_ID) throw new Error('AIRWALLEX_CLIENT_ID is required')
if (!AIRWALLEX_API_KEY) throw new Error('AIRWALLEX_API_KEY is required')
if (!AIRWALLEX_WEBHOOK_SECRET) throw new Error('AIRWALLEX_WEBHOOK_SECRET is required')
if (!FRONTEND_URL) throw new Error('FRONTEND_URL is required')

export {
  DATABASE_URL,
  JWT_SECRET,
  RESEND_API_KEY,
  RESEND_FROM,
  OTP_EXP_MINUTES,
  AIRWALLEX_CLIENT_ID,
  AIRWALLEX_API_KEY,
  AIRWALLEX_WEBHOOK_SECRET,
  FRONTEND_URL,
  PORT,
}
