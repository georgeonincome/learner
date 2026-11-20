import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { parseJson } from '@/lib/content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(_req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const limit = rateLimit(`like:${uid}`, { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const rows = await query<{ likes: string }>('SELECT likes FROM community_posts WHERE id = ? AND deleted_at IS NULL LIMIT 1', [postId])
  if (!rows.length) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  const likes = parseJson<string[]>(rows[0]?.likes, [])
  const next = likes.includes(uid) ? likes.filter((u) => u !== uid) : [...likes, uid]
  await query('UPDATE community_posts SET likes = ? WHERE id = ?', [JSON.stringify(next), postId])
  return NextResponse.json({ ok: true, likes: next })
}
