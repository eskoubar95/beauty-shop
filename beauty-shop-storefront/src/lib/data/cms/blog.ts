/**
 * CMS Blog Helper Functions
 * Fetch and transform blog post content from Strapi
 */

import { fetchFromStrapi } from "./strapi-client";
import type {
  BlogPost,
  BlogPostAttributes,
  StrapiListResponse,
  StrapiSingleResponse,
} from "../../types/cms";

/**
 * List all published blog posts
 * @param limit - Maximum number of posts to return (default: 10)
 * @param sort - Sort order (default: "publishedAt:desc")
 * @returns Array of blog posts
 */
export async function listBlogPosts(
  limit: number = 10,
  sort: string = "publishedAt:desc"
): Promise<BlogPost[]> {
  try {
    // Strapi v5: Use status=published to get published blog posts
    const res = await fetchFromStrapi<
      StrapiListResponse<BlogPostAttributes>
    >(
      `/api/blog-posts?status=published&sort=${encodeURIComponent(
        sort
      )}&pagination[limit]=${limit}&populate=*`
    );

    // Handle empty data gracefully
    // Strapi v5: attributes are directly on data items, not nested
    if (!res.data || !Array.isArray(res.data)) {
      return [];
    }

    return res.data.map((post) => {
      // In Strapi v5, attributes are directly on the document
      return {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        coverImageUrl:
          post.coverImage?.data?.url ?? undefined,
        tags: post.tags,
        publishedAt: post.publishedAt,
        seo: post.seo
          ? {
              metaTitle: post.seo.metaTitle,
              metaDescription: post.seo.metaDescription,
              ogImageUrl:
                post.seo.ogImage?.data?.url ?? undefined,
            }
          : undefined,
      };
    });
  } catch (error) {
    // Error already logged by strapi-client
    // Return empty array to allow graceful degradation
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

/**
 * Get a blog post by slug
 * @param slug - Blog post slug
 * @returns Blog post data or null if not found
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    // Strapi v5: Collection types return data as array, even with filters
    // Use status=published to get published blog posts
    const res = await fetchFromStrapi<
      StrapiListResponse<BlogPostAttributes>
    >(
      `/api/blog-posts?status=published&filters[slug][$eq]=${encodeURIComponent(
        slug
      )}&populate=*`
    );

    // Handle 404 or missing data gracefully
    // Strapi v5: Collection types return data as array
    if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
      return null;
    }

    // Get first matching blog post (filters should only return one)
    const post = res.data[0];
    
    // Additional safety check
    if (!post || typeof post !== 'object' || !('slug' in post)) {
      return null;
    }

    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      coverImageUrl:
        post.coverImage?.data?.url ?? undefined,
      tags: post.tags,
      publishedAt: post.publishedAt,
      seo: post.seo
        ? {
            metaTitle: post.seo.metaTitle,
            metaDescription: post.seo.metaDescription,
            ogImageUrl:
              post.seo.ogImage?.data?.url ?? undefined,
          }
        : undefined,
    };
  } catch (error) {
    // Error already logged by strapi-client
    // Return null to allow graceful degradation
    console.error(`Failed to fetch blog post with slug "${slug}":`, error);
    return null;
  }
}

