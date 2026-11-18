import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { mockAiProvider, type AiMessage } from '@/lib/ai-provider'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RATE_LIMIT = 20
const WINDOW_MS = 60 * 60 * 1000
const usage = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(uid: string) {
  const now = Date.now()
  const entry = usage.get(uid)
  if (!entry || now > entry.resetAt) {
    usage.set(uid, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }
  entry.count += 1
  return { allowed: true, remaining: RATE_LIMIT - entry.count }
}

export async function POST(req: Request) {
  const uid = await getCurrentUserId()
  const limit = checkRateLimit(uid)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Message limit reached. Please try again later.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } },
    )
  }

  let messages: AiMessage[]
  try {
    const body = (await req.json()) as { messages?: AiMessage[] }
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'messages are required' }, { status: 400 })
    }
    messages = body.messages.slice(-12).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content ?? '').slice(0, 4000),
    }))
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

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
