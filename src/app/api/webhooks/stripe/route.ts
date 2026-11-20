import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { query } from '@/lib/turso'
import { fulfillOrder, refundOrder, claimEvent } from '@/lib/commerce'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Stripe webhook (M7). Signature-verified with a REQUIRED secret (fail closed —
 * no fallback constant, audit E3). Idempotency persisted in Turso
 * (processed_events, insert-first claim). Fulfilment is driven by the order id
 * written into the session metadata at checkout — never by client amounts.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    // Misconfiguration must never silently accept forged events.
    return NextResponse.json({ error: 'Webhook endpoint is not configured (STRIPE_WEBHOOK_SECRET missing).' }, { status: 500 })
  }
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'No stripe-signature header' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'unknown'}` }, { status: 400 })
  }

  if (!(await claimEvent(event.id))) return NextResponse.json({ received: true, duplicate: true })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        if (orderId) {
          const pi = session.payment_intent
          const piId = typeof pi === 'string' ? pi : pi?.id ?? null
          await query('UPDATE orders SET stripe_session_id = ?, payment_intent_id = ? WHERE id = ?', [session.id, piId, orderId])
          const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null
          await fulfillOrder(orderId, { subscriptionId: subId })
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const orderId = pi.metadata?.orderId
        if (orderId) await query(`UPDATE orders SET status = 'failed' WHERE id = ? AND status = 'pending'`, [orderId])
        break
      }
      case 'invoice.paid': {
        // Subscription renewal: extend the matching membership by its tier interval.
        const invoice = event.data.object as Stripe.Invoice
        const inv = invoice as unknown as { subscription?: string | { id: string } }
        const sub = inv.subscription
        const subId = typeof sub === 'string' ? sub : sub?.id
        if (subId) {
          const rows = await query<any>(
            `SELECT m.*, t.interval AS tier_interval FROM memberships m
             LEFT JOIN membership_tiers t ON t.id = m.tier_id
             WHERE m.stripe_subscription_id = ? LIMIT 1`,
            [subId],
          )
          const m = rows[0]
          if (m) {
            const days = m.tier_interval === 'year' ? 365 : 30
            const base = new Date(Math.max(Date.now(), new Date(m.ends_at).getTime()))
            await query(
              `UPDATE memberships SET ends_at = ?, status = 'active', cancel_at_period_end = 0 WHERE id = ?`,
              [new Date(base.getTime() + days * 86400_000).toISOString(), m.id],
            )
          }
        }
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const inv = invoice as unknown as { subscription?: string | { id: string } }
        const sub = inv.subscription
        const subId = typeof sub === 'string' ? sub : sub?.id
        if (subId) await query(`UPDATE memberships SET status = 'past_due' WHERE stripe_subscription_id = ?`, [subId])
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await query(`UPDATE memberships SET status = 'cancelled', auto_renew = 0 WHERE stripe_subscription_id = ?`, [sub.id])
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const pi = charge.payment_intent
        const piId = typeof pi === 'string' ? pi : pi?.id
        // Primary path: order's stored payment_intent_id (written at checkout).
        let rows = piId
          ? await query<{ id: string }>('SELECT id FROM orders WHERE payment_intent_id = ? LIMIT 1', [piId])
          : []
        // Back-compat path: order id stamped on the PaymentIntent's metadata.
        if (!rows.length) {
          const piObj = typeof pi === 'object' && pi ? (pi as Stripe.PaymentIntent) : null
          const orderId = piObj?.metadata?.orderId
          if (orderId) rows = [{ id: orderId }]
        }
        for (const order of rows) await refundOrder(order.id)
        break
      }
      default:
        break
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: `Webhook handler failed: ${err instanceof Error ? err.message : 'unknown'}` }, { status: 500 })
  }
}