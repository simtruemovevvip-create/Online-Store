interface Env {
  ASSETS: Fetcher;
  /** Apps Script Web App URL; configure with: wrangler secret put GAS_WEB_APP_URL */
  GAS_WEB_APP_URL?: string;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });

function isValidGasUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "script.google.com" &&
      url.pathname.includes("/macros/s/") &&
      url.pathname.endsWith("/exec");
  } catch {
    return false;
  }
}

/**
 * Transitional API bridge:
 * Vite frontend -> Cloudflare Worker -> Apps Script Web App -> Google Sheets.
 * The Apps Script URL is kept as a Worker secret and is never sent to the browser.
 */
async function proxyToAppsScript(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET" && request.method !== "POST") {
    return json({ success: false, message: "Method not allowed" }, 405);
  }

  const gasUrl = env.GAS_WEB_APP_URL;
  if (!gasUrl || !isValidGasUrl(gasUrl)) {
    return json({
      success: false,
      code: "GAS_BACKEND_NOT_CONFIGURED",
      message: "Apps Script backend is not configured."
    }, 503);
  }

  const incoming = new URL(request.url);
  const target = new URL(gasUrl);
  incoming.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const upstream = await fetch(target.toString(), {
    method: request.method,
    headers,
    body: request.method === "POST" ? await request.arrayBuffer() : undefined,
    redirect: "follow"
  });

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("content-type", upstreamType);
  responseHeaders.set("cache-control", "no-store");
  responseHeaders.set("x-content-type-options", "nosniff");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        success: true,
        service: "online-store-api",
        status: "foundation-ready",
        database: "google-sheets-via-apps-script",
        backendConfigured: Boolean(env.GAS_WEB_APP_URL && isValidGasUrl(env.GAS_WEB_APP_URL))
      });
    }

    if (url.pathname === "/api/legacy" || url.pathname.startsWith("/api/legacy/")) {
      return proxyToAppsScript(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ success: false, message: "API route not implemented" }, 404);
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
