import { NextResponse } from 'next/server'
import { adminStore } from '@/lib/admin-store'
import { getAdminIdentity } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json({ courses: adminStore.courses })
}

export async function POST(req: Request) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = (await req.json()) as {
    title?: string
    slug?: string
    category?: string
    description?: string
    price?: number
  }
  if (!body.title || !body.slug) {
    return NextResponse.json(
      { error: 'title and slug are required' },
      { status: 400 },
    )
  }
  const course = {
    id: `course_${Date.now()}`,
    slug: body.slug,
    title: body.title,
    category: body.category ?? 'General',
    description: body.description ?? '',
    price: typeof body.price === 'number' ? body.price : 0,
    isPublished: true,
  }
  adminStore.courses.unshift(course)
  return NextResponse.json({ course }, { status: 201 })
}
