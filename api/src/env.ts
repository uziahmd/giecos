import dotenv from 'dotenv'

dotenv.config()

const {
  DATABASE_URL,
  JWT_SECRET,
  RESEND_API_KEY,
  RESEND_FROM,
  OTP_EXP_MINUTES,
  PORT,
} = process.env

if (!DATABASE_URL) throw new Error('DATABASE_URL is required')
if (!JWT_SECRET) throw new Error('JWT_SECRET is required')
if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is required')
if (!RESEND_FROM) throw new Error('RESEND_FROM is required')
if (!OTP_EXP_MINUTES) throw new Error('OTP_EXP_MINUTES is required')

export {
  DATABASE_URL,
  JWT_SECRET,
  RESEND_API_KEY,
  RESEND_FROM,
  OTP_EXP_MINUTES,
  PORT,
}
