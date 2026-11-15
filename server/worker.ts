interface Env {
  ASSETS: Fetcher;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        success: true,
        service: "online-store-api",
        status: "foundation-ready",
        database: "not-configured"
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ success: false, message: "API route not implemented" }, 404);
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
