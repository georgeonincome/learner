'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Settings {
  siteName: string
  tagline: string
  supportEmail: string
  whatsapp: string
  maintenanceMode: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    tagline: '',
    supportEmail: '',
    whatsapp: '',
    maintenanceMode: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { settings: null }))
      .then((data: { settings: Settings | null }) => {
        if (data.settings) setSettings(data.settings)
      })
      .catch(() => {})
  }, [])

  function update(key: keyof Settings, value: string | boolean) {
    setSaved(false)
    setSettings({ ...settings, [key]: value })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    if (res.ok) setSaved(true)
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Settings</h2>
      <Card className="p-5 max-w-xl">
        <form onSubmit={save} className="space-y-4">
          <Input
            label="Site name"
            value={settings.siteName}
            onChange={(e) => update('siteName', e.target.value)}
          />
          <Input
            label="Tagline"
            value={settings.tagline}
            onChange={(e) => update('tagline', e.target.value)}
          />
          <Input
            label="Support email"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => update('supportEmail', e.target.value)}
          />
          <Input
            label="WhatsApp"
            value={settings.whatsapp}
            onChange={(e) => update('whatsapp', e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => update('maintenanceMode', e.target.checked)}
              className="accent-primary"
            />
            Maintenance mode
          </label>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm">Save settings</Button>
            {saved && <span className="text-primary text-sm">Saved.</span>}
          </div>
        </form>
      </Card>
    </div>
  )
}
