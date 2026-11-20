import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { query } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { postSchema, safeParse } from '@/lib/validation'
import { getSpaceById, listPosts, type SpaceRow } from '@/lib/community'
import { hasEntityAccess } from '@/lib/access'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ groupId: string }> }

async function requireAccess(space: SpaceRow) {
  if (space.access === 'free') return true
  const uid = await getCurrentUserId()
  if (!uid) return false
  return (await hasEntityAccess(uid, 'product', space.id)).allowed
}

export async function GET(_req: Request, { params }: Ctx) {
  const { groupId } = await params
  const space = await getSpaceById(groupId)
  if (!space) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
  if (!(await requireAccess(space))) {
    return NextResponse.json({ error: 'Join this group to view its posts', requiresMembership: true }, { status: 403 })
  }
  return NextResponse.json({ posts: await listPosts(space.id) })
}

export async function POST(req: Request, { params }: Ctx) {
  const { groupId } = await params
  const space = await getSpaceById(groupId)
  if (!space) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  if (!(await requireAccess(space))) return NextResponse.json({ error: 'Join this group to post' }, { status: 403 })
  const limit = rateLimit(`post:${uid}`, { limit: 10, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many posts' }, { status: 429 })
  const parsed = safeParse(postSchema, await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { title, body, channel } = parsed.data
  const id = `post_${crypto.randomUUID()}`
  await query(
    `INSERT INTO community_posts (id, space_id, channel, author_uid, author_name, title, body)
     VALUES (?,?,?,?,?,?,?)`,
    [id, space.id, channel || 'General', uid, 'Learner', title, body],
  )
  return NextResponse.json({ ok: true, id }, { status: 201 })
}
