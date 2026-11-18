import { describe, expect, it } from 'vitest'
import { rateLimit } from './rate-limit'

describe('rateLimit', () => {
  it('allows requests up to the limit then blocks', () => {
    const key = `test-${Math.random()}`
    const options = { limit: 2, windowMs: 60_000 }
    expect(rateLimit(key, options).allowed).toBe(true)
    expect(rateLimit(key, options).allowed).toBe(true)
    const third = rateLimit(key, options)
    expect(third.allowed).toBe(false)
    expect(third.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('uses independent buckets for different keys', () => {
    const options = { limit: 1, windowMs: 60_000 }
    expect(rateLimit(`a-${Math.random()}`, options).allowed).toBe(true)
    expect(rateLimit(`b-${Math.random()}`, options).allowed).toBe(true)
  })
})
