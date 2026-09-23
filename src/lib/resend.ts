import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

export async function sendInquiryNotification({
  customerName,
  email,
  phone,
  message,
  productNames,
}: {
  customerName: string
  email: string
  phone: string
  message?: string
  productNames: string[]
}) {
  if (!process.env.RESEND_API_KEY || !resend) {
    console.warn('RESEND_API_KEY is not set. Email notification skipped.')
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: adminEmail,
    subject: `Yeni Teklif Talebi - ${customerName}`,
    html: `
      <h2>Yeni Teklif Talebi</h2>
      <p><strong>Müşteri:</strong> ${customerName}</p>
      <p><strong>E-posta:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      ${message ? `<p><strong>Mesaj:</strong> ${message}</p>` : ''}
      <h3>İlgilenilen Ürünler:</h3>
      <ul>
        ${productNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `,
  })
}
