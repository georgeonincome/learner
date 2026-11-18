import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { HeroSection, PathPicker, SocialProof, ServicePillars } from '@/components/home'

export default function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <PathPicker />
        <SocialProof />
        <ServicePillars />
        <div data-layout-section className="bg-surface-elevated py-[100px]">
          <div className="mx-auto max-w-[1264px] px-2 text-center">
            <h2 className="font-heading font-bold text-[30px] text-text-primary mb-3">
              Ready to build what&apos;s next?
            </h2>
            <p className="text-text-secondary mb-6">
              Pick your path and start with the skills that matter most to you.
            </p>
            <Link href="/choose-your-path" className="no-underline">
              <Button variant="secondary" size="md" className="rounded-full px-10">
                Find My Path
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
