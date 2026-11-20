import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Coupon {
  code: string; percent_off: number | null; amount_off: number | null
  max_redemptions: number | null; redeemed: number; expires_at: string | null; active: number
}

/** Validate a coupon without applying it (checkout can preview the discount). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const code = String(body.code ?? '').trim().toUpperCase().slice(0, 60)
  if (!code) return NextResponse.json({ error: 'Enter a coupon code' }, { status: 400 })
  const limit = rateLimit(`coupon:${code}`, { limit: 30, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  const rows = await query<Coupon>('SELECT * FROM coupons WHERE code = ? AND active = 1 LIMIT 1', [code])
  const c = rows[0]
  if (!c) return NextResponse.json({ valid: false, error: 'Invalid coupon code' }, { status: 404 })
  if (c.expires_at && new Date(c.expires_at).getTime() < Date.now()) return NextResponse.json({ valid: false, error: 'This coupon has expired' }, { status: 410 })
  if (c.max_redemptions != null && Number(c.redeemed) >= Number(c.max_redemptions)) return NextResponse.json({ valid: false, error: 'This coupon has been fully redeemed' }, { status: 410 })
  return NextResponse.json({ valid: true, code: c.code, percentOff: c.percent_off, amountOff: c.amount_off })
}
