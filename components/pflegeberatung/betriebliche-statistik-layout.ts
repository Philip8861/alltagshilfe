/** Seitenverhältnis statistik_betriebliche.webp (h / w) */
const STATISTIK_ASPECT = 538 / 358;

/** Max. Breite der Statistik-Grafik (rem), inkl. +30 % zu vorherigem Stand */
export const BETRIEBLICH_STATISTIK_IMG_MAX_REM = 16.25 * 1.3 * 0.7 * 1.25 * 1.3 * 1.3 * 1.3;

/**
 * Anteil der Layout-Höhe unterhalb des sichtbaren Motivs (transparenter Rand unten).
 */
export const BETRIEBLICH_STATISTIK_VISIBLE_HEIGHT_RATIO = 0.86;

/** Layout-Höhe der Grafik (rem), entspricht maxWidth × Aspekt × sichtbarer Anteil */
export const BETRIEBLICH_STATISTIK_LAYOUT_HEIGHT_REM =
  BETRIEBLICH_STATISTIK_IMG_MAX_REM * STATISTIK_ASPECT * BETRIEBLICH_STATISTIK_VISIBLE_HEIGHT_RATIO;

/**
 * Negativer oberer Rand Folgen-Band: Welle sitzt im unteren Drittel der Grafik-Layoutfläche
 * (ein Drittel der Layout-Höhe nach oben gezogen).
 */
export const BETRIEBLICH_STATISTIK_FOLGEN_OVERLAP_REM = BETRIEBLICH_STATISTIK_LAYOUT_HEIGHT_REM / 3;
