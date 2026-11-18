import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseAdminAuth, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'
import { clientKey, rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`session:${await clientKey(req)}`, {
      limit: 20,
      windowMs: 60 * 1000,
    })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const body = (await req.json()) as { idToken?: unknown }
    const idToken = body.idToken
    if (typeof idToken !== 'string' || !idToken) {
      return NextResponse.json({ error: 'idToken required' }, { status: 400 })
    }

    // Verify the Firebase ID token (server-side verification)
    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken)

    // Create a session cookie (httpOnly, secure, sameSite)
    const expiresIn = SESSION_COOKIE_MAX_AGE * 1000
    const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(
      idToken,
      { expiresIn },
    )

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    })

    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create session'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
