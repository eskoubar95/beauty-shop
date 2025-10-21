# Beauty Shop

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