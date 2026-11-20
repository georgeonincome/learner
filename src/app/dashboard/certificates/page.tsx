import Link from 'next/link'
import { getVerifiedUserId } from '@/lib/session'
import { listCertificates } from '@/lib/certificates'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'My Certificates — Lena Learning',
  description: 'Download verified certificates for courses you have completed.',
}

/** Real certificates only — a demo list would be a forgery vector (audit C13). */
export default async function CertificatesPage() {
  const uid = await getVerifiedUserId()
  const certificates = uid ? await listCertificates(uid) : []

  return (
    <AppSurface>
      <div className="py-10 md:py-16 px-2 sm:px-2">
        <div className="mx-auto max-w-[1264px]">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/dashboard" className="no-underline text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">← Back to dashboard</Link>
            <span className="text-xs text-[var(--color-text-muted)]">/</span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Certificates</span>
          </div>

          <h1 className="font-heading font-bold mb-2 text-2xl text-[var(--color-text-primary)]">My Certificates</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8">Download certificates for courses you have completed.</p>

          {!uid ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Sign in and verify your email to see your certificates.</p>
          ) : certificates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--color-text-muted)]">You haven&apos;t earned any certificates yet. Complete a course to earn one.</p>
              <div className="mt-4">
                <Link href="/courses" className="no-underline inline-block rounded-[10px] bg-[var(--color-cta)] px-5 py-3 text-sm font-semibold text-[var(--color-cta-text)]">Browse courses</Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex flex-col h-full border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] rounded-xl p-5">
                  <div className="h-32 flex items-center justify-center rounded-lg bg-[var(--color-bg-surface-elevated)] mb-4">
                    <span className="font-heading font-bold tracking-widest text-[var(--color-primary-text)]">CERTIFICATE</span>
                  </div>
                  <h3 className="font-heading font-bold text-[var(--color-text-primary)] mb-1">{cert.course_title || `Course #${cert.course_id}`}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-4">Completed {new Date(cert.issued_at).toLocaleDateString()}</p>
                  <div className="mt-auto pt-3 border-t border-[var(--color-border-card)] flex gap-3">
                    <a href={`/api/certificates/download?slug=${encodeURIComponent(cert.slug)}`} className="no-underline">
                      <span className="inline-block rounded-[10px] border border-[var(--color-border-card)] px-3 py-2 text-sm text-[var(--color-text-primary)]">Download</span>
                    </a>
                    <Link href={`/certificate/${cert.slug}`} className="no-underline">
                      <span className="inline-block rounded-[10px] border border-[var(--color-border-card)] px-3 py-2 text-sm text-[var(--color-text-primary)]">Verify</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppSurface>
  )
}
