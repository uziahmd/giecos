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

export function sendAdminOrderNotification(
  order: {
    id: string
    items: { productId: string; quantity: number; price: number }[]
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    secondaryPhone?: string | null
    address1?: string | null
    address2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    instructions?: string | null
  },
  adminEmail: string,
) {
  const shipping = [
    `${order.firstName ?? ''} ${order.lastName ?? ''}`.trim(),
    order.address1,
    order.address2,
    [order.city, order.state, order.postalCode].filter(Boolean).join(' '),
    order.country,
    order.phone ? `Phone: ${order.phone}` : undefined,
    order.secondaryPhone ? `Secondary: ${order.secondaryPhone}` : undefined,
    order.instructions ? `Instructions: ${order.instructions}` : undefined,
  ]
    .filter(Boolean)
    .join('<br>')

  const items = order.items
    .map(
      (it) =>
        `<li>${it.quantity} x ${it.productId} - $${(
          it.price * it.quantity
        ).toFixed(2)}</li>`,
    )
    .join('')

  const total = order.items.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0,
  )

  const html = `
    <p>Order ID: <strong>${order.id}</strong></p>
    <h3>Shipping Details</h3>
    <p>${shipping}</p>
    <h3>Items</h3>
    <ul>${items}</ul>
    <p>Total: <strong>$${total.toFixed(2)}</strong></p>
  `

  return sendMail({
    to: adminEmail,
    subject: `Order ${order.id} paid`,
    html,
  })
}
