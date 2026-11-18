import { NextResponse } from 'next/server'
import { communityStore, findGroup, newId } from '@/lib/community-store'
import { getCurrentUserId } from '@/lib/session'

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

  const { title, body, channel } = await req.json()
  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
  }
  if (typeof body !== 'string' || !body.trim()) {
    return NextResponse.json({ error: 'body required' }, { status: 400 })
  }

  const authorId = await getCurrentUserId()
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
