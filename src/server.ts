import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

function withCacheHeaders(response: Response, request: Request): Response {
  const url = new URL(request.url);
  const path = url.pathname;
  const contentType = response.headers.get("content-type") ?? "";

  // Sequence frame images are large fixed-name WebP assets — cache aggressively.
  const isSequenceAsset =
    path.startsWith("/sequences/") ||
    path.startsWith("/sequence-12fps/") ||
    path.startsWith("/sequence-24fps/");

  // Hashed JS/CSS/image bundles from Vite build — already immutable by filename hash.
  const isHashedAsset = /\.[a-f0-9]{8,}\.(js|css|woff2?|webp|png|svg)$/.test(path);

  const headers = new Headers(response.headers);

  if (isSequenceAsset) {
    headers.set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=604800");
  } else if (isHashedAsset) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (contentType.includes("text/html")) {
    // HTML pages must always revalidate so deploys land immediately.
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return withCacheHeaders(normalized, request);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
