import { Card } from '@/components/ui/Card'
import { ChatPanel } from '@/components/ai/ChatPanel'

export const metadata = {
  title: 'Savvybot AI Agent — SavvyPro',
  description: 'Ask the SavvyPro AI assistant about digital skills, freelancing and growing your business.',
}

const faqs = [
  {
    question: 'I want to find ways to earn money online',
    answer:
      'Thanks for asking — there are several legitimate routes to earning online. At SavvyPro we focus on offering value in one of four ways:\n\n1. The Gig Economy — sell services, coaching, or consulting.\n2. E-commerce — sell goods you create or source.\n3. E-learning — offer courses and educational materials for a fee.\n4. Digital Marketing — help businesses reach more customers online.\n\nOur lead trainer teaches straightforward methods that require real effort: curiosity, consistent practice, and the resilience to keep improving when things get tough.',
  },
  {
    question: 'Where can I find online jobs?',
    answer:
      'Freelance platforms are only one channel — plenty of clients never visit them. With the right skills and mindset, you will find opportunities all around you. A common beginner mistake is hunting for gigs instead of looking for problems to solve. Businesses and individuals want solutions: learn to solve a real problem and work will follow.',
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
