import { NextResponse } from 'next/server'
import { getVerifiedUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { createCheckout } from '@/lib/commerce'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Subscription checkout for a CMS-defined tier — price always from the DB. */
export async function POST(req: Request) {
  const uid = await getVerifiedUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in and verify your email to subscribe.' }, { status: 401 })
  const limit = rateLimit(`membership:${uid}`, { limit: 15, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const tierRef = String(body.tierId ?? body.slug ?? '')
  if (!tierRef) return NextResponse.json({ error: 'Choose a membership tier' }, { status: 400 })
  const rows = await query<{ id: number; slug: string; name: string; status: string }>(
    `SELECT id, slug, name, status FROM membership_tiers
       WHERE CAST(id AS TEXT) = ? OR slug = ? LIMIT 1`, [tierRef, tierRef],
  )
  const tier = rows[0]
  if (!tier || tier.status !== 'published') return NextResponse.json({ error: 'Membership tier not found' }, { status: 404 })
  try {
    const result = await createCheckout({
      uid, entityType: 'membership', entityId: tier.id,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/memberships?success=1`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/membership?canceled=1`,
    })
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not start subscription' }, { status: 400 })
  }
}
