import Stripe from 'stripe'

let stripeInstance: Stripe | undefined

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required')
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2026-10-28.endive',
      typescript: true,
    })
  }
  return stripeInstance
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
}
