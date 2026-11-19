import './globals.css'
// The reference site's compiled CSS: Bootstrap grid + utilities, the EzyCourse
// theme classes, and the styled-components rules captured from its pages.
// Imported after globals.css so they take precedence over Tailwind's layered
// preflight for shared properties.
import '@/styles/vendor.css'
import '@/styles/reference.css'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata = {
  title: 'SavvyPro',
  description:
    'Practical tools, skills, training and hands-on support to grow revenue and strengthen your brand.',
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
