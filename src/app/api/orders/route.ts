import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('lena_session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Note: in production, decode the session cookie to get the uid and filter by user.
    // Here we list all orders (admin-like) — scope to user in production.
    const orders = await query<{ id: string; auth_user_id: string; stripe_session_id: string | null; status: string; total: number; currency: string; created_at: string; paid_at: string | null }>(
      `SELECT id, auth_user_id, stripe_session_id, status, total, currency, created_at, paid_at FROM orders ORDER BY created_at DESC`,
    )

    return NextResponse.json({ orders })
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") ?? 'Failed to load orders' }, { status: 500 })
  }
}
