'use client'

import { useEffect, useState } from 'react'
import { CmsManager } from '@/components/admin/CmsManager'

function SubscriptionsList() {
  const [memberships, setMemberships] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/memberships', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { memberships: [] }))
      .then((d) => setMemberships(d.memberships ?? []))
      .catch(() => setMemberships([]))
  }, [])
  return (
    <div className="rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6 mt-8">
      <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-4">Active subscriptions ({memberships.length})</h3>
      {memberships.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">No subscriptions yet.</p>
      ) : (
        <div className="space-y-2">
          {memberships.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-[8px] border border-[var(--color-border-card)]">
              <div>
                <p className="text-sm text-[var(--color-text-primary)]">{m.tier} · {m.auth_user_id}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Ends {m.ends_at ? new Date(m.ends_at).toLocaleDateString() : '—'}</p>
              </div>
              <span className="text-xs font-medium text-[var(--color-primary-text)]">{m.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminMembershipsPage() {
  return (
    <div>
      <CmsManager entity="membership_tiers" title="Membership tiers" />
      <SubscriptionsList />
    </div>
  )
}
