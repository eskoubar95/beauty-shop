import { Metadata } from "next"

import HomeTemplate from "@modules/home/templates"
import { getRegion } from "@lib/data/regions"
import { getHomepage } from "@lib/data/cms/pages"
import { getLocaleFromCountryCode } from "@lib/utils/locale"

// ISR: Revalidate homepage every 60 seconds to pick up changes from Strapi
export const revalidate = 60

// Generate metadata from Strapi (single source of truth)
export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const params = await props.params
  const locale = getLocaleFromCountryCode(params.countryCode)
  const page = await getHomepage(locale)
  
  return {
    title: page?.seo?.metaTitle || "GUAPO - Hudpleje, der virker. Leveret til dig.",
    description: page?.seo?.metaDescription || "Få koreansk hudpleje direkte i din postkasse. Vi samler de bedste produkter og leverer dem til dig hver måned.",
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  // Get locale from country code for Strapi i18n
  const locale = getLocaleFromCountryCode(countryCode)

  // Strapi is single source of truth - fetch homepage directly with locale
  const page = await getHomepage(locale)
  
  // Graceful error handling: Show placeholder if Strapi content is missing
  // This prevents the site from crashing if homepage is deleted/unpublished in Strapi
  if (!page) {
    return (
      <main>
        <div className="content-container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Homepage under vedligeholdelse</h1>
            <p className="text-gray-600">
              Homepage indhold er ikke tilgængeligt i øjeblikket. Kontakt support hvis problemet fortsætter.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return <HomeTemplate page={page} region={region} />
}

