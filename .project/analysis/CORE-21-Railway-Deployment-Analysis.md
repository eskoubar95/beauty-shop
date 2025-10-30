# CORE-21: Railway Deployment Analysis

**Issue:** CORE-21 - Deploy MedusaJS Backend to Railway (Phase 4)  
**Status:** In Progress  
**Dato:** 2025-01-30

---

## 📋 Summary

Efter research og gennemgang af nuværende setup viser det sig, at vores deployment til Railway mangler **separate Server og Worker services**, som er best practice for MedusaJS 2.0. Nuværende deployment fejler sandsynligvis pga. manglende worker service eller forkert konfiguration.

---

## 1. 🔍 Research: Korrekt Tilgang til MedusaJS 2.0 på Railway med Supabase

### 1.1 Reference Artikler

**Medium Artikel (Pether Maciejewski):**
- **URL:** https://medium.com/@pether.maciejewski/medusa-2-0-e-commerce-admin-server-and-worker-easy-custom-setup-on-railway-stripe-resend-and-7b7079627879
- **Nøgle Punkter:**
  - MedusaJS 2.0 kræver **separate services** for Server og Worker
  - Server service kører API endpoints og admin panel
  - Worker service kører background jobs (notifications, emails, webhooks, etc.)
  - Både Server og Worker skal have adgang til samme database og Redis
  - Deployment via GitHub integration med separate Railway services

**306technologies Artikel:**
- **URL:** https://www.306technologies.com/blog/deploy-medusa-js-to-railway
- **Nøgle Punkter:**
  - Standard Railway deployment setup
  - Environment variables konfiguration
  - Database migrations før første deploy
  - Health check endpoints

### 1.2 Best Practice Arkitektur

MedusaJS 2.0 på Railway kræver **minimum 2 services**:

```
┌─────────────────┐         ┌─────────────────┐
│  [SERVER]       │         │  [WORKER]        │
│  medusa-server  │         │  medusa-worker   │
│  Port: 9000     │         │  (background)    │
│                 │         │                  │
│  - API          │         │  - Jobs          │
│  - Admin        │         │  - Webhooks      │
│  - Auth         │         │  - Emails        │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     │
         ┌──────────────▼──────────────┐
         │       Redis (Cache)       │
         └──────────────┬──────────────┘
                     │
         ┌──────────────▼──────────────┐
         │   PostgreSQL (Supabase)     │
         └─────────────────────────────┘
```

### 1.3 Supabase Integration

**Kritisk:** Supabase er PostgreSQL-baseret og fungerer perfekt med MedusaJS, MEN kræver:

1. **Transaction Pooler Connection:**
   ```env
   DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}
   ```

2. **Ingen direkte Session Pooler** - MedusaJS bruger mange korte connections, derfor Transaction Pooler (port 6543) er optimalt

3. **SSL/TLS påkrævet** - Supabase kræver SSL, derfor `DATABASE_EXTRA` med SSL config

---

## 2. ✅ Gennemgang: Nuværende Opsætning vs. Best Practice

### 2.1 Nuværende Railway Konfiguration

**Fil:** `beauty-shop/railway.toml`

```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
```

**Status:** ✅ Korrekt, men mangler build/start commands

**Forbedringer nødvendige:**
- Tilføj `buildCommand` eksplicit
- Tilføj `startCommand` eksplicit
- Overvej `restartPolicyType = "on-failure"`

### 2.2 Package.json Scripts

**Fil:** `beauty-shop/package.json`

```json
{
  "scripts": {
    "build": "medusa build",
    "start": "medusa start"
  }
}
```

**Status:** ✅ Korrekt

**Note:** `medusa start` kører både server og worker i samme proces (development mode). For production skal vi have separate commands.

### 2.3 MedusaJS Config

**Fil:** `beauty-shop/medusa-config.ts`

```typescript
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: process.env.DATABASE_EXTRA ? JSON.parse(process.env.DATABASE_EXTRA) : undefined,
    redisUrl: process.env.REDIS_URL,
    // ... CORS config
  }
})
```

**Status:** ✅ Korrekt konfiguration for Supabase

### 2.4 Manglende: Separate Services

**Problemet:** Vi har kun **1 service** i Railway ("beauty-shop"), men MedusaJS 2.0 kræver **2 services**:

1. **Server Service** - Kører API og admin
2. **Worker Service** - Kører background jobs

**Sammenligning med vellykket setup:**
- ✅ Andres setup viser: `[SERVER] medusa2.0-...` + `[WORKER] medusa2.0-...`
- ❌ Vores setup viser: Kun `beauty-shop` (single service)

---

## 3. 🔍 Analyse: Deployment Udfordringer (OPDATERET MED LOGS)

### 3.1 Identificerede Problemer (Baseret på Deployment Logs)

#### Problem 1: Build Command Kører Ikke (KRITISK ❌)

**Fejlbesked fra logs:**
```
Could not find index.html in the admin build directory. 
Make sure to run 'medusa build' before starting the server.
```

**Årsag:** Railway kører `medusa start` uden først at have kørt `medusa build`. Admin panel kræver build output i `.medusa/admin/build/` eller lignende.

**Løsning:** Opdater `railway.toml` med eksplicit build command:
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm ci && npm run build"

[deploy]
startCommand = "npm run start"
```

**Status:** Dette er den primære årsag til failure!

#### Problem 2: Redis Konfiguration Mangler/Fejler (KRITISK ❌)

**Warnings fra logs:**
```
Local Event Bus installed. This is not recommended for production.
Locking module: Using "in-memory" as default.
```

**Årsag:** `REDIS_URL` er enten:
- Ikke sat i Railway environment variables
- Ikke korrekt formateret
- Redis service ikke tilgængelig/synlig for denne service

**Løsning:** 
1. Verificer `REDIS_URL` er sat i Railway dashboard
2. Verificer Redis service er i samme project
3. Brug Railway template syntax: `REDIS_URL="${{ Redis.REDIS_PUBLIC_URL }}"`

**Status:** Dette forhindrer production-ready deployment

#### Problem 3: Manglende Worker Service (IKKE KRITISK ⚠️)

**Symptom:** Logs viser ingen eksplicit fejl relateret til worker, men best practice anbefaler separation.

**Årsag:** MedusaJS 2.0 kan køre både server og worker i samme proces (som nu), men:
- Bedre resource management med separation
- Isolerede fejl
- Skalerbarhed

**Løsning:** Opret 2 separate Railway services:
- Service 1: Server (port 9000, API + Admin)
- Service 2: Worker (background jobs)

**Status:** Dette er IKKE årsag til nuværende failure, men anbefales for production

**Nuværende:** `medusa start` kører både server og worker

**Problem:** Railway deployer én service, som prøver at køre begge, hvilket kan forårsage:
- Port conflicts
- Resource exhaustion
- Health check failures

**Løsning:** Brug separerede start commands:
- Server: `medusa start --workers=false` (kun server)
- Worker: `medusa start --server=false` (kun worker)

#### Problem 5: Environment Variables

**Manglende vars kan forårsage fejl:**
- `REDIS_URL` - Hvis manglende bruger MedusaJS "fake redis" (ikke production-ready)
- `DATABASE_EXTRA` - SSL config for Supabase
- `JWT_SECRET` / `COOKIE_SECRET` - Sikkerhedssecrets

**Verification:** Tjek Railway dashboard at alle vars er sat korrekt

---

## 4. 📊 Sammenligning: Vores Setup vs. Best Practice

| Aspekt | Vores Setup | Best Practice | Status |
|--------|------------|---------------|--------|
| **Services** | 1 service (beauty-shop) | 2 services (Server + Worker) | ❌ Mangler Worker |
| **Database** | Supabase PostgreSQL | PostgreSQL (any) | ✅ Korrekt |
| **Redis** | Railway Redis addon | Redis addon | ✅ Korrekt |
| **Build Command** | Implicit (Railway auto-detect) | Eksplicit i `railway.toml` | ⚠️ Kan forbedres |
| **Start Command** | `medusa start` (both) | Separate commands | ❌ Forkert for production |
| **Health Check** | `/health` endpoint | `/health` endpoint | ✅ Korrekt |
| **Environment Vars** | Må verificeres | Alle nødvendige vars | ⚠️ Må tjekkes |

---

## 5. 🎯 Anbefalede Løsninger

### 5.1 Opret Separate Services

**Trin 1: Server Service**
1. Opret ny service i Railway: `beauty-shop-server`
2. Connect til samme GitHub repo
3. Set environment: `MEDUSA_WORKER=false` eller brug separat start command
4. Port: Railway auto-assigner (default 9000)

**Trin 2: Worker Service**
1. Opret ny service: `beauty-shop-worker`
2. Connect til samme GitHub repo
3. Set environment: `MEDUSA_SERVER=false` eller brug separat start command
4. Port: Not needed (worker har ingen HTTP port)

### 5.2 Opdater railway.toml

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm ci && npm run build"

[deploy]
startCommand = "npm run start"  # Will be overridden per service
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on-failure"
```

**Note:** Railway tillader service-specific start commands via environment variables eller dashboard.

### 5.3 Opdater package.json Scripts

Tilføj separate scripts for server og worker:

```json
{
  "scripts": {
    "build": "medusa build",
    "start": "medusa start",
    "start:server": "medusa start --workers=false",
    "start:worker": "medusa start --server=false"
  }
}
```

**Alternativ:** Brug environment variables i `medusa-config.ts` til at styre hvad der kører.

### 5.4 Verificer Environment Variables

Alle nødvendige vars i Railway dashboard for begge services:

```bash
# Database (Supabase)
DATABASE_URL=postgresql://...@pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# Redis
REDIS_URL=redis://default:...@...railway.app:6379

# Secrets
JWT_SECRET=[secure-random-32-chars]
COOKIE_SECRET=[secure-random-32-chars]

# CORS
STORE_CORS=https://beauty-shop.vercel.app
ADMIN_CORS=https://[railway-server-url],http://localhost:7001
AUTH_CORS=https://[railway-server-url],http://localhost:7001

# MedusaJS
MEDUSA_ADMIN_ONBOARDING_TYPE=skip
```

---

## 6. 🚀 Næste Skridt (Action Items - OPDATERET)

### Prioritet 1: Fix Kritisk Build Fejl (SKAL FIXES FØRST!)

- [x] ✅ Identificeret: `medusa build` kører ikke før `medusa start`
- [ ] Opdater `railway.toml` med eksplicit `buildCommand`
- [ ] Test deployment - skal nu bygge korrekt
- [ ] Verificer `index.html` findes i admin build directory efter build

### Prioritet 2: Fix Redis Konfiguration

- [x] ✅ Identificeret: Redis URL mangler eller virker ikke (local event bus i stedet)
- [ ] Verificer `REDIS_URL` er sat i Railway dashboard
- [ ] Verificer Redis service er i samme project
- [ ] Test at Redis connection virker (logs skal ikke vise "Local Event Bus")
- [ ] Verificer `Locking module` bruger Redis, ikke "in-memory"

### Prioritet 3: Implementer Best Practice (Server/Worker Split)

- [ ] Opret separate Server service i Railway
- [ ] Opret separate Worker service i Railway
- [ ] Opdater `railway.toml` med eksplicitte build/start commands
- [ ] Tilføj separate start scripts i `package.json`
- [ ] Test deployment for begge services

### Prioritet 3: Dokumentation

- [ ] Opdater `.project/deployment-backend.md` med dual-service arkitektur
- [ ] Dokumenter environment variables setup
- [ ] Tilføj troubleshooting guide

---

## 7. 📚 Reference Links

1. **Medium Artikel (Pether):**
   https://medium.com/@pether.maciejewski/medusa-2-0-e-commerce-admin-server-and-worker-easy-custom-setup-on-railway-stripe-resend-and-7b7079627879

2. **306technologies Guide:**
   https://www.306technologies.com/blog/deploy-medusa-js-to-railway

3. **MedusaJS Official Docs:**
   https://docs.medusajs.com/deployment/railway

4. **Railway Node.js Guide:**
   https://docs.railway.app/guides/nodejs

---

## 8. ⚠️ Vigtige Noter

1. **Supabase er kompatibel** - PostgreSQL-based, så ingen issues her
2. **Redis er påkrævet** - MedusaJS falder tilbage til "fake redis" hvis REDIS_URL mangler (ikke production-ready)
3. **Separate services er best practice** - Men ikke strengt nødvendigt for mindre setups (kan køre single service hvis resources tillader)
4. **Health check** - `/health` endpoint skal eksistere og returnere 200 OK

---

**Næste Handling:** Verificer Railway logs for specifik fejlbesked, og implementer derefter separate Server/Worker services som anbefalet.

