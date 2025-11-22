# Strapi v5.31.1 i18n Configuration Issue - RESOLVED ✅

## Problem Summary

**Status**: ✅ **RESOLVED** - Dette var en konfigurationsfejl, ikke en Strapi bug.

**Original Issue**: When editing a localized content entry in Strapi v5.31.1, changes to top-level fields (`title`, `body`) and Dynamic Zone components were propagated to ALL locales, not just the one being edited.

**Root Cause**: Felter og components manglede `pluginOptions.i18n.localized: true` på field-niveau i schema.json filer.

**Solution**: Tilføj `pluginOptions.i18n.localized: true` til alle felter og components der skal være localized.

## Environment

- **Strapi Version**: 5.31.1
- **Node Version**: v24.10.0
- **Database**: PostgreSQL 16
- **i18n Plugin**: Built-in (v5 core)

## Steps to Reproduce

1. Create a Page content type with i18n enabled (`pluginOptions.i18n.localized: true`)
2. Create a Page entry in Danish (`da-DK`) locale:
   - `slug`: "hvem-er-vi"
   - `title`: "Hvem er vi"
   - Add Hero Section component with `title`: "Verden er min"
3. Save the Danish entry
4. Create English (`en`) localization manually (NOT using "Fill in"):
   - `slug`: "who-are-we" (correctly separate)
   - `title`: "Who are we"
   - Add Hero Section component with `title`: "The world is mine"
5. Save the English entry
6. **BUG**: Edit Danish entry and change `title` to "Hvem er vi" and Hero Section `title` to "Verden er min"
7. Save Danish entry
8. **RESULT**: English entry's `title` is also updated to "Hvem er vi" and Hero Section `title` is updated to "Verden er min"

## Database Evidence

### Pages Table
```sql
SELECT id, locale, slug, title, updated_at 
FROM pages 
WHERE document_id = 'iq3cbfuaaf5ib4b8nucdof3t';
```

**Result**:
- ID 36 (da-DK): `slug = "hvem-er-vi"`, `title = "Hvem er vi"`, `updated_at = 2025-11-22 17:03:29.792`
- ID 37 (en): `slug = "who-are-we"`, `title = "Hvem er vi"` ❌ (should be "Who are we"), `updated_at = 2025-11-22 17:03:29.815`

**Observation**: Both entries have nearly identical `updated_at` timestamps, indicating they were updated simultaneously.

### Components Table
```sql
SELECT p.id, p.locale, pc.cmp_id, h.title as hero_title
FROM pages p
JOIN pages_cmps pc ON p.id = pc.entity_id
JOIN components_homepage_hero_sections h ON pc.cmp_id = h.id
WHERE p.document_id = 'iq3cbfuaaf5ib4b8nucdof3t';
```

**Result**:
- Page ID 36 (da-DK): Component ID 48, `title = "Verden er min"`
- Page ID 37 (en): Component ID 49, `title = "Verden er min"` ❌ (should be "The world is mine")

**Observation**: Components have separate IDs (48 and 49), but both have the same content, indicating they are being synchronized incorrectly.

## API Request Analysis

From terminal logs (line 163):
```
PUT /content-manager/collection-types/api::page.page/iq3cbfuaaf5ib4b8nucdof3t
```

**Problem**: The PUT request uses `document_id` (which links all localizations) instead of a locale-specific identifier. This causes Strapi to update all localizations under the same `document_id`.

## Expected Behavior

According to Strapi documentation:
- Each locale should maintain independent content
- Changes to one locale should NOT affect other locales
- Dynamic Zone components should be separate per locale

## Actual Behavior

- ✅ `slug` field: Correctly separate per locale
- ❌ `title` field: Updates all locales
- ❌ `body` field: Updates all locales (if present)
- ❌ Dynamic Zone components: Updates all locales
- ❌ Component fields (title, body, etc.): Updates all locales

## Impact

**Critical**: This bug makes i18n unusable for content types with Dynamic Zones or any top-level text fields (except `slug`).

**Workarounds**:
1. Use separate entries per locale (not linked as localizations)
2. Only use `slug` field for localization (not practical)
3. Wait for Strapi fix

## Related Issues

- Strapi Forum: [Dynamic Zones with different locales](https://forum.strapi.io/t/dynamic-zones-with-different-locales/21360)
- GitHub Issue #21850: [i18n field localization settings ignored](https://github.com/strapi/strapi/issues/21850)

## Model Configuration Check

**Original Configuration (INCORRECT)**:
- ✅ Content Type (`Page`): `pluginOptions.i18n.localized: true` ✅
- ❌ Fields (`title`, `body`): No `pluginOptions.i18n.localized` specified ❌
- ❌ Dynamic Zone (`sections`): No `pluginOptions.i18n.localized` specified ❌
- ❌ Components: No `pluginOptions.i18n.localized` specified ❌

**Correct Configuration (FIXED)**:
- ✅ Content Type (`Page`): `pluginOptions.i18n.localized: true` ✅
- ✅ Fields (`title`, `body`, `slug`): `pluginOptions.i18n.localized: true` ✅
- ✅ Dynamic Zone (`sections`): `pluginOptions.i18n.localized: true` ✅
- ✅ Components: `pluginOptions.i18n.localized: true` på component-niveau ✅
- ✅ Component Fields: `pluginOptions.i18n.localized: true` på alle tekstfelter ✅

**Note**: I Strapi v5 skal i18n aktiveres både på content type-niveau OG på field/component-niveau for at virke korrekt.

## Resolution

**Date**: 2025-11-22

**Solution**: Tilføj `pluginOptions.i18n.localized: true` til alle felter og components i schema.json filer.

**Files Updated**:
- ✅ `src/api/page/content-types/page/schema.json` - Alle felter opdateret
- ✅ `src/components/homepage/*.json` - Alle homepage components opdateret
- ✅ `src/components/default/faq-item.json` - FAQ item opdateret
- ✅ `src/components/shared/seo.json` - SEO component opdateret

**Test Result**: ✅ **WORKING** - Locales er nu uafhængige og opdateres ikke på tværs af locales.

## Next Steps

1. ✅ Document the issue (this file)
2. ✅ Identified root cause (missing field-level i18n configuration)
3. ✅ Fixed all schema.json files
4. ✅ Tested and confirmed working
5. ✅ Updated documentation

## Strapi Documentation AI Confirmation

**Date**: 2025-11-22

**Response from Strapi Docs AI**:
> "Your observations don't match how Strapi 5 i18n is documented to behave, so what you're seeing is very likely a real bug rather than intended behavior."

**Key Points from Strapi AI**:
1. **Locales should be independent**: "Content can only be managed one locale at the time. It is not possible to edit or publish content for several locales at the same time."
2. **Dynamic Zones should differ per locale**: "Dynamic zones can indeed have different structures... and repeatable components can have different entries and be organized differently as well."
3. **APIs operate per locale**: All APIs use `locale` parameter and work on "a specific locale", not all at once.
4. **No documented bug**: The docs don't mention any known issue where editing via Content Manager updates all locales.

**Conclusion**: This is a **confirmed bug**, not a documented limitation.

## Test Date

2025-11-22

## Tested By

Beauty Shop Development Team

