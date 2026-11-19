import Stripe from 'stripe'

let stripeInstance: Stripe | undefined

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required')
    }
    // Local stripe-mock transport (no real Stripe account needed for dev/CI).
    const mock = process.env.STRIPE_MOCK_HOST
    const [host, port] = mock ? mock.split(':') : []
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2026-10-28.endive',
      typescript: true,
      ...(mock
        ? { host, port: Number(port || 12111), protocol: 'http' as const }
        : {}),
    })
  }
  return stripeInstance
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
}
