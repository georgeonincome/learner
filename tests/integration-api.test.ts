import { describe, expect, it, vi } from 'vitest'
import Stripe from 'stripe'
import { POST as webhookPOST } from '../src/app/api/webhooks/stripe/route'
import { GET as gateGET } from '../src/app/api/memberships/gate/route'
import { POST as progressPOST } from '../src/app/api/progress/route'
import { query } from '../src/lib/turso'

// Session identity is mocked: route handlers run outside a Next request context.
// Default: an authenticated integration user. Set mocks.uid = null to exercise
// the fail-closed 401 path (audit B10/D8 — no demo-user fallback).
const mocks = vi.hoisted(() => ({ uid: 'integration-user' as string | null }))
vi.mock('@/lib/session', () => ({
  getCurrentUserId: async () => mocks.uid,
  getSessionUser: async () =>
    mocks.uid
      ? { uid: mocks.uid, email: 'integration@lena.local', emailVerified: true, role: 'student' }
      : null,
}))

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://127.0.0.1:3000/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

describe('checkout webhook', () => {
  it('rejects a missing signature', async () => {
    const res = await webhookPOST(new Request('http://127.0.0.1:3000/api/webhooks/stripe', {
      method: 'POST',
      body: '{}',
    }))
    expect(res.status).toBe(400)
  })

  it('rejects an invalid signature', async () => {
    const res = await webhookPOST(new Request('http://127.0.0.1:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'stripe-signature': 't=1,v1=deadbeef' },
      body: '{}',
    }))
    expect(res.status).toBe(400)
  })

  it('verifies a valid signature, fulfils the pending order by id, and is idempotent', async () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET!
    // Server-authoritative flow (M7): checkout writes the pending order first and
    // stamps its id on the session. The webhook never trusts a client amount/id.
    await query(
      `INSERT INTO orders (id, auth_user_id, status, total, currency, entity_type, entity_id)
       VALUES ('order_integration_1', 'integration-user', 'pending', 7500, 'usd', 'course', 1)`,
    )
    await query(
      `INSERT INTO order_items (id, order_id, product_type, product_id, price)
       VALUES ('item_integration_1', 'order_integration_1', 'course', '1', 7500)`,
    )
    const payload = JSON.stringify({
      id: 'evt_integration_1',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_integration_1',
          object: 'checkout.session',
          amount_total: 7500,
          currency: 'usd',
          metadata: { orderId: 'order_integration_1', uid: 'integration-user', entityType: 'course', entityId: '1' },
        },
      },
    })
    const header = Stripe.webhooks.generateTestHeaderString({ payload, secret })
    const req = () => new Request('http://127.0.0.1:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'stripe-signature': header },
      body: payload,
    })

    const first = await webhookPOST(req())
    expect(first.status).toBe(200)
    const orders = await query<{ id: string; status: string }>(
      "SELECT id, status FROM orders WHERE stripe_session_id = 'cs_integration_1'",
    )
    expect(orders).toHaveLength(1)
    expect(orders[0]?.status).toBe('paid')

    const enrollments = await query<{ id: string }>(
      "SELECT id FROM enrollments WHERE auth_user_id = 'integration-user' AND course_id = '1'",
    )
    expect(enrollments).toHaveLength(1)

    // Replaying the same event id must be a no-op (persisted idempotency).
    const second = await webhookPOST(req())
    expect(second.status).toBe(200)
    expect((await second.json()).duplicate).toBe(true)
    const ordersAfter = await query<{ id: string }>(
      "SELECT id FROM orders WHERE stripe_session_id = 'cs_integration_1'",
    )
    expect(ordersAfter).toHaveLength(1)
    const enrollmentsAfter = await query<{ id: string }>(
      "SELECT id FROM enrollments WHERE auth_user_id = 'integration-user' AND course_id = '1'",
    )
    expect(enrollmentsAfter).toHaveLength(1)
  })
})

describe('enrollment / membership gating', () => {
  it('allows public resources and gates paid resources without a membership', async () => {
    const base = 'http://127.0.0.1:3000/api/memberships/gate'
    const pub = await gateGET(new Request(`${base}?resource=public`))
    expect(pub.status).toBe(200)
    expect((await pub.json()).allowed).toBe(true)

    const paid = await gateGET(new Request(`${base}?resource=paid&auth_user_id=integration-user`))
    expect(paid.status).toBe(200)
    expect((await paid.json()).allowed).toBe(false)
  })
})

describe('lesson progress', () => {
  it('rejects unauthenticated writes with 401 (no demo fallback)', async () => {
    mocks.uid = null
    const res = await progressPOST(jsonRequest({ lessonId: 'anon-lesson', completed: true }))
    expect(res.status).toBe(401)
    const rows = await query<{ id: string }>(
      "SELECT id FROM lesson_progress WHERE lesson_id = 'anon-lesson'",
    )
    expect(rows).toHaveLength(0)
    mocks.uid = 'integration-user'
  })

  it('rejects malformed payloads', async () => {
    const res = await progressPOST(jsonRequest({ lessonId: '' }))
    expect(res.status).toBe(400)
  })

  it('upserts progress and returns it', async () => {
    const res = await progressPOST(jsonRequest({
      lessonId: 'integration-lesson',
      completed: true,
      percent: 100,
    }))
    expect(res.status).toBe(200)
    const rows = await query<{ completed: number; percent: number }>(
      "SELECT completed, percent FROM lesson_progress WHERE lesson_id = 'integration-lesson'",
    )
    expect(rows[0]?.completed).toBe(1)
    expect(rows[0]?.percent).toBe(100)
  })
})
