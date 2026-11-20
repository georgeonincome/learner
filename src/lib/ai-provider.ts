/**
 * Mock AI provider interface. In production, swap `streamAnswer` for a call
 * to an external LLM provider (OpenAI/Anthropic) with the same signature.
 */

export interface AiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AiProvider {
  streamAnswer(messages: AiMessage[]): AsyncGenerator<string>
}

const moneyOnlineAnswer = `Thanks for asking — there are several legitimate routes to earning online. At Lena Learning we focus on offering value in one of four ways:

1. The Gig Economy — offer services, coaching, or consulting.
2. E-commerce — sell goods you create or source.
3. E-learning — offer courses and educational materials for a fee.
4. Digital Marketing — help businesses reach more customers online.

Our lead trainer teaches straightforward methods that require real effort: curiosity, consistent practice, and the resilience to keep improving when things get tough.`

const jobsAnswer = `Freelance platforms are only one channel — plenty of clients never visit them. With the right skills and mindset, you will find opportunities all around you. A common beginner mistake is hunting for gigs instead of looking for problems to solve. Businesses and individuals want solutions: learn to solve a real problem and work will follow.`

const defaultAnswer = `Great question. At Lena Learning we focus on practical digital skills you can use right away: content creation, freelancing, digital marketing, and building an expert business. Browse our courses to find a path that fits where you are right now, and join the community to ask follow-up questions.`

function pickAnswer(messages: AiMessage[]) {
  const text = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ')
    .toLowerCase()
  if (text.includes('money') || text.includes('earn') || text.includes('income')) {
    return moneyOnlineAnswer
  }
  if (text.includes('job') || text.includes('freelanc') || text.includes('gig')) {
    return jobsAnswer
  }
  return defaultAnswer
}

export const mockAiProvider: AiProvider = {
  async *streamAnswer(messages) {
    const answer = pickAnswer(messages)
    const parts = answer.match(/.{1,40}/gs) ?? [answer]
    for (const part of parts) {
      yield part
    }
  },
}

/** OpenAI-compatible streaming adapter (works with OpenAI, Together, Ollama, etc.). */
const openAiProvider: AiProvider = {
  async *streamAnswer(messages) {
    const base = process.env.AI_BASE_URL || 'https://api.openai.com/v1'
    const key = process.env.AI_API_KEY!
    const model = process.env.AI_MODEL || 'gpt-4o-mini'
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model, stream: true, max_tokens: 500,
        messages: [
          { role: 'system', content: 'You are the Lena Learning assistant. Answer concisely about digital skills, courses and learning. Do not invent pricing or guarantees.' },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    })
    if (!res.ok || !res.body) throw new Error(`AI provider returned ${res.status}`)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (!data || data === '[DONE]') continue
        try {
          const json = JSON.parse(data)
          const text = json.choices?.[0]?.delta?.content
          if (text) yield String(text)
        } catch { /* ignore keepalive/malformed frames */ }
      }
    }
  },
}

/** Anthropic streaming adapter (Messages API). */
const anthropicProvider: AiProvider = {
  async *streamAnswer(messages) {
    const key = process.env.ANTHROPIC_API_KEY!
    const model = process.env.AI_MODEL || 'claude-3-5-haiku-latest'
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model, stream: true, max_tokens: 500,
        system: 'You are the Lena Learning assistant. Answer concisely about digital skills, courses and learning.',
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })
    if (!res.ok || !res.body) throw new Error(`Anthropic returned ${res.status}`)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        try {
          const json = JSON.parse(line.slice(5).trim())
          if (json.type === 'content_block_delta' && json.delta?.text) yield String(json.delta.text)
        } catch { /* ignore */ }
      }
    }
  },
}

/**
 * Select the configured real provider via env; fall back to the documented
 * deterministic mock only when no provider credentials are present.
 */
export function getAiProvider(): AiProvider {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase()
  if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) return anthropicProvider
  if (process.env.AI_API_KEY) return openAiProvider
  return mockAiProvider
}
