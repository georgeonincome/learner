export const metadata = {
  title: 'Privacy Policy — SavvyPro',
  description: 'SavvyPro privacy policy.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold mb-6" style={{
          fontSize: '24px',
          color: 'var(--color-text-primary)',
        }}>
          Privacy Policy
        </h1>
        <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
          <p className="mb-4">Last updated: November 2026</p>
          <p className="mb-4">SavvyPro respects your privacy. This policy explains what information we collect and how we use it.</p>
          <p className="mb-4">This is a placeholder privacy page. Replace with your own legal copy before production.</p>
        </div>
      </div>
    </div>
  )
}
