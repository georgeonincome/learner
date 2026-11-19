import { NextResponse } from 'next/server'
import { getTursoClient } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { enrollSchema, safeParse } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import { listEnrollments } from '@/lib/learning'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const uid = await getCurrentUserId()
  const enrollments = await listEnrollments(uid)
  return NextResponse.json({ enrollments })
}

export async function POST(req: Request) {
  try {
    const uid = await getCurrentUserId()
    if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

    const limit = rateLimit(`enroll:${uid}`, { limit: 30, windowMs: 60 * 1000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many enrollment attempts. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const parsed = safeParse(enrollSchema, await req.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const { courseId } = parsed.data

    const id = `enroll_${uid}_${courseId}`
    await getTursoClient().execute({
      sql: `INSERT INTO enrollments (id, auth_user_id, course_id, status, created_at)
            VALUES (?, ?, ?, 'active', datetime('now'))
            ON CONFLICT(auth_user_id, course_id) DO NOTHING`,
      args: [id, uid, String(courseId)],
    })
    return NextResponse.json({ ok: true, enrollmentId: id })
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : 'Unknown error') ?? 'Failed to enroll' },
      { status: 500 },
    )
  }
}
