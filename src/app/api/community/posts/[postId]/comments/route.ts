import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { query } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { commentSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const limit = rateLimit(`comment:${uid}`, { limit: 30, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many comments' }, { status: 429 })
  const post = await query<{ id: string }>('SELECT id FROM community_posts WHERE id = ? AND deleted_at IS NULL LIMIT 1', [postId])
  if (!post.length) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  const parsed = safeParse(commentSchema, await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const id = `comment_${crypto.randomUUID()}`
  await query(
    `INSERT INTO community_comments (id, post_id, author_uid, author_name, body) VALUES (?,?,?,?,?)`,
    [id, postId, uid, 'Learner', parsed.data.body],
  )
  return NextResponse.json({ ok: true, id }, { status: 201 })
}
