import { NextResponse } from 'next/server'
import { adminStore } from '@/lib/admin-store'
import { getAdminIdentity } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json({ posts: adminStore.posts })
}

export async function POST(req: Request) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = (await req.json()) as {
    slug?: string
    title?: string
    excerpt?: string
    category?: string
    content?: string
  }
  if (!body.title || !body.slug) {
    return NextResponse.json(
      { error: 'title and slug are required' },
      { status: 400 },
    )
  }
  const post = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt ?? '',
    category: body.category ?? 'General',
    publishedAt: new Date().toISOString().slice(0, 10),
    content: body.content ?? '',
  }
  adminStore.posts.unshift(post)
  return NextResponse.json({ post }, { status: 201 })
}
