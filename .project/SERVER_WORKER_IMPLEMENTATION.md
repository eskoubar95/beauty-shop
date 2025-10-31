# ✅ Server/Worker Implementation Checklist

## Implementation Status: Ready for Deployment

### 📦 Code Changes Completed

- [x] **package.json** - Added worker scripts
  - `npm run dev:worker` - Development worker mode
  - `npm run start:worker` - Production worker mode
  - `npm run start:production:worker` - Railway worker start command

- [x] **railway.toml** - Updated server configuration
  - Added comments for clarity
  - Added `WORKER_MODE=false` environment variable
  - Added restart policy

- [x] **railway-worker.toml** (NEW) - Created worker configuration
  - Separate config for worker service
  - No health check (no HTTP server)
  - Added `WORKER_MODE=true` environment variable
  - Optimized restart policy for workers

- [x] **instrumentation.ts** - Added startup logging
  - Detects worker vs server mode
  - Logs Redis connection status
  - Shows mode, environment, and Node version
  - Clear visual distinction between modes

- [x] **Test Subscriber** - Created demo subscriber
  - `src/subscribers/product-created-logger.ts`
  - Logs which mode processed the event
  - Demonstrates worker functionality
  - Ready for production testing

### 📚 Documentation Completed

- [x] **RAILWAY_SETUP_GUIDE.md** - Complete deployment guide
  - Step-by-step Railway setup
  - Environment variable configuration
  - Service configuration
  - Troubleshooting section
  - Cost estimation

- [x] **08-Architecture.md** - Updated architecture docs
  - Added Server/Worker architecture diagram
  - Documented deployment structure
  - Added decision rationale (section 7.3)
  - Benefits and requirements listed

- [x] **This file** - Implementation tracking

---

## 🚀 Next Steps: Railway Deployment

### Step 1: Commit & Push Changes
```bash
cd /Users/nicklaseskou/Documents/GitHub/beauty-shop

git add .
git commit -m "feat: implement Server/Worker separation for MedusaJS

- Add worker mode scripts to package.json
- Create railway-worker.toml configuration
- Update railway.toml with server-specific settings
- Add instrumentation logging for mode detection
- Create product-created-logger test subscriber
- Update architecture documentation
- Add Railway deployment guide

Related: Best practices for production MedusaJS deployment"

git push origin main
```

### Step 2: Setup Railway Project

Follow the guide: `.project/RAILWAY_SETUP_GUIDE.md`

**Quick Setup:**
1. Create Railway project from GitHub repo
2. Add Redis plugin
3. Configure Server service (existing)
   - Name: `beauty-shop-server`
   - Config: `railway.toml`
   - Generate public domain
   - Add environment variables
   
4. Create Worker service (new)
   - Name: `beauty-shop-worker`
   - Config: `railway-worker.toml`
   - No public domain
   - Same environment variables as server
   - Set `WORKER_MODE=true`

5. Deploy both services

### Step 3: Verify Deployment

**Check Server Logs:**
```
Expected output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Beauty Shop MedusaJS starting...
   Mode:        🌐 SERVER
   Environment: production
   Node:        v20.x.x
   Redis:       ✅ Connected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server mode: Handling HTTP requests (API + Admin)
```

**Check Worker Logs:**
```
Expected output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Beauty Shop MedusaJS starting...
   Mode:        👷 WORKER
   Environment: production
   Node:        v20.x.x
   Redis:       ✅ Connected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Worker mode: Processing background jobs and subscribers
```

### Step 4: Test Worker Functionality

1. Open Railway dashboard
2. Access Server Admin UI: `https://beauty-shop-server-production.up.railway.app/app`
3. Create a new product
4. Check Worker logs for:
```
📦 [WORKER] Product created event received
   Product ID: prod_xxxxx
   Timestamp: 2025-01-31T...
   Product title: <product-name>
   ✅ Event processed successfully in WORKER mode
```

---

## 🧪 Local Testing

### Test Server Mode (Terminal 1)
```bash
cd beauty-shop
npm run dev

# Should see:
# 🌐 SERVER mode: Handling HTTP requests (API + Admin)
```

### Test Worker Mode (Terminal 2)
```bash
cd beauty-shop
npm run dev:worker

# Should see:
# 👷 WORKER mode: Processing background jobs and subscribers
```

### Test Event Flow
```bash
# Terminal 1: Server running
# Terminal 2: Worker running
# Terminal 3: Create product via API or Admin

# Worker logs should show event processing
```

---

## 📊 Expected Resource Usage (Railway Hobby Plan)

```
Service                RAM Usage    CPU Usage    Cost
────────────────────────────────────────────────────
beauty-shop-server     2-3 GB       ~40%         Included
beauty-shop-worker     1-2 GB       ~20%         Included
Redis (plugin)         ~512 MB      ~10%         Included
────────────────────────────────────────────────────
TOTAL                  ~6 GB        ~70%         $5/month
```

**You're well within Hobby Plan limits (8GB RAM / 8 vCPU)** ✅

---

## 🔧 Environment Variables Required

Both Server and Worker need these variables in Railway:

```env
# Database
DATABASE_URL=postgresql://...
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# Redis (CRITICAL for worker mode)
REDIS_URL=${{Redis.REDIS_URL}}

# MedusaJS
STORE_CORS=https://beautyshop.vercel.app,https://*.vercel.app
ADMIN_CORS=https://beauty-shop-server-production.up.railway.app
AUTH_CORS=https://beauty-shop-server-production.up.railway.app,https://beautyshop.vercel.app
JWT_SECRET=<generate-random-32-chars>
COOKIE_SECRET=<generate-random-32-chars>

# Mode (different for each service)
WORKER_MODE=false  # Server
WORKER_MODE=true   # Worker
NODE_ENV=production
```

---

## 🎯 Success Criteria

- [ ] Server service deployed and healthy
- [ ] Worker service deployed and running
- [ ] Redis plugin active
- [ ] Server shows "🌐 SERVER" in logs
- [ ] Worker shows "👷 WORKER" in logs
- [ ] Admin UI accessible
- [ ] Test subscriber processes events in worker
- [ ] No errors in either service logs

---

## 🚨 Troubleshooting

### Worker not processing events?
→ Check `REDIS_URL` is set on both services
→ Verify `WORKER_MODE=true` on worker service
→ Restart both services to ensure Redis connection

### "Redis not configured" in logs?
→ Add Redis plugin in Railway
→ Reference it as `${{Redis.REDIS_URL}}` in env vars
→ Redeploy services

### Build fails?
→ Check Railway service has correct Root Directory: `beauty-shop`
→ Verify config file selected correctly
→ Check build logs for specific error

---

## 📚 Reference Documentation

- **Railway Setup:** `.project/RAILWAY_SETUP_GUIDE.md`
- **Architecture:** `.project/08-Architecture.md` (Section 6.1 & 7.3)
- **MedusaJS Docs:** https://docs.medusajs.com
- **Railway Docs:** https://docs.railway.app

---

**Last Updated:** January 31, 2025
**Status:** ✅ Ready for deployment
**Next Action:** Commit changes and follow Railway setup guide

