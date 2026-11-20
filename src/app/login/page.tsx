import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = pageMeta('login')

export default function Page() {
  return (
    <TemplatePage slug="login">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="mb-6 font-heading text-2xl font-bold text-[var(--color-text-primary)]">Welcome back</h1>
        <LoginForm />
      </div>
    </TemplatePage>
  )
}
