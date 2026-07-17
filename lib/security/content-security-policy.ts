/**
 * Content-Security-Policy – zentral für middleware.ts
 * @see https://developers.google.com/tag-manager/web/csp
 */

/** GTM-Bootstrap, GA4-Tags, Preview/Tag Assistant, optionale Ads-Beacons */
const GOOGLE_TAG_PLATFORM_SCRIPT = [
  "https://www.googletagmanager.com",
  "https://googletagmanager.com",
  "https://*.googletagmanager.com",
  "https://tagmanager.google.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://ssl.google-analytics.com",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
  "https://pagead2.googlesyndication.com",
  "https://www.google.com",
  "https://google.com",
].join(" ");

const GOOGLE_TAG_PLATFORM_IMG = [
  "https://www.googletagmanager.com",
  "https://googletagmanager.com",
  "https://*.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.g.doubleclick.net",
  "https://www.google.com",
  "https://google.com",
  "https://www.googleadservices.com",
  "https://pagead2.googlesyndication.com",
  "https://ssl.gstatic.com",
  "https://www.gstatic.com",
].join(" ");

const GOOGLE_TAG_PLATFORM_CONNECT = [
  "https://www.googletagmanager.com",
  "https://googletagmanager.com",
  "https://*.googletagmanager.com",
  "https://tagmanager.google.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.g.doubleclick.net",
  "https://googleads.g.doubleclick.net",
  "https://ad.doubleclick.net",
  "https://pagead2.googlesyndication.com",
  "https://www.googleadservices.com",
  "https://www.google.com",
  "https://google.com",
  "https://*.google.com",
].join(" ");

/** Meta Pixel (Consent: Marketing) – fbevents.js */
const META_PIXEL_SCRIPT = "https://connect.facebook.net https://www.facebook.com";
const META_PIXEL_CONNECT = "https://connect.facebook.net https://www.facebook.com https://graph.facebook.com";

const TRANSLATE_SCRIPT =
  "https://translate.google.com https://translate.googleapis.com https://www.google.com https://www.gstatic.com";
const JITSI = "https://meet.jit.si wss://meet.jit.si";
const SUPABASE = "https://*.supabase.co wss://*.supabase.co";

const SCRIPT_COMMON = `'self' 'unsafe-inline' 'unsafe-eval' ${TRANSLATE_SCRIPT} ${JITSI} ${GOOGLE_TAG_PLATFORM_SCRIPT} ${META_PIXEL_SCRIPT}`;

/** GTM-UI und Tag Assistant prüfen script-src-elem explizit */
const SCRIPT_ELEM = SCRIPT_COMMON;

export function buildContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "object-src 'none'",
    `script-src ${SCRIPT_COMMON}`,
    `script-src-elem ${SCRIPT_ELEM}`,
    `style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://translate.google.com https://www.google.com https://tagmanager.google.com https://googletagmanager.com https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https: ${GOOGLE_TAG_PLATFORM_IMG}`,
    "font-src 'self' https://fonts.gstatic.com https://www.gstatic.com data:",
    `connect-src 'self' ${TRANSLATE_SCRIPT} ${JITSI} ${SUPABASE} ${GOOGLE_TAG_PLATFORM_CONNECT} ${META_PIXEL_CONNECT}`,
    "worker-src 'self' blob:",
    `frame-src 'self' https://translate.google.com https://translate.googleapis.com https://*.google.com https://meet.jit.si https://www.googletagmanager.com https://googletagmanager.com https://*.googletagmanager.com https://tagmanager.google.com`,
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}
