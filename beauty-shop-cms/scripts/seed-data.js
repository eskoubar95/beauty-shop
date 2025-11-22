/**
 * Seed script for Strapi CMS test data
 * Run with: node scripts/seed-data.js
 * 
 * Note: Requires Strapi to be running on http://localhost:1337
 */

const http = require('http');

const BASE_URL = 'http://localhost:1337';

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 1337,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data),
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function seedData() {
  console.log('🌱 Starting Strapi seed...\n');

  try {
    // 1. Create a Page (About page)
    const aboutPageResponse = await makeRequest(`${BASE_URL}/api/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          slug: 'about',
          title: 'About Beauty Shop',
          body: '<p>Welcome to Beauty Shop - your trusted source for Korean beauty products and skincare essentials.</p><p>We curate the best products to help you achieve healthy, glowing skin.</p>',
          seo: {
            metaTitle: 'About Us - Beauty Shop',
            metaDescription: 'Learn about Beauty Shop and our mission to bring you the best Korean beauty products.',
          },
          publishedAt: new Date().toISOString(),
        },
      }),
    });

    if (aboutPageResponse.ok) {
      const aboutPage = await aboutPageResponse.json();
      console.log('✅ Created About page:', aboutPage.data.id);
    } else {
      const error = await aboutPageResponse.text();
      console.log('⚠️  About page (may already exist):', error.substring(0, 100));
    }

    // 2. Create a Bundle Page (Essentials)
    const bundleResponse = await makeRequest(`${BASE_URL}/api/bundle-pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
          publishedAt: new Date().toISOString(),
        },
      }),
    });

    if (bundleResponse.ok) {
      const bundle = await bundleResponse.json();
      console.log('✅ Created Essentials bundle page:', bundle.data.id);
    } else {
      const error = await bundleResponse.text();
      console.log('⚠️  Bundle page (may already exist):', error.substring(0, 100));
    }

    // 3. Create Blog Posts
    const blogPost1Response = await makeRequest(`${BASE_URL}/api/blog-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: '10 Essential Korean Skincare Tips for Glowing Skin',
          slug: '10-essential-korean-skincare-tips',
          excerpt: 'Discover the secrets of Korean skincare and learn how to achieve that coveted glass skin look with these expert tips.',
          body: '<h2>Introduction</h2><p>Korean skincare has taken the world by storm, and for good reason. The Korean beauty routine emphasizes prevention, hydration, and gentle care.</p><h2>1. Double Cleansing</h2><p>Start with an oil-based cleanser to remove makeup and sunscreen, then follow with a water-based cleanser to deep clean your pores.</p><h2>2. Layering Products</h2><p>Apply products from thinnest to thickest consistency to maximize absorption.</p><h2>3. Sun Protection</h2><p>Never skip sunscreen! It\'s the most important step in any skincare routine.</p><h2>Conclusion</h2><p>Consistency is key. Stick to your routine and be patient - results take time.</p>',
          tags: ['skincare', 'korean-beauty', 'tips', 'routine'],
          publishedAt: new Date().toISOString(),
          seo: {
            metaTitle: '10 Essential Korean Skincare Tips - Beauty Shop Blog',
            metaDescription: 'Learn the top 10 Korean skincare tips for achieving glowing, healthy skin. Expert advice on double cleansing, layering, and more.',
          },
        },
      }),
    });

    if (blogPost1Response.ok) {
      const blogPost1 = await blogPost1Response.json();
      console.log('✅ Created blog post 1:', blogPost1.data.id);
    } else {
      const error = await blogPost1Response.text();
      console.log('⚠️  Blog post 1 (may already exist):', error.substring(0, 100));
    }

    const blogPost2Response = await makeRequest(`${BASE_URL}/api/blog-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: 'Understanding Your Skin Type: A Complete Guide',
          slug: 'understanding-your-skin-type',
          excerpt: 'Learn how to identify your skin type and choose the right products for your unique needs.',
          body: '<h2>Introduction</h2><p>Understanding your skin type is the first step to building an effective skincare routine.</p><h2>Skin Types</h2><h3>Oily Skin</h3><p>Characterized by excess sebum production, visible pores, and a shiny appearance.</p><h3>Dry Skin</h3><p>Feels tight, may have flakiness, and lacks natural moisture.</p><h3>Combination Skin</h3><p>Oily in the T-zone (forehead, nose, chin) but dry on the cheeks.</p><h3>Sensitive Skin</h3><p>Easily irritated, may experience redness, itching, or reactions to products.</p><h2>Conclusion</h2><p>Once you know your skin type, you can select products that address your specific concerns.</p>',
          tags: ['skincare', 'skin-type', 'guide', 'education'],
          publishedAt: new Date().toISOString(),
          seo: {
            metaTitle: 'Understanding Your Skin Type - Complete Guide | Beauty Shop',
            metaDescription: 'Complete guide to identifying your skin type (oily, dry, combination, sensitive) and choosing the right skincare products.',
          },
        },
      }),
    });

    if (blogPost2Response.ok) {
      const blogPost2 = await blogPost2Response.json();
      console.log('✅ Created blog post 2:', blogPost2.data.id);
    } else {
      const error = await blogPost2Response.text();
      console.log('⚠️  Blog post 2 (may already exist):', error.substring(0, 100));
    }

    console.log('\n🎉 Seed completed!');
    console.log('\n📊 Summary:');
    console.log('  - 1 Page (About)');
    console.log('  - 1 Bundle Page (Essentials)');
    console.log('  - 2 Blog Posts');
    console.log('\n🔗 Test endpoints:');
    console.log('  - GET http://localhost:1337/api/pages?filters[slug][$eq]=about&populate=seo');
    console.log('  - GET http://localhost:1337/api/bundle-pages?filters[slug][$eq]=essentials&populate=*');
    console.log('  - GET http://localhost:1337/api/blog-posts?populate=*');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Make sure Strapi is running on http://localhost:1337');
      console.error('   Run: cd beauty-shop-cms && npm run develop');
    }
    process.exit(1);
  }
}

seedData();

