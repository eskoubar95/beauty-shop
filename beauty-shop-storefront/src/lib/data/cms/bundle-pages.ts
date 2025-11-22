/**
 * CMS Bundle Pages Helper Functions
 * Fetch and transform bundle page content from Strapi
 */

import { fetchFromStrapi } from "./strapi-client";
import type {
  BundlePage,
  BundlePageAttributes,
  StrapiListResponse,
} from "../../types/cms";

/**
 * Get a bundle page by slug
 * @param slug - Bundle page slug (e.g., "essentials")
 * @returns Bundle page data or null if not found
 */
export async function getBundlePageBySlug(
  slug: string
): Promise<BundlePage | null> {
  try {
    // Strapi v5: Collection types return data as array, even with filters
    // Use status=published instead of publicationState=live
    const res = await fetchFromStrapi<
      StrapiListResponse<BundlePageAttributes>
    >(
      `/api/bundle-pages?status=published&filters[slug][$eq]=${encodeURIComponent(
        slug
      )}&populate=*`
    );

    // Handle 404 or missing data gracefully
    // Strapi v5: Collection types return data as array
    if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
      return null;
    }

    // Get first matching bundle page (filters should only return one)
    const bundlePage = res.data[0];
    
    // Additional safety check
    if (!bundlePage || typeof bundlePage !== 'object' || !('slug' in bundlePage)) {
      return null;
    }

    return {
      slug: bundlePage.slug,
      medusaProductId: bundlePage.medusaProductId,
      medusaProductHandle: bundlePage.medusaProductHandle,
      heroTitle: bundlePage.heroTitle,
      heroSubtitle: bundlePage.heroSubtitle,
      heroImageUrl:
        bundlePage.heroImage?.data?.url ?? undefined,
      sections: bundlePage.sections,
      faqItems: bundlePage.faqItems?.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      })),
      socialProof: bundlePage.socialProof,
      seo: bundlePage.seo
        ? {
            metaTitle: bundlePage.seo.metaTitle,
            metaDescription: bundlePage.seo.metaDescription,
            ogImageUrl:
              bundlePage.seo.ogImage?.data?.url ?? undefined,
          }
        : undefined,
    };
  } catch (error) {
    // Error already logged by strapi-client
    // Return null to allow graceful degradation
    console.error(`Failed to fetch bundle page with slug "${slug}":`, error);
    return null;
  }
}

