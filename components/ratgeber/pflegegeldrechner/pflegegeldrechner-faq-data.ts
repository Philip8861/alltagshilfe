import type { RatgeberFaqAccordionItem } from "@/components/ratgeber/ratgeber-faq-types";
import type { RatgeberFaqForJsonLd } from "@/lib/ratgeber/article-jsonld";

export const PFLEGEGELDRECHNER_FAQ_ITEMS: RatgeberFaqAccordionItem[] = [
  {
    id: "pg1-geld",
    question: "Bekomme ich mit Pflegegrad 1 Pflegegeld?",
    answer:
      "Nein. Mit Pflegegrad 1 gibt es kein Pflegegeld. Es können aber andere Leistungen möglich sein, zum Beispiel der Entlastungsbetrag oder Pflegehilfsmittel.",
  },
  {
    id: "pg2-betrag",
    question: "Wie viel Pflegegeld gibt es bei Pflegegrad 2?",
    answer: "Bei Pflegegrad 2 beträgt das Pflegegeld 2026 monatlich 347 €.",
  },
  {
    id: "ahs-antrag",
    question: "Hilft Alltagshilfe-Süd beim Antrag?",
    answer:
      "Ja. Alltagshilfe-Süd unterstützt beim Pflegegrad-Antrag und erklärt, welche Unterlagen und nächsten Schritte wichtig sind.",
  },
  {
    id: "abgelehnt",
    question: "Was kann ich tun, wenn der Pflegegrad abgelehnt wurde?",
    answer:
      "Wenn der Pflegegrad abgelehnt wurde oder zu niedrig ausfällt, kann ein Widerspruch sinnvoll sein. Alltagshilfe-Süd unterstützt Sie dabei.",
  },
];

export function pflegegeldrechnerFaqForJsonLd(): RatgeberFaqForJsonLd[] {
  return PFLEGEGELDRECHNER_FAQ_ITEMS.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
}
