import { NextResponse } from 'next/server'
import { adminStore } from '@/lib/admin-store'
import { getAdminIdentity } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { slug } = await params
  const post = adminStore.posts.find((p) => p.slug === slug)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = (await req.json()) as Partial<typeof post>
  Object.assign(post, body)
  return NextResponse.json({ post })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { slug } = await params
  const index = adminStore.posts.findIndex((p) => p.slug === slug)
  if (index < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  adminStore.posts.splice(index, 1)
  return NextResponse.json({ ok: true })
}
