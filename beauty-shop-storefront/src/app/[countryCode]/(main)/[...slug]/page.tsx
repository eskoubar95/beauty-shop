import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import { getPageBySlug } from "@lib/data/cms/pages"
import { getLocaleFromCountryCode } from "@lib/utils/locale"
import StandardPageTemplate from "@modules/pages/templates/standard-page"
import LandingPageTemplate from "@modules/pages/templates/landing-page"
import type { PageAttributes, HomepagePageAttributes } from "@lib/types/cms"

// ISR: Revalidate pages every 60 seconds to pick up changes from Strapi
export const revalidate = 60

// Reserved slugs that should not be handled by catch-all
// These are hardcoded routes for commerce functionality
const RESERVED_SLUGS = [
  'homepage', // Handled by /page.tsx
  'products', // Handled by /products/[handle]
  'cart', // Handled by /cart
  'checkout', // Handled by /checkout
  'account', // Handled by /account
  'store', // Handled by /store
  'categories', // Handled by /categories
  'collections', // Handled by /collections
  'order', // Handled by /order
  'blog', // Will be handled by dedicated /blog route
]

type Props = {
  params: Promise<{ countryCode: string; slug: string[] }>
}

/**
 * Generate metadata from Strapi (single source of truth)
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  const locale = getLocaleFromCountryCode(resolvedParams.countryCode)
  
  // Skip metadata generation for reserved routes
  if (RESERVED_SLUGS.includes(slug)) {
    return {}
  }

  const page = await getPageBySlug(slug, locale)
  
  if (page?.seo?.metaTitle) {
    return {
      title: page.seo.metaTitle,
      description: page.seo.metaDescription,
      openGraph: page.seo.ogImage?.data?.url
        ? {
            images: [page.seo.ogImage.data.url],
          }
        : undefined,
    }
  }

  return {
    title: page?.title || "GUAPO - Hudpleje, der virker. Leveret til dig.",
    description: page?.seo?.metaDescription || "Få koreansk hudpleje direkte i din postkasse.",
  }
}

/**
 * Catch-all route for Strapi pages
 * Handles: landing pages, standard pages (Handelsbetingelser, Kontakt, etc.)
 * 
 * Route priority in Next.js:
 * 1. /page.tsx (homepage) - highest priority
 * 2. /products/[handle]/page.tsx - specific route
 * 3. /[...slug]/page.tsx - catch-all (this file)
 */
export default async function DynamicPage(props: Props) {
  const params = await props.params
  const { countryCode, slug } = params
  
  // Join slug array to get full path (e.g., ["handelsbetingelser"] -> "handelsbetingelser")
  const pageSlug = slug.join('/')
  
  // Skip reserved routes (should not reach here, but safety check)
  if (RESERVED_SLUGS.includes(pageSlug)) {
    notFound()
  }

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  // Get locale from country code for Strapi i18n
  const locale = getLocaleFromCountryCode(countryCode)

  // Fetch page from Strapi (single source of truth) with locale
  const page = await getPageBySlug(pageSlug, locale)
  
  // 404 if page not found
  if (!page) {
    notFound()
  }

  // Route to appropriate template based on pageType
  switch (page.pageType) {
    case 'landing':
      // Landing pages use sections (like homepage)
      // Cast to HomepagePageAttributes since landing pages have sections
      return <LandingPageTemplate page={page as HomepagePageAttributes} region={region} />
    
    case 'standard':
    default:
      // Standard pages use simple body content
      return <StandardPageTemplate page={page} />
  }
}

