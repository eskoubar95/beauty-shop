# Payload CMS Installation Complete - CORE-26

**Date:** 2025-01-13  
**Issue:** CORE-26 - Setup Payload CMS on Supabase stack  
**Status:** ✅ Installation Complete - Following Medusa's Official Guide

---

## Summary

Payload CMS er nu installeret korrekt i Next.js storefront ved at følge [Medusa's officielle Payload integration guide](https://docs.medusajs.com/resources/integrations/guides/payload).

**Build Status:** ✅ Success  
**Admin Route:** `/admin/[[...slug]]` (435 kB)  
**API Route:** `/api/[...slug]` (172 B)

---

## Completed Steps

### ✅ Step 1: Install Dependencies

**Packages installed:**
- `payload@^3.63.0`
- `@payloadcms/db-postgres@^3.63.0`
- `@payloadcms/richtext-lexical@^3.63.0`
- `@payloadcms/next@^3.63.0`
- `sharp@^0.34.5` (for image processing)

---

### ✅ Step 2: Add Undici Resolution

**File:** `beauty-shop-storefront/package.json`

**Changes:**
```json
{
  "resolutions": {
    "@types/react": "npm:types-react@19.0.0-rc.1",
    "@types/react-dom": "npm:types-react-dom@19.0.0-rc.1",
    "undici": "5.20.0"
  },
  "overrides": {
    "react": "19.0.0-rc-66855b96-20241106",
    "react-dom": "19.0.0-rc-66855b96-20241106",
    "undici": "5.20.0"
  }
}
```

**Rationale:** Payload uses `undici` package, but some versions cause errors. Version 5.20.0 is stable.

---

### ✅ Step 3: Copy Payload Template Files

**Files created:**
- `src/app/(payload)/admin/[[...slug]]/page.tsx` - Admin UI route
- `src/app/api/[...slug]/route.ts` - Payload API routes

**Structure:**
```
src/app/
├── (payload)/
│   └── admin/
│       └── [[...slug]]/
│           └── page.tsx
├── (storefront)/
│   └── [countryCode]/
│       ├── (checkout)/
│       └── (main)/
└── api/
    └── [...slug]/
        └── route.ts
```

---

### ✅ Step 4: Move Existing Files to (storefront)

**Files moved:**
- `src/app/[countryCode]/*` → `src/app/(storefront)/[countryCode]/*`
- `src/app/not-found.tsx` → `src/app/(storefront)/not-found.tsx`
- `src/app/opengraph-image.jpg` → `src/app/(storefront)/opengraph-image.jpg`
- `src/app/twitter-image.jpg` → `src/app/(storefront)/twitter-image.jpg`

**Root layout:** `src/app/layout.tsx` remains at root level (shared by both Payload and storefront)

---

### ✅ Step 5: Modify Next.js Middleware

**File:** `src/middleware.ts`

**Changes:**
```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp|admin).*)",
  ],
}
```

**Rationale:** Exclude `/admin` routes from country code redirection (Payload admin should be accessible directly).

---

### ✅ Step 6: Add Payload Configuration

**File:** `src/payload.config.ts`

**Configuration:**
- `serverURL`: `process.env.PAYLOAD_PUBLIC_SERVER_URL`
- `secret`: `process.env.PAYLOAD_SECRET`
- `editor`: `lexicalEditor()` (Lexical rich text editor)
- `db`: `postgresAdapter()` (PostgreSQL adapter with Supabase connection)
- `collections`: `[Users]` (User collection for admin access)
- `sharp`: Sharp for image processing

**Database:**
- Uses `DATABASE_URL` or `PAYLOAD_DATABASE_URL` environment variable
- Connects to Supabase PostgreSQL database
- Payload will create `payload` schema automatically

---

### ✅ Step 7: Add Path Alias

**File:** `tsconfig.json`

**Changes:**
```json
{
  "compilerOptions": {
    "paths": {
      "@lib/*": ["lib/*"],
      "@modules/*": ["modules/*"],
      "@pages/*": ["pages/*"],
      "@components/*": ["components/*"],
      "@payload-config": ["./payload.config.ts"]
    }
  }
}
```

**Rationale:** Payload imports config using `@payload-config` alias.

---

### ✅ Step 8: Customize Next.js Config

**File:** `next.config.js`

**Changes:**
```javascript
const { withPayload } = require("@payloadcms/next/withPayload")

// ... existing config ...

module.exports = withPayload(nextConfig)
```

**Rationale:** `withPayload` plugin wraps Next.js config to integrate Payload with Next.js.

---

### ✅ Step 9: Create Users Collection

**File:** `src/payload/collections/Users.ts`

**Configuration:**
- `slug: "users"`
- `auth: true` (enables authentication)
- `admin.useAsTitle: "email"` (uses email as title in admin UI)

**Rationale:** Users collection is required for admin authentication.

---

### ✅ Step 10: Update Environment Variables

**File:** `beauty-shop-storefront/.env.local`

**Variables added:**
- `PAYLOAD_SECRET` - Payload CMS secret key
- `PAYLOAD_PUBLIC_SERVER_URL` - Public URL for Payload (e.g. http://localhost:8000)
- `DATABASE_URL` - PostgreSQL connection string (from beauty-shop/.env)
- `PAYLOAD_ADMIN_EMAIL` - Bootstrap admin email (optional)
- `PAYLOAD_ADMIN_PASSWORD` - Bootstrap admin password (optional)

---

### ✅ Step 11: Update Environment Validation

**File:** `check-env-variables.js`

**Changes:**
- Added `PAYLOAD_SECRET` validation
- Added `PAYLOAD_PUBLIC_SERVER_URL` validation
- Added `DATABASE_URL` validation

**Rationale:** Ensures all required environment variables are present before build.

---

## Final Structure

```
beauty-shop-storefront/
├── src/
│   ├── app/
│   │   ├── (payload)/
│   │   │   └── admin/
│   │   │       └── [[...slug]]/
│   │   │           └── page.tsx
│   │   ├── (storefront)/
│   │   │   └── [countryCode]/
│   │   │       ├── (checkout)/
│   │   │       └── (main)/
│   │   ├── api/
│   │   │   └── [...slug]/
│   │   │       └── route.ts
│   │   └── layout.tsx
│   ├── payload/
│   │   └── collections/
│   │       └── Users.ts
│   └── payload.config.ts
├── next.config.js (with withPayload)
└── tsconfig.json (with @payload-config alias)
```

---

## Build Results

**Build Status:** ✅ Success

**Routes:**
- `/admin/[[...slug]]` - Payload Admin UI (435 kB)
- `/api/[...slug]` - Payload API routes (172 B)
- `/[countryCode]/*` - Storefront routes (all working)

**No errors in build output.**

---

## Next Steps

### 1. Test Payload Admin UI

**Actions:**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:8000/admin`
3. Verify admin UI loads
4. Create admin user (if not already created)
5. Test login and dashboard

**Expected:**
- Admin UI loads without errors
- No `importMap.js` errors
- No config Context errors
- Dashboard displays correctly

---

### 2. Create Admin User

**Option A: Manual Creation**
1. Navigate to `/admin`
2. Click "Create First User"
3. Enter email and password
4. Submit form

**Option B: Bootstrap Script**
1. Create bootstrap script: `scripts/bootstrap-payload.ts`
2. Run script: `npm run bootstrap:payload`
3. Verify admin user created

---

### 3. Add Collections (Future)

**Collections to add:**
- `Products` - For managing product content
- `Categories` - For managing category content
- `Blog Posts` - For managing blog content
- `Pages` - For managing page content

**Note:** Collections will be added in future phases based on requirements.

---

## Configuration Files

### `src/payload.config.ts`

```typescript
import sharp from "sharp"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { buildConfig } from "payload"
import Users from "./payload/collections/Users"

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "",
  editor: lexicalEditor(),
  collections: [Users],
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URL || process.env.DATABASE_URL || "",
    },
  }),
  sharp,
})
```

---

### `src/app/(payload)/admin/[[...slug]]/page.tsx`

```typescript
import "@payloadcms/next/css"
import configPromise from "@payload-config"
import { RootPage } from "@payloadcms/next/views"

export const dynamic = "force-dynamic"

export default async function PayloadAdminPage({
  params,
  searchParams,
}: AdminPageProps) {
  // ... handle params and searchParams ...
  return RootPage({
    config: configPromise,
    params: Promise.resolve({
      segments: resolvedParams?.slug ?? [],
    }),
    searchParams: Promise.resolve(cleanSearchParams),
  })
}
```

---

### `src/app/api/[...slug]/route.ts`

```typescript
import "@payloadcms/next/css"
import configPromise from "@payload-config"
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes"

// ... export handlers for all HTTP methods ...
```

---

## Environment Variables

### Required Variables

**File:** `beauty-shop-storefront/.env.local`

```env
# Payload CMS
PAYLOAD_SECRET=dzNmqxQlr2GZ/HuMYphHvR95zW8iExJn3njYiOOZquZQwasb7O/PutMbc5xnHQ4g
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:8000
DATABASE_URL=postgresql://postgres.aakjzquwftmtuzxjzxbv:6swY4T5vVR4KpxdM@aws-1-eu-west-1.pooler.supabase.com:6543/postgres

# Optional: Bootstrap admin user
PAYLOAD_ADMIN_EMAIL=nicklaseskou95@gmail.com
PAYLOAD_ADMIN_PASSWORD=supersecret
```

---

## Database Schema

**Schema:** `payload` (created automatically by Payload)

**Tables:**
- `payload_users` - User collection (admin access)
- `payload_migrations` - Migration tracking
- Additional tables will be created when collections are added

---

## Testing

### Build Test

**Command:** `npm run build`

**Result:** ✅ Success
- All routes compile successfully
- Payload admin route: `/admin/[[...slug]]` (435 kB)
- Payload API route: `/api/[...slug]` (172 B)
- Storefront routes: `/[countryCode]/*` (all working)

---

### Dev Server Test (Pending)

**Command:** `npm run dev`

**Expected:**
1. Server starts on port 8000
2. Navigate to `http://localhost:8000/admin`
3. Admin UI loads
4. Create admin user (if first time)
5. Login and access dashboard

---

## Differences from Previous Attempt

### What Changed

1. **Structure:** Followed Medusa's official guide instead of generic Payload setup
2. **Route Groups:** Used `(payload)` and `(storefront)` route groups to separate Payload and storefront routes
3. **API Routes:** Payload API routes are in `src/app/api/[...slug]/route.ts` (not in `(payload)` directory)
4. **Admin Routes:** Payload admin routes are in `src/app/(payload)/admin/[[...slug]]/page.tsx`
5. **Storefront Routes:** Storefront routes are in `src/app/(storefront)/[countryCode]/`
6. **Root Layout:** Shared root layout at `src/app/layout.tsx`

### What Stayed the Same

1. **Dependencies:** Same Payload packages
2. **Configuration:** Similar `payload.config.ts` structure
3. **Environment Variables:** Same variables required

---

## References

- [Medusa's Payload Integration Guide](https://docs.medusajs.com/resources/integrations/guides/payload)
- [Payload CMS Next.js Integration](https://payloadcms.com/docs/nextjs/overview)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- Linear Issue: [CORE-26](https://linear.app/beauty-shop/issue/CORE-26)

---

## Conclusion

Payload CMS er nu installeret korrekt i Next.js storefront ved at følge Medusa's officielle integration guide. Strukturen matcher anbefalingerne, og build lykkedes uden fejl.

**Next Step:** Test Payload admin UI i dev mode og opret admin user.


