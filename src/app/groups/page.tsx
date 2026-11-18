import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Groups — SavvyPro Business Academy',
  description:
    'Learn practical digital marketing skills and business strategies with the SavvyPro Business Academy.',
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
    body: 'We keep all our lessons simple and easy to understand. We remove the fluff from the real stuff so you can avoid confusion.',
  },
  {
    title: 'Practical',
    body: 'We have no time for theories. Get lessons from real life experience and businesses.',
  },
  {
    title: 'Mentorship',
    body: 'Get mentored by peers, mentors and coaches so the journey does not feel alone or lost.',
  },
]

export default function GroupsPage() {
  return (
    <div className="px-2.5 sm:px-5 pb-16">
      <section className="bg-hero py-20">
        <div className="mx-auto max-w-[1200px] text-center">
          <p className="text-primary font-heading font-bold tracking-wide mb-2">
            . Digital Marketing Mastery.
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4">
            BEGINNER TO EXPERT.
          </h1>
          <p className="mx-auto max-w-[760px] text-text-secondary leading-relaxed mb-8">
            Learn practical Digital Marketing skills and business strategies to
            help you build a business, get more clients, build your brand and
            monetize your passion, experience, knowledge and expertise in order
            to build your dream and spread your impact.
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

      <div className="mx-auto max-w-[1200px] pt-14 space-y-16">
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
              SavvyPro is a learning and mentoring platform with a passion to
              deliver relevant and practical information aimed at building your
              dream business in order to attain financial freedom and spread
              your impact.
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Our mission is to help entrepreneurs thrive and grow so as to be
              of wider use to society and the communities in which they operate.
              We aim to be the go-to place for entrepreneurs in sub-Saharan
              Africa where they can find knowledge, guidance, mentorship and
              companionship relevant to business growth.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
              Our Mission
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              To grow small business owners and hustlers and set them up on a
              path to real wealth through practical skills, training, mentorship
              and hands-on help.
            </p>
          </Card>
        </section>
      </div>
    </div>
  )
}
