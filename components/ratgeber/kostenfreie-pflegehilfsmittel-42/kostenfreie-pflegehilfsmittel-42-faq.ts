import type { RatgeberFaqAccordionItem } from "@/components/ratgeber/ratgeber-faq-types";

export const KOSTENFREIE_PFLEGEHILFSMITTEL_42_FAQ: RatgeberFaqAccordionItem[] = [
  {
    id: "faq-wer-42",
    question: "Wer bekommt Pflegehilfsmittel im Wert von 42 €?",
    answer:
      "Pflegebedürftige ab Pflegegrad 1, die zu Hause, in einer Wohngemeinschaft oder im betreuten Wohnen gepflegt werden, können Anspruch auf Pflegehilfsmittel zum Verbrauch haben.",
  },
  {
    id: "faq-rezept",
    question: "Muss ich für Pflegehilfsmittel ein Rezept haben?",
    answer:
      "Nein. Für Pflegehilfsmittel zum Verbrauch ist in der Regel kein ärztliches Rezept nötig. Ein Antrag bei der Pflegekasse genügt.",
  },
  {
    id: "faq-auszahlung",
    question: "Werden die 42 € monatlich ausgezahlt?",
    answer:
      "Meist nicht direkt. Entweder werden selbst gekaufte Produkte erstattet oder ein Anbieter rechnet direkt mit der Pflegekasse ab.",
  },
  {
    id: "faq-produkte",
    question: "Welche Produkte gehören zu den Pflegehilfsmitteln?",
    answer:
      "Dazu gehören zum Beispiel Einmalhandschuhe, Fingerlinge, Händedesinfektion, Flächendesinfektion, Schutzschürzen, Mundschutz, FFP2-Masken, Einmallätzchen und Bettschutzeinlagen zum Einmalgebrauch.",
  },
  {
    id: "faq-pg1",
    question: "Gilt der Anspruch auch bei Pflegegrad 1?",
    answer:
      "Ja. Bereits ab Pflegegrad 1 kann ein Anspruch bestehen, wenn die pflegebedürftige Person zu Hause gepflegt wird.",
  },
  {
    id: "faq-mehr-42",
    question: "Was passiert, wenn ich mehr als 42 € im Monat brauche?",
    answer:
      "Kosten über 42 € müssen in der Regel selbst getragen werden. Deshalb ist es sinnvoll, den tatsächlichen Bedarf gut zu planen und die Produkte passend auszuwählen.",
  },
  {
    id: "faq-alltagshilfe",
    question: "Hilft Alltagshilfe-Süd beim Antrag?",
    answer:
      "Ja. Alltagshilfe-Süd unterstützt beim Pflegegrad-Antrag, beim Widerspruch, bei Fragen zu Pflegeleistungen und bei der passenden Versorgung mit Pflegehilfsmitteln.",
  },
  {
    id: "faq-inkontinenz",
    question: "Was ist der Unterschied zwischen Pflegehilfsmitteln und Inkontinenzprodukten?",
    answer:
      "Pflegehilfsmittel sind zum Beispiel Handschuhe, Desinfektion oder Schutzschürzen. Inkontinenzprodukte wie Windeln, Pants oder Vorlagen laufen häufig über die Krankenkasse und benötigen meist ein Rezept.",
  },
];

export function kostenfreiePflegehilfsmittel42FaqForJsonLd(): { question: string; answer: string }[] {
  return KOSTENFREIE_PFLEGEHILFSMITTEL_42_FAQ.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
}
