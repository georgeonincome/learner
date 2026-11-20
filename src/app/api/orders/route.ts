import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** User-scoped orders (audit E8 order leak / I IDOR). Admins may list all. */
export async function GET() {
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const user = await (await import('@/lib/session')).getSessionUser()
  const isAdmin = user?.role === 'admin'
  try {
    const orders = await query<{
      id: string; auth_user_id: string; stripe_session_id: string | null
      status: string; total: number; currency: string; created_at: string
      paid_at: string | null; entity_type: string | null; entity_id: number | null
    }>(
      isAdmin
        ? `SELECT id, auth_user_id, stripe_session_id, status, total, currency, created_at, paid_at, entity_type, entity_id
             FROM orders ORDER BY created_at DESC LIMIT 500`
        : `SELECT id, auth_user_id, stripe_session_id, status, total, currency, created_at, paid_at, entity_type, entity_id
             FROM orders WHERE auth_user_id = ? ORDER BY created_at DESC LIMIT 500`,
      isAdmin ? [] : [uid],
    )
    return NextResponse.json({ orders })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to load orders' }, { status: 500 })
  }
}
