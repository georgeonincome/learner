import { Card } from '@/components/ui/Card'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Testimonials — SavvyPro',
  description: 'Read stories from learners at every stage of their journey.',
}

export default function TestimonialsPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center mb-[48px]">
          <h1 className="font-heading font-bold" style={{
            fontSize: '34px',
            lineHeight: '1.2',
            marginBottom: '16px',
            color: 'var(--color-text-primary)',
          }}>
            Student & Client Stories
          </h1>
          <p className="text-text-secondary" style={{ lineHeight: '1.6' }}>
            Read stories from learners at every stage of their journey.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {homeContent.testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col h-full p-5">
              <h3 className="font-heading font-bold text-text-primary mb-2" style={{ fontSize: '18px' }}>{t.name}</h3>
              <p className="text-text-secondary text-sm mb-3">{t.role}</p>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-badge text-text-primary mb-4">
                {t.segment}
              </span>
              <p className="flex-1 text-text-muted text-sm mb-4" style={{ lineHeight: '1.6' }}>
                "{t.quote}"
              </p>
              <div className="mt-auto pt-3 border-t border-border">
                <span className="text-xs font-medium text-text-primary">The result:</span>{' '}
                <span className="text-text-secondary text-sm">{t.result}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
