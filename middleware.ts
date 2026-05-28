import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildStandortPageHref, findStandortByPlz, getOrtByPlz } from "@/config/standorte";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  hasAnalyticsConsentFromCookieValue,
  hasTranslationConsentFromCookieValue,
} from "@/lib/consent-server";
import { fireSitePageViewIfEligible } from "@/lib/site-analytics/middleware-fire";
import { applyPartnerSupabaseSession } from "@/lib/supabase/partner-middleware";
import { buildContentSecurityPolicy } from "@/lib/security/content-security-policy";

function applySecurityAndSeoHeaders(
  response: NextResponse,
  request: NextRequest,
  normalizedPath: string,
  search: string,
) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(), interest-cohort=()",
  );
  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy());

  const deUrl = `${request.nextUrl.origin}${normalizedPath}${search}`;
  const enPath = normalizedPath === "/" ? "/en" : `/en${normalizedPath}`;
  const enUrl = `${request.nextUrl.origin}${enPath}${search}`;
  response.headers.set(
    "Link",
    `<${deUrl}>; rel="alternate"; hreflang="de", <${enUrl}>; rel="alternate"; hreflang="en", <${deUrl}>; rel="alternate"; hreflang="x-default"`,
  );
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname, search } = request.nextUrl;
    const isEnPath = pathname === "/en" || pathname.startsWith("/en/");
    const normalizedPath = isEnPath ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;

    const consentCookie = request.cookies.get("cookie_consent")?.value;
    if (
      isEnPath &&
      !hasTranslationConsentFromCookieValue(consentCookie) &&
      !normalizedPath.startsWith("/api")
    ) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = normalizedPath;
      const response = NextResponse.redirect(redirectUrl, 307);
      applySecurityAndSeoHeaders(response, request, normalizedPath, search);
      return response;
    }

    /** Alte PLZ-Landingpages (/standorte/87700-memmingen) → feste Standortseite mit Kontext. */
    const legacyPlzStandort = normalizedPath.match(/^\/standorte\/(\d{5})-/);
    if (legacyPlzStandort) {
      const plz = legacyPlzStandort[1];
      const standort = findStandortByPlz(plz);
      if (standort) {
        const ort = getOrtByPlz(plz);
        const rel = ort ? buildStandortPageHref(standort, { plz, ort }) : buildStandortPageHref(standort);
        const dest = new URL(rel, request.url);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = isEnPath ? `/en${dest.pathname}` : dest.pathname;
        redirectUrl.search = dest.search;
        const redirectResponse = NextResponse.redirect(redirectUrl, 308);
        applySecurityAndSeoHeaders(redirectResponse, request, normalizedPath, search);
        return redirectResponse;
      }
    }
    const isSkippable =
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/images") ||
      pathname === "/favicon.ico";
    /** Nur echtes Partnerportal — nicht z. B. `/partner-demo` (öffentliche Vorschau). */
    const isPartnerRoute =
      normalizedPath === "/partner" || normalizedPath.startsWith("/partner/");
    /** Sync-Route baut Session + Profil selbst; Middleware-Refresh hier auslassen (sonst oft „angemeldet“ ohne lesbare Session in der Route). */
    const skipPartnerMiddlewareAuth = normalizedPath === "/partner/sync-profile";

    const createBase = () =>
      isEnPath && !isSkippable
        ? NextResponse.rewrite(
            (() => {
              const rewriteUrl = request.nextUrl.clone();
              rewriteUrl.pathname = normalizedPath;
              return rewriteUrl;
            })(),
          )
        : NextResponse.next({ request });

    let response: NextResponse;
    if (isPartnerRoute && isSupabaseConfigured() && !skipPartnerMiddlewareAuth) {
      response = await applyPartnerSupabaseSession(request, createBase);
    } else {
      response = createBase();
    }

    applySecurityAndSeoHeaders(response, request, normalizedPath, search);
    if (!isSkippable && !isPartnerRoute && hasAnalyticsConsentFromCookieValue(consentCookie)) {
      fireSitePageViewIfEligible(request, normalizedPath);
    }
    return response;
  } catch {
    try {
      const { pathname, search } = request.nextUrl;
      const isEnPath = pathname === "/en" || pathname.startsWith("/en/");
      const normalizedPath = isEnPath ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
      const res = NextResponse.next();
      applySecurityAndSeoHeaders(res, request, normalizedPath, search);
      return res;
    } catch {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap).*)"],
};
