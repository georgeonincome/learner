import { Card } from '@/components/ui/Card'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export const metadata = {
  title: 'Visibility Tips Signup — SavvyPro',
  description: 'Sign up for practical tips to grow your online visibility.',
}

export default function VisibilityTipsSignupPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          Visibility Tips Signup
        </h1>
        <p className="text-text-secondary mb-8">
          Sign up for practical tips to grow your online visibility.
        </p>
        <Card className="p-6 max-w-lg">
          <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
            Get the tips
          </h2>
          <LeadCaptureForm
            endpoint="/api/leads/claim"
            slug="visibility-tips"
            buttonLabel="Send me the tips"
            successMessage="You're in! Check your inbox for the visibility tips."
          />
        </Card>
      </div>
    </div>
  )
}
