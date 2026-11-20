import { NextRequest, NextResponse } from 'next/server'
import { getAdminIdentity } from '@/lib/admin-guard'
import { ENTITIES, getEntity, updateEntity, deleteEntity, duplicateEntity, restoreRevision, listRevisions, reorder, revalidateEntity, type Entity } from '@/lib/cms/store'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function entityOf(name: string): Entity | null {
  return (Object.keys(ENTITIES) as Entity[]).includes(name as Entity) ? (name as Entity) : null
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ entity: string; id: string }> }) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { entity, id } = await params
  const e = entityOf(entity)
  if (!e) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  const item = await getEntity(e, id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const revisions = await listRevisions(e, id)
  return NextResponse.json({ item, revisions })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ entity: string; id: string }> }) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const limit = rateLimit(`cms:${admin.uid}`, { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const { entity, id } = await params
  const e = entityOf(entity)
  if (!e) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  try {
    const row = await updateEntity(e, id, await req.json(), admin.uid)
    return NextResponse.json({ item: row })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Update failed' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ entity: string; id: string }> }) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { entity, id } = await params
  const e = entityOf(entity)
  if (!e) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  await deleteEntity(e, id, admin.uid)
  return NextResponse.json({ ok: true })
}

/** Actions: duplicate | restore | publish | schedule | reorder | revisions. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ entity: string; id: string }> }) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { entity, id } = await params
  const e = entityOf(entity)
  if (!e) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  const body = await req.json().catch(() => ({}))
  try {
    switch (body.action) {
      case 'duplicate':
        return NextResponse.json({ item: await duplicateEntity(e, id, admin.uid) }, { status: 201 })
      case 'restore':
        return NextResponse.json({ item: await restoreRevision(e, id, Number(body.version), admin.uid) })
      case 'publish': {
        const row = await updateEntity(e, id, { status: 'published', publish_at: null }, admin.uid)
        return NextResponse.json({ item: row })
      }
      case 'schedule': {
        if (!body.publishAt) return NextResponse.json({ error: 'publishAt required' }, { status: 400 })
        const row = await updateEntity(e, id, { status: 'scheduled', publish_at: body.publishAt }, admin.uid)
        return NextResponse.json({ item: row })
      }
      case 'unpublish': {
        const row = await updateEntity(e, id, { status: 'draft' }, admin.uid)
        return NextResponse.json({ item: row })
      }
      case 'reorder': {
        if (!Array.isArray(body.orderedIds)) return NextResponse.json({ error: 'orderedIds required' }, { status: 400 })
        await reorder(e, body.orderedIds, admin.uid)
        const first = await getEntity(e, body.orderedIds[0])
        if (first) revalidateEntity(e, first)
        return NextResponse.json({ ok: true })
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Action failed' }, { status: 400 })
  }
}
