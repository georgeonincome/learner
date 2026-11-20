import { NextRequest, NextResponse } from 'next/server'
import { getAdminIdentity } from '@/lib/admin-guard'
import { ENTITIES, listEntity, createEntity, type Entity } from '@/lib/cms/store'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function entityOf(name: string): Entity | null {
  return (Object.keys(ENTITIES) as Entity[]).includes(name as Entity) ? (name as Entity) : null
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { entity } = await params
  const e = entityOf(entity)
  if (!e) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  const drafts = new URL(req.url).searchParams.get('drafts') === '1'
  const rows = await listEntity(e, { includeDrafts: drafts })
  return NextResponse.json({ items: rows })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const limit = rateLimit(`cms:${admin.uid}`, { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const { entity } = await params
  const e = entityOf(entity)
  if (!e) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  try {
    const body = await req.json()
    const row = await createEntity(e, body, admin.uid)
    return NextResponse.json({ item: row }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Create failed' }, { status: 400 })
  }
}
