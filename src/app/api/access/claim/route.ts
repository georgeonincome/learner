import { NextResponse } from 'next/server'
import { getVerifiedUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { query } from '@/lib/turso'
import crypto from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Claim a free book/product (no Stripe step); mirrors webhook fulfilment. */
export async function POST(req: Request) {
  const uid = await getVerifiedUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in and verify your email to claim this item.' }, { status: 401 })
  const limit = rateLimit(`claim:${uid}`, { limit: 20, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const entityType = String(body.entityType ?? '')
  const entityId = Number(body.entityId)
  if (!['book', 'product'].includes(entityType) || !Number.isInteger(entityId) || entityId <= 0) {
    return NextResponse.json({ error: 'Invalid item' }, { status: 400 })
  }
  // Confirm the entity is actually free before granting.
  const prices = await query<{ price: number; price_type: string }>(
    'SELECT price, price_type FROM prices WHERE entity_type = ? AND entity_id = ?',
    [entityType, entityId],
  )
  const isFree = prices.length === 0 || prices.every((p) => Number(p.price) <= 0 || p.price_type === 'FREE')
  if (!isFree) return NextResponse.json({ error: 'This item requires payment.' }, { status: 402 })
  await query(
    `INSERT OR IGNORE INTO access_grants (id, auth_user_id, entity_type, entity_id, order_id) VALUES (?, ?, ?, ?, NULL)`,
    [`grant_${crypto.randomUUID()}`, uid, entityType, entityId],
  )
  return NextResponse.json({ ok: true })
}
