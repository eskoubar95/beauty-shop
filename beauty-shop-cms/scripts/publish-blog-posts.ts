/**
 * Script to publish all draft blog posts
 * Run with: npm run strapi -- scripts:publish-blog-posts
 */

export default async ({ strapi }) => {
  console.log('📝 Publishing all draft blog posts...\n');

  try {
    // Find all blog posts (including drafts)
    const blogPosts = await strapi.entityService.findMany('api::blog-post.blog-post', {
      filters: {
        publishedAt: null, // Only drafts
      },
    });

    if (!blogPosts || blogPosts.length === 0) {
      console.log('✅ No draft blog posts found - all are already published!');
      return;
    }

    console.log(`Found ${blogPosts.length} draft blog post(s) to publish:\n`);

    // Publish each blog post
    for (const post of blogPosts) {
      console.log(`  - Publishing: "${post.title}" (ID: ${post.id})`);
      
      await strapi.entityService.update('api::blog-post.blog-post', post.id, {
        data: {
          publishedAt: new Date(),
        },
      });
      
      console.log(`    ✅ Published successfully`);
    }

    console.log(`\n🎉 Successfully published ${blogPosts.length} blog post(s)!`);
  } catch (error) {
    console.error('❌ Error publishing blog posts:', error);
    throw error;
  }
};

