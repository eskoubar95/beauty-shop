# Strapi CMS Local Development Setup

## Quick Start

### 1. Install Dependencies

```bash
cd beauty-shop-cms
npm install
```

### 2. Setup PostgreSQL Database

**Option A: Docker (Recommended)**

```bash
# Generate a secure password (save this!)
openssl rand -base64 32

# Create PostgreSQL container
docker run --name beauty-shop-strapi-db \
  -e POSTGRES_DB=strapi \
  -e POSTGRES_USER=strapi \
  -e POSTGRES_PASSWORD=your_generated_password_here \
  -p 5433:5432 \
  -d postgres:16

# Verify container is running
docker ps | grep beauty-shop-strapi-db
```

**Option B: Local PostgreSQL Installation**

```bash
# Create database and user
createdb strapi
createuser strapi
psql -c "ALTER USER strapi WITH PASSWORD 'your_secure_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;"
```

### 3. Create Environment File

Copy `.env.example` to `.env` (if exists) or create new `.env`:

```bash
cd beauty-shop-cms
cat > .env << 'EOF'
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_generated_password_here
DATABASE_SSL=false

# Server Configuration
HOST=0.0.0.0
PORT=1337
PUBLIC_STRAPI_URL=http://localhost:1337
NODE_ENV=development

# Strapi App Keys (generate secure values)
# Generate with: node -e "console.log(Array.from({length: 4}, () => require('crypto').randomBytes(32).toString('base64')).join(','))"
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
TRANSFER_TOKEN_SALT=your_transfer_token_salt_here
JWT_SECRET=your_jwt_secret_here
EOF
```

**Generate Secure Keys:**

```bash
# Generate APP_KEYS (4 comma-separated keys)
node -e "console.log(Array.from({length: 4}, () => require('crypto').randomBytes(32).toString('base64')).join(','))"

# Generate individual secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Start Strapi

```bash
npm run develop
```

Strapi will:
- Connect to PostgreSQL database
- Run migrations automatically
- Start admin panel at http://localhost:1337/admin

### 5. Create Admin User

1. Open http://localhost:1337/admin
2. Fill in admin registration form
3. Login to admin panel

## Password Security

### Best Practices

1. **Use strong passwords** (minimum 32 characters)
2. **Never commit passwords** to git (use `.env` file)
3. **Rotate passwords regularly** (especially in production)
4. **Use different passwords** for development and production

### Generate Secure Passwords

```bash
# Generate random password (32 bytes, base64 encoded)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Example Secure Password

```
3fsEsb0I4bgLGnFK6W2nmvfHqxBPjvcJn4EoVvJjrrM=
```

**Save this password securely!** You'll need it for:
- Database connection
- Railway environment variables
- Team members' local setup

## Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
```bash
# Check if PostgreSQL container is running
docker ps | grep beauty-shop-strapi-db

# If not running, start it
docker start beauty-shop-strapi-db

# Check logs
docker logs beauty-shop-strapi-db
```

**Error: "Authentication failed"**
- Verify password in `.env` matches Docker container password
- Check `DATABASE_USERNAME` matches container user
- Ensure database exists: `docker exec -it beauty-shop-strapi-db psql -U strapi -d strapi`

**Error: "Database does not exist"**
```bash
# Create database in running container
docker exec -it beauty-shop-strapi-db psql -U strapi -c "CREATE DATABASE strapi;"
```

### Port Conflicts

**Error: "Port 1337 already in use"**
```bash
# Find process using port 1337
lsof -i :1337

# Kill process or change PORT in .env
PORT=1338 npm run develop
```

### Migration Issues

**Error: "Migration failed"**
```bash
# Reset database (WARNING: Deletes all data!)
docker exec -it beauty-shop-strapi-db psql -U strapi -c "DROP DATABASE strapi;"
docker exec -it beauty-shop-strapi-db psql -U strapi -c "CREATE DATABASE strapi;"

# Restart Strapi - it will run migrations automatically
npm run develop
```

## Docker Commands Reference

```bash
# Start container
docker start beauty-shop-strapi-db

# Stop container
docker stop beauty-shop-strapi-db

# View logs
docker logs beauty-shop-strapi-db

# Access PostgreSQL CLI
docker exec -it beauty-shop-strapi-db psql -U strapi -d strapi

# Remove container (WARNING: Deletes all data!)
docker stop beauty-shop-strapi-db
docker rm beauty-shop-strapi-db
```

## Next Steps

1. ✅ Database running
2. ✅ Environment configured
3. ✅ Strapi started
4. ✅ Admin user created
5. ⏭️ Seed initial content (optional)
6. ⏭️ Configure content types
7. ⏭️ Test API endpoints

## Related Documentation

- [Strapi Getting Started](https://docs.strapi.io/dev-docs/getting-started/quick-start)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)

