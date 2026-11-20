import { NextResponse } from 'next/server'
import { getTursoClient } from '@/lib/turso'
import { getSessionUser } from '@/lib/session'
import { enrollSchema, safeParse } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import { listEnrollments } from '@/lib/learning'
import { getCourse, getPrices } from '@/lib/content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const enrollments = await listEnrollments(user.uid)
  return NextResponse.json({ enrollments })
}

/**
 * Self-enrollment (M3/M5, closes audit C6 open-enrollment). Requires an
 * authenticated, email-verified user AND only permits FREE products. Paid
 * courses/books are enrolled by the Stripe webhook after a confirmed order
 * (M7) — never by this endpoint.
 */
export async function POST(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    if (!user.emailVerified) return NextResponse.json({ error: 'Verify your email before enrolling.' }, { status: 403 })

    const limit = rateLimit(`enroll:${user.uid}`, { limit: 30, windowMs: 60 * 1000 })
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many enrollment attempts. Try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } })
    }

    const parsed = safeParse(enrollSchema, await req.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const { courseId } = parsed.data

    const course = await getCourse(courseId)
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    const prices = await getPrices('course', course.id)
    const isFree = prices.length === 0 || prices.every((p) => Number(p.price) === 0 || p.price_type === 'FREE')
    if (!isFree) {
      return NextResponse.json({ error: 'This is a paid course. Complete checkout to enroll.', checkout: `/checkout?product_id=${course.id}&product_type=course` }, { status: 402 })
    }

    const id = `enroll_${user.uid}_${course.id}`
    await getTursoClient().execute({
      sql: `INSERT INTO enrollments (id, auth_user_id, course_id, status, created_at)
            VALUES (?, ?, ?, 'active', datetime('now'))
            ON CONFLICT(auth_user_id, course_id) DO NOTHING`,
      args: [id, user.uid, String(course.id)],
    })
    return NextResponse.json({ ok: true, enrollmentId: id })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to enroll' }, { status: 500 })
  }
}
