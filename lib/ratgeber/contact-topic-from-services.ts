import type { HilfefinderServiceKey } from "@/config/hilfefinder-services";
import type { ContactFormData } from "@/lib/validations/contact";

const MAP: Record<HilfefinderServiceKey, ContactFormData["topic"]> = {
  pflegegrad_beantrag_widerspruch: "Private Pflegeberatung",
  haushalt: "Haushaltshilfe & Betreuung",
  assistenz_alltag_behinderung: "Assistenz im Alltag für Menschen mit Behinderung",
  pflegeberatung: "Private Pflegeberatung",
  pflegebox: "Kostenfreie Pflegehilfsmittel",
  koerperpflege: "Private Pflegeberatung",
  medizinisch: "Private Pflegeberatung",
  umbau: "Private Pflegeberatung",
  hausnotruf: "Private Pflegeberatung",
  hilfsmittel: "Kostenfreie Pflegehilfsmittel",
  essen: "Haushaltshilfe & Betreuung",
};

/** Erste gewählte Leistung bestimmt das Kontakt-Thema (Dropdown auf /kontakt-Schema). */
export function contactTopicFromHilfefinderServices(
  keys: HilfefinderServiceKey[],
): ContactFormData["topic"] {
  const first = keys[0];
  if (first && MAP[first]) return MAP[first];
  return "Private Pflegeberatung";
}
