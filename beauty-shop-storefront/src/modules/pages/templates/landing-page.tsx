import type { HomepagePageAttributes } from "@lib/types/cms"
import type { HttpTypes } from "@medusajs/types"
import HomeTemplate from "@modules/home/templates"

type LandingPageTemplateProps = {
  page: HomepagePageAttributes
  region: HttpTypes.StoreRegion
}

/**
 * LandingPageTemplate - For landing pages with sections (e.g., "Chose Package Page")
 * Reuses HomeTemplate to render sections from Strapi Dynamic Zone
 */
export default function LandingPageTemplate({ page, region }: LandingPageTemplateProps) {
  // Landing pages use same structure as homepage (sections in Dynamic Zone)
  // HomepagePageAttributes extends PageAttributes and includes sections
  return <HomeTemplate page={page} region={region} />
}

