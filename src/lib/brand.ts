import brandData from '@/content/brand.json'

/**
 * Single source of brand facts (audit D3). Every public string that names the
 * platform reads from here — never hardcode a brand name in components.
 */
export const BRAND_NAME: string = brandData.name
export const BRAND_TAGLINE: string = brandData.tagline
export const BRAND_DESCRIPTION: string = brandData.description
export const BRAND_LOGO: string = brandData.logo
export const BRAND_SUPPORT_EMAIL: string = brandData.supportEmail
export const BRAND_CURRENCY: string = brandData.currency
export const BRAND_CURRENCIES: string[] = brandData.currencies
export const BRAND_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || brandData.url

export default brandData

/** Replace any legacy reference brand tokens in imported factual strings. */
export function debrand(text: string): string {
  return text
    .replace(/savvy\s*pro/gi, BRAND_NAME)
    .replace(/savvypro/gi, BRAND_NAME)
}
