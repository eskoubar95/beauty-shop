# Implement Strapi CMS for Marketing Content, Bundles and Blog – Implementation Plan

## Overview
Denne plan beskriver, hvordan vi introducerer Strapi v5 som separat CMS-service til marketing-sider, rige bundle/produkt-sider og en simpel blog, og integrerer det med den eksisterende Next.js 15-storefront og Medusa-backend. Målet er at fjerne afhængigheden af Payload (CORE-26), give marketing mulighed for at ændre indhold uden deploys og samtidig holde commerce-data (pris/stock) i Medusa.

## Linear Issue
**Issue:** CORE-27  
**Status:** Backlog  
**Priority:** Medium (implicit ud fra scope/labels)  
**Assignee:** TBA  
**Sprint:** TBA

## Current State Analysis
- Storefront (`beauty-shop-storefront`) kører Next.js 15 (App Router) med Medusa som commerce-backend via `@medusajs/js-sdk` (se `src/lib/config.ts`).
- Forsidens indhold (hero, brand-logos, step-cards, storytelling, FAQ, footer-tekst m.m.) er hardcodet som mock data i `src/lib/data/homepage-content.ts` med TODO-kommentar om fremtidig CMS-integration.
- Hero-komponenten og øvrige forsidedelkomponenter forventer stærkt typed data (f.eks. `HeroContent` og `HomepageContent` i `src/lib/types/homepage.ts`) og er bygget med Tailwind + shadcn UI.
- Footer bruger også `homepageContent.footer` direkte (`src/modules/layout/templates/footer/index.tsx`), så der er flere centrale steder afhængige af den samme mock-struktur.
- Produktdetaljesiderne (`src/modules/products/templates/index.tsx` + `product-info`, `product-tabs` m.m.) læser i dag ren Medusa-produktdata (titel, description, collection, billeder osv.). Der er ingen nuværende kobling til et CMS for marketingindhold.
- Der findes endnu ingen blog- eller artikelruter i storefront (ingen `blog`-relaterede pages/templates fundet i `src/app/(storefront)` eller `src/modules`).
- `.project/03-Tech_Stack.md` beskriver Next.js + Medusa + (tidligere) Payload som anbefalet stack, og `.project/analysis/payload-*.md` dokumenterer problemerne med Payload v3 + Next 15, som blokerer CORE-26.
- Der er ingen eksisterende CMS-klient i `src/lib/data` – alle data-kald er rettet mod Medusa-backend eller interne hjælper-funktioner.

### Key Discoveries:
- Forsiden er allerede modulært opbygget og centraliseret i `homepageContent`, hvilket gør den til et oplagt første mål for CMS-integration frem for at ændre alle komponenter enkeltvis.
- Produktdetaljesiderne har en klar opdeling mellem informations-/copy-del (`ProductInfo`, `ProductTabs`) og commerce-del (`ProductActions`, `RelatedProducts`), hvilket gør det relativt ligetil at supplere Medusa-data med ekstra marketingindhold fra Strapi.
- Der er ingen eksisterende blog, så vi har frihed til at designe en simpel, SEO-venlig blog-IA uden migration af legacy-indhold.
- Arkitekturen er allerede designet til separat services (Medusa på Railway, storefront på Vercel), så en ekstra Strapi-service med egen Postgres passer naturligt ind.

## Desired End State
Når planen er gennemført:
- Strapi v5 kører som en separat service (`beauty-shop-cms`) med egen PostgreSQL-database (lokalt via Docker, i produktion via Railway Postgres).
- Strapi indeholder content types:
  - `page` til statiske/marketing-sider (fx About).
  - `bundlePage` (eller `productPage`) til rige bundle/kit-sider, med reference til Medusa-produkt (id/handle) samt hero, sektioner, FAQ, social proof og SEO.
  - `blogPost` til simple blogindlæg for SEO og guides.
  - `seo`-component til meta-title, meta-description og OG-billeder.
- Storefront har et lille CMS-datalag (`src/lib/data/cms/*`) der via Strapi REST API eksponerer typed helper-funktioner: `getPageBySlug`, `getBundlePageBySlug`, `listBlogPosts`, `getBlogPostBySlug`.
- Forside-hero og mindst én central sektion (fx “Hudpleje gjort simpelt” eller storytelling/FAQ) hentes fra Strapi i stedet for mock data.
- About-siden i storefront læser sit indhold fra Strapi (`page`-type med slug `about` eller tilsvarende).
- Min. én udvalgt bundle/kit-side (fx Essentials/Premium) kombinerer marketingtekst, hero og evt. FAQ/social proof fra Strapi med pris/stock fra Medusa (som i dag).
- En enkel blog er implementeret i storefront (index + detail), drevet 100 % af Strapi `blogPost`-data.
- Der findes kort, praktisk dokumentation i `.project` for:
  - Hvordan man starter Strapi lokalt (inkl. Postgres via Docker).
  - Content-modellen.
  - Editor-flow for marketing (hvordan man ændrer hero, About, bundle-tekst og skriver blogindlæg).
- CORE-26 er opdateret i Linear til at afspejle, at Payload-vejen er blokeret, og at CORE-27 er den nye CMS-implementeringsvej.

## What We're NOT Doing
- ❌ NOT doing: Implementere tovejssync mellem Medusa og Strapi eller bruge Strapi som primær produktkilde – Medusa forbliver single source of truth for commerce (pris, lager, varianter).  
- ❌ NOT doing: Introducere Strapi GraphQL API eller komplekse custom plugins – vi bruger Strapi REST API + simple Content Types i første omgang.  
- ❌ NOT doing: Fuldt editorielt workflow (draft reviews, rollbacks, avancerede workflows) eller omfattende A/B test-opsætning – vi forbereder blot content model til evt. senere flags.  
- ❌ NOT doing: Flytte eksisterende hardcodet indhold 1:1 til Strapi for alle sider – vi fokuserer på de sider, der er eksplicit nævnt i CORE-27 (forside, About, mindst én bundle-side, blog).  
- ❌ NOT doing: Bryde eksisterende Medusa/checkout- eller account-flows – integrationen skal være additive og ikke risikere core checkout.

## Implementation Approach
Vi følger en service-orienteret tilgang, hvor Strapi etableres som et separat CMS-lag med egen database og deploy pipeline. Vi starter med fundamentet (Strapi + DB), definerer content model og permissions, bygger et lille typed datalag i storefront og integrerer derefter trinvis på de prioriterede sider (forside, About, bundle, blog). Hver fase afsluttes med konkrete automatiske og manuelle verifikationspunkter, og vi bevarer mulighed for at slå tilbage til nuværende mock-data (især for forsiden) under udvikling, så rollout kan ske gradvist.

---

## Phase 1: Strapi Service & Database Setup

### Overview
Etabler Strapi v5-projektet `beauty-shop-cms` med egen PostgreSQL-database, kørsel lokalt og forberedelse til Railway-deploy. Denne fase skaber det tekniske fundament uden at røre storefronten.

### Changes Required:

#### 1. Opret Strapi v5-projekt
**Sted:** Ny mappe `beauty-shop-cms/` i repo-roden (sammenstil med `beauty-shop/` og `beauty-shop-storefront/`).  
**Changes:**  
- Initialiser Strapi v5 med TypeScript support i `beauty-shop-cms/` mappen.
- Konfigurér basis-struktur til at matche Beauty Shop-konventioner (env-håndtering, scripts m.m.).

```bash
# Fra repo-roden
npx create-strapi-app@latest beauty-shop-cms \
  --template typescript \
  --no-run
```

**Rationale:** Vi har brug for en dedikeret CMS-service med moderne Strapi v5-funktionalitet og klar separation fra Medusa og storefront. Placering i repo-roden giver klar struktur og nem adgang til alle services i samme workspace.

#### 2. Konfigurér Postgres-database (lokalt)
**Sted:** Lokal Docker + Strapi `.env`.  
**Changes:**  
- Opret lokal Postgres-container med dedikeret DB, bruger og stærk adgangskode.
- Konfigurér Strapi til at bruge denne database via environment variables.

```bash
docker run --name beauty-shop-strapi-db \
  -e POSTGRES_DB=strapi \
  -e POSTGRES_USER=strapi \
  -e POSTGRES_PASSWORD=CHANGE_ME_STRONG \
  -p 5433:5432 \
  -d postgres:16
```

```env
# beauty-shop-cms/.env (eksempel)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=CHANGE_ME_STRONG
NODE_ENV=development
```

**Rationale:** Kravet specificerer separat Postgres-DB (isoleret fra Medusa/Supabase). Docker gør det nemt at køre lokalt med minimale sideeffekter.

#### 3. Grundlæggende Strapi-konfiguration
**File:** `beauty-shop-cms/config/server.ts`, `beauty-shop-cms/config/admin.ts` m.fl.  
**Changes:**  
- Sørg for at Strapi kører på `http://localhost:1337` med admin på `/admin`.  
- Konfigurér CORS og `url` til senere prod-domæne (Railway) uden at låse hårdt fast.  
- Opret basis admin-bruger lokalt (manuel via Strapi-UI).

```ts
// beauty-shop-cms/config/server.ts (skitse)
export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("PUBLIC_STRAPI_URL", "http://localhost:1337"),
  app: {
    keys: env.array("APP_KEYS"),
  },
});
```

**Rationale:** Klare og konsistente URLs er nødvendige for at kunne kalde Strapi fra Next.js-storefronten.

#### 4. Forbered Railway-deployment
**Sted:** `.project/RAILWAY_SETUP_GUIDE.md` + evt. ny sektion eller kort doc under `beauty-shop-cms/`.  
**Changes:**  
- Notér overordnet plan for Railway-service `beauty-shop-strapi` med egen Postgres-plugin.  
- Beskriv nødvendige miljøvariabler (DB, APP_KEYS, ADMIN_JWT_SECRET osv.) og hvordan de sættes i Railway.

**Rationale:** Selv om selve deploy kan ligge i en separat ticket, er det vigtigt at arkitekturen er tænkt igennem fra start, så vi undgår senere rework.

### Success Criteria:

#### Automated Verification:
- [ ] Strapi starter lokalt uden errors: `npm run develop` eller tilsvarende i `beauty-shop-cms`.  
- [ ] Typescript build i Strapi-projektet lykkes (hvis relevant): `npm run build`.  
- [ ] Ingen linter-/typefejl i eventuelle tilføjede config-filer (Strapi/TS).

#### Manual Verification:
- [ ] Strapi admin er tilgængelig på `http://localhost:1337/admin` og kan logges ind med oprettet admin-bruger.  
- [ ] Database er forbundet (ingen runtime-fejl om manglende migrations/DB).  
- [ ] Nye content types kan oprettes via admin uden DB-fejl.

**⚠️ PAUSE HERE** – Færdiggør Strapi + DB-setup før der arbejdes videre med content model og Next-integration.

---

## Phase 2: Content Model & Permissions in Strapi

### Overview
Definér de nødvendige content types og komponenter i Strapi (page, bundlePage, blogPost, seo) og sørg for, at data kan læses sikkert fra storefront (læseadgang for public API eller via API token).

### Changes Required:

#### 1. Opret `seo` component
**Sted:** Strapi admin → Content-Type Builder.  
**Changes:**  
- Component `seo`:  
  - `metaTitle` (string)  
  - `metaDescription` (text)  
  - `ogImage` (media – single).  

**Rationale:** Genbruges på tværs af pages, bundlePages og blogPosts og matcher acceptance criteria om basis-SEO.

#### 2. Opret `page` content type
**Sted:** Strapi admin.  
**Changes:**  
- Content Type `page` (collection type) med felter:  
  - `slug` (UID, unik).  
  - `title` (string).  
  - `body` (rich text eller dynamic zone/blocks – start simpelt med rich text).  
  - `seo` (component).  
- Opret min. én record for About-siden (slug `about`) og evt. generiske marketing-sider (kan udvides senere).

**Rationale:** Dækker statiske marketing-sider som About og potentielt andre enkle sider.

#### 3. Opret `bundlePage` (eller `productPage`) content type
**Sted:** Strapi admin.  
**Changes:**  
- Content Type `bundlePage`:  
  - `slug` (UID) – til URL i storefront.  
  - `medusaProductId` (string) eller `medusaProductHandle` (string) – reference til Medusa-produkt.  
  - `heroTitle`, `heroSubtitle`, `heroImage` (media).  
  - `sections` (repeatable component eller JSON/dynamic zone) til indholdskasser/USPs.  
  - `faqItems` (repeatable component med `question`, `answer`).  
  - `socialProof` (fx ratings/testimonials, kan starte simpelt).  
  - `seo` (component).  
- Opret mindst én bundle-side (fx Essentials) med realistisk indhold, så integration kan testes.

**Rationale:** Giver marketing fleksibilitet til at skrive rig copy omkring kits, mens Medusa stadig styrer pris/stock.

#### 4. Opret `blogPost` content type
**Sted:** Strapi admin.  
**Changes:**  
- Content Type `blogPost`:  
  - `title` (string).  
  - `slug` (UID, unik).  
  - `excerpt` (text).  
  - `body` (rich text eller blocks).  
  - `coverImage` (media).  
  - `tags` (repeatable string eller separat relation).  
  - `publishedAt` (datetime).  
  - `seo` (component).  
- Opret min. én publiceret blogPost til senere brug på index/detail.

**Rationale:** Leverer SEO/guide-content uden at kræve kompleks editoriel platform.

#### 5. Konfigurér Public API-permissions & evt. tokens
**Sted:** Strapi admin → Settings → Roles & Permissions.  
**Changes:**  
- For `public` role: Tillad read-adgang (find/findOne) for `page`, `bundlePage`, `blogPost` (evt. kun published).  
- Alternativt: Opret API token med læserettigheder og planlæg at bruge token-baseret auth fra storefront (bedre kontrol i prod).

**Rationale:** Storefront skal kunne kalde Strapi sikkert. For MVP kan public read være acceptabelt, men på sigt er token anbefalet.

#### 6. Dokumentér content model
**File:** `.project/06-Backend_Guide.md` (ny sektion) eller separat doc (fx `.project/cms-strapi-content-model.md`).  
**Changes:**  
- Beskriv kort de 3 content types, `seo`-component og deres vigtigste felter.  
- Notér relationen til Medusa (fx `bundlePage.medusaProductId`).

**Rationale:** Gør det nemt for både udviklere og editors at forstå strukturen og undgå misbrug af felter.

### Success Criteria:

#### Automated Verification:
- [ ] Strapi build (`npm run build` i `beauty-shop-cms`) kører uden fejl efter content type-changes.  
- [ ] API-endpoints er tilgængelige: Test med `curl http://localhost:1337/api/pages` og `curl http://localhost:1337/api/blog-posts` (eller tilsvarende endpoints) – skal returnere JSON uden fejl.

#### Manual Verification:
- [ ] `page`, `bundlePage`, `blogPost` og `seo` er oprettet og synlige i Strapi admin.  
- [ ] Min. én `page` (About), én `bundlePage` og én `blogPost` kan oprettes og gemmes uden fejl.  
- [ ] Offentlige GET-kald mod Strapi REST API returnerer forventet JSON for disse typer (test via browser/Postman/curl eller automatisk test-kommando ovenfor).  

**⚠️ PAUSE HERE** – Bekræft at content model er stabil og API’et fungerer, før Next.js-integration startes.

---

## Phase 3: Storefront CMS Client Layer (Strapi REST)

### Overview
Tilføj et lille, typed CMS-datalag i `beauty-shop-storefront`, der kapsler Strapi REST-kald og præsenterer dem som genbrugelige helper-funktioner til sider og komponenter.

### Changes Required:

#### 1. Opret CMS-klient utils
**File:** `beauty-shop-storefront/src/lib/data/cms/strapi-client.ts` (ny).  
**Changes:**  
- Implementér en generel fetch-helper, der læser base-URL og evt. token fra env, håndterer fejl og kan bruges på server components.

```ts
// src/lib/data/cms/strapi-client.ts
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // optional

async function fetchFromStrapi<T>(path: string, init?: RequestInit): Promise<T> {
  const url = new URL(path, STRAPI_URL).toString();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    (headers as any).Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
    // Evt. caching-strategi kan tilføjes senere (Next.js cache/ISR)
  });

  if (!res.ok) {
    // Capture error with Sentry (without PII)
    if (typeof window === "undefined") {
      // Server-side: use Sentry server SDK
      const { captureException } = await import("@sentry/nextjs");
      captureException(new Error(`Strapi request failed for ${path} (${res.status})`), {
        tags: { component: "strapi-client" },
        extra: { path, status: res.status },
      });
    }
    throw new Error(`Strapi request failed for ${path} (${res.status})`);
  }

  return (await res.json()) as T;
}

export { fetchFromStrapi };
```

**Rationale:** Centraliserer Strapi-kald og gør det nemt at skifte mellem public read og token-baseret auth.

#### 2. Definér CMS-typer for pages/bundles/blog
**File:** `beauty-shop-storefront/src/lib/types/cms.ts` (ny) eller udvid `homepage.ts` hvis det giver mening.  
**Changes:**  
- Opret TS-interfaces, der matcher Strapi’s JSON-struktur (f.eks. Strapi v4/v5 standard med `data`, `attributes`).  
- Tilpas dem til vores brug (projektion mod enklere domænemodeller).

```ts
// src/lib/types/cms.ts (skitse)
export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiListResponse<T> {
  data: StrapiEntity<T>[];
}

export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T> | null;
}

export interface PageAttributes {
  slug: string;
  title: string;
  body: string;
  // seo: ...
}

// Tilsvarende for BundlePageAttributes, BlogPostAttributes m.m.
```

**Rationale:** Matching mod Strapi’s output giver stærk typesikkerhed og minimerer runtime-overraskelser.

#### 3. Implementér helper-funktioner
**File:** `beauty-shop-storefront/src/lib/data/cms/pages.ts`, `bundle-pages.ts`, `blog.ts` (nye).  
**Changes:**  
- `getPageBySlug(slug: string)` → henter `page` fra Strapi og mapper til domænemodel.  
- `getBundlePageBySlug(slug: string)` → henter `bundlePage` og inkluderer relevante felter til UI.  
- `listBlogPosts()` og `getBlogPostBySlug(slug: string)` → leverer blog-data til index/detail.

```ts
// src/lib/data/cms/pages.ts
import { fetchFromStrapi } from "./strapi-client";
import type { PageAttributes, StrapiSingleResponse } from "@lib/types/cms";

export async function getPageBySlug(slug: string) {
  const res = await fetchFromStrapi<StrapiSingleResponse<PageAttributes>>(
    `/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo`
  );

  if (!res.data) return null;

  return {
    slug: res.data.attributes.slug,
    title: res.data.attributes.title,
    body: res.data.attributes.body,
    seo: res.data.attributes.seo,
  };
}
```

**Rationale:** Samler CMS-adgang ét sted, så sider/komponenter blot bruger simple helpers.

#### 4. Miljøvariabler til Strapi
**File:** `beauty-shop-storefront/.env.local` (lokalt), `next.config.js`, `.project/GETTING_STARTED.md`.  
**Changes:**  
- Introducér `NEXT_PUBLIC_STRAPI_URL` og evt. `STRAPI_API_TOKEN`.  
- Dokumentér hvordan de sættes lokalt og i Vercel.  

**Rationale:** Følger eksisterende praksis for Medusa (`MEDUSA_BACKEND_URL`, publishable key), og holder secrets ude af repo.

### Success Criteria:

#### Automated Verification:
- [ ] `npm run lint` og `npm run type-check` i `beauty-shop-storefront` passerer efter tilføjelse af CMS-typer/clients.  
- [ ] `npm run build` for storefront lykkes (ingen import-cyklusser eller TS-fejl).
- [ ] Sentry error capture fungerer: Simulér Strapi-fejl (fx forkert URL) og verificér at fejl logges til Sentry uden PII (test i dev-miljø med Sentry DSN sat).

#### Manual Verification:
- [ ] Lokale test-kald mod CMS-helpers (via midlertidig route eller debugger) returnerer forventet data for kendte `page`/`bundlePage`/`blogPost`.  
- [ ] Fejl i Strapi (f.eks. 500/404) håndteres med meningsfulde fejl uden at lække PII eller secrets.
- [ ] Sentry fejl-capture verificeret: Tjek Sentry dashboard for loggede fejl ved Strapi-nedetid (uden PII i logs).

**⚠️ PAUSE HERE** – Bekræft at CMS-datalaget er stabilt før du kobler det på kritiske sider.

---

## Phase 4: Page Integrations, Blog & Documentation

### Overview
Brug CMS-datalaget til at erstatte dele af den hardcodede homepage-content, implementér About-side og første bundle-side med Strapi-indhold, opret en simpel blog, og opdatér dokumentation + Linear-status.

### Changes Required:

#### 1. Integrér Strapi i forsiden (hero + mindst én sektion)
**File:**  
- `beauty-shop-storefront/src/lib/data/homepage-content.ts`  
- Forside-template i `src/app/(storefront)/[countryCode]/(main)/page.tsx` (eller tilsvarende).  
**Changes:**  
- Tilføj en server-side loader, der henter `homepage`-indhold fra Strapi (`page` eller dedikeret type).  
- Behold eksisterende `homepageContent` som fallback (f.eks. hvis Strapi ikke svarer i dev).  
- Map Strapi-felter til `HomepageContent`-strukturen og brug dem i hero + udvalgt sektion (fx `whySection` eller `storytelling`).

```ts
// Skitse: src/app/(storefront)/[countryCode]/(main)/page.tsx
import { homepageContent as fallbackHomepageContent } from "@lib/data/homepage-content";
import { getPageBySlug } from "@lib/data/cms/pages";

export default async function HomePage({ params: { countryCode } }) {
  let content = fallbackHomepageContent;

  try {
    const cmsPage = await getPageBySlug("homepage");
    if (cmsPage) {
      // map cmsPage.body/sections → HomepageContent (kan gøres iterativt)
      content = {
        ...content,
        hero: {
          ...content.hero,
          title: cmsPage.title,
          // ...
        },
      };
    }
  } catch (error) {
    // Capture error with Sentry (server-side, no PII)
    const { captureException } = await import("@sentry/nextjs");
    captureException(error, {
      tags: { component: "homepage-cms-integration" },
      extra: { fallbackUsed: true },
    });
  }

  return <Home content={content} countryCode={countryCode} />;
}
```

**Rationale:** Minimerer risiko ved at bevare fallback, mens vi gradvist flytter indhold til Strapi.

#### 2. About-side fra Strapi
**File:** About-route i `src/app/(storefront)/[countryCode]/(main)/...` (ny, fx `about/page.tsx`) + evt. ny modul-template.  
**Changes:**  
- Opret en enkel About-page, der bruger `getPageBySlug("about")`.  
- Render titel/body og SEO (title/meta/OG) via Next metadata API.

**Rationale:** Opfylder acceptance criterion om at About skal drives af Strapi og giver marketing et konkret sted at eksperimentere.

#### 3. Bundle/kit-side med kombineret Strapi + Medusa
**File:**  
- Produkt-/bundle-template i `src/app/(storefront)/[countryCode]/(main)/products/[handle]/page.tsx` (eller tilsvarende).  
- Evt. ny modul-komponent til marketing-sektion.  
**Changes:**  
- Ved rendering af det udvalgte kit (fx `essentials`), slå op i Strapi `bundlePage` via slug eller Medusa-handle (`medusaProductHandle`).  
- Indsæt ekstra hero/USPs/FAQ-sektioner under eller omkring eksisterende Medusa-baseret produktinfo.  

**Rationale:** Viser konkret, hvordan marketingcopy kan styres via CMS uden at påvirke commerce-logik.

#### 4. Simpel blog (index + detail)
**File:**  
- `src/app/(storefront)/[countryCode]/(main)/blog/page.tsx` (index).  
- `src/app/(storefront)/[countryCode]/(main)/blog/[slug]/page.tsx` (detail).  
**Changes:**  
- Blog-index: brug `listBlogPosts()` til at vise liste med titel, excerpt, publish date og link til detail.  
- Blog-detail: brug `getBlogPostBySlug(slug)` til at render titel, coverImage og body (evt. som rich text komponent).  
- Tilføj simpel navigation til blog fra footer eller nav.

**Rationale:** Opfylder acceptance criteria omkring blog og understøtter SEO/guides.

#### 5. Dokumentation & arkitektur-opdateringer
**File:**  
- `.project/03-Tech_Stack.md`  
- `.project/08-Architecture.md`  
- `.project/GETTING_STARTED.md`  
**Changes:**  
- Tech Stack: Opdatér sektion, der omtaler Payload CMS, til at beskrive Strapi (hvorfor valgt, hvordan integreret, links til Strapi/Medusa-artikler).  
- Architecture: Tilføj Strapi som separat service med egen Postgres og Railway deploy; fjern planlagt `payload`-schema.  
- Getting Started: Tilføj “How to run Strapi locally” med Docker-kommando, env-opsætning og hvordan man logger ind som admin.

**Rationale:** Holder dokumentation i sync med den faktiske arkitektur og hjælper nye devs/editors hurtigt i gang.

#### 6. Opdatér CORE-26 i Linear
**Sted:** Linear UI (manuelt) eller via MCP-kommando.  
**Changes:**  
- Tilføj kommentar til CORE-26 der beskriver, at Payload-approachen er blokeret og at CORE-27 nu er den primære CMS-implementeringsvej.  
- Justér status (fx til “Cancelled”/“Blocked”) alt efter workflow.

**Rationale:** Sikrer historik og tydelig kommunikation om strategisk skift fra Payload til Strapi.

### Success Criteria:

#### Automated Verification:
- [ ] `npm run lint`, `npm run type-check` og `npm run build` for `beauty-shop-storefront` passerer med de nye sider og CMS-integration.  
- [ ] Eventuelle nye tests (unit/integration) for CMS-helpers og sider passerer: `npm run test`.  

#### Manual Verification:
- [ ] Strapi-hero + mindst én sektion vises korrekt på forsiden (og ændringer i Strapi slår igennem uden deploy).  
- [ ] About-side viser indhold fra Strapi og loader uden fejl for relevante locale/country-codes.  
- [ ] Den udvalgte bundle/kit-side viser både Medusa-priser/stock og supplerende marketing-indhold fra Strapi.  
- [ ] Blog-index viser mindst ét blogindlæg; klik på indlæg åbner detail-side med korrekt indhold.  
- [ ] **Performance:** Forsiden loader < 2 sekunder (målt via Lighthouse eller browser DevTools Network tab) selv med CMS-kald.  
- [ ] **Accessibility:** 
  - [ ] CMS-drevet indhold (hero, About, blog) bruger semantisk korrekt HTML (h1-h6, p, ul/ol).  
  - [ ] Keyboard navigation fungerer (Tab gennem alle links/knapper på blog og About).  
  - [ ] Alt-tekster for CMS-billeder er meningsfulde (test med screen reader eller tjek alt-attributter).  
  - [ ] Lighthouse accessibility score ≥ 90 på forsiden og blog-detail.  
- [ ] Ingen regressions i eksisterende produkt-/checkout-flows (hurtig smoke-test af vigtigste flows).  
- [ ] Dokumentation i `.project` er opdateret og gennemlæst (ingen åbenlyse forældede referencer til Payload som aktiv løsning).  
- [ ] CORE-26 i Linear er opdateret med kommentar/status som beskrevet.

**⚠️ PAUSE HERE** – Før produktionsdeploy skal ovenstående manuelle og automatiske checks være grønne.

---

## Testing Strategy

### Unit Tests:
- Tilføj tests for Strapi CMS-helper-funktioner (`getPageBySlug`, `getBundlePageBySlug`, `listBlogPosts`, `getBlogPostBySlug`) med mocket fetch/Strapi-respons.  
- Test mapping fra Strapi JSON til vores domænemodeller (især håndtering af manglende `data` eller tomme felter).  
- Test eventuelle nye små præsentationskomponenter, der bruger CMS-indhold (fx simple formattering af blog-uddrag).

### Integration Tests:
- E2E-lignende tests for:
  - Forsiden loader med CMS-indhold tilgængeligt (evt. via Playwright eller lignende senere).  
  - About-side loader og viser Strapi-indhold.  
  - Blog-index og -detail fungerer end-to-end med Strapi-kald.  
- Simulér Strapi-nedetid eller 500-fejl og bekræft, at fallback (fx mock `homepageContent`) håndteres korrekt uden at hele siden fejler.

### Manual Testing Steps:
1. Start Medusa-backend, Strapi CMS og storefront lokalt.  
2. Log ind i Strapi-admin og redigér forside-hero-tekst; opdater browseren på forsiden og bekræft, at ændringen er synlig uden deploy.  
3. Redigér About-indhold i Strapi og bekræft opdateringer i storefront.  
4. Redigér marketing-tekster/FAQ på den udvalgte bundle-side og bekræft korrekt visning i kombination med Medusa-priser.  
5. Opret et nyt blogindlæg i Strapi og bekræft, at det dukker op på blog-index og kan åbnes i detail.  
6. Test vigtige commerce-flows (produktvisning, læg i kurv, checkout) for at sikre, at CMS-tilføjelser ikke har introduceret regressions.  
7. Test på mobil og desktop for layout-issues omkring hero/blog-sektioner.

### Accessibility Testing:
- [ ] Kontroller at CMS-drevet indhold (hero-tekst, About-tekst, blog-body) stadig præsenteres i semantisk korrekte HTML-tags (overskrifter, afsnit, lister).  
- [ ] Bekræft at fokus-stier og keyboard-navigation fortsat fungerer (især hvis nye links/knapper til blog er tilføjet).  
- [ ] Tjek alt-tekster for CMS-billeder (hero/coverImages) og sikre, at de er meningsfulde.  
- [ ] Kør evt. Lighthouse/axe-scan på forsiden og blog-detail.

## Performance Considerations
- Strapi-kald skal caches fornuftigt (Next.js caching/ISR eller tag-baseret revalidation) for at undgå unødigt latency; i første omgang kan vi starte simpelt og optimere senere.  
- Forsiden må ikke blive markant langsommere pga. CMS – overvej at bruge build-time fetching (static generation) hvor det giver mening, afhængigt af hvor ofte indhold ændres.  
- Hold Strapi-responser small – hent kun nødvendige felter via `populate/fields`-parametre.

## Security Considerations
- Ingen Strapi-secrets eller DB-adgangskoder må tjekkes ind i repo – brug env-vars og Railway/Vercel secret management.  
- Hvis public API bruges, begræns læseadgang til ikke-følsomt indhold (ingen PII).  
- Hvis API-token bruges fra storefront, sørg for at det kun har read-adgang til de nødvendige content types.  
- Valider og sanitizer HTML/rich text output fra Strapi ved rendering (undgå XSS; dog er CMS typisk trusted, men vi bør stadig bruge sikre render-mønstre).

## Migration Notes
- Der er ingen eksisterende CMS-data, der skal migreres – kun hardcodet content i kodebasen.  
- Over tid kan der laves en manuel eller scriptet flytning af udvalgt tekst fra `homepage-content.ts` og andre statiske sektioner til Strapi, men det er ikke et krav for denne issue.  
- Eventuelle fremtidige skift i Strapi content model bør håndteres via planlagte opdateringer med backwards-compat hvor muligt.

## Rollback Plan
1. Hvis Strapi-integration giver kritiske problemer i prod, slå midlertidigt tilbage til at bruge `homepageContent` og andre hardcodede kilder ved at deaktivere Strapi-kald (feature flag eller simpel env-check).  
2. Fjern midlertidigt blog-link i navigation, hvis blog-ruter giver fejl, og log fejl til Sentry for analyse.  
3. Strapi-service på Railway kan sættes på pause eller rulles tilbage til tidligere build uden at påvirke Medusa/checkout.  
4. Behold kode-struktur for CMS-klient, men deaktiver dens brug, indtil fejl er udbedret.

## References
- **Linear Ticket:** [CORE-27 – Implement Strapi CMS for marketing content, bundles and blog](https://linear.app/beauty-shop/issue/CORE-27/implement-strapi-cms-for-marketing-content-bundles-and-blog)  
- **Payload-problem-analyse:** `.project/analysis/payload-*.md`  
- **Eksisterende planer:** `.project/plans/2025-11-06-CORE-23-implement-beauty-shop-frontpage-from-figma-design.md` m.fl.  
- **Tech stack overview:** `.project/03-Tech_Stack.md`  
- **Arkitektur:** `.project/08-Architecture.md`  

## Implementation Notes
- Start med en meget simpel Strapi-content model og udvid først, når integrationen er bevist stabil – det er vigtigere at få den første ende-til-ende-flow (hero/About/bundle/blog) til at fungere end at modellere alle fremtidige behov.  
- Overvej at indføre et simpelt feature-flag (env-baseret) til at styre, om CMS-indhold bruges på forsiden, så du kan rulle funktionsaktivering ud kontrolleret.  
- Rejs en separat issue for den faktiske Railway-deploy af `beauty-shop-cms` og evt. for at introducere GraphQL/avanceret blok-struktur i Strapi, så CORE-27 kan holdes fokuseret og håndterbar.


