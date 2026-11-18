import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata = {
  title: 'SavvyPro',
  description: 'Practical tools, skills, training and hands-on support to grow revenue and strengthen your brand.',
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
