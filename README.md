# Online-Store

Online Store is being migrated incrementally from the legacy Google Apps Script application to a modular web application.

## Current migration approach

**Google Sheets remains the primary database for this phase.** The existing Google Apps Script project continues to read and write Google Sheets. The new web app is designed to call the Apps Script Web App through a Cloudflare Worker bridge:

```text
Browser (Vite + TypeScript)
        |
        | /api/legacy
        v
Cloudflare Worker
        |
        | private Worker secret: GAS_WEB_APP_URL
        v
Google Apps Script Web App
        |
        v
Google Sheets (existing data)
```

This is a transitional architecture. It avoids exposing the Apps Script deployment URL in browser code and avoids moving existing Sheets data before the replacement backend is ready.

## Migration status

- The original Google Apps Script files (`Code.gs`, `Index.html`) remain on the `main` branch and are not deleted or overwritten.
- This branch introduces a Vite + TypeScript frontend and a Cloudflare Workers API entry point.
- `GET /api/health` reports whether the Apps Script URL is configured.
- `GET /api/legacy` and `POST /api/legacy` proxy requests to the configured Apps Script Web App.
- The bridge is infrastructure only: it does not automatically make the old Apps Script functions compatible with the new frontend. Frontend screens must be connected to the actual legacy API actions and their response formats.
- Authentication, authorization, payment, order, inventory, and media workflows have **not** been migrated or fully tested in the new frontend.
- No production deployment has been performed from this branch. Keep the existing GAS application available until feature parity and data integrity are verified.

## Stack

- Vite + TypeScript for the frontend.
- Cloudflare Workers for API routing and static asset hosting.
- Google Apps Script as the transitional backend.
- Google Sheets as the current primary data store.

## Local development

```bash
npm install
npm run dev
```

## Configure the Apps Script bridge

1. Deploy the existing Apps Script project as a Web App.
2. Confirm its deployment is accessible to the intended users and that its existing authentication/authorization checks remain enabled.
3. In the Cloudflare project, set the deployment URL as a Worker secret (do not put it in frontend environment variables or commit it):

   ```bash
   npx wrangler secret put GAS_WEB_APP_URL
   ```

4. Paste the Apps Script Web App URL ending in `/exec` when prompted.
5. Deploy the Worker only after reviewing access controls and testing the bridge.

The Worker accepts only HTTPS Apps Script Web App URLs on `script.google.com` matching the `/macros/s/.../exec` path. It supports GET and POST on `/api/legacy`. Query parameters are forwarded; POST request bodies and their content type are forwarded.

**Important:** the bridge does not add user authentication by itself. The Apps Script backend must enforce authentication and permissions for every operation. Do not expose privileged Apps Script functions through a public deployment without those checks.

## Validate and build

```bash
npm run typecheck
npm run build
```

## Next migration steps

1. Inventory the existing Apps Script API actions and document their request/response contracts.
2. Connect one frontend feature at a time through the bridge, beginning with read-only data.
3. Add explicit authentication and role/tenant permission checks before enabling write operations.
4. Test pagination, filtering, uploads, and concurrent updates against a copy of production Sheets.
5. Only consider replacing Sheets with another database after the migrated system has passed parity and data-integrity tests.
