/**
 * Seed script for Beauty Shop Strapi CMS
 * Called from bootstrap when SEED_DATA=true or TEST_SEED=true
 * 
 * Creates homepage with all sections matching storefront structure
 */

import type { Core } from '@strapi/strapi';

export default async function seedData({ strapi }: { strapi: Core.Strapi }) {
  // In test environment, skip complex seeding and just log
  if (process.env.NODE_ENV === 'test') {
    console.log('Test seeding: Skipping complex data import (not needed for basic tests)');
    return;
  }

  console.log('🌱 Seeding Beauty Shop CMS data...\n');

  try {
    // Check if homepage already exists (both published and draft)
    // Note: findMany without status filter returns both published and draft
    const existingHomepage = await strapi.entityService.findMany('api::page.page', {
      filters: { slug: 'homepage' },
      limit: 1,
      // Don't filter by status - check all (published + draft)
    });

    if (existingHomepage.length > 0) {
      const existing = existingHomepage[0];
      const status = existing.publishedAt ? 'published' : 'draft';
      console.log(`ℹ️  Homepage already exists (${status}), skipping seed`);
      console.log('   To recreate, delete existing homepage in Strapi admin first');
      console.log(`   Current homepage ID: ${existing.id}`);
      return;
    }

    console.log('📄 Creating homepage with all sections...\n');

      const homepage = await strapi.entityService.create('api::page.page', {
        data: {
          slug: 'homepage',
          title: 'Homepage',
          pageType: 'homepage',
          seo: {
            metaTitle: 'GUAPO - Hudpleje, der virker. Leveret til dig.',
            metaDescription: 'Få koreansk hudpleje direkte i din postkasse. Vi samler de bedste produkter og leverer dem til dig hver måned.',
          },
          sections: [
            // 1. Hero Section
            {
              __component: 'homepage.hero-section',
              internalLabel: 'Hero Section',
              title: 'Hudpleje, der virker. Leveret til dig.',
              body: 'Få koreansk hudpleje direkte i din postkasse. Vi samler de bedste produkter og leverer dem til dig hver måned.',
              image: null, // Will need to be uploaded via admin or use placeholder URL
              imageAlt: 'GUAPO hudplejeboks med accessories',
              primaryCtaLabel: 'Start din Rutine',
              primaryCtaLink: '/konto/opret',
              secondaryCtaLabel: null,
              secondaryCtaLink: null,
            },
            // 2. Brand Logos Section
            {
              __component: 'homepage.brand-logos-section',
              internalLabel: 'Brand Logos',
              title: null,
              logos: [
                {
                  name: 'Beauty of Joseon',
                  logo: null, // Will need to be uploaded via admin
                  link: null,
                },
                {
                  name: 'Medicube',
                  logo: null,
                  link: null,
                },
                {
                  name: 'VT Cosmetics',
                  logo: null,
                  link: null,
                },
                {
                  name: 'Biodance',
                  logo: null,
                  link: null,
                },
              ],
            },
            // 3. Why Section
            {
              __component: 'homepage.why-section',
              internalLabel: 'Why Section',
              title: 'Hudpleje gjort simpelt',
              subtitle: 'Vi samler koreansk effektivitet med dansk kvalitet. Få de bedste produkter leveret direkte til din dør, så du kan fokusere på det der betyder noget - din hud.',
              image: null, // Will need to be uploaded
              imageAlt: 'Indhold af GUAPO hudplejeboks på lys baggrund',
            },
            // 4. Step Cards Section
            {
              __component: 'homepage.step-cards-section',
              internalLabel: 'Step Cards',
              title: null,
              steps: [
                {
                  title: 'Vælg din pakke',
                  body: 'Vælg mellem vores Essentials eller Premium pakke, tilpasset til din hudtype og behov.',
                  icon: 'package',
                  color: 'default',
                },
                {
                  title: 'Modtag din boks',
                  body: 'Få leveret direkte i din postkasse hver måned. Ingen bindingstid, opsig når som helst.',
                  icon: 'truck',
                  color: 'default',
                },
                {
                  title: 'Gentag månedligt',
                  body: 'Gentag din rutine månedligt og oplev forbedret hud over tid. Vi leverer altid de bedste produkter.',
                  icon: 'repeat',
                  color: 'accent',
                },
              ],
            },
            // 5. Product Section
            {
              __component: 'homepage.product-section',
              internalLabel: 'Product Section',
              title: null,
              subtitle: null,
              productHandles: ['essentials', 'premium'], // Product handles from Medusa
              ctaLabel: null,
              ctaLink: null,
            },
            // 6. Storytelling Section
            {
              __component: 'homepage.storytelling-section',
              internalLabel: 'Storytelling',
              kicker: null,
              title: 'Hvem er GUAPO',
              body: '<p>Guapo er skabt til mænd, der gerne vil passe på deres hud uden at gøre det kompliceret. Vi tror på, at god hudpleje til mænd skal være nem, effektiv og passe ind i en travl hverdag.</p><p>Derfor har vi udviklet produkter, der giver resultater med få trin. Rens, fugt og beskyt din hud med ingredienser, der er nøje udvalgt til mænds behov.</p><p>Guapo handler ikke om forfængelighed. Det handler om velvære, selvtillid og følelsen af at se godt ud, uden at bruge unødvendig tid foran spejlet.</p>',
              image: null, // Will need to be uploaded
              imageAlt: 'Mand der bruger GUAPO hudplejeprodukter i et lyst miljø.',
              highlights: [],
              quote: null,
            },
            // 7. FAQ Section
            {
              __component: 'homepage.faq-section',
              internalLabel: 'FAQ',
              title: null,
              items: [
                {
                  question: 'Hvordan personaliserer I min boks?',
                  answer: '<p>Når du bestiller første gang, udfylder du et kort spørgeskema om din hudtype og dine mål. På den baggrund sammensætter vi en boks med produkter, der matcher dine behov. Du kan altid opdatere dine præferencer via din konto.</p>',
                },
                {
                  question: 'Er der binding på abonnementet?',
                  answer: '<p>Nej. Du kan sætte dit abonnement på pause eller opsige det når som helst inden næste forsendelse. Vi sender dig en påmindelse tre dage før din næste boks afsendes.</p>',
                },
                {
                  question: 'Hvad hvis jeg ikke tåler et produkt?',
                  answer: '<p>Kontakt os på hej@guapo.dk, så finder vi en løsning. Du kan vælge et alternativt produkt i næste forsendelse eller få en kredit til din konto.</p>',
                },
                {
                  question: 'Leverer I til hele landet?',
                  answer: '<p>Ja, vi leverer i hele Danmark via DAO og Bring. Levering er inkluderet i prisen, og du kan vælge levering til dør eller pakkeshop.</p>',
                },
              ],
            },
            // 8. Final CTA Section
            {
              __component: 'homepage.final-cta-section',
              internalLabel: 'Final CTA',
              title: 'Klar til at opgradere din hudpleje?',
              body: 'Kom med i GUAPO-familien og få en personlig hudplejerutine leveret hjem til dig. Vi guider dig trin for trin og følger op, så du kan se fremgang måned for måned.',
              supportingPoints: [
                'Personlig onboarding med hudspecialist',
                'Fri levering og fleksibel pausefunktion',
                'Bonusprodukter og events kun for medlemmer',
              ],
              primaryCtaLabel: 'Start dit medlemskab',
              primaryCtaLink: '/konto/opret',
              secondaryCtaLabel: 'Se næste måneds boks',
              secondaryCtaLink: '/produkter/naeste-boks',
              image: null,
              imageAlt: null,
            },
          ],
          publishedAt: new Date(),
        },
      });

      console.log('✅ Created homepage:', homepage.id);
      console.log('\n📋 Homepage sections created:');
      console.log('  1. Hero Section');
      console.log('  2. Brand Logos Section');
      console.log('  3. Why Section');
      console.log('  4. Step Cards Section');
      console.log('  5. Product Section');
      console.log('  6. Storytelling Section');
      console.log('  7. FAQ Section');
      console.log('  8. Final CTA Section');
      console.log('\n⚠️  Note: Images need to be uploaded via Strapi admin panel');
      console.log('   - Hero image');
      console.log('   - Brand logos');
      console.log('   - Why section image');
      console.log('   - Storytelling image');

      console.log('\n🎉 Seed completed successfully!');
      console.log('\n📊 Summary:');
      console.log('  - 1 Page (Homepage) with 8 sections');
      console.log('\n🔗 Test endpoint:');
      console.log('  - GET http://localhost:1337/api/pages?filters[slug][$eq]=homepage&populate=*');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}
