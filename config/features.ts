/**
 * Feature-Flags für Konfigurator, Blog, etc.
 * Später ggf. aus Umgebungsvariablen.
 */
export const features = {
  configurator: true,
  blog: false, // Phase 2
  /** Wieder `true`, wenn „Essen auf Räder“ in Nav, Kacheln, Hilfefinder & Co. sichtbar sein soll. */
  essenAufRaederVisible: false,
} as const;
