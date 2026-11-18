import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function DashboardCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params

  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="no-underline text-sm text-text-secondary hover:text-primary">
            ← Back to dashboard
          </Link>
          <span className="text-xs text-text-muted">/</span>
          <span className="text-sm font-medium text-text-primary">Course {courseId.slice(-6)}</span>
        </div>
        <h1 className="font-heading font-bold mb-8" style={{
          fontSize: '24px',
          color: 'var(--color-text-primary)',
        }}>
          Course {courseId.slice(-6)}
        </h1>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <Card className="p-4">
              <h2 className="font-heading font-bold text-text-primary mb-3" style={{ fontSize: '18px' }}>
                Lessons
              </h2>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex items-center justify-between p-2 bg-surface-elevated rounded-lg border border-border-card">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-xs font-medium text-text-primary">
                        {n}
                      </span>
                      <span className="text-sm text-text-secondary">Lesson {n}: Chapter {n} title</span>
                    </div>
                    <Link href={`/dashboard/course/${courseId}/lesson/${n}`} className="no-underline text-primary text-sm font-medium hover:text-primary-hover">
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-4">
              <h3 className="font-heading font-bold text-text-primary mb-3" style={{ fontSize: '16px' }}>
                Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Overall</span>
                    <span className="text-text-primary">0%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-0" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Completed</span>
                    <span className="text-text-primary">0 / 6</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-0" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
