#!/bin/bash
# migrate-strapi-to-railway.sh
# Script to migrate local Strapi database to Railway PostgreSQL

set -e

echo "🚀 Strapi Database Migration to Railway"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check local database
echo -e "${YELLOW}Step 1: Checking local database...${NC}"
if ! docker ps | grep -q beauty-shop-strapi-db; then
    echo -e "${RED}❌ Local PostgreSQL container 'beauty-shop-strapi-db' is not running${NC}"
    echo "Start it with: docker start beauty-shop-strapi-db"
    exit 1
fi
echo -e "${GREEN}✅ Local database container is running${NC}"

# Step 2: Export local database
echo ""
echo -e "${YELLOW}Step 2: Exporting local database...${NC}"
BACKUP_FILE="strapi_backup_$(date +%Y%m%d_%H%M%S).sql"
docker exec beauty-shop-strapi-db pg_dump -U strapi -d strapi > "$BACKUP_FILE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database exported to: $BACKUP_FILE${NC}"
    echo "   File size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo -e "${RED}❌ Export failed${NC}"
    exit 1
fi

# Step 3: Get Railway database URL
echo ""
echo -e "${YELLOW}Step 3: Railway Database Connection${NC}"
echo "Get your Railway DATABASE_URL from:"
echo "  1. Railway Dashboard → PostgreSQL Service → Variables tab"
echo "  2. Copy the DATABASE_URL value"
echo ""
echo "Format: postgresql://postgres:PASSWORD@HOST:PORT/railway"
echo ""
read -p "Enter Railway DATABASE_URL: " RAILWAY_DB_URL

if [ -z "$RAILWAY_DB_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL is required${NC}"
    exit 1
fi

# Step 4: Test Railway connection
echo ""
echo -e "${YELLOW}Step 4: Testing Railway connection...${NC}"
# Use Docker postgres image to test connection (psql might not be installed locally)
if docker run --rm postgres:16 psql "$RAILWAY_DB_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connection successful${NC}"
else
    echo -e "${RED}❌ Connection failed. Please check your DATABASE_URL${NC}"
    exit 1
fi

# Step 5: Confirm import
echo ""
echo -e "${YELLOW}Step 5: Ready to import${NC}"
echo "This will import the entire database to Railway."
echo "⚠️  WARNING: This will overwrite any existing data in Railway database!"
echo ""
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Migration cancelled."
    exit 0
fi

# Step 6: Import to Railway
echo ""
echo -e "${YELLOW}Step 6: Importing to Railway...${NC}"
echo "This may take a few minutes..."
# Use Docker postgres image to import (psql might not be installed locally)
docker run --rm -i -v "$(pwd):/backup" postgres:16 psql "$RAILWAY_DB_URL" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Import successful!${NC}"
else
    echo -e "${RED}❌ Import failed${NC}"
    exit 1
fi

# Step 7: Verify migration
echo ""
echo -e "${YELLOW}Step 7: Verifying migration...${NC}"
# Use Docker postgres image to verify (psql might not be installed locally)
TABLE_COUNT=$(docker run --rm postgres:16 psql "$RAILWAY_DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs || echo "0")
echo "   Tables in Railway: $TABLE_COUNT"

PAGE_COUNT=$(docker run --rm postgres:16 psql "$RAILWAY_DB_URL" -t -c "SELECT COUNT(*) FROM pages;" 2>/dev/null | xargs || echo "0")
echo "   Pages: $PAGE_COUNT"

BLOG_COUNT=$(docker run --rm postgres:16 psql "$RAILWAY_DB_URL" -t -c "SELECT COUNT(*) FROM blog_posts;" 2>/dev/null | xargs || echo "0")
echo "   Blog posts: $BLOG_COUNT"

ADMIN_COUNT=$(docker run --rm postgres:16 psql "$RAILWAY_DB_URL" -t -c "SELECT COUNT(*) FROM admin_users;" 2>/dev/null | xargs || echo "0")
echo "   Admin users: $ADMIN_COUNT"

# Step 8: Summary
echo ""
echo -e "${GREEN}✅ Migration Complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo "  1. Update Strapi service DATABASE_URL in Railway"
echo "  2. Ensure DATABASE_URL is referenced from PostgreSQL service"
echo "  3. Restart Strapi service in Railway"
echo "  4. Test admin panel: https://your-service.railway.app/admin"
echo "  5. Update storefront NEXT_PUBLIC_STRAPI_URL"
echo ""
echo "📦 Backup file saved: $BACKUP_FILE"
echo "   Keep this file for rollback if needed"

