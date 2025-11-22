# Strapi 404 Troubleshooting

## Problem
Strapi kører, men returnerer 404 for alle API-kald, selvom content types findes.

## Mulige årsager

### 1. Content Types ikke registreret
Strapi skal genstartes efter at have oprettet nye content types via schema filer.

**Løsning:**
```bash
cd beauty-shop-cms
# Stop Strapi (Ctrl+C)
npm run develop
```

Ved start skal du se:
- Content types bliver registreret
- Bootstrap script kører
- Permissions bliver sat
- Seed data bliver oprettet (hvis SEED_DATA=true)

### 2. Permissions ikke sat
Bootstrap scriptet skal køre for at sætte public permissions.

**Tjek:**
1. Åbn http://localhost:1337/admin
2. Gå til Settings → Users & Permissions → Roles → Public
3. Tjek om `find` og `findOne` er enabled for:
   - Page
   - Bundle Page
   - Blog Post

**Hvis ikke sat:**
- Genstart Strapi (bootstrap kører ved start)
- Eller manuelt enable permissions i admin panel

### 3. Content Types ikke fundet
Strapi kan ikke finde content types hvis schema filer er placeret forkert.

**Tjek struktur:**
```
beauty-shop-cms/src/api/
  ├── page/content-types/page/schema.json ✅
  ├── bundle-page/content-types/bundle-page/schema.json ✅
  └── blog-post/content-types/blog-post/schema.json ✅
```

### 4. Database ikke synkroniseret
Hvis Strapi database ikke er opdateret med nye content types.

**Løsning:**
```bash
cd beauty-shop-cms
# Slet .strapi mappe (backup først hvis nødvendigt)
rm -rf .strapi
npm run develop
```

**⚠️ ADVARSEL:** Dette sletter al data i Strapi!

## Test efter fix

1. **Tjek API direkte:**
   ```bash
   curl 'http://localhost:1337/api/pages'
   curl 'http://localhost:1337/api/blog-posts'
   ```

2. **Tjek admin panel:**
   - http://localhost:1337/admin
   - Content Manager → Se om Page, Bundle Page, Blog Post findes

3. **Tjek test route:**
   - http://localhost:8000/dk/test-cms
   - Bør nu vise ✅ i stedet for ⚠️

## Debugging

**Tjek Strapi logs:**
```bash
cd beauty-shop-cms
# Se output når Strapi starter
npm run develop
```

Du bør se:
- `✅ Enabled api::page.page.find for public role`
- `🌱 Seeding Beauty Shop CMS data...`
- `✅ Created About page`

**Hvis du ikke ser dette:**
- Bootstrap scriptet kører ikke
- Seed scriptet kører ikke
- Tjek `.env` for `SEED_DATA=true`

