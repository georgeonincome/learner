import './globals.css'
// Legacy reference stylesheets — retired in M9 (Tailwind-only rebuild).
// Kept temporarily so the remaining spec-replay pages render during the build-out.
import '@/styles/vendor.css'
import '@/styles/reference.css'
import { ToastProvider } from '@/components/ui/Toast'
import brand from '@/lib/brand'

export const metadata = {
  title: { default: `${brand.name} — ${brand.tagline}`, template: `%s — ${brand.name}` },
  description: brand.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
