import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Private 1-on-1 Consultation — SavvyPro',
  description:
    'Build a coaching, consulting or service business from your expertise with private consultation.',
}

const offerings = [
  'Structure your offer using a 5-part transformation framework we use with our clients',
  'Find your profitable niche with our “sweet spot analysis”',
  'A market entry plan built around quick wins',
  'A lead strategy using the audience you already have',
  'A lasting lead approach beyond your current cycle using our litmus test',
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
            Build a coaching, consulting or service business from your expertise
          </h1>
          <p className="text-text-secondary leading-relaxed mb-6">
            Dear Coach/Consultant, do you have deep experience in your field? Perhaps you have spent years in corporate employment and now want to turn your expertise into your own venture.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            Your field of expertise could be: {fields.join(' · ')}, and so on.
            You know your knowledge and expertise can help people, but you are
            having challenges packaging, marketing and delivering it to people
            who value it and are willing to pay for it.
          </p>
          <p className="text-text-secondary leading-relaxed">
            If that describes you, private consultation may be a good fit. Here is what I can offer:
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
            Pricing varies by delivery format. Sessions start at K5,000 (about $200) and can reach K25,000 (about $1,000).
            Your quote depends on the delivery format and session details.
          </p>
          <h3 className="font-heading font-bold text-text-primary mb-2">
            What this offer covers
          </h3>
          <ul className="space-y-2 text-text-secondary">
            <li>✅ GROWTH PATH — we map out the smartest next move toward your sales targets.</li>
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
