import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const resource = searchParams.get('resource')
    const auth_user_id = searchParams.get('auth_user_id') ?? 'guest'

    if (!resource) {
      return NextResponse.json({ error: 'resource required' }, { status: 400 })
    }

    // Check active membership
    const memberships = await query<{ status: string; ends_at: string }>(
      `SELECT status, ends_at FROM memberships WHERE auth_user_id = ? AND status = 'active'`,
      [auth_user_id],
    )
    const now = new Date().toISOString()
    let hasActiveMembership = false
    for (const m of memberships) {
      if (m.ends_at > now) {
        hasActiveMembership = true
        break
      }
    }

    // For demo: guest can access public resources; paid resources require membership
    const allowed = resource === 'public' || hasActiveMembership

    return NextResponse.json({ allowed, reason: allowed ? undefined : 'Active membership required' })
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") ?? 'Failed to check access' }, { status: 500 })
  }
}
