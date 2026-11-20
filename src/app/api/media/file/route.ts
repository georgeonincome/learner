import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { getLesson } from '@/lib/content'
import { hasEntityAccess, hasBookAccess } from '@/lib/access'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Protected file delivery. A signed-looking media id alone is not enough: the
 * caller must also own the lesson's course or the referenced book (audit D9).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mediaId = String(searchParams.get('mediaId') ?? '')
  const lessonId = String(searchParams.get('lessonId') ?? '')
  const bookId = String(searchParams.get('bookId') ?? '')
  const download = searchParams.get('download') === '1'
  if (!mediaId) return NextResponse.json({ error: 'Missing mediaId' }, { status: 400 })

  const uid = await getCurrentUserId()
  let allowed = false
  if (lessonId) {
    const lesson = await getLesson(Number(lessonId))
    if (lesson) allowed = (await hasEntityAccess(uid, 'course', lesson.course_id)).allowed
  } else if (bookId) {
    const rows = await query<{ id: number; access: string }>('SELECT id, access FROM books WHERE id = ? LIMIT 1', [Number(bookId)])
    if (rows[0]) allowed = (await hasBookAccess(uid, rows[0])).allowed
  }
  if (!uid || !allowed) return NextResponse.json({ error: 'Purchase or enrolment required to download this file.' }, { status: 403 })

  const rows = await query<{ id: string; driver: string; url: string; filename: string; mime: string }>(
    'SELECT id, driver, url, filename, mime FROM media WHERE id = ? LIMIT 1', [mediaId],
  )
  const media = rows[0]
  if (!media) return NextResponse.json({ error: 'File not found' }, { status: 404 })
  if (media.driver === 'cloudinary' || /^https?:\/\//.test(media.url)) {
    return NextResponse.redirect(media.url)
  }

  // Local driver: resolve inside public/media only (no path traversal).
  const dir = path.resolve(process.cwd(), 'public', 'media')
  const file = path.resolve(dir, path.basename(media.url))
  if (!file.startsWith(dir + path.sep) || !fs.existsSync(file)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
  const buf = fs.readFileSync(file)
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': media.mime || 'application/octet-stream',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${media.filename.replace(/"/g, '')}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
