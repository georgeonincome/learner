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
    <section className="py-10 md:py-16" style={{ backgroundColor: REF.bgHero, color: REF.textPrimary }}>
      <div className="mx-auto max-w-[1200px] px-2.5 sm:px-5">
        <div className="text-center mb-[64px]">
          <h1 className="font-heading font-bold text-center" style={{
            fontSize: '36px',
            lineHeight: '1.2',
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

        <div className="flex gap-3 flex-wrap justify-center mb-[64px]">
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
  )
}

export function PathPicker() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold text-center" style={{
          fontSize: '24px',
          marginBottom: '8px',
          color: REF.textPrimary,
        }}>
          Pick an option: Where are you right now?
        </h1>
        <div className="flex gap-3 flex-wrap justify-center">
          {homeContent.paths.map((p) => (
            <div key={p.id} className="flex-1 min-w-[260px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3 flex" style={{ flexBasis: '25%' }}>
              <Link href={`/paths/${p.id}`} className="no-underline block">
                <h1 className="font-heading font-bold" style={{
                  fontSize: '20px',
                  color: REF.textDark,
                  marginBottom: '8px',
                }}>
                  {p.title}
                </h1>
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
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center mb-[48px]">
          <h1 className="font-heading font-bold uppercase tracking-wide" style={{
            color: REF.goldLight,
            fontSize: '20px',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}>
            STUDENT & CLIENT STORIES
          </h1>
          <h1 className="font-heading font-bold" style={{
            fontSize: '34px',
            lineHeight: '1.2',
            marginBottom: '24px',
            color: REF.textPrimary,
          }}>
            Real People. Real Skills. Real Results.
          </h1>
          <p className="mx-auto max-w-[720px] text-text-muted" style={{
            fontFamily: "'anthropic-sans', sans-serif",
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            Hear from students at every stage of their business journey.
          </p>
        </div>

        <div className="grid gap-3" style={{
          gridTemplateColumns: 'repeat(1, 1fr)',
        }}>
          {homeContent.testimonials.map((t) => (
            <div key={t.name} className="flex flex-col h-full p-3 border border-border-card rounded-xl bg-surface-elevated" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <img src="/logo.png" alt="Widget image" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} />
                <h1 className="font-heading font-bold" style={{ fontSize: '20px', marginTop: '8px', marginBottom: '4px', color: REF.textPrimary }}>
                  {t.name}
                </h1>
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
                  <h1 className="font-heading font-bold uppercase" style={{
                    color: REF.resultGold,
                    fontWeight: '700',
                    fontSize: '16px',
                    marginBottom: '4px',
                    letterSpacing: '0.05em',
                  }}>
                    THE RESULT
                  </h1>
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
  )
}

export function ServicePillars() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center mb-[48px]">
          <h1 className="font-heading font-bold uppercase tracking-wide" style={{
            color: REF.goldLight,
            fontSize: '20px',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}>
            MORE THAN COURSES
          </h1>
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
                  <h1 className="font-heading font-bold" style={{ fontSize: '18px', margin: 0 }}>{label}</h1>
                </div>
                <h1 className="font-heading font-bold" style={{ fontSize: '20px', color: REF.textPrimary, marginBottom: '8px' }}>
                  {p.title}
                </h1>
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
