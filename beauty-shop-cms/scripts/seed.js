/**
 * Seed script for Beauty Shop Strapi CMS
 * Run with: node scripts/seed.js
 * Or set TEST_SEED=true for test environments
 */

async function isFirstRun() {
  // Check if we already have data by querying for pages
  // In a real scenario, you might check a flag in the database
  // For now, we'll always seed if TEST_SEED is set or if explicitly called
  return process.env.TEST_SEED === 'true' || process.env.SEED_DATA === 'true';
}

async function importSeedData(strapi) {
  console.log('🌱 Seeding Beauty Shop CMS data...\n');

  try {
    // 1. Create a Page (About page)
    const existingPage = await strapi.entityService.findMany('api::page.page', {
      filters: { slug: 'about' },
      limit: 1,
    });

    if (existingPage.length === 0) {
      const aboutPage = await strapi.entityService.create('api::page.page', {
        data: {
          slug: 'about',
          title: 'About Beauty Shop',
          body: '<p>Welcome to Beauty Shop - your trusted source for Korean beauty products and skincare essentials.</p><p>We curate the best products to help you achieve healthy, glowing skin.</p>',
          seo: {
            metaTitle: 'About Us - Beauty Shop',
            metaDescription: 'Learn about Beauty Shop and our mission to bring you the best Korean beauty products.',
          },
          publishedAt: new Date(),
        },
      });
      console.log('✅ Created About page:', aboutPage.id);
    } else {
      console.log('ℹ️  About page already exists');
    }

    // 2. Create a Bundle Page (Essentials)
    const existingBundle = await strapi.entityService.findMany('api::bundle-page.bundle-page', {
      filters: { slug: 'essentials' },
      limit: 1,
    });

    if (existingBundle.length === 0) {
      const essentialsBundle = await strapi.entityService.create('api::bundle-page.bundle-page', {
        data: {
          slug: 'essentials',
          medusaProductHandle: 'essentials',
          heroTitle: 'Essentials Bundle',
          heroSubtitle: 'Everything you need to start your skincare journey. Perfect for beginners.',
          sections: {
            benefits: [
              'Complete 5-step routine',
              'Suitable for all skin types',
              'Clinically tested ingredients',
              '30-day money-back guarantee',
            ],
            included: [
              'Cleanser (120ml)',
              'Toner (150ml)',
              'Serum (30ml)',
              'Moisturizer (50ml)',
              'Sunscreen (50ml)',
            ],
          },
          faqItems: [
            {
              question: 'Is this bundle suitable for sensitive skin?',
              answer: '<p>Yes! All products in the Essentials bundle are formulated for sensitive skin and have been dermatologically tested.</p>',
            },
            {
              question: 'How long will the products last?',
              answer: '<p>The Essentials bundle is designed to last approximately 2-3 months with daily use.</p>',
            },
            {
              question: 'Can I buy individual products?',
              answer: '<p>Yes, all products are available individually. However, the bundle offers the best value.</p>',
            },
          ],
          socialProof: {
            rating: 4.8,
            reviews: 1247,
            testimonials: [
              {
                name: 'Sarah M.',
                text: 'This bundle transformed my skin! Highly recommend.',
              },
            ],
          },
          seo: {
            metaTitle: 'Essentials Bundle - Beauty Shop',
            metaDescription: 'Complete skincare routine bundle with cleanser, toner, serum, moisturizer, and sunscreen. Perfect for beginners.',
          },
          publishedAt: new Date(),
        },
      });
      console.log('✅ Created Essentials bundle page:', essentialsBundle.id);
    } else {
      console.log('ℹ️  Essentials bundle page already exists');
    }

    // 3. Create Blog Posts
    const existingBlogPosts = await strapi.entityService.findMany('api::blog-post.blog-post', {
      limit: 1,
    });

    if (existingBlogPosts.length === 0) {
      const blogPost1 = await strapi.entityService.create('api::blog-post.blog-post', {
        data: {
          title: '10 Essential Korean Skincare Tips for Glowing Skin',
          slug: '10-essential-korean-skincare-tips',
          excerpt: 'Discover the secrets of Korean skincare and learn how to achieve that coveted glass skin look with these expert tips.',
          body: '<h2>Introduction</h2><p>Korean skincare has taken the world by storm, and for good reason. The Korean beauty routine emphasizes prevention, hydration, and gentle care.</p><h2>1. Double Cleansing</h2><p>Start with an oil-based cleanser to remove makeup and sunscreen, then follow with a water-based cleanser to deep clean your pores.</p><h2>2. Layering Products</h2><p>Apply products from thinnest to thickest consistency to maximize absorption.</p><h2>3. Sun Protection</h2><p>Never skip sunscreen! It\'s the most important step in any skincare routine.</p><h2>Conclusion</h2><p>Consistency is key. Stick to your routine and be patient - results take time.</p>',
          tags: ['skincare', 'korean-beauty', 'tips', 'routine'],
          publishedAt: new Date(),
          seo: {
            metaTitle: '10 Essential Korean Skincare Tips - Beauty Shop Blog',
            metaDescription: 'Learn the top 10 Korean skincare tips for achieving glowing, healthy skin. Expert advice on double cleansing, layering, and more.',
          },
        },
      });
      console.log('✅ Created blog post 1:', blogPost1.id);

      const blogPost2 = await strapi.entityService.create('api::blog-post.blog-post', {
        data: {
          title: 'Understanding Your Skin Type: A Complete Guide',
          slug: 'understanding-your-skin-type',
          excerpt: 'Learn how to identify your skin type and choose the right products for your unique needs.',
          body: '<h2>Introduction</h2><p>Understanding your skin type is the first step to building an effective skincare routine.</p><h2>Skin Types</h2><h3>Oily Skin</h3><p>Characterized by excess sebum production, visible pores, and a shiny appearance.</p><h3>Dry Skin</h3><p>Feels tight, may have flakiness, and lacks natural moisture.</p><h3>Combination Skin</h3><p>Oily in the T-zone (forehead, nose, chin) but dry on the cheeks.</p><h3>Sensitive Skin</h3><p>Easily irritated, may experience redness, itching, or reactions to products.</p><h2>Conclusion</h2><p>Once you know your skin type, you can select products that address your specific concerns.</p>',
          tags: ['skincare', 'skin-type', 'guide', 'education'],
          publishedAt: new Date(),
          seo: {
            metaTitle: 'Understanding Your Skin Type - Complete Guide | Beauty Shop',
            metaDescription: 'Complete guide to identifying your skin type (oily, dry, combination, sensitive) and choosing the right skincare products.',
          },
        },
      });
      console.log('✅ Created blog post 2:', blogPost2.id);
    } else {
      console.log('ℹ️  Blog posts already exist');
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 1 Page (About)');
    console.log('  - 1 Bundle Page (Essentials)');
    console.log('  - 2 Blog Posts');
    console.log('\n🔗 Test endpoints:');
    console.log('  - GET http://localhost:1337/api/pages?filters[slug][$eq]=about&populate=seo');
    console.log('  - GET http://localhost:1337/api/bundle-pages?filters[slug][$eq]=essentials&populate=*');
    console.log('  - GET http://localhost:1337/api/blog-posts?populate=*');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

async function seedExampleApp(strapi) {
  // In test environment, skip complex seeding and just log
  if (process.env.NODE_ENV === 'test') {
    console.log('Test seeding: Skipping complex data import (not needed for basic tests)');
    return;
  }

  const shouldImportSeedData = await isFirstRun();
  if (shouldImportSeedData) {
    try {
      console.log('Setting up the template...');
      await importSeedData(strapi);
      console.log('Ready to go');
    } catch (error) {
      console.log('Could not import seed data');
      console.error(error);
    }
  }
}

// Allow usage both as a CLI and as a library from tests
if (require.main === module) {
  // When run directly, we need to bootstrap Strapi first
  const Strapi = require('@strapi/strapi');
  const strapi = Strapi.default();

  strapi
    .load()
    .then(async () => {
      // Import seed function from TypeScript file
      const seedModule = await import('../dist/src/seed.js');
      await seedModule.default({ strapi });
      await strapi.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedExampleApp };

