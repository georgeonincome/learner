import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Freelancer Webinar — SavvyPro',
  description:
    'Learn the simple steps we use to start freelancing using only your phone.',
}

export default function FreelancerWebinarPage() {
  return (
    <div className="px-2 sm:px-2 pb-16">
      <section data-layout-section className="bg-hero py-20">
        <div className="mx-auto max-w-[1000px] text-center">
          <h1 className="font-heading font-bold text-[36px] text-text-primary mb-4">
            The Beginner Freelancer Blueprint: Earn Your First $100 With Just Your Phone
          </h1>
          <p className="text-text-secondary text-lg mb-8">
            Learn the simple steps we use to start freelancing
          </p>
          <Link href="/webinar-registration-freelancing" className="no-underline">
            <Button variant="primary" size="lg">
              Start Here
            </Button>
          </Link>
        </div>
      </section>

      <div data-layout-section className="mx-auto max-w-[1000px] pt-14 space-y-6 text-text-secondary leading-relaxed">
        <h2 className="font-heading font-bold text-2xl text-text-primary">
          What you&apos;ll learn
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>How to find your first freelance client using only your phone</li>
          <li>Which in-demand digital skills beginners can start with</li>
          <li>How to price and package your services</li>
          <li>How to pitch confidently and close your first sale</li>
        </ul>
        <div className="pt-6">
          <Link href="/webinar-registration-freelancing" className="no-underline">
            <Button variant="primary" size="md">
              Register for the webinar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
