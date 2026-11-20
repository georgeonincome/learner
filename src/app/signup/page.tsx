import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import SignupForm from '@/components/auth/SignupForm'

export const metadata = pageMeta('signup')

export default function Page() {
  return (
    <TemplatePage slug="signup">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="mb-6 font-heading text-2xl font-bold text-[var(--color-text-primary)]">Create your account</h1>
        <SignupForm />
      </div>
    </TemplatePage>
  )
}
