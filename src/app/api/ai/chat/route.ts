import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { mockAiProvider, type AiMessage } from '@/lib/ai-provider'
import { rateLimit } from '@/lib/rate-limit'
import { aiChatSchema, safeParse } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const uid = await getCurrentUserId()
  const limit = rateLimit(`ai:${uid}`, {
    limit: 20,
    windowMs: 60 * 60 * 1000,
  })
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Message limit reached. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const parsed = safeParse(aiChatSchema, body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const messages: AiMessage[] = parsed.data.messages

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of mockAiProvider.streamAnswer(messages)) {
          controller.enqueue(encoder.encode(chunk))
        }
      } catch {
        controller.enqueue(
          encoder.encode('Sorry, something went wrong. Please try again.'),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-RateLimit-Remaining': String(limit.remaining),
    },
  })
}
