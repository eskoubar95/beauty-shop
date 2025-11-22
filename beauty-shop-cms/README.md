# Beauty Shop CMS (Strapi)

Strapi v5 CMS for Beauty Shop marketing content, bundles and blog.

## Local Development

### Prerequisites
- Node.js 20+
- Docker (for local PostgreSQL)

### Setup

1. **Start PostgreSQL database:**
```bash
docker run --name beauty-shop-strapi-db \
  -e POSTGRES_DB=strapi \
  -e POSTGRES_USER=strapi \
  -e POSTGRES_PASSWORD=CHANGE_ME_STRONG \
  -p 5433:5432 \
  -d postgres:16
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start Strapi:**
```bash
npm run develop
```

5. **Access admin panel:**
- Open http://localhost:1337/admin
- Create admin user on first run

## Production Deployment

See `.project/RAILWAY_SETUP_GUIDE.md` for Railway deployment instructions.

## Content Types

- `page` - Static/marketing pages (About, etc.)
- `bundlePage` - Rich bundle/product pages with Medusa integration
- `blogPost` - Blog posts for SEO and guides
- `seo` - Reusable SEO component

See `.project/plans/2025-11-19-CORE-27-implement-strapi-cms-for-marketing-content-bundles-and-blog.md` for full implementation plan.
