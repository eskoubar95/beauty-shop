/**
 * Locale Utilities
 * Maps Medusa country codes to Strapi locale codes for i18n integration
 */

/**
 * Mapping from Medusa country codes (ISO 3166-1 alpha-2) to Strapi locale codes (BCP 47)
 * 
 * Medusa uses country codes (dk, se, gb) for regions
 * Strapi i18n uses BCP 47 locale codes (da-DK, sv-SE, en) for content
 * 
 * Note: Strapi uses full BCP 47 format (e.g., da-DK) not just language codes (da)
 */
const COUNTRY_TO_LOCALE_MAP: Record<string, string> = {
  // Denmark
  dk: 'da-DK',
  // Sweden
  se: 'sv-SE',
  // United Kingdom
  gb: 'en',
  // United States (fallback)
  us: 'en',
  // Germany
  de: 'de-DE',
  // France
  fr: 'fr-FR',
  // Spain
  es: 'es-ES',
  // Italy
  it: 'it-IT',
  // Norway
  no: 'no-NO',
  // Finland
  fi: 'fi-FI',
}

/**
 * Default locale if country code is not found
 */
const DEFAULT_LOCALE = 'da-DK'

/**
 * Get Strapi locale code from Medusa country code
 * @param countryCode - Medusa country code (e.g., "dk", "se", "gb")
 * @returns Strapi locale code (e.g., "da-DK", "sv-SE", "en")
 */
export function getLocaleFromCountryCode(countryCode: string | undefined | null): string {
  if (!countryCode) {
    return DEFAULT_LOCALE
  }

  const normalizedCountryCode = countryCode.toLowerCase()
  return COUNTRY_TO_LOCALE_MAP[normalizedCountryCode] || DEFAULT_LOCALE
}

/**
 * Get all supported locales
 * @returns Array of locale codes
 */
export function getSupportedLocales(): string[] {
  return Array.from(new Set(Object.values(COUNTRY_TO_LOCALE_MAP)))
}

/**
 * Check if a locale is supported
 * @param locale - Locale code to check
 * @returns True if locale is supported
 */
export function isLocaleSupported(locale: string): boolean {
  return getSupportedLocales().includes(locale.toLowerCase())
}

