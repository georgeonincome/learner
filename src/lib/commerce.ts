import type Stripe from 'stripe'
import { getStripe, getBaseUrl } from '@/lib/stripe'
import { query, insert, getTursoClient } from '@/lib/turso'
import { getPrices } from '@/lib/content'
import crypto from 'node:crypto'

/**
 * Commerce engine (M7). Prices are ALWAYS resolved server-side from the `prices`
 * table — the client never supplies an amount. A pending order is written before
 * the Stripe session is created; the webhook fulfils it by order id (metadata),
 * granting course enrollment / book access / membership. Idempotent throughout.
 */
export type EntityType = 'course' | 'book' | 'program' | 'membership' | 'product'

const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND', 'CLP', 'BIF', 'GNF', 'UGX', 'RWF', 'XAF', 'XOF'])
export function toMinorUnits(amount: number, currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? Math.round(amount) : Math.round(amount * 100)
}

export interface ResolvedPrice {
  priceId: number; amount: number; currency: string; priceType: string
  interval: string | null; intervalCount: number | null; stripePriceId: string | null
}

/** Resolve the server-authoritative price for an entity in a currency. */
export async function resolvePrice(entityType: EntityType, entityId: number, currency?: string): Promise<ResolvedPrice | null> {
  const prices = await getPrices(entityType, entityId)
  if (!prices.length) return null
  const want = (currency ?? '').toUpperCase()
  const row = prices.find((p) => p.currency.toUpperCase() === want) ?? prices.find((p) => p.is_default) ?? prices[0]
  if (!row) return null
  return {
    priceId: row.id, amount: Number(row.price), currency: row.currency.toUpperCase(),
    priceType: row.price_type, interval: row.interval, intervalCount: row.interval_count,
    stripePriceId: row.stripe_price_id,
  }
}

async function applyCoupon(code: string | undefined, amount: number, currency: string): Promise<{ amount: number; code: string | null }> {
  if (!code) return { amount, code: null }
  const rows = await query<any>('SELECT * FROM coupons WHERE code = ? AND active = 1 LIMIT 1', [code])
  const c = rows[0]
  if (!c) return { amount, code: null }
  if (c.expires_at && new Date(c.expires_at) < new Date()) return { amount, code: null }
  if (c.max_redemptions != null && c.redeemed >= c.max_redemptions) return { amount, code: null }
  let next = amount
  if (c.percent_off != null) next = amount * (1 - Number(c.percent_off) / 100)
  else if (c.amount_off != null) next = Math.max(0, amount - Number(c.amount_off))
  return { amount: Math.round(next * 100) / 100, code }
}

export interface CheckoutInput {
  uid: string; entityType: EntityType; entityId: number; currency?: string
  couponCode?: string; successUrl?: string; cancelUrl?: string
}

export async function createCheckout(input: CheckoutInput): Promise<{ url: string; sessionId: string; orderId: string }> {
  const resolved = await resolvePrice(input.entityType, input.entityId, input.currency)
  if (!resolved) throw new Error('This item is not available for purchase.')
  if (resolved.amount <= 0) throw new Error('This item is free — enrol instead of checking out.')
  const { amount, code } = await applyCoupon(input.couponCode, resolved.amount, resolved.currency)
  const minor = toMinorUnits(amount, resolved.currency)

  const orderId = `order_${crypto.randomUUID()}`
  await query(
    `INSERT INTO orders (id, auth_user_id, status, total, currency, idempotency_key, coupon_code, entity_type, entity_id, price_id)
     VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)`,
    [orderId, input.uid, minor, resolved.currency, `chk_${orderId}`, code, input.entityType, input.entityId, resolved.priceId],
  )
  await query(
    `INSERT INTO order_items (id, order_id, product_type, product_id, price) VALUES (?, ?, ?, ?, ?)`,
    [`item_${crypto.randomUUID()}`, orderId, input.entityType, String(input.entityId), minor],
  )

  const isSubscription = resolved.priceType === 'RECURRING' || resolved.interval != null
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = resolved.stripePriceId
    ? { price: resolved.stripePriceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: isSubscription
          ? {
              currency: resolved.currency.toLowerCase(),
              unit_amount: minor,
              recurring: { interval: (resolved.interval as 'month' | 'year') ?? 'month', interval_count: resolved.intervalCount ?? 1 },
              product_data: { name: `${input.entityType} #${input.entityId}` },
            }
          : {
              currency: resolved.currency.toLowerCase(),
              unit_amount: minor,
              product_data: { name: `${input.entityType} #${input.entityId}` },
            },
      }

  const session = await getStripe().checkout.sessions.create({
    mode: isSubscription ? 'subscription' : 'payment',
    line_items: [lineItem],
    success_url: input.successUrl ?? `${getBaseUrl()}/you-have-paid?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: input.cancelUrl ?? `${getBaseUrl()}/courses`,
    client_reference_id: input.uid,
    metadata: { orderId, uid: input.uid, entityType: input.entityType, entityId: String(input.entityId) },
    ...(isSubscription ? {} : { payment_intent_data: { metadata: { orderId, uid: input.uid } } }),
  })
  await query('UPDATE orders SET stripe_session_id = ? WHERE id = ?', [session.id, orderId])
  return { url: session.url!, sessionId: session.id, orderId }
}

/** Fulfil a paid order: grant access by entity type. Idempotent (INSERT OR IGNORE). */
export async function fulfillOrder(orderId: string, opts: { subscriptionId?: string | null } = {}): Promise<void> {
  const rows = await query<any>('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId])
  const order = rows[0]
  if (!order) throw new Error(`Order ${orderId} not found`)
  if (order.status === 'paid') return // already fulfilled
  const uid = order.auth_user_id
  const entityType = order.entity_type as EntityType
  const entityId = Number(order.entity_id)

  if (entityType === 'course' || entityType === 'program') {
    await query(
      `INSERT OR IGNORE INTO enrollments (id, auth_user_id, course_id, status) VALUES (?, ?, ?, 'active')`,
      [`enroll_${crypto.randomUUID()}`, uid, String(entityId)],
    )
    // BUNDLE courses expand into their member courses (reference course_type=BUNDLE).
    const courses = await query<any>('SELECT course_type, bundle_course_ids FROM courses WHERE id = ? LIMIT 1', [entityId])
    const c = courses[0]
    if (c?.course_type === 'BUNDLE') {
      let ids: number[] = []
      try { ids = JSON.parse(c.bundle_course_ids ?? '[]') } catch { ids = [] }
      for (const memberId of ids) {
        await query(
          `INSERT OR IGNORE INTO enrollments (id, auth_user_id, course_id, status) VALUES (?, ?, ?, 'active')`,
          [`enroll_${crypto.randomUUID()}`, uid, String(memberId)],
        )
      }
    }
  } else if (entityType === 'book' || entityType === 'product') {
    await query(
      `INSERT OR IGNORE INTO access_grants (id, auth_user_id, entity_type, entity_id, order_id) VALUES (?, ?, ?, ?, ?)`,
      [`grant_${crypto.randomUUID()}`, uid, entityType, entityId, orderId],
    )
  } else if (entityType === 'membership') {
    const tiers = await query<any>('SELECT * FROM membership_tiers WHERE id = ? LIMIT 1', [entityId])
    const tier = tiers[0]
    const interval = tier?.interval ?? 'month'
    const days = interval === 'year' ? 365 : interval === 'one_time' ? 36500 : 30
    const starts = new Date()
    const ends = new Date(Date.now() + days * 86400_000)
    await query(
      `INSERT INTO memberships (id, auth_user_id, tier, tier_id, status, starts_at, ends_at, auto_renew, stripe_subscription_id)
       VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
      [`mem_${crypto.randomUUID()}`, uid, tier?.slug ?? `tier-${entityId}`, entityId, starts.toISOString(), ends.toISOString(), interval === 'one_time' ? 0 : 1, opts.subscriptionId ?? null],
    )
  }

  await query(`UPDATE orders SET status = 'paid', paid_at = datetime('now') WHERE id = ?`, [orderId])
  if (order.coupon_code) await query('UPDATE coupons SET redeemed = redeemed + 1 WHERE code = ?', [order.coupon_code])
}

/** Reverse a refunded order: revoke the access it granted (audit E — charge.refunded). */
export async function refundOrder(orderId: string): Promise<void> {
  const rows = await query<any>('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId])
  const order = rows[0]
  if (!order || order.status === 'refunded') return
  const uid = order.auth_user_id
  const entityType = order.entity_type as EntityType
  const entityId = Number(order.entity_id)
  if (entityType === 'course' || entityType === 'program') {
    await query(`UPDATE enrollments SET status = 'cancelled' WHERE auth_user_id = ? AND course_id = ?`, [uid, String(entityId)])
  } else if (entityType === 'book' || entityType === 'product') {
    await query(`DELETE FROM access_grants WHERE auth_user_id = ? AND entity_type = ? AND entity_id = ? AND order_id = ?`, [uid, entityType, entityId, orderId])
  } else if (entityType === 'membership') {
    await query(`UPDATE memberships SET status = 'cancelled', auto_renew = 0 WHERE auth_user_id = ? AND tier_id = ?`, [uid, entityId])
  }
  await query(`UPDATE orders SET status = 'refunded' WHERE id = ?`, [orderId])
}

/**
 * Persist + check webhook idempotency in Turso (survives restarts).
 * Insert-first: the UNIQUE constraint is the arbiter, so two concurrent
 * deliveries of the same event cannot both claim it (no SELECT-then-INSERT race).
 */
export async function claimEvent(eventId: string): Promise<boolean> {
  const res = await getTursoClient().execute({
    sql: 'INSERT OR IGNORE INTO processed_events (event_id) VALUES (?)',
    args: [eventId],
  })
  return Number(res.rowsAffected ?? 0) > 0
}
