import type { NextRequest } from "next/server";

/** Gleiche Normalisierung wie beim Zählen (EN-Pfad → deutsch-logischer Pfad). */
export function normalizePathForSiteAnalytics(pathname: string): string {
  const raw = pathname.trim() || "/";
  if (raw === "/en" || raw.startsWith("/en/")) {
    const rest = raw.replace(/^\/en(?=\/|$)/, "") || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function shouldRecordSitePageView(request: NextRequest, normalizedPath: string): boolean {
  if (request.method !== "GET") return false;

  if (normalizedPath.startsWith("/api")) return false;
  if (normalizedPath.startsWith("/_next")) return false;
  if (normalizedPath.startsWith("/partner")) return false;
  if (normalizedPath.startsWith("/auth")) return false;
  if (normalizedPath === "/favicon.ico" || normalizedPath === "/robots.txt") return false;
  if (normalizedPath.includes(".")) {
    const lower = normalizedPath.toLowerCase();
    if (
      lower.endsWith(".ico") ||
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".svg") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".txt") ||
      lower.endsWith(".xml") ||
      lower.endsWith(".json") ||
      lower.endsWith(".pdf") ||
      lower.endsWith(".woff") ||
      lower.endsWith(".woff2")
    ) {
      return false;
    }
  }

  if (request.headers.get("sec-purpose") === "prefetch") return false;
  if (request.headers.get("next-router-prefetch") === "1") return false;
  if (request.nextUrl.searchParams.has("_rsc")) return false;

  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return false;

  if (normalizedPath.length > 2048) return false;

  return true;
}

/** Nur Pfadprüfung für Client-seitige Navigation (kein sec-fetch / Prefetch-Header vom Browser). */
export function shouldRecordClientSpaNavigation(normalizedPath: string): boolean {
  if (normalizedPath.startsWith("/api")) return false;
  if (normalizedPath.startsWith("/_next")) return false;
  if (normalizedPath.startsWith("/partner")) return false;
  if (normalizedPath.startsWith("/auth")) return false;
  if (normalizedPath === "/favicon.ico" || normalizedPath === "/robots.txt") return false;
  if (normalizedPath.includes(".")) {
    const lower = normalizedPath.toLowerCase();
    if (
      lower.endsWith(".ico") ||
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".svg") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".txt") ||
      lower.endsWith(".xml") ||
      lower.endsWith(".json") ||
      lower.endsWith(".pdf") ||
      lower.endsWith(".woff") ||
      lower.endsWith(".woff2")
    ) {
      return false;
    }
  }
  if (normalizedPath.length > 2048) return false;
  return true;
}
