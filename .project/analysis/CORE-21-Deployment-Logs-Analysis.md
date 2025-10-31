# CORE-21: Deployment Logs Analyse

**Issue:** CORE-21 - Deploy MedusaJS Backend to Railway  
**Analysedato:** 2025-01-30  
**Logs fra:** Railway deployment failure (13 timer siden)

---

## 📋 Executive Summary

**Hovedproblem:** Deployment fejler på grund af **manglende build step**, IKKE på grund af manglende Server/Worker split.

**Kritiske fejl:**
1. ❌ `medusa build` kører ikke før `medusa start`
2. ❌ Redis konfiguration mangler/virker ikke
3. ⚠️ Server/Worker split anbefales, men er IKKE årsag til failure

---

## 🔍 Detaljeret Analyse af Logs

### 1. Build Fejl (KRITISK ❌)

**Fejlbesked:**
```
Could not find index.html in the admin build directory. 
Make sure to run 'medusa build' before starting the server.
```

**Stakkortrace:**
```
/app/node_modules/@medusajs/admin-bundler/dist/index.js:1582
/app/node_modules/@medusajs/medusa/src/loaders/admin.ts:90
```

**Årsag:**
- Railway kører direkte `medusa start` (eller `npm run start`)
- `medusa build` bliver IKKE kørt før start
- Admin panel kræver build artifacts (index.html, JS bundles, etc.)
- Uden build artifacts kan serveren ikke serve admin panel

**Løsning:**
```toml
# railway.toml
[build]
builder = "NIXPACKS"
buildCommand = "npm ci && npm run build"  # EKSPLICIT build command

[deploy]
startCommand = "npm run start"
```

**Verification:**
Efter build skal `.medusa/admin/build/index.html` eksistere.

---

### 2. Redis Konfiguration (KRITISK ❌)

**Warnings fra logs:**
```
Local Event Bus installed. This is not recommended for production.
Locking module: Using "in-memory" as default.
```

**Betydning:**
- MedusaJS kan ikke finde/forbinde til Redis
- Falder automatisk tilbage til:
  - Local Event Bus (in-memory, ikke production-ready)
  - In-memory locking (ikke skalérbart)

**Mulige årsager:**
1. `REDIS_URL` environment variable ikke sat i Railway
2. Redis service ikke i samme Railway project
3. Redis URL format forkert
4. Redis service ikke kører/tilgængelig

**Løsning:**
1. **Verificer Redis Service:**
   - Tjek Railway dashboard - er Redis service deployed?
   - Tjek at Redis service er i samme project

2. **Verificer Environment Variable:**
   ```bash
   # I Railway dashboard -> Variables tab
   REDIS_URL=redis://default:password@hostname:6379
   
   # Eller brug Railway template syntax:
   REDIS_URL="${{ Redis.REDIS_PUBLIC_URL }}"
   ```

3. **Test Redis Connection:**
   Efter deploy skal logs IKKE vise:
   - `Local Event Bus installed`
   - `Locking module: Using "in-memory"`

---

### 3. Server/Worker Split (IKKE KRITISK ⚠️)

**Spørgsmål:** Er manglende Server/Worker split årsag til fejlen?

**Svar:** **NEJ** - Fejlen opstår pga. build og Redis, IKKE pga. single service.

**Bevis:**
- Logs viser ingen fejl relateret til worker
- Fejlen opstår før serveren starter (manglende build)
- MedusaJS 2.0 kan køre både server og worker i samme proces (development mode)

**Men:** Separation anbefales for production:
- Bedre resource management
- Isolerede fejl (hvis worker crasher, påvirker det ikke API)
- Skalerbarhed (kan scale worker separat)

---

## 🎯 Action Plan (Prioriteret)

### Step 1: Fix Build Fejl (Must Fix)

```toml
# beauty-shop/railway.toml
[build]
builder = "NIXPACKS"
buildCommand = "npm ci && npm run build"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/health"
healthcheckTimeout = 300
```

**Test:**
- Deploy igen
- Check logs for `medusa build` output
- Verify `.medusa/admin/build/index.html` exists
- Server skal starte uden "Could not find index.html" fejl

---

### Step 2: Fix Redis Configuration

**Verificer i Railway Dashboard:**

1. **Redis Service:**
   - Gå til Railway project
   - Tjek at Redis service er deployed og kører
   - Kopier `REDIS_PUBLIC_URL` eller `REDIS_URL`

2. **Environment Variables:**
   - Gå til "beauty-shop" service
   - Variables tab
   - Tilføj/opdater:
     ```bash
     REDIS_URL="${{ Redis.REDIS_PUBLIC_URL }}"
     ```
   - Eller hvis manual:
     ```bash
     REDIS_URL=redis://default:password@hostname:6379
     ```

3. **Verify Connection:**
   - Redeploy service
   - Check logs - skal IKKE vise:
     - `Local Event Bus installed`
     - `Locking module: Using "in-memory"`

---

### Step 3: Verify Deployment

**Efter Step 1 & 2:**

1. **Health Check:**
   ```bash
   curl https://[railway-url]/health
   # Expected: 200 OK
   ```

2. **Admin Panel:**
   ```bash
   curl https://[railway-url]/app
   # Expected: 200 OK med HTML content
   ```

3. **API Endpoints:**
   ```bash
   curl https://[railway-url]/health
   curl https://[railway-url]/store/products
   # Expected: 200 OK med JSON responses
   ```

---

### Step 4: Implement Server/Worker Split (Optional, Post-MVP)

**Når Step 1-3 virker:**

1. Opret ny Railway service: `beauty-shop-worker`
2. Same GitHub repo, different start command
3. Environment variables:
   - Worker service: `MEDUSA_WORKER_MODE=worker` (hvis supported)
   - Server service: `MEDUSA_WORKER_MODE=server` (hvis supported)
   
**Note:** Tjek MedusaJS 2.0 docs for korrekte environment variables til worker mode.

---

## 📊 Fejlprioritering

| Prioritet | Problem | Impact | Effort | Status |
|-----------|---------|--------|--------|--------|
| 🔴 P0 | Build command mangler | Total failure | 5 min | ❌ IKRÆV |
| 🔴 P0 | Redis URL mangler | Production ikke ready | 10 min | ❌ IKRÆV |
| 🟡 P1 | Server/Worker split | Best practice | 30 min | ⚠️ Anbefalet |

---

## 💡 Vigtige Noter

1. **Build er påkrævet:** MedusaJS admin panel kræver build artifacts - kan ikke serveres uden.

2. **Redis er påkrævet for production:**
   - Event bus skal være Redis (ikke local)
   - Locking skal være Redis (ikke in-memory)
   - Session management skal være Redis (ikke in-memory)

3. **Single service kan virke:** Men ikke best practice for production scale.

---

## ✅ Definition of Done

- [ ] Build command kører korrekt (`medusa build` output i logs)
- [ ] Admin panel accessible (`/app` returnerer HTML)
- [ ] Redis connection virker (ingen "Local Event Bus" warnings)
- [ ] Health check responderer (200 OK)
- [ ] API endpoints virker (test `/health`, `/store/products`)

---

**Næste Handling:** Fix `railway.toml` med build command og verificer Redis URL først!

