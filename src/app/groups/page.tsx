import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Groups — SavvyPro Business Academy',
  description:
    'Gain hands-on digital marketing skills and business strategy know-how with the SavvyPro Business Academy.',
}

const skills = [
  'Digital Marketing Strategy Creation',
  'Artificial Intelligence Tools',
  'Content Creation',
  'Graphics Design',
  'Facebook Page Management',
  'CRM Management',
  'Landing Page Design',
  'Sales Funnel Design',
  'Personal Branding Building',
  'Social Media Audience',
  'Email Marketing',
  'Search Engine Marketing',
  'SEO',
]

const reasons = [
  {
    title: 'Simple',
    body: 'Our lessons stay simple and clear. We cut the filler and focus on what matters so you avoid confusion.',
  },
  {
    title: 'Practical',
    body: 'We skip heavy theory. Learn from real-world experience and actual businesses.',
  },
  {
    title: 'Mentorship',
    body: 'Learn alongside peers, mentors and coaches so you never feel stuck on your own.',
  },
]

export default function GroupsPage() {
  return (
    <div className="px-2 sm:px-2 pb-16">
      <section data-layout-section className="bg-hero py-20">
        <div className="mx-auto max-w-[1264px] text-center">
          <p className="text-primary font-heading font-bold tracking-wide mb-2">
            . Digital Marketing Mastery.
          </p>
          <h1 className="font-heading font-bold text-[30px] text-text-primary mb-4">
            BEGINNER TO EXPERT.
          </h1>
          <p className="mx-auto max-w-[760px] text-text-secondary leading-relaxed mb-8">
            Gain useful digital marketing skills and business strategy know-how to grow a business, attract clients, strengthen your brand and turn your experience into income so you can build the dream and widen your impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/courses" className="no-underline">
              <Button variant="primary" size="lg">
                ENROLL NOW
              </Button>
            </Link>
            <a
              href="https://wa.me/260777228827"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Button variant="outline" size="lg">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div data-layout-section className="mx-auto max-w-[1264px] pt-14 space-y-16">
        <section>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-6">
            What is included?
          </h2>
          <h3 className="font-heading font-bold text-xl text-text-primary mb-4">
            Skills You Will Learn
          </h3>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-3 p-3 rounded-lg border border-border-card bg-surface"
              >
                <span className="text-primary">✓</span>
                <span className="text-text-secondary text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-6">
            Why you join us?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map((r) => (
              <Card key={r.title} className="p-5">
                <h3 className="font-heading font-bold text-text-primary text-lg mb-2">
                  {r.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{r.body}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-primary font-heading font-bold text-lg">
            11+ years of experience
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
              About us
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              SavvyPro is a learning and mentoring platform focused on relevant, practical guidance to help you build your business, reach financial freedom and widen your impact.
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              We aim to help entrepreneurs succeed and make a greater contribution to society and their local communities.
              Our goal is to be a trusted hub for entrepreneurs across
              sub-Saharan Africa, offering practical knowledge, coaching,
              mentorship and peer support for business growth.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
              Our Mission
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              To help small business owners and hustlers build lasting wealth through practical skills, training, mentorship and hands-on support.
            </p>
          </Card>
        </section>
      </div>
    </div>
  )
}
