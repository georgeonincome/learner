import { Card } from '@/components/ui/Card'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export const metadata = {
  title: 'Win a Book — SavvyPro',
  description: 'Enter our book giveaway and get a free digital skills resource.',
}

export default function WinABookPage() {
  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          Win a Book
        </h1>
        <p className="text-text-secondary mb-8">
          Enter our book giveaway and get a free digital skills resource.
        </p>
        <Card className="p-6 max-w-lg">
          <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
            Enter the draw
          </h2>
          <LeadCaptureForm
            endpoint="/api/leads/claim"
            slug="win-a-book"
            buttonLabel="Enter to win"
            successMessage="You're entered! Watch your inbox for the result."
          />
        </Card>
      </div>
    </div>
  )
}
