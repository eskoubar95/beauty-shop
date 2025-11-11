import type { HomepageContent } from "@lib/types/homepage"

/**
 * Mock data for homepage content matching Figma design.
 * This data will be replaced with CMS integration later.
 */
export const homepageContent: HomepageContent = {
  hero: {
    title: "Hudpleje, der virker. Leveret til dig.",
    body: "Få koreansk hudpleje direkte i din postkasse. Vi samler de bedste produkter og leverer dem til dig hver måned.",
    ctaText: "Start din Rutine",
    imageUrl: "/HeroBG.webp",
    imageAlt: "GUAPO hudplejeboks med accessories",
  },
  brandLogos: [
    "/images/brands/beauty-of-joseon.svg",
    "/images/brands/medicube.svg",
    "/images/brands/vt-cosmetics.svg",
    "/images/brands/biodance.svg",
  ],
  whySection: {
    title: "Hudpleje gjort simpelt",
    body: "Vi samler koreansk effektivitet med dansk kvalitet. Få de bedste produkter leveret direkte til din dør, så du kan fokusere på det der betyder noget - din hud.",
    imageUrl: "/images/GuapoBox.webp",
    imageAlt: "Indhold af GUAPO hudplejeboks på lys baggrund",
  },
  stepCards: [
    {
      title: "Vælg din pakke",
      body: "Vælg mellem vores Essentials eller Premium pakke, tilpasset til din hudtype og behov.",
      icon: "package", // Icon name - will be replaced with actual icon component
      color: "default",
    },
    {
      title: "Modtag din boks",
      body: "Få leveret direkte i din postkasse hver måned. Ingen bindingstid, opsig når som helst.",
      icon: "truck", // Icon name - will be replaced with actual icon component
      color: "default",
    },
    {
      title: "Gentag månedligt",
      body: "Gentag din rutine månedligt og oplev forbedret hud over tid. Vi leverer altid de bedste produkter.",
      icon: "repeat", // Icon name - will be replaced with actual icon component
      color: "accent",
    },
  ],
  productCards: [
    {
      id: "essentials",
      title: "Essentials",
      subtitle: "Den simple 3-trins rutine",
      badge: "Mest populære",
      features: [
        {
          icon: "calendar",
          label: "Levering hver måned",
        },
        {
          icon: "package",
          label: "3 koreanske kvalitetsprodukter",
          subItems: [
            { text: "Face Cream" },
            { text: "Rens - Refreshing Cleanser" },
            { text: "Serum - Vegan Serum" },
          ],
        },
      ],
      price: {
        firstMonth: 599.0, // DKK
        subsequent: 399.95, // DKK per måned
      },
      imageUrl: "/images/products/essentials-box-placeholder.jpg",
      ctaText: "Vælg Essentials",
      ctaHref: "/produkter/essentials",
    },
    {
      id: "premium",
      title: "Premium",
      subtitle: "Den fulde 5-trins luksusrutine",
      features: [
        {
          icon: "calendar",
          label: "Levering hver måned",
        },
        {
          icon: "package",
          label: "5 koreanske luksusprodukter",
          subItems: [
            { text: "Face Cream" },
            { text: "Ampoule - Royal Glow" },
            { text: "Essence - Hydrating Silk" },
            { text: "Serum - Vegan Serum" },
          ],
        },
      ],
      price: {
        firstMonth: 899.0, // DKK
        subsequent: 699.95, // DKK per måned
      },
      imageUrl: "/images/products/premium-box-placeholder.jpg",
      ctaText: "Vælg Premium",
      ctaHref: "/produkter/premium",
    },
  ],
  socialProof: {
    kicker: "Elsket af vores community",
    title: "Resultater du kan se og mærke",
    subtitle:
      "Vi hjælper danske kvinder og mænd med at opbygge en konsekvent hudplejerutine, der leverer synlige resultater efter få uger.",
    stats: [
      {
        value: "1.200+",
        label: "Aktive abonnenter",
        description: "Har allerede gjort GUAPO til en fast del af deres hverdag.",
        icon: "users",
      },
      {
        value: "4,8 / 5",
        label: "Gennemsnitlig rating",
        description: "Dokumenteret kundetilfredshed på tværs af Trustpilot og egne surveys.",
        icon: "star",
      },
      {
        value: "72 timer",
        label: "Gennemsnitlig levering",
        description: "Fra bestilling til boks på døren i hele Danmark.",
        icon: "clock",
      },
    ],
    testimonials: [
      {
        quote:
          "Efter tre måneder med GUAPO er min hud endelig i balance. Jeg elsker, at produkterne bliver udvalgt for mig.",
        author: "Sofie L.",
        location: "København Ø",
        rating: 5,
      },
      {
        quote:
          "Den månedlige boks gør det nemt at holde fast i rutinen. Jeg glæder mig hver gang den lander i postkassen.",
        author: "Kim M.",
        location: "Aarhus C",
        rating: 5,
      },
    ],
  },
  storytelling: {
    title: "Hvem er GUAPO",
    body:
      "Guapo er skabt til mænd, der gerne vil passe på deres hud uden at gøre det kompliceret. Vi tror på, at god hudpleje til mænd skal være nem, effektiv og passe ind i en travl hverdag.\n\nDerfor har vi udviklet produkter, der giver resultater med få trin. Rens, fugt og beskyt din hud med ingredienser, der er nøje udvalgt til mænds behov.\n\nGuapo handler ikke om forfængelighed. Det handler om velvære, selvtillid og følelsen af at se godt ud, uden at bruge unødvendig tid foran spejlet.",
    imageUrl: "/images/storytelling_guapo.webp",
    imageAlt: "Mand der bruger GUAPO hudplejeprodukter i et lyst miljø.",
  },
  faq: [
    {
      question: "Hvordan personaliserer I min boks?",
      answer:
        "Når du bestiller første gang, udfylder du et kort spørgeskema om din hudtype og dine mål. På den baggrund sammensætter vi en boks med produkter, der matcher dine behov. Du kan altid opdatere dine præferencer via din konto.",
    },
    {
      question: "Er der binding på abonnementet?",
      answer:
        "Nej. Du kan sætte dit abonnement på pause eller opsige det når som helst inden næste forsendelse. Vi sender dig en påmindelse tre dage før din næste boks afsendes.",
    },
    {
      question: "Hvad hvis jeg ikke tåler et produkt?",
      answer:
        "Kontakt os på hej@guapo.dk, så finder vi en løsning. Du kan vælge et alternativt produkt i næste forsendelse eller få en kredit til din konto.",
    },
    {
      question: "Leverer I til hele landet?",
      answer:
        "Ja, vi leverer i hele Danmark via DAO og Bring. Levering er inkluderet i prisen, og du kan vælge levering til dør eller pakkeshop.",
    },
  ],
  finalCta: {
    title: "Klar til at opgradere din hudpleje?",
    body:
      "Kom med i GUAPO-familien og få en personlig hudplejerutine leveret hjem til dig. Vi guider dig trin for trin og følger op, så du kan se fremgang måned for måned.",
    supportingPoints: [
      "Personlig onboarding med hudspecialist",
      "Fri levering og fleksibel pausefunktion",
      "Bonusprodukter og events kun for medlemmer",
    ],
    primaryCta: {
      label: "Start dit medlemskab",
      href: "/konto/opret",
    },
    secondaryCta: {
      label: "Se næste måneds boks",
      href: "/produkter/naeste-boks",
    },
    imageUrl: "/HeroBG.webp",
    imageAlt: "Kvinde der pakker en GUAPO hudplejeboks ud derhjemme.",
  },
  footer: {
    brand: {
      name: "GUAPO",
      tagline: "Hudpleje, der virker.",
      description:
        "Personligt kuraterede hudplejebokse inspireret af K-beauty, leveret direkte til din dør i Danmark.",
      socialLinks: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/guapo.dk",
          icon: "instagram",
        },
        {
          label: "TikTok",
          href: "https://www.tiktok.com/@guapo.dk",
          icon: "tiktok",
        },
        {
          label: "Pinterest",
          href: "https://www.pinterest.com/guapodk",
          icon: "pinterest",
        },
      ],
    },
    contact: {
      email: "hej@guapo.dk",
      phone: "+45 12 34 56 78",
      addressLines: ["GUAPO ApS", "Vesterbrogade 12, 3. sal", "1620 København V"],
      supportHours: "Mandag–fredag kl. 09:00–16:00",
    },
    linkGroups: [
      {
        title: "Shop",
        collapsibleOnMobile: true,
        links: [
          { label: "Hudpleje bokse", href: "/produkter" },
          { label: "Premium abonnement", href: "/produkter/premium" },
          { label: "Gavekort", href: "/gaver" },
          { label: "FAQ", href: "/faq" },
        ],
      },
      {
        title: "Virksomhed",
        collapsibleOnMobile: true,
        links: [
          { label: "Om GUAPO", href: "/om-os" },
          { label: "Teamet", href: "/om-os/team" },
          { label: "Presse", href: "/presse" },
          { label: "Karriere", href: "/karriere" },
        ],
      },
      {
        title: "Support",
        collapsibleOnMobile: true,
        links: [
          { label: "Kontakt os", href: "/kontakt" },
          { label: "Levering & retur", href: "/kundeservice/levering" },
          { label: "Abonnementsbetingelser", href: "/kundeservice/abonnement" },
          { label: "Persondatapolitik", href: "/privacy" },
        ],
      },
    ],
    legal: {
      text: "© 2025 GUAPO ApS. Alle rettigheder forbeholdes.",
      links: [
        { label: "Handelsbetingelser", href: "/handelsbetingelser" },
        { label: "Cookies", href: "/cookies" },
        { label: "GDPR & databehandleraftale", href: "/gdpr" },
      ],
    },
  },
}

