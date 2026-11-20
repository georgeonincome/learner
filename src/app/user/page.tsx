import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getSessionUser } from '@/lib/session'
import { query } from '@/lib/turso'
import { buildMetadata } from '@/lib/seo'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'
import { AccountSettings } from '@/components/account/AccountSettings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Account settings',
  description: 'Manage your Lena profile, email and password.',
  path: '/user',
  noIndex: true,
})

export default async function UserPage() {
  const user = await getSessionUser()
  if (!user) redirect('/signin?callbackUrl=/user')
  if (!user.emailVerified) redirect('/verify')
  const rows = await query<any>('SELECT * FROM profiles WHERE auth_user_id = ? LIMIT 1', [user.uid])
  const profile = rows[0] ?? null
  return (
    <>
      <SiteHeader />
      <main id="__next-content" className="bg-[var(--color-bg-hero)] min-h-[70vh]">
        <div className="mx-auto max-w-[1000px] px-4 py-12 md:py-16">
          <h1 className="font-heading font-bold text-3xl text-[var(--color-text-primary)] mb-2">Account settings</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8">Manage your profile and sign-in details.</p>
          <AccountSettings profile={profile} email={user.email ?? ''} emailVerified={user.emailVerified} />
        </div>
      </main>
      <Footer />
    </>
  )
}
