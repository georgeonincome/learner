import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { getLesson } from '@/lib/content'
import { hasEntityAccess } from '@/lib/access'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Submit an assignment to the instructor review queue (DB-backed, graded in CMS). */
export async function POST(req: Request) {
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const limit = rateLimit(`assignment:${uid}`, { limit: 20, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many submissions' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const lessonId = Number(body.lessonId)
  const text = String(body.content ?? '').trim().slice(0, 20_000)
  if (!Number.isInteger(lessonId) || !text) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  const lesson = await getLesson(lessonId)
  if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
  const access = await hasEntityAccess(uid, 'course', lesson.course_id)
  if (!access.allowed) return NextResponse.json({ error: 'Enrol to submit this assignment' }, { status: 403 })

  await query(
    `INSERT INTO assignment_submissions (id, uid, lesson_id, text) VALUES (?,?,?,?)`,
    [`asg_${crypto.randomUUID()}`, uid, lessonId, text],
  )
  return NextResponse.json({ ok: true })
}
