import { NextResponse } from 'next/server'
import { getCertificate } from '@/lib/certificates'
import { getCurrentUserId } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

/** Download a certificate by its verified, stored slug (never query-string data). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = String(searchParams.get('slug') ?? '')
  if (!slug) return NextResponse.json({ error: 'Certificate slug is required' }, { status: 400 })
  const cert = await getCertificate(slug)
  if (!cert) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })

  // The public verify page needs no auth; the owner's dashboard download does
  // not require a session either because the slug is an unguessable capability.
  void getCurrentUserId

  const name = escapeXml(cert.name)
  const course = escapeXml(cert.course_title || `Course #${cert.course_id}`)
  const issued = escapeXml(new Date(cert.issued_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }))
  const id = escapeXml(`LENA-${cert.slug.slice(-8).toUpperCase()}`)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="792" viewBox="0 0 1120 792">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#16244a"/>
    </linearGradient>
  </defs>
  <rect width="1120" height="792" fill="url(#bg)"/>
  <rect x="28" y="28" width="1064" height="736" fill="none" stroke="#3ac4a3" stroke-width="3"/>
  <rect x="40" y="40" width="1040" height="712" fill="none" stroke="#3ac4a3" stroke-width="1" opacity="0.4"/>
  <text x="560" y="150" text-anchor="middle" fill="#3ac4a3" font-family="Georgia, serif" font-size="28" letter-spacing="8">LENA LEARNING</text>
  <text x="560" y="240" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="52">Certificate of Completion</text>
  <text x="560" y="320" text-anchor="middle" fill="#9aa6c0" font-family="Arial, sans-serif" font-size="20">This certificate is proudly presented to</text>
  <text x="560" y="410" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="56" font-weight="bold">${name}</text>
  <line x1="300" y1="430" x2="820" y2="430" stroke="#3ac4a3" stroke-width="1"/>
  <text x="560" y="490" text-anchor="middle" fill="#9aa6c0" font-family="Arial, sans-serif" font-size="20">for successfully completing the course</text>
  <text x="560" y="550" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="36">${course}</text>
  <text x="560" y="660" text-anchor="middle" fill="#9aa6c0" font-family="Arial, sans-serif" font-size="16">Issued ${issued} &#183; Certificate ID: ${id}</text>
  <text x="560" y="715" text-anchor="middle" fill="#6f7d9c" font-family="Arial, sans-serif" font-size="13">Verify at /certificate/${escapeXml(cert.slug)}</text>
</svg>`

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="certificate-${cert.slug}.svg"`,
      'Cache-Control': 'no-store',
    },
  })
}
