import { cookies } from 'next/headers'
import {
  getFirebaseAdminAuth,
  SESSION_COOKIE_NAME,
} from '@/lib/firebase-admin'

/**
 * Resolve the current user id from the httpOnly session cookie.
 * Falls back to a deterministic demo id when unauthenticated so that
 * local/demo journeys can still store progress and claim certificates.
 * Call only at request time (never during static prerender).
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionCookie) return 'demo-user'
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      false,
    )
    return decoded.uid
  } catch {
    return 'demo-user'
  }
}
