import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export const dynamic = 'force-dynamic'

async function getSession() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/me`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero px-4 py-10">
        <Card className="w-full max-w-sm bg-surface border border-card rounded-xl shadow-sm p-6">
          <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Sign in required</h1>
          <p className="text-sm text-gray-text mb-6">Please sign in to access your account settings.</p>
          <Link href="/login" className="inline-block">
            <Button variant="primary" size="md">Sign in</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero py-10 px-4">
      <Card className="max-w-2xl mx-auto bg-surface border border-card rounded-xl shadow-sm p-6">
        <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Account settings</h1>
        <p className="text-sm text-gray-text mb-6">Manage your profile and account preferences.</p>

        <Alert variant="info">
          Email verified:{' '}
          {session.emailVerified ? <span className="font-semibold text-green-400">Yes</span> : <span className="font-semibold text-amber-400">No</span>}
        </Alert>

        <form className="space-y-4 mt-6">
          <Input
            label="Email"
            type="email"
            defaultValue={session.email || ''}
            disabled
            className="bg-surface-elevated"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">Role:</span>
            <span className="text-sm text-gray-text">{session.role ?? 'student'}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="md" onClick={() => {}}>
              Save changes
            </Button>
            <Button variant="danger" size="md" onClick={() => {}}>
              Delete account
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <Link href="/api/auth/logout" className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium">
            <span>Sign out</span>
          </Link>
        </div>
      </Card>
    </div>
  )
}
