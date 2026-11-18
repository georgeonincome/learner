import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'About Us — SavvyPro',
  description: 'Learn about SavvyPro — courses, coaching and expert support for people building what\'s next.',
}

export default function AboutUsPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold mb-6" style={{
          fontSize: '24px',
          color: 'var(--color-text-primary)',
        }}>
          About SavvyPro
        </h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-text-secondary mb-4 leading-relaxed">
              SavvyPro is built for people who want practical digital skills, hands-on guidance, and the support to turn expertise into income. We believe anyone can build a digital business — you just need the right skills, systems, and support.
            </p>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Our courses, coaching, and community are designed for small business owners, freelancers, and experts who want to grow online without wasting time on things that don't matter.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <Card className="bg-surface-elevated border border-card rounded-xl p-6">
              <h3 className="font-heading font-bold text-text-primary mb-3" style={{ fontSize: '16px' }}>
                Our mission
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Practical systems, skills, training and hands-on help to grow revenue and build your brand.
              </p>
              <div className="flex gap-3 text-sm">
                <span className="text-text-primary">3,000+ students</span>
                <span className="text-text-primary">12+ countries</span>
                <span className="text-text-primary">14+ years</span>
              </div>
            </Card>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link href="/courses" className="no-underline inline-block">
            <Button variant="primary" size="md">Explore Courses</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
