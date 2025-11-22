import Hero from "@modules/home/components/hero"
import BrandLogos from "@modules/home/components/brand-logos"
import WhySection from "@modules/home/components/why-section"
import StepCards from "@modules/home/components/step-cards"
import ProductCards from "@modules/home/components/product-cards"
import StorytellingSection from "@modules/home/components/storytelling-section"
import FaqSection from "@modules/home/components/faq"
import FinalCtaSection from "@modules/home/components/final-cta"
import type { HomepagePageAttributes, HomepageSection } from "@lib/types/cms"
import { HttpTypes } from "@medusajs/types"
import type { ProductCard } from "@lib/types/homepage"

type HomeTemplateProps = {
  page: HomepagePageAttributes
  region: HttpTypes.StoreRegion
}

/**
 * Helper to get image URL from Strapi media
 * Handles both structures:
 * - Old: { data: { url: string } }
 * - New (direct): { url: string }
 */
function getImageUrl(
  image?: { data?: { url: string } | null; url?: string } | null
): string {
  // Try new structure first (direct url)
  if (image?.url) {
    if (image.url.startsWith('http')) {
      return image.url;
    }
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
    return `${strapiUrl}${image.url}`;
  }
  
  // Fallback to old structure (wrapped in data)
  if (image?.data?.url) {
    if (image.data.url.startsWith('http')) {
      return image.data.url;
    }
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
    return `${strapiUrl}${image.data.url}`;
  }
  
  return '';
}

/**
 * Render a single section from Strapi
 */
function renderSection(section: HomepageSection, region: HttpTypes.StoreRegion) {
  switch (section.__component) {
    case 'homepage.hero-section': {
      return (
        <Hero
          key={`hero-${section.internalLabel || 'hero'}`}
          content={{
            title: section.title,
            body: section.body,
            ctaText: section.primaryCtaLabel,
            imageUrl: getImageUrl(section.image),
            imageAlt: section.imageAlt || section.image?.data?.alternativeText,
          }}
        />
      );
    }
    case 'homepage.brand-logos-section': {
      const brandLogosSection = section as import('@lib/types/cms').HomepageBrandLogosSection;
      if (!brandLogosSection.logos || brandLogosSection.logos.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[HomeTemplate] Brand logos section has no logos array');
        }
        return null;
      }
      
      // Debug: Log logo structure
      if (process.env.NODE_ENV === 'development') {
        console.log('[HomeTemplate] Brand logos section data:', {
          logosCount: brandLogosSection.logos.length,
          logos: brandLogosSection.logos.map((logo, idx) => ({
            index: idx,
            name: logo.name,
            hasLogo: !!logo.logo,
            logoUrl: logo.logo?.url || logo.logo?.data?.url,
            logoStructure: logo.logo ? (logo.logo.url ? 'direct' : logo.logo.data ? 'wrapped' : 'unknown') : 'none',
          })),
        });
      }
      
      const logos = brandLogosSection.logos
        .map((logo) => {
          const url = getImageUrl(logo.logo);
          if (process.env.NODE_ENV === 'development' && !url) {
            console.warn(`[HomeTemplate] Logo "${logo.name}" has no valid URL:`, logo.logo);
          }
          return url;
        })
        .filter((url) => url !== '');
      
      if (logos.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[HomeTemplate] Brand logos section has no valid logo URLs after mapping');
          console.warn('[HomeTemplate] All logos:', brandLogosSection.logos);
        }
        return null;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[HomeTemplate] Brand logos URLs:', logos);
      }
      
      return (
        <BrandLogos
          key={`brandLogos-${brandLogosSection.internalLabel || 'brandLogos'}`}
          brandLogos={logos}
        />
      );
    }
    case 'homepage.why-section': {
      if (!section.title || !section.subtitle) return null;
      return (
        <WhySection
          key={`why-${section.internalLabel || 'why'}`}
          content={{
            title: section.title,
            body: section.subtitle,
            imageUrl: getImageUrl(section.image),
            imageAlt: section.imageAlt || section.image?.data?.alternativeText,
          }}
        />
      );
    }
    case 'homepage.step-cards-section': {
      const stepCardsSection = section as import('@lib/types/cms').HomepageStepCardsSection;
      if (!stepCardsSection.steps || stepCardsSection.steps.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[HomeTemplate] Step cards section has no steps');
        }
        return null;
      }
      return (
        <StepCards
          key={`steps-${stepCardsSection.internalLabel || 'steps'}`}
          cards={stepCardsSection.steps.map((step) => ({
            title: step.title,
            body: step.body,
            icon: step.icon || '',
            color: step.color || 'default',
          }))}
        />
      );
    }
    case 'homepage.product-section': {
      const productSection = section as import('@lib/types/cms').HomepageProductSection;
      
      if (!productSection.productHandles || productSection.productHandles.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[HomeTemplate] Product section has no productHandles');
        }
        return null;
      }
      
      // Create placeholder product cards based on handles
      // TODO: Replace with actual product card data from Strapi when ready
      const productCards: ProductCard[] = productSection.productHandles.map((handle, index) => {
        // Placeholder data - will be replaced with Strapi data later
        const handleTitle = handle.charAt(0).toUpperCase() + handle.slice(1);
        return {
          id: `product-${handle}-${index}`,
          title: handleTitle,
          subtitle: `Abonnement på ${handleTitle.toLowerCase()} skincare box`,
          badge: undefined,
          features: [],
          price: {
            firstMonth: 0, // TODO: Add from Strapi
            subsequent: 0, // TODO: Add from Strapi
          },
          imageUrl: '', // TODO: Add from Strapi
          imageAlt: handleTitle,
          ctaText: productSection.ctaLabel || 'Køb nu',
          ctaHref: productSection.ctaLink || `#${handle}`,
        };
      });
      
      return (
        <ProductCards
          key={`product-${productSection.internalLabel || 'product'}`}
          products={productCards}
        />
      );
    }
    case 'homepage.storytelling-section': {
      if (!section.title || !section.body) return null;
      return (
        <StorytellingSection
          key={`storytelling-${section.internalLabel || 'storytelling'}`}
          content={{
            kicker: section.kicker,
            title: section.title,
            body: section.body,
            imageUrl: getImageUrl(section.image),
            imageAlt: section.imageAlt || section.image?.data?.alternativeText,
            highlights: section.highlights?.map((h) => ({
              title: h.title,
              description: h.description,
            })),
            quote: section.quote
              ? {
                  text: section.quote.text,
                  author: section.quote.author,
                  role: section.quote.role,
                }
              : undefined,
          }}
        />
      );
    }
    case 'homepage.faq-section': {
      if (!section.items) return null;
      return (
        <FaqSection
          key={`faq-${section.internalLabel || 'faq'}`}
          items={section.items.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))}
        />
      );
    }
    case 'homepage.final-cta-section': {
      if (!section.title || !section.body || !section.primaryCtaLabel || !section.primaryCtaLink) {
        return null;
      }
      return (
        <FinalCtaSection
          key={`finalCta-${section.internalLabel || 'finalCta'}`}
          content={{
            title: section.title,
            body: section.body,
            supportingPoints: section.supportingPoints,
            primaryCta: {
              label: section.primaryCtaLabel,
              href: section.primaryCtaLink,
            },
            secondaryCta: section.secondaryCtaLabel && section.secondaryCtaLink
              ? {
                  label: section.secondaryCtaLabel,
                  href: section.secondaryCtaLink,
                }
              : undefined,
            imageUrl: getImageUrl(section.image),
            imageAlt: section.imageAlt,
          }}
        />
      );
    }
    default:
      return null;
  }
}

/**
 * HomeTemplate - Homepage template component
 * 
 * Renders sections directly from Strapi in order (Strapi is single source of truth).
 * Følger samme pattern som andre moduler (products, store, order).
 */
export default function HomeTemplate({ page, region }: HomeTemplateProps) {
  if (!page.sections || page.sections.length === 0) {
    return (
      <main>
        <div className="content-container py-12">
          <p>No sections configured in Strapi.</p>
        </div>
      </main>
    );
  }

  // Debug: Log sections in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[HomeTemplate] Rendering sections:', page.sections.map(s => ({
      component: s.__component,
      internalLabel: (s as any).internalLabel,
    })));
  }

  // Render sections in order from Strapi (preserves drag & drop order)
  return (
    <main>
      {page.sections.map((section, index) => {
        const rendered = renderSection(section, region);
        if (!rendered && process.env.NODE_ENV === 'development') {
          console.warn(`[HomeTemplate] Section ${index} (${section.__component}) returned null`);
        }
        return (
          <div key={`section-${index}-${section.__component}`}>
            {rendered}
          </div>
        );
      })}
    </main>
  );
}


