import type { RatgeberFaqAccordionItem } from "@/components/ratgeber/ratgeber-faq-types";

export const INKONTINENZMATERIAL_AUF_REZEPT_FAQ: RatgeberFaqAccordionItem[] = [
  {
    id: "faq-windeln",
    question: "Bekommt man Windeln für Erwachsene auf Rezept?",
    answer:
      "Ja. Medizinisch notwendige Windeln oder Windelslips werden von der gesetzlichen Krankenkasse übernommen, sofern eine entsprechende ärztliche Verordnung vorliegt.",
  },
  {
    id: "faq-pants",
    question: "Zahlt die Krankenkasse auch Pants?",
    answer:
      "Ja, allerdings oft nur mit einer gezielten ärztlichen Begründung auf dem Rezept – zum Beispiel wenn herkömmliche Vorlagen aufgrund motorischer oder kognitiver Einschränkungen nicht eigenständig genutzt werden können. Ohne medizinische Begründung wird oft eine wirtschaftliche Aufzahlung fällig.",
  },
  {
    id: "faq-zuzahlung",
    question: "Wie hoch ist die Zuzahlung für Inkontinenzmaterial 2026?",
    answer:
      "Die gesetzliche Zuzahlung liegt bei 10 % der Kosten pro Packung, ist jedoch auf maximal 10 Euro für den gesamten Monatsbedarf gedeckelt. Kinder unter 18 Jahren sind hiervon befreit.",
  },
  {
    id: "faq-pflegegrad",
    question: "Brauche ich zwingend einen Pflegegrad?",
    answer:
      "Nein. Da es sich um ein medizinisches Hilfsmittel der Krankenversicherung handelt, ist kein Pflegegrad notwendig.",
  },
];

export function inkontinenzmaterialAufRezeptFaqForJsonLd(): { question: string; answer: string }[] {
  return INKONTINENZMATERIAL_AUF_REZEPT_FAQ.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
}
