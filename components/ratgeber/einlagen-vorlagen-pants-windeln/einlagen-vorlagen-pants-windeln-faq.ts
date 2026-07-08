import type { RatgeberFaqAccordionItem } from "@/components/ratgeber/ratgeber-faq-types";

export const EINLAGEN_VORLAGEN_PANTS_WINDELN_FAQ: RatgeberFaqAccordionItem[] = [
  {
    id: "faq-einlagen-pants",
    question: "Was ist besser: Einlagen oder Pants?",
    answer:
      "Einlagen eignen sich eher bei leichter Inkontinenz. Pants sind sinnvoll, wenn mehr Sicherheit gebraucht wird oder Betroffene eine unterwäscheähnliche Lösung möchten. Bei stärkerer Inkontinenz können Vorlagen oder Windelhosen besser sein.",
  },
  {
    id: "faq-vorlagen-einlagen",
    question: "Was ist der Unterschied zwischen Vorlagen und Einlagen?",
    answer:
      "Einlagen sind meist kleiner und dünner. Vorlagen sind größer, saugstärker und werden mit einer Fixierhose getragen. Vorlagen eignen sich häufiger bei mittlerer bis stärkerer Inkontinenz.",
  },
  {
    id: "faq-pants-wann",
    question: "Wann sind Pants sinnvoll?",
    answer:
      "Pants sind sinnvoll bei mobilen Menschen, bei Wunsch nach diskreter Versorgung, bei erhaltener Toilettennutzung oder wenn andere Produkte wegen Demenz oder eingeschränkter Handmotorik nicht gut funktionieren.",
  },
  {
    id: "faq-windeln-erwachsene",
    question: "Wann sind Windeln für Erwachsene besser?",
    answer:
      "Windelhosen sind oft besser bei schwerer Inkontinenz, Stuhlinkontinenz, Bettlägerigkeit oder wenn Angehörige beim Wechsel helfen.",
  },
  {
    id: "faq-pants-rezept",
    question: "Sind Pants auf Rezept möglich?",
    answer:
      "Ja, Pants können bei medizinischer Notwendigkeit möglich sein. Wichtig ist eine gute ärztliche Begründung, besonders wenn Vorlagen mit Fixierhose nicht ausreichen oder nicht zweckmäßig sind.",
  },
  {
    id: "faq-nacht",
    question: "Was ist nachts besser: Pants oder Windeln?",
    answer:
      "Das hängt von Mobilität, Saugbedarf und Wechselmöglichkeit ab. Mobile Menschen können mit Nacht-Pants zurechtkommen. Bei Bettlägerigkeit oder schwerer Inkontinenz sind Windelhosen oft praktischer.",
  },
  {
    id: "faq-bettschutz",
    question: "Helfen Bettschutzeinlagen gegen nächtliches Auslaufen?",
    answer:
      "Sie schützen die Matratze, lösen aber nicht die Ursache. Wenn das Produkt regelmäßig ausläuft, sollte die körpernahe Versorgung überprüft werden.",
  },
  {
    id: "faq-demenz",
    question: "Welches Inkontinenzmaterial ist bei Demenz am besten?",
    answer:
      "Bei mobilen Menschen mit Demenz können Pants sinnvoll sein, weil sie normaler Unterwäsche ähneln. Bei stärkerer Pflegebedürftigkeit können Windelhosen praktischer sein.",
  },
  {
    id: "faq-testen",
    question: "Kann ich Inkontinenzprodukte testen?",
    answer:
      "Ja, viele Anbieter bieten Muster oder Testpakete an. Das ist sinnvoll, weil Passform, Saugstärke und Hautverträglichkeit individuell unterschiedlich sind.",
  },
  {
    id: "faq-krankenkasse",
    question: "Zahlt die Krankenkasse Inkontinenzmaterial?",
    answer:
      "Bei medizinischer Notwendigkeit und ärztlicher Verordnung können gesetzliche Krankenkassen Inkontinenzhilfen übernehmen. Voraussetzung ist in der Regel mindestens mittelgradige Harn- und/oder Stuhlinkontinenz.",
  },
];

export function einlagenVorlagenPantsWindelnFaqForJsonLd(): { question: string; answer: string }[] {
  return EINLAGEN_VORLAGEN_PANTS_WINDELN_FAQ.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
}
