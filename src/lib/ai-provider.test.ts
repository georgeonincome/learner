import { describe, expect, it } from 'vitest'
import { mockAiProvider } from './ai-provider'

async function collect(messages: { role: 'user' | 'assistant'; content: string }[]) {
  let text = ''
  for await (const chunk of mockAiProvider.streamAnswer(messages)) text += chunk
  return text
}

describe('mockAiProvider', () => {
  it('answers money questions with the four income routes', async () => {
    const answer = await collect([{ role: 'user', content: 'How can I earn money online?' }])
    expect(answer).toContain('Gig Economy')
    expect(answer).toContain('Digital Marketing')
  })

  it('answers job questions about freelancing', async () => {
    const answer = await collect([{ role: 'user', content: 'Where can I find online jobs?' }])
    expect(answer.toLowerCase()).toContain('freelance')
  })
})
