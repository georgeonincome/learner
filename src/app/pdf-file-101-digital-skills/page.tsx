import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'PDF File: 101 Digital Skills — SavvyPro',
  description: 'The 101 Digital Skills PDF guide.',
}

export default function PdfFileDigitalSkillsPage() {
  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[900px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-6">
          PDF File: 101 Digital Skills
        </h1>
        <Card className="p-8 text-center">
          <p className="text-text-secondary mb-6">
            This guide is being prepared. In the meantime, you can request the
            download via the landing page.
          </p>
          <Link
            href="/101-digital-skills-pdf-download"
            className="no-underline text-primary font-medium"
          >
            Go to the download page →
          </Link>
        </Card>
      </div>
    </div>
  )
}
