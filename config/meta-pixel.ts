/**
 * Meta Pixel (Facebook) – Datensatz-ID für Marketing-Messung.
 *
 * Consent-gated Laden in `components/analytics/MetaPixel.tsx` (nur Kategorie Marketing).
 * Kein Advanced Matching, keine Formular-/PII-Übermittlung im Code.
 *
 * Wichtig: Falls im GTM-Container (GTM-NTZ7VJJC) ebenfalls ein Meta-Pixel-Tag aktiv ist,
 * dieses dort deaktivieren – sonst doppelte PageViews.
 */
export const META_PIXEL_ID =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()) ||
  "1024375210460935";
