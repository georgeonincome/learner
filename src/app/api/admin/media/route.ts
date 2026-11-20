import { NextRequest, NextResponse } from 'next/server'
import { getAdminIdentity } from '@/lib/admin-guard'
import { listMedia, storeUpload } from '@/lib/media'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'audio/mpeg', 'audio/mp4', 'video/mp4', 'application/epub+zip', 'text/plain']
const MAX_BYTES = 50 * 1024 * 1024

export async function GET() {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json({ items: await listMedia() })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminIdentity()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const limit = rateLimit(`media:${admin.uid}`, { limit: 30, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many uploads' }, { status: 429 })
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'file required' }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 413 })
    const mime = file.type || 'application/octet-stream'
    if (!ALLOWED.includes(mime)) return NextResponse.json({ error: `Unsupported type: ${mime}` }, { status: 415 })
    const buf = Buffer.from(await file.arrayBuffer())
    const rec = await storeUpload(buf, file.name, mime, admin.uid)
    return NextResponse.json({ item: rec }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 })
  }
}
