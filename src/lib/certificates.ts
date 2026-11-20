import crypto from 'node:crypto'
import { query, getTursoClient } from '@/lib/turso'
import { getCourse, getCurriculum } from '@/lib/content'

export interface CertificateRow {
  id: string
  uid: string
  course_id: number
  slug: string
  name: string
  course_title: string
  issued_at: string
}

export interface IssueResult {
  certificate: CertificateRow | null
  reason?: 'not-enrolled' | 'incomplete' | 'already-issued' | 'course-missing'
  percent?: number
}

/** All lessons in a course that the learner completed. */
export async function completionFor(uid: string, courseId: number) {
  const curriculum = await getCurriculum(courseId)
  const ids = curriculum.flatMap((c) => c.lessons.map((l) => String(l.id)))
  const rows = await query<{ lesson_id: string; completed: number }>(
    'SELECT lesson_id, completed FROM lesson_progress WHERE auth_user_id = ?', [uid],
  )
  const done = ids.filter((id) => rows.some((r) => r.lesson_id === id && r.completed === 1))
  return { total: ids.length, done: done.length, percent: ids.length ? Math.round((done.length / ids.length) * 100) : 0 }
}

/** Issue only when enrolled AND every published lesson is complete. Idempotent. */
export async function issueCertificate(uid: string, courseId: number, name: string): Promise<IssueResult> {
  const course = await getCourse(courseId)
  if (!course) return { certificate: null, reason: 'course-missing' }
  const enrollment = await query<{ id: string }>(
    `SELECT id FROM enrollments WHERE auth_user_id = ? AND course_id = ? LIMIT 1`, [uid, String(courseId)],
  )
  if (!enrollment.length) return { certificate: null, reason: 'not-enrolled' }

  const completion = await completionFor(uid, courseId)
  if (completion.total === 0 || completion.percent < 100) {
    return { certificate: null, reason: 'incomplete', percent: completion.percent }
  }

  const existing = await query<CertificateRow>(
    'SELECT * FROM certificates WHERE uid = ? AND course_id = ? LIMIT 1', [uid, courseId],
  )
  if (existing[0]) return { certificate: existing[0] ?? null, reason: 'already-issued' }

  const id = `cert_${crypto.randomUUID()}`
  const slug = `lena-${crypto.randomBytes(6).toString('hex')}`
  await query(
    `INSERT INTO certificates (id, uid, course_id, slug, name, course_title)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, uid, courseId, slug, name, course.title],
  )
  return { certificate: (await query<CertificateRow>('SELECT * FROM certificates WHERE id = ?', [id]))[0] ?? null }
}

export async function listCertificates(uid: string): Promise<CertificateRow[]> {
  return query<CertificateRow>('SELECT * FROM certificates WHERE uid = ? ORDER BY issued_at DESC', [uid])
}

/** Public verification by slug — no auth required, but only stored records. */
export async function getCertificate(slug: string): Promise<CertificateRow | null> {
  const rows = await query<CertificateRow>('SELECT * FROM certificates WHERE slug = ? LIMIT 1', [slug])
  return rows[0] ?? null
}
