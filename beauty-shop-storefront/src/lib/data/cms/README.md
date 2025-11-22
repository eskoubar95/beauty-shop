# CMS Client Layer

This directory contains the Strapi CMS client layer for the Beauty Shop storefront.

## Files

- `strapi-client.ts` - Core fetch helper for Strapi REST API
- `pages.ts` - Page content helpers (`getPageBySlug`)
- `bundle-pages.ts` - Bundle page helpers (`getBundlePageBySlug`)
- `blog.ts` - Blog post helpers (`listBlogPosts`, `getBlogPostBySlug`)

## Usage

```typescript
import { getPageBySlug } from "@lib/data/cms/pages";
import { getBundlePageBySlug } from "@lib/data/cms/bundle-pages";
import { listBlogPosts, getBlogPostBySlug } from "@lib/data/cms/blog";

// In a server component
const aboutPage = await getPageBySlug("about");
const essentialsBundle = await getBundlePageBySlug("essentials");
const blogPosts = await listBlogPosts(10);
const blogPost = await getBlogPostBySlug("my-blog-post");
```

## Environment Variables

Required:
- `NEXT_PUBLIC_STRAPI_URL` - Strapi CMS URL (default: `http://localhost:1337`)

Optional:
- `STRAPI_API_TOKEN` - API token for authenticated requests (if using token-based auth)

## Error Handling

All helper functions return `null` or empty arrays on error, allowing graceful degradation.
Errors are logged to Sentry (if available) without exposing PII.

## Type Safety

All functions are fully typed using TypeScript interfaces defined in `@lib/types/cms.ts`.

