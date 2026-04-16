/** Max. Breite der Statistik-Grafik (rem), zuletzt +30 % ggü. vorherigem Wert */
export const BETRIEBLICH_STATISTIK_IMG_MAX_REM = 16.25 * 1.3 * 0.7 * 1.25 * 1.3 * 1.3;

/**
 * Anteil der Layout-Höhe unterhalb des sichtbaren Motivs (transparenter Rand unten).
 * Reduziert die Kastenhöhe, damit die Folgen-Welle nicht unter „leerem“ PNG-Bereich liegt.
 */
export const BETRIEBLICH_STATISTIK_VISIBLE_HEIGHT_RATIO = 0.86;

/** Kein negativer Margin mehr: Welle liegt vollständig unter der Grafik und wird nicht beschnitten */
export const BETRIEBLICH_STATISTIK_FOLGEN_OVERLAP_REM = 0;
