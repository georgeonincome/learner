import './globals.css'

export const metadata = {
  title: 'SavvyPro',
  description: 'Practical systems, skills, training and hands-on help to grow revenue and build your brand.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
