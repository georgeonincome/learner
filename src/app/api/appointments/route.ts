import { NextResponse } from 'next/server'
import { query, getTursoClient } from '@/lib/turso'
import { getCurrentUserId } from '@/lib/session'
import { createIcsEvent } from '@/lib/ics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const uid = await getCurrentUserId()
    const { staffId, startsAt, durationMin, reason } = await req.json()
    if (!staffId || !startsAt) {
      return NextResponse.json(
        { error: 'staffId and startsAt are required' },
        { status: 400 },
      )
    }

    const start = new Date(startsAt)
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: 'Invalid startsAt' }, { status: 400 })
    }
    const minutes = typeof durationMin === 'number' ? durationMin : 30
    const end = new Date(start.getTime() + minutes * 60 * 1000)

    // Overlap check: reject if the staff member already has a confirmed booking.
    const overlapping = await query<{ id: string }>(
      `SELECT id FROM appointments
       WHERE staff_id = ? AND status = 'confirmed'
         AND starts_at < ? AND ends_at > ?`,
      [staffId, end.toISOString(), start.toISOString()],
    ).catch(() => [] as { id: string }[])

    if (overlapping.length > 0) {
      return NextResponse.json(
        { error: 'That time slot is no longer available' },
        { status: 409 },
      )
    }

    await getTursoClient().execute(
      `CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        auth_user_id TEXT NOT NULL,
        staff_id TEXT NOT NULL,
        starts_at DATETIME NOT NULL,
        ends_at DATETIME NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        ics_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    )

    const id = `appt_${Date.now()}`
    const ics = createIcsEvent({
      uid: id,
      title: 'SavvyPro Coaching Appointment',
      description: reason ?? '1-on-1 coaching session',
      startsAt: start,
      endsAt: end,
    })
    const icsUrl = `/api/appointments/${id}/ics`

    await getTursoClient().execute({
      sql: `INSERT INTO appointments
              (id, auth_user_id, staff_id, starts_at, ends_at, status, ics_url, created_at)
            VALUES (?, ?, ?, ?, ?, 'confirmed', ?, datetime('now'))`,
      args: [id, uid, staffId, start.toISOString(), end.toISOString(), icsUrl],
    })

    // Persist the .ics content for later download via a simple data URL scheme.
    return NextResponse.json(
      {
        ok: true,
        appointmentId: id,
        icsUrl,
        ics: Buffer.from(ics).toString('base64'),
      },
      { status: 201 },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
