import nodemailer from 'nodemailer'
import { query } from '@/lib/turso'

/**
 * Email delivery (M8). SMTP when configured; otherwise an auditable dev outbox
 * in the `email_log` table. Every call is recorded so journeys can be verified
 * without production credentials.
 */
export interface MailInput { to: string; subject: string; html: string; template: string }

export async function sendEmail(input: MailInput): Promise<{ delivered: boolean; id: string }> {
  const id = `mail_${crypto.randomUUID()}`
  let delivered = false
  const host = process.env.SMTP_HOST
  if (host && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      const transport = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      })
      await transport.sendMail({
        from: process.env.SMTP_FROM || 'Lena Learning <no-reply@lena.local>',
        to: input.to, subject: input.subject, html: input.html,
      })
      delivered = true
    } catch (err) {
      console.error('[email] SMTP delivery failed:', err)
    }
  }
  await query(
    `INSERT INTO email_log (to_addr, template, subject, status, driver, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [input.to, input.template, input.subject, delivered ? 'sent' : 'outbox', delivered ? 'smtp' : 'outbox'],
  ).catch(() => {})
  return { delivered, id }
}

const wrap = (title: string, body: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#14213d">
     <h1 style="font-size:20px">${title}</h1>${body}
     <p style="font-size:12px;color:#667">Lena Learning · ${new Date().getFullYear()}</p>
   </div>`

export const templates = {
  receipt: (name: string, orderId: string, amount: string) => ({
    subject: `Your Lena Learning receipt (${orderId})`,
    html: wrap('Payment received', `<p>Hi ${name},</p><p>We received your payment of <strong>${amount}</strong>. Your order <strong>${orderId}</strong> is confirmed and your access is active.</p>`),
    template: 'receipt',
  }),
  lead: (name: string, slug: string) => ({
    subject: 'Your free download from Lena Learning',
    html: wrap('Your download is ready', `<p>Hi ${name},</p><p>Thanks for requesting <strong>${slug}</strong>. Your download link is attached to this request in your account library.</p>`),
    template: 'lead-delivery',
  }),
  booking: (name: string, when: string) => ({
    subject: 'Your coaching session is booked',
    html: wrap('Session confirmed', `<p>Hi ${name},</p><p>Your 1-on-1 session is scheduled for <strong>${when}</strong>. A calendar invite (.ics) is available in your dashboard.</p>`),
    template: 'booking',
  }),
  webinar: (name: string, title: string) => ({
    subject: `You're registered: ${title}`,
    html: wrap('Webinar registration', `<p>Hi ${name},</p><p>You're registered for <strong>${title}</strong>. Add the event to your calendar from your dashboard.</p>`),
    template: 'webinar',
  }),
}
