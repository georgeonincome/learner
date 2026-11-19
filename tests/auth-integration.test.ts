import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as sessionPOST } from '../src/app/api/auth/session/route'
import { GET as meGET } from '../src/app/api/auth/me/route'

function post(body: unknown) {
  return new NextRequest('http://127.0.0.1:3000/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('session creation', () => {
  it('rejects a missing idToken', async () => {
    const res = await sessionPOST(post({}))
    expect(res.status).toBe(400)
  })

  it('rejects a malformed idToken', async () => {
    const res = await sessionPOST(post({ idToken: 'not-a-firebase-token' }))
    expect(res.status).toBe(401)
  })

  it('rejects /me without a session cookie', async () => {
    const res = await meGET()
    expect(res.status).toBe(401)
  })
})
