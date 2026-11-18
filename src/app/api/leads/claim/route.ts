import { NextResponse } from 'next/server'
import { query, getTursoClient } from '@/lib/turso'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { leadSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`lead:${await clientKey(req)}`, {
      limit: 10,
      windowMs: 60 * 1000,
    })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const parsed = safeParse(leadSchema, await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { email, slug } = parsed.data

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
