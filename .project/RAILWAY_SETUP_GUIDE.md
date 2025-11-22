# 🚂 Railway Setup Guide - Server/Worker Architecture

## Overview
Dette dokument guider dig gennem setup af Beauty Shop på Railway med separate Server og Worker services.

## Architecture
```
┌──────────────────────────────────────────────┐
│          RAILWAY PROJECT                     │
│                                              │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │ beauty-shop     │  │ beauty-shop     │  │
│  │ -server         │  │ -worker         │  │
│  │                 │  │                 │  │
│  │ HTTP API        │  │ Background Jobs │  │
│  │ + Admin UI      │  │ + Subscribers   │  │
│  │ Port: 9000      │  │ No HTTP         │  │
│  │ Public URL ✅   │  │ Internal only   │  │
│  └────────┬────────┘  └────────┬────────┘  │
│           │                     │           │
│           └──────┬──────────────┘           │
│                  ▼                           │
│           ┌─────────────┐                   │
│           │   Redis     │                   │
│           │  (Plugin)   │                   │
│           └─────────────┘                   │
│                                              │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │ beauty-shop     │  │ beauty-shop     │  │
│  │ -strapi         │  │ -strapi-db      │  │
│  │                 │  │                 │  │
│  │ CMS Admin       │  │ PostgreSQL      │  │
│  │ + REST API      │  │ (Plugin)        │  │
│  │ Port: 1337      │  │                 │  │
│  │ Public URL ✅   │  │ Internal only   │  │
│  └─────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

- [x] Railway account (https://railway.app)
- [x] GitHub repository med Beauty Shop code
- [x] Supabase database URL (Transaction Pooler)
- [x] Redis URL (fra Railway plugin)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Railway Project

1. Gå til [railway.app](https://railway.app)
2. Klik **"New Project"**
3. Vælg **"Deploy from GitHub repo"**
4. Vælg dit `beauty-shop` repository
5. Railway vil auto-detect og deploye første service

---

### Step 2: Setup Redis Plugin

1. I Railway projektet, klik **"+ New"**
2. Vælg **"Add Plugin"** → **"Redis"**
3. Redis vil automatisk provisione
4. Kopier `REDIS_URL` fra Redis service (vi bruger den senere)

---

### Step 3: Configure Server Service

Dette er din første service (fra Step 1).

#### 3.1 Rename Service
1. Klik på service navnet
2. Omdøb til: `beauty-shop-server`

#### 3.2 Add Environment Variables
Klik på **Variables** tab og tilføj:

```env
# Database
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# Redis (from Redis plugin)
REDIS_URL=${{Redis.REDIS_URL}}

# MedusaJS Configuration
STORE_CORS=http://localhost:8000,https://beautyshop.vercel.app,https://*.vercel.app
ADMIN_CORS=https://beauty-shop-server-production.up.railway.app
AUTH_CORS=https://beauty-shop-server-production.up.railway.app,https://beautyshop.vercel.app
JWT_SECRET=<generer_random_string_32_chars>
COOKIE_SECRET=<generer_random_string_32_chars>

# Server Mode
WORKER_MODE=false
NODE_ENV=production
```

#### 3.3 Configure Settings
1. I **Settings** tab:
   - **Root Directory**: `beauty-shop`
   - **Build Command**: Auto-detected fra `railway.toml`
   - **Start Command**: Auto-detected fra `railway.toml`
   - **Health Check Path**: `/health`

#### 3.4 Generate Domain
1. I **Settings** tab → **Networking**
2. Klik **"Generate Domain"**
3. Kopier URL'en (f.eks. `beauty-shop-server-production.up.railway.app`)
4. Opdater `ADMIN_CORS` og `AUTH_CORS` med denne URL

---

### Step 4: Create Worker Service

#### 4.1 Add New Service
1. I Railway projektet, klik **"+ New"**
2. Vælg **"GitHub Repo"**
3. Vælg samme repository som server

#### 4.2 Configure Worker
1. Rename service til: `beauty-shop-worker`

2. I **Settings** tab:
   - **Root Directory**: `beauty-shop`
   - **Build Command**: `yarn build:production`
   - **Start Command**: `yarn start:production:worker`
   - **Config File**: Vælg `railway-worker.toml`

3. **VIGTIGT**: Slå **"Generate Domain"** FRA
   - Worker skal IKKE have public URL
   - Den processer kun background jobs

#### 4.3 Add Environment Variables
Samme som Server, men med `WORKER_MODE=true`:

```env
# Database (same as server)
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# Redis (CRITICAL for worker mode)
REDIS_URL=${{Redis.REDIS_URL}}

# MedusaJS Configuration (same as server)
STORE_CORS=http://localhost:8000,https://beautyshop.vercel.app
ADMIN_CORS=https://beauty-shop-server-production.up.railway.app
AUTH_CORS=https://beauty-shop-server-production.up.railway.app,https://beautyshop.vercel.app
JWT_SECRET=<same_as_server>
COOKIE_SECRET=<same_as_server>

# Worker Mode (IMPORTANT!)
WORKER_MODE=true
NODE_ENV=production
```

---

### Step 5: Setup Strapi CMS Service (Optional - CORE-27)

#### 5.1 Add Strapi Service
1. I Railway projektet, klik **"+ New"**
2. Vælg **"GitHub Repo"**
3. Vælg samme repository
4. Rename service til: `beauty-shop-strapi`

#### 5.2 Add PostgreSQL Plugin for Strapi
1. I Railway projektet, klik **"+ New"**
2. Vælg **"Add Plugin"** → **"PostgreSQL"**
3. Rename plugin til: `beauty-shop-strapi-db`
4. PostgreSQL vil automatisk provisione
5. Kopier connection string fra plugin (vi bruger den senere)

#### 5.3 Configure Strapi Service
1. I **Settings** tab:
   - **Root Directory**: `beauty-shop-cms`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/admin` (optional)

2. **Generate Domain**:
   - I **Settings** tab → **Networking**
   - Klik **"Generate Domain"**
   - Kopier URL'en (f.eks. `beauty-shop-strapi-production.up.railway.app`)

#### 5.4 Add Environment Variables for Strapi
Klik på **Variables** tab og tilføj:

```env
# Server
HOST=0.0.0.0
PORT=1337
PUBLIC_STRAPI_URL=${{beauty-shop-strapi.PUBLIC_DOMAIN}}
NODE_ENV=production

# Database (from PostgreSQL plugin)
DATABASE_CLIENT=postgres
DATABASE_URL=${{beauty-shop-strapi-db.DATABASE_URL}}
DATABASE_HOST=${{beauty-shop-strapi-db.PGHOST}}
DATABASE_PORT=${{beauty-shop-strapi-db.PGPORT}}
DATABASE_NAME=${{beauty-shop-strapi-db.PGDATABASE}}
DATABASE_USERNAME=${{beauty-shop-strapi-db.PGUSER}}
DATABASE_PASSWORD=${{beauty-shop-strapi-db.PGPASSWORD}}
DATABASE_SSL=true

# Security (generate strong random values)
APP_KEYS=<generate_4_random_base64_strings_separated_by_commas>
ADMIN_JWT_SECRET=<generate_random_base64_string>
API_TOKEN_SALT=<generate_random_base64_string>
TRANSFER_TOKEN_SALT=<generate_random_base64_string>
ENCRYPTION_KEY=<generate_random_base64_string>

# CORS (allow storefront to access)
CORS_ORIGIN=https://beautyshop.vercel.app,https://*.vercel.app
```

**Note:** Generate secrets using:
```bash
# Generate random base64 strings
openssl rand -base64 32  # For each secret
```

#### 5.5 First-Time Admin Setup
1. Deploy Strapi service
2. Visit `https://beauty-shop-strapi-production.up.railway.app/admin`
3. Create admin user via Strapi's first-time setup UI
4. Configure content types (see Phase 2 of CORE-27 plan)

---

### Step 6: Deploy All Services

1. **Deploy Server**:
   - Commit og push ændringer til GitHub
   - Railway auto-deployer server

2. **Deploy Worker**:
   - Samme commit trigger også worker deployment

3. **Deploy Strapi** (if configured):
   - Ensure `beauty-shop-cms/` directory exists in repo
   - Railway auto-deploys Strapi service
   - First-time admin setup required via `/admin` URL

4. **Verify Deployments**:
   - Check logs for alle services
   - Server skal vise: `🌐 SERVER mode`
   - Worker skal vise: `👷 WORKER mode`
   - Strapi skal vise: `Server started on port 1337`

---

## ✅ Verification Checklist

### Server Service:
- [ ] Public URL genereret og virker
- [ ] `/health` endpoint svarer
- [ ] Admin UI tilgængelig på `/app`
- [ ] Logs viser "🌐 SERVER mode"
- [ ] CORS konfigureret korrekt

### Worker Service:
- [ ] INGEN public URL
- [ ] Logs viser "👷 WORKER mode"
- [ ] Redis connection successfuld
- [ ] Subscriber events processer

### Test Worker Functionality:
```bash
# 1. Åbn Server logs i Railway
# 2. Create et product via Admin UI
# 3. Check Worker logs - du skal se:
#    📦 [WORKER] Product created event received
#    Product title: <product-name>
#    ✅ Event processed successfully in WORKER mode
```

---

## 🔧 Configuration Files Reference

### `railway.toml` (Server)
```toml
# Railway Configuration for MedusaJS Server
[build]
builder = "NIXPACKS"
buildCommand = "yarn build:production"

[deploy]
startCommand = "yarn start:production"
healthcheckPath = "/health"
healthcheckTimeout = 300

[deploy.environmentVariables]
WORKER_MODE = "false"
NODE_ENV = "production"
```

> **Note:** Railway does NOT support `restartPolicyType` in config files. Use Railway's built-in restart policies instead.

### `railway-worker.toml` (Worker)
```toml
# Railway Configuration for MedusaJS Worker
[build]
builder = "NIXPACKS"
buildCommand = "yarn build:production"

[deploy]
startCommand = "yarn start:production:worker"

[deploy.environmentVariables]
WORKER_MODE = "true"
NODE_ENV = "production"
```

> **Note:** Workers don't need healthcheck paths since they don't run HTTP servers.

---

## 📊 Monitoring

### Server Logs (Expected):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Beauty Shop MedusaJS starting...
   Mode:        🌐 SERVER
   Environment: production
   Node:        v20.x.x
   Redis:       ✅ Connected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server mode: Handling HTTP requests (API + Admin)
```

### Worker Logs (Expected):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Beauty Shop MedusaJS starting...
   Mode:        👷 WORKER
   Environment: production
   Node:        v20.x.x
   Redis:       ✅ Connected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Worker mode: Processing background jobs and subscribers
```

---

## 🚨 Troubleshooting

### ⚠️ "Local Event Bus installed" Warning (SAFE TO IGNORE)
**Problem:** Logs viser `Local Event Bus installed. This is not recommended for production.`

**Solution:** Dette er **forventet adfærd** og kan ignoreres! 

**Hvorfor?**
1. MedusaJS initialiserer Local Event Bus som fallback først
2. Logger advarslen (misvisende, men harmløs)
3. Etablerer derefter forbindelse til Redis Event Bus
4. Redis Event Bus overtager for faktisk event håndtering

**Verifikation:**
Kig efter denne linje efter advarslen:
```
✅ Connection to Redis in module 'event-bus-redis' established
```
Hvis du ser denne, bruger systemet Redis Event Bus korrekt! 🎉

---

### Worker not processing events?
- ✅ Check `REDIS_URL` er sat på både Server og Worker
- ✅ Verify `WORKER_MODE=true` på Worker service
- ✅ Check Worker logs for errors
- ✅ Verify Redis plugin er running

### Server can't connect to Redis?
- ✅ Check Redis plugin status
- ✅ Verify `REDIS_URL` variable reference: `${{Redis.REDIS_URL}}`
- ✅ Restart Server service

### Build fails?
- ✅ Check `Root Directory` er sat til `beauty-shop`
- ✅ Verify `railway.toml` eller `railway-worker.toml` exists
- ✅ Check build logs for specific errors

---

## 💰 Cost Estimation (Hobby Plan)

```
Service               Resources    Usage
──────────────────────────────────────────
beauty-shop-server    2-3 GB RAM   ~40%
beauty-shop-worker    1-2 GB RAM   ~20%
Redis (plugin)        ~512 MB      ~10%
──────────────────────────────────────────
TOTAL                 ~6 GB        ~70% of 8GB limit

Estimated cost: $5/month + usage overages if any
```

---

## 🎯 Next Steps

After Railway setup:
1. [ ] Configure Vercel storefront to point to Railway URL
2. [ ] Test end-to-end workflow
3. [ ] Setup monitoring/alerts (Sentry)
4. [ ] Configure GitHub Actions for CI/CD
5. [ ] Setup staging environment (optional)

---

## 📚 Resources

- [Railway Documentation](https://docs.railway.app)
- [MedusaJS Worker Mode](https://docs.medusajs.com)
- [Redis Event Bus](https://docs.medusajs.com/resources/architectural-modules/event)
- Beauty Shop Architecture: `.project/08-Architecture.md`

---

**Last Updated:** {{ date }}
**Maintained by:** Nicklas Eskou

