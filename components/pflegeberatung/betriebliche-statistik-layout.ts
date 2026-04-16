/** Natürliche Pixelmaße von public/images/statistik_betriebliche.webp */
const STATISTIK_IMG = { w: 358, h: 538 } as const;

/**
 * Max. Breite der Statistik-Grafik (rem).
 * Folgen-Welle: 10 % der sichtbaren Bildhöhe ≈ maxBreite × (h/w) × 0,1 als Überlapp nach oben.
 */
export const BETRIEBLICH_STATISTIK_IMG_MAX_REM = 16.25 * 1.3 * 0.7 * 1.25 * 1.3;

export const BETRIEBLICH_STATISTIK_FOLGEN_OVERLAP_REM =
  BETRIEBLICH_STATISTIK_IMG_MAX_REM * (STATISTIK_IMG.h / STATISTIK_IMG.w) * 0.1;
