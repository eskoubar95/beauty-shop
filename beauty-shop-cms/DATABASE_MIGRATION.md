# Database Migration Guide - Local to Railway

## Overview

This guide covers migrating your local Strapi PostgreSQL database to Railway PostgreSQL database, including both schema (migrations) and data (content).

## Prerequisites

- Local PostgreSQL database running (`beauty-shop-strapi-db` container)
- Railway PostgreSQL database created and accessible
- Railway CLI installed (optional, but helpful)
- `pg_dump` and `psql` tools available

## Migration Strategy

**Option A: Schema + Data Migration (Recommended)**
- Export entire database (schema + data)
- Import to Railway
- Preserves all content, users, and configurations

**Option B: Schema Only + Re-seed**
- Export only schema (migrations)
- Import to Railway
- Run Strapi seed script to populate initial content
- Use if you want fresh content in production

**Option C: Strapi Auto-Migration**
- Let Strapi run migrations automatically
- Export/import only content data
- Use if schema is already synced

---

## Step 1: Export Local Database

### Option A: Full Database Export (Schema + Data)

```bash
# Export entire database to SQL file
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi > strapi_local_backup.sql

# Or with custom format (better for large databases)
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi -F c -f /tmp/strapi_backup.dump
docker cp beauty-shop-strapi-db:/tmp/strapi_backup.dump ./strapi_backup.dump
```

### Option B: Schema Only Export

```bash
# Export only schema (no data)
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --schema-only > strapi_schema.sql

# Or with clean statements (drops existing tables)
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --schema-only --clean > strapi_schema_clean.sql
```

### Option C: Data Only Export

```bash
# Export only data (no schema)
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --data-only > strapi_data.sql

# Export specific tables (e.g., only content)
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --data-only -t strapi_core_store_settings -t strapi_* > strapi_content_data.sql
```

---

## Step 2: Get Railway Database Connection Details

### Method A: Railway Dashboard

1. Go to Railway Dashboard → Your Project → PostgreSQL Service
2. Click **"Variables"** tab
3. Copy `DATABASE_URL` connection string
   - Format: `postgresql://postgres:PASSWORD@HOST:PORT/railway`

### Method B: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Get database URL
railway variables --service PostgreSQL
```

### Method C: Extract from Railway Dashboard

1. PostgreSQL service → **"Connect"** tab
2. Copy connection details:
   - Host: `xxx.railway.app`
   - Port: `5432`
   - Database: `railway`
   - User: `postgres`
   - Password: (shown in Variables tab)

---

## Step 3: Import to Railway Database

### Option A: Using psql (Recommended)

```bash
# Set Railway database URL (get from Railway dashboard)
export RAILWAY_DB_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway"

# Import full database
psql $RAILWAY_DB_URL < strapi_local_backup.sql

# Or import schema only
psql $RAILWAY_DB_URL < strapi_schema.sql

# Or import data only (after schema is created)
psql $RAILWAY_DB_URL < strapi_data.sql
```

### Option B: Using Railway CLI

```bash
# Set Railway database URL
railway variables --service PostgreSQL

# Import using Railway CLI
railway run psql $DATABASE_URL < strapi_local_backup.sql
```

### Option C: Using pgAdmin or DBeaver

1. Connect to Railway database using connection details
2. Use GUI tool to import SQL file
3. Run import script

---

## Step 4: Verify Migration

### Check Tables Exist

```bash
# Connect to Railway database
psql $RAILWAY_DB_URL

# List tables
\dt

# Check specific Strapi tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'strapi_%';

# Check data count
SELECT COUNT(*) FROM strapi_core_store_settings;
SELECT COUNT(*) FROM strapi_pages;
SELECT COUNT(*) FROM strapi_blog_posts;
```

### Test Strapi Connection

1. Update Strapi service environment variables in Railway
2. Ensure `DATABASE_URL` is correctly referenced
3. Restart Strapi service
4. Check Strapi logs for connection success
5. Access admin panel: `https://your-service.railway.app/admin`

---

## Step 5: Handle Strapi-Specific Considerations

### Strapi Core Store Settings

Strapi stores configuration in `strapi_core_store_settings`. This includes:
- Admin user accounts
- Plugin configurations
- System settings

**Important:** If you migrate admin users, you'll need to:
1. Reset admin password in Railway Strapi admin panel
2. Or ensure password hashes are correctly migrated

### Media Files

Strapi media files are stored in `public/uploads/` directory, NOT in database.

**To migrate media:**
```bash
# Option A: Copy uploads folder
# From local: beauty-shop-cms/public/uploads/
# To Railway: Use Railway file system or S3 storage

# Option B: Use Strapi Media Library
# Re-upload media files through Strapi admin panel
```

**Recommended:** Use external storage (S3, Cloudinary) for production.

### Content Types

Strapi content types are stored in:
- `strapi_content_types` table (schema definitions)
- Individual content tables (e.g., `strapi_pages`, `strapi_blog_posts`)

**Migration preserves:**
- ✅ Content type schemas
- ✅ Content data
- ✅ Relationships
- ✅ Media references

---

## Complete Migration Script

### Full Migration (Schema + Data)

```bash
#!/bin/bash
# migrate-strapi-to-railway.sh

set -e

echo "🚀 Starting Strapi Database Migration to Railway"

# Step 1: Export local database
echo "📤 Exporting local database..."
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi > strapi_backup_$(date +%Y%m%d_%H%M%S).sql
echo "✅ Export complete"

# Step 2: Get Railway database URL
echo "🔗 Enter Railway DATABASE_URL:"
read -r RAILWAY_DB_URL

# Step 3: Import to Railway
echo "📥 Importing to Railway..."
psql "$RAILWAY_DB_URL" < strapi_backup_*.sql
echo "✅ Import complete"

# Step 4: Verify
echo "🔍 Verifying migration..."
psql "$RAILWAY_DB_URL" -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"
psql "$RAILWAY_DB_URL" -c "SELECT COUNT(*) as page_count FROM strapi_pages;"

echo "✅ Migration complete!"
echo "📝 Next steps:"
echo "   1. Update Strapi service DATABASE_URL in Railway"
echo "   2. Restart Strapi service"
echo "   3. Test admin panel: https://your-service.railway.app/admin"
```

### Schema Only Migration

```bash
#!/bin/bash
# migrate-schema-only.sh

set -e

echo "🚀 Migrating Strapi Schema to Railway"

# Export schema only
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --schema-only > strapi_schema.sql

# Get Railway URL
echo "🔗 Enter Railway DATABASE_URL:"
read -r RAILWAY_DB_URL

# Import schema
psql "$RAILWAY_DB_URL" < strapi_schema.sql

echo "✅ Schema migration complete!"
echo "📝 Next: Run Strapi seed script or let Strapi create initial content"
```

---

## Troubleshooting

### Error: "Database does not exist"

```bash
# Create database in Railway (if needed)
psql $RAILWAY_DB_URL -c "CREATE DATABASE strapi;"
```

### Error: "Permission denied"

- Verify Railway database user has CREATE/ALTER permissions
- Check connection string is correct
- Ensure you're using the correct database user

### Error: "Table already exists"

```bash
# Drop existing tables (WARNING: Deletes data!)
psql $RAILWAY_DB_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Then re-import
psql $RAILWAY_DB_URL < strapi_backup.sql
```

### Error: "Connection timeout"

- Check Railway database is running
- Verify firewall/network settings
- Try connecting from Railway CLI instead

### Strapi Admin Password Issues

If admin users don't work after migration:

```bash
# Option 1: Reset password in Strapi admin panel
# Go to: https://your-service.railway.app/admin
# Use "Forgot password" feature

# Option 2: Create new admin user
# Strapi will prompt for admin registration on first access
```

---

## Best Practices

### Before Migration

1. ✅ **Backup local database** (you already have it!)
2. ✅ **Test migration on staging** (if available)
3. ✅ **Document current content** (screenshots, exports)
4. ✅ **Verify Railway database is empty** (or backup existing)

### During Migration

1. ✅ **Use transaction** (wrap in BEGIN/COMMIT)
2. ✅ **Verify each step** (check logs, counts)
3. ✅ **Test connection** before full import
4. ✅ **Monitor Railway logs** during import

### After Migration

1. ✅ **Verify all tables exist**
2. ✅ **Check data counts** match local
3. ✅ **Test Strapi admin panel**
4. ✅ **Test API endpoints**
5. ✅ **Update storefront** `NEXT_PUBLIC_STRAPI_URL`
6. ✅ **Keep local backup** for rollback

---

## Alternative: Strapi Auto-Migration

If you prefer to let Strapi handle migrations:

1. **Deploy Strapi to Railway** (empty database)
2. **Strapi will auto-run migrations** on first start
3. **Export only content data** from local:
   ```bash
   docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --data-only -t strapi_pages -t strapi_blog_posts > content_data.sql
   ```
4. **Import content data** to Railway:
   ```bash
   psql $RAILWAY_DB_URL < content_data.sql
   ```

**Pros:**
- ✅ Strapi handles schema migrations
- ✅ Ensures schema compatibility
- ✅ Less manual work

**Cons:**
- ⚠️ May need to adjust data if schema changed
- ⚠️ Requires manual content import

---

## Quick Reference

### Export Commands

```bash
# Full backup
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi > backup.sql

# Schema only
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --schema-only > schema.sql

# Data only
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi --data-only > data.sql

# Specific tables
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi -t strapi_pages -t strapi_blog_posts > pages_blog.sql
```

### Import Commands

```bash
# Full import
psql $RAILWAY_DB_URL < backup.sql

# Schema import
psql $RAILWAY_DB_URL < schema.sql

# Data import
psql $RAILWAY_DB_URL < data.sql
```

### Verification Commands

```bash
# List tables
psql $RAILWAY_DB_URL -c "\dt"

# Count records
psql $RAILWAY_DB_URL -c "SELECT COUNT(*) FROM strapi_pages;"

# Check connection
psql $RAILWAY_DB_URL -c "SELECT version();"
```

---

## Next Steps

1. ✅ Export local database
2. ✅ Get Railway database connection details
3. ✅ Import to Railway
4. ✅ Verify migration
5. ✅ Update Strapi service configuration
6. ✅ Test Strapi admin panel
7. ✅ Update storefront `NEXT_PUBLIC_STRAPI_URL`
8. ✅ Test CMS integration

---

## Support

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Railway Database Guide](https://docs.railway.app/databases/postgresql)

