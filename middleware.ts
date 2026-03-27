import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next();

    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
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
      "script-src 'self' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://translate.google.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://translate.google.com https://translate.googleapis.com",
      "frame-src 'self' https://translate.google.com https://*.google.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    response.headers.set("Content-Security-Policy", csp);

    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap).*)"],
};
