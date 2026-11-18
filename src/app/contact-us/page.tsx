import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export const metadata = {
  title: 'Contact Us — SavvyPro',
  description: 'Have a question? Get in touch with the SavvyPro team.',
}

export default function ContactUsPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-heading font-bold" style={{
              fontSize: '24px',
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
            }}>
              Contact Us
            </h1>
            <p className="text-text-secondary mb-6" style={{ lineHeight: '1.6' }}>
              Have a different inquiry? We'd love to hear from you. Whether you're interested in courses, coaching, or custom solutions, get in touch.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-primary">✉</span>
                <div>
                  <p className="font-medium text-text-primary">Email</p>
                  <p className="text-text-muted text-sm">hello@savvypro.example</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-primary">📍</span>
                <div>
                  <p className="font-medium text-text-primary">Location</p>
                  <p className="text-text-muted text-sm">Online — serving students worldwide</p>
                </div>
              </div>
            </div>
          </div>
          <Card className="bg-surface border border-card rounded-xl shadow-sm p-6">
            <h2 className="font-heading font-bold text-text-primary mb-4" style={{ fontSize: '18px' }}>
              Send us a message
            </h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
              <Input
                label="Name"
                placeholder="Your name"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
              />
              <Input
                label="Message"
                placeholder="How can we help you?"
                required
              />
              <Alert variant="info" title="Sending">
                This is a demo contact form. In production, connect it to your email provider.
              </Alert>
              <Button type="submit" variant="primary" size="md" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
