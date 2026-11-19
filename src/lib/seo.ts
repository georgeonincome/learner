/**
 * SEO fallbacks. The reference site emits a <title> on every page but no meta
 * description, so descriptions are derived per template. Override by adding a
 * `description` to the page spec (src/content/pages/<key>.json).
 */

const BY_TEMPLATE: Record<string, string> = {
  home: 'Practical systems, skills, training and hands-on help to grow revenue and build your brand.',
  catalog: 'Browse courses, programs, books and digital products.',
  'course-detail': 'Course details, curriculum and enrollment.',
  'blog-list': 'Tips, strategies and stories on digital business, marketing and growth.',
  'blog-post': 'Tips, strategies and stories on digital business, marketing and growth.',
  'blog-category': 'Articles in this category.',
  books: 'Books and ebooks on digital business, marketing and content creation.',
  book: 'Book details and how to get your copy.',
  community: 'Community groups, discussions and member libraries.',
  'community-group': 'Group discussion, posts and member contributions.',
  auth: 'Sign in or create your account.',
  account: 'Your account, membership and settings.',
  checkout: 'Complete your purchase securely.',
  legal: 'Information about our programmes, policies and how to reach us.',
  coaching: 'Coaching, appointments and webinar registration.',
  ai: 'AI assistant and chatbot.',
  'lead-magnet': 'Free resources, guides and templates.',
  page: 'Courses, coaching and digital skills programmes.',
}

export function seoDescription(template: string, route: string): string {
  if (BY_TEMPLATE[template]) return BY_TEMPLATE[template]
  const name = route
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return name ? `${name} — courses, coaching and digital skills programmes.` : 'Courses, coaching and digital skills programmes.'
}
