/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

/**
 * Hosts the captured reference content actually references (see
 * src/content/pages/*.json). The brief requires a strict CSP; these are the
 * origins the reference's own markup depends on. Override with
 * NEXT_PUBLIC_MEDIA_HOSTS / _FONTS / _FRAMES once brand assets are re-hosted.
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
    ['https://kingsumo.com', 'https://iframe.mediadelivery.net', 'https://web.facebook.com'].join(' '),
)

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  `style-src 'self' 'unsafe-inline' data: ${styleHosts}`,
  `img-src 'self' data: blob: ${mediaHosts}`,
  `font-src 'self' data: ${fontHosts}`,
  "connect-src 'self' http://127.0.0.1:9099 http://127.0.0.1:8080 https://api.stripe.com https://api.cloudinary.com ws:",
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

const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  reactStrictMode: true,
}

module.exports = nextConfig
