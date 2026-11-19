import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generates a downloadable SVG certificate. In production, the learner name
 * and course completion would be loaded from Firestore/Turso and verified
 * server-side before issuing the certificate.
 */
export async function GET(req: Request) {
  const uid = await getCurrentUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const name = escapeXml(searchParams.get('name') || 'Learner')
  const course = escapeXml(searchParams.get('course') || 'Course')
  const issued = escapeXml(
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  )
  const certificateId = escapeXml(`LNA-${uid.slice(0, 8).toUpperCase()}`)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="792" viewBox="0 0 1120 792">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#091021"/>
      <stop offset="100%" stop-color="#0f1b3a"/>
    </linearGradient>
  </defs>
  <rect width="1120" height="792" fill="url(#bg)"/>
  <rect x="28" y="28" width="1064" height="736" fill="none" stroke="#00a3ff" stroke-width="3"/>
  <rect x="40" y="40" width="1040" height="712" fill="none" stroke="#00a3ff" stroke-width="1" opacity="0.4"/>
  <text x="560" y="150" text-anchor="middle" fill="#00a3ff" font-family="Georgia, serif" font-size="28" letter-spacing="8">SAVVYPRO</text>
  <text x="560" y="240" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="52">Certificate of Completion</text>
  <text x="560" y="320" text-anchor="middle" fill="#9aa6c0" font-family="Arial, sans-serif" font-size="20">This certificate is proudly presented to</text>
  <text x="560" y="410" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="56" font-weight="bold">${name}</text>
  <line x1="300" y1="430" x2="820" y2="430" stroke="#00a3ff" stroke-width="1"/>
  <text x="560" y="490" text-anchor="middle" fill="#9aa6c0" font-family="Arial, sans-serif" font-size="20">for successfully completing the course</text>
  <text x="560" y="550" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="36">${course}</text>
  <text x="560" y="660" text-anchor="middle" fill="#9aa6c0" font-family="Arial, sans-serif" font-size="16">Issued ${issued} &#183; Certificate ID: ${certificateId}</text>
</svg>`

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="certificate-${course.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.svg"`,
      'Cache-Control': 'no-store',
    },
  })
}
