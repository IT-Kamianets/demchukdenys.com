# Demchuk Denys — Custom Furniture

Marketing site for **Demchuk Denys**, a custom furniture workshop in Kamianets-Podilskyi,
Ukraine. Kitchens, cabinet furniture, and wardrobe systems, built to order.

**Live:** [demchukdenys.itkamianets.com](https://demchukdenys.itkamianets.com)

## What the site does

- **Home** — hero, portfolio highlights, services, articles, advantages, testimonials, contact
  form, call-to-action banner.
- **Services** (`/services`) — the three core offerings: custom kitchens, cabinet furniture,
  wardrobe systems, each with what's included.
- **Portfolio** (`/portfolios`, `/portfolio/:id`) — completed projects with photos and
  descriptions. This is the "outcome of a service," not a purchasable product.
- **Articles** (`/articles`, `/article/:id`) — blog-style content on furniture and interior
  design topics.
- **3D models** (`/3d-models`) — interactive Three.js viewer for example furniture pieces.
- **Kitchen calculator** (`/kitchen-calculator`) — an interactive tool that breaks a kitchen
  down cabinet-by-cabinet into cut parts (sides, bottoms, shelves, fronts, back panel) with
  a technical front-elevation diagram.
- **Contact form** — posts directly to a Telegram bot via an external API
  (`https://it.webart.work/api/telegram/contact`); no CMS or database on the marketing side.
- SEO: per-route meta/title/description/canonical (via `@wawjs/ngx-core` + `@wawjs/ngx-default`,
  driven by `src/data/company/company.json`), JSON-LD structured data, sitemap.xml/robots.txt
  generated post-build (`tools/seo/generate-static-seo.mjs`).
- i18n scaffolding (`src/i18n/`) for Ukrainian/English — currently applied to header/footer
  navigation as a working example, not yet to full page content.

### Marketplace (staged, not yet public)

A parallel set of pages for selling interior products (appliances/fixtures — fridges, ovens,
hoods, sinks, etc.) alongside the furniture business, intentionally **not linked from any
navigation, not in the sitemap, and marked `noindex`** until it's ready to launch:

- `/catalog`, `/product/:id` — product catalog, backed by static
  `src/data/marketplace/products.json`.
- `/cart`, `/checkout` — real shared cart (`localStorage`-backed), checkout validates a real
  Ukrainian phone number (`libphonenumber-js`) and creates a real order in Firestore.
- `/order/:id` — order confirmation, reads the real order back from Firestore.
- `/account` — order history (Firestore, publicly readable only by ID — listing the whole
  collection requires the admin login).
- `/login`, `/admin` — Firebase email/password auth; admin manages products (CRUD, stored as
  `localStorage` overrides on top of the static JSON) and orders (list, create, change status)
  in Firestore.

See [ROADMAP.md](./ROADMAP.md) for the planned next step: moving product content into
Firestore with a build-time sync to keep the public catalog static/SEO-friendly, while price
and stock live in their own collection and update instantly without a rebuild.

## Tech stack

- **Angular 22** — standalone components, signals, zoneless, SSR + prerendering (`@angular/ssr`)
- **Tailwind CSS 4**
- **TypeScript 6**
- **Firebase** (`firebase` JS SDK) — Auth (admin login) + Firestore (orders)
- **`@wawjs/ngx-core`, `@wawjs/ngx-default`, `@wawjs/ngx-translate`** — route-driven SEO/meta
  and i18n
- **Three.js** — 3D model viewer
- **`libphonenumber-js`** — phone number validation

## Structure

```
src/
  app/
    layouts/           # Header, footer (site chrome)
    components/        # Reusable content blocks (hero, portfolio, services, articles,
                        # advantages, testimonials, contact-form, cta-banner, lightbox,
                        # model-viewer, floating-contact, back-to-top)
    pages/             # Route-level pages (lazy-loaded)
      home/ services/ portfolios/ portfolio-detail/ articles/ article-detail/
      models-3d/ kitchen-calculator/ not-found/
      marketplace/     # Staged feature — see "Marketplace" above
        catalog/ product/ cart/ checkout/ order/ account/ login/ admin/
    feature/           # Cross-cutting singletons (no UI)
      company/         # Business profile data, powers SEO defaults
      firebase/        # Firebase app/auth init, AuthService
      marketplace/      # Product/cart/order services + interfaces
    directives/        # Scroll-in-view animation directives
    seo.service.ts     # JSON-LD (business/website/article schema), per-instance meta
  data/
    company/           # company.json — name, address, socials, per-route SEO overrides
    marketplace/       # products.json — static product catalog
  i18n/                # ua.json / en.json translation dictionaries
  environments/        # environment.ts / environment.prod.ts (incl. Firebase config)
tools/
  seo/generate-static-seo.mjs   # Post-build sitemap.xml + robots.txt generation
```

## Running

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:4200)
npm start

# Production build (also regenerates sitemap.xml/robots.txt)
npm run build

# Unit tests
npm test
```
