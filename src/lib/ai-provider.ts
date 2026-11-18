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

const moneyOnlineAnswer = `Thanks for asking — there are several legitimate routes to earning online. At SavvyPro we focus on offering value in one of four ways:

1. The Gig Economy — offer services, coaching, or consulting.
2. E-commerce — sell goods you create or source.
3. E-learning — offer courses and educational materials for a fee.
4. Digital Marketing — help businesses reach more customers online.

Our lead trainer teaches straightforward methods that require real effort: curiosity, consistent practice, and the resilience to keep improving when things get tough.`

const jobsAnswer = `Freelance platforms are only one channel — plenty of clients never visit them. With the right skills and mindset, you will find opportunities all around you. A common beginner mistake is hunting for gigs instead of looking for problems to solve. Businesses and individuals want solutions: learn to solve a real problem and work will follow.`

const defaultAnswer = `Great question. At SavvyPro we focus on practical digital skills you can use right away: content creation, freelancing, digital marketing, and building an expert business. Browse our courses to find a path that fits where you are right now, and join the community to ask follow-up questions.`

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
