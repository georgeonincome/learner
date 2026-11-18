import { NextResponse } from 'next/server'
import { query, getTursoClient } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { progressSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ProgressRow {
  id: string
  auth_user_id: string
  lesson_id: string
  completed: number
  percent: number
  last_position_sec: number
  updated_at: string
}

export async function GET(req: Request) {
  try {
    const uid = await getCurrentUserId()
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')

    if (lessonId) {
      const rows = await query<ProgressRow>(
        `SELECT id, auth_user_id, lesson_id, completed, percent, last_position_sec, updated_at
         FROM lesson_progress WHERE auth_user_id = ? AND lesson_id = ?`,
        [uid, lessonId],
      )
      return NextResponse.json({ progress: rows[0] ?? null })
    }

    const rows = await query<ProgressRow>(
      `SELECT id, auth_user_id, lesson_id, completed, percent, last_position_sec, updated_at
       FROM lesson_progress WHERE auth_user_id = ?`,
      [uid],
    )
    return NextResponse.json({ progress: rows })
  } catch {
    // Database may not be configured in local/demo mode — report empty progress.
    return NextResponse.json({ progress: [] })
  }
}

export async function POST(req: Request) {
  try {
    const uid = await getCurrentUserId()
    const limit = rateLimit(`progress:${uid}`, { limit: 60, windowMs: 60 * 1000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many updates. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const parsed = safeParse(progressSchema, await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { lessonId, completed, percent, lastPositionSec } = parsed.data

    // Ensure the table exists in local/demo databases that were never seeded.
    await getTursoClient().execute(
      `CREATE TABLE IF NOT EXISTS lesson_progress (
        id TEXT PRIMARY KEY,
        auth_user_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        percent INTEGER NOT NULL DEFAULT 0,
        last_position_sec INTEGER NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    )
    await getTursoClient().execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson
       ON lesson_progress(auth_user_id, lesson_id)`,
    )

    const id = `prog_${uid}_${lessonId}`
    await getTursoClient().execute({
      sql: `INSERT INTO lesson_progress
              (id, auth_user_id, lesson_id, completed, percent, last_position_sec, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(auth_user_id, lesson_id) DO UPDATE SET
              completed = excluded.completed,
              percent = excluded.percent,
              last_position_sec = excluded.last_position_sec,
              updated_at = datetime('now')`,
      args: [
        id,
        uid,
        lessonId,
        completed ? 1 : 0,
        typeof percent === 'number' ? percent : completed ? 100 : 0,
        typeof lastPositionSec === 'number' ? lastPositionSec : 0,
      ],
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
