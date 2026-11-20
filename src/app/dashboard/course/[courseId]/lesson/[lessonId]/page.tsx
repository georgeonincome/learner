import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/session'
import { getCourse, getCurriculum, parseJson, type LessonRow } from '@/lib/content'
import { listProgress } from '@/lib/learning'
import { hasEntityAccess } from '@/lib/access'
import { LessonPlayer, type LessonContent } from '@/components/learning/LessonPlayer'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

const TYPE_LABEL: Record<string, string> = {
  video: 'Video', text: 'Reading', audio: 'Audio', pdf: 'PDF',
  download: 'Download', asgmt: 'Assignment', quiz: 'Quiz',
}

/** Real lesson player: DB curriculum, all 7 lesson types, access + drip gating. */
export default async function LessonPlayerPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params
  const course = (await getCourse(courseId))
  if (!course) notFound()

  const curriculum = await getCurriculum(course.id)
  const flat: { lesson: LessonRow; chapterTitle: string; chapterContent: string }[] = curriculum.flatMap((c) =>
    c.lessons.map((lesson) => ({ lesson, chapterTitle: c.chapter.title, chapterContent: c.chapter.content })),
  )
  const key = decodeURIComponent(lessonId)
  const index = flat.findIndex((x) => String(x.lesson.id) === key)
  const found = flat[index]
  if (!found) notFound()
  const { lesson, chapterContent } = found

  const uid = await getCurrentUserId()
  if (!uid) redirect(`/signin?callbackUrl=/dashboard/course/${course.id}/lesson/${lesson.id}`)

  const access = await hasEntityAccess(uid, 'course', course.id)
  const progress = await listProgress(uid)
  const own = progress.find((p) => p.lesson_id === String(lesson.id))
  const completedIds = new Set(progress.filter((p) => p.completed === 1).map((p) => p.lesson_id))
  const allIds = flat.map((x) => String(x.lesson.id))
  const percent = allIds.length ? Math.round((allIds.filter((id) => completedIds.has(id)).length / allIds.length) * 100) : 0

  let lockedReason: string | null = null
  if (!access.allowed) {
    lockedReason = 'This lesson is part of a paid course. Enrol to unlock it.'
  } else if (lesson.prerequisite_lesson_id && !completedIds.has(String(lesson.prerequisite_lesson_id))) {
    lockedReason = 'Complete the prerequisite lesson to unlock this one.'
  } else if (course.progressive_mode && index > 0 && !completedIds.has(allIds[index - 1] ?? '')) {
    lockedReason = 'Complete the previous lesson to unlock this one.'
  } else if (lesson.drip_offset_days > 0) {
    const enrollment = await (await import('@/lib/turso')).query<{ created_at: string }>(
      'SELECT created_at FROM enrollments WHERE auth_user_id = ? AND course_id = ? LIMIT 1', [uid, String(course.id)],
    )
    const start = enrollment[0]?.created_at ? new Date(enrollment[0].created_at).getTime() : Date.now()
    const release = start + lesson.drip_offset_days * 86_400_000
    if (Date.now() < release) lockedReason = `This lesson unlocks on ${new Date(release).toLocaleDateString()}.`
  }

  const content = parseJson<LessonContent>(lesson.content, {})
  const prev = index > 0 ? flat[index - 1] : null
  const next = index < flat.length - 1 ? flat[index + 1] : null

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-[1264px]">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <Link href={`/dashboard/course/${course.id}`} className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">{course.title}</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">Lesson {index + 1}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <LessonPlayer
                lessonId={String(lesson.id)}
                title={lesson.title}
                lessonType={lesson.lesson_type}
                content={content}
                fallbackText={chapterContent || undefined}
                durationSec={lesson.duration_sec}
                completed={!!own?.completed}
                lastPositionSec={own?.last_position_sec ?? 0}
                courseTitle={course.title}
                courseId={course.id}
                nextHref={next ? `/dashboard/course/${course.id}/lesson/${next.lesson.id}` : undefined}
                prevHref={prev ? `/dashboard/course/${course.id}/lesson/${prev.lesson.id}` : undefined}
                percent={percent}
                lockedReason={lockedReason}
              />
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
                <h2 className="font-heading font-bold text-base mb-3 text-[var(--color-text-primary)]">Course curriculum</h2>
                <ol className="list-none p-0 m-0 space-y-1 max-h-[560px] overflow-auto">
                  {curriculum.map(({ chapter, lessons }) => (
                    <li key={chapter.id}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mt-3 mb-1">{chapter.title}</p>
                      <ul className="list-none p-0 m-0 space-y-0.5">
                        {lessons.map((l) => {
                          const active = l.id === lesson.id
                          const done = completedIds.has(String(l.id))
                          return (
                            <li key={l.id}>
                              <Link
                                href={`/dashboard/course/${course.id}/lesson/${l.id}`}
                                className={`no-underline block rounded-md px-2 py-1.5 text-xs ${active ? 'bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-primary)] font-semibold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]'}`}
                              >
                                <span className="mr-1">{done ? '✓' : (TYPE_LABEL[l.lesson_type] ?? l.lesson_type).slice(0, 1)}</span>{l.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
