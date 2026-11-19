import { NextResponse } from 'next/server'
import { communityStore, findGroup, newId } from '@/lib/community-store'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { postSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params
  const group = findGroup(groupId)
  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
  return NextResponse.json({ posts: group.posts })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params
  const group = findGroup(groupId)
  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const authorId = await getCurrentUserId()
  if (!authorId) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const limit = rateLimit(`post:${authorId}`, { limit: 10, windowMs: 60 * 1000 })
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many posts. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const parsed = safeParse(postSchema, await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const { title, body, channel } = parsed.data
  const post = {
    id: newId('post'),
    groupId,
    channel: typeof channel === 'string' && channel ? channel : group.channels[0] ?? 'General',
    authorId,
    authorName: authorId === 'demo-user' ? 'Demo Learner' : 'Learner',
    title: title.trim().slice(0, 200),
    body: body.trim().slice(0, 5000),
    createdAt: new Date().toISOString(),
    likes: [] as string[],
    comments: [],
  }
  // Mutate through the store object reference.
  const stored = communityStore.groups.find((g) => g.id === groupId)
  if (stored) stored.posts.unshift(post)
  return NextResponse.json({ post }, { status: 201 })
}
