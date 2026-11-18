import { NextResponse } from 'next/server'
import { getTursoClient } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { createIcsEvent } from '@/lib/ics'
import { rateLimit } from '@/lib/rate-limit'
import { webinarSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const uid = await getCurrentUserId()
    const limit = rateLimit(`webinar:${uid}`, { limit: 10, windowMs: 60 * 1000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many registrations. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const parsed = safeParse(webinarSchema, await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { webinarId, name } = parsed.data

    await getTursoClient().execute(
      `CREATE TABLE IF NOT EXISTS webinar_registrations (
        id TEXT PRIMARY KEY,
        auth_user_id TEXT NOT NULL,
        webinar_id TEXT NOT NULL,
        ics_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    )

    const id = `webreg_${Date.now()}`
    // Demo webinar starts 7 days from now at 18:00 UTC, 60 minutes long.
    const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    start.setUTCHours(18, 0, 0, 0)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    const icsUrl = `/api/webinars/register/${id}/ics`

    await getTursoClient().execute({
      sql: `INSERT INTO webinar_registrations (id, auth_user_id, webinar_id, ics_url, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))`,
      args: [id, uid, webinarId, icsUrl],
    })

    const ics = createIcsEvent({
      uid: id,
      title: 'SavvyPro Webinar: Beginner Freelancer Blueprint',
      description: `Hi ${name ?? 'there'}, you're registered for the SavvyPro webinar.`,
      startsAt: start,
      endsAt: end,
    })

    return NextResponse.json(
      {
        ok: true,
        registrationId: id,
        icsUrl,
        startsAt: start.toISOString(),
        ics: Buffer.from(ics).toString('base64'),
      },
      { status: 201 },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
