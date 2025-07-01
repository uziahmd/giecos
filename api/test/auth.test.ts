import { describe, expect, it, beforeAll } from 'vitest'
import {
  hashPassword,
  comparePassword,
  generateOtp,
  hashOtp,
  compareOtp,
  otpExpiry,
  isOtpValid,
} from '../src/lib/auth'

process.env.OTP_EXP_MINUTES = '15'

describe('auth utilities', () => {
  it('hashPassword and comparePassword roundtrip', async () => {
    const hash = await hashPassword('secret')
    expect(hash).not.toBe('secret')
    const result = await comparePassword('secret', hash)
    expect(result).toBe(true)
  })

  it('generateOtp returns 6 digit numeric string', () => {
    const code = generateOtp()
    expect(code).toMatch(/^\d{6}$/)
  })

  it('hashOtp and compareOtp roundtrip', async () => {
    const code = generateOtp()
    const hash = await hashOtp(code)
    const result = await compareOtp(code, hash)
    expect(result).toBe(true)
  })

  it('otpExpiry returns future date and isOtpValid works', () => {
    const exp = otpExpiry(1)
    expect(exp.getTime()).toBeGreaterThan(Date.now())
    expect(isOtpValid(exp)).toBe(true)
  })

  it('isOtpValid returns false for past date', () => {
    const past = new Date(Date.now() - 1000)
    expect(isOtpValid(past)).toBe(false)
  })
})
