import { NextResponse } from 'next/server'
import { getStripe, getBaseUrl } from '@/lib/stripe'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('lena_session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { lineItems, mode = 'payment', successUrl, cancelUrl } = await req.json()
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json({ error: 'lineItems required' }, { status: 400 })
    }

    const session = await getStripe().checkout.sessions.create({
      mode,
      line_items: lineItems,
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
