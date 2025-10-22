# 🚀 Backend Udviklingsguide
**Beauty Shop – E-commerce Platform for Men's Skincare**

**Version:** 1.0  
**Dato:** 14. oktober 2025  
**Status:** Ready for Implementation  
**Dokument ejer:** Nicklas Eskou  
**Target Audience:** Mid-level developers building from scratch

---

## Indholdsfortegnelse

1. [Projekt Setup & Environment](#1-projekt-setup--environment)
2. [Development Phases](#2-development-phases)
3. [Phase 1: Basic Setup og Core Models](#3-phase-1-basic-setup-og-core-models)
4. [Phase 2: Authentication System](#4-phase-2-authentication-system)
5. [Phase 3: Core Business Logic APIs](#5-phase-3-core-business-logic-apis)
6. [Phase 4: Advanced Features](#6-phase-4-advanced-features)
7. [Phase 5: Testing og Optimization](#7-phase-5-testing-og-optimization)
8. [Code Structure Guidelines](#8-code-structure-guidelines)
9. [Deployment Preparation](#9-deployment-preparation)
10. [Troubleshooting & Common Issues](#10-troubleshooting--common-issues)

---

## 1. Projekt Setup & Environment

### 1.1 Prerequisites

**System Requirements:**
- Node.js 20.x eller nyere
- pnpm 8.x eller nyere (anbefalet for monorepo)
- PostgreSQL 15.x (håndteres af Supabase)
- Git 2.40+

**Development Tools:**
- VS Code med anbefalede extensions
- Postman eller Insomnia for API testing
- Docker (valgfrit, for lokale services)

**⚠️ Important:** Beauty Shop bruger en **monorepo struktur** med Turborepo + pnpm workspaces. MedusaJS backend er placeret i `apps/medusa/` sammen med Next.js storefront (`apps/storefront/`) og Payload CMS (`apps/admin/`).

**Monorepo Benefits:**
- Shared packages (`packages/ui/`, `packages/types/`, `packages/config/`)
- Coordinated builds med Turborepo
- Type safety på tværs af apps
- Consistent tooling og dependencies

### 1.2 Environment Setup

#### **Step 1: Opret Supabase Projekt**

```bash
# Installer Supabase CLI
npm install -g supabase

# Login til Supabase
supabase login

# Opret nyt projekt
supabase projects create beauty-shop --region eu-west-1

# Noter ned:
# - Project URL: https://your-project.supabase.co
# - Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# - Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Step 2: Opret MedusaJS Backend**

```bash
# Opret MedusaJS projekt
npx create-medusa-app@latest beauty-shop-backend

cd beauty-shop-backend

# Installer dependencies
npm install

# Installer Stripe plugin
npm install @medusajs/medusa-plugin-stripe

# Installer Sentry plugin
npm install @medusajs/medusa-plugin-sentry
```

#### **Step 3: Konfigurer Environment Variables**

Opret `.env` fil i backend root:

```bash
# Database
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
REDIS_URL="redis://localhost:6379"

# Medusa
MEDUSA_ADMIN_ONBOARDING_TYPE="default"
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY="../beauty-shop-frontend"

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Clerk
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Sentry
SENTRY_DSN="https://..."

# App
JWT_SECRET="your-jwt-secret"
COOKIE_SECRET="your-cookie-secret"
```

#### **Step 4: Database Schema Setup**

```bash
# Kør MedusaJS migrationer
npx medusa db:migrate

# Seed database med sample data
npx medusa db:seed -f ./data/seed.json
```

### 1.3 Project Structure

```
beauty-shop-backend/
├── src/
│   ├── api/                 # API routes
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   ├── subscribers/         # Event handlers
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── migrations/              # Database migrations
├── data/                    # Seed data
├── medusa-config.js         # MedusaJS configuration
└── package.json
```

---

## 2. Development Phases

### **Phase Overview:**

| Phase | Duration | Focus | Deliverables |
|-------|----------|-------|-------------|
| **Phase 1** | 1-2 uger | Basic setup og core models | Database schema, basic API structure |
| **Phase 2** | 1 uge | Authentication system | Clerk integration, user management |
| **Phase 3** | 2-3 uger | Core business logic APIs | Products, cart, checkout, orders |
| **Phase 4** | 1-2 uger | Advanced features | Subscriptions, reviews, admin |
| **Phase 5** | 1 uge | Testing og optimization | Tests, performance, security |

**Total Development Time:** 6-9 uger

---

## 3. Phase 1: Basic Setup og Core Models

### 3.1 Objectives

- Opret database schema i Supabase
- Setup MedusaJS med core e-commerce funktionalitet
- Implementer basic product management
- Opret API structure og routing

### 3.2 Step-by-Step Implementation

#### **Step 1: Database Schema Implementation**

Opret `migrations/001_initial_schema.sql`:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE fulfillment_status AS ENUM ('not_fulfilled', 'fulfilled', 'shipped', 'delivered', 'returned');

-- User profiles (extension to Medusa customer)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES medusa.customer(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    skin_type VARCHAR(50),
    preferences JSONB DEFAULT '{}',
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products (custom extension)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    handle VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('kit', 'single')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price INTEGER NOT NULL,
    compare_at_price INTEGER,
    cost_price INTEGER,
    inventory_quantity INTEGER DEFAULT 0,
    weight INTEGER,
    dimensions JSONB,
    barcode VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    type VARCHAR(50) DEFAULT 'image' CHECK (type IN ('image', 'video', 'gif')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product metadata
CREATE TABLE public.product_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, key)
);

-- Waitlist
CREATE TABLE public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    source VARCHAR(50),
    referral_code VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_profiles_clerk_user_id ON public.user_profiles(clerk_user_id);
CREATE INDEX idx_products_handle ON public.products(handle);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **Step 2: MedusaJS Configuration**

Opret `medusa-config.js`:

```javascript
const { MedusaConfig } = require("@medusajs/medusa")

const config = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    store_cors: process.env.STORE_CORS || "http://localhost:8000,http://localhost:3000",
    admin_cors: process.env.ADMIN_CORS || "http://localhost:7001,http://localhost:3000",
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
    {
      resolve: `@medusajs/medusa-plugin-sentry`,
      options: {
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
      },
    },
  ],
}

module.exports = config
```

#### **Step 3: Basic API Structure**

Opret `src/api/index.js`:

```javascript
const express = require("express")
const cors = require("cors")

const app = express()

// Middleware
app.use(cors({
  origin: process.env.STORE_CORS?.split(",") || ["http://localhost:3000"],
  credentials: true
}))
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// API routes
app.use("/v1/products", require("./routes/products"))
app.use("/v1/carts", require("./routes/carts"))
app.use("/v1/orders", require("./routes/orders"))
app.use("/v1/customers", require("./routes/customers"))
app.use("/v1/waitlist", require("./routes/waitlist"))

module.exports = app
```

#### **Step 4: Product Service Implementation**

Opret `src/services/product.js`:

```javascript
const { MedusaService } = require("@medusajs/medusa")
const { SupabaseClient } = require("@supabase/supabase-js")

class ProductService extends MedusaService {
  constructor(container) {
    super(container)
    this.supabase = new SupabaseClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }

  async listProducts(filters = {}) {
    const { data, error } = await this.supabase
      .from("products")
      .select(`
        *,
        product_variants(*),
        product_images(*),
        product_metadata(*)
      `)
      .eq("status", filters.status || "published")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getProduct(handle) {
    const { data, error } = await this.supabase
      .from("products")
      .select(`
        *,
        product_variants(*),
        product_images(*),
        product_metadata(*)
      `)
      .eq("handle", handle)
      .single()

    if (error) throw error
    return data
  }

  async createProduct(productData) {
    const { data, error } = await this.supabase
      .from("products")
      .insert(productData)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

module.exports = ProductService
```

#### **Step 5: Product Routes**

Opret `src/api/routes/products.js`:

```javascript
const express = require("express")
const router = express.Router()

// GET /v1/products
router.get("/", async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    const products = await productService.listProducts(req.query)
    
    res.json({
      items: products,
      pageInfo: {
        nextCursor: null // Implement pagination later
      }
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente produkter",
        details: error.message
      }
    })
  }
})

// GET /v1/products/handle/:handle
router.get("/handle/:handle", async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.getProduct(req.params.handle)
    
    if (!product) {
      return res.status(404).json({
        error: {
          code: "not_found",
          message: "Produkt ikke fundet"
        }
      })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente produkt",
        details: error.message
      }
    })
  }
})

module.exports = router
```

### 3.3 Testing Checkpoint

```bash
# Start MedusaJS development server
npm run dev

# Test endpoints
curl http://localhost:9000/health
curl http://localhost:9000/v1/products
```

### 3.4 Common Issues & Solutions

**Issue:** Database connection fejl
**Solution:** Tjek DATABASE_URL format og Supabase credentials

**Issue:** CORS errors
**Solution:** Opdater STORE_CORS environment variable

**Issue:** Product service ikke fundet
**Solution:** Registrer service i MedusaJS container

---

## 4. Phase 2: Authentication System

### 4.1 Objectives

- Integrer Clerk authentication
- Opret user profile management
- Implementer authorization middleware
- Setup JWT token validation

### 4.2 Step-by-Step Implementation

#### **Step 1: Clerk Integration**

Install dependencies:

```bash
npm install @clerk/backend
npm install jsonwebtoken
```

Opret `src/middleware/auth.js`:

```javascript
const { verifyToken } = require("@clerk/backend")
const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: {
          code: "unauthorized",
          message: "Authorization token påkrævet"
        }
      })
    }

    const token = authHeader.substring(7)
    
    // Verify Clerk JWT
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    })

    req.user = {
      id: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name
    }

    next()
  } catch (error) {
    res.status(401).json({
      error: {
        code: "unauthorized",
        message: "Ugyldigt token",
        details: error.message
      }
    })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      })
      
      req.user = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name
      }
    }
    
    next()
  } catch (error) {
    // Continue without auth for optional endpoints
    next()
  }
}

module.exports = { authMiddleware, optionalAuth }
```

#### **Step 2: User Profile Service**

Opret `src/services/user-profile.js`:

```javascript
const { MedusaService } = require("@medusajs/medusa")
const { SupabaseClient } = require("@supabase/supabase-js")

class UserProfileService extends MedusaService {
  constructor(container) {
    super(container)
    this.supabase = new SupabaseClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }

  async createOrUpdateProfile(clerkUserId, profileData) {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .upsert({
        clerk_user_id: clerkUserId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getProfileByClerkId(clerkUserId) {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async linkToCustomer(clerkUserId, customerId) {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .update({ customer_id: customerId })
      .eq("clerk_user_id", clerkUserId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

module.exports = UserProfileService
```

#### **Step 3: Customer Routes**

Opret `src/api/routes/customers.js`:

```javascript
const express = require("express")
const { authMiddleware } = require("../middleware/auth")
const router = express.Router()

// POST /v1/customers
router.post("/", authMiddleware, async (req, res) => {
  try {
    const customerService = req.scope.resolve("customerService")
    const userProfileService = req.scope.resolve("userProfileService")
    
    // Create Medusa customer
    const customer = await customerService.create({
      email: req.user.email,
      first_name: req.user.firstName,
      last_name: req.user.lastName
    })

    // Create or update user profile
    await userProfileService.createOrUpdateProfile(req.user.id, {
      phone: req.body.phone,
      skin_type: req.body.skinType,
      marketing_consent: req.body.marketingConsent || false
    })

    // Link profile to customer
    await userProfileService.linkToCustomer(req.user.id, customer.id)

    res.status(201).json({
      id: customer.id,
      email: customer.email
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke oprette kunde",
        details: error.message
      }
    })
  }
})

// GET /v1/customers/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const customerService = req.scope.resolve("customerService")
    const userProfileService = req.scope.resolve("userProfileService")
    
    // Get customer by email
    const customer = await customerService.retrieveByEmail(req.user.email)
    
    if (!customer) {
      return res.status(404).json({
        error: {
          code: "not_found",
          message: "Kunde ikke fundet"
        }
      })
    }

    // Get user profile
    const profile = await userProfileService.getProfileByClerkId(req.user.id)

    res.json({
      id: customer.id,
      email: customer.email,
      profile: profile
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente kundedata",
        details: error.message
      }
    })
  }
})

// GET /v1/customers/me/orders
router.get("/me/orders", authMiddleware, async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")
    
    const orders = await orderService.list({
      customer_id: req.user.id,
      limit: req.query.limit || 10
    })

    res.json({
      items: orders,
      pageInfo: {
        nextCursor: null
      }
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente ordrer",
        details: error.message
      }
    })
  }
})

module.exports = router
```

### 4.3 Testing Checkpoint

```bash
# Test authentication
curl -H "Authorization: Bearer YOUR_CLERK_JWT" \
     http://localhost:9000/v1/customers/me

# Test customer creation
curl -X POST \
     -H "Authorization: Bearer YOUR_CLERK_JWT" \
     -H "Content-Type: application/json" \
     -d '{"phone": "+45 12345678", "skinType": "combination"}' \
     http://localhost:9000/v1/customers
```

### 4.4 Common Issues & Solutions

**Issue:** Clerk token validation fejler
**Solution:** Tjek CLERK_SECRET_KEY og token format

**Issue:** User profile ikke oprettet
**Solution:** Verificer Supabase connection og table permissions

**Issue:** Customer linking fejler
**Solution:** Tjek MedusaJS customer service integration

---

## 5. Phase 3: Core Business Logic APIs

### 5.1 Objectives

- Implementer cart management
- Opret checkout flow med Stripe
- Implementer order processing
- Opret waitlist functionality

### 5.2 Step-by-Step Implementation

#### **Step 1: Cart Service**

Opret `src/services/cart.js`:

```javascript
const { MedusaService } = require("@medusajs/medusa")

class CartService extends MedusaService {
  async createCart(cartData = {}) {
    const cart = await this.create({
      currency_code: cartData.currencyCode || "dkk",
      email: cartData.email
    })
    
    return cart
  }

  async addLineItem(cartId, lineItemData) {
    const { variantId, quantity } = lineItemData
    
    // Get variant details
    const variantService = this.container.resolve("productVariantService")
    const variant = await variantService.retrieve(variantId)
    
    if (!variant) {
      throw new Error("Variant ikke fundet")
    }

    if (variant.inventory_quantity < quantity) {
      throw new Error("Utilstrækkeligt lager")
    }

    // Add line item
    const lineItem = await this.addLineItem(cartId, {
      variant_id: variantId,
      quantity: quantity,
      unit_price: variant.calculated_price.calculated_amount
    })

    return lineItem
  }

  async updateLineItem(cartId, lineItemId, quantity) {
    if (quantity <= 0) {
      return await this.removeLineItem(cartId, lineItemId)
    }

    return await this.updateLineItem(cartId, lineItemId, { quantity })
  }

  async setShippingAddress(cartId, address) {
    return await this.update(cartId, {
      shipping_address: address
    })
  }

  async setGiftOptions(cartId, giftData) {
    return await this.update(cartId, {
      metadata: {
        ...this.retrieve(cartId).metadata,
        gift: giftData
      }
    })
  }
}

module.exports = CartService
```

#### **Step 2: Cart Routes**

Opret `src/api/routes/carts.js`:

```javascript
const express = require("express")
const { optionalAuth } = require("../middleware/auth")
const router = express.Router()

// POST /v1/carts
router.post("/", optionalAuth, async (req, res) => {
  try {
    const cartService = req.scope.resolve("cartService")
    const cart = await cartService.createCart(req.body)
    
    res.status(201).json(cart)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke oprette kurv",
        details: error.message
      }
    })
  }
})

// GET /v1/carts/:cartId
router.get("/:cartId", async (req, res) => {
  try {
    const cartService = req.scope.resolve("cartService")
    const cart = await cartService.retrieve(req.params.cartId, {
      relations: ["items", "items.variant", "items.variant.product"]
    })
    
    res.json(cart)
  } catch (error) {
    res.status(404).json({
      error: {
        code: "not_found",
        message: "Kurv ikke fundet"
      }
    })
  }
})

// POST /v1/carts/:cartId/line-items
router.post("/:cartId/line-items", async (req, res) => {
  try {
    const cartService = req.scope.resolve("cartService")
    const lineItem = await cartService.addLineItem(req.params.cartId, req.body)
    
    res.status(201).json(lineItem)
  } catch (error) {
    if (error.message === "Variant ikke fundet") {
      return res.status(404).json({
        error: {
          code: "not_found",
          message: "Produktvariant ikke fundet"
        }
      })
    }
    
    if (error.message === "Utilstrækkeligt lager") {
      return res.status(409).json({
        error: {
          code: "insufficient_inventory",
          message: "Utilstrækkeligt lager"
        }
      })
    }

    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke tilføje vare",
        details: error.message
      }
    })
  }
})

// PATCH /v1/carts/:cartId/line-items/:lineItemId
router.patch("/:cartId/line-items/:lineItemId", async (req, res) => {
  try {
    const cartService = req.scope.resolve("cartService")
    const lineItem = await cartService.updateLineItem(
      req.params.cartId,
      req.params.lineItemId,
      req.body.quantity
    )
    
    res.json(lineItem)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke opdatere vare",
        details: error.message
      }
    })
  }
})

// DELETE /v1/carts/:cartId/line-items/:lineItemId
router.delete("/:cartId/line-items/:lineItemId", async (req, res) => {
  try {
    const cartService = req.scope.resolve("cartService")
    await cartService.removeLineItem(req.params.cartId, req.params.lineItemId)
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke fjerne vare",
        details: error.message
      }
    })
  }
})

// POST /v1/carts/:cartId/shipping-address
router.post("/:cartId/shipping-address", async (req, res) => {
  try {
    const cartService = req.scope.resolve("cartService")
    const cart = await cartService.setShippingAddress(req.params.cartId, req.body)
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke sætte leveringsadresse",
        details: error.message
      }
    })
  }
})

// POST /v1/carts/:cartId/gift
router.post("/:cartId/gift", async (req, res) => {
  try {
    const cartService = req.scope.resolve("cartService")
    const cart = await cartService.setGiftOptions(req.params.cartId, req.body)
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke sætte gaveindstillinger",
        details: error.message
      }
    })
  }
})

module.exports = router
```

#### **Step 3: Checkout Service**

Opret `src/services/checkout.js`:

```javascript
const { MedusaService } = require("@medusajs/medusa")
const Stripe = require("stripe")

class CheckoutService extends MedusaService {
  constructor(container) {
    super(container)
    this.stripe = new Stripe(process.env.STRIPE_API_KEY)
  }

  async createPaymentSession(cartId, returnUrl) {
    const cart = await this.retrieve(cartId, {
      relations: ["items", "items.variant", "shipping_address"]
    })

    if (!cart.items || cart.items.length === 0) {
      throw new Error("Kurv er tom")
    }

    // Create Stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.items.map(item => ({
        price_data: {
          currency: "dkk",
          product_data: {
            name: item.variant.title,
            description: item.variant.product.title
          },
          unit_amount: item.unit_price
        },
        quantity: item.quantity
      })),
      mode: "payment",
      success_url: returnUrl,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        cart_id: cartId
      }
    })

    return {
      provider: "stripe",
      checkoutUrl: session.url,
      sessionId: session.id
    }
  }

  async completeOrder(cartId) {
    const cart = await this.retrieve(cartId, {
      relations: ["items", "items.variant", "shipping_address"]
    })

    if (!cart.items || cart.items.length === 0) {
      throw new Error("Kurv er tom")
    }

    // Create order
    const order = await this.create({
      cart_id: cartId,
      email: cart.email,
      shipping_address: cart.shipping_address,
      currency_code: cart.currency_code,
      region_id: "reg_01H...", // Default region
      payment_collection_id: "paycol_01H..." // Create payment collection
    })

    return order
  }
}

module.exports = CheckoutService
```

#### **Step 4: Checkout Routes**

Opret `src/api/routes/checkout.js`:

```javascript
const express = require("express")
const { optionalAuth } = require("../middleware/auth")
const router = express.Router()

// POST /v1/carts/:cartId/payment-sessions
router.post("/:cartId/payment-sessions", optionalAuth, async (req, res) => {
  try {
    const checkoutService = req.scope.resolve("checkoutService")
    const session = await checkoutService.createPaymentSession(
      req.params.cartId,
      req.body.returnUrl
    )
    
    res.json(session)
  } catch (error) {
    if (error.message === "Kurv er tom") {
      return res.status(400).json({
        error: {
          code: "empty_cart",
          message: "Kurv er tom"
        }
      })
    }

    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke oprette betalingssession",
        details: error.message
      }
    })
  }
})

// POST /v1/carts/:cartId/complete
router.post("/:cartId/complete", optionalAuth, async (req, res) => {
  try {
    const checkoutService = req.scope.resolve("checkoutService")
    const order = await checkoutService.completeOrder(req.params.cartId)
    
    res.status(201).json({
      order: {
        id: order.id,
        orderNumber: order.display_id,
        status: order.status,
        paymentStatus: order.payment_status,
        total: order.total,
        email: order.email,
        items: order.items.map(item => ({
          title: item.variant.title,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total
        })),
        shippingAddress: order.shipping_address,
        createdAt: order.created_at
      }
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke fuldføre ordre",
        details: error.message
      }
    })
  }
})

module.exports = router
```

#### **Step 5: Waitlist Service**

Opret `src/services/waitlist.js`:

```javascript
const { MedusaService } = require("@medusajs/medusa")
const { SupabaseClient } = require("@supabase/supabase-js")

class WaitlistService extends MedusaService {
  constructor(container) {
    super(container)
    this.supabase = new SupabaseClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }

  async addToWaitlist(email, data = {}) {
    const { data: entry, error } = await this.supabase
      .from("waitlist")
      .insert({
        email,
        first_name: data.firstName,
        source: data.source || "unknown",
        referral_code: data.referralCode,
        ip_address: data.ipAddress,
        user_agent: data.userAgent
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") { // Unique constraint violation
        throw new Error("Email allerede på venteliste")
      }
      throw error
    }

    return entry
  }

  async getWaitlistCount() {
    const { count, error } = await this.supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })

    if (error) throw error
    return count
  }

  async getWaitlistEntries(filters = {}) {
    let query = this.supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: false })

    if (filters.q) {
      query = query.or(`email.ilike.%${filters.q}%,first_name.ilike.%${filters.q}%`)
    }

    if (filters.source) {
      query = query.eq("source", filters.source)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }
}

module.exports = WaitlistService
```

#### **Step 6: Waitlist Routes**

Opret `src/api/routes/waitlist.js`:

```javascript
const express = require("express")
const { authMiddleware } = require("../middleware/auth")
const router = express.Router()

// POST /v1/waitlist
router.post("/", async (req, res) => {
  try {
    const waitlistService = req.scope.resolve("waitlistService")
    
    const entry = await waitlistService.addToWaitlist(req.body.email, {
      firstName: req.body.firstName,
      source: req.body.source,
      referralCode: req.body.referralCode,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    })
    
    res.status(201).json(entry)
  } catch (error) {
    if (error.message === "Email allerede på venteliste") {
      return res.status(409).json({
        error: {
          code: "conflict",
          message: "Email allerede på venteliste"
        }
      })
    }

    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke tilføje til venteliste",
        details: error.message
      }
    })
  }
})

// GET /v1/waitlist/count
router.get("/count", async (req, res) => {
  try {
    const waitlistService = req.scope.resolve("waitlistService")
    const count = await waitlistService.getWaitlistCount()
    
    res.json({ count })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente antal",
        details: error.message
      }
    })
  }
})

// GET /v1/admin/waitlist
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    // Check admin role
    if (!req.user.roles?.includes("admin")) {
      return res.status(403).json({
        error: {
          code: "forbidden",
          message: "Admin adgang påkrævet"
        }
      })
    }

    const waitlistService = req.scope.resolve("waitlistService")
    const entries = await waitlistService.getWaitlistEntries(req.query)
    
    res.json({
      items: entries,
      pageInfo: {
        nextCursor: null
      }
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente venteliste",
        details: error.message
      }
    })
  }
})

module.exports = router
```

### 5.3 Testing Checkpoint

```bash
# Test cart creation
curl -X POST http://localhost:9000/v1/carts \
     -H "Content-Type: application/json" \
     -d '{"currencyCode": "dkk", "email": "test@example.com"}'

# Test add to cart
curl -X POST http://localhost:9000/v1/carts/CART_ID/line-items \
     -H "Content-Type: application/json" \
     -d '{"variantId": "VARIANT_ID", "quantity": 1}'

# Test waitlist
curl -X POST http://localhost:9000/v1/waitlist \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "firstName": "Test", "source": "landing"}'
```

### 5.4 Common Issues & Solutions

**Issue:** Cart ikke oprettet korrekt
**Solution:** Tjek MedusaJS cart service integration

**Issue:** Stripe session fejler
**Solution:** Verificer Stripe API key og webhook configuration

**Issue:** Waitlist duplicate email
**Solution:** Implementer proper error handling for unique constraints

---

## 6. Phase 4: Advanced Features

### 6.1 Objectives

- Implementer subscription system
- Opret review og rating system
- Implementer referral program
- Opret admin functionality

### 6.2 Step-by-Step Implementation

#### **Step 1: Subscription Service**

Opret `src/services/subscription.js`:

```javascript
const { MedusaService } = require("@medusajs/medusa")
const Stripe = require("stripe")

class SubscriptionService extends MedusaService {
  constructor(container) {
    super(container)
    this.stripe = new Stripe(process.env.STRIPE_API_KEY)
  }

  async createSubscription(customerId, subscriptionData) {
    const { variantId, frequencyWeeks, discountPercentage = 10 } = subscriptionData
    
    // Get variant details
    const variantService = this.container.resolve("productVariantService")
    const variant = await variantService.retrieve(variantId)
    
    if (!variant) {
      throw new Error("Variant ikke fundet")
    }

    // Create Stripe subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price_data: {
          currency: "dkk",
          product_data: {
            name: variant.title
          },
          unit_amount: Math.round(variant.calculated_price.calculated_amount * (1 - discountPercentage / 100))
        }
      }],
      billing_cycle_anchor: this.calculateNextBillingDate(frequencyWeeks),
      metadata: {
        variant_id: variantId,
        frequency_weeks: frequencyWeeks,
        discount_percentage: discountPercentage
      }
    })

    // Store subscription in database
    const { data, error } = await this.supabase
      .from("subscriptions")
      .insert({
        user_id: customerId,
        stripe_subscription_id: subscription.id,
        status: "active",
        frequency_weeks: frequencyWeeks,
        next_billing_date: this.calculateNextBillingDate(frequencyWeeks),
        discount_percentage: discountPercentage
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async pauseSubscription(subscriptionId) {
    const subscription = await this.retrieve(subscriptionId)
    
    await this.stripe.subscriptions.update(subscription.stripe_subscription_id, {
      pause_collection: {
        behavior: "mark_uncollectible"
      }
    })

    return await this.update(subscriptionId, {
      status: "paused"
    })
  }

  async cancelSubscription(subscriptionId) {
    const subscription = await this.retrieve(subscriptionId)
    
    await this.stripe.subscriptions.cancel(subscription.stripe_subscription_id)

    return await this.update(subscriptionId, {
      status: "cancelled"
    })
  }

  calculateNextBillingDate(frequencyWeeks) {
    const date = new Date()
    date.setDate(date.getDate() + (frequencyWeeks * 7))
    return Math.floor(date.getTime() / 1000)
  }
}

module.exports = SubscriptionService
```

#### **Step 2: Review Service**

Opret `src/services/review.js`:

```javascript
const { MedusaService } = require("@medusajs/medusa")
const { SupabaseClient } = require("@supabase/supabase-js")

class ReviewService extends MedusaService {
  constructor(container) {
    super(container)
    this.supabase = new SupabaseClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }

  async createReview(reviewData) {
    const { orderId, productId, rating, text, photoUrl } = reviewData
    
    // Verify user has purchased this product
    const orderService = this.container.resolve("orderService")
    const order = await orderService.retrieve(orderId, {
      relations: ["items", "items.variant"]
    })

    const hasProduct = order.items.some(item => 
      item.variant.product_id === productId
    )

    if (!hasProduct) {
      throw new Error("Produkt ikke købt i denne ordre")
    }

    // Check if 4 weeks have passed
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
    
    if (new Date(order.created_at) > fourWeeksAgo) {
      throw new Error("Mindst 4 uger skal gå efter køb")
    }

    // Create review
    const { data, error } = await this.supabase
      .from("reviews")
      .insert({
        order_id: orderId,
        product_id: productId,
        rating,
        text,
        photo_url: photoUrl,
        status: "pending"
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getProductReviews(productId, filters = {}) {
    let query = this.supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (filters.rating) {
      query = query.eq("rating", filters.rating)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async moderateReview(reviewId, action, reason) {
    const { data, error } = await this.supabase
      .from("reviews")
      .update({
        status: action,
        moderation_reason: reason
      })
      .eq("id", reviewId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

module.exports = ReviewService
```

#### **Step 3: Admin Routes**

Opret `src/api/routes/admin.js`:

```javascript
const express = require("express")
const { authMiddleware } = require("../middleware/auth")
const router = express.Router()

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (!req.user.roles?.includes("admin")) {
    return res.status(403).json({
      error: {
        code: "forbidden",
        message: "Admin adgang påkrævet"
      }
    })
  }
  next()
}

// GET /v1/admin/orders
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")
    
    const orders = await orderService.list({
      status: req.query.status,
      payment_status: req.query.paymentStatus,
      limit: req.query.limit || 20,
      offset: req.query.offset || 0
    })
    
    res.json({
      items: orders,
      pageInfo: {
        nextCursor: null
      }
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente ordrer",
        details: error.message
      }
    })
  }
})

// PATCH /v1/admin/orders/:id/status
router.patch("/orders/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")
    const emailService = req.scope.resolve("emailService")
    
    const order = await orderService.update(req.params.id, {
      status: req.body.status,
      metadata: {
        tracking_url: req.body.trackingUrl
      }
    })

    // Send shipping notification email
    if (req.body.status === "shipped") {
      await emailService.send({
        template: "shipping-notification",
        to: order.email,
        data: {
          orderNumber: order.display_id,
          trackingUrl: req.body.trackingUrl
        }
      })
    }
    
    res.json(order)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke opdatere ordre",
        details: error.message
      }
    })
  }
})

// GET /v1/admin/products
router.get("/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    
    const products = await productService.list({
      status: req.query.status,
      type: req.query.type,
      limit: req.query.limit || 20
    })
    
    res.json({
      items: products,
      pageInfo: {
        nextCursor: null
      }
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke hente produkter",
        details: error.message
      }
    })
  }
})

// POST /v1/admin/products
router.post("/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    
    const product = await productService.create(req.body)
    
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke oprette produkt",
        details: error.message
      }
    })
  }
})

// PATCH /v1/admin/products/:id
router.patch("/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    
    const product = await productService.update(req.params.id, req.body)
    
    res.json(product)
  } catch (error) {
    res.status(500).json({
      error: {
        code: "internal_error",
        message: "Kunne ikke opdatere produkt",
        details: error.message
      }
    })
  }
})

module.exports = router
```

### 6.3 Testing Checkpoint

```bash
# Test subscription creation
curl -X POST http://localhost:9000/v1/subscriptions \
     -H "Authorization: Bearer YOUR_JWT" \
     -H "Content-Type: application/json" \
     -d '{"variantId": "VARIANT_ID", "frequencyWeeks": 8, "discountPercentage": 10}'

# Test review creation
curl -X POST http://localhost:9000/v1/reviews \
     -H "Authorization: Bearer YOUR_JWT" \
     -H "Content-Type: application/json" \
     -d '{"orderId": "ORDER_ID", "productId": "PRODUCT_ID", "rating": 5, "text": "Great product!"}'

# Test admin orders
curl -H "Authorization: Bearer ADMIN_JWT" \
     http://localhost:9000/v1/admin/orders
```

### 6.4 Common Issues & Solutions

**Issue:** Subscription ikke oprettet i Stripe
**Solution:** Tjek Stripe API key og customer ID format

**Issue:** Review validation fejler
**Solution:** Verificer order-product relationship og timing

**Issue:** Admin access denied
**Solution:** Tjek Clerk role configuration og JWT claims

---

## 7. Phase 5: Testing og Optimization

### 7.1 Objectives

- Implementer comprehensive testing
- Optimere performance
- Sikre security
- Setup monitoring

### 7.2 Step-by-Step Implementation

#### **Step 1: Unit Tests**

Opret `tests/services/product.test.js`:

```javascript
const { ProductService } = require("../../src/services/product")
const { SupabaseClient } = require("@supabase/supabase-js")

// Mock Supabase
jest.mock("@supabase/supabase-js")

describe("ProductService", () => {
  let productService
  let mockSupabase

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn()
    }
    
    SupabaseClient.mockImplementation(() => mockSupabase)
    
    productService = new ProductService({})
  })

  describe("listProducts", () => {
    it("should return products with correct structure", async () => {
      const mockProducts = [
        {
          id: "prod_123",
          title: "Starter Kit",
          handle: "starter-kit",
          status: "published"
        }
      ]

      mockSupabase.single.mockResolvedValue({
        data: mockProducts,
        error: null
      })

      const result = await productService.listProducts()

      expect(result).toEqual(mockProducts)
      expect(mockSupabase.from).toHaveBeenCalledWith("products")
      expect(mockSupabase.eq).toHaveBeenCalledWith("status", "published")
    })

    it("should handle database errors", async () => {
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: "Database error" }
      })

      await expect(productService.listProducts()).rejects.toThrow("Database error")
    })
  })

  describe("getProduct", () => {
    it("should return single product by handle", async () => {
      const mockProduct = {
        id: "prod_123",
        title: "Starter Kit",
        handle: "starter-kit"
      }

      mockSupabase.single.mockResolvedValue({
        data: mockProduct,
        error: null
      })

      const result = await productService.getProduct("starter-kit")

      expect(result).toEqual(mockProduct)
      expect(mockSupabase.eq).toHaveBeenCalledWith("handle", "starter-kit")
    })
  })
})
```

#### **Step 2: Integration Tests**

Opret `tests/api/products.test.js`:

```javascript
const request = require("supertest")
const app = require("../../src/api")

describe("Products API", () => {
  describe("GET /v1/products", () => {
    it("should return products list", async () => {
      const response = await request(app)
        .get("/v1/products")
        .expect(200)

      expect(response.body).toHaveProperty("items")
      expect(response.body).toHaveProperty("pageInfo")
      expect(Array.isArray(response.body.items)).toBe(true)
    })

    it("should filter by status", async () => {
      const response = await request(app)
        .get("/v1/products?status=published")
        .expect(200)

      expect(response.body.items.every(item => item.status === "published")).toBe(true)
    })
  })

  describe("GET /v1/products/handle/:handle", () => {
    it("should return product by handle", async () => {
      const response = await request(app)
        .get("/v1/products/handle/starter-kit")
        .expect(200)

      expect(response.body).toHaveProperty("id")
      expect(response.body).toHaveProperty("title")
      expect(response.body.handle).toBe("starter-kit")
    })

    it("should return 404 for non-existent product", async () => {
      const response = await request(app)
        .get("/v1/products/handle/non-existent")
        .expect(404)

      expect(response.body.error.code).toBe("not_found")
    })
  })
})
```

#### **Step 3: Performance Optimization**

Opret `src/middleware/cache.js`:

```javascript
const NodeCache = require("node-cache")

const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 120 // Check for expired keys every 2 minutes
})

const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    const key = req.originalUrl
    
    // Check cache
    const cached = cache.get(key)
    if (cached) {
      return res.json(cached)
    }

    // Store original json method
    const originalJson = res.json

    // Override json method to cache response
    res.json = function(data) {
      cache.set(key, data, ttl)
      return originalJson.call(this, data)
    }

    next()
  }
}

module.exports = { cacheMiddleware, cache }
```

#### **Step 4: Security Middleware**

Opret `src/middleware/security.js`:

```javascript
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")

// Rate limiting
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: {
        code: "rate_limited",
        message
      }
    },
    standardHeaders: true,
    legacyHeaders: false
  })
}

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
})

// Input validation
const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body)
      req.body = validated
      next()
    } catch (error) {
      res.status(422).json({
        error: {
          code: "validation_error",
          message: "Ugyldigt input",
          details: error.errors
        }
      })
    }
  }
}

module.exports = {
  createRateLimit,
  securityHeaders,
  validateInput
}
```

#### **Step 5: Monitoring Setup**

Opret `src/middleware/monitoring.js`:

```javascript
const Sentry = require("@sentry/node")

// Sentry error tracking
const sentryErrorHandler = (err, req, res, next) => {
  Sentry.captureException(err)
  next(err)
}

// Request logging
const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on("finish", () => {
    const duration = Date.now() - start
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      userAgent: req.get("User-Agent"),
      ip: req.ip
    }

    console.log(JSON.stringify(logData))
  })

  next()
}

// Health check with detailed info
const healthCheck = (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || "1.0.0"
  }

  res.json(health)
}

module.exports = {
  sentryErrorHandler,
  requestLogger,
  healthCheck
}
```

### 7.3 Testing Checkpoint

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run performance tests
npm run test:performance

# Check test coverage
npm run test:coverage
```

### 7.4 Common Issues & Solutions

**Issue:** Tests fejler på CI/CD
**Solution:** Tjek environment variables og database setup

**Issue:** Performance issues under load
**Solution:** Implementer caching og database query optimization

**Issue:** Security vulnerabilities
**Solution:** Kør security audit og opdater dependencies

---

## 8. Code Structure Guidelines

### 8.1 Folder Organization

```
src/
├── api/                    # API routes
│   ├── middleware/         # Custom middleware
│   ├── routes/            # Route handlers
│   └── index.js           # Main API app
├── services/              # Business logic
│   ├── product.js
│   ├── cart.js
│   ├── checkout.js
│   ├── user-profile.js
│   ├── waitlist.js
│   ├── subscription.js
│   └── review.js
├── models/                # Database models
│   ├── product.js
│   ├── user.js
│   └── order.js
├── types/                 # TypeScript types
│   ├── api.ts
│   ├── product.ts
│   └── user.ts
├── utils/                 # Utility functions
│   ├── validation.js
│   ├── email.js
│   └── helpers.js
├── subscribers/           # Event handlers
│   ├── order-created.js
│   └── payment-succeeded.js
└── config/               # Configuration files
    ├── database.js
    ├── stripe.js
    └── clerk.js
```

### 8.2 File Naming Conventions

- **Files:** kebab-case (`user-profile.js`)
- **Classes:** PascalCase (`UserProfileService`)
- **Functions:** camelCase (`createUserProfile`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Database tables:** snake_case (`user_profiles`)

### 8.3 Code Organization Patterns

#### **Service Pattern:**
```javascript
class ProductService extends MedusaService {
  constructor(container) {
    super(container)
    // Initialize dependencies
  }

  async methodName(params) {
    try {
      // Business logic
      return result
    } catch (error) {
      // Error handling
      throw error
    }
  }
}
```

#### **Route Pattern:**
```javascript
router.get("/endpoint", middleware, async (req, res) => {
  try {
    const service = req.scope.resolve("serviceName")
    const result = await service.methodName(req.params)
    res.json(result)
  } catch (error) {
    res.status(error.status || 500).json({
      error: {
        code: error.code || "internal_error",
        message: error.message
      }
    })
  }
})
```

#### **Error Handling Pattern:**
```javascript
// Custom error class
class ValidationError extends Error {
  constructor(message, details = []) {
    super(message)
    this.name = "ValidationError"
    this.code = "validation_error"
    this.status = 422
    this.details = details
  }
}

// Usage
throw new ValidationError("Ugyldigt input", [
  { field: "email", message: "Email er påkrævet" }
])
```

### 8.4 Best Practices

#### **Database Queries:**
- Brug parameterized queries
- Implementer proper indexing
- Brug transactions for related operations
- Valider input før database operations

#### **API Design:**
- Konsistent response format
- Proper HTTP status codes
- Input validation
- Rate limiting
- Error handling

#### **Security:**
- Valider alle inputs
- Sanitize user data
- Brug HTTPS
- Implementer proper authentication
- Rate limiting

#### **Performance:**
- Implementer caching
- Optimize database queries
- Brug pagination
- Monitor performance

---

## 9. Deployment Preparation

### 9.1 Production Configuration

#### **Environment Variables:**
```bash
# Production environment
NODE_ENV=production
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
STRIPE_API_KEY="sk_live_..."
CLERK_SECRET_KEY="sk_live_..."
SUPABASE_URL="https://your-project.supabase.co"
SENTRY_DSN="https://..."
```

#### **Docker Configuration:**
Opret `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 9000

CMD ["npm", "start"]
```

Opret `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "9000:9000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### 9.2 Security Checklist

- [ ] **Environment Variables:** Alle secrets i environment variables
- [ ] **HTTPS:** SSL/TLS konfigureret
- [ ] **CORS:** Proper CORS configuration
- [ ] **Rate Limiting:** Implementeret på alle endpoints
- [ ] **Input Validation:** Validering på alle inputs
- [ ] **Authentication:** Proper JWT validation
- [ ] **Authorization:** Role-based access control
- [ ] **Error Handling:** Ingen sensitive data i error messages
- [ ] **Logging:** Struktureret logging uden PII
- [ ] **Dependencies:** Opdaterede dependencies

### 9.3 Performance Optimization

#### **Database Optimization:**
```sql
-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_products_status_created 
ON products(status, created_at DESC);

CREATE INDEX CONCURRENTLY idx_orders_user_created 
ON orders(user_id, created_at DESC);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE status = 'published';
```

#### **Caching Strategy:**
```javascript
// Redis caching for frequently accessed data
const redis = require("redis")
const client = redis.createClient(process.env.REDIS_URL)

const cacheProduct = async (productId, productData) => {
  await client.setex(`product:${productId}`, 300, JSON.stringify(productData))
}

const getCachedProduct = async (productId) => {
  const cached = await client.get(`product:${productId}`)
  return cached ? JSON.parse(cached) : null
}
```

#### **API Optimization:**
```javascript
// Response compression
const compression = require("compression")
app.use(compression())

// Request size limiting
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))
```

### 9.4 Monitoring Setup

#### **Sentry Configuration:**
```javascript
const Sentry = require("@sentry/node")

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ]
})

// Error handling
app.use(Sentry.errorHandler())
```

#### **Health Check Endpoint:**
```javascript
app.get("/health", (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  }
  
  res.json(health)
})
```

#### **Logging Configuration:**
```javascript
const winston = require("winston")

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
})

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

---

## 10. Troubleshooting & Common Issues

### 10.1 Database Issues

#### **Connection Problems:**
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Common solutions:
# 1. Check DATABASE_URL format
# 2. Verify network connectivity
# 3. Check credentials
# 4. Verify database exists
```

#### **Migration Issues:**
```bash
# Reset migrations
npx medusa db:migrate --revert

# Check migration status
npx medusa db:migrate --status

# Common solutions:
# 1. Check migration files
# 2. Verify database permissions
# 3. Check for conflicting changes
```

### 10.2 Authentication Issues

#### **Clerk Integration:**
```javascript
// Debug JWT token
const jwt = require("jsonwebtoken")
const token = "your-jwt-token"
const decoded = jwt.decode(token, { complete: true })
console.log(decoded)

// Common solutions:
# 1. Check CLERK_SECRET_KEY
# 2. Verify token format
# 3. Check token expiration
# 4. Verify audience and issuer
```

#### **User Profile Issues:**
```sql
-- Check user profile data
SELECT * FROM user_profiles WHERE clerk_user_id = 'user_123';

-- Common solutions:
# 1. Check Supabase connection
# 2. Verify table permissions
# 3. Check data types
# 4. Verify foreign key constraints
```

### 10.3 API Issues

#### **CORS Problems:**
```javascript
// Debug CORS
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin)
  console.log("Method:", req.method)
  next()
})

// Common solutions:
# 1. Check STORE_CORS environment variable
# 2. Verify allowed origins
# 3. Check preflight requests
# 4. Verify credentials setting
```

#### **Rate Limiting:**
```javascript
// Debug rate limiting
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log("Rate limit exceeded for IP:", req.ip)
    res.status(429).json({
      error: {
        code: "rate_limited",
        message: "Too many requests"
      }
    })
  }
})
```

### 10.4 Performance Issues

#### **Slow Queries:**
```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC
LIMIT 10;

-- Common solutions:
# 1. Add missing indexes
# 2. Optimize query structure
# 3. Use EXPLAIN ANALYZE
# 4. Consider query caching
```

#### **Memory Issues:**
```javascript
// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage()
  console.log("Memory usage:", {
    rss: Math.round(usage.rss / 1024 / 1024) + " MB",
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + " MB",
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + " MB"
  })
}, 30000)

// Common solutions:
# 1. Check for memory leaks
# 2. Optimize data structures
# 3. Implement proper cleanup
# 4. Consider garbage collection
```

### 10.5 Deployment Issues

#### **Environment Variables:**
```bash
# Check environment variables
printenv | grep -E "(DATABASE|STRIPE|CLERK|SUPABASE)"

# Common solutions:
# 1. Verify all required variables are set
# 2. Check variable names (case sensitive)
# 3. Verify values are correct
# 4. Check for typos
```

#### **Service Dependencies:**
```javascript
// Health check for dependencies
const checkDependencies = async () => {
  const checks = {
    database: false,
    redis: false,
    stripe: false
  }

  try {
    // Check database
    await db.query("SELECT 1")
    checks.database = true
  } catch (error) {
    console.error("Database check failed:", error.message)
  }

  try {
    // Check Redis
    await redis.ping()
    checks.redis = true
  } catch (error) {
    console.error("Redis check failed:", error.message)
  }

  try {
    // Check Stripe
    await stripe.charges.list({ limit: 1 })
    checks.stripe = true
  } catch (error) {
    console.error("Stripe check failed:", error.message)
  }

  return checks
}
```

---

## 11. Næste Skridt

### 11.1 Immediate Actions

1. **Review og godkend guide**
2. **Setup development environment**
3. **Opret GitHub repository**
4. **Konfigurer CI/CD pipeline**
5. **Start Phase 1 implementation**

### 11.2 Week 1-2: Phase 1

- [ ] Database schema setup
- [ ] MedusaJS configuration
- [ ] Basic API structure
- [ ] Product service implementation

### 11.3 Week 3: Phase 2

- [ ] Clerk integration
- [ ] User profile management
- [ ] Authentication middleware

### 11.4 Week 4-6: Phase 3

- [ ] Cart management
- [ ] Checkout flow
- [ ] Order processing
- [ ] Waitlist functionality

### 11.5 Week 7-8: Phase 4

- [ ] Subscription system
- [ ] Review system
- [ ] Admin functionality

### 11.6 Week 9: Phase 5

- [ ] Testing implementation
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment

---

## 12. Conclusion

Denne backend udviklingsguide giver dig et komplet roadmap for at bygge Beauty Shop's e-commerce platform fra bunden. Guide'en er designet til at være:

- **Praktisk:** Step-by-step instruktioner
- **Lærerig:** Forklaringer og best practices
- **Skalerbar:** Arkitektur der kan vokse med virksomheden
- **Sikker:** Security-first approach
- **Performance-optimeret:** Hurtig og effektiv

Med denne guide kan en mid-level developer bygge et robust, skalerbart backend system der understøtter alle Beauty Shop's behov! 🚀

---

**Dokument ejer:** Nicklas Eskou  
**Sidst opdateret:** 14. oktober 2025  
**Fil lokation:** `.project/06-Backend_Guide.md`  
**Status:** Ready for Implementation
