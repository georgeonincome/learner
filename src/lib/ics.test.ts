import { describe, expect, it } from 'vitest'
import { createIcsEvent } from './ics'

describe('createIcsEvent', () => {
  it('produces a valid VEVENT with escaped text', () => {
    const ics = createIcsEvent({
      uid: 'appt-1',
      title: 'Coaching; session',
      description: 'Line one\nLine two',
      startsAt: new Date('2026-01-01T10:00:00Z'),
      endsAt: new Date('2026-01-01T11:00:00Z'),
    })
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('SUMMARY:Coaching\\; session')
    expect(ics).toContain('DESCRIPTION:Line one\\nLine two')
    expect(ics).toContain('DTSTART:20260101T100000Z')
    expect(ics).toContain('END:VCALENDAR')
  })
})
