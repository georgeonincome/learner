import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CART_COOKIE = 'lena_cart'
const TYPES = ['course', 'book', 'program', 'membership', 'product']

async function cartKey() {
  const uid = await getCurrentUserId()
  if (uid) return `uid:${uid}`
  const jar = await cookies()
  const token = jar.get(CART_COOKIE)?.value
  return { key: `guest:${token ?? 'new'}`, token }
}

/** Guest + authenticated cart, stored in Turso (reference parity). */
export async function GET() {
  const resolved = await cartKey()
  const key = typeof resolved === 'string' ? resolved : resolved.key
  const rows = await query<{ id: string; product_type: string; product_id: number; quantity: number }>(
    'SELECT id, product_type, product_id, quantity FROM cart_items WHERE user_key = ? ORDER BY created_at', [key],
  )
  const res = NextResponse.json({ items: rows })
  if (typeof resolved === 'object' && !resolved.token) {
    const token = crypto.randomUUID()
    res.cookies.set(CART_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
  }
  return res
}

export async function POST(req: Request) {
  const resolved = await cartKey()
  const key = typeof resolved === 'string' ? resolved : resolved.key
  const body = await req.json().catch(() => ({}))
  const productType = String(body.productType ?? '')
  const productId = Number(body.productId)
  const quantity = Math.max(1, Math.min(20, Number(body.quantity ?? 1)))
  if (!TYPES.includes(productType) || !Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
  }
  const limit = rateLimit(`cart:${key}`, { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many updates' }, { status: 429 })
  // Delete-then-insert keeps one row per item (schema has no composite UNIQUE).
  await query('DELETE FROM cart_items WHERE user_key = ? AND product_type = ? AND product_id = ?', [key, productType, productId])
  await query('INSERT INTO cart_items (id, user_key, product_type, product_id, quantity) VALUES (?,?,?,?,?)',
    [`cart_${crypto.randomUUID()}`, key, productType, productId, quantity])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const resolved = await cartKey()
  const key = typeof resolved === 'string' ? resolved : resolved.key
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (productId) await query('DELETE FROM cart_items WHERE user_key = ? AND product_id = ?', [key, Number(productId)])
  else await query('DELETE FROM cart_items WHERE user_key = ?', [key])
  return NextResponse.json({ ok: true })
}
