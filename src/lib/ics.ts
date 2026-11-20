/** Generate a minimal RFC 5545 iCalendar (VEVENT) string. */
export function createIcsEvent({
  uid,
  title,
  description,
  startsAt,
  endsAt,
  location = 'Online',
}: {
  uid: string
  title: string
  description: string
  startsAt: Date
  endsAt: Date
  location?: string
}) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const esc = (s: string) =>
    s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lena Learning//Learning Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}@lena.local`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(startsAt)}`,
    `DTEND:${fmt(endsAt)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    `LOCATION:${esc(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
