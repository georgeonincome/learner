import { NextResponse } from 'next/server'
import { communityStore } from '@/lib/community-store'
import { getCurrentUserId } from '@/lib/session'

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
  _req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params
  const post = findPost(postId)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const index = post.likes.indexOf(uid)
  if (index >= 0) post.likes.splice(index, 1)
  else post.likes.push(uid)

  return NextResponse.json({ liked: index < 0, count: post.likes.length })
}
