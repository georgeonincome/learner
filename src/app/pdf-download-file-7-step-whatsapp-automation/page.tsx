import { Card } from '@/components/ui/Card'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export const metadata = {
  title: '7-Step WhatsApp Automation PDF — SavvyPro',
  description: 'Download the free 7-step WhatsApp automation guide.',
}

export default function WhatsAppAutomationPdfPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          7-Step WhatsApp Automation PDF
        </h1>
        <p className="text-text-secondary mb-8">
          Download the free 7-step WhatsApp automation guide.
        </p>
        <Card className="p-6 max-w-lg">
          <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
            Get the guide
          </h2>
          <LeadCaptureForm
            endpoint="/api/leads/claim"
            slug="7-step-whatsapp-automation"
            buttonLabel="Download the guide"
            successMessage="Success! Your download link is on its way to your inbox."
          />
        </Card>
      </div>
    </div>
  )
}
