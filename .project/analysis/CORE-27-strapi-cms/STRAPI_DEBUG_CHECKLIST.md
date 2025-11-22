# Strapi Debug Checklist

## 1. Tjek Strapi Output ved Start

Når du starter Strapi (`npm run develop`), skal du se:

```
✅ Enabled api::page.page.find for public role
✅ Enabled api::page.page.findOne for public role
✅ Enabled api::bundle-page.bundle-page.find for public role
✅ Enabled api::bundle-page.bundle-page.findOne for public role
✅ Enabled api::blog-post.blog-post.find for public role
✅ Enabled api::blog-post.blog-post.findOne for public role
🌱 Seeding Beauty Shop CMS data...
✅ Created About page
✅ Created Essentials bundle page
✅ Created blog post 1
✅ Created blog post 2
```

**Hvis du IKKE ser dette:**
- Bootstrap scriptet kører ikke
- Seed scriptet kører ikke
- Content types er ikke registreret

## 2. Test Strapi API Direkte

Kør disse kommandoer i terminalen:

```bash
# Test Pages endpoint
curl 'http://localhost:1337/api/pages'

# Test med filter
curl 'http://localhost:1337/api/pages?filters[slug][$eq]=about'

# Test Blog Posts
curl 'http://localhost:1337/api/blog-posts'

# Test Bundle Pages
curl 'http://localhost:1337/api/bundle-pages'
```

**Forventet response:**
- Hvis data findes: `{"data": [...], "meta": {...}}`
- Hvis ingen data: `{"data": [], "meta": {...}}`
- Hvis 404: `{"data": null, "error": {...}}`

## 3. Tjek Strapi Admin Panel

1. Åbn http://localhost:1337/admin
2. Gå til **Content Manager**
3. Tjek om du kan se:
   - **Page** (med "About" entry)
   - **Bundle Page** (med "Essentials" entry)
   - **Blog Post** (med 2 entries)

**Hvis content types ikke findes:**
- Content types er ikke registreret
- Strapi skal genstartes

## 4. Tjek Permissions

1. I Strapi Admin: **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Scroll ned til **Permissions**
3. Tjek om disse er **checked**:
   - ✅ Page → find
   - ✅ Page → findOne
   - ✅ Bundle Page → find
   - ✅ Bundle Page → findOne
   - ✅ Blog Post → find
   - ✅ Blog Post → findOne

**Hvis permissions ikke er sat:**
- Bootstrap scriptet kørte ikke
- Eller permissions blev ikke sat korrekt

## 5. Tjek Strapi Logs

Se output fra Strapi terminalen for:
- Errors ved start
- Warnings om manglende content types
- Bootstrap/seed output

## 6. Verificer Environment Variables

Tjek `beauty-shop-cms/.env`:
```bash
cd beauty-shop-cms
cat .env | grep SEED_DATA
```

Skal være: `SEED_DATA=true`

## 7. Test med Strapi Admin API

Hvis public API ikke virker, test med admin token:

```bash
# Først, få admin token (hvis nødvendigt)
# Eller test direkte i browser: http://localhost:1337/admin

# Test med admin (hvis du har token)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  'http://localhost:1337/api/pages'
```

## Hvad skal du sende mig?

1. **Strapi start output** - Kopier de første 50-100 linjer når Strapi starter
2. **API test results** - Output fra curl kommandoerne ovenfor
3. **Admin panel screenshot** - Viser Content Manager med content types
4. **Permissions screenshot** - Viser Public role permissions
5. **Strapi .env** - (Uden secrets) viser SEED_DATA setting

Dette vil hjælpe mig med at identificere præcist hvor problemet er!

