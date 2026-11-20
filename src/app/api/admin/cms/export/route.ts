import { NextResponse } from 'next/server'
import { getAdminIdentity } from '@/lib/admin-guard'
import { ENTITIES, listEntity, type Entity } from '@/lib/cms/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Full content export (M4, audit G27): JSON dump of every CMS entity. */
export async function GET() {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const out: Record<string, any[]> = {}
  for (const e of Object.keys(ENTITIES) as Entity[]) {
    out[e] = await listEntity(e, { includeDrafts: true, limit: 5000 })
  }
  return NextResponse.json({ exportedAt: new Date().toISOString(), entities: out })
}
