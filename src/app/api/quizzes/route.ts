import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { getLesson, parseJson } from '@/lib/content'
import { hasEntityAccess } from '@/lib/access'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Grade a quiz server-side from the CMS-stored answer key (no client trust). */
export async function POST(req: Request) {
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const limit = rateLimit(`quiz:${uid}`, { limit: 30, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const lessonId = Number(body.lessonId)
  if (!Number.isInteger(lessonId)) return NextResponse.json({ error: 'Invalid lesson' }, { status: 400 })
  const lesson = await getLesson(lessonId)
  if (!lesson || lesson.lesson_type !== 'quiz') return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  const access = await hasEntityAccess(uid, 'course', lesson.course_id)
  if (!access.allowed) return NextResponse.json({ error: 'Enrol to take this quiz' }, { status: 403 })

  const content = parseJson<{ questions?: { answer: number }[]; passMark?: number }>(lesson.content, {})
  const questions = content.questions ?? []
  if (!questions.length) return NextResponse.json({ error: 'This quiz has no questions yet.' }, { status: 409 })
  const answers = body.answers && typeof body.answers === 'object' ? body.answers as Record<string, number> : {}
  const correct = questions.reduce((n, q, i) => n + (Number(answers[String(i)]) === Number(q.answer) ? 1 : 0), 0)
  const score = Math.round((correct / questions.length) * 100)
  const passMark = Number(content.passMark ?? 70)
  const passed = score >= passMark
  await query(
    `INSERT INTO quiz_submissions (id, uid, lesson_id, answers, score, passed) VALUES (?,?,?,?,?,?)`,
    [`quiz_${crypto.randomUUID()}`, uid, lessonId, JSON.stringify(answers), score, passed ? 1 : 0],
  )
  return NextResponse.json({ score, passed, passMark })
}
