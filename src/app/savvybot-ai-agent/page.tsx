import { Card } from '@/components/ui/Card'
import { ChatPanel } from '@/components/ai/ChatPanel'

export const metadata = {
  title: 'Savvybot AI Agent — SavvyPro',
  description: 'Ask the SavvyPro AI assistant about digital skills, freelancing and growing your business.',
}

const faqs = [
  {
    question: 'I am looking for ways to make money online',
    answer:
      'Thank you for your question, there are many ways to make money online. At SavvyPro, we teach in various ways, mostly around offering something. Here are four main ways we teach you how to make money online:\n\n1. The Gig Economy — you offer services, coaching, or consulting online.\n2. E-commerce — you have goods you want to sell online.\n3. E-learning — providing educational materials such as courses online in exchange for a fee.\n4. Digital Marketing — get more customers for your business online.\n\nOur lead trainer teaches legitimate and straightforward ways to make money online. It takes an interest in learning, a willingness to practice, and resilience to keep going if things do not go well.',
  },
  {
    question: 'Where can I find online jobs?',
    answer:
      'There are many freelancing websites out there and many potential clients who are not even on freelancer websites. Once you have the right skill set and outlook you will realize that opportunities are everywhere. Many beginners make the mistake of searching for opportunities rather than problems they can solve. Entrepreneurs, individuals, and organizations are looking for solutions — learn to solve a problem and the opportunities will follow.',
  },
]

export default function SavvybotPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          Savvybot AI AGENT
        </h1>
        <p className="text-text-secondary mb-8">
          Ask a question about digital skills, freelancing, or growing your
          business.
        </p>

        <Card className="p-6 mb-10">
          <ChatPanel />
        </Card>

        <div className="space-y-6">
          <h2 className="font-heading font-bold text-2xl text-text-primary">
            Frequently asked questions
          </h2>
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-5">
              <p className="font-heading font-bold text-text-primary mb-2">
                QUESTION: {faq.question}
              </p>
              <p className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed">
                ANSWER {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
