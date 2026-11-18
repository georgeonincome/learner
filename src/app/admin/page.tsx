import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { adminStore } from '@/lib/admin-store'

export const metadata = {
  title: 'Admin — SavvyPro',
}

const sections = [
  { label: 'Courses', href: '/admin/courses', description: 'Create and edit courses' },
  { label: 'Lessons', href: '/admin/lessons', description: 'Manage course lessons' },
  { label: 'Blog posts', href: '/admin/posts', description: 'Write and edit articles' },
  { label: 'Books', href: '/admin/books', description: 'View the book catalog' },
  { label: 'Users', href: '/admin/users', description: 'View registered users' },
  { label: 'Orders', href: '/admin/orders', description: 'Review purchases' },
  { label: 'Memberships', href: '/admin/memberships', description: 'Manage memberships' },
  { label: 'Settings', href: '/admin/settings', description: 'Site configuration' },
]

export default function AdminOverviewPage() {
  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
        Overview
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        Manage the content, commerce and community of your platform.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Courses</p>
          <p className="text-text-primary font-bold text-2xl">{adminStore.courses.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Blog posts</p>
          <p className="text-text-primary font-bold text-2xl">{adminStore.posts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Site name</p>
          <p className="text-text-primary font-bold text-xl">{adminStore.settings.siteName}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Maintenance mode</p>
          <p className="text-text-primary font-bold text-xl">
            {adminStore.settings.maintenanceMode ? 'On' : 'Off'}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="no-underline">
            <Card className="p-5 hover:border-primary transition-colors">
              <h3 className="font-heading font-bold text-text-primary mb-1">{s.label}</h3>
              <p className="text-text-secondary text-sm">{s.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
