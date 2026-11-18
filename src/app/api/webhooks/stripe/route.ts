import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { query } from '@/lib/turso'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Idempotency: track processed stripe event ids in a simple in-memory set
// (for production, persist these in Turso)
const processedEvents = new Set<string>()

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_test',
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    )
  }

  // Idempotency: skip already-processed events
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }
      default:
        // ignore
    }

    processedEvents.add(event.id)
    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Webhook handler failed: ${message}` },
      { status: 500 },
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { id: stripeSessionId, metadata } = session
  const amountTotal = session.amount_total ?? 0
  const currency = (session.currency ?? 'usd').toUpperCase()

  // Idempotency: skip if order already exists for this session
  const existing = await query<{ id: string }>(
    `SELECT id FROM orders WHERE stripe_session_id = ?`,
    [stripeSessionId],
  )
  if (existing.length > 0) return

  const orderId = `order_${Date.now()}`
  const idempotencyKey = `evt_${session.id}`

  await query(
    `INSERT INTO orders (id, auth_user_id, stripe_session_id, status, total, currency, idempotency_key, paid_at)
     VALUES (?, ?, ?, 'paid', ?, ?, ?, datetime('now'))`,
    [
      orderId,
      metadata?.auth_user_id ?? 'guest',
      stripeSessionId,
      amountTotal,
      currency,
      idempotencyKey,
    ],
  )

  // Create enrollment for course purchases
  if (metadata?.course_id && metadata?.auth_user_id) {
    const enrollmentId = `enroll_${Date.now()}`
    await query(
      `INSERT OR IGNORE INTO enrollments (id, auth_user_id, course_id, status, created_at)
       VALUES (?, ?, ?, 'active', datetime('now'))`,
      [enrollmentId, metadata.auth_user_id, metadata.course_id],
    )

    await query(
      `INSERT INTO order_items (id, order_id, product_type, product_id, price)
       VALUES (?, ?, 'course', ?, ?)`,
      [`item_${Date.now()}`, orderId, metadata.course_id, amountTotal],
    )
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const sessionId = paymentIntent.metadata?.checkout_session_id
  if (!sessionId) return
  await query(
    `UPDATE orders SET status = 'failed' WHERE stripe_session_id = ?`,
    [sessionId],
  )
}
