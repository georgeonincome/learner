/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

/**
 * CSP: lena serves its own assets + Cloudinary + Stripe + local emulators.
 * Reference CDN hosts remain ONLY until the last spec-replay routes are
 * migrated (M5/M8) and are removed in M9 with the DOM-replay layer.
 */
const list = (v) => v.split(' ').map((s) => s.trim()).filter(Boolean).join(' ')

const mediaHosts = list(
  process.env.NEXT_PUBLIC_MEDIA_HOSTS ||
    [
      'https://ezycourse.b-cdn.net',
      'https://letcheck.b-cdn.net',
      'https://f.ezycourse.net',
      'https://cdn-ezycourse.b-cdn.net',
      'https://savvypro.ezycourse.com',
      'https://images.unsplash.com',
      'https://i.ibb.co',
      'https://static.xx.fbcdn.net',
      'https://res.cloudinary.com',
    ].join(' '),
)

const fontHosts = list(
  process.env.NEXT_PUBLIC_FONT_HOSTS ||
    ['https://cdn.ezycourse.net', 'https://fonts.gstatic.com', 'https://fonts.googleapis.com'].join(' '),
)

const styleHosts = list(process.env.NEXT_PUBLIC_STYLE_HOSTS || 'https://ezysuperfast.b-cdn.net')

const frameHosts = list(
  process.env.NEXT_PUBLIC_FRAME_HOSTS ||
    ['https://kingsumo.com', 'https://iframe.mediadelivery.net', 'https://web.facebook.com', 'https://www.canva.com'].join(' '),
)

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  `style-src 'self' 'unsafe-inline' data: ${styleHosts}`,
  `img-src 'self' data: blob: ${mediaHosts}`,
  `font-src 'self' data: ${fontHosts}`,
  "connect-src 'self' http://127.0.0.1:9099 http://127.0.0.1:8080 http://127.0.0.1:12111 https://api.stripe.com https://api.cloudinary.com ws:",
  `frame-src 'self' ${frameHosts}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: csp },
]

if (isProd) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  })
}

/**
 * Alias + legacy redirects (audit A2/A7, decisions D1/D6). Reference test/legacy
 * payment pages redirect to real commerce surfaces; auth aliases canonicalize.
 */
const redirects = [
  { source: '/home', destination: '/', permanent: true },
  { source: '/forgot-password', destination: '/reset-password', permanent: true },
  { source: '/password-reset-link', destination: '/reset-password', permanent: true },
  { source: '/set-password', destination: '/reset-password', permanent: true },
  { source: '/set-new-password', destination: '/reset-password', permanent: true },
  { source: '/verify-email', destination: '/verify', permanent: true },
  { source: '/verify-reset-code', destination: '/verify', permanent: true },
  { source: '/student-signup', destination: '/signup', permanent: true },
  { source: '/teacher/signup', destination: '/signup', permanent: true },
  { source: '/student', destination: '/dashboard', permanent: true },
  { source: '/student/dashboard', destination: '/dashboard', permanent: true },
  { source: '/kcpay-redirect', destination: '/signin?ref=kcpay-redirect&callbackUrl=/checkout', permanent: true },
  { source: '/kcpay--redirect', destination: '/signin?ref=kcpay--redirect&callbackUrl=/checkout', permanent: true },
  { source: '/kcpay-registration-success', destination: '/you-have-paid?ref=kcpay-registration-success', permanent: true },
  { source: '/payments', destination: '/signin?ref=payments&callbackUrl=/checkout', permanent: true },
  { source: '/testkcpayment', destination: '/signin?ref=testkcpayment&callbackUrl=/checkout', permanent: true },
  { source: '/payforcontentcreationschool', destination: '/signin?ref=payforcontentcreationschool&callbackUrl=/checkout', permanent: true },
  { source: '/books-stripe-payment', destination: '/books?ref=stripe-payment', permanent: true },
]

const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return redirects
  },
  reactStrictMode: true,
}

module.exports = nextConfig
