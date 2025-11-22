# Strapi CMS Railway Deployment Guide

## Overview

This guide covers deploying Strapi CMS to Railway alongside other Beauty Shop services (guapo-server, guapo-worker, Redis).

## Prerequisites

- Railway account with project access
- PostgreSQL database in Railway (or external Supabase)
- GitHub repository connected to Railway

## Railway Setup

### 1. Create Railway Service

1. Go to Railway dashboard → Your Project
2. Click "New" → "GitHub Repo"
3. Select `beauty-shop` repository
4. Select `beauty-shop-cms` as the root directory
5. Railway will auto-detect `railway.toml` configuration

### 2. Add PostgreSQL Database

**Option A: Railway PostgreSQL (Recommended for Strapi)**

1. In Railway project, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically create a PostgreSQL service
3. Railway will automatically inject these environment variables:
   - `DATABASE_URL` (connection string)
   - `POSTGRES_HOST`
   - `POSTGRES_PORT`
   - `POSTGRES_DATABASE`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`

**Option B: External Supabase PostgreSQL**

1. Use existing Supabase database
2. Add environment variables manually:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   DATABASE_CLIENT=postgres
   DATABASE_SSL=true
   ```

### 3. Configure Environment Variables

In Railway service settings, add these environment variables:

**Required:**
```
NODE_ENV=production
DATABASE_CLIENT=postgres
```

**Strapi App Keys (generate secure random strings):**
```
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random_salt_string
ADMIN_JWT_SECRET=random_jwt_secret
TRANSFER_TOKEN_SALT=random_transfer_salt
JWT_SECRET=random_jwt_secret
```

**Public URL (update after deployment):**
```
PUBLIC_STRAPI_URL=https://your-strapi-service.railway.app
```

**Generate secure keys:**
```bash
# Generate random strings for APP_KEYS (comma-separated, 4 keys)
node -e "console.log(Array.from({length: 4}, () => require('crypto').randomBytes(32).toString('base64')).join(','))"

# Generate other secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Connect Services

1. In Railway, select Strapi service
2. Go to "Variables" tab
3. Click "Reference" next to PostgreSQL service
4. Select `DATABASE_URL` (or individual variables)
5. Railway will automatically inject these at runtime

### 5. Deploy

Railway will automatically deploy when you push to the connected branch (usually `main`).

**Manual deployment:**
```bash
railway up --service strapi-cms
```

## Local PostgreSQL Setup (Development)

### 1. Create Docker PostgreSQL Container

```bash
docker run --name beauty-shop-strapi-db \
  -e POSTGRES_DB=strapi \
  -e POSTGRES_USER=strapi \
  -e POSTGRES_PASSWORD=your_secure_password_here \
  -p 5433:5432 \
  -d postgres:16
```

**Generate secure password:**
```bash
# Generate a secure password (save this!)
openssl rand -base64 32
```

### 2. Update Local .env

Create `beauty-shop-cms/.env`:

```env
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_secure_password_here
DATABASE_SSL=false

# Strapi Configuration
HOST=0.0.0.0
PORT=1337
PUBLIC_STRAPI_URL=http://localhost:1337

# App Keys (generate secure values)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret
```

### 3. Run Migrations

```bash
cd beauty-shop-cms
npm run develop
# Strapi will automatically run migrations on first start
```

## Password Security Best Practices

### Local Development

1. **Use strong passwords** (min 32 characters)
2. **Store in .env** (never commit to git)
3. **Use Docker secrets** for production-like local setup

### Railway Production

1. **Use Railway's auto-generated passwords** (most secure)
2. **Never hardcode passwords** in code
3. **Use Railway environment variables** (encrypted at rest)
4. **Rotate passwords regularly** (Railway makes this easy)

## Troubleshooting

### Connection Issues

**Error: "Connection refused"**
- Check PostgreSQL service is running in Railway
- Verify `DATABASE_URL` is correctly referenced
- Check firewall/network settings

**Error: "Authentication failed"**
- Verify password is correct
- Check user has proper permissions
- Ensure database exists

### Build Issues

**Error: "Build failed"**
- Check `railway.toml` syntax
- Verify `package.json` has correct build scripts
- Check Node.js version compatibility (Strapi requires Node 20-24)

### Runtime Issues

**Error: "APP_KEYS not set"**
- Add `APP_KEYS` environment variable in Railway
- Ensure 4 comma-separated keys are provided

**Error: "Database migration failed"**
- Check database connection
- Verify user has CREATE/ALTER permissions
- Check database logs in Railway

## Monitoring

### Railway Dashboard

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, network usage
- **Health Checks**: Automatic health checks via `/_health` endpoint

### Strapi Admin

- Access admin panel: `https://your-strapi-service.railway.app/admin`
- Monitor content types, users, plugins
- Check API logs in Strapi admin

## Next Steps

1. ✅ Deploy Strapi to Railway
2. ✅ Configure environment variables
3. ✅ Run initial migrations
4. ✅ Create admin user
5. ✅ Seed initial content (optional)
6. ✅ Update storefront `NEXT_PUBLIC_STRAPI_URL` to Railway URL
7. ✅ Test CMS integration

## Related Documentation

- [Railway Documentation](https://docs.railway.app/)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/admin.html)

