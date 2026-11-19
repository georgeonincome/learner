import { cookies } from 'next/headers'
import {
  getFirebaseAdminAuth,
  SESSION_COOKIE_NAME,
} from '@/lib/firebase-admin'

export interface SessionUser {
  uid: string
  email: string | null
  emailVerified: boolean
  role: string
}

/**
 * Resolve the current user from the httpOnly session cookie.
 * Returns null when unauthenticated or the cookie is invalid/revoked.
 * NO demo fallback (audit B10 / decision D8): callers must handle null.
 * Call only at request time (never during static prerender).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionCookie) return null
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true, // checkRevoked — logout/revocation takes effect immediately
    )
    const claims = decoded as unknown as Record<string, unknown>
    return {
      uid: decoded.uid,
      email: typeof decoded.email === 'string' ? decoded.email : null,
      emailVerified: decoded.email_verified === true,
      role: typeof claims.role === 'string' ? claims.role : 'student',
    }
  } catch {
    return null
  }
}

/** Convenience: uid or null. */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getSessionUser()
  return user?.uid ?? null
}
