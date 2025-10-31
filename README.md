# Beauty Shop

Modern hudplejeunivers der kombinerer koreansk innovation med nordisk enkelhed. Curated e-commerce platform for mænd med fokus på kvalitet og enkelhed.

## 🏗️ Architecture

This project uses MedusaJS with Next.js storefront in a clean, separated architecture:

- **Backend** (`beauty-shop/`) - MedusaJS e-commerce backend + integrated admin
- **Storefront** (`beauty-shop-storefront/`) - Next.js 15 customer storefront
- **Database** - Supabase PostgreSQL

## 🚀 Tech Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend:** MedusaJS v2 + PostgreSQL
- **Database:** Supabase
- **Authentication:** Clerk (planned)
- **Payments:** Stripe (planned)
- **Hosting:** Vercel (planned)

## 📋 Prerequisites

- Node.js 20.x
- Git
- Supabase account

## 🛠️ Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/eskoubar95/beauty-shop.git
cd beauty-shop
```

### 2. Environment Setup

#### Backend Environment

Create `beauty-shop/.env`:

```env
# Supabase Database Configuration (Transaction Pooler)
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# MedusaJS Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com

# Redis (optional for development)
REDIS_URL=redis://localhost:6379

# Secrets (generate secure values)
JWT_SECRET=CHANGE_ME_TO_RANDOM_STRING
COOKIE_SECRET=CHANGE_ME_TO_RANDOM_STRING
```

#### Storefront Environment

Create `beauty-shop-storefront/.env.local`:

```env
# MedusaJS Backend URL
MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API Key
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_YOUR_KEY_HERE
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd beauty-shop
npm install

# Install storefront dependencies
cd ../beauty-shop-storefront
npm install
```

### 4. Run Database Migrations

```bash
cd beauty-shop
npx medusa db:migrate
```

### 5. Start Development Servers

#### Option A: Simple Development (Recommended for Getting Started)

**Backend (Terminal 1):**
```bash
cd beauty-shop
npm run dev
```
Backend will run on: http://localhost:9000  
Admin panel: http://localhost:9000/app

**Storefront (Terminal 2):**
```bash
cd beauty-shop-storefront
npm run dev
```
Storefront will run on: http://localhost:8000

#### Option B: Server/Worker Mode (Production-like Setup)

For testing the production architecture with separate Server and Worker processes:

**Backend Server (Terminal 1):**
```bash
cd beauty-shop
npm run dev
```
Handles HTTP requests (API + Admin)

**Backend Worker (Terminal 2):**
```bash
cd beauty-shop
npm run dev:worker
```
Processes background jobs and subscribers

**Storefront (Terminal 3):**
```bash
cd beauty-shop-storefront
npm run dev
```

> **Note:** Worker mode requires Redis. For development without Redis, use Option A.

## 📁 Project Structure

```
beauty-shop-root/
├── beauty-shop/                    # MedusaJS backend + admin
│   ├── src/
│   │   ├── admin/                 # MedusaJS admin customizations
│   │   ├── api/                   # Custom API routes
│   │   ├── modules/               # Custom modules
│   │   ├── workflows/             # Custom workflows
│   │   └── subscribers/           # Event handlers
│   ├── medusa-config.ts           # Medusa configuration
│   ├── .env                       # Backend environment
│   └── package.json
│
├── beauty-shop-storefront/        # Next.js storefront
│   ├── src/
│   │   ├── app/                   # Next.js 15 App Router
│   │   ├── components/            # React components
│   │   └── lib/                   # Utilities
│   ├── .env.local                 # Storefront environment
│   └── package.json
│
├── supabase/                      # Custom migrations
│   ├── config.toml
│   └── migrations/
│       ├── 20250124000001_beauty_shop_tables.sql
│       └── 20250124000002_clerk_rls_policies.sql
│
├── scripts/                        # Utility scripts
│   ├── validate-env.js
│   └── health-check.js
│
├── package.json                    # Root scripts
└── README.md                       # This file
```

## 🧪 Available Scripts

### Root Scripts

```bash
npm run dev:backend          # Start MedusaJS backend
npm run dev:storefront       # Start Next.js storefront
npm run dev:all             # Start both servers (requires concurrently)
npm run migrate             # Run MedusaJS migrations
npm run validate-env        # Validate environment variables
npm run health-check        # Check service health
```

### Backend Scripts (in beauty-shop/)

```bash
cd beauty-shop
npm run dev                  # Start MedusaJS dev server
npm run build               # Build backend
npm run db:migrate          # Run migrations
npm run user                # Create admin user
```

### Storefront Scripts (in beauty-shop-storefront/)

```bash
cd beauty-shop-storefront
npm run dev                 # Start Next.js dev server
npm run build              # Build storefront
npm run lint               # Run ESLint
npm run type-check         # TypeScript check
```

## 🔒 Security

- Environment variables never committed to git
- Secrets managed via hosting platform environment variables
- Database uses Row Level Security (RLS) policies

## 📚 Documentation

- [Project Documentation](.project/)
- [Supabase Configuration](supabase/config.toml)
- [Migration Files](supabase/migrations/)

## 🤝 Contributing

1. Create feature branch: `feature/CORE-{id}-{title}`
2. Make changes
3. Run validation: `npm run validate-env`
4. Test changes
5. Create pull request

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or issues:
1. Check existing [GitHub Issues](https://github.com/eskoubar95/beauty-shop/issues)
2. Create new issue with appropriate template
3. Reference Linear issue if applicable

## 🎯 First Time Setup

After cloning and installing dependencies:

1. **Create admin user:**
   ```bash
   cd beauty-shop
   npx medusa user -e admin@medusajs.com -p supersecret
   ```

2. **Configure sales channel in Medusa Admin:**
   - Go to http://localhost:9000/app
   - Settings → Sales Channels
   - Create or update "Default Sales Channel"
   - Configure publishable API key

3. **Validate setup:**
   ```bash
   npm run health-check
   ```

## 📊 Database Schema

The project uses three schemas:

- **`public`** - MedusaJS tables (created automatically)
- **`beauty_shop`** - Custom Beauty Shop tables (user profiles, subscriptions, content)
- **`payload`** - Payload CMS tables (planned)

## 🚀 Deployment

### Backend (MedusaJS) - Railway with Server/Worker Architecture

**Architecture:** We deploy MedusaJS with separate Server and Worker services for optimal performance.

**Prerequisites:**
- Railway account (https://railway.app)
- Supabase database connection string
- GitHub repository connected to Railway

**Important: Build Process**

MedusaJS uses a special build process that creates a `.medusa/server` directory. The application **must** be started from this directory in production. Both `railway.toml` and `railway-worker.toml` are configured to handle this automatically:

- **Build Command:** `npm run build:production` (creates `.medusa/server` and installs production dependencies)
- **Server Start:** `npm run start:production` (HTTP API + Admin)
- **Worker Start:** `npm run start:production:worker` (Background jobs)

See [MedusaJS Build Documentation](https://docs.medusajs.com/learn/build) for details.

**Deployment Architecture:**
```
┌─────────────────────────────────────┐
│      Railway Project                │
│                                     │
│  ┌──────────┐    ┌──────────┐     │
│  │  Server  │    │  Worker  │     │
│  │  (HTTP)  │    │  (Jobs)  │     │
│  └─────┬────┘    └────┬─────┘     │
│        │              │            │
│        └──────┬───────┘            │
│               ▼                    │
│         ┌─────────┐                │
│         │  Redis  │                │
│         └─────────┘                │
└─────────────────────────────────────┘
```

**Quick Start:**

> **📘 Full Guide:** See `.project/RAILWAY_SETUP_GUIDE.md` for detailed step-by-step instructions.

**Deployment Steps:**

1. **Create Railway Project:**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `beauty-shop` repository
   - Select `beauty-shop/` directory as root
   - Rename service to `beauty-shop-server`

2. **Add Redis Service:**
   - In Railway project, click "+ New"
   - Select "Redis"
   - Railway will auto-generate `REDIS_URL` variable

3. **Configure Server Service:**
   - Config file: `railway.toml`
   - Generate public domain
   - Add all environment variables (see guide)
   - Set `WORKER_MODE=false`

4. **Create Worker Service:**
   - Click "+ New" → "GitHub Repo" → same repository
   - Rename to `beauty-shop-worker`
   - Config file: `railway-worker.toml`
   - **Do NOT** generate public domain
   - Add same environment variables as server
   - Set `WORKER_MODE=true`

5. **Deploy Both Services:**
   - Railway will auto-deploy on git push to main
   - Verify Server logs show: `🌐 SERVER mode`
   - Verify Worker logs show: `👷 WORKER mode`

6. **Test Worker:**
   - Create a product in Admin UI
   - Check Worker logs for event processing

**Production URLs:**
- Backend API: `https://beauty-shop-server-production.up.railway.app`
- Admin Panel: `https://beauty-shop-server-production.up.railway.app/app`
- Health Check: `https://beauty-shop-server-production.up.railway.app/health`

**Troubleshooting:**

If you encounter "Could not find index.html in admin build directory" error:
- Verify `railway.toml` uses `build:production` and `start:production` scripts
- Ensure `DISABLE_ADMIN` is NOT set to `true` in environment variables
- Check Railway logs to confirm build creates `.medusa/server` directory
- See [MedusaJS Troubleshooting](https://docs.medusajs.com/resources/troubleshooting/medusa-admin/build-error)

### Storefront (Next.js)

- Host: Vercel
- Environment: Set MEDUSA_BACKEND_URL and publishable key
- Build command: `npm run build`
- Output directory: `.next`

---

Built with ❤️ using MedusaJS and Next.js

<!-- Phase 8: Vercel CI/CD test deployment -->
