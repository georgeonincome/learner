'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import homeContent from '@/content/home.json'

const REF = {
  primary: '#00a3ff',
  primaryHover: '#008ed6',
  magenta: '#df1488',
  magentaHover: '#b3005f',
  bgHero: '#090e21',
  bgSurface: '#101b2f',
  bgSurfaceElevated: '#16243e',
  textPrimary: '#f8f7f7',
  textSecondary: '#f7f3f3',
  textMuted: '#5b6475',
  textDark: '#16243e',
  resultGold: '#c9a84c',
  goldLight: '#6fa2d3',
  grayLight: '#d9d9dd',
  border: '#d9d9d9',
  borderCard: '#64748b',
}

export function HeroSection() {
  const hero = homeContent.hero
  return (
    <>
    <section data-layout-section className="py-[60px] md:py-[100px]" style={{ backgroundColor: REF.bgHero, color: REF.textPrimary }}>
      <div className="mx-auto max-w-[1264px] px-2 sm:px-2">
        <div className="text-center mb-[64px]">
          <h1 className="font-heading font-bold text-center mx-auto max-w-[776px] text-[28px] md:text-[50px] leading-[1.2] font-normal md:font-medium" style={{
            marginBottom: '24px',
          }}>
            <span style={{ color: REF.textPrimary }}>Build the Skills and </span>
            <span style={{ color: REF.primary }}>Digital Systems</span>
            <span style={{ color: REF.textPrimary }}> to Grow Your Business</span>
            <span style={{ color: REF.magenta }}>.</span>
          </h1>
          <p className="mx-auto text-text-secondary" style={{
            maxWidth: '720px',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '48px',
          }}>
            {hero.sub}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {hero.ctas.map((c, i) => (
            <Link key={i} href={c.href} className="no-underline">
              <Button variant={c.variant === 'magenta' ? 'secondary' : 'primary'} size="md" className={c.variant === 'magenta' ? 'rounded-full' : ''}>
                {c.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <div data-layout-section className="bg-surface py-0">
      <div className="mx-auto max-w-[1264px] px-2 flex gap-3 flex-wrap justify-center py-5">
        {hero.stats.map((s) => (
          <div key={s.value} className="text-center">
            <span className="font-heading font-bold block" style={{
              fontSize: '24px',
              color: REF.textPrimary,
            }}>
              {s.value}
            </span>
            <span className="block text-text-muted" style={{ fontSize: '14px' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export function PathPicker() {
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h2 className="font-heading font-bold text-center" style={{
          fontSize: '24px',
          marginBottom: '8px',
          color: REF.textPrimary,
        }}>
          Choose an option — where are you today?
        </h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {homeContent.paths.map((p) => (
            <div key={p.id} className="flex-1 min-w-[260px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3 flex" style={{ flexBasis: '25%' }}>
              <Link href={`/paths/${p.id}`} className="no-underline block">
                <h3 className="font-heading font-bold" style={{
                  fontSize: '20px',
                  color: REF.textDark,
                  marginBottom: '8px',
                }}>
                  {p.title}
                </h3>
                <p className="flex-1" style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: REF.textDark,
                  marginBottom: '12px',
                }}>
                  {p.sub}
                </p>
                <Button variant="primary" size="md" className="w-full">{p.button}</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SocialProof() {
  return (
    <>
    <div data-layout-section className="py-5 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="text-center">
          <h2 className="font-heading font-bold uppercase tracking-wide" style={{
            color: REF.goldLight,
            fontSize: '20px',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}>
            STUDENT & CLIENT STORIES
          </h2>
          <h2 className="font-heading font-bold" style={{
            fontSize: '34px',
            lineHeight: '1.2',
            marginBottom: '24px',
            color: REF.textPrimary,
          }}>
            Real People. Real Skills. Real Results.
          </h2>
          <p className="mx-auto max-w-[720px] text-text-muted" style={{
            fontFamily: "'anthropic-sans', sans-serif",
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            Read stories from learners at every stage of their journey.
          </p>
        </div>
      </div>
    </div>

    <div data-layout-section className="py-5 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {homeContent.testimonials.map((t) => (
            <div key={t.name} className="flex flex-col h-full p-3 border border-border-card rounded-xl bg-surface-elevated" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <img src="/logo.svg" alt="Widget image" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} />
                <h3 className="font-heading font-bold" style={{ fontSize: '20px', marginTop: '8px', marginBottom: '4px', color: REF.textPrimary }}>
                  {t.name}
                </h3>
                <p style={{ color: REF.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                  {t.role}
                </p>
                <h3 className="font-heading font-bold" style={{ fontSize: '16px', color: REF.textPrimary, marginBottom: '8px' }}>
                  {t.segment}
                </h3>
                <p className="flex-1" style={{
                  color: REF.textSecondary,
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '12px',
                }}>
                  "{t.quote}"
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <h4 className="font-heading font-bold uppercase" style={{
                    color: REF.resultGold,
                    fontWeight: '700',
                    fontSize: '16px',
                    marginBottom: '4px',
                    letterSpacing: '0.05em',
                  }}>
                    THE RESULT
                  </h4>
                  <p style={{ color: REF.textSecondary, fontSize: '14px', margin: 0 }}>
                    {t.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export function ServicePillars() {
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="text-center mb-[48px]">
          <h2 className="font-heading font-bold uppercase tracking-wide" style={{
            color: REF.goldLight,
            fontSize: '20px',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}>
            MORE THAN COURSES
          </h2>
          <p className="mx-auto max-w-[720px] text-gray-light" style={{
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            Practical ways to build your digital capacity
          </p>
        </div>

        <div className="grid gap-3" style={{
          gridTemplateColumns: 'repeat(1, 1fr)',
        }}>
          {homeContent.pillars.map((p) => {
            const label = p.title === 'Learn to do it yourself.'
              ? 'LEARNING'
              : p.title === 'Get expert guidance.'
                ? 'COACHING'
                : 'HIRE HANDS-ON HELP'
            return (
              <div key={p.title} className="flex flex-col gap-2 items-center text-center">
                <div className="flex items-center gap-1 text-primary" style={{ fontSize: '24px', marginBottom: '8px' }}>
                  <span className="font-[FontAwesome]">\uf017</span>
                  <h3 className="font-heading font-bold" style={{ fontSize: '18px', margin: 0 }}>{label}</h3>
                </div>
                <h3 className="font-heading font-bold" style={{ fontSize: '20px', color: REF.textPrimary, marginBottom: '8px' }}>
                  {p.title}
                </h3>
                <p style={{ color: REF.grayLight, fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {p.sub}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function PathLanding({ path }: { path: (typeof homeContent.paths)[number] }) {
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="text-center mb-[48px]">
          <h1 className="font-heading font-bold text-center text-3xl md:text-4xl" style={{
            lineHeight: '1.2',
            marginBottom: '16px',
            color: REF.textPrimary,
          }}>
            {path.title}
          </h1>
          <p className="mx-auto max-w-[720px] text-text-secondary text-sm md:text-base" style={{
            lineHeight: '1.6',
            marginBottom: '8px',
          }}>
            {path.sub}
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Explore courses', sub: 'Browse courses and programs to build your skills.', href: '/courses', label: 'Browse courses' },
            { title: 'Related books', sub: 'Read ebooks and guides on digital business.', href: '/books', label: 'Browse books' },
            { title: 'Get coaching', sub: 'Work with an expert 1-on-1.', href: '/appointment', label: 'Book a session' },
          ].map((c) => (
            <div key={c.title} className="border border-card rounded-xl bg-surface-elevated p-5 flex flex-col h-full">
              <h3 className="font-heading font-bold text-text-primary mb-2" style={{ fontSize: '18px' }}>{c.title}</h3>
              <p className="flex-1 text-text-muted text-sm" style={{ lineHeight: '1.6', marginBottom: '16px' }}>{c.sub}</p>
              <Link href={c.href} className="no-underline inline-block">
                <Button variant="primary" size="sm">{c.label}</Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="no-underline text-primary hover:text-primary-hover font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
