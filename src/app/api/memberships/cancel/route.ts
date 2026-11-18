import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'
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

    const { membershipId } = await req.json()
    await query(
      `UPDATE memberships SET status = 'cancelled', auto_renew = 0 WHERE id = ?`,
      [membershipId],
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") ?? 'Failed to cancel membership' }, { status: 500 })
  }
}
