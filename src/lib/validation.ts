import { z } from 'zod'

export const checkoutSchema = z.object({
  lineItems: z
    .array(
      z.object({
        price: z.string().optional(),
        price_data: z.record(z.string(), z.unknown()).optional(),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .min(1),
  mode: z.enum(['payment', 'subscription']).default('payment'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export const progressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean().default(false),
  percent: z.number().int().min(0).max(100).optional(),
  lastPositionSec: z.number().int().nonnegative().optional(),
})

/** Enrollment: a course id (numeric) or slug. */
export const enrollSchema = z.object({
  courseId: z.string().min(1).max(200),
})

export const postSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
  channel: z.string().max(100).optional(),
})

export const commentSchema = z.object({
  body: z.string().min(1).max(2000),
})

export const leadSchema = z.object({
  email: z.string().email(),
  slug: z.string().min(1).max(200),
})

export const formSchema = z.object({
  formType: z.string().min(1).max(100),
  name: z.string().max(200).optional(),
  email: z.string().email(),
  message: z.string().max(5000).optional(),
  /** Extra fields captured from the reference page's own form markup. */
  fields: z.record(z.string(), z.string()).optional(),
  page: z.string().max(300).optional(),
})

export const appointmentSchema = z.object({
  staffId: z.string().min(1),
  startsAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: 'Invalid startsAt',
  }),
  durationMin: z.number().int().min(15).max(240).optional(),
  reason: z.string().max(2000).optional(),
})

export const webinarSchema = z.object({
  webinarId: z.string().min(1),
  name: z.string().max(200).optional(),
  email: z.string().email(),
})

export const aiChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(4000),
      }),
    )
    .min(1)
    .max(12),
})

export function safeParse<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    return {
      success: false as const,
      error: result.error.issues[0]?.message ?? 'Invalid request',
    }
  }
  return { success: true as const, data: result.data as z.infer<T> }
}
