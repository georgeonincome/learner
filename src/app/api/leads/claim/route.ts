import { NextResponse } from 'next/server'
import { query, getTursoClient } from '@/lib/turso'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { email, slug } = await req.json()
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (typeof slug !== 'string' || !slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }

    await getTursoClient().execute(
      `CREATE TABLE IF NOT EXISTS lead_claims (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        lead_magnet_slug TEXT NOT NULL,
        claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    )
    const existing = await query<{ id: string }>(
      `SELECT id FROM lead_claims WHERE email = ? AND lead_magnet_slug = ?`,
      [email, slug],
    )
    if (existing.length === 0) {
      await getTursoClient().execute({
        sql: `INSERT INTO lead_claims (id, email, lead_magnet_slug, claimed_at)
              VALUES (?, ?, ?, datetime('now'))`,
        args: [`lead_${Date.now()}`, email, slug],
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
