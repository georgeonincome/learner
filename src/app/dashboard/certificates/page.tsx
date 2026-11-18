import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'My Certificates — SavvyPro',
  description: 'Download certificates for courses you have completed.',
}

// Demo list of earned certificates. In production this would be loaded from
// Firestore `certificates` collection, scoped to the authenticated user.
const certificates = [
  {
    id: 'cert-content-creation',
    course: 'Content Creation School 2026',
    completedAt: '2026-03-15',
  },
]

export default function CertificatesPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/dashboard"
            className="no-underline text-sm text-text-secondary hover:text-primary"
          >
            ← Back to dashboard
          </Link>
          <span className="text-xs text-text-muted">/</span>
          <span className="text-sm font-medium text-text-primary">
            Certificates
          </span>
        </div>

        <h1 className="font-heading font-bold mb-2 text-2xl text-text-primary">
          My Certificates
        </h1>
        <p className="text-text-secondary text-sm mb-8">
          Download certificates for courses you have completed.
        </p>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {certificates.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-text-muted">
                You haven't earned any certificates yet. Complete a course to
                earn one.
              </p>
              <div className="mt-4">
                <Link href="/courses" className="no-underline inline-block">
                  <Button variant="primary" size="md">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            certificates.map((cert) => (
              <Card
                key={cert.id}
                className="flex flex-col h-full border border-card bg-surface rounded-xl p-5"
              >
                <div className="h-32 flex items-center justify-center rounded-lg bg-hero mb-4">
                  <span className="font-heading font-bold tracking-widest text-primary">
                    CERTIFICATE
                  </span>
                </div>
                <h3 className="font-heading font-bold text-text-primary mb-1">
                  {cert.course}
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  Completed {cert.completedAt}
                </p>
                <div className="mt-auto pt-3 border-t border-border">
                  <a
                    href={`/api/certificates/download?name=Learner&course=${encodeURIComponent(cert.course)}`}
                    className="no-underline"
                    download
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Download certificate
                    </Button>
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
