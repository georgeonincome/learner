import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/turso'
import { ENTITIES, revalidateEntity, type Entity } from '@/lib/cms/store'
import { getAdminIdentity } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Scheduled-publish tick (M4, audit G14). Publishes any entity whose
 * status='scheduled' and publish_at <= now, then revalidates. Invoke via cron
 * (CRON_SECRET bearer) or an admin session. Idempotent.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization') ?? ''
  const viaSecret = secret && auth === `Bearer ${secret}`
  const admin = viaSecret ? null : await getAdminIdentity()
  if (!viaSecret && !admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const now = new Date().toISOString()
  let published = 0
  for (const e of Object.keys(ENTITIES) as Entity[]) {
    const cfg = ENTITIES[e]
    if (!cfg.columns.includes('status') || !cfg.columns.includes('publish_at')) continue
    const due = await query<any>(`SELECT * FROM ${cfg.table} WHERE status='scheduled' AND publish_at IS NOT NULL AND publish_at <= ?`, [now])
    for (const row of due) {
      await query(`UPDATE ${cfg.table} SET status='published', publish_at=NULL WHERE id=?`, [row.id])
      const fresh = { ...row, status: 'published' }
      revalidateEntity(e, fresh)
      await query('INSERT INTO audit_log (actor, action, entity_type, entity_id, diff) VALUES (?,?,?,?,?)',
        ['cron', 'publish.scheduled', e, String(row.id), JSON.stringify({ publish_at: row.publish_at })])
      published++
    }
  }
  return NextResponse.json({ ok: true, published })
}
