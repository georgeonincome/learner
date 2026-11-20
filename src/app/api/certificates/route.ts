import { NextResponse } from 'next/server'
import { getVerifiedUserId } from '@/lib/session'
import { getSessionUser } from '@/lib/session'
import { listCertificates, issueCertificate } from '@/lib/certificates'
import { rateLimit } from '@/lib/rate-limit'
import { safeParse } from '@/lib/validation'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const issueSchema = z.object({ courseId: z.number().int().positive(), name: z.string().min(1).max(120) })

export async function GET() {
  const uid = await getVerifiedUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in and verify your email' }, { status: 401 })
  return NextResponse.json({ certificates: await listCertificates(uid) })
}

/** Issue on completion — server verifies every lesson, never trusts the client. */
export async function POST(req: Request) {
  const uid = await getVerifiedUserId()
  if (!uid) return NextResponse.json({ error: 'Sign in and verify your email' }, { status: 401 })
  const limit = rateLimit(`cert:${uid}`, { limit: 20, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  const parsed = safeParse(issueSchema, await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const profileName = (await getSessionUser())?.email?.split('@')[0] ?? 'Learner'
  const result = await issueCertificate(uid, parsed.data.courseId, parsed.data.name || profileName)
  if (!result.certificate) {
    const status = result.reason === 'not-enrolled' ? 403 : result.reason === 'incomplete' ? 409 : 404
    return NextResponse.json({ error: result.reason, percent: result.percent }, { status })
  }
  return NextResponse.json({ certificate: result.certificate })
}
