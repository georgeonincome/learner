'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'

interface Membership {
  id: string
  auth_user_id: string
  tier: string
  status: string
  ends_at: string
}

export default function AdminMembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/memberships', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { memberships: [] }))
      .then((data: { memberships: Membership[] }) => setMemberships(data.memberships ?? []))
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Memberships</h2>
      <Card className="p-5">
        <h3 className="font-heading font-bold text-text-primary mb-4">All memberships ({memberships.length})</h3>
        {loading ? (
          <p className="text-text-muted text-sm">Loading…</p>
        ) : memberships.length === 0 ? (
          <p className="text-text-muted text-sm">No memberships yet.</p>
        ) : (
          <div className="space-y-2">
            {memberships.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border-card">
                <div>
                  <p className="text-text-primary text-sm">{m.tier} · {m.auth_user_id}</p>
                  <p className="text-text-muted text-xs">Ends {new Date(m.ends_at).toLocaleDateString()}</p>
                </div>
                <span className="text-primary text-xs font-medium">{m.status}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
