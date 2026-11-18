'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const suggestions = [
  'I am looking for ways to make money online',
  'Where can I find online jobs?',
]

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  async function send(text: string) {
    const question = text.trim()
    if (!question || streaming) return
    setError('')
    const next: Message[] = [
      ...messages,
      { role: 'user', content: question },
      { role: 'assistant', content: '' },
    ]
    setMessages(next)
    setInput('')
    setStreaming(true)

    try {
      const controller = new AbortController()
      abortRef.current = controller
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter((m) => m.content).map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Request failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        setMessages([...next.slice(0, -1), { role: 'assistant', content: answer }])
      }
      setMessages([...next.slice(0, -1), { role: 'assistant', content: answer }])
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-card bg-surface min-h-[320px] p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted text-sm mb-4">
              Ask a question to get started.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full border border-border-card text-sm text-text-secondary hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-surface-elevated text-text-secondary'
                }`}
              >
                <span className="block font-bold text-xs mb-1 opacity-70">
                  {m.role === 'user' ? 'QUESTION' : 'ANSWER'}
                </span>
                {m.content || (streaming ? '…' : '')}
              </div>
            </div>
          ))
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={streaming ? false : !input.trim()}
          onClick={streaming ? () => abortRef.current?.abort() : undefined}
        >
          {streaming ? 'Stop' : 'Send'}
        </Button>
      </form>
      <p className="text-xs text-text-muted">
        Demo assistant — answers are generated locally and limited to 20 messages per hour.
      </p>
    </div>
  )
}
