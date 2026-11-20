import './globals.css'
// Legacy reference stylesheets — retired in M9 (Tailwind-only rebuild).
// Kept temporarily so the remaining spec-replay pages render during the build-out.
import { ToastProvider } from '@/components/ui/Toast'
import brand from '@/lib/brand'

export const metadata = {
  // No title.template: buildMetadata() already produces the final branded title
  // (a template here would double the "— Lena" suffix). Pages without their own
  // metadata fall back to this default.
  title: { default: `${brand.name} — ${brand.tagline}` },
  description: brand.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[var(--color-bg-hero)] text-[var(--color-text-primary)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
