import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require an authenticated session
const PROTECTED_PREFIXES = [
  '/(account)',
  '/dashboard',
  '/checkout',
  '/orders',
  '/library',
  // Community and appointment pages are public to read; write APIs enforce auth.
]

// Auth routes that should redirect to / if already authenticated
const AUTH_PREFIXES = ['/(auth)']

const PUBLIC_PREFIXES = [
  '/',
  '/blog',
  '/courses',
  '/course-detail',
  '/books',
  '/book',
  '/api',
  '/_next',
  '/static',
  '/favicon.ico',
  '/signin',
  '/login',
  '/signup',
  '/verify',
  '/reset-password',
]

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
}

function isAuth(pathname: string) {
  return AUTH_PREFIXES.some((p) => pathname.startsWith(p))
}

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('lena_session')?.value

  // If accessing a protected route without a session cookie, redirect to signin
  if (isProtected(pathname) && !sessionCookie) {
    const signinUrl = new URL('/signin', request.url)
    signinUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signinUrl)
  }

  // If accessing an auth route with a session, redirect to home
  if (isAuth(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Public routes: allow
  if (isPublic(pathname) || !sessionCookie) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
