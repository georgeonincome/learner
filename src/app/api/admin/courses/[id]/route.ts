import { NextResponse } from 'next/server'
import { adminStore } from '@/lib/admin-store'
import { getAdminIdentity } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const course = adminStore.courses.find((c) => String(c.id) === id)
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = (await req.json()) as Partial<typeof course>
  Object.assign(course, body)
  return NextResponse.json({ course })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const index = adminStore.courses.findIndex((c) => String(c.id) === id)
  if (index < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  adminStore.courses.splice(index, 1)
  return NextResponse.json({ ok: true })
}
