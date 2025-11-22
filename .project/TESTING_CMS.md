# Testing CMS Functionality

## Prerequisites

1. **Strapi CMS running** (port 1337)
2. **Storefront running** (port 8000)
3. **Test data seeded** in Strapi

## Step 1: Ensure Strapi has Test Data

### ⚠️ IMPORTANT: Genstart Strapi

Strapi skal genstartes for at:
- Registrere content types fra schema filer
- Køre bootstrap script (permissions)
- Køre seed script (test data)

**Genstart Strapi:**
```bash
cd beauty-shop-cms
# Stop nuværende Strapi (Ctrl+C i terminalen hvor den kører)
npm run develop
```

**Ved start skal du se i output:**
- Content types bliver registreret
- `✅ Enabled api::page.page.find for public role`
- `🌱 Seeding Beauty Shop CMS data...`
- `✅ Created About page`

### Option A: Seed via Environment Variable

Tilføj til `beauty-shop-cms/.env`:
```
SEED_DATA=true
```

Derefter genstart Strapi (se ovenfor).

### Option B: Seed via Admin UI

1. Open http://localhost:1337/admin
2. Navigate to Content Manager
3. Create:
   - **Page** with slug `about`
   - **Bundle Page** with slug `essentials`
   - **Blog Post** with any slug

## Step 2: Test via Browser

### Test Route (Recommended)

1. Open: http://localhost:8000/dk/test-cms
2. You should see:
   - ✅ Test 1: Page (About) - Success
   - ✅ Test 2: Bundle Page (Essentials) - Success
   - ✅ Test 3: Blog Posts List - Success
   - ✅ Test 4: Single Blog Post - Success

### Direct API Tests

Test Strapi API directly:

```bash
# Test Pages
curl 'http://localhost:1337/api/pages?filters[slug][$eq]=about&populate=seo'

# Test Bundle Pages
curl 'http://localhost:1337/api/bundle-pages?filters[slug][$eq]=essentials&populate=*'

# Test Blog Posts
curl 'http://localhost:1337/api/blog-posts?populate=*'
```

## Step 3: Test in Code

### Test CMS Helpers

Create a test component or use the test route:

```typescript
import { getPageBySlug } from "@lib/data/cms/pages";
import { getBundlePageBySlug } from "@lib/data/cms/bundle-pages";
import { listBlogPosts } from "@lib/data/cms/blog";

// In a Server Component
const page = await getPageBySlug("about");
const bundle = await getBundlePageBySlug("essentials");
const posts = await listBlogPosts(10);
```

## Step 4: Verify Environment Variables

Check `beauty-shop-storefront/.env.local`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=... # Optional, only if Strapi requires auth
```

## Troubleshooting

### "Page not found" errors

- Ensure Strapi is running: `lsof -ti:1337`
- Check Strapi has data: Visit http://localhost:1337/admin
- Verify environment variable: `echo $NEXT_PUBLIC_STRAPI_URL`

### CORS errors

- Check `beauty-shop-cms/config/middlewares.ts` includes your storefront URL
- Ensure `CORS_ORIGIN` in Strapi `.env` includes `http://localhost:8000`

### 401/403 errors

- Check if Strapi content types have public permissions
- Verify `STRAPI_API_TOKEN` if using authenticated endpoints
- Check Strapi bootstrap script ran correctly

## Cleanup

After testing, you can remove the test route:

```bash
rm beauty-shop-storefront/src/app/[countryCode]/(main)/test-cms/page.tsx
```

