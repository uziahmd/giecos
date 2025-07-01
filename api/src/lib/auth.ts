import bcrypt from 'bcrypt'
import { customAlphabet } from 'nanoid'
import { OTP_EXP_MINUTES } from '../env'

const otpNanoid = customAlphabet('0123456789', 6)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateOtp(): string {
  return otpNanoid()
}

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 10)
}

export async function compareOtp(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash)
}

export function otpExpiry(minutes = parseInt(OTP_EXP_MINUTES as string, 10)): Date {
  const exp = new Date()
  exp.setMinutes(exp.getMinutes() + minutes)
  return exp
}

export function isOtpValid(expiry: Date): boolean {
  return expiry.getTime() > Date.now()
}
