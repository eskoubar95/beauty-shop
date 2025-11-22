/**
 * Strapi CMS Type Definitions
 * Matches Strapi v5 JSON response structure
 * 
 * IMPORTANT: Strapi v5 has flattened response format
 * Attributes are directly in data object, not nested in data.attributes
 * See: https://docs.strapi.io/cms/api/rest#endpoints
 */

// Strapi v5 response structure (flattened)
export interface StrapiDocument<T> {
  id: number;
  documentId: string;
  // Attributes are directly on the document, not nested
  // T represents the content type attributes
}

// For list responses, data is an array of documents
export interface StrapiListResponse<T> {
  data: Array<T & { id: number; documentId: string; createdAt: string; updatedAt: string; publishedAt: string | null }>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// For single responses, data is a single document or null
export interface StrapiSingleResponse<T> {
  data: (T & { id: number; documentId: string; createdAt: string; updatedAt: string; publishedAt: string | null }) | null;
  meta?: Record<string, unknown>;
}

// SEO Component (Strapi v5 flattened format)
export interface SeoComponent {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
}

// Page Content Type
export interface PageAttributes {
  slug: string;
  title: string;
  pageType?: 'homepage' | 'landing' | 'standard';
  body?: string;
  seo?: SeoComponent;
  sections?: HomepageSection[]; // Dynamic Zone for homepage
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Bundle Page Content Type
export interface BundlePageAttributes {
  slug: string;
  medusaProductId?: string;
  medusaProductHandle?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
  sections?: Record<string, unknown>; // JSON field - flexible structure
  faqItems?: FaqItemComponent[];
  socialProof?: Record<string, unknown>; // JSON field
  seo?: SeoComponent;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// FAQ Item Component
export interface FaqItemComponent {
  id: number;
  question: string;
  answer: string;
}

// Blog Post Content Type
export interface BlogPostAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  coverImage?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
  tags?: string[]; // repeatable string field
  seo?: SeoComponent;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null; // Strapi's built-in draftAndPublish field
}

// Domain models (simplified for UI consumption)
export interface Page {
  slug: string;
  title: string;
  body: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImageUrl?: string;
  };
}

export interface BundlePage {
  slug: string;
  medusaProductId?: string;
  medusaProductHandle?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  sections?: Record<string, unknown>;
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
  socialProof?: Record<string, unknown>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImageUrl?: string;
  };
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  coverImageUrl?: string;
  tags?: string[];
  publishedAt: string | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImageUrl?: string;
  };
}

// Homepage Section Types (for Dynamic Zone)
export interface HomepageHeroSection {
  __component: 'homepage.hero-section';
  internalLabel?: string;
  title: string;
  body: string;
  image?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
  imageAlt?: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
}

export interface HomepageBrandLogoItem {
  name: string;
  logo?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
  link?: string;
}

export interface HomepageBrandLogosSection {
  __component: 'homepage.brand-logos-section';
  internalLabel?: string;
  title?: string;
  logos: HomepageBrandLogoItem[];
}

export interface HomepageWhySection {
  __component: 'homepage.why-section';
  internalLabel?: string;
  title: string;
  subtitle: string;
  image?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
  imageAlt?: string;
}

export interface HomepageStepCardItem {
  title: string;
  body: string;
  icon?: string;
  color: 'default' | 'accent';
}

export interface HomepageStepCardsSection {
  __component: 'homepage.step-cards-section';
  internalLabel?: string;
  title?: string;
  steps: HomepageStepCardItem[];
}

export interface HomepageProductSection {
  __component: 'homepage.product-section';
  internalLabel?: string;
  title?: string;
  subtitle?: string;
  productHandles?: string[]; // JSON field
  ctaLabel?: string;
  ctaLink?: string;
}

export interface HomepageStoryHighlight {
  title: string;
  description: string;
}

export interface HomepageStoryQuote {
  text: string;
  author: string;
  role?: string;
}

export interface HomepageStorytellingSection {
  __component: 'homepage.storytelling-section';
  internalLabel?: string;
  kicker?: string;
  title: string;
  body: string;
  image?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
  imageAlt?: string;
  highlights?: HomepageStoryHighlight[];
  quote?: HomepageStoryQuote;
}

export interface HomepageFaqSection {
  __component: 'homepage.faq-section';
  internalLabel?: string;
  title?: string;
  items: FaqItemComponent[];
}

export interface HomepageFinalCtaSection {
  __component: 'homepage.final-cta-section';
  internalLabel?: string;
  title: string;
  body: string;
  supportingPoints?: string[]; // JSON field
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  image?: {
    data: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    } | null;
  };
  imageAlt?: string;
}

// Union type for all homepage sections
export type HomepageSection =
  | HomepageHeroSection
  | HomepageBrandLogosSection
  | HomepageWhySection
  | HomepageStepCardsSection
  | HomepageProductSection
  | HomepageStorytellingSection
  | HomepageFaqSection
  | HomepageFinalCtaSection;

// Page Attributes with sections (for homepage)
export interface HomepagePageAttributes extends PageAttributes {
  pageType: 'homepage' | 'landing' | 'standard';
  sections?: HomepageSection[];
}

