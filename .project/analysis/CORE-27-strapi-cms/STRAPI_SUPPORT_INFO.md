# Strapi Support Information - Blog Posts Issue

**Dato:** 20. november 2025  
**Strapi Version:** 5.31.1  
**Issue:** `/api/blog-posts` endpoint returnerer data korrekt når testet direkte, men frontend får tomme resultater

---

## ⚠️ AKTUEL UDFORDRING

**Problem:**
- ✅ Direkte API test via curl/browser returnerer blog posts korrekt (200 OK, 2 posts)
- ✅ Permissions er sat korrekt (public role har find/findOne)
- ✅ Blog posts er published (publishedAt er sat)
- ❌ **Frontend Next.js applikation får tomme resultater (`[]`) når den kalder samme endpoint**

**Status efter troubleshooting:**
1. ✅ Rettet component file structure
2. ✅ Oprettet manglende controllers/services/routes  
3. ✅ Published blog posts via admin panel
4. ✅ Ændret frontend cache strategi til `no-store` i development
5. ✅ Ryddet Next.js cache (`.next` folder)
6. ✅ Genstartet både Strapi og frontend servere
7. ❌ **Frontend får stadig ingen blog posts**

---

## 1. Content-Type Schema (Blog Post)

**File:** `src/api/blog-post/content-types/blog-post/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "blog_posts",
  "info": {
    "singularName": "blog-post",
    "pluralName": "blog-posts",
    "displayName": "Blog Post",
    "description": "Blog posts for SEO and guides"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "slug": {
      "type": "uid",
      "required": true,
      "unique": true,
      "targetField": "title"
    },
    "excerpt": {
      "type": "text",
      "required": false,
      "maxLength": 500
    },
    "body": {
      "type": "richtext",
      "required": true
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "tags": {
      "type": "string",
      "repeatable": true,
      "required": false
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "default.seo"
    }
  }
}
```

**API Information:**
- **API ID (pluralName):** `blog-posts`
- **REST Endpoint:** `/api/blog-posts`
- **Database Collection:** `blog_posts`
- **Draft & Publish:** `true` (enabled)

---

## 2. SEO Component Schema

**File:** `src/components/default/seo.json`

```json
{
  "kind": "component",
  "collectionName": "components_default_seos",
  "info": {
    "displayName": "SEO",
    "singularName": "seo",
    "pluralName": "seos",
    "description": "Reusable SEO component for meta title, description and OG image"
  },
  "options": {},
  "attributes": {
    "metaTitle": {
      "type": "string",
      "required": false,
      "maxLength": 255
    },
    "metaDescription": {
      "type": "text",
      "required": false,
      "maxLength": 500
    },
    "ogImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    }
  }
}
```

**Component Reference:** `default.seo`

---

## 3. Project Structure

```
src/api/blog-post/
├── content-types/
│   └── blog-post/
│       └── schema.json
├── controllers/
│   └── blog-post.ts
├── services/
│   └── blog-post.ts
└── routes/
    └── blog-post.ts
```

**Controllers/Services/Routes:** All use Strapi v5 factories pattern:
```typescript
// controllers/blog-post.ts
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::blog-post.blog-post');

// services/blog-post.ts
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::blog-post.blog-post');

// routes/blog-post.ts
import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::blog-post.blog-post');
```

---

## 4. Permissions Configuration

**Public Role Permissions** (configured programmatically via bootstrap):

```typescript
// src/bootstrap.ts
const contentTypes = ['api::page.page', 'api::bundle-page.bundle-page', 'api::blog-post.blog-post'];

for (const contentType of contentTypes) {
  const actions = ['find', 'findOne'];
  for (const action of actions) {
    // Enable find and findOne for public role
    await strapi.query('plugin::users-permissions.permission').update({
      where: { id: permission.id },
      data: { enabled: true },
    });
  }
}
```

**Confirmed in Strapi Admin:**
- ✅ Public role has `find` permission for `blog-post`
- ✅ Public role has `findOne` permission for `blog-post`

---

## 5. Direct API Test Results

**Request URL:**
```
GET http://localhost:1337/api/blog-posts?status=published&sort=publishedAt:desc&pagination[limit]=5&populate=coverImage,seo
```

**Response Status:** `200 OK` ✅

**Response Body (truncated):**
```json
{
  "data": [
    {
      "id": 9,
      "documentId": "jtk8o0okf0s4n4vbpu6bhk06",
      "title": "10 Essential Korean Skincare Tips for Glowing Skin",
      "slug": "10-essential-korean-skincare-tips",
      "excerpt": "Discover the secrets of Korean skincare...",
      "body": "<h2>Introduction</h2><p>Korean skincare...",
      "tags": null,
      "publishedAt": "2025-11-20T13:19:41.883Z",
      "createdAt": "2025-11-20T13:19:41.875Z",
      "updatedAt": "2025-11-20T13:19:41.875Z",
      "coverImage": null,
      "seo": {
        "id": 4,
        "metaTitle": "10 Essential Korean Skincare Tips - Beauty Shop Blog",
        "metaDescription": "Learn the top 10 Korean skincare tips..."
      }
    },
    {
      "id": 11,
      "documentId": "ddk5ioxhauz1ga9k6u3z4n4d",
      "title": "Understanding Your Skin Type: A Complete Guide",
      "slug": "understanding-your-skin-type",
      "excerpt": "Learn how to identify your skin type...",
      "body": "<h2>Introduction</h2><p>Understanding...",
      "tags": null,
      "publishedAt": "2025-11-20T13:19:41.896Z",
      "createdAt": "2025-11-20T13:19:41.891Z",
      "updatedAt": "2025-11-20T13:19:41.891Z",
      "coverImage": null,
      "seo": {
        "id": 6,
        "metaTitle": "Understanding Your Skin Type - Complete Guide",
        "metaDescription": "Complete guide to identifying your skin type..."
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

**Query Parameters Used (all valid):**
- ✅ `status=published` - Filters for published entries (draftAndPublish enabled)
- ✅ `sort=publishedAt:desc` - Sorts by publishedAt descending
- ✅ `pagination[limit]=5` - Limits results to 5
- ✅ `populate=coverImage,seo` - Populates media and component relations

---

## 6. What Fixed The Issue

### Problem 1: Component File Structure ❌ → ✅
**Before (incorrect):**
```
src/components/default/seo/seo.json  ❌
```

**After (correct):**
```
src/components/default/seo.json  ✅
```

Strapi v5 expects components directly in category folder, not in subfolders.

### Problem 2: Missing Controllers/Services/Routes ❌ → ✅
Initially had only schema, no API handlers. Added:
- `controllers/blog-post.ts`
- `services/blog-post.ts`
- `routes/blog-post.ts`

### Problem 3: Blog Posts Were Drafts ❌ → ✅
Blog posts existed but had `publishedAt: null`. Published them via admin panel.

### Problem 4: Frontend Cache Strategy ❌ → ✅
Frontend used `cache: "force-cache"` which permanently cached 404 responses.
Changed to `cache: "no-store"` in development.

---

## 7. Current Status & The Actual Problem

### ✅ Direct API Tests Work Perfectly:

**Test 1: List all published blog posts**
```bash
curl 'http://localhost:1337/api/blog-posts?status=published&sort=publishedAt:desc&pagination[limit]=10&populate=coverImage,seo'
```
**Result:** `200 OK` with 2 blog posts returned ✅

**Test 2: Get single blog post by slug**
```bash
curl 'http://localhost:1337/api/blog-posts?status=published&filters[slug][$eq]=10-essential-korean-skincare-tips&populate=coverImage,seo'
```
**Result:** `200 OK` with 1 blog post returned ✅

**Test 3: List all (without status filter)**
```bash
curl 'http://localhost:1337/api/blog-posts?populate=*'
```
**Result:** `200 OK` with 2 blog posts returned ✅

### ❌ Frontend Application Gets Empty Results:

**Frontend Implementation:**
```typescript
// File: src/lib/data/cms/blog.ts
export async function listBlogPosts(
  limit: number = 10,
  sort: string = "publishedAt:desc"
): Promise<BlogPost[]> {
  try {
    const res = await fetchFromStrapi<StrapiListResponse<BlogPostAttributes>>(
      `/api/blog-posts?status=published&sort=${encodeURIComponent(sort)}&pagination[limit]=${limit}&populate=coverImage,seo`
    );

    if (!res.data || !Array.isArray(res.data)) {
      return [];
    }

    return res.data.map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      coverImageUrl: post.coverImage?.data?.url ?? undefined,
      tags: post.tags,
      publishedAt: post.publishedAt,
      seo: post.seo ? {
        metaTitle: post.seo.metaTitle,
        metaDescription: post.seo.metaDescription,
        ogImageUrl: post.seo.ogImage?.data?.url ?? undefined,
      } : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}
```

**Frontend Fetch Configuration:**
```typescript
// File: src/lib/data/cms/strapi-client.ts
async function fetchFromStrapi<T>(path: string, init?: RequestInit): Promise<T> {
  const url = new URL(path, STRAPI_URL).toString();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
    cache: init?.cache ?? (process.env.NODE_ENV === "development" ? "no-store" : "force-cache"),
  });

  if (!res.ok) {
    if (res.status === 404) {
      return { data: [] } as T; // Return empty array for 404
    }
    throw new Error(`Strapi request failed for ${path} (${res.status})`);
  }

  return (await res.json()) as T;
}
```

**Environment Variables:**
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=[valid token set]
```

**Observed Behavior:**
- Frontend calls `listBlogPosts(5)` 
- Function returns empty array `[]`
- No errors thrown or logged
- Same URL works perfectly in curl/browser
- Other content types (pages, bundle-pages) work correctly from frontend

**Comparison:**
| Content Type | Direct API Test | Frontend Result |
|--------------|----------------|-----------------|
| Pages | ✅ Works | ✅ Works |
| Bundle Pages | ✅ Works | ✅ Works |
| Blog Posts | ✅ Works | ❌ Returns `[]` |

---

## 8. Environment

- **Strapi Version:** 5.31.1
- **Node Version:** v24.10.0
- **Database:** PostgreSQL
- **Edition:** Community
- **Environment:** Development

---

## 8. Specific Questions for Strapi Support

### Main Question:
**Why does `/api/blog-posts` return data correctly when tested directly (curl, browser), but returns empty results when called from Next.js frontend, while other content types (pages, bundle-pages) work fine from the same frontend code?**

### Additional Context:
1. **Is there a difference in how `blog-posts` should be queried compared to other collection types?**
   - All three content types use identical permission setup
   - All three use identical component structure (`default.seo`)
   - All three use factories for controllers/services/routes

2. **Could the `draftAndPublish: true` option affect API responses differently for different content types?**
   - Pages: `draftAndPublish: true` → Frontend works ✅
   - Bundle Pages: `draftAndPublish: true` → Frontend works ✅
   - Blog Posts: `draftAndPublish: true` → Frontend returns `[]` ❌

3. **Are there any special considerations for the `status=published` filter in Strapi v5?**
   - Direct test: `?status=published` returns 2 posts ✅
   - Frontend: Same URL returns 0 posts ❌

4. **Could the API token permissions differ for different content types?**
   - Using same token for all requests
   - Public permissions (no token) also returns empty for blog-posts from frontend

### What We've Tried:
- ✅ Verified schema structure matches working content types
- ✅ Verified permissions match working content types
- ✅ Cleared all Next.js cache
- ✅ Changed cache strategy to `no-store`
- ✅ Restarted both servers multiple times
- ✅ Tested without API token (public access)
- ✅ Tested direct API calls (works)
- ✅ Verified blog posts are actually published
- ✅ Verified component structure is correct

### Files Available for Review:
- `src/api/blog-post/content-types/blog-post/schema.json`
- `src/api/blog-post/controllers/blog-post.ts`
- `src/api/blog-post/services/blog-post.ts`
- `src/api/blog-post/routes/blog-post.ts`
- `src/components/default/seo.json`
- `src/bootstrap.ts` (permissions configuration)

All files follow Strapi v5 conventions and match the structure of our working content types.

