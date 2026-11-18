import { NextResponse } from 'next/server'
import { getStripe, getBaseUrl } from '@/lib/stripe'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MEMBERSHIP_TIERS: Record<string, { name: string; price: number; interval: 'month' | 'year' }> = {
  starter: { name: 'Starter', price: 2900, interval: 'month' },
  pro: { name: 'Pro', price: 7900, interval: 'month' },
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('lena_session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { tierId } = await req.json()
    const tier = MEMBERSHIP_TIERS[tierId]
    if (!tier) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price_data: { currency: 'usd', product_data: { name: tier.name }, unit_amount: tier.price, recurring: { interval: tier.interval } }, quantity: 1 }],
      success_url: `${getBaseUrl()}/membership?success=1`,
      cancel_url: `${getBaseUrl()}/membership?canceled=1`,
      metadata: { tierId, auth_user_id: 'guest' },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") ?? 'Failed to create membership checkout' }, { status: 400 })
  }
}
