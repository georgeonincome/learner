import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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
      </main>
      <Footer />
    </div>
  )
}
