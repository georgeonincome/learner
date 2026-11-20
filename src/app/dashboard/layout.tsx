import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'

/**
 * Student-area gate (M3, audit B3/B6). Requires an authenticated AND
 * email-verified session — the reference sets is_auth_require_verified_email=1.
 * Unauthenticated -> /signin; unverified -> /verify.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect('/signin?callbackUrl=/dashboard')
  if (!user.emailVerified) redirect('/verify')
  return <>{children}</>
}
