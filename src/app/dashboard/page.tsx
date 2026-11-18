import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const enrollments = [
    { id: '1', course_id: 'content-creation-school-2026', title: 'Content Creation School 2026', progress: 45, lessonsCompleted: 9, totalLessons: 20 },
    { id: '2', course_id: 'digital-skills-fasttrack', title: 'Digital Skills Fasttrack', progress: 0, lessonsCompleted: 0, totalLessons: 12 },
  ]

  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading font-bold" style={{
            fontSize: '24px',
            color: 'var(--color-text-primary)',
          }}>
            My Dashboard
          </h1>
          <Link href="/dashboard/certificates" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
            My Certificates →
          </Link>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {enrollments.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-text-muted">You haven't enrolled in any courses yet.</p>
              <div className="mt-4">
                <Link href="/courses" className="no-underline inline-block">
                  <Button variant="primary" size="md">Browse Courses</Button>
                </Link>
              </div>
            </div>
          ) : (
            enrollments.map((e) => (
              <Card key={e.id} className="flex flex-col h-full border border-card bg-surface rounded-xl p-4">
                <h3 className="font-heading font-bold text-text-primary mb-1" style={{ fontSize: '16px' }}>
                  {e.title}
                </h3>
                <p className="text-text-muted text-sm mb-3">In progress</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Progress</span>
                    <span className="text-text-primary">{e.progress}%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                  <Link href={`/dashboard/course/${e.course_id}`} className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
                    Resume learning
                  </Link>
                  <span className="text-xs text-gray-text">{e.lessonsCompleted} / {e.totalLessons}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
