import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { WebinarRegistrationForm } from '@/components/forms/WebinarRegistrationForm'

export const metadata = {
  title: 'Webinar Registration — Freelancing — SavvyPro',
  description: 'Register for the Beginner Freelancer Blueprint webinar.',
}

export default function WebinarRegistrationPage() {
  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          Webinar Registration — Freelancing
        </h1>
        <p className="text-text-secondary mb-8">
          The Beginner Freelancer Blueprint: Earn Your First $100 With Just Your Phone
        </p>

        <Card className="p-6 max-w-lg">
          <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
            Save your seat
          </h2>
          <WebinarRegistrationForm webinarId="freelancer-blueprint" />
        </Card>

        <div className="mt-8">
          <Link href="/freelancer-webinar" className="no-underline text-primary text-sm font-medium">
            ← Back to webinar details
          </Link>
        </div>
      </div>
    </div>
  )
}
