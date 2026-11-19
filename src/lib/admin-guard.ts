import { cookies } from 'next/headers'
import {
  getFirebaseAdminAuth,
  SESSION_COOKIE_NAME,
} from '@/lib/firebase-admin'

export interface AdminIdentity {
  uid: string
  role: string
  demo: boolean
}

/**
 * Server-side role guard for admin routes. Fail-closed: a verified session
 * cookie with an admin/teacher custom claim is REQUIRED. No demo fallback
 * in any environment (audit B10 / decision D8).
 */
export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionCookie) return null
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    )
    const claims = decoded as unknown as Record<string, unknown>
    const role = typeof claims.role === 'string' ? claims.role : 'student'
    if (role !== 'admin' && role !== 'teacher') return null
    return { uid: decoded.uid, role, demo: false }
  } catch {
    return null
  }
}
