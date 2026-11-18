import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, getBaseUrl } from '@/lib/stripe'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { checkoutSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const uid = await getCurrentUserId()
    const limit = rateLimit(`checkout:${uid}`, { limit: 20, windowMs: 60 * 1000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const parsed = safeParse(checkoutSchema, await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { lineItems, mode, successUrl, cancelUrl } = parsed.data

    const session = await getStripe().checkout.sessions.create({
      mode,
      line_items: lineItems as unknown as Stripe.Checkout.SessionCreateParams.LineItem[],
      success_url: successUrl ?? `${getBaseUrl()}/you-have-paid?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ?? `${getBaseUrl()}/courses`,
      metadata: {},
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Unknown error") ?? 'Failed to create checkout session' },
      { status: 400 },
    )
  }
}
