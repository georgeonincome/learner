import { NextResponse } from 'next/server'
import { getVerifiedUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { checkoutSchema, safeParse } from '@/lib/validation'
import { createCheckout } from '@/lib/commerce'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Server-priced checkout (M7, audit E1/E2). The client supplies only the item
 * identity; the amount is resolved from the `prices` table. A pending order is
 * persisted and linked via Stripe metadata so the webhook can fulfil it.
 */
export async function POST(req: Request) {
  const uid = await getVerifiedUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in and verify your email to checkout.' }, { status: 401 })
  const limit = rateLimit(`checkout:${uid}`, { limit: 20, windowMs: 60_000 })
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many checkout attempts. Try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } })
  }
  const parsed = safeParse(checkoutSchema, await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
  try {
    const { url, sessionId, orderId } = await createCheckout({ uid, ...parsed.data })
    return NextResponse.json({ sessionId, orderId, url })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create checkout session' }, { status: 400 })
  }
}
