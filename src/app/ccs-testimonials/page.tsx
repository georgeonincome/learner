export const metadata = {
  title: 'CCS Testimonials — SavvyPro',
  description: 'Student stories from the Content Creation School.',
}

export default function CCSTestimonialsPage() {
  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="text-center mb-[48px]">
          <h1 className="font-heading font-bold" style={{
            fontSize: '34px',
            lineHeight: '1.2',
            marginBottom: '16px',
            color: 'var(--color-text-primary)',
          }}>
            CCS Student Stories
          </h1>
          <p className="text-text-secondary" style={{ lineHeight: '1.6' }}>
            Hear from Content Creation School students.
          </p>
        </div>

        <p className="text-text-muted text-center max-w-[720px] mx-auto">
          CCS testimonials coming soon. Meanwhile, browse our main testimonials page.
        </p>
        <div className="mt-8 text-center">
          <a href="/testimonials" className="no-underline text-primary hover:text-primary-hover font-medium">
            View all testimonials →
          </a>
        </div>
      </div>
    </div>
  )
}
