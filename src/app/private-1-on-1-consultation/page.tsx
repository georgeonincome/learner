import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Private 1-on-1 Consultation — SavvyPro',
  description:
    'Turn your expertise into a coaching, consulting or service business with private consultation.',
}

const offerings = [
  'Structure your offer using a 5-part transformation framework we use with our clients',
  'Discover your profitable niche using our “sweet spot analysis”',
  'A market entry plan with the low-fruit angles',
  'A strategy to get leads from your current audience or circle',
  'An evergreen approach to get leads beyond your current cycle with our litmus-test approach',
  'A well-rounded product collection by selecting the business model combination that suits your individual goals, personal preferences and strengths',
]

const fields = [
  'Health',
  'Fitness',
  'Personal finance',
  'Business finance',
  'Sales',
  'Marketing',
  'Relationships',
  'Leadership',
  'Spirituality',
]

export default function PrivateConsultationPage() {
  return (
    <div className="px-2.5 sm:px-5 pb-16">
      <section className="bg-hero py-16">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-primary font-heading font-bold tracking-wide mb-2">
            VIP PRIVATE CONSULTATION
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4">
            Turn your expertise into a coaching, consulting or service business
          </h1>
          <p className="text-text-secondary leading-relaxed mb-6">
            Dear Coach/Consultant, are you an expert with lots of experience in
            your field? Maybe you have been working in a corporate job and now
            want to use your expertise to create your own gig.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            Your field of expertise could be: {fields.join(' · ')}, and so on.
            You know your knowledge and expertise can help people, but you are
            having challenges packaging, marketing and delivering it to people
            who value it and are willing to pay for it.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Does that sound like you? You could be my ideal client for private
            consultation. If so, here is what I can offer you:
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1000px] pt-14 space-y-10">
        <Card className="p-6">
          <h2 className="font-heading font-bold text-2xl text-text-primary mb-4">
            What I can offer you
          </h2>
          <ul className="space-y-3">
            {offerings.map((o) => (
              <li key={o} className="flex items-start gap-3 text-text-secondary">
                <span className="text-primary">✅</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
            Pricing
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Pricing is a range depending on how we deliver it. It starts from
            K5,000 (about $200) and can be as high as K25,000 (about $1,000).
            The final price depends on whether it will be online or in person
            and other details.
          </p>
          <h3 className="font-heading font-bold text-text-primary mb-2">
            What this offer covers
          </h3>
          <ul className="space-y-2 text-text-secondary">
            <li>✅ GROWTH PATH — we help you map out the next best move to hit your sales targets.</li>
            <li>✅ A clear plan for you to grow with confidence.</li>
          </ul>
        </Card>

        <div className="text-center">
          <p className="text-text-secondary mb-4">
            Let&apos;s chat today if the above resonates with you.
          </p>
          <Link href="/appointment" className="no-underline">
            <Button variant="primary" size="lg">
              Book a private consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
