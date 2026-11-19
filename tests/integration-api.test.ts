import { describe, expect, it } from 'vitest'
import Stripe from 'stripe'
import { POST as webhookPOST } from '../src/app/api/webhooks/stripe/route'
import { GET as gateGET } from '../src/app/api/memberships/gate/route'
import { POST as progressPOST } from '../src/app/api/progress/route'
import { query } from '../src/lib/turso'

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

  it('verifies a valid signature, creates an order, and is idempotent', async () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET!
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
          metadata: { auth_user_id: 'integration-user', course_id: 'course-1' },
        },
      },
    })
    const header = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    })
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
      "SELECT id FROM enrollments WHERE auth_user_id = 'integration-user' AND course_id = 'course-1'",
    )
    expect(enrollments).toHaveLength(1)

    const second = await webhookPOST(req())
    expect(second.status).toBe(200)
    const ordersAfter = await query<{ id: string }>(
      "SELECT id FROM orders WHERE stripe_session_id = 'cs_integration_1'",
    )
    expect(ordersAfter).toHaveLength(1)
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
