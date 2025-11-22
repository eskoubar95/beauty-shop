# Strapi Page Builder Setup Guide

**Dato:** 20. november 2025  
**Phase:** 4.3 - Strapi Page Builder Opsætning  
**Status:** ⚠️ Node.js Version Konflikt

---

## ⚠️ VIGTIG: Node.js Version Krav

**Problem:** Strapi Page Builder plugin kræver Node.js <=22.x.x, men systemet kører Node.js v24.10.0.

**Plugin Krav:**
- Node.js: >=18.0.0 <=22.x.x
- NPM: >=6.0.0

**Nuværende System:**
- Node.js: v24.10.0
- NPM: 11.6.0

**Fejl ved installation:**
```
npm error Error: Expected "0.21.5" but got "0.25.12"
```

---

## Løsningsmuligheder

### Option 1: Brug Node Version Manager (nvm) - ANBEFALET

**Installér Node.js 22.x via nvm:**

```bash
# Installér nvm hvis ikke allerede installeret
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Installér Node.js 22 LTS
nvm install 22

# Brug Node.js 22 i beauty-shop-cms directory
cd beauty-shop-cms
nvm use 22

# Verificér version
node --version  # Skal vise v22.x.x

# Installér plugin
npm install @wecre8websites/strapi-page-builder
```

### Option 2: Docker Container med Node.js 22

**Opret Dockerfile for Strapi med Node.js 22:**

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1337

CMD ["npm", "run", "develop"]
```

### Option 3: Vent på Plugin Opdatering

- Kontakt Strapi Page Builder support om Node.js 24 support
- Check plugin GitHub for updates
- Overvej alternativ page builder løsning

---

## Installation Steps (Når Node.js Version er Korrekt)

### 1. Installér Plugin

```bash
cd beauty-shop-cms
npm install @wecre8websites/strapi-page-builder
```

### 2. Konfigurér Plugin i Strapi

**File:** `beauty-shop-cms/config/plugins.ts`

```typescript
export default ({ env }) => ({
  'page-builder': {
    enabled: true,
    resolve: './src/plugins/page-builder', // Hvis plugin har custom path
    config: {
      // Plugin konfiguration kommer her
    },
  },
  // ... andre plugins
});
```

**Eller hvis plugin auto-registrerer sig:**

```typescript
export default () => ({
  // Plugin registreres automatisk
});
```

### 3. Opret API Key

1. Gå til https://pagebuilder.wc8.io
2. Sign up for free development account
3. Få din API key fra dashboard
4. Gem API key til senere brug

### 4. Konfigurér Plugin Settings i Strapi Admin

1. Start Strapi: `npm run develop`
2. Gå til Strapi admin: http://localhost:1337/admin
3. Naviger til Settings → Page Builder
4. Indtast API key fra step 3
5. Gem indstillinger

### 5. Opret Read-Only API Token

1. I Strapi admin, gå til Settings → API Tokens
2. Klik "Create new API Token"
3. Navn: "Storefront Read-Only"
4. Token type: "Read-only"
5. Token duration: "Unlimited" (eller efter behov)
6. Klik "Save"
7. **Kopiér token** - du får kun vist den én gang!

### 6. Environment Variables

**File:** `beauty-shop-cms/.env`

```env
# Strapi Page Builder API Key
PAGE_BUILDER_API_KEY=your_api_key_here

# Strapi Admin Token (for frontend)
STRAPI_ADMIN_TOKEN=your_read_only_token_here
```

**File:** `beauty-shop-storefront/.env.local`

```env
# Strapi Page Builder API Key
NEXT_PUBLIC_PAGE_BUILDER_API_KEY=your_api_key_here

# Strapi Admin Token (Read-Only)
STRAPI_ADMIN_TOKEN=your_read_only_token_here
```

---

## Verifikation

### 1. Tjek Plugin er Installeret

```bash
cd beauty-shop-cms
npm list @wecre8websites/strapi-page-builder
```

### 2. Tjek Strapi Starter

```bash
npm run develop
```

**Forventet:**
- Ingen errors om manglende plugin
- Page Builder menu item i Strapi admin sidebar

### 3. Tjek Admin Panel

1. Gå til http://localhost:1337/admin
2. Tjek om "Page Builder" menu item er synligt
3. Klik på Page Builder
4. Verificér at settings kan åbnes

---

## Troubleshooting

### Problem: Plugin vises ikke i admin

**Løsning:**
- Tjek at plugin er installeret: `npm list @wecre8websites/strapi-page-builder`
- Restart Strapi server
- Tjek browser console for errors
- Tjek Strapi server logs

### Problem: API Key ikke accepteret

**Løsning:**
- Verificér API key er korrekt kopieret (ingen spaces)
- Tjek at API key er aktiv i Page Builder dashboard
- Tjek at API key matcher environment variable navn

### Problem: Node.js version fejl

**Løsning:**
- Brug nvm til at skifte til Node.js 22
- Eller brug Docker med Node.js 22 image
- Se "Løsningsmuligheder" sektion ovenfor

---

## Næste Skridt

Når plugin er installeret og konfigureret:

1. **Phase 4.4:** Integrér Page Builder i storefront
2. **Phase 4.5:** Opret homepage content type med Page Builder
3. **Phase 4.6:** Dokumentation

---

## Referencer

- **Strapi Page Builder Docs:** https://pagebuilder.wc8.io/docs
- **Strapi Page Builder GitHub:** https://github.com/wecre8websites/strapi-page-builder
- **Strapi Plugins Docs:** https://docs.strapi.io/dev-docs/plugins

---

**Sidst opdateret:** 20. november 2025  
**Status:** ⚠️ Blokeret af Node.js version konflikt


