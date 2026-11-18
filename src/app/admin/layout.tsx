import Link from 'next/link'
import { getAdminIdentity } from '@/lib/admin-guard'

export const dynamic = 'force-dynamic'

const navItems = [
  { label: 'Overview', href: '/admin' },
  { label: 'Courses', href: '/admin/courses' },
  { label: 'Lessons', href: '/admin/lessons' },
  { label: 'Blog posts', href: '/admin/posts' },
  { label: 'Books', href: '/admin/books' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Memberships', href: '/admin/memberships' },
  { label: 'Settings', href: '/admin/settings' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const identity = await getAdminIdentity()

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl text-text-primary mb-2">
            Access denied
          </h1>
          <p className="text-text-secondary mb-4">
            You need an admin or teacher account to view this area.
          </p>
          <Link href="/login" className="no-underline text-primary font-medium">
            Sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-hero border-b border-border-card">
        <div className="mx-auto max-w-[1264px] px-2 sm:px-2 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-xl text-text-primary">
              SavvyPro Admin
            </h1>
            <p className="text-xs text-text-muted">
              Signed in as {identity.uid} ({identity.role})
              {identity.demo ? ' — demo mode' : ''}
            </p>
          </div>
          <Link href="/dashboard" className="no-underline text-primary text-sm font-medium">
            Back to site →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1264px] px-2 sm:px-2 py-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav className="flex flex-wrap lg:flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="no-underline px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  )
}
