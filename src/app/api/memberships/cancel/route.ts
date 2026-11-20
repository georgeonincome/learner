import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { getStripe } from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Cancel only the caller's own membership (audit E/I ownership check). */
export async function POST(req: Request) {
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const limit = rateLimit(`cancel:${uid}`, { limit: 10, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const membershipId = String(body.membershipId ?? '')
  if (!membershipId) return NextResponse.json({ error: 'membershipId required' }, { status: 400 })
  const rows = await query<{ id: string; stripe_subscription_id: string | null; status: string }>(
    `SELECT id, stripe_subscription_id, status FROM memberships WHERE id = ? AND auth_user_id = ? LIMIT 1`,
    [membershipId, uid],
  )
  const membership = rows[0]
  if (!membership) return NextResponse.json({ error: 'Membership not found' }, { status: 404 })
  if (membership.status === 'cancelled') return NextResponse.json({ ok: true })

  if (membership.stripe_subscription_id) {
    try {
      await getStripe().subscriptions.update(membership.stripe_subscription_id, { cancel_at_period_end: true })
    } catch {
      // Stripe may be unavailable locally; still stop local auto-renew.
    }
  }
  await query(`UPDATE memberships SET auto_renew = 0 WHERE id = ?`, [membership.id])
  return NextResponse.json({ ok: true, autoRenew: false })
}
