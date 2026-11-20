import { NextRequest, NextResponse } from 'next/server'
import { getAdminIdentity } from '@/lib/admin-guard'
import { getFirebaseAdminAuth } from '@/lib/firebase-admin'
import { query } from '@/lib/turso'
import { z } from 'zod'
import { safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const roleSchema = z.object({ role: z.enum(['student', 'instructor', 'editor', 'admin', 'teacher']) })

/**
 * Role assignment (M3, closes audit B7). Admin-only. Sets the Firebase custom
 * claim (read by admin-guard / middleware) AND the profiles.role column AND the
 * Firestore users/{uid}.role doc (for firestore.rules compatibility). Audit-logged.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { uid } = await params
  const parsed = safeParse(roleSchema, await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { role } = parsed.data
  try {
    // 'teacher' is the legacy admin-equivalent claim used by admin-guard.
    const claimRole = role === 'teacher' ? 'teacher' : role
    await getFirebaseAdminAuth().setCustomUserClaims(uid, { role: claimRole })
    await query(
      `INSERT INTO profiles (auth_user_id, role) VALUES (?, ?)
       ON CONFLICT(auth_user_id) DO UPDATE SET role = excluded.role`,
      [uid, role],
    )
    await query(
      `INSERT INTO audit_log (actor, action, entity_type, entity_id, diff) VALUES (?,?,?,?,?)`,
      [admin.uid, 'role.set', 'user', uid, JSON.stringify({ role })],
    )
    return NextResponse.json({ ok: true, uid, role })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to set role' }, { status: 500 })
  }
}
