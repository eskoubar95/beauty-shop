# API-designspecifikation
Beauty Shop – Headless e‑commerce API (MedusaJS + Next.js + Stripe + Clerk)

Version: 1.0  
Dato: 2025-10-19  
Status: Udkast (klar til implementering)  
Dokumentejer: Nicklas Eskou  
Filplacering: `.project/05-API_Design.md`

---

## 0) Resumé
Dette dokument specificerer REST API’et for Beauty Shop MVP samt nærliggende post‑MVP features. Det er afstemt med PRD, Tech Stack og Database Schema og designet til klarhed, sikkerhed, skalerbarhed og hurtig implementering på MedusaJS v2 med en Next.js 15 frontend.

---

## 1) API-arkitektur (overblik)

### 1.1 Base, versionering og formater
- Base URL: `https://api.beautyshop.com/v1`
- Versionering: URL-versionering (`/v1`, `/v2` for breaking changes)
- Content types: `Content-Type: application/json; charset=utf-8`, `Accept: application/json`
- Dato/tid: ISO 8601 i UTC (fx `2025-10-14T12:34:56Z`)
- Valuta: Alle beløb returneres som heltal i øre. Eksempel: `89900` = `899,00` DKK
- Idempotency: Skrivende endpoints accepterer `Idempotency-Key: <uuid-v4>` og skal være idemponente ved retrys
- Korrelations-id: Understøt/emit `X-Request-Id` og echo i svar

### 1.2 Autentifikation og autorisation
- Identity provider: Clerk (JWT i `Authorization: Bearer <token>`)
- Roller: `guest` (ingen token), `customer` (Clerk-bruger), `admin` (Clerk-bruger med admin-rolle + Medusa admin-policy)
- Mapping:
  - Clerk user → Medusa `customer` (autoritet for commerce)
  - Valgfri kobling til `public.user_profiles` via `clerk_user_id` og `customer_id`
- Gæste-flow: Kurv og checkout kan bruges uden login; ordre skabes med email og kan senere knyttes til en konto

### 1.3 Fejlhåndtering
- Ensartet fejlformat:
```json
{
  "error": {
    "code": "validation_error",
    "message": "Ugyldigt input.",
    "details": [{"field": "email", "message": "Ugyldig email"}],
    "requestId": "req_01H..."
  }
}
```
- Statuskoder: 200/201/204 succes; 400 bad request; 401 unauthorized; 403 forbidden; 404 not found; 409 conflict; 422 validation; 429 rate limited; 5xx server

### 1.4 Paginering, filtrering og sortering
- Cursor-paginering: `?limit=20&cursor=<opaque>`; svar inkluderer `pageInfo: { nextCursor }` og `Link`-header for `next`
- Filtrering: ressource-specifik (fx `status`, `type`, `q` tekstsøgning)
- Sortering: `?sort=-created_at,title` (kommaseparerede felter, `-` for desc)

### 1.5 Rate limiting (initielle værdier)
- Katalog: 100 req/min/IP
- Auth/kunde/konto: 20 req/min/IP
- Ordrer/checkout: 40 req/min/IP (+ burst 10 req/10s)
- Admin: 60 req/min/IP
- Svar-headere: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

### 1.6 CORS
- Tilladte origins: Production-domæner, Vercel-preview domæner, localhost (dev)
- Metoder: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Headers: Authorization, Content-Type, Idempotency-Key, X-Request-Id
- Credentials: false (default). Admin-UI kan kræve `credentials: true` med allowlistede origins

### 1.7 Observability og robusthed
- Sentry-instrumentering for fejl og performance (API + frontend)
- Struktureret logging med korrelations-id’er
- Idemponente writes og Stripe webhook signaturvalidering

---

## 2) Endpoints pr. featureområde
Alle ruter er præfikset med `/v1`. Eksempler er forkortede for læsbarhed.

### A) Offentligt produktkatalog (MVP)

1) GET `/products`
- Formål: Liste publicerede produkter med søgning/filtrering
- Query-parametre:
  - `q?: string` full‑text på title/description
  - `type?: 'kit' | 'single'`
  - `status?: 'published' | 'draft' | 'archived'` (default: `published`)
  - `include?: 'variants,images,metadata'` kommaseparerede includes
  - `limit?: number (1..50)`, `cursor?: string`
- Eksempel: `GET /v1/products?q=starter&type=kit&include=variants,images&limit=12`
- Response 200:
```json
{
  "items": [{
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Starter Kit",
    "handle": "starter-kit",
    "type": "kit",
    "status": "published",
    "shortDescription": "3-step skincare routine for men",
    "createdAt": "2025-10-14T10:00:00Z",
    "variants": [{
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Starter Kit - Standard",
      "sku": "BS-SK-001",
      "price": 89900,
      "compareAtPrice": 119900,
      "inventoryQuantity": 100
    }],
    "images": [{
      "url": "https://.../starter-kit/hero.jpg",
      "alt": "Beauty Shop Starter Kit",
      "sortOrder": 1
    }]
  }],
  "pageInfo": { "nextCursor": "eyJpZCI6..." }
}
```
- Auth: ingen
- Fejl: 400 ugyldige parametre

2) GET `/products/{id}`
3) GET `/products/handle/{handle}`
- Formål: Hent produktdetaljer via id eller handle
- Query: `include=variants,images,metadata`
- Response 200:
```json
{
  "id": "...440001",
  "title": "Starter Kit",
  "handle": "starter-kit",
  "type": "kit",
  "status": "published",
  "description": "Complete 3-step routine...",
  "seo": { "title": "Starter Kit", "description": "..." },
  "variants": [...],
  "images": [...],
  "metadata": {
    "ingredients": "Cleanser: Centella..., Moisturizer: Ceramides...",
    "howToUse": "AM: Cleanser → Toner → Moisturizer ...",
    "expectedResults": "Clearer skin after 2–4 weeks",
    "skinTypes": ["Normal", "Combination", "Oily"],
    "size": "Cleanser: 150ml, Toner: 150ml, Moisturizer: 50ml",
    "origin": "Korea",
    "certifications": ["Cruelty-free", "Vegan"]
  }
}
```
- Auth: ingen; 404 hvis ikke fundet

### B) Kurv (MVP)

4) POST `/carts`
- Formål: Opret ny kurv (gæst eller logged‑in)
- Body (valgfri):
```json
{ "currencyCode": "DKK", "email": "martin@example.com" }
```
- Response 201:
```json
{
  "id": "c_01H...",
  "currencyCode": "DKK",
  "email": "martin@example.com",
  "totals": { "subtotal": 0, "shipping": 0, "tax": 0, "discount": 0, "total": 0 },
  "createdAt": "2025-10-14T..."
}
```
- Auth: ikke påkrævet; Fejl: 400 ugyldig valuta/email

5) GET `/carts/{cartId}`
- Formål: Hent kurv
- Response 200:
```json
{
  "id": "c_01H...",
  "items": [{
    "id": "li_01H...",
    "productId": "...440001",
    "variantId": "...440002",
    "title": "Starter Kit - Standard",
    "sku": "BS-SK-001",
    "quantity": 1,
    "unitPrice": 89900,
    "total": 89900
  }],
  "gift": { "isGift": false },
  "totals": { "subtotal": 89900, "shipping": 0, "tax": 22475, "discount": 0, "total": 112375 }
}
```

6) POST `/carts/{cartId}/line-items`
- Formål: Tilføj varelinje
- Headers: `Idempotency-Key` anbefales kraftigt
- Body:
```json
{ "variantId": "550e8400-e29b-41d4-a716-446655440002", "quantity": 1 }
```
- Response 201: Opdateret kurv
- Fejl: 404 kurv/variant ikke fundet; 409 utilstrækkeligt lager; 422 validering

7) PATCH `/carts/{cartId}/line-items/{lineItemId}`
- Formål: Opdater antal
- Body: `{ "quantity": 2 }`
- Response 200: Opdateret kurv

8) DELETE `/carts/{cartId}/line-items/{lineItemId}`
- Formål: Fjern varelinje
- Response 204

9) POST `/carts/{cartId}/shipping-address`
- Formål: Sæt leveringsadresse (beregner fragt)
- Body:
```json
{
  "firstName": "Martin",
  "lastName": "Hansen",
  "address1": "Nørrebrogade 123",
  "postalCode": "2200",
  "city": "København N",
  "countryCode": "DK",
  "phone": "+45 12345678"
}
```
- Response 200: Opdateret kurv; Regel: fragt 49 DKK, gratis over 500 DKK

10) POST `/carts/{cartId}/gift`
- Formål: Slå gave‑tilstand til/fra og angiv gavehilsen
- Body:
```json
{ "isGift": true, "note": "God fornøjelse!" }
```
- Response 200: Opdateret kurv (gaveindstillinger)

### C) Checkout og betaling (MVP)

11) POST `/carts/{cartId}/payment-sessions`
- Formål: Initialiser Stripe (Payment Intent/Checkout Session)
- Body:
```json
{ "provider": "stripe", "returnUrl": "https://shop.com/checkout/success" }
```
- Response 200:
```json
{ "provider": "stripe", "clientSecret": "pi_...", "checkoutUrl": "https://checkout.stripe.com/..." }
```
- Auth: valgfri (gæst tilladt); Fejl: 400/409/422

12) POST `/carts/{cartId}/complete`
- Formål: Fuldfør ordre efter bekræftet betaling (server validerer betaling via Stripe)
- Response 201:
```json
{
  "order": {
    "id": "ord_01H...",
    "orderNumber": "BS-2025-001",
    "status": "confirmed",
    "paymentStatus": "paid",
    "total": 112375,
    "email": "martin@example.com",
    "items": [{ "title": "Starter Kit - Standard", "quantity": 1, "unitPrice": 89900, "total": 89900 }],
    "shippingAddress": { "firstName": "Martin", "city": "København N", "postalCode": "2200", "countryCode": "DK" },
    "createdAt": "2025-10-14T..."
  }
}
```

13) POST `/webhooks/stripe`
- Formål: Stripe webhook (payment succeeded/failed)
- Sikkerhed: Verificér Stripe signaturheader; idemponent behandling
- Response 200: Kvitteret

### D) Kunder og auth (MVP)

14) POST `/customers`
- Formål: Opret/sikre Medusa‑customer for autentificeret Clerk‑bruger; upsert `user_profiles`
- Auth: `customer` (kræver token)
- Body:
```json
{ "email": "martin@example.com", "firstName": "Martin", "lastName": "Hansen" }
```
- Response 201:
```json
{ "id": "cust_01H...", "email": "martin@example.com" }
```
- Fejl: 401/403/409/422

15) GET `/customers/me`
- Formål: Hent aktuel kundes profil
- Auth: `customer`
- Response 200:
```json
{
  "id": "cust_01H...",
  "email": "martin@example.com",
  "profile": {
    "clerkUserId": "user_2x...",
    "phone": "+45 12345678",
    "skinType": "combination",
    "marketingConsent": true
  }
}
```

16) GET `/customers/me/orders`
- Formål: Liste ordrer for aktuel kunde
- Auth: `customer`
- Query: `limit`, `cursor`
- Response 200:
```json
{
  "items": [{ "id": "ord_01H...", "orderNumber": "BS-2025-001", "status": "shipped", "total": 112375, "createdAt": "..." }],
  "pageInfo": { "nextCursor": null }
}
```

### E) Ordrer (MVP)

17) GET `/orders/{orderId}`
- Formål: Hent ordre; kun ejer (via email/customer_id) eller admin
- Auth: `customer` (ejer) eller `admin`
- Response 200: Ordre (se C.12)
- Fejl: 401/403/404

### F) Venteliste og landing (MVP)

18) POST `/waitlist`
- Formål: Tilføj email til venteliste
- Body:
```json
{ "email": "emma@example.com", "firstName": "Emma", "source": "instagram", "referralCode": "NICK50" }
```
- Response 201:
```json
{ "id": "wl_01H...", "email": "emma@example.com", "createdAt": "..." }
```
- Fejl: 409 hvis email findes; 422 ugyldig email

19) GET `/waitlist/count`
- Formål: Offentlig tæller
- Response 200: `{ "count": 512 }`

20) GET `/admin/waitlist`
- Formål: Admin-liste med filtre
- Auth: `admin`
- Query: `q`, `source`, `limit`, `cursor`
- Response 200: Paginéret liste

### G) Reviews og ratings (post‑MVP)

21) GET `/products/{id}/reviews`
- Offentlig, paginéret liste
- Response 200:
```json
{ "items": [{ "id": "rev_01H...", "rating": 5, "text": "Great kit!", "createdAt": "..." }], "pageInfo": { "nextCursor": null } }
```

22) POST `/reviews`
- Formål: Opret review; kun hvis bruger har købt produktet og ≥ 4 uger er gået
- Auth: `customer`
- Body:
```json
{ "orderId": "ord_01H...", "productId": "550e8400-...", "rating": 5, "text": "Excellent!" }
```
- Response 201: Review (status `pending`)

23) POST `/admin/reviews/{id}/moderate`
- Formål: Godkend/afvis review
- Auth: `admin`
- Body: `{ "action": "approve" | "reject", "reason": "..." }`
- Response 200: Opdateret review

### H) Abonnementer (post‑MVP)

24) POST `/subscriptions`
- Formål: Start abonnement (Stripe Subscriptions)
- Auth: `customer`
- Body:
```json
{ "variantId": "550e8...", "frequencyWeeks": 8, "discountPercentage": 10 }
```
- Response 201: Subscription

25) GET `/subscriptions`
- Formål: List nuværende brugers abonnementer
- Auth: `customer`

26) PATCH `/subscriptions/{id}`
- Formål: Opdater frekvens, adresse mv.
- Auth: `customer`
- Body: `{ "frequencyWeeks": 10 }`

27) POST `/subscriptions/{id}/pause`
28) POST `/subscriptions/{id}/cancel`
- Auth: `customer`

### I) Referral-program (post‑MVP)

29) GET `/referrals/link`
- Formål: Returnér en personlig referral-link for nuværende bruger
- Auth: `customer`
- Response 200: `{ "link": "https://shop.com/?ref=abc123" }`

30) POST `/referrals/apply`
- Formål: Anvend referral‑kode på nuværende kurv/checkout
- Auth: gæst eller `customer`
- Body: `{ "code": "abc123" }`
- Response 200: `{ "applied": true, "discount": 5000 }`

### J) Admin (MVP)

31) GET `/admin/orders`
- Formål: Liste ordrer med filtre
- Auth: `admin`
- Query: `status`, `paymentStatus`, `limit`, `cursor`

32) PATCH `/admin/orders/{id}/status`
- Formål: Opdater ordrestadie (fx `shipped`) og tracking‑URL
- Auth: `admin`
- Body: `{ "status": "shipped", "trackingUrl": "https://..." }`
- Response 200: Opdateret ordre (sideeffekt: send shipping‑email)

33) GET `/admin/products`
34) POST `/admin/products`
35) PATCH `/admin/products/{id}`
- Formål: Administrér produktkatalog (kan håndteres fuldt i Medusa Admin; hold API tyndt hvis den bruges)
- Auth: `admin`

---

## 3) Datamodeller (JSON-schemas)
Schemas er repræsentative og kan håndhæves med Zod/Joi i services; feltnavne matcher svar‑eksemplerne.

### 3.1 Product
```json
{
  "type": "object",
  "required": ["id", "title", "handle", "type", "status", "createdAt"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 1, "maxLength": 255 },
    "handle": { "type": "string", "pattern": "^[a-z0-9-]+$", "maxLength": 255 },
    "shortDescription": { "type": "string", "maxLength": 500 },
    "description": { "type": "string" },
    "type": { "type": "string", "enum": ["kit", "single"] },
    "status": { "type": "string", "enum": ["draft", "published", "archived"] },
    "seo": {
      "type": "object",
      "properties": {
        "title": { "type": "string", "maxLength": 255 },
        "description": { "type": "string", "maxLength": 500 }
      }
    },
    "variants": { "type": "array", "items": { "$ref": "#/$defs/ProductVariant" } },
    "images": { "type": "array", "items": { "$ref": "#/$defs/ProductImage" } },
    "metadata": { "type": "object", "additionalProperties": { "type": "string" } },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "$defs": {
    "ProductVariant": {
      "type": "object",
      "required": ["id", "title", "sku", "price"],
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "title": { "type": "string", "maxLength": 255 },
        "sku": { "type": "string", "maxLength": 100 },
        "price": { "type": "integer", "minimum": 1 },
        "compareAtPrice": { "type": "integer", "minimum": 0 },
        "inventoryQuantity": { "type": "integer", "minimum": 0 }
      }
    },
    "ProductImage": {
      "type": "object",
      "required": ["url"],
      "properties": {
        "url": { "type": "string", "format": "uri" },
        "alt": { "type": "string", "maxLength": 255 },
        "sortOrder": { "type": "integer", "minimum": 0 }
      }
    }
  }
}
```

### 3.2 Cart
```json
{
  "type": "object",
  "required": ["id", "currencyCode", "totals"],
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "currencyCode": { "type": "string", "pattern": "^[A-Z]{3}$" },
    "items": { "type": "array", "items": { "$ref": "#/$defs/CartItem" } },
    "gift": { "type": "object", "properties": { "isGift": { "type": "boolean" }, "note": { "type": "string", "maxLength": 150 } } },
    "shippingAddress": { "$ref": "#/$defs/Address" },
    "totals": {
      "type": "object",
      "required": ["subtotal", "shipping", "tax", "discount", "total"],
      "properties": {
        "subtotal": { "type": "integer", "minimum": 0 },
        "shipping": { "type": "integer", "minimum": 0 },
        "tax": { "type": "integer", "minimum": 0 },
        "discount": { "type": "integer", "minimum": 0 },
        "total": { "type": "integer", "minimum": 0 }
      }
    }
  },
  "$defs": {
    "CartItem": {
      "type": "object",
      "required": ["id", "variantId", "title", "sku", "quantity", "unitPrice", "total"],
      "properties": {
        "id": { "type": "string" },
        "productId": { "type": "string", "format": "uuid" },
        "variantId": { "type": "string", "format": "uuid" },
        "title": { "type": "string" },
        "sku": { "type": "string" },
        "quantity": { "type": "integer", "minimum": 1 },
        "unitPrice": { "type": "integer", "minimum": 1 },
        "total": { "type": "integer", "minimum": 1 }
      }
    },
    "Address": {
      "type": "object",
      "required": ["firstName", "lastName", "address1", "postalCode", "city", "countryCode"],
      "properties": {
        "firstName": { "type": "string", "minLength": 1 },
        "lastName": { "type": "string", "minLength": 1 },
        "address1": { "type": "string", "minLength": 5 },
        "address2": { "type": "string" },
        "postalCode": { "type": "string", "pattern": "^\\d{4}$" },
        "city": { "type": "string", "minLength": 2 },
        "countryCode": { "type": "string", "pattern": "^[A-Z]{2}$" },
        "phone": { "type": "string" }
      }
    }
  }
}
```

### 3.3 Order
```json
{
  "type": "object",
  "required": ["id", "orderNumber", "status", "paymentStatus", "total", "items", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "orderNumber": { "type": "string", "maxLength": 20 },
    "email": { "type": "string", "format": "email" },
    "status": { "type": "string", "enum": ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] },
    "paymentStatus": { "type": "string", "enum": ["pending", "paid", "failed", "refunded", "partially_refunded"] },
    "fulfillmentStatus": { "type": "string", "enum": ["not_fulfilled", "fulfilled", "shipped", "delivered", "returned"] },
    "currencyCode": { "type": "string" },
    "subtotal": { "type": "integer" },
    "taxTotal": { "type": "integer" },
    "shippingTotal": { "type": "integer" },
    "discountTotal": { "type": "integer" },
    "total": { "type": "integer" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "sku", "quantity", "unitPrice", "total"],
        "properties": {
          "title": { "type": "string" },
          "sku": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 },
          "unitPrice": { "type": "integer", "minimum": 1 },
          "total": { "type": "integer", "minimum": 1 }
        }
      }
    },
    "shippingAddress": { "$ref": "#/definitions/Address" },
    "billingAddress": { "$ref": "#/definitions/Address" },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "definitions": {
    "Address": {
      "type": "object",
      "required": ["firstName", "lastName", "address1", "postalCode", "city", "countryCode"],
      "properties": {
        "firstName": { "type": "string" },
        "lastName": { "type": "string" },
        "address1": { "type": "string" },
        "address2": { "type": "string" },
        "postalCode": { "type": "string" },
        "city": { "type": "string" },
        "countryCode": { "type": "string" },
        "phone": { "type": "string" }
      }
    }
  }
}
```

### 3.4 WaitlistEntry
```json
{
  "type": "object",
  "required": ["id", "email", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "firstName": { "type": "string", "maxLength": 100 },
    "source": { "type": "string", "maxLength": 50 },
    "referralCode": { "type": "string", "maxLength": 50 },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

### 3.5 Review
```json
{
  "type": "object",
  "required": ["id", "productId", "rating", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "productId": { "type": "string", "format": "uuid" },
    "orderId": { "type": "string" },
    "rating": { "type": "integer", "minimum": 1, "maximum": 5 },
    "text": { "type": "string", "minLength": 50, "maxLength": 500 },
    "photoUrl": { "type": "string", "format": "uri" },
    "status": { "type": "string", "enum": ["pending", "approved", "rejected"] },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

### 3.6 Subscription
```json
{
  "type": "object",
  "required": ["id", "status", "frequencyWeeks", "nextBillingDate", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "status": { "type": "string", "enum": ["active", "paused", "cancelled", "expired"] },
    "frequencyWeeks": { "type": "integer", "minimum": 1 },
    "discountPercentage": { "type": "integer", "minimum": 0, "maximum": 100 },
    "nextBillingDate": { "type": "string", "format": "date" },
    "lastBillingDate": { "type": "string", "format": "date" },
    "items": { "type": "array", "items": { "$ref": "#/$defs/SubscriptionItem" } },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "$defs": {
    "SubscriptionItem": {
      "type": "object",
      "required": ["variantId", "title", "quantity", "unitPrice"],
      "properties": {
        "variantId": { "type": "string", "format": "uuid" },
        "productId": { "type": "string", "format": "uuid" },
        "title": { "type": "string" },
        "sku": { "type": "string" },
        "quantity": { "type": "integer", "minimum": 1 },
        "unitPrice": { "type": "integer", "minimum": 1 }
      }
    }
  }
}
```

### 3.7 Valideringsregler (opsummering)
- Email: RFC‑kompatibel; unik constraint for venteliste
- DK postnummer: `^\d{4}$`
- Antal ≥ 1; priser > 0; rabatter ≥ 0
- Gavehilsen ≤ 150 tegn
- Review‑tekst 50–500 tegn; rating 1–5; kun hvis køb ≥ 4 uger siden
- Abonnement‑frekvens anbefalet 8/10/12 (håndhæv ≥ 1; evt. whitelist)

---

## 4) Sikkerhedsovervejelser

### 4.1 Auth‑flow (Clerk)
1) Frontend autentificerer via Clerk (OAuth/email/password/magic link)
2) Frontend sender `Authorization: Bearer <Clerk JWT>` til beskyttede endpoints
3) API validerer JWT‑signatur og udtrækker `sub/email`
4) API mapper Clerk‑bruger til Medusa `customer` og til `user_profiles` (hvis tilstede)
5) Gæster kan stadig oprette kurve og gennemføre ordrer via email

### 4.2 Autorisationsregler (pr. endpoint)
- Offentligt katalog: åben
- Kurv/checkout: gæst eller customer
- `/customers/me`, `/customers/me/orders`, `/orders/{id}`: customer (ejer) eller admin
- Admin‑ruter: admin‑rolle påkrævet (Clerk‑claim og/eller Medusa admin token)
- Reviews: customer med matchende tidligere ordre der indeholder produktet
- Abonnementer: customer (ejer)

### 4.3 Datavalidering og integritet
- Server‑side validering (Zod/Joi); returnér 422 med felt‑`details`
- Sanitisér tekstfelter (escape, længder)
- Valider ID’er (UUID/slug) og enum‑værdier
- Verificér Stripe webhook‑signaturer; idemponent betalingshåndtering

### 4.4 CORS‑politik
- Allow‑list produktion og preview origins; localhost i dev
- Ingen wildcard ved Authorization
- Korrekt preflight for custom headers (Idempotency-Key)

### 4.5 Privatliv og GDPR
- API returnerer kun nødvendige data
- Ret til sletning/eksport håndteres via backoffice/selvbetjening (post‑MVP)
- Hvis Supabase eksponeres direkte senere, aktiver RLS; i MVP tilgår kun server databasen

---

## 5) Integrationseksempler (Frontend)

### 5.1 Produktliste (Next.js 15 Server Component)
```ts
// app/(store)/page.tsx
export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/products?include=images,variants&limit=12`, { next: { revalidate: 60 } })
  const data = await res.json()
  return <ProductGrid products={data.items} />
}
```

### 5.2 Tilføj til kurv (Client Component)
```ts
async function addToCart(cartId: string, variantId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/carts/${cartId}/line-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
    body: JSON.stringify({ variantId, quantity: 1 })
  })
  if (!res.ok) throw new Error('Kunne ikke tilføje til kurv')
  return res.json()
}
```

### 5.3 Sæt leveringsadresse
```ts
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/carts/${cartId}/shipping-address`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Martin', lastName: 'Hansen', address1: 'Nørrebrogade 123',
    postalCode: '2200', city: 'København N', countryCode: 'DK', phone: '+45 12345678'
  })
})
```

### 5.4 Initialisér Stripe‑betaling (Checkout Session)
```ts
const session = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/carts/${cartId}/payment-sessions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
  body: JSON.stringify({ provider: 'stripe', returnUrl: `${location.origin}/checkout/success` })
}).then(r => r.json())

if (session.checkoutUrl) {
  window.location.href = session.checkoutUrl
}
```

### 5.5 Fuldfør ordre (Server Action efter Stripe‑redirect)
```ts
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/carts/${cartId}/complete`, { method: 'POST' })
```

### 5.6 Venteliste‑tilmelding
```ts
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/waitlist`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: form.email, firstName: form.firstName, source: 'landing' })
})
```

### 5.7 Mine ordrer (Clerk auth)
```ts
import { auth } from '@clerk/nextjs'

const { getToken } = auth()
const token = await getToken()
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/customers/me/orders?limit=10`, {
  headers: { Authorization: `Bearer ${token}` }
})
const data = await res.json()
```

### 5.8 Opret review (post‑MVP)
```ts
const token = await getToken()
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/reviews`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ orderId, productId, rating: 5, text: 'Super!' })
})
```

### 5.9 Start abonnement (post‑MVP)
```ts
const token = await getToken()
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subscriptions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ variantId, frequencyWeeks: 8, discountPercentage: 10 })
})
```

---

## 6) Status og næste skridt
- Denne specifikation dækker MVP (katalog, kurv, checkout/Stripe, auth/Clerk, ordrer, venteliste) og post‑MVP (reviews, abonnementer, referrals) endpoints, datamodeller, sikkerhed og integrationseksempler.
- Næste skridt:
  - Generér OpenAPI 3.1 spec (YAML/JSON) ud fra dette dokument for bedre DX og klientgenerering
  - Map handlers til Medusa‑services og konfigurer Stripe/Clerk‑nøgler
  - Tilføj LaunchDarkly feature flags for post‑MVP ruter
  - Implementér idempotency og webhook‑sikkerhed i backend

---

## 7) Bilag

### 7.1 Standard response‑headere
- `X-Request-Id`: Korrelations‑id til tracing
- `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`: Rate limiting

### 7.2 Standard fejlkoder (eksempler)
- `validation_error`, `not_found`, `unauthorized`, `forbidden`, `rate_limited`, `conflict`, `internal_error`


