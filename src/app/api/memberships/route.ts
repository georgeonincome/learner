import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const memberships = await query<{
      id: string
      auth_user_id: string
      tier: string
      status: string
      starts_at: string
      ends_at: string
    }>(
      `SELECT id, auth_user_id, tier, status, starts_at, ends_at FROM memberships ORDER BY created_at DESC`,
    )
    return NextResponse.json({ memberships })
  } catch {
    return NextResponse.json({ memberships: [] })
  }
}
