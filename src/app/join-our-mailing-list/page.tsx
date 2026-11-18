import { Card } from '@/components/ui/Card'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export const metadata = {
  title: 'Join Our Mailing List — SavvyPro',
  description: 'Get practical digital skills tips and resources delivered to your inbox.',
}

export default function MailingListPage() {
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold text-[16px] text-text-primary mb-2">
          Join Our Mailing List
        </h1>
        <p className="text-text-secondary mb-8">
          Get practical digital skills tips and resources delivered to your inbox.
        </p>
        <Card className="p-6 max-w-lg">
          <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
            Subscribe
          </h2>
          <LeadCaptureForm
            endpoint="/api/forms/submit"
            formType="mailing-list"
            buttonLabel="Join the list"
            successMessage="Welcome aboard! Check your inbox for a confirmation."
          />
        </Card>
      </div>
    </div>
  )
}
