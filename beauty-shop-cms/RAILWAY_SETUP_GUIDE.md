# Railway Setup Guide - Step by Step

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository connected to Railway
- Access to Railway project dashboard

## Step 1: Create PostgreSQL Database Service

### Option A: Create New PostgreSQL Database (Recommended for Strapi)

1. **Go to Railway Dashboard**
   - Navigate to your Railway project
   - Click **"New"** button (top right)
   - Select **"Database"** → **"PostgreSQL"**

2. **Configure Database**
   - Railway will automatically create a PostgreSQL service
   - Railway will auto-generate a secure password
   - Note the service name (e.g., `PostgreSQL`)

3. **Get Connection Details**
   - Click on the PostgreSQL service
   - Go to **"Variables"** tab
   - Railway automatically provides these variables:
     - `DATABASE_URL` (full connection string)
     - `POSTGRES_HOST`
     - `POSTGRES_PORT`
     - `POSTGRES_DATABASE`
     - `POSTGRES_USER`
     - `POSTGRES_PASSWORD`

### Option B: Use Existing PostgreSQL Database

If you already have a PostgreSQL database in Railway:
- Use the existing service
- Note the service name for reference

---

## Step 2: Create Strapi CMS Service

1. **Create New Service from GitHub**
   - In Railway project, click **"New"** → **"GitHub Repo"**
   - Select your `beauty-shop` repository
   - Railway will detect the repository

2. **Configure Root Directory**
   - After selecting repository, Railway will show configuration
   - Set **Root Directory** to: `beauty-shop-cms`
   - This tells Railway to build from the `beauty-shop-cms` folder

3. **Railway Auto-Detection**
   - Railway will detect `railway.toml` in `beauty-shop-cms/`
   - It will use the build configuration from `railway.toml`
   - Build command: `npm ci && npm run build`
   - Start command: `npm run start`

4. **Name the Service**
   - Railway will suggest a name (e.g., `beauty-shop-cms`)
   - You can rename it to `strapi-cms` or keep default
   - Click **"Deploy"** to start the build

---

## Step 3: Connect Database to Strapi Service

1. **Open Strapi Service Settings**
   - Click on your Strapi service in Railway
   - Go to **"Variables"** tab

2. **Reference PostgreSQL Variables**
   - Click **"New Variable"** → **"Reference"**
   - Select your PostgreSQL service
   - Select `DATABASE_URL` variable
   - Railway will create a reference: `${{PostgreSQL.DATABASE_URL}}`
   - Click **"Add"**

3. **Alternative: Use Individual Variables**
   If you prefer individual connection params:
   - Reference `POSTGRES_HOST` → `DATABASE_HOST`
   - Reference `POSTGRES_PORT` → `DATABASE_PORT`
   - Reference `POSTGRES_DATABASE` → `DATABASE_NAME`
   - Reference `POSTGRES_USER` → `DATABASE_USERNAME`
   - Reference `POSTGRES_PASSWORD` → `DATABASE_PASSWORD`

**Recommended:** Use `DATABASE_URL` (simpler, Railway best practice)

---

## Step 4: Configure Strapi Environment Variables

In Strapi service **"Variables"** tab, add these variables:

### Required Variables

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
```

### Strapi App Keys (Generate Secure Values)

**APP_KEYS** (4 comma-separated keys):
```
n19dREylOQ4jNXc9I51/J7bLIoHIUPD9CCfQivIiiTc=,KnQDXsznWCh/tYmF1GD6yw9ELD5Qv0ZywLNgV8WHfIk=,fAclOlNWWHZd65lpCIIPMxxZ/Lz1dd3ie4RES0bi+Go=,QAm5wqNwkAHePBjhvxl66DsRfRcJmquRd/TTKvyNpsY=
```

**API_TOKEN_SALT:**
```
HzQr/Yq5Bvn0D4nYWT+z34oR70BJv/IaNto/XvAllFo=
```

**ADMIN_JWT_SECRET:**
```
OC6ittxgzduSDyyqAPKQcX5Us2MPZs5i2HOQOtBsCTQ=
```

**TRANSFER_TOKEN_SALT:**
```
rgbaG5dVCHbSJ6GLM7DBm1yZpP/T5cNVmqr2gihT/AU=
```

**JWT_SECRET:**
```
SZMNIy51qZK8wnJkzfGsS9Yh+xKLDpXqO48kAYmzg0s=
```

### Public URL (Update After Deployment)

**PUBLIC_STRAPI_URL:**
- After first deployment, Railway will provide a public URL
- Format: `https://your-service-name.up.railway.app`
- Add this variable: `PUBLIC_STRAPI_URL=https://your-service-name.up.railway.app`

---

## Step 5: Deploy and Verify

1. **Trigger Deployment**
   - Railway will automatically deploy when you add variables
   - Or click **"Deploy"** button manually
   - Watch build logs in Railway dashboard

2. **Check Build Logs**
   - Go to Strapi service → **"Deployments"** tab
   - Click on latest deployment
   - Watch for build success/failure

3. **Verify Deployment**
   - Once deployed, Railway provides a public URL
   - Test admin panel: `https://your-service-name.up.railway.app/admin`
   - Test API: `https://your-service-name.up.railway.app/api/pages`

---

## Step 6: Create Admin User

1. **Access Admin Panel**
   - Go to `https://your-service-name.up.railway.app/admin`
   - You'll see admin registration form

2. **Create Admin Account**
   - Fill in admin details
   - Create secure password
   - Complete registration

3. **Login and Verify**
   - Login to admin panel
   - Verify content types are loaded
   - Test creating a page

---

## Step 7: Update Storefront Configuration

1. **Get Strapi Public URL**
   - Copy Railway public URL for Strapi service
   - Format: `https://your-service-name.up.railway.app`

2. **Update Storefront Environment**
   - In Vercel (or your storefront hosting)
   - Add/update environment variable:
     ```
     NEXT_PUBLIC_STRAPI_URL=https://your-service-name.up.railway.app
     ```

3. **Redeploy Storefront**
   - Trigger new deployment
   - Verify homepage loads from Strapi

---

## Troubleshooting

### Build Fails

**Error: "Build command failed"**
- Check `railway.toml` syntax
- Verify `package.json` has correct build script
- Check Node.js version (Strapi requires Node 20-24)

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Check `npm ci` runs successfully

### Database Connection Issues

**Error: "Connection refused"**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` reference is correct
- Ensure services are in same Railway project

**Error: "Authentication failed"**
- Verify password reference is correct
- Check user has proper permissions
- Ensure database exists

### Runtime Issues

**Error: "APP_KEYS not set"**
- Add `APP_KEYS` environment variable
- Ensure 4 comma-separated keys
- Redeploy after adding variables

**Error: "Database migration failed"**
- Check database connection
- Verify user has CREATE/ALTER permissions
- Check database logs in Railway

---

## Railway Service Structure

After setup, your Railway project should have:

```
Railway Project: beauty-shop
├── PostgreSQL (Database)
│   ├── Variables: DATABASE_URL, POSTGRES_*
│   └── Status: Running
├── guapo-server (MedusaJS Backend)
│   └── Status: Running
├── guapo-worker (MedusaJS Worker)
│   └── Status: Running
├── Redis (Cache)
│   └── Status: Running
└── strapi-cms (Strapi CMS) ← NEW
    ├── Variables: DATABASE_URL (ref), APP_KEYS, etc.
    ├── Root Directory: beauty-shop-cms
    └── Status: Running
```

---

## Quick Reference Commands

### Generate New Secrets (if needed)

```bash
# Generate APP_KEYS (4 keys)
node -e "console.log(Array.from({length: 4}, () => require('crypto').randomBytes(32).toString('base64')).join(','))"

# Generate individual secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Railway CLI (Optional)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Deploy manually
railway up
```

---

## Next Steps

1. ✅ PostgreSQL database created
2. ✅ Strapi service created and configured
3. ✅ Environment variables set
4. ✅ Services connected
5. ✅ Deployment successful
6. ✅ Admin user created
7. ⏭️ Update storefront `NEXT_PUBLIC_STRAPI_URL`
8. ⏭️ Test CMS integration
9. ⏭️ Seed initial content (optional)

---

## Support

- [Railway Documentation](https://docs.railway.app/)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)
- [Railway Discord](https://discord.gg/railway)

