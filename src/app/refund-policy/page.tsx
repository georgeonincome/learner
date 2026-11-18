export const metadata = {
  title: 'Refund Policy — SavvyPro',
  description: 'SavvyPro refund policy.',
}

export default function RefundPolicyPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold mb-6" style={{
          fontSize: '24px',
          color: 'var(--color-text-primary)',
        }}>
          Refund Policy
        </h1>
        <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
          <p className="mb-4">Last updated: November 2026</p>
          <p className="mb-4">We want you to be happy with your purchase. If you're not satisfied, contact us within 30 days of purchase to discuss a refund.</p>
          <p className="mb-4">This is a placeholder refund page. Replace with your own legal copy before production.</p>
        </div>
      </div>
    </div>
  )
}
