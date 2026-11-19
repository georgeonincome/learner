import { query, getTursoClient } from '@/lib/turso'

/**
 * Server-side learning queries. Shared by the dashboard routes and the
 * /api/enrollments + /api/progress handlers so both read the same data.
 */

export interface EnrollmentRow {
  id: string
  auth_user_id: string
  course_id: string
  status: string
  created_at: string
}

export interface ProgressRow {
  id: string
  auth_user_id: string
  lesson_id: string
  completed: number
  percent: number
  last_position_sec: number
  updated_at: string
}

async function ensureEnrollments() {
  await getTursoClient().execute(
    `CREATE TABLE IF NOT EXISTS enrollments (
       id TEXT PRIMARY KEY,
       auth_user_id TEXT NOT NULL,
       course_id TEXT NOT NULL,
       status TEXT NOT NULL DEFAULT 'active',
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
     )`,
  )
  await getTursoClient().execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_enrollments_user_course
     ON enrollments(auth_user_id, course_id)`,
  )
}

async function ensureProgress() {
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
}

/** Enrollments for a user, or [] when the database is not configured. */
export async function listEnrollments(uid: string): Promise<EnrollmentRow[]> {
  if (!uid) return []
  try {
    await ensureEnrollments()
    return await query<EnrollmentRow>(
      `SELECT id, auth_user_id, course_id, status, created_at
         FROM enrollments WHERE auth_user_id = ? ORDER BY created_at DESC`,
      [uid],
    )
  } catch {
    return []
  }
}

export async function listProgress(uid: string): Promise<ProgressRow[]> {
  if (!uid) return []
  try {
    await ensureProgress()
    return await query<ProgressRow>(
      `SELECT id, auth_user_id, lesson_id, completed, percent, last_position_sec, updated_at
         FROM lesson_progress WHERE auth_user_id = ?`,
      [uid],
    )
  } catch {
    return []
  }
}

export function progressForLesson(rows: ProgressRow[], lessonId: string): ProgressRow | null {
  return rows.find((r) => r.lesson_id === lessonId) || null
}

/** Percent complete for a set of lesson ids, from the user's progress rows. */
export function completionPercent(rows: ProgressRow[], lessonIds: string[]): number {
  if (!lessonIds.length) return 0
  const done = lessonIds.filter((id) => rows.some((r) => r.lesson_id === id && r.completed === 1))
  return Math.round((done.length / lessonIds.length) * 100)
}

/** Access gate: is this user actively enrolled in the course? */
export async function isEnrolled(uid: string, courseId: string): Promise<boolean> {
  const rows = await listEnrollments(uid)
  return rows.some((r) => r.course_id === String(courseId) && r.status === 'active')
}
