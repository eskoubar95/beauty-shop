# 🏗️ Architecture Documentation
**Beauty Shop – E-commerce Platform for Men's Skincare**

**Version:** 3.0  
**Dato:** 24. januar 2025  
**Status:** Active  
**Dokument ejer:** Nicklas Eskou  
**Architecture Decision:** Simple MedusaJS + Next.js Structure

**Note:** This replaces the failed Turborepo monorepo approach (CORE-16) with the correct MedusaJS-recommended architecture (CORE-19).

---

## Executive Summary

Beauty Shop er bygget med **MedusaJS** e-commerce backend og **Next.js 15** storefront i en simpel, separeret arkitektur. Ingen kompleks monorepo - kun to directories med klar separation af concerns.

**Vigtige arkitektur beslutninger:**
- **Structure:** Two separate directories (backend + storefront)
- **Database:** Supabase PostgreSQL med schema separation
- **Authentication:** Clerk (planned - string-based user IDs)
- **E-commerce:** MedusaJS 2.0 (backend + integrated admin)
- **Storefront:** Next.js 15 (App Router)

---

## 1. Project Structure

```
beauty-shop-root/
├── beauty-shop/                    # MedusaJS backend + admin
│   ├── src/
│   │   ├── admin/                 # MedusaJS admin customizations
│   │   ├── api/                   # Custom API routes
│   │   ├── modules/               # Custom modules
│   │   ├── workflows/             # Custom workflows
│   │   └── subscribers/           # Event handlers
│   ├── medusa-config.ts           # Medusa configuration
│   ├── .env                       # Backend environment
│   ├── package.json
│   └── node_modules/
│
├── beauty-shop-storefront/         # Next.js storefront
│   ├── src/
│   │   ├── app/                   # Next.js 15 App Router
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utilities
│   │   └── middleware.ts          # Next.js middleware
│   ├── .env.local                 # Storefront environment
│   ├── package.json
│   └── node_modules/
│
├── supabase/                       # Custom migrations
│   ├── config.toml
│   └── migrations/
│       ├── 20250124000001_beauty_shop_tables.sql
│       └── 20250124000002_clerk_rls_policies.sql
│
├── scripts/                        # Utility scripts
│   ├── validate-env.js
│   ├── health-check.js
│   └── run-migration-direct.js
│
├── .project/                       # Project documentation
├── .backup/                        # Backup of failed monorepo
├── package.json                    # Root package.json (utility scripts)
└── README.md
```

---

## 2. Application Architecture

### 2.1 MedusaJS Backend + Admin (`beauty-shop/`)

**Purpose:** E-commerce engine med både API backend og admin dashboard.

**Key Features:**
- **Backend API:** REST API på port `9000`
- **Admin Dashboard:** Built-in UI på `http://localhost:9000/app`
- **Database:** Supabase PostgreSQL (Transaction Pooler)
- **Authentication:** MedusaJS built-in + Clerk (planned)

**Port:** `http://localhost:9000`

**Database Schema:** `public` schema (MedusaJS tables) + `beauty_shop` schema (custom tables)

```typescript
// beauty-shop/medusa-config.ts
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseExtra: process.env.DATABASE_EXTRA 
      ? JSON.parse(process.env.DATABASE_EXTRA) 
      : undefined,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
})
```

**Admin User:**
- Email: `admin@medusajs.com`
- Password: `supersecret` (change in production!)

---

### 2.2 Next.js Storefront (`beauty-shop-storefront/`)

**Purpose:** Customer-facing webshop med App Router.

**Key Features:**
- **App Router:** Server Components + Server Actions
- **API Client:** MedusaJS SDK for e-commerce
- **Styling:** Tailwind CSS
- **Authentication:** Clerk (planned)

**Port:** `http://localhost:8000`

**Key Routes:**
- `/` - Landing page
- `/[countryCode]/store` - Product catalog
- `/[countryCode]/products/[handle]` - Product detail
- `/[countryCode]/cart` - Shopping cart
- `/[countryCode]/checkout` - Checkout flow
- `/[countryCode]/account` - Customer account

```typescript
// beauty-shop-storefront/src/lib/config.ts
import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

---

## 3. Database Architecture

### 3.1 Schema Separation Strategy

**Rationale:** 
- MedusaJS tables i `public` schema (auto-created)
- Beauty Shop custom tables i `beauty_shop` schema
- Payload CMS tables i `payload` schema (planned)

**Schemas:**
```sql
-- MedusaJS creates its own tables in public schema automatically
-- We only create custom schemas

CREATE SCHEMA IF NOT EXISTS beauty_shop;  -- Beauty Shop custom tables
CREATE SCHEMA IF NOT EXISTS payload;      -- Payload CMS (planned)
```

---

### 3.2 Beauty Shop Custom Tables

**Purpose:** Extend MedusaJS with Beauty Shop specific features.

```sql
-- Custom Beauty Shop tables
CREATE TABLE beauty_shop.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,           -- Clerk string ID
  customer_id UUID,                              -- Reference to public.customer
  phone VARCHAR(20),
  skin_type VARCHAR(50),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE beauty_shop.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES beauty_shop.user_profiles(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE beauty_shop.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  block_type VARCHAR(50) NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_clerk_id ON beauty_shop.user_profiles(clerk_user_id);
CREATE INDEX idx_user_profiles_customer_id ON beauty_shop.user_profiles(customer_id);
CREATE INDEX idx_subscriptions_user_profile_id ON beauty_shop.subscriptions(user_profile_id);
```

---

### 3.3 RLS Policies (Row Level Security)

**Authentication Method:** Clerk JWT tokens (planned)

```sql
-- Enable RLS
ALTER TABLE beauty_shop.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE beauty_shop.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE beauty_shop.content_blocks ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON beauty_shop.user_profiles
  FOR SELECT USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can update own profile" ON beauty_shop.user_profiles
  FOR UPDATE USING (auth.jwt() ->> 'sub' = clerk_user_id);

-- Content blocks policies (public read)
CREATE POLICY "Anyone can view active content blocks" ON beauty_shop.content_blocks
  FOR SELECT USING (is_active = true);
```

---

## 4. Development Workflow

### 4.1 Local Development

```bash
# Start backend
cd beauty-shop
npm run dev

# Start storefront (in separate terminal)
cd beauty-shop-storefront
npm run dev

# Or use root scripts
npm run dev:backend
npm run dev:storefront
npm run dev:all  # Starts both (requires concurrently)
```

---

### 4.2 Database Migrations

```bash
# Run MedusaJS migrations (creates public schema tables)
cd beauty-shop
npx medusa db:migrate

# Run custom Beauty Shop migrations
# (via Supabase Dashboard SQL Editor or direct script)
node scripts/run-migration-direct.js
```

---

## 5. Environment Variables

### 5.1 Backend Environment (`beauty-shop/.env`)

```env
# Supabase Database Configuration (Transaction Pooler)
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# MedusaJS Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com

# Secrets
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

---

### 5.2 Storefront Environment (`beauty-shop-storefront/.env.local`)

```env
# MedusaJS Backend URL
MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API Key (from Medusa Admin)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Store Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=us
```

---

## 6. Deployment Architecture

### 6.1 Production Deployment

**MedusaJS Backend:**
- **Host:** Render or Railway (planned)
- **Port:** 9000
- **URL:** `https://api.beautyshop.com` (planned)
- **Admin:** `https://api.beautyshop.com/app`

**Next.js Storefront:**
- **Host:** Vercel (planned)
- **URL:** `https://beautyshop.com` (planned)

**Supabase Database:**
- **Host:** Supabase (managed)
- **Region:** eu-west-1
- **Connection:** Transaction Pooler for production

---

## 7. Architecture Decisions

### 7.1 Why Not Turborepo Monorepo?

**CORE-16 Failed Approach:**
- ❌ Turborepo + pnpm workspaces
- ❌ Shared packages (ui, types, config)
- ❌ Complex build pipeline
- ❌ Manual MedusaJS setup
- ❌ Never worked correctly

**CORE-19 Correct Approach:**
- ✅ Official `create-medusa-app` CLI
- ✅ Two simple directories
- ✅ No unnecessary abstraction
- ✅ Follows MedusaJS documentation
- ✅ Working in 4 hours vs 8 hours failed

**Key Lesson:** Follow the framework, don't fight it.

---

### 7.2 Why Supabase Transaction Pooler?

**Benefits:**
- Better connection management
- Handles concurrent connections
- Production-ready
- Supabase recommendation

**Configuration:**
```env
# Session Pooler (port 5432) - for long-running connections
# Transaction Pooler (port 6543) - for short-lived connections (recommended)
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

---

## 8. Security Architecture

### 8.1 Authentication Flow (Planned)

**Customer Authentication (Clerk):**
- Clerk handles authentication
- JWT tokens for API requests
- RLS policies in Supabase
- MedusaJS custom auth module

**Admin Authentication:**
- MedusaJS built-in admin auth
- Separate from customer auth
- Admin user created via CLI

---

### 8.2 API Security

**MedusaJS Backend:**
- CORS configuration for storefront
- JWT secrets for session management
- Environment-based configuration

**Supabase Database:**
- RLS enabled on custom tables
- Service role for backend operations
- Anon key for public reads (planned)

---

## 9. Performance Optimization

### 9.1 Database Optimization

```sql
-- Indexes for common queries
CREATE INDEX idx_user_profiles_clerk_id ON beauty_shop.user_profiles(clerk_user_id);
CREATE INDEX idx_subscriptions_status ON beauty_shop.subscriptions(status);
CREATE INDEX idx_content_blocks_active ON beauty_shop.content_blocks(is_active);
```

---

### 9.2 Caching Strategy

**Next.js Storefront:**
- ISR (Incremental Static Regeneration) for product pages
- Static generation for landing pages
- Turbopack for fast development builds

**MedusaJS Backend:**
- Redis (optional - not required for development)
- HTTP caching headers

---

## 10. Monitoring & Observability

### 10.1 Error Tracking (Planned)

**Sentry Integration:**
- Frontend error tracking
- Backend error tracking
- Performance monitoring

---

### 10.2 Health Checks

```bash
# Backend health check
curl http://localhost:9000/health

# Run health check script
npm run health-check
```

---

## 11. Migration from Old Architecture

**From CORE-16 (Failed Monorepo):**
1. Full backup created in `.backup/2025-01-24-failed-monorepo/`
2. Deleted `apps/`, `packages/`, `turbo.json`, `pnpm-workspace.yaml`
3. Fresh install with `create-medusa-app`
4. Reintegrated custom migrations
5. Updated all documentation

**Timeline:**
- CORE-16 (Failed): ~8 hours, never working
- CORE-19 (Success): ~4 hours, fully functional

---

## 12. Future Considerations

### 12.1 Planned Features

**Authentication:**
- Clerk integration for customer auth
- Custom MedusaJS auth module

**Content Management:**
- Payload CMS integration (as MedusaJS module)
- Blog posts and landing pages

**Payments:**
- Stripe integration
- Multiple payment methods

**Analytics:**
- Product analytics
- Customer behavior tracking

---

### 12.2 Scaling Considerations

**Database:**
- Connection pooling (already using Transaction Pooler)
- Read replicas (if needed)
- Query optimization

**Backend:**
- Horizontal scaling on Render
- Redis for caching (if needed)
- CDN for static assets

**Frontend:**
- Edge caching on Vercel
- Image optimization
- Service worker for offline support

---

## 13. Related Documentation

- `README.md` - Setup guide
- `01-Project_Brief.md` - Project overview
- `02-Product_Requirements_Document.md` - Full PRD
- `03-Tech_Stack.md` - Technology choices
- `04-Database_Schema.md` - Database design
- `05-API_Design.md` - API endpoints
- `06-Backend_Guide.md` - Backend development
- `07-Frontend_Guide.md` - Frontend development
- `lessons-learned.md` - CORE-19 post-mortem

---

## 14. Conclusion

Denne arkitektur er **simpel, funktionel og vedligeholdelig**. Ved at følge MedusaJS' officielle vejledning og undgå unødvendig kompleksitet, har vi opnået en robust løsning der er klar til udvikling.

**Key Principles:**
- **Simplicity:** Two directories, clear separation
- **Official tools:** Using `create-medusa-app`
- **Documentation:** Following MedusaJS docs
- **Pragmatism:** Solve problems, don't create them

---

**Dokument ejer:** Nicklas Eskou  
**Sidst opdateret:** 24. januar 2025  
**Fil lokation:** `.project/08-Architecture.md`  
**Status:** Active  
**Revision:** 3.0 (CORE-19)
