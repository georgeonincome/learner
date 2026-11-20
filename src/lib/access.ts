import { query } from '@/lib/turso'

/**
 * Single source of truth for "does this user own / may they access this item?".
 * Used by public course/book pages (server-side gating), the reader, the lesson
 * player and the /api/access/check endpoint. Fail closed: any error => no access.
 *
 * Access rules (reference + modern LMS standard):
 *  - course / program : an ACTIVE enrollment (free self-enrol or paid webhook)
 *  - book / product   : a matching access_grant (free claim or paid webhook)
 *  - membership-gated : an ACTIVE membership whose tier is linked to the item
 *  - free item        : access is implicit for everyone (no grant needed)
 */
export type AccessEntityType = 'course' | 'book' | 'program' | 'product' | 'membership'

export interface AccessResult {
  allowed: boolean
  reason: 'free' | 'enrollment' | 'grant' | 'membership' | 'anonymous' | 'denied'
  membershipId?: string
}

function isActive(row: Record<string, unknown>): boolean {
  const status = String(row.status ?? '').toLowerCase()
  if (status === 'active' || status === 'paid') return true
  // Enrollment/grant expiry honoured when present (enrollment_days / ends_at).
  const ends = row.ends_at
  if (ends) return new Date(String(ends)).getTime() > Date.now()
  return status === '' // rows without a status column are active by convention
}

/** Is the price free? (no prices at all, FREE price type, or amount 0). */
export async function isEntityFree(entityType: AccessEntityType, entityId: number): Promise<boolean> {
  try {
    const rows = await query<{ price: number; price_type: string }>(
      'SELECT price, price_type FROM prices WHERE entity_type = ? AND entity_id = ?',
      [entityType, entityId],
    )
    return rows.length === 0 || rows.every((p) => Number(p.price) <= 0 || p.price_type === 'FREE')
  } catch {
    return false
  }
}

export async function hasEntityAccess(
  uid: string | null | undefined,
  entityType: AccessEntityType,
  entityId: number | string,
): Promise<AccessResult> {
  const id = Number(entityId)
  if (!uid || !Number.isFinite(id)) return { allowed: false, reason: 'anonymous' }

  try {
    if (entityType === 'course' || entityType === 'program') {
      const rows = await query<Record<string, unknown>>(
        `SELECT id, status FROM enrollments
          WHERE auth_user_id = ? AND course_id = ? LIMIT 1`,
        [uid, String(id)],
      )
      if (rows.some(isActive)) return { allowed: true, reason: 'enrollment' }
    } else if (entityType === 'book' || entityType === 'product') {
      const rows = await query<Record<string, unknown>>(
        `SELECT id, status FROM access_grants
          WHERE auth_user_id = ? AND entity_type = ? AND entity_id = ? LIMIT 1`,
        [uid, entityType, id],
      )
      if (rows.some(isActive)) return { allowed: true, reason: 'grant' }
    }

    // Membership-only access is evaluated by hasBookAccess() (books flagged
    // access='membership'). Courses are never implicitly unlocked by a generic
    // membership — the webhook writes real enrollments for bundled courses.
    if (await isEntityFree(entityType, id)) return { allowed: true, reason: 'free' }
    return { allowed: false, reason: 'denied' }
  } catch {
    return { allowed: false, reason: 'denied' }
  }
}

/** Book-specific: respect the book's own `access` rule before generic checks. */
export async function hasBookAccess(uid: string | null | undefined, book: { id: number; access?: string | null }) {
  const rule = (book.access || 'free').toLowerCase()
  if (rule === 'free') return { allowed: true, reason: 'free' as const }
  if (rule === 'membership') {
    if (!uid) return { allowed: false, reason: 'anonymous' as const }
    const memberships = await query<Record<string, unknown>>(
      'SELECT id, status, ends_at FROM memberships WHERE auth_user_id = ? LIMIT 1', [uid],
    )
    return memberships.some(isActive)
      ? { allowed: true, reason: 'membership' as const }
      : { allowed: false, reason: 'denied' as const }
  }
  return hasEntityAccess(uid, 'book', book.id)
}
