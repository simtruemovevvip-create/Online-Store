# Online-Store

## Vercel entry point (temporary Apps Script bridge)

The Vercel project is linked to this repository and uses the root vercel.json configuration.

At this migration stage, Vercel performs a temporary HTTP 307 redirect to the existing Google Apps Script Web App. The actual storefront, google.script.run RPC calls, authentication, Google Sheets data, and Google Drive uploads still run in Google Apps Script. This keeps the existing application usable without pretending that the legacy Apps Script UI has already been migrated to Vercel.

**Important limitations**
- Vercel is currently an entry point/redirect, not yet the host for the application UI or its API.
- This redirect does not change the origin used by Google/Facebook OAuth. Social login must still be tested against the Apps Script-hosted page.
- Do not remove the Apps Script Web App or change its deployment ID without updating the destination in vercel.json.
- A future full migration needs a real Vercel frontend and server-side API endpoints, plus an explicitly tested Apps Script JSON API or replacement backend.

## Google Apps Script configuration

The existing Apps Script app continues to use the configured Google Sheets spreadsheet and Google Drive folder. The Apps Script Web App URL used by Vercel is the deployed /exec endpoint already configured in Code.gs.

## Administrator bootstrap password

The previous source contained a public default administrator password. It has been removed.

To create the initial admin account on a fresh database, or intentionally rotate the existing admin account password:

1. Open the Apps Script project associated with this application.
2. Open Project Settings → Script Properties.
3. Add INITIAL_ADMIN_PASSWORD with a strong password of at least 12 characters.
4. In the Apps Script editor, run setupSystem() as the deployment owner.
5. The setup routine hashes the password, marks the admin account as requiring a password change at next login, and deletes the one-time Script Property after applying it.

If an admin account already exists and INITIAL_ADMIN_PASSWORD is not set, running setupSystem() does not alter that account's password. Because the previous hard-coded value was publicly visible, existing installations should rotate it using the steps above unless the administrator has already changed it.

Never commit passwords, OAuth client secrets, API tokens, or other credentials to this public repository.
