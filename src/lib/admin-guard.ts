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
 * Server-side role guard for admin routes.
 * In production a verified session cookie with an admin/teacher custom claim
 * is required. In local demo mode (no cookie configured) a demo admin is used
 * so the management UI can be exercised — see GAPS.md.
 */
export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionCookie) {
      if (process.env.DEMO_MODE === 'true') {
        return { uid: 'demo-user', role: 'admin', demo: true }
      }
      return process.env.NODE_ENV === 'production'
        ? null
        : { uid: 'demo-user', role: 'admin', demo: true }
    }
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      false,
    )
    const claims = decoded as unknown as Record<string, unknown>
    const role = typeof claims.role === 'string' ? claims.role : 'student'
    if (role !== 'admin' && role !== 'teacher') return null
    return { uid: decoded.uid, role, demo: false }
  } catch {
    return process.env.NODE_ENV === 'production'
      ? null
      : { uid: 'demo-user', role: 'admin', demo: true }
  }
}
