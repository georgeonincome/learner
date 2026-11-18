import { NextResponse } from 'next/server'
import { getTursoClient } from '@/lib/turso'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { formSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`form:${await clientKey(req)}`, {
      limit: 10,
      windowMs: 60 * 1000,
    })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const parsed = safeParse(formSchema, await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { formType, name, email, message } = parsed.data

    await getTursoClient().execute(
      `CREATE TABLE IF NOT EXISTS form_submissions (
        id TEXT PRIMARY KEY,
        form_type TEXT NOT NULL,
        name TEXT,
        email TEXT NOT NULL,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    )
    await getTursoClient().execute({
      sql: `INSERT INTO form_submissions (id, form_type, name, email, message, created_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      args: [
        `form_${Date.now()}`,
        formType,
        typeof name === 'string' ? name : '',
        email,
        typeof message === 'string' ? message : '',
      ],
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
