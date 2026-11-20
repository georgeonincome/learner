import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Server-authoritative resource gate (audit E/I). The uid comes from the
 * session cookie — a client-supplied auth_user_id is ignored.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource')
  if (!resource) return NextResponse.json({ error: 'resource required' }, { status: 400 })
  const uid = await getCurrentUserId()
  if (resource === 'public') return NextResponse.json({ allowed: true, reason: 'public' })
  if (!uid) return NextResponse.json({ allowed: false, reason: 'Sign in required' })

  const rows = await query<{ status: string; ends_at: string | null }>(
    `SELECT status, ends_at FROM memberships WHERE auth_user_id = ? AND status = 'active' LIMIT 1`, [uid],
  )
  const active = rows.some((m) => !m.ends_at || new Date(m.ends_at).getTime() > Date.now())
  return NextResponse.json({
    allowed: active,
    reason: active ? undefined : 'An active membership is required for this resource.',
  })
}
