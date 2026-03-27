import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const { pathname, search } = request.nextUrl;
    const isEnPath = pathname === "/en" || pathname.startsWith("/en/");
    const isSkippable =
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/images") ||
      pathname === "/favicon.ico";
    const normalizedPath = isEnPath ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = normalizedPath;
    const response = isEnPath && !isSkippable ? NextResponse.rewrite(rewriteUrl) : NextResponse.next();

    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(self), microphone=(self), geolocation=()"
    );
    // HSTS: nur in Produktion mit HTTPS setzen (max-age 1 Jahr, includeSubDomains)
    if (request.nextUrl.protocol === "https:") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://www.google.com https://www.gstatic.com https://meet.jit.si",
      "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://translate.google.com https://www.google.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com https://www.gstatic.com",
      "connect-src 'self' https://translate.google.com https://translate.googleapis.com https://www.google.com https://www.gstatic.com https://meet.jit.si wss://meet.jit.si",
      "frame-src 'self' https://translate.google.com https://translate.googleapis.com https://*.google.com https://meet.jit.si",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    response.headers.set("Content-Security-Policy", csp);

    const deUrl = `${request.nextUrl.origin}${normalizedPath}${search}`;
    const enPath = normalizedPath === "/" ? "/en" : `/en${normalizedPath}`;
    const enUrl = `${request.nextUrl.origin}${enPath}${search}`;
    response.headers.set(
      "Link",
      `<${deUrl}>; rel="alternate"; hreflang="de", <${enUrl}>; rel="alternate"; hreflang="en", <${deUrl}>; rel="alternate"; hreflang="x-default"`,
    );

    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap).*)"],
};
