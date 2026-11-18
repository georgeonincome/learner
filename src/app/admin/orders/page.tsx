'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'

interface Order {
  id: string
  auth_user_id: string
  status: string
  total: number
  currency: string
  created_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((data: { orders: Order[] }) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Orders</h2>
      <Card className="p-5">
        <h3 className="font-heading font-bold text-text-primary mb-4">Recent orders ({orders.length})</h3>
        {loading ? (
          <p className="text-text-muted text-sm">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-text-muted text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-text-muted border-b border-border">
                <tr>
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border-card">
                    <td className="py-2 pr-4 text-text-primary">{o.id}</td>
                    <td className="py-2 pr-4 text-text-secondary">{o.auth_user_id}</td>
                    <td className="py-2 pr-4 text-text-secondary">{o.currency} {(o.total / 100).toFixed(2)}</td>
                    <td className="py-2 pr-4 text-primary">{o.status}</td>
                    <td className="py-2 text-text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
