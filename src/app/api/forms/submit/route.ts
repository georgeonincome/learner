import { NextResponse } from 'next/server'
import { getTursoClient } from '@/lib/turso'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { formType, name, email, message } = await req.json()
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (typeof formType !== 'string' || !formType) {
      return NextResponse.json({ error: 'formType is required' }, { status: 400 })
    }

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
