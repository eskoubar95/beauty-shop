/**
 * CMS Pages Helper Functions
 * Fetch and transform page content from Strapi
 */

import { fetchFromStrapi } from "./strapi-client";
import { getLocaleFromCountryCode } from "../utils/locale";
import type {
  Page,
  PageAttributes,
  StrapiListResponse,
  HomepageSection,
  HomepagePageAttributes,
} from "../../types/cms";
// Removed fallback import - Strapi is single source of truth

/**
 * Get a page by slug
 * @param slug - Page slug (e.g., "about", "chose-package")
 * @param locale - Optional locale code (e.g., "da", "sv", "en"). If not provided, uses default locale.
 * @returns PageAttributes directly from Strapi, or null if not found
 * 
 * For landing pages with sections, populates sections with same syntax as homepage
 */
export async function getPageBySlug(
  slug: string,
  locale?: string
): Promise<PageAttributes | null> {
  try {
    // For pages with sections (landing pages), use same populate syntax as homepage
    // This ensures nested components and media are properly populated
    const populateParams = [
      'populate[sections][on][homepage.brand-logos-section][populate][logos][populate][0]=logo',
      'populate[sections][on][homepage.step-cards-section][populate][steps]=*',
      'populate[sections][on][homepage.faq-section][populate][items]=*',
      'populate[sections][on][homepage.product-section]=*',
      'populate[sections][on][homepage.hero-section][populate][0]=image',
      'populate[sections][on][homepage.why-section][populate][0]=image',
      'populate[sections][on][homepage.storytelling-section][populate][0]=image',
      'populate[sections][on][homepage.final-cta-section][populate][0]=image',
      'populate[seo][populate]=*',
    ].join('&');
    
    // Add locale parameter if provided (Strapi i18n)
    const localeParam = locale ? `&locale=${encodeURIComponent(locale)}` : '';
    
    // Strapi v5: Collection types return data as array, even with filters
    // Use status=published instead of publicationState=live
    const res = await fetchFromStrapi<
      StrapiListResponse<PageAttributes>
    >(
      `/api/pages?status=published&filters[slug][$eq]=${encodeURIComponent(slug)}&${populateParams}${localeParam}`
    );

    // Handle 404 or missing data gracefully - try fallback to default locale if requested locale not found
    if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
      // Fallback strategy: If requested locale doesn't exist, try default locale (da-DK)
      if (locale && locale !== 'da-DK') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[getPageBySlug] Page "${slug}" not found for locale "${locale}", trying fallback to default locale "da-DK"`);
        }
        
        // Try default locale as fallback
        const fallbackRes = await fetchFromStrapi<
          StrapiListResponse<PageAttributes>
        >(
          `/api/pages?status=published&filters[slug][$eq]=${encodeURIComponent(slug)}&${populateParams}&locale=da-DK`
        );
        
        if (fallbackRes.data && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
          const fallbackPage = fallbackRes.data[0];
          if (fallbackPage && typeof fallbackPage === 'object' && 'slug' in fallbackPage) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[getPageBySlug] Using fallback page "${slug}" from default locale "da-DK"`);
            }
            return fallbackPage;
          }
        }
      }
      
      return null;
    }

    // Get first matching page (filters should only return one)
    const page = res.data[0];
    
    // Additional safety check
    if (!page || typeof page !== 'object' || !('slug' in page)) {
      return null;
    }

    // Return PageAttributes directly (single source of truth)
    return page;
  } catch (error) {
    // Error already logged by strapi-client
    // Return null to allow graceful degradation
    console.error(`Failed to fetch page with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get homepage content from Strapi
 * Returns sections directly from Strapi in order (Strapi is single source of truth)
 * @param locale - Optional locale code (e.g., "da", "sv", "en"). If not provided, uses default locale.
 * @returns HomepagePageAttributes with sections array, or null if not found
 */
export async function getHomepage(locale?: string): Promise<HomepagePageAttributes | null> {
  try {
    // Fetch homepage from Strapi with all sections populated
    // Strapi v5: For Dynamic Zones, we need to use 'on' keyword to specify component types
    // Correct syntax: populate[sections][on][component-name][populate][0]=field-name
    // For nested repeatable components: populate[sections][on][component-name][populate][nested-field][populate][0]=media-field
    const populateParams = [
      'populate[sections][on][homepage.brand-logos-section][populate][logos][populate][0]=logo',
      'populate[sections][on][homepage.step-cards-section][populate][steps]=*',
      'populate[sections][on][homepage.faq-section][populate][items]=*',
      'populate[sections][on][homepage.product-section]=*', // Product section (productHandles are strings, no nested populate needed)
      'populate[sections][on][homepage.hero-section][populate][0]=image',
      'populate[sections][on][homepage.why-section][populate][0]=image',
      'populate[sections][on][homepage.storytelling-section][populate][0]=image',
      'populate[sections][on][homepage.final-cta-section][populate][0]=image',
      'populate[seo][populate]=*',
    ].join('&');
    
    // Add locale parameter if provided (Strapi i18n)
    const localeParam = locale ? `&locale=${encodeURIComponent(locale)}` : '';
    
    const res = await fetchFromStrapi<
      StrapiListResponse<HomepagePageAttributes>
    >(
      `/api/pages?status=published&filters[slug][$eq]=homepage&filters[pageType][$eq]=homepage&${populateParams}${localeParam}`
    );

    // Handle 404 or missing data - try fallback to default locale if requested locale not found
    if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
      // Fallback strategy: If requested locale doesn't exist, try default locale (da-DK)
      if (locale && locale !== 'da-DK') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[getHomepage] Homepage not found for locale "${locale}", trying fallback to default locale "da-DK"`);
        }
        
        // Try default locale as fallback
        const fallbackRes = await fetchFromStrapi<
          StrapiListResponse<HomepagePageAttributes>
        >(
          `/api/pages?status=published&filters[slug][$eq]=homepage&filters[pageType][$eq]=homepage&${populateParams}&locale=da-DK`
        );
        
        if (fallbackRes.data && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
          const fallbackPage = fallbackRes.data[0];
          if (fallbackPage && fallbackPage.sections && Array.isArray(fallbackPage.sections)) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[getHomepage] Using fallback homepage from default locale "da-DK"`);
            }
            return fallbackPage;
          }
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('[getHomepage] Homepage not found in Strapi (including fallback)');
      }
      return null;
    }

    const page = res.data[0];
    if (!page || !page.sections || !Array.isArray(page.sections)) {
      console.warn('[getHomepage] Homepage has no sections');
      return null;
    }

    // Debug: Log sections in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[getHomepage] All sections:', page.sections.map((s: any) => ({
        component: s.__component,
        internalLabel: s.internalLabel,
        hasProductHandles: s.productHandles ? `${s.productHandles.length} handles: ${s.productHandles.join(', ')}` : 'no handles',
      })));
      
      // Find product section and log structure
      const productSection = page.sections.find((s: any) => s.__component === 'homepage.product-section');
      if (productSection) {
        console.log('[getHomepage] Product section found:', {
          internalLabel: productSection.internalLabel,
          productHandles: productSection.productHandles,
        });
      } else {
        console.warn('[getHomepage] Product section not found in sections');
      }
    }

    // Return page directly from Strapi (single source of truth)
    // Sections are already in correct order from Strapi's Dynamic Zone
    return page;
  } catch (error) {
    // Strapi is single source of truth - if it fails, we should fail
    // Only log error, don't fallback to mock data
    console.error('[getHomepage] Failed to fetch homepage from Strapi:', error instanceof Error ? error.message : error);
    return null;
  }
}

