import { Card } from '@/components/ui/Card'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export const metadata = {
  title: '101 Digital Skills PDF Download — SavvyPro',
  description: 'Download our free guide to 101 digital skills for modern businesses.',
}

export default function DigitalSkillsPdfDownloadPage() {
  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          101 Digital Skills PDF Download
        </h1>
        <p className="text-text-secondary mb-8">
          Download our free guide to 101 digital skills for modern businesses.
        </p>
        <Card className="p-6 max-w-lg">
          <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
            Get the free PDF
          </h2>
          <LeadCaptureForm
            endpoint="/api/leads/claim"
            slug="101-digital-skills"
            buttonLabel="Download the PDF"
            successMessage="Success! Your download link is on its way to your inbox."
          />
        </Card>
      </div>
    </div>
  )
}
