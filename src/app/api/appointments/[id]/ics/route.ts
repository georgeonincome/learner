import { NextResponse } from 'next/server'
import { query } from '@/lib/turso'
import { createIcsEvent } from '@/lib/ics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const rows = await query<{
      id: string
      starts_at: string
      ends_at: string
      staff_id: string
    }>(
      `SELECT id, starts_at, ends_at, staff_id FROM appointments WHERE id = ?`,
      [id],
    )
    const appt = rows[0]
    if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const ics = createIcsEvent({
      uid: appt.id,
      title: 'Lena Learning Coaching Appointment',
      description: '1-on-1 coaching session',
      startsAt: new Date(appt.starts_at),
      endsAt: new Date(appt.ends_at),
    })
    return new NextResponse(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="appointment-${id}.ics"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
