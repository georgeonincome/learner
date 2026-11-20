import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { BookingForm } from '@/components/forms/BookingForm'

export const metadata = pageMeta('appointment', 'Book a session')

export default function Page() {
  return (
    <TemplatePage slug="appointment">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-2 font-heading text-2xl font-bold text-[var(--color-text-primary)]">Book a 1-on-1 session</h1>
        <p className="mb-8 text-sm text-[var(--color-text-secondary)]">Choose a time that works for you.</p>
        <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6">
          <BookingForm staffId="1" serviceName="Private 1-on-1 Consultation" />
        </div>
      </div>
    </TemplatePage>
  )
}
