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
**Sted:** `beauty-shop-cms/src/api/seo/components/seo.json` (programmatisk).  
**Changes:**  
- Component `seo`:  
  - `metaTitle` (string, max 255)  
  - `metaDescription` (text, max 500)  
  - `ogImage` (media – single image).  
- Schema-fil oprettet programmatisk.

**Rationale:** Genbruges på tværs af pages, bundlePages og blogPosts og matcher acceptance criteria om basis-SEO. Programmatisk oprettelse sikrer version control.

#### 2. Opret `page` content type
**Sted:** `beauty-shop-cms/src/api/page/content-types/page/schema.json` (programmatisk).  
**Changes:**  
- Content Type `page` (collection type) med felter:  
  - `slug` (UID, unik).  
  - `title` (string).  
  - `body` (rich text).  
  - `seo` (component).  
- Schema-fil oprettet programmatisk. Opret min. én record i Strapi admin for About-siden (slug `about`) og evt. generiske marketing-sider (kan udvides senere).

**Rationale:** Dækker statiske marketing-sider som About og potentielt andre enkle sider. Programmatisk oprettelse sikrer version control.

#### 3. Opret `bundlePage` (eller `productPage`) content type
**Sted:** `beauty-shop-cms/src/api/bundle-page/content-types/bundle-page/schema.json` (programmatisk).  
**Changes:**  
- Content Type `bundlePage`:  
  - `slug` (UID) – til URL i storefront.  
  - `medusaProductId` (string) eller `medusaProductHandle` (string) – reference til Medusa-produkt.  
  - `heroTitle`, `heroSubtitle`, `heroImage` (media).  
  - `sections` (JSON) til indholdskasser/USPs.  
  - `faqItems` (repeatable component `shared.faq-item` med `question`, `answer`).  
  - `socialProof` (JSON) – ratings/testimonials.  
  - `seo` (component).  
- Schema-fil oprettet programmatisk. Opret mindst én bundle-side i Strapi admin (fx Essentials) med realistisk indhold, så integration kan testes.

**Rationale:** Giver marketing fleksibilitet til at skrive rig copy omkring kits, mens Medusa stadig styrer pris/stock. Programmatisk oprettelse sikrer version control.

#### 4. Opret `blogPost` content type
**Sted:** `beauty-shop-cms/src/api/blog-post/content-types/blog-post/schema.json` (programmatisk).  
**Changes:**  
- Content Type `blogPost`:  
  - `title` (string).  
  - `slug` (UID, unik, auto-generated from title).  
  - `excerpt` (text).  
  - `body` (rich text).  
  - `coverImage` (media).  
  - `tags` (repeatable string).  
  - `publishedAt` (datetime).  
  - `seo` (component).  
- Schema-fil oprettet programmatisk. Opret min. én publiceret blogPost i Strapi admin til senere brug på index/detail.

**Rationale:** Leverer SEO/guide-content uden at kræve kompleks editoriel platform. Programmatisk oprettelse sikrer version control.

#### 5. Konfigurér Public API-permissions & evt. tokens
**Sted:** `beauty-shop-cms/src/bootstrap.ts` (programmatisk) + Strapi admin (verifikation).  
**Changes:**  
- Bootstrap script konfigurerer automatisk read-adgang (find/findOne) for `public` role på `page`, `bundlePage`, `blogPost`.  
- Script kører ved Strapi startup og opretter/opdaterer permissions automatisk.  
- Verificer i Strapi admin → Settings → Roles & Permissions → Public at permissions er korrekte.  
- Alternativt: Opret API token med læserettigheder og planlæg at bruge token-baseret auth fra storefront (bedre kontrol i prod).

**Rationale:** Storefront skal kunne kalde Strapi sikkert. For MVP kan public read være acceptabelt, men på sigt er token anbefalet.

#### 6. Dokumentér content model
**File:** `.project/cms-strapi-content-model.md` (oprettet).  
**Changes:**  
- Beskriv kort de 3 content types, `seo`-component, `faq-item` component og deres vigtigste felter.  
- Notér relationen til Medusa (fx `bundlePage.medusaProductId`).  
- Dokumenter API endpoints og usage eksempler.

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

## Phase 4: Homepage integration med Strapi (pre-built sections)

### Overview
Fokus udelukkende på forsiden: få en ren modulstruktur i storefront, og lad Strapi styre indholdet via en simpel `Page`-model med pre-built sektioner (Hero, Products, FAQ, Storytelling, Final CTA osv.) i en Dynamic Zone – **uden eksterne page builder-plugins**. Målet er at give marketing et intuitivt flow, hvor de kan tilføje/omrokere sektioner og bruge Strapis indbyggede Live Preview, uden ekstra licenser eller forældede plugins.

### Changes Required:

#### 1. Analyse af homepage-struktur (FÆRDIG – dokumenteret)
**Files:**  
- `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx`  
- `beauty-shop-storefront/src/modules/home/`  
- `.project/analysis/CORE-27-strapi-cms/homepage-structure-analysis.md`  
**Changes (allerede udført):**  
- Kortlæg nuværende struktur og dataflow for forsiden (mock data vs. API).  
- Sammenlign med MedusaJS modules pattern og dokumentér konklusioner.  

**Rationale:** Sikrer at vi forstår eksisterende arkitektur og kan bygge videre på den uden at bryde patterns.

#### 2. Refaktor homepage til `HomeTemplate` (FÆRDIG – implementeret)
**Files:**  
- `beauty-shop-storefront/src/modules/home/templates/index.tsx`  
- `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx`  
**Changes (allerede udført):**  
- Opret `HomeTemplate`, som samler alle forsidesektioner (Hero, BrandLogos, WhySection, StepCards, ProductCards, StorytellingSection, FAQ, FinalCta) i én template.  
- Forenkle route handleren i `page.tsx` til at hente data + kalde `HomeTemplate`.  
- Sørg for, at `HomeTemplate` tager en samlet `HomepageContent`-struktur og er klar til at modtage Strapi-data senere.

**Rationale:** Skaber et klart “single entry point” for forsiden, så vi kan skifte fra mock-data til Strapi uden at ændre alle komponenter enkeltvis.

#### 3. Definér `Page` content type + homepage-sektioner i Strapi
**Files:**  
- `beauty-shop-cms/src/api/page/content-types/page/schema.json`  
- `beauty-shop-cms/src/components/homepage/hero-section.json`  
- `beauty-shop-cms/src/components/homepage/brand-logos-section.json`  
- `beauty-shop-cms/src/components/homepage/why-section.json`  
- `beauty-shop-cms/src/components/homepage/step-cards-section.json`  
- `beauty-shop-cms/src/components/homepage/product-section.json`  
- `beauty-shop-cms/src/components/homepage/storytelling-section.json`  
- `beauty-shop-cms/src/components/homepage/faq-section.json`  
- `beauty-shop-cms/src/components/homepage/final-cta-section.json`  
**Changes:**  
- Opret `Page` collection type med felter:  
  - `title` (string) – sidens titel.  
  - `slug` (UID) – unik (fx `homepage`).  
  - `pageType` (enum: `homepage`, `landing`, `standard`).  
  - `seo` (component: `shared.seo` via @strapi/plugin-seo).  
  - `sections` (Dynamic Zone) – liste af pre-built sektioner.  
- Opret Strapi components under kategori `homepage` som matcher eksisterende React-komponenter:  
  - `hero-section` (overskrift, undertekst, billede, CTA-links osv.).  
  - `brand-logos-section` (liste af logoer + evt. titel).  
  - `why-section` (title, subtitle).  
  - `step-cards-section` (title + repeatable steps).  
  - `product-section` (title, description, liste af produkter/handles).  
  - `storytelling-section` (title, rich text, billede, alignment).  
  - `faq-section` (title + repeatable FAQ-items – kan genbruge `default.faq-item`).  
  - `final-cta-section` (title, subtitle, CTA-knapper).  
- Opret en `Page`-record i Strapi for `homepage` (slug `homepage`) og udfyld realistisk indhold.

**Rationale:** Giver marketing et simpelt, visuelt flow baseret på native Strapi-komponenter, hvor de kan tilføje og omrokere sektioner uden at tænke i kolonner eller tekniske detaljer.

#### 4. Hent og map homepage-data fra Strapi til `HomeTemplate`
**Files:**  
- `beauty-shop-storefront/src/lib/data/cms/pages.ts` (udvid)  
- `beauty-shop-storefront/src/lib/types/cms.ts` (udvid med `Page` + `HomepageSection`-typer)  
- `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx`  
**Changes:**  
- Tilføj helper `getHomepage()` der:  
  - Kalder Strapi `/api/pages?filters[slug][$eq]=homepage&populate[sections]=*&populate[seo]=*`.  
  - Mapper Strapi `sections` (Dynamic Zone) til en struktureret `HomepageContent`-model, som `HomeTemplate` kan bruge.  
- Opdater `page.tsx` til at kalde `getHomepage()` i stedet for (eller som supplement til) lokal mock `homepageContent`.  
- Behold fallback til eksisterende `homepageContent`, hvis Strapi ikke svarer eller ingen `homepage` findes.

**Rationale:** Gør integrationen transparent for UI-laget – `HomeTemplate` skal kun kende én form for data, uanset om det kommer fra mock eller Strapi.

#### 5. Opsæt Strapi Live Preview for `Page` (homepage)
**Files:**  
- `beauty-shop-storefront/src/app/api/preview/route.ts` (ny eller eksisterende)  
- `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx` (understøttelse af draft/preview)  
- Strapi admin → Content Manager / Settings (Preview URL)  
**Changes:**  
- Opret en Preview API-route i Next.js, som:  
  - Validerer en `secret` query parameter.  
  - Sætter `draftMode()` (Next.js).  
  - Redirecter til forsiden med passende parametre (fx `/?preview=1`).  
- Konfigurer Strapi `Page` til at bruge en Preview URL ala:  
  - `https://{storefront-domain}/api/preview?slug={slug}&secret=...`  
- Sørg for, at `getHomepage()` kan køre i “preview mode” (fx ved at bruge Strapi-admin token og hente `status=preview`/draft-indhold).  
- Dokumentér i kort form for marketing hvordan de:  
  - Redigerer `homepage` i Strapi.  
  - Klikker “Preview” for at se ændringer uden at publish.

**Rationale:** Opfylder ønsket om at kunne se ændringer live uden at være afhængig af eksterne page builder-plugins.

#### 6. Dokumentation
**Files:**  
- `.project/analysis/CORE-27-strapi-cms/homepage-structure-analysis.md`  
- `.project/analysis/CORE-27-strapi-cms/homepage-integration.md` (ny)  
- `.project/GETTING_STARTED.md` (opdater)  
**Changes:**  
- Opdater analyse-dokumentet med endelig beslutning om pre-built sections og fravalg af eksternt Page Builder plugin (Node 22-krav, licens/vedligeholdelse).  
- Dokumentér homepage content model (`Page` + `homepage.*`-components) og mapping til `HomeTemplate`.  
- Beskriv marketing-flowet step-by-step (oprette/redigere `homepage`, tilføje sektioner, ændre rækkefølge, bruge Preview).  
- Opdater GETTING_STARTED.md med:
  - Hvordan man starter Strapi og finder `Pages` → `homepage`.  
  - Hvordan man ændrer forsiden og bruger Live Preview.  
  - Evt. kendte begrænsninger/roadmap (fx future column-layout).

**Rationale:** Sikrer at både udviklere og content editors forstår den nye, simple homepage-arkitektur.

### Success Criteria:

#### Automated Verification:
- [ ] `npm run lint`, `npm run type-check` og `npm run build` for `beauty-shop-storefront` passerer efter homepage-integration.  
- [ ] `npm run build` og `npm run develop` for `beauty-shop-cms` passerer efter tilføjelse af `Page` + `homepage.*` components.  
- [ ] Ingen TypeScript- eller linting-errors i refaktorerede homepage-filer (`HomeTemplate`, `page.tsx`, CMS helpers/typer).

#### Manual Verification:
- [ ] Homepage-struktur er analyseret og dokumenteret (analyse-dokument opdateret).  
- [ ] `HomeTemplate` bruges som eneste template for forsiden, og route handleren er simpel (data-fetch + render).  
- [ ] `Page` content type med slug `homepage` eksisterer i Strapi med relevante sektioner udfyldt.  
- [ ] Forsiden i storefront viser indhold fra Strapi (Hero, mindst én ekstra sektion) uden at ændre commerce-delen.  
- [ ] Ændringer i Strapi (fx rækkefølge af sektioner eller tekst i Hero) kan ses i storefront uden ny deploy (via Preview-flow).  
- [ ] Fallback til eksisterende `homepageContent` fungerer, hvis Strapi ikke svarer eller `homepage` mangler.  
- [ ] **Performance:** Forsiden loader fortsat inden for acceptable grænser (< 2 sekunder i dev, uden unødige Strapi-kald).  
- [ ] **Accessibility:**  
  - [ ] CMS-drevet indhold bruger semantisk korrekt HTML (overskrifter, lister, brødtekst).  
  - [ ] Keyboard navigation fungerer fortsat på forsiden.  
  - [ ] Alt-tekster for CMS-billeder (hero/brand-logos/storytelling) er meningsfulde.  
- [ ] Lighthouse accessibility score ≥ 90 på forsiden.  
- [ ] Dokumentation for homepage-integration er komplet og opdateret.

**⚠️ PAUSE HERE** – Før næste fase skal homepage være fuldt integreret med Strapi via pre-built sektioner (uden eksternt Page Builder plugin) og være dokumenteret for både udviklere og marketing.

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


