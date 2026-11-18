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

const moneyOnlineAnswer = `Thank you for your question, there are many ways to make money online. At SavvyPro, we teach in various ways, mostly around offering something. Here are four main ways we teach you how to make money online:

1. The Gig Economy — this means you offer services, coaching, or consulting online.
2. E-commerce — this means you have goods you want to sell online.
3. E-learning — this includes providing educational materials such as courses online in exchange for a fee.
4. Digital Marketing — get more customers for your business online.

Our lead trainer teaches legitimate and straightforward ways to make money online. It takes an interest in learning, a willingness to practice, and resilience to keep going.`

const jobsAnswer = `There are many freelancing websites out there and many potential clients who are not even on freelancer websites. Once you have the right skill set and outlook you will realize that opportunities are everywhere. Many beginners make the mistake of searching for opportunities rather than problems they can solve. Entrepreneurs, individuals, and organizations are looking for solutions — learn to solve a problem and the opportunities will follow.`

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
