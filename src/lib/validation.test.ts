import { describe, expect, it } from 'vitest'
import {
  aiChatSchema,
  appointmentSchema,
  formSchema,
  leadSchema,
  progressSchema,
  safeParse,
} from './validation'

describe('validation schemas', () => {
  it('accepts valid progress payloads', () => {
    const result = safeParse(progressSchema, {
      lessonId: 'lesson-1',
      completed: true,
      percent: 100,
    })
    expect(result.success).toBe(true)
  })

  it('rejects progress percentages above 100', () => {
    const result = safeParse(progressSchema, {
      lessonId: 'lesson-1',
      percent: 101,
    })
    expect(result.success).toBe(false)
  })

  it('requires a valid email for lead claims', () => {
    expect(safeParse(leadSchema, { email: 'not-an-email', slug: 'x' }).success).toBe(false)
    expect(safeParse(leadSchema, { email: 'a@b.com', slug: 'x' }).success).toBe(true)
  })

  it('requires formType for form submissions', () => {
    expect(safeParse(formSchema, { email: 'a@b.com' }).success).toBe(false)
  })

  it('rejects invalid appointment dates', () => {
    expect(
      safeParse(appointmentSchema, { staffId: 's1', startsAt: 'not-a-date' }).success,
    ).toBe(false)
  })

  it('limits AI chat history length', () => {
    const messages = Array.from({ length: 13 }, () => ({
      role: 'user' as const,
      content: 'hello',
    }))
    expect(safeParse(aiChatSchema, { messages }).success).toBe(false)
  })
})
