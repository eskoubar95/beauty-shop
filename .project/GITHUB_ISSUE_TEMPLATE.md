# Strapi v5.31.1: i18n Localization Updates All Locales Instead of Single Locale

## 🐛 Bug Description

When editing a localized content entry via Content Manager, changes to top-level fields (`title`, `body`) and Dynamic Zone components are propagated to **ALL locales**, not just the one being edited.

**Only `slug` field correctly maintains independence per locale.**

## 🔍 Environment

- **Strapi Version**: 5.31.1
- **Node Version**: v24.10.0
- **Database**: PostgreSQL 16
- **i18n**: Built-in (v5 core)

## 📋 Steps to Reproduce

1. Create a Collection Type with i18n enabled:
   ```json
   {
     "pluginOptions": {
       "i18n": {
         "localized": true
       }
     }
   }
   ```

2. Create an entry in locale `da-DK`:
   - `slug`: "test-da"
   - `title`: "Danish Title"
   - Add Dynamic Zone component with `title`: "Danish Component"

3. Create localization for `en` (manually, NOT using "Fill in"):
   - `slug`: "test-en" ✅ (correctly separate)
   - `title`: "English Title"
   - Add Dynamic Zone component with `title`: "English Component"

4. Edit the `da-DK` entry:
   - Change `title` to "Danish Title Updated"
   - Change component `title` to "Danish Component Updated"

5. Save the `da-DK` entry

6. **BUG**: Check the `en` entry:
   - `title` is now "Danish Title Updated" ❌ (should remain "English Title")
   - Component `title` is now "Danish Component Updated" ❌ (should remain "English Component")
   - Only `slug` remains correct: "test-en" ✅

## 🗄️ Database Evidence

```sql
-- After editing da-DK, both locales have same title
SELECT id, locale, slug, title, updated_at 
FROM pages 
WHERE document_id = 'test-document-id';

-- Result:
-- ID 1 (da-DK): slug = "test-da", title = "Danish Title Updated", updated_at = 2025-11-22 17:03:29.792
-- ID 2 (en):    slug = "test-en", title = "Danish Title Updated" ❌, updated_at = 2025-11-22 17:03:29.815
```

**Observation**: Both entries have nearly identical `updated_at` timestamps, indicating simultaneous update.

## 🔧 API Request Analysis

From Content Manager logs:
```
PUT /content-manager/collection-types/api::page.page/{document_id}
```

**Problem**: The PUT request uses `document_id` (which links all localizations) instead of a locale-specific identifier. This causes Strapi to update all localizations under the same `document_id`.

**Expected**: Request should include `locale` parameter or use locale-specific endpoint.

## ✅ Expected Behavior

According to [Strapi i18n documentation](https://docs.strapi.io/cms/features/internationalization#usage):
- "Content can only be managed one locale at the time. It is not possible to edit or publish content for several locales at the same time."
- "Dynamic zones can indeed have different structures... and repeatable components can have different entries and be organized differently as well."

## ❌ Actual Behavior

- ✅ `slug` field: Correctly separate per locale
- ❌ `title` field: Updates all locales
- ❌ `body` field: Updates all locales
- ❌ Dynamic Zone components: Updates all locales
- ❌ Component fields: Updates all locales

## 📊 Impact

**Critical**: This bug makes i18n unusable for content types with:
- Dynamic Zones
- Top-level text fields (except `slug`)
- Component fields

## 🔗 Related

- Strapi Forum: [Dynamic Zones with different locales](https://forum.strapi.io/t/dynamic-zones-with-different-locales/21360)
- GitHub Issue #21850: [i18n field localization settings ignored](https://github.com/strapi/strapi/issues/21850)

## ✅ Confirmation

**Strapi Docs AI Response** (2025-11-22):
> "Your observations don't match how Strapi 5 i18n is documented to behave, so what you're seeing is very likely a real bug rather than intended behavior."

## 📝 Additional Notes

- Tested with manual localization creation (not "Fill in")
- Bug persists regardless of creation method
- Components have separate IDs in database but share content
- Model configuration: Content type has `pluginOptions.i18n.localized: true`

