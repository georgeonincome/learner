import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** A caller sees only their own memberships (audit E/I IDOR). */
export async function GET() {
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  try {
    const memberships = await query<{
      id: string; auth_user_id: string; tier: string; tier_id: number
      status: string; starts_at: string; ends_at: string; auto_renew: number
    }>(
      `SELECT id, auth_user_id, tier, tier_id, status, starts_at, ends_at, auto_renew
         FROM memberships WHERE auth_user_id = ? ORDER BY starts_at DESC`, [uid],
    )
    return NextResponse.json({ memberships })
  } catch {
    return NextResponse.json({ memberships: [] })
  }
}
