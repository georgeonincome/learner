import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

/** Functional claim form appended below a faithful captured landing page. */
export function LeadMagnetSection({ slug, title, buttonLabel = 'Send me the free guide' }: {
  slug: string; title: string; buttonLabel?: string
}) {
  return (
    <section className="border-t border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] py-12 px-4">
      <div className="mx-auto max-w-lg">
        <h2 className="font-heading font-bold text-xl mb-2 text-[var(--color-text-primary)]">{title}</h2>
        <p className="text-sm mb-5 text-[var(--color-text-secondary)]">Enter your email and we&apos;ll send your copy straight to your inbox.</p>
        <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5">
          <LeadCaptureForm endpoint="/api/leads/claim" slug={slug} buttonLabel={buttonLabel} showName={false}
            successMessage="Check your inbox — your download is on its way." />
        </div>
      </div>
    </section>
  )
}
