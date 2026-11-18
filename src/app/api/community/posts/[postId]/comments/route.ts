import { NextResponse } from 'next/server'
import { communityStore, newId } from '@/lib/community-store'
import { getCurrentUserId } from '@/lib/session'
import { rateLimit } from '@/lib/rate-limit'
import { commentSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function findPost(postId: string) {
  for (const group of communityStore.groups) {
    const post = group.posts.find((p) => p.id === postId)
    if (post) return post
  }
  return undefined
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params
  const post = findPost(postId)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const authorId = await getCurrentUserId()
  const limit = rateLimit(`comment:${authorId}`, { limit: 20, windowMs: 60 * 1000 })
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many comments. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const parsed = safeParse(commentSchema, await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const { body } = parsed.data
  const comment = {
    id: newId('comment'),
    authorId,
    authorName: authorId === 'demo-user' ? 'Demo Learner' : 'Learner',
    body: body.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
  }
  post.comments.push(comment)
  return NextResponse.json({ comment }, { status: 201 })
}
