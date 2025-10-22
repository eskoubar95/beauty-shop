# 🏗️ Architecture Documentation
**Beauty Shop – E-commerce Platform for Men's Skincare**

**Version:** 2.0  
**Dato:** 21. oktober 2025  
**Status:** Active  
**Dokument ejer:** Nicklas Eskou  
**Architecture Decision:** Monorepo with Turborepo

---

## Executive Summary

Beauty Shop er bygget som en **moderne monorepo** der organiserer 3 separate apps (MedusaJS e-commerce backend, Next.js customer storefront, Payload CMS content management) med delte packages for UI komponenter, TypeScript types og konfigurationsfiler.

**Vigtige arkitektur beslutninger:**
- **Monorepo manager:** Turborepo + pnpm workspaces
- **Database:** Supabase PostgreSQL med schema separation
- **Authentication:** Clerk (string-based user IDs, ikke UUID)
- **E-commerce:** MedusaJS 2.0 (backend + admin i samme app)
- **Content Management:** Payload CMS (separat admin interface)

---

## 1. Monorepo Structure

```
beauty-shop/                    # Root monorepo
├── apps/
│   ├── storefront/            # Next.js 15 frontend (customer-facing)
│   │   ├── app/               # Next.js App Router
│   │   ├── components/
│   │   ├── lib/
│   │   ├── styles/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── admin/                 # Payload CMS (content management)
│   │   ├── collections/
│   │   ├── payload.config.ts
│   │   ├── package.json
│   │   └── server.ts
│   │
│   └── medusa/                # MedusaJS 2.0 (e-commerce backend + admin)
│       ├── src/
│       │   ├── api/
│       │   ├── models/
│       │   ├── services/
│       │   └── subscribers/
│       ├── medusa-config.js
│       └── package.json
│
├── packages/
│   ├── ui/                    # Shared React components
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── types/                 # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── product.ts
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                # Shared configs
│       ├── eslint/
│       │   └── next.js
│       ├── typescript/
│       │   └── base.json
│       └── tailwind/
│           └── base.js
│
├── supabase/                  # Supabase migrations & config
│   ├── config.toml
│   └── migrations/
│       ├── 001_schema_separation.sql
│       └── 002_rls_policies.sql
│
├── scripts/                   # Shared utility scripts
│   ├── apply-database-setup.js
│   ├── test-db-connection.js
│   └── seed-sample-data.js
│
├── .github/
│   └── workflows/
│       ├── ci.yml            # Lint, test, build
│       └── deploy.yml        # Deployment pipeline
│
├── turbo.json                 # Turborepo pipeline config
├── pnpm-workspace.yaml        # pnpm workspace definitions
├── package.json               # Root package.json
├── .env.example               # Environment template
└── README.md
```

---

## 2. Application Architecture

### 2.1 MedusaJS Backend + Admin (`apps/medusa/`)

**Purpose:** E-commerce engine med både API backend og admin dashboard.

**Key Features:**
- **Backend API:** REST API på port `9000`
- **Admin Dashboard:** Built-in UI på port `9000/app`
- **Database:** Direkte Supabase connection
- **Authentication:** Clerk integration for customer auth

**Port:** `http://localhost:9000` (backend + admin)

**Database Schema:** `medusa` schema (MedusaJS tables) + `beauty_shop` schema (custom tables)

```javascript
// apps/medusa/medusa-config.js
module.exports = {
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    jwt_secret: process.env.JWT_SECRET,
    cookie_secret: process.env.COOKIE_SECRET,
  },
  plugins: [
    {
      resolve: `@medusajs/medusa-plugin-stripe`,
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
  ],
}
```

---

### 2.2 Next.js Storefront (`apps/storefront/`)

**Purpose:** Customer-facing webshop med App Router.

**Key Features:**
- **App Router:** Server Components + Server Actions
- **Authentication:** Clerk integration
- **API Client:** MedusaJS client for e-commerce
- **Styling:** Tailwind CSS + shadcn/ui

**Port:** `http://localhost:3000`

**Key Routes:**
- `/` - Landing page
- `/product/[handle]` - Produktdetalje
- `/cart` - Kurv
- `/checkout` - Checkout flow
- `/account/orders` - Ordre oversigt

```typescript
// apps/storefront/lib/medusa-client.ts
import Medusa from "@medusajs/medusa-js"

export const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  maxRetries: 3,
})
```

---

### 2.3 Payload CMS (`apps/admin/`)

**Purpose:** Content management for blog posts, landing pages, og produktindhold.

**Key Features:**
- **Admin UI:** Built-in admin panel
- **Database:** Supabase PostgreSQL (`payload` schema)
- **Collections:** Blog posts, landing pages, media
- **Authentication:** Separate admin users (ikke Clerk)

**Port:** `http://localhost:3001`

**Database Schema:** `payload` schema (Payload CMS tables)

```typescript
// apps/admin/payload.config.ts
import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  admin: {
    user: 'users',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      options: {
        schema: 'payload',
      },
    },
  }),
  collections: [
    {
      name: 'blog-posts',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText', required: true },
        { name: 'featuredImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
})
```

---

## 3. Database Architecture

### 3.1 Schema Separation Strategy

**Rationale:** 
- MedusaJS, Payload CMS og Beauty Shop custom tables skal adskilles for at undgå navnekonflikter
- Bedre organisation og vedligeholdelse
- Nemmere migrations og rollback

**Schemas:**
```sql
-- Schema overview
CREATE SCHEMA IF NOT EXISTS medusa;       -- MedusaJS predefined tables
CREATE SCHEMA IF NOT EXISTS beauty_shop;  -- Beauty Shop custom tables
CREATE SCHEMA IF NOT EXISTS payload;      -- Payload CMS tables

-- Set search_path for each app
-- MedusaJS: search_path = medusa, public
-- Payload: search_path = payload, public
-- Custom: search_path = beauty_shop, public
```

---

### 3.2 Beauty Shop Custom Tables

**Purpose:** Extend MedusaJS with Beauty Shop specific features.

```sql
-- Custom Beauty Shop table
CREATE TABLE beauty_shop.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,           -- Clerk string ID (not UUID!)
  customer_id UUID REFERENCES medusa.customer(id),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  skin_type VARCHAR(50),
  preferences JSONB DEFAULT '{}',
  marketing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_clerk_user_id ON beauty_shop.user_profiles(clerk_user_id);
CREATE INDEX idx_user_profiles_customer_id ON beauty_shop.user_profiles(customer_id);
CREATE INDEX idx_user_profiles_skin_type ON beauty_shop.user_profiles(skin_type);
```

---

### 3.3 RLS Policies (Row Level Security)

**Authentication Method:** Clerk JWT tokens (string-based user IDs)

**Critical Note:** Clerk uses `TEXT` user IDs (e.g., `user_2abc123def456ghi789`), **not UUID**!

```sql
-- Enable RLS on custom Beauty Shop tables
ALTER TABLE beauty_shop.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies using Clerk JWT
CREATE POLICY "Users can view own profile" ON beauty_shop.user_profiles
  FOR SELECT USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can update own profile" ON beauty_shop.user_profiles
  FOR UPDATE USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can insert own profile" ON beauty_shop.user_profiles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);

-- Service role bypass (for backend operations)
CREATE POLICY "Service role full access" ON beauty_shop.user_profiles
  FOR ALL USING (auth.role() = 'service_role');
```

**Important:** Use `auth.jwt() ->> 'sub'` (NOT `auth.uid()`) for Clerk integration!

---

## 4. Shared Packages

### 4.1 `packages/ui/`

**Purpose:** Shared React components med consistent styling.

**Exports:**
```typescript
// packages/ui/src/button.tsx
export const Button = ({ variant, children, ...props }) => {
  return <button className={`btn btn-${variant}`} {...props}>{children}</button>
}

// Usage in apps
import { Button } from '@beauty-shop/ui'
```

---

### 4.2 `packages/types/`

**Purpose:** Shared TypeScript types mellem apps.

**Exports:**
```typescript
// packages/types/src/product.ts
export interface Product {
  id: string
  title: string
  handle: string
  description: string
  images: ProductImage[]
  variants: ProductVariant[]
}

// Usage in apps
import type { Product } from '@beauty-shop/types'
```

---

### 4.3 `packages/config/`

**Purpose:** Shared ESLint, TypeScript og Tailwind configs.

**Exports:**
```javascript
// packages/config/eslint/next.js
module.exports = {
  extends: ['next', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
}

// Usage in apps/storefront/package.json
{
  "eslintConfig": {
    "extends": ["@beauty-shop/eslint-config/next"]
  }
}
```

---

## 5. Development Workflow

### 5.1 Local Development

```bash
# Install dependencies
pnpm install

# Start all apps parallelt
pnpm dev

# Start specific app
pnpm dev --filter=@beauty-shop/storefront

# Build all
pnpm build

# Run tests
pnpm test
```

---

### 5.2 Turborepo Pipeline

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

---

### 5.3 pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// Root package.json
{
  "name": "beauty-shop",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "@beauty-shop/eslint-config": "workspace:*",
    "@beauty-shop/typescript-config": "workspace:*"
  }
}
```

---

## 6. Environment Variables

### 6.1 Global Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=https://aakjzquwftmtuzxjzxbv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres

# Clerk Configuration
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Stripe Configuration
STRIPE_API_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 6.2 App-Specific Variables

**MedusaJS (`apps/medusa/.env`):**
```env
DATABASE_URL=postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
MEDUSA_ADMIN_ONBOARDING_TYPE=default
```

**Next.js Storefront (`apps/storefront/.env.local`):**
```env
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

**Payload CMS (`apps/admin/.env`):**
```env
DATABASE_URL=postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
```

---

## 7. Deployment Architecture

### 7.1 Production Deployment

**MedusaJS Backend:**
- **Host:** Render
- **Port:** 9000
- **URL:** `https://api.beautyshop.com`
- **Admin:** `https://api.beautyshop.com/app`

**Next.js Storefront:**
- **Host:** Vercel
- **URL:** `https://beautyshop.com`

**Payload CMS:**
- **Host:** Render
- **Port:** 3001
- **URL:** `https://admin.beautyshop.com`

**Supabase Database:**
- **Host:** Supabase (managed)
- **Region:** eu-west-1
- **URL:** `https://aakjzquwftmtuzxjzxbv.supabase.co`

---

### 7.2 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
```

---

## 8. Migration from Old Architecture

**Old Architecture (CORE-5):**
- ❌ Separate `backend/` folder med ukoordineret structure
- ❌ Ingen monorepo manager
- ❌ MedusaJS admin antaget som separat app
- ❌ Ingen shared packages

**New Architecture (CORE-16):**
- ✅ Monorepo med Turborepo + pnpm workspaces
- ✅ 3 separate apps (`storefront`, `admin`, `medusa`)
- ✅ Shared packages (`ui`, `types`, `config`)
- ✅ Schema separation i database
- ✅ Korrekt Clerk RLS integration

**Migration Steps:**
1. Delete old `backend/` folder structure
2. Create new monorepo structure per CORE-16
3. Migrate environment variables to new structure
4. Apply database schema separation migrations
5. Update documentation

---

## 9. Security Architecture

### 9.1 Authentication Flow

**Customer Authentication (Clerk):**
```mermaid
sequenceDiagram
    participant User
    participant Storefront
    participant Clerk
    participant MedusaJS
    participant Supabase

    User->>Storefront: Login
    Storefront->>Clerk: Authenticate
    Clerk->>Storefront: JWT Token
    Storefront->>MedusaJS: API Request + JWT
    MedusaJS->>Clerk: Verify JWT
    Clerk->>MedusaJS: User Claims
    MedusaJS->>Supabase: Query with RLS
    Supabase->>MedusaJS: Data
    MedusaJS->>Storefront: Response
```

---

### 9.2 API Security

**Backend API (MedusaJS):**
- **Authentication:** Clerk JWT validation
- **Authorization:** Role-based access control
- **Rate Limiting:** 100 requests/15 min per IP
- **CORS:** Whitelist only storefront domain
- **Input Validation:** Zod schemas

**Supabase Database:**
- **RLS:** Row Level Security enabled
- **Service Role:** Only backend can bypass RLS
- **Anon Key:** Only for public read operations

---

## 10. Performance Optimization

### 10.1 Database Optimization

```sql
-- Indexes for common queries
CREATE INDEX CONCURRENTLY idx_products_handle ON medusa.products(handle);
CREATE INDEX CONCURRENTLY idx_user_profiles_clerk_id ON beauty_shop.user_profiles(clerk_user_id);
CREATE INDEX CONCURRENTLY idx_orders_customer_created ON medusa.orders(customer_id, created_at DESC);

-- Enable query stats
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

---

### 10.2 Caching Strategy

**Next.js Storefront:**
- **ISR:** Revalidate product pages every 60 seconds
- **Static Generation:** Landing page, category pages
- **Client-Side:** Cart state in Zustand

**MedusaJS Backend:**
- **Redis:** Session storage, rate limiting
- **HTTP Caching:** Cache-Control headers on public endpoints

---

## 11. Monitoring & Observability

### 11.1 Error Tracking

**Sentry Integration:**
```typescript
// Sentry configuration for all apps
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

---

### 11.2 Logging Strategy

**Structured Logging:**
```javascript
// Centralized logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

---

## 12. Best Practices

### 12.1 Code Organization

- **Small files:** < 500 LOC per file
- **Single responsibility:** One clear purpose per file/component
- **Naming conventions:** Kebab-case for files, PascalCase for components
- **Import order:** External → Internal → Relative

---

### 12.2 Git Workflow

**Branch Strategy:**
- `main` - Production
- `develop` - Integration
- `feature/CORE-XXX-description` - Features
- `hotfix/CORE-XXX-description` - Critical fixes

**PR Requirements:**
- ✅ Lint passes
- ✅ Type check passes
- ✅ Tests pass
- ✅ Build succeeds
- ✅ ≥1 reviewer approval

---

## 13. Future Architecture Considerations

### 13.1 Scaling Considerations

**Database:**
- Consider read replicas for high traffic
- Implement connection pooling (PgBouncer)
- Monitor query performance

**Backend:**
- Consider microservices for heavy operations
- Implement message queue (Redis/Bull)
- Add CDN for static assets

**Frontend:**
- Implement edge caching (Vercel Edge)
- Consider ISR for all product pages
- Add service worker for offline support

---

### 13.2 Post-MVP Features

**Architecture Changes:**
- WebSockets for real-time inventory updates
- Subscription management system
- Review & rating moderation workflow
- Advanced analytics dashboard

---

## 14. Conclusion

Denne arkitektur dokumentation dækker alle aspekter af Beauty Shop's moderne monorepo setup. Arkitekturen er designet til at være:

- **Skalerbar:** Håndterer vækst fra 0 til 1000+ kunder
- **Vedligeholdelig:** Klar struktur og shared packages
- **Sikker:** RLS policies, authentication, rate limiting
- **Performant:** Optimerede queries, caching, ISR
- **Udviklervenlig:** Clear separation of concerns, consistent patterns

**Relaterede Dokumenter:**
- `01-Project_Brief.md`
- `02-Product_Requirements_Document.md`
- `03-Tech_Stack.md`
- `04-Database_Schema.md`
- `05-API_Design.md`
- `06-Backend_Guide.md`
- `07-Frontend_Guide.md`

---

**Dokument ejer:** Nicklas Eskou  
**Sidst opdateret:** 21. oktober 2025  
**Fil lokation:** `.project/08-Architecture.md`  
**Status:** Active


