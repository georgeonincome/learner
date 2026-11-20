import Link from 'next/link'
import { getCertificate } from '@/lib/certificates'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cert = await getCertificate(slug)
  return {
    title: cert ? `Verified certificate — ${cert.course_title}` : 'Certificate verification',
    description: 'Verify a Lena Learning certificate of completion.',
    robots: { index: false },
  }
}

/** Public, read-only verification of an issued certificate (audit C13). */
export default async function VerifyCertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cert = await getCertificate(slug)

  return (
    <AppSurface>
      <main className="py-16 px-4">
        <div className="mx-auto max-w-xl">
          {cert ? (
            <div className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-text)] mb-2">Verified</p>
              <h1 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] mb-6">Certificate of Completion</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">This certifies that</p>
              <p className="font-heading font-bold text-xl my-3 text-[var(--color-text-primary)]">{cert.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">successfully completed</p>
              <p className="font-heading font-semibold text-lg my-3 text-[var(--color-text-primary)]">{cert.course_title || `Course #${cert.course_id}`}</p>
              <p className="text-xs text-[var(--color-text-muted)] mb-6">
                Issued {new Date(cert.issued_at).toLocaleDateString()} · ID LENA-{cert.slug.slice(-8).toUpperCase()}
              </p>
              <a
                href={`/api/certificates/download?slug=${encodeURIComponent(cert.slug)}`}
                className="inline-block no-underline rounded-[10px] bg-[var(--color-cta)] px-5 py-3 text-sm font-semibold text-[var(--color-cta-text)]"
              >
                Download certificate
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-8 text-center">
              <h1 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] mb-3">Certificate not found</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">This certificate ID is invalid or has been revoked.</p>
            </div>
          )}
          <p className="mt-6 text-center"><Link href="/" className="text-sm text-[var(--color-primary-text)] no-underline">← Home</Link></p>
        </div>
      </main>
    </AppSurface>
  )
}
