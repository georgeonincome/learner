import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseAdminAuth } from '@/lib/firebase-admin'
import { query } from '@/lib/turso'
import { rateLimit, clientKey } from '@/lib/rate-limit'
import { z } from 'zod'
import { safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const profileSchema = z.object({
  idToken: z.string().min(1),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(40).optional(),
  timezone: z.string().max(60).optional(),
})

/**
 * Persist the user's profile (names captured at signup, audit B1) and keep the
 * Firebase displayName in sync. Authenticated by a verified Firebase ID token.
 */
export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`profile:${await clientKey(req)}`, { limit: 20, windowMs: 60_000 })
    if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts. Try again shortly.' }, { status: 429 })
    const parsed = safeParse(profileSchema, await req.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const { idToken, firstName = '', lastName = '', phone = '', timezone = 'UTC' } = parsed.data

    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken)
    const uid = decoded.uid
    const displayName = `${firstName} ${lastName}`.trim()
    if (displayName) {
      await getFirebaseAdminAuth().updateUser(uid, { displayName })
    }
    await query(
      `INSERT INTO profiles (auth_user_id, full_name, first_name, last_name, email, phone, timezone, display_name, role)
       VALUES (?,?,?,?,?,?,?,?, 'student')
       ON CONFLICT(auth_user_id) DO UPDATE SET
         full_name = excluded.full_name, first_name = excluded.first_name,
         last_name = excluded.last_name, email = excluded.email,
         phone = excluded.phone, timezone = excluded.timezone, display_name = excluded.display_name`,
      [uid, displayName, firstName, lastName, decoded.email ?? '', phone, timezone, displayName],
    )
    return NextResponse.json({ ok: true, uid })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to save profile' }, { status: 401 })
  }
}

/** Read the current user's profile. */
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const idToken = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!idToken) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken)
    const rows = await query<any>('SELECT * FROM profiles WHERE auth_user_id = ? LIMIT 1', [decoded.uid])
    return NextResponse.json({ profile: rows[0] ?? null })
  } catch {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }
}
