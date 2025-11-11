export interface HeroContent {
  title: string
  body: string
  ctaText: string
  imageUrl: string
  imageAlt?: string
}

export interface WhySectionContent {
  title: string
  body: string
  imageUrl: string
  imageAlt?: string
}

export interface StepCard {
  title: string
  body: string
  icon: string // Icon name or URL
  color: "default" | "accent" // default = gray bg, accent = orange bg
}

export interface ProductFeatureDetail {
  text: string
}

export interface ProductFeature {
  icon: string
  label: string
  subItems?: ProductFeatureDetail[]
}

export interface ProductCard {
  id: string
  title: string
  subtitle: string
  badge?: string
  features: ProductFeature[]
  price: {
    firstMonth: number // DKK
    subsequent: number // DKK
  }
  imageUrl: string
  imageAlt?: string
  ctaText: string
  ctaHref?: string
}

export interface SocialProofStat {
  value: string
  label: string
  description: string
  icon?: string
}

export interface Testimonial {
  quote: string
  author: string
  location?: string
  role?: string
  rating?: number
  avatarUrl?: string
}

export interface SocialProofContent {
  kicker?: string
  title: string
  subtitle: string
  stats: SocialProofStat[]
  testimonials: Testimonial[]
}

export interface StoryHighlight {
  title: string
  description: string
}

export interface StorytellingSection {
  kicker?: string
  title: string
  body: string
  imageUrl: string
  imageAlt?: string
  highlights?: StoryHighlight[]
  quote?: {
    text: string
    author: string
    role?: string
  }
}

export interface FaqItem {
  question: string
  answer: string
}

export interface CtaButton {
  label: string
  href: string
  external?: boolean
}

export interface FinalCtaContent {
  title: string
  body: string
  supportingPoints?: string[]
  primaryCta: CtaButton
  secondaryCta?: CtaButton
  imageUrl?: string
  imageAlt?: string
}

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterLinkGroup {
  title: string
  links: FooterLink[]
  collapsibleOnMobile?: boolean
}

export interface FooterSocialLink {
  label: string
  href: string
  icon?: string
}

export interface FooterContactInfo {
  email: string
  phone?: string
  addressLines?: string[]
  supportHours?: string
}

export interface FooterLegalInfo {
  text: string
  links: FooterLink[]
}

export interface FooterBrandInfo {
  name: string
  tagline?: string
  description: string
  socialLinks?: FooterSocialLink[]
}

export interface FooterContent {
  brand: FooterBrandInfo
  contact: FooterContactInfo
  linkGroups: FooterLinkGroup[]
  legal: FooterLegalInfo
}

export interface HomepageContent {
  hero: HeroContent
  brandLogos: string[] // Array of logo URLs
  whySection: WhySectionContent
  stepCards: StepCard[]
  productCards: ProductCard[]
  socialProof: SocialProofContent
  storytelling: StorytellingSection
  faq: FaqItem[]
  finalCta: FinalCtaContent
  footer: FooterContent
}

