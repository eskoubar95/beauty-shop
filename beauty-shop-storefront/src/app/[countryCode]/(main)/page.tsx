import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import { homepageContent } from "@lib/data/homepage-content"
import BrandLogos from "@modules/home/components/brand-logos"
import WhySection from "@modules/home/components/why-section"
import StepCards from "@modules/home/components/step-cards"
import ProductCards from "@modules/home/components/product-cards"
import StorytellingSection from "@modules/home/components/storytelling-section"
import FaqSection from "@modules/home/components/faq"
import FinalCtaSection from "@modules/home/components/final-cta"

export const metadata: Metadata = {
  title: "GUAPO - Hudpleje, der virker. Leveret til dig.",
  description:
    "Få koreansk hudpleje direkte i din postkasse. Vi samler de bedste produkter og leverer dem til dig hver måned.",
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

  return (
    <main>
      <Hero content={homepageContent.hero} />
      <BrandLogos brandLogos={homepageContent.brandLogos} />
      <WhySection content={homepageContent.whySection} />
      <StepCards cards={homepageContent.stepCards} />
      <ProductCards products={homepageContent.productCards} />
      <StorytellingSection content={homepageContent.storytelling} />
      <FaqSection items={homepageContent.faq} />
      <FinalCtaSection content={homepageContent.finalCta} />
    </main>
  )
}
