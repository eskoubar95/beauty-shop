# Beauty Shop Monorepo

Modern hudplejeunivers der kombinerer koreansk innovation med nordisk enkelhed. Curated e-commerce platform for mænd med fokus på kvalitet og enkelhed.

## 🏗️ Monorepo Structure

This is a modern monorepo built with Turborepo and pnpm workspaces, containing:

- **Storefront** (`apps/storefront/`) - Next.js 15 customer storefront
- **Admin** (`apps/admin/`) - Payload CMS content management  
- **Medusa** (`apps/medusa/`) - MedusaJS e-commerce backend

### Shared Packages

- **UI** (`packages/ui/`) - Shared React components
- **Types** (`packages/types/`) - Shared TypeScript types
- **Config** (`packages/config/`) - Shared configurations

## 🚀 Tech Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend:** MedusaJS v2 + PostgreSQL
- **CMS:** Payload CMS
- **Database:** Supabase
- **Authentication:** Clerk
- **Payments:** Stripe
- **Monorepo:** Turborepo + pnpm workspaces
- **Hosting:** Vercel (Frontend) + Render (Backend)

## 📋 Prerequisites

- Node.js 20.x
- pnpm 8.x (recommended) or npm 10.x
- Git

## 🛠️ Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/eskoubar95/beauty-shop.git
cd beauty-shop
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Fill in your service keys in .env file
# See .env.example for all required variables

# Validate environment
pnpm run env:validate
```

### 4. Start Development
```bash
# Start all apps in parallel
pnpm dev

# Or start individual apps
pnpm --filter storefront dev    # Next.js storefront (port 3000)
pnpm --filter admin dev         # Payload CMS (port 3001)  
pnpm --filter medusa dev        # MedusaJS backend (port 9000)
```

## 📁 Project Structure

```
beauty-shop/
├── apps/
│   ├── storefront/         # Next.js 15 storefront (port 3000)
│   ├── admin/              # Payload CMS (port 3001)
│   └── medusa/             # MedusaJS backend (port 9000)
├── packages/
│   ├── ui/                 # Shared React components
│   ├── types/              # Shared TypeScript types
│   └── config/             # Shared configurations
├── supabase/               # Database migrations
├── .github/                # GitHub Actions & Templates
├── .project/               # Project documentation
├── scripts/                # Utility scripts
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspaces
├── package.json            # Root dependencies & scripts
└── README.md              # This file
```

## 🧪 Available Scripts

### Monorepo Commands
- `pnpm dev` - Start all apps in parallel
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Run ESLint across all packages
- `pnpm typecheck` - Run TypeScript check across all packages
- `pnpm test` - Run tests across all packages

### Individual App Commands
- `pnpm --filter storefront dev` - Start storefront only
- `pnpm --filter admin dev` - Start admin only
- `pnpm --filter medusa dev` - Start MedusaJS only

### Environment & Security
- `pnpm run env:validate` - Validate environment variables
- `pnpm run env:health` - Health check services
- `pnpm run security:audit` - Security audit
- `pnpm run repo:health` - Repository health check
- `pnpm run repo:check` - Full repository validation

### Package Management
- `pnpm -r build` - Build all packages
- `pnpm -r typecheck` - Type check all packages
- `pnpm -r lint` - Lint all packages

## 🔒 Security

- Environment variables never committed to git
- Secrets managed via secure services (Vercel, Render)
- Regular security audits with `npm run security:audit`

## 📚 Documentation

- [Project Brief](.project/01-Project_Brief.md)
- [Tech Stack](.project/03-Tech_Stack.md)
- [API Design](.project/05-API_Design.md)
- [Security Guidelines](.project/security-guidelines.md)

## 🤝 Contributing

1. Create feature branch: `feature/CORE-{id}-{title}`
2. Make changes
3. Run tests: `npm run check`
4. Create pull request
5. Wait for review and approval

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or issues, please:
1. Check existing [GitHub Issues](https://github.com/eskoubar95/beauty-shop/issues)
2. Create new issue with appropriate template
3. Reference Linear issue if applicable

---

## Environment Setup

### Development
1. **Setup environment:**
   ```bash
   npm run env:setup
   ```

2. **Fill in your service keys:**
   - Edit `.env` file with your actual values
   - Use test keys for all third-party services

3. **Validate environment:**
   ```bash
   npm run env:check
   ```

### Production
1. **Configure secrets in hosting platform:**
   - Vercel Environment Variables (frontend)
   - Render Environment Variables (backend)
   - AWS Secrets Manager (critical secrets)

2. **Validate production environment:**
   ```bash
   NODE_ENV=production npm run env:check
   ```

## Commands

### Development
- `npm run dev`: Start development server (placeholder - add framework first)
- `npm run build`: Build application (placeholder)
- `npm run start`: Start production server (placeholder)

### Environment Management
- `npm run env:setup`: Setup environment files from templates
- `npm run env:validate`: Validate environment variables
- `npm run env:health`: Check service health
- `npm run env:check`: Complete environment validation

### Security
- `npm run secrets:check`: Block committed `.env*` files
- `npm run security:audit`: Run comprehensive security audit

### Quality
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix lint errors automatically
- `npm run format`: Run Prettier write
- `npm run format:check`: Check formatting
- `npm run typecheck`: TypeScript typecheck (requires `tsconfig.json`)

### Testing
- `npm run test`: Run Vitest in CI mode
- `npm run test:watch`: Run Vitest watch

### All-in-one
- `npm run check`: format:check + lint + typecheck + test + secrets:check
- `npm run ci`: npm ci + check

## Security

### Environment Security
- Never commit `.env` files to git
- Use different secrets per environment
- Rotate secrets regularly
- Monitor secret access

### Security Audit
Run security audit before deployment:
```bash
npm run security:audit
```

### Documentation
- [Secrets Management Guide](.project/secrets-management.md)
- [Security Guidelines](.project/security-guidelines.md)
- [Security Checklist](.project/security-checklist.md)

## Project Structure

```
beauty-shop/
├── .env.example              # Backend environment template
├── .env.local.example        # Frontend environment template
├── .env.production.example   # Production environment template
├── scripts/
│   ├── setup-env.js         # Environment setup script
│   ├── validate-env.js      # Environment validation
│   ├── health-check.js      # Service health check
│   └── security-audit.js    # Security audit script
└── .project/
    ├── secrets-management.md # Secrets management guide
    ├── security-guidelines.md # Security guidelines
    └── security-checklist.md # Security checklist
```

## Getting Started

1. **Clone repository:**
   ```bash
   git clone https://github.com/eskoubar95/beauty-shop.git
   cd beauty-shop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   npm run env:setup
   ```

4. **Configure services:**
   - Edit `.env` with your service keys
   - See [Secrets Management Guide](.project/secrets-management.md)

5. **Validate setup:**
   ```bash
   npm run env:check
   ```

6. **Start development:**
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend:** Next.js 15 + React 19
- **Backend:** MedusaJS
- **Database:** PostgreSQL + Redis
- **Authentication:** Clerk
- **Payments:** Stripe
- **Database:** Supabase
- **Monitoring:** Sentry
- **Deployment:** Vercel (frontend) + Render (backend)

## Support

For environment setup issues, see:
- [Secrets Management Guide](.project/secrets-management.md)
- [Security Guidelines](.project/security-guidelines.md)

For development issues, see:
- [Backend Guide](.project/06-Backend_Guide.md)
- [Frontend Guide](.project/07-Frontend_Guide.md)