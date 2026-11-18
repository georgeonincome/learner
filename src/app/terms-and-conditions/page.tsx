export const metadata = {
  title: 'Terms and Conditions — SavvyPro',
  description: 'SavvyPro terms and conditions.',
}

export default function TermsAndConditionsPage() {
  return (
    <div className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold mb-6" style={{
          fontSize: '24px',
          color: 'var(--color-text-primary)',
        }}>
          Terms and Conditions
        </h1>
        <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
          <p className="mb-4">Last updated: November 2026</p>
          <p className="mb-4">Welcome to SavvyPro. These terms govern your use of our website and services.</p>
          <p className="mb-4">By accessing or using SavvyPro, you agree to these terms. If you do not agree, you may not use the service.</p>
          <p className="mb-4">This is a placeholder terms page. Replace with your own legal copy before production.</p>
        </div>
      </div>
    </div>
  )
}
