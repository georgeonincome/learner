import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Choose Your Path — SavvyPro',
  description: 'Where are you right now? Pick your path to get started.',
}

export default function ChooseYourPathPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold text-center text-3xl md:text-4xl" style={{
          lineHeight: '1.2',
          marginBottom: '8px',
          color: 'var(--color-text-primary)',
        }}>
          Choose your path
        </h1>
        <p className="mx-auto max-w-[720px] text-text-secondary text-center" style={{
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '48px',
        }}>
          Pick an option: Where are you right now?
        </p>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {homeContent.paths.map((p) => (
            <div key={p.id} className="border border-card rounded-xl bg-surface-elevated p-5 flex flex-col h-full">
              <h3 className="font-heading font-bold text-text-primary mb-2" style={{ fontSize: '18px' }}>{p.title}</h3>
              <p className="flex-1 text-text-muted text-sm" style={{ lineHeight: '1.6', marginBottom: '16px' }}>{p.sub}</p>
              <Link href={`/${p.id === 1 ? 'getting-started-page' : p.id === 2 ? 'learn-digital-skills' : p.id === 3 ? 'grow-my-business' : p.id === 4 ? 'build-your-expert-business' : 'business-solutions'}`} className="no-underline inline-block">
                <Button variant="primary" size="sm">{p.button}</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
