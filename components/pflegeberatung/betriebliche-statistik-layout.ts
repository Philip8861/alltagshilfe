/** Seitenverhältnis statistik_betriebliche.webp (h / w) */
const STATISTIK_ASPECT = 538 / 358;

/** Max. Breite der Statistik-Grafik (rem), inkl. +30 % zu vorherigem Stand */
export const BETRIEBLICH_STATISTIK_IMG_MAX_REM = 16.25 * 1.3 * 0.7 * 1.25 * 1.3 * 1.3 * 1.3;

/**
 * Volle Layout-Höhe der Grafik bei max. Breite (rem), inkl. transparentem Rand im Asset –
 * nicht abschneiden, sonst wird das Motiv am unteren Rand gekappt.
 */
export const BETRIEBLICH_STATISTIK_FULL_LAYOUT_HEIGHT_REM =
  BETRIEBLICH_STATISTIK_IMG_MAX_REM * STATISTIK_ASPECT;

/**
 * Negativer oberer Rand Folgen-Band: Welle im unteren Drittel der Grafik-Höhe (bezogen auf volle Bildhöhe).
 */
export const BETRIEBLICH_STATISTIK_FOLGEN_OVERLAP_REM = BETRIEBLICH_STATISTIK_FULL_LAYOUT_HEIGHT_REM / 3;
