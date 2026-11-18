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
    const rows = await query<{ id: string; created_at: string }>(
      `SELECT id, created_at FROM webinar_registrations WHERE id = ?`,
      [id],
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    start.setUTCHours(18, 0, 0, 0)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    const ics = createIcsEvent({
      uid: id,
      title: 'SavvyPro Webinar: Beginner Freelancer Blueprint',
      description: "You're registered for the SavvyPro webinar.",
      startsAt: start,
      endsAt: end,
    })
    return new NextResponse(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="webinar-${id}.ics"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
