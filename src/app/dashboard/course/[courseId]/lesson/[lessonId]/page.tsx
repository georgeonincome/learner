import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LessonProgress } from '@/components/learning/LessonProgress'

export const dynamic = 'force-dynamic'

export default async function LessonPlayerPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params

  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/dashboard/course/${courseId}`} className="no-underline text-sm text-text-secondary hover:text-primary">
            ← Back to course
          </Link>
          <span className="text-xs text-text-muted">/</span>
          <span className="text-sm font-medium text-text-primary">Lesson {lessonId}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Video player area */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="p-0 rounded-xl overflow-hidden border border-card bg-surface">
              <div className="h-64 bg-surface-elevated flex items-center justify-center text-text-muted text-sm relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span>Video Player</span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-heading font-bold text-text-primary mb-2" style={{ fontSize: '20px' }}>
                  Lesson {lessonId}: Chapter {lessonId} title
                </h2>
                <p className="text-text-secondary text-sm mb-4">
                  Learn the key concepts of chapter {lessonId} in this lesson.
                </p>
                <div className="flex gap-2">
                  <Button variant="primary" size="md" disabled>
                    {Number(lessonId) % 2 === 0 ? 'Locked' : 'Play'}
                  </Button>
                  <Button variant="outline" size="md" disabled>
                    Transcript
                  </Button>
                </div>
              </div>
              <div className="border-t border-border-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Duration:</span>
                  <span className="text-xs text-text-primary">12:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Progress:</span>
                  <span className="text-xs text-text-primary">0%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-heading font-bold text-text-primary mb-3" style={{ fontSize: '16px' }}>
                Lesson notes
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Notes for lesson {lessonId} go here. In production, these would come from the lesson content stored in Firestore.
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-4">
              <h3 className="font-heading font-bold text-text-primary mb-3" style={{ fontSize: '16px' }}>
                Course progress
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">This course</span>
                    <span className="text-text-primary">0%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-0" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Lessons completed</span>
                    <span className="text-text-primary">0 / 6</span>
                  </div>
                </div>
              </div>
              <LessonProgress lessonId={lessonId} />
            </Card>

            <Card className="p-4 bg-surface-elevated">
              <h3 className="font-heading font-bold text-text-primary mb-3" style={{ fontSize: '16px' }}>
                Certificate
              </h3>
              <p className="text-text-muted text-sm mb-3">
                Complete all lessons to earn your certificate for this course.
              </p>
              <Link
                href="/dashboard/certificates"
                className="no-underline block"
              >
                <Button variant="outline" size="sm" className="w-full">
                  View certificates
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
