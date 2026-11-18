'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'

interface UserRow {
  id: string
  email?: string
  role?: string
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/users', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { users: [] }))
      .then((data: { users: UserRow[] }) => setUsers(data.users ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Users</h2>
      <Card className="p-5">
        <h3 className="font-heading font-bold text-text-primary mb-4">Registered users ({users.length})</h3>
        {loading ? (
          <p className="text-text-muted text-sm">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-text-muted text-sm">
            No users found. In demo mode users are stored in Firebase Auth / Firestore.
          </p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-border-card">
                <span className="text-text-primary text-sm">{u.email ?? u.id}</span>
                <span className="text-text-muted text-xs">{u.role ?? 'student'}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
