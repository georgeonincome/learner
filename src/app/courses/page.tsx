import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const REF = {
  bgHero: '#090e21',
  bgSurface: '#101b2f',
  bgSurfaceElevated: '#16243e',
  textPrimary: '#f8f7f7',
  textSecondary: '#f7f3f3',
  textMuted: '#5b6475',
  primary: '#00a3ff',
  primaryHover: '#008ed6',
  magenta: '#df1488',
  border: '#d9d9d9',
  borderCard: '#64748b',
}

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Courses',
  description: 'Explore our catalog of courses and programs to build your digital skills and grow your business.',
}

export default function CoursesPage() {
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold" style={{
          fontSize: '32px',
          marginBottom: '8px',
          color: REF.textPrimary,
        }}>
          Courses
        </h1>
        <p className="mb-6" style={{ color: REF.textSecondary, maxWidth: '720px' }}>
          Explore our catalog of courses and programs to build your digital skills and grow your business.
        </p>

        <div className="flex gap-3 flex-wrap mb-6">
          <input
            type="text"
            placeholder="Search courses"
            className="flex-1 min-w-[200px] bg-surface border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
          />
          <Button variant="outline" size="sm" className="border-border text-text-muted hover:border-primary hover:text-primary">
            All categories
          </Button>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-text-muted text-xs">Sort by:</span>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary-hover">
              Name
            </Button>
            <Button variant="outline" size="sm" className="border-border text-text-muted hover:border-primary hover:text-primary">
              Price
            </Button>
            <Button variant="outline" size="sm" className="border-border text-text-muted hover:border-primary hover:text-primary">
              Newest
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-text-muted">Showing 6 of 6 courses</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[240px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3" style={{ flexBasis: '22%' }}>
            <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
              Content Creation School
            </div>
            <div className="flex flex-col gap-2 flex-grow-1">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                Content Creation
              </span>
              <h3 className="font-heading font-bold" style={{ fontSize: '18px', color: REF.textPrimary }}>
                Content Creation School 2026
              </h3>
              <p className="flex-1 text-text-secondary text-sm line-clamp-2">
                Learn to create compelling content for social media, blogs, and video platforms.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-heading font-bold" style={{ color: REF.magenta }}>
                  $75 USD
                </span>
              </div>
              <Link href="/course-detail/content-creation-school-2026/36467" className="no-underline w-full">
                <Button variant="primary" size="sm" className="w-full">
                  View Course
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[240px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3" style={{ flexBasis: '22%' }}>
            <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
              How to Create and Sell
            </div>
            <div className="flex flex-col gap-2 flex-grow-1">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                Course Creation
              </span>
              <h3 className="font-heading font-bold" style={{ fontSize: '18px', color: REF.textPrimary }}>
                How to Create and Sell Your First Online Course
              </h3>
              <p className="flex-1 text-text-secondary text-sm line-clamp-2">
                Step-by-step guide to designing, recording, and launching your first online course.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-heading font-bold" style={{ color: REF.magenta }}>
                  $99 USD
                </span>
              </div>
              <Link href="/course-detail/how-to-create-and-sell-your-first-online-course/49870" className="no-underline w-full">
                <Button variant="primary" size="sm" className="w-full">
                  View Course
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[240px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3" style={{ flexBasis: '22%' }}>
            <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
              Zero to Hero Social Media
            </div>
            <div className="flex flex-col gap-2 flex-grow-1">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                Social Media
              </span>
              <h3 className="font-heading font-bold" style={{ fontSize: '18px', color: REF.textPrimary }}>
                Zero to Hero Social Media Manager
              </h3>
              <p className="flex-1 text-text-secondary text-sm line-clamp-2">
                Complete guide to becoming a professional social media manager.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-heading font-bold" style={{ color: REF.magenta }}>
                  $49 USD
                </span>
              </div>
              <Link href="/course-detail/ebook-zero-to-hero-social-media-manager/10317" className="no-underline w-full">
                <Button variant="primary" size="sm" className="w-full">
                  View Course
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[240px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3" style={{ flexBasis: '22%' }}>
            <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
              Start Where You Are
            </div>
            <div className="flex flex-col gap-2 flex-grow-1">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                Personal Development
              </span>
              <h3 className="font-heading font-bold" style={{ fontSize: '18px', color: REF.textPrimary }}>
                Start Where You Are
              </h3>
              <p className="flex-1 text-text-secondary text-sm line-clamp-2">
                A practical guide to starting your business journey from wherever you are right now.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-heading font-bold" style={{ color: REF.primary }}>
                  Free
                </span>
              </div>
              <Link href="/course-detail/start-where-you-are-book/50151" className="no-underline w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Get Free
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[240px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3" style={{ flexBasis: '22%' }}>
            <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
              Zero to Hero Audiobook
            </div>
            <div className="flex flex-col gap-2 flex-grow-1">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                Social Media
              </span>
              <h3 className="font-heading font-bold" style={{ fontSize: '18px', color: REF.textPrimary }}>
                Zero to Hero Social Media Manager (Audiobook)
              </h3>
              <p className="flex-1 text-text-secondary text-sm line-clamp-2">
                Audiobook version of our social media management guide.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-heading font-bold" style={{ color: REF.primary }}>
                  Free
                </span>
              </div>
              <Link href="/course-detail/audiobook-zero-to-hero-social-media-manager/10199" className="no-underline w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Get Free
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[240px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3" style={{ flexBasis: '22%' }}>
            <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
              Free Audiobook Course
            </div>
            <div className="flex flex-col gap-2 flex-grow-1">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                Course Creation
              </span>
              <h3 className="font-heading font-bold" style={{ fontSize: '18px', color: REF.textPrimary }}>
                How to Create and Sell (Audiobook)
              </h3>
              <p className="flex-1 text-text-secondary text-sm line-clamp-2">
                Audiobook version of our flagship course creation guide.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-heading font-bold" style={{ color: REF.primary }}>
                  Free
                </span>
              </div>
              <Link href="/course-detail/free-audiobook-how-to-create-and-sell-your-first-online-course/49906" className="no-underline w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Get Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
