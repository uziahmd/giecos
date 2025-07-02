import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { RESEND_API_KEY, RESEND_FROM } from '../env'

const resend = new Resend(RESEND_API_KEY as string)

const devTransporter = nodemailer.createTransport({
  jsonTransport: true,
})

export async function sendMail(options: {
  to: string
  subject: string
  html: string
}) {
  if (process.env.NODE_ENV === 'production') {
    return resend.emails.send({
      from: RESEND_FROM as string,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  }

  return devTransporter.sendMail({
    from: RESEND_FROM as string,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

export function sendOtpEmail(email: string, code: string) {
  const html = `<p>Your verification code is <strong>${code}</strong></p>`
  return sendMail({
    to: email,
    subject: 'Your verification code',
    html,
  })
}

export function sendWelcomeEmail(email: string) {
  const html = `<p>Welcome! Your account has been created.</p>`
  return sendMail({
    to: email,
    subject: 'Welcome to Giecos',
    html,
  })
}

export function sendOrderReceipt(orderId: string, email: string, total: number) {
  const html = `
    <p>Thank you for your purchase!</p>
    <p>Order ID: <strong>${orderId}</strong></p>
    <p>Total: <strong>$${total.toFixed(2)}</strong></p>
  `
  return sendMail({
    to: email,
    subject: 'Order receipt',
    html,
  })
}
