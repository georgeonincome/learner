import { NextRequest, NextResponse } from 'next/server'
import { getAdminIdentity } from '@/lib/admin-guard'
import { ENTITIES, getEntity, createEntity, updateEntity, type Entity } from '@/lib/cms/store'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Bulk content import (M4, audit G27). Accepts { entities: { courses:[...], ... } }. */
export async function POST(req: NextRequest) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const limit = rateLimit(`cms-import:${admin.uid}`, { limit: 5, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many imports' }, { status: 429 })
  const body = await req.json().catch(() => null)
  const entities = body?.entities
  if (!entities || typeof entities !== 'object') return NextResponse.json({ error: 'entities object required' }, { status: 400 })
  const summary: Record<string, { created: number; updated: number; skipped: number }> = {}
  for (const [name, rows] of Object.entries(entities)) {
    if (!(Object.keys(ENTITIES) as string[]).includes(name) || !Array.isArray(rows)) continue
    const e = name as Entity
    const s = { created: 0, updated: 0, skipped: 0 }
    for (const row of rows as any[]) {
      try {
        const { id, created_at, updated_at, deleted_at, ...data } = row
        if (id != null && (await getEntity(e, id))) { await updateEntity(e, id, data, admin.uid); s.updated++ }
        else { await createEntity(e, data, admin.uid); s.created++ }
      } catch { s.skipped++ }
    }
    summary[name] = s
  }
  return NextResponse.json({ ok: true, summary })
}
