# Internationalization (i18n) Integration

## Oversigt

Beauty Shop bruger en hybrid i18n-strategi der kombinerer:
- **MedusaJS**: Country codes (dk, se, gb) for regions og commerce
- **Strapi CMS**: Locale codes (da, sv, en) for content management
- **Storefront**: Mapper automatisk mellem country codes og locale codes

## Arkitektur

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Storefront    │         │   Strapi CMS    │         │  MedusaJS Backend│
│                 │         │                 │         │                 │
│ /dk/            │────────▶│ locale=da-DK   │         │ region=dk       │
│ /se/            │────────▶│ locale=sv-SE   │         │ region=se       │
│ /gb/            │────────▶│ locale=en      │         │ region=gb       │
└─────────────────┘         └─────────────────┘         └─────────────────┘
     │                              │                              │
     └──────────────────────────────┴──────────────────────────────┘
                    Mapping: countryCode → locale
```

## Mapping: Country Code → Locale

Storefront mapper automatisk Medusa country codes til Strapi locale codes:

| Country Code | Locale Code | Sprog |
|-------------|-------------|-------|
| `dk` | `da-DK` | Dansk |
| `se` | `sv-SE` | Svensk |
| `gb` | `en` | Engelsk |
| `us` | `en` | Engelsk (fallback) |
| `de` | `de-DE` | Tysk |
| `fr` | `fr-FR` | Fransk |
| `es` | `es-ES` | Spansk |
| `it` | `it-IT` | Italiensk |
| `no` | `no-NO` | Norsk |
| `fi` | `fi-FI` | Finsk |

**Default locale:** `da-DK` (Dansk)

**Note:** Strapi bruger BCP 47 locale format (fx `da-DK`), ikke kun sprogkode (`da`).

## Implementation

### 1. Locale Utility (`src/lib/utils/locale.ts`)

```typescript
import { getLocaleFromCountryCode } from "@lib/utils/locale"

// Map country code to locale
const locale = getLocaleFromCountryCode('dk') // Returns 'da-DK'
```

### 2. CMS Data Fetching

Alle CMS data fetches accepterer nu `locale` parameter:

```typescript
// Homepage
const page = await getHomepage(locale)

// Standard pages
const page = await getPageBySlug('about', locale)
```

### 3. Routes

Routes henter automatisk locale fra `countryCode`:

```typescript
// app/[countryCode]/(main)/page.tsx
const locale = getLocaleFromCountryCode(countryCode)
const page = await getHomepage(locale)
```

## Strapi i18n Setup

### 1. Aktivér i18n i Strapi

Strapi i18n plugin er allerede installeret. For at aktivere det:

1. Gå til **Settings → Internationalization** i Strapi Admin
2. Tilføj locales (da, sv, en, etc.)
3. Aktivér i18n for Content Types:
   - **Page** (Collection Type)
   - **Blog Post** (Collection Type)
   - Andre content types efter behov

### 2. Opret Lokaliserede Indhold

For hver page i Strapi:

1. Opret base version (fx homepage på dansk)
2. Klik **"Create localization"** for at oprette svensk/engelsk version
3. Strapi linker automatisk localizations sammen

### 3. API Requests

Strapi API accepterer `locale` parameter:

```bash
# Dansk version
GET /api/pages?locale=da&filters[slug][$eq]=homepage

# Svensk version
GET /api/pages?locale=sv&filters[slug][$eq]=homepage

# Engelsk version
GET /api/pages?locale=en&filters[slug][$eq]=homepage
```

## Workflow

### For Marketeers

1. **Opret base content** på dansk (default locale)
2. **Opret localizations** for andre sprog via Strapi Admin
3. **Redigér hver localization** separat
4. **Publish** hver localization individuelt

### For Developers

1. **Tilføj nyt land** til `COUNTRY_TO_LOCALE_MAP` i `locale.ts`
2. **Test** at locale mapping virker
3. **Opret content** i Strapi for den nye locale

## Best Practices

### 1. Fallback Strategy

Hvis en locale ikke findes i Strapi:
- Strapi returnerer base locale (da) som fallback
- Storefront viser base content

### 2. SEO

Hver localization har sin egen SEO metadata:
- `metaTitle` (dansk/svensk/engelsk)
- `metaDescription` (dansk/svensk/engelsk)
- `ogImage` (kan være forskellige per locale)

### 3. Content Consistency

- **Slug**: Bør være ens på tværs af locales (fx `homepage`, `about`)
- **Sections**: Samme struktur, forskelligt indhold
- **Media**: Kan være forskellige billeder per locale

## Testing

### Test Locale Mapping

```typescript
import { getLocaleFromCountryCode } from "@lib/utils/locale"

// Test mapping
console.log(getLocaleFromCountryCode('dk')) // 'da-DK'
console.log(getLocaleFromCountryCode('se')) // 'sv-SE'
console.log(getLocaleFromCountryCode('gb')) // 'en'
```

### Test Strapi API

```bash
# Test dansk homepage
curl "http://localhost:1337/api/pages?locale=da-DK&filters[slug][$eq]=homepage"

# Test svensk homepage
curl "http://localhost:1337/api/pages?locale=sv-SE&filters[slug][$eq]=homepage"
```

## ✅ i18n Konfiguration - RESOLVERET

**Status**: ✅ **RESOLVERET** - Dette var en konfigurationsfejl, ikke en Strapi bug.

**Problem**: Når man redigerer en localization, opdateres ALLE localizations.

**Root Cause**: Felter og components manglede `pluginOptions.i18n.localized: true` på field-niveau i schema.json filer.

**Løsning**: Tilføj `pluginOptions.i18n.localized: true` til alle felter og components der skal være localized.

**Se**: 
- `.project/STRAPI_I18N_BUG_REPORT.md` - Detaljeret problem og løsning

### Korrekt Konfiguration

**Content Type Schema** (`src/api/page/content-types/page/schema.json`):
```json
{
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "title": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    }
  }
}
```

**Component Schema** (`src/components/homepage/hero-section.json`):
```json
{
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "title": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    }
  }
}
```

**Vigtigt**: I Strapi v5 skal i18n aktiveres både på content type-niveau OG på field/component-niveau.

## Troubleshooting

### Problem: Content vises på forkert sprog

**Løsning:**
1. Tjek at locale er korrekt i Strapi
2. Tjek at localization er published
3. Tjek at `getLocaleFromCountryCode` returnerer korrekt locale

### Problem: Content mangler for en locale

**Løsning:**
1. Opret localization i Strapi Admin
2. Publiser localization
3. Tjek at `locale` parameter sendes korrekt til Strapi API

### Problem: Fallback virker ikke

**Løsning:**
1. Tjek at base locale (da) findes i Strapi
2. Tjek at base locale er published
3. Tjek Strapi i18n plugin konfiguration

### Problem: Redigering af én localization opdaterer alle locales

**✅ RESOLVERET** - Dette var en konfigurationsfejl.

**Løsning**: Tilføj `pluginOptions.i18n.localized: true` til alle felter og components i schema.json filer.

**Se**: `.project/STRAPI_I18N_BUG_REPORT.md` for detaljeret løsning.

## Næste Skridt

1. ✅ Locale mapping utility
2. ✅ CMS data fetching med locale
3. ✅ Routes opdateret til at bruge locale
4. ✅ i18n konfiguration på field-niveau (RESOLVERET)
5. ⏳ Blog posts i18n (hvis nødvendigt)
6. ⏳ Testing af alle locales

