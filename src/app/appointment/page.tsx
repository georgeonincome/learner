import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Book an Appointment — SavvyPro',
  description: 'Book a coaching or consulting appointment with a SavvyPro expert.',
}

export default function AppointmentPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h1 className="font-heading font-bold mb-4" style={{
              fontSize: '24px',
              color: 'var(--color-text-primary)',
            }}>
              Book an Appointment
            </h1>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Get expert guidance with a 1-on-1 coaching or consulting session. Choose a time that works for you.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-primary">⏱</span>
                <div>
                  <p className="font-medium text-text-primary">Duration</p>
                  <p className="text-text-muted text-sm">30 or 60 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-primary">📹</span>
                <div>
                  <p className="font-medium text-text-primary">Format</p>
                  <p className="text-text-muted text-sm">Video call</p>
                </div>
              </div>
            </div>
          </div>
          <Card className="bg-surface border border-card rounded-xl shadow-sm p-6">
            <h2 className="font-heading font-bold text-text-primary mb-4" style={{ fontSize: '18px' }}>
              Select a time
            </h2>
            <p className="text-text-muted text-sm mb-6">
              Appointment booking is coming soon. Connect your calendar provider to enable scheduling.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1">
                View Availability
              </Button>
              <Button variant="primary" size="md" className="flex-1">
                Book Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
