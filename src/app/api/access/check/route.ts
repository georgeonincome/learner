import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { hasEntityAccess, hasBookAccess, type AccessEntityType } from '@/lib/access'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Public-facing access probe used by the reader / lesson player to gate UI. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const entityType = String(url.searchParams.get('entityType') ?? '') as AccessEntityType
  const entityId = Number(url.searchParams.get('entityId'))
  const allowedTypes: AccessEntityType[] = ['course', 'book', 'program', 'product', 'membership']
  if (!allowedTypes.includes(entityType) || !Number.isInteger(entityId) || entityId <= 0) {
    return NextResponse.json({ error: 'Invalid item' }, { status: 400 })
  }
  const uid = await getCurrentUserId()
  const key = `${uid ?? 'anon'}:${entityType}:${entityId}`
  const limit = rateLimit(`access:${key}`, { limit: 120, windowMs: 60_000 })
  if (!limit.allowed) return NextResponse.json({ error: 'Too many checks' }, { status: 429 })

  let result
  if (entityType === 'book') {
    const { getBook } = await import('@/lib/content')
    const book = await getBook(entityId)
    result = book
      ? await hasBookAccess(uid, book)
      : await hasEntityAccess(uid, entityType, entityId)
  } else {
    result = await hasEntityAccess(uid, entityType, entityId)
  }
  return NextResponse.json(result)
}
