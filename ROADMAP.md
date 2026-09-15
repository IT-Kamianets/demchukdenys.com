# Roadmap: Marketplace — Firestore for content, a separate table for price/quantity

The product catalog (`/catalog`, `/product/:id`) currently runs on the static
`src/data/marketplace/products.json`, which is bundled into the build and prerendered
(SEO/prerender). Since the site is hosted on GitHub Pages (static files only), any change
to a product's content requires a new build and deploy. Plan:

1. **Product content** (title, description, image, category, specs) moves to Firestore
   (`products`), edited from the admin panel (`/admin`). Public catalog pages **do not read
   Firestore** — they keep using only the bundled `products.json`, exactly as today. This
   keeps the catalog fast, simple, and fully prerender-friendly.
2. **Price and quantity** (`price`, `currency`, `inStock`, `stockQty`) move to a separate
   Firestore collection (e.g. `productPricing`), read **live** by both public pages and the
   admin panel. These are the only fields expected to change often, and they deliberately
   **never** end up in SEO/prerendered HTML and are never treated as "dirty" — a price update
   never requires a new build.
3. **"Dirty" products in admin**: the admin panel compares the `products.json` bundled into
   the current build (= "what's live now") against what's currently in Firestore `products`
   (= "the draft"). Any mismatch by id/field marks that product as unpublished. No separate
   "last built at" timestamp is needed — once a deploy succeeds, the new `products.json`
   already matches Firestore, and the diff clears itself.
4. **"Publish changes" button in admin**: calls **our existing backend API** (not a new
   service), passing the admin's Firebase ID token. The API:
   - verifies the token server-side (Firebase Admin SDK, no extra secrets needed for that
     check),
   - and only then calls GitHub Actions' `workflow_dispatch` (a GitHub PAT with `workflow`
     scope stored as a secret on the API side, never exposed in the client bundle).
5. **GitHub Actions workflow** on `workflow_dispatch`: pulls the current products from
   Firestore `products`, overwrites `src/data/marketplace/products.json`, runs `ng build`,
   and deploys to GitHub Pages.

Not implemented yet — this is the agreed plan only.
