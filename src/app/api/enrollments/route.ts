import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const enrollments = await query<{ id: string; auth_user_id: string; course_id: string; status: string; created_at: string }>(
      `SELECT id, auth_user_id, course_id, status, created_at FROM enrollments ORDER BY created_at DESC`,
    )
    return NextResponse.json({ enrollments })
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") ?? 'Failed to load enrollments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json()
    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }
    const enrollmentId = `enroll_${Date.now()}`
    await query(
      `INSERT OR IGNORE INTO enrollments (id, auth_user_id, course_id, status, created_at)
       VALUES (?, 'guest', ?, 'active', datetime('now'))`,
      [enrollmentId, courseId],
    )
    return NextResponse.json({ ok: true, enrollmentId })
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") ?? 'Failed to enroll' }, { status: 500 })
  }
}
