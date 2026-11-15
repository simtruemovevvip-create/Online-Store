# Online-Store

Online Store is being migrated from the legacy Google Apps Script application to a modular web application.

## Migration status

- The original Google Apps Script files (`Code.gs`, `Index.html`) remain on the `main` branch and are not deleted or overwritten.
- This branch introduces a Vite + TypeScript frontend foundation and a Cloudflare Workers API entry point.
- No production database, authentication, payment, order, inventory, or media migration has been performed yet.
- The legacy application remains the reference implementation until feature parity and data migration are tested.

## Stack foundation

- Vite + TypeScript for the frontend.
- Cloudflare Workers for API routing and static asset hosting.
- Database and object storage bindings will be selected and added before migrating production data.

## Local development

```bash
npm install
npm run dev
```

## Validate and build

```bash
npm run typecheck
npm run build
```

## Cloudflare deployment preparation

1. Install dependencies with `npm install`.
2. Authenticate Wrangler with `npx wrangler login`.
3. Review `wrangler.jsonc` and select/configure the production database and storage bindings.
4. Build the frontend with `npm run build`.
5. Deploy only after API, authentication, data migration, and end-to-end tests are complete.

The Worker currently exposes `GET /api/health` as a foundation check. All other API routes are intentionally unimplemented.
