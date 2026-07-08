import type { HilfefinderServiceKey } from "@/config/hilfefinder-services";
import { ZENTRALE_WHATSAPP_WA_ME_URL } from "@/config/standorte";

/** Zentrale Texte & Links – hier anpassen, wenn sich Werbetexte ändern sollen. */
export const INKO_REZEPT_CTA_PHONE_DISPLAY = "08334 / 9893330";
export const INKO_REZEPT_CTA_PHONE_HREF = "tel:+4983349893330";
export const INKO_REZEPT_CTA_EMAIL = "info@alltagshilfe-sued.de";
export const INKO_REZEPT_CTA_EMAIL_HREF = `mailto:${INKO_REZEPT_CTA_EMAIL}`;
export const INKO_REZEPT_CTA_WHATSAPP_HREF = ZENTRALE_WHATSAPP_WA_ME_URL;

export const INKO_REZEPT_KONTAKT_HREF =
  "/kontakt?thema=inkontinenzversorgung&utm_source=ratgeber&utm_medium=cta&utm_campaign=inko_rezept";

export const INKO_REZEPT_POPUP_KONTAKT_HREF =
  "/kontakt?thema=inkontinenzversorgung&utm_source=ratgeber&utm_medium=popup_30s&utm_campaign=inko_rezept";

/** Kontaktformular mit Standort Bad Grönenbach (Zentrale Allgäu, PLZ 87730) */
export const INKO_REZEPT_BAD_GROENENBACH_PLZ = "87730";
export const INKO_REZEPT_KONTAKT_BAD_GROENENBACH_HREF =
  `/kontakt?plz=${INKO_REZEPT_BAD_GROENENBACH_PLZ}&thema=inkontinenzversorgung&utm_source=ratgeber&utm_medium=choice_kontakt&utm_campaign=inko_rezept`;

export const INKO_REZEPT_BERATUNG_SERVICES: HilfefinderServiceKey[] = ["hilfsmittel"];

export const INKO_REZEPT_CTA_DISMISS_DAYS = 7;
export const INKO_REZEPT_TIMED_POPUP_MS = 10_000;

export const INKO_REZEPT_CTA_STORAGE_KEYS = {
  popupDismissedUntil: "ahs_inko_rezept_popup_dismissed_until",
  exitDismissedUntil: "ahs_inko_rezept_exit_dismissed_until",
  ctaClickedSession: "ahs_inko_rezept_cta_clicked",
  popupShownSession: "ahs_inko_rezept_popup_shown_session",
  exitShownSession: "ahs_inko_rezept_exit_shown_session",
} as const;

export const INKO_REZEPT_RATGEBER_SLUG = "inkontinenzmaterial-auf-rezept-anspruch-kosten-ablauf" as const;

export const INKO_PRODUKT_RATGEBER_SLUG = "einlagen-vorlagen-pants-windeln-inkontinenzmaterial" as const;

/** Ratgeber mit Inkontinenz-CTAs und 30s-Popup */
export const INKO_RATGEBER_SLUGS = [INKO_REZEPT_RATGEBER_SLUG, INKO_PRODUKT_RATGEBER_SLUG] as const;

/** Hintergrundbild für feste Werbe-CTAs im Artikel (nicht in Popups) */
export const INKO_REZEPT_ARTICLE_CTA_BG = "/images/Ratgeber/Landing_page.webp";

export function isInkoRezeptRatgeberSlug(slug: string): boolean {
  return (INKO_RATGEBER_SLUGS as readonly string[]).includes(slug);
}

export function isInkoRezeptRatgeberPath(pathname: string): boolean {
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  return isInkoRezeptRatgeberSlug(slug);
}

/** Trust-Punkte für Inline- und Abschluss-CTA */
export const INKO_REZEPT_TRUST_INLINE = [
  "Von Pflegekräften empfohlen",
  "Rezeptabrechnung möglich",
  "Schnell und diskret geliefert",
  "Kostenloses Testpaket auf Wunsch",
] as const;

export const INKO_REZEPT_TRUST_END = [
  "Kostenlose Beratung",
  "Rezeptabrechnung möglich",
  "Geprüfte Markenprodukte",
  "Diskrete Lieferung nach Hause",
] as const;
