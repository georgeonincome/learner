import { NextResponse } from 'next/server'
import { getFirebaseAdminAuth, SESSION_COOKIE_NAME } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    // Verify the session cookie (checks revocation)
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    )

    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
      role: decoded.role,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
