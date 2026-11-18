import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-surface text-text-primary py-5">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5">
        <div className="flex justify-between flex-wrap gap-3">
          <p className="mb-2 text-text-secondary">
            SavvyPro — Explore · Learn · Get Support · Get Real-World Help. Classes, coaching and hands-on help for people creating their next chapter.
          </p>
          <p className="mb-2 text-text-secondary">
            {' '}
            Learn · Get Guidance · Get Hands-On Help
          </p>
          <div className="flex gap-3">
            <Link href="/signin" className="no-underline text-primary font-medium hover:text-primary-hover">
              Already have an account? Log in
            </Link>
            <Link href="/contact-us" className="no-underline text-primary font-medium hover:text-primary-hover">
              Something else? Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
