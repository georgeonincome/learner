import Link from 'next/link'
import { query } from '@/lib/turso'
import { BookingForm } from '@/components/forms/BookingForm'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Book a session — Lena Learning' }

export default async function AppointmentsPage() {
  const services = await query<{ id: number; slug: string; name: string; description: string }>(
    "SELECT id, slug, name, description FROM appointment_services WHERE status = 'published' ORDER BY id LIMIT 1",
  ).catch(() => [])
  const service = services[0] ?? { id: 1, slug: 'private-1-on-1-consultation', name: 'Private 1-on-1 Consultation', description: '' }

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">Book a session</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl mb-2 text-[var(--color-text-primary)]">Book a 1-on-1 session</h1>
          <p className="text-sm mb-6 text-[var(--color-text-secondary)]">{service.description || 'Pick a time that works for you.'}</p>
          <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6">
            <BookingForm staffId={String(service.id)} serviceName={service.name} />
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
