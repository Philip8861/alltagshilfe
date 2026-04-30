import type { RatgeberFaqAccordionItem } from "@/components/ratgeber/ratgeber-faq-types";

export const PFLEGEGRAD1_ARTICLE_FAQ: RatgeberFaqAccordionItem[] = [
  {
    id: "pg1-faq-was-bekommt-man",
    question: "Was bekommt man bei Pflegegrad 1?",
    answer:
      "Bei Pflegegrad 1 erhält man vor allem den Entlastungsbetrag von bis zu 131 Euro monatlich. Zusätzlich können Pflegeberatung, Pflegekurse, Pflegehilfsmittel zum Verbrauch, technische Pflegehilfsmittel und Zuschüsse für Wohnraumanpassungen möglich sein.",
  },
  {
    id: "pg1-faq-pflegegeld",
    question: "Gibt es Pflegegeld bei Pflegegrad 1?",
    answer:
      "Nein. Pflegegeld wird erst ab Pflegegrad 2 gezahlt. Bei Pflegegrad 1 gibt es keine monatliche Geldzahlung zur freien Verfügung.",
  },
  {
    id: "pg1-faq-haushaltshilfe",
    question: "Kann ich mit Pflegegrad 1 eine Haushaltshilfe bekommen?",
    answer:
      "Ja, unter bestimmten Voraussetzungen kann der Entlastungsbetrag für anerkannte Unterstützung im Haushalt eingesetzt werden. Wichtig ist, dass die Leistung anerkannt ist und korrekt mit der Pflegekasse abgerechnet wird.",
  },
  {
    id: "pg1-faq-entlastung-hoehe",
    question: "Wie hoch ist der Entlastungsbetrag bei Pflegegrad 1?",
    answer:
      "Der Entlastungsbetrag beträgt bis zu 131 Euro monatlich. Das sind bis zu 1.572 Euro im Jahr. Nicht genutzte Beträge können in Folgemonate übertragen werden.",
  },
  {
    id: "pg1-faq-ansparen",
    question: "Kann der Entlastungsbetrag angespart werden?",
    answer:
      "Ja. Nicht verbrauchte Beträge werden in die folgenden Monate übertragen. Beträge, die am Jahresende nicht genutzt wurden, können in der Regel noch bis zum 30. Juni des Folgejahres verwendet werden.",
  },
  {
    id: "pg1-faq-verhinderung",
    question: "Gibt es Verhinderungspflege bei Pflegegrad 1?",
    answer:
      "Nein. Verhinderungspflege gibt es grundsätzlich erst ab Pflegegrad 2. Bei Pflegegrad 1 können aber andere Entlastungsleistungen genutzt werden, insbesondere der Entlastungsbetrag.",
  },
  {
    id: "pg1-faq-kurzzeit",
    question: "Gibt es Kurzzeitpflege bei Pflegegrad 1?",
    answer:
      "Ein eigener regulärer Leistungsbetrag für Kurzzeitpflege besteht bei Pflegegrad 1 nicht wie bei höheren Pflegegraden. Der Entlastungsbetrag kann aber unter bestimmten Voraussetzungen auch für Kurzzeitpflege eingesetzt werden.",
  },
  {
    id: "pg1-faq-hilfsmittel",
    question: "Kann man mit Pflegegrad 1 Pflegehilfsmittel bekommen?",
    answer:
      "Ja. Pflegebedürftige mit Pflegegrad 1 können Pflegehilfsmittel zum Verbrauch im Wert von bis zu 42 Euro monatlich erhalten, wenn die Voraussetzungen erfüllt sind.",
  },
  {
    id: "pg1-faq-hausnotruf",
    question: "Wird ein Hausnotruf bei Pflegegrad 1 bezahlt?",
    answer:
      "Ein Hausnotruf kann als technisches Pflegehilfsmittel möglich sein, wenn die Pflegekasse die Notwendigkeit anerkennt. Die Entscheidung hängt vom Einzelfall ab.",
  },
  {
    id: "pg1-faq-widerspruch-wann",
    question: "Wann sollte man Widerspruch einlegen?",
    answer:
      "Ein Widerspruch kann sinnvoll sein, wenn kein Pflegegrad bewilligt wurde oder der festgestellte Pflegegrad aus Sicht der Familie zu niedrig ist. Wichtig ist, die Frist im Bescheid zu beachten und den tatsächlichen Hilfebedarf konkret zu begründen.",
  },
  {
    id: "pg1-faq-ahs",
    question: "Kann Alltagshilfe-Süd beim Pflegegrad helfen?",
    answer:
      "Ja. Alltagshilfe-Süd kann beim Antrag auf einen Pflegegrad, bei Fragen zum Bescheid und auch beim Widerspruch unterstützen. Außerdem helfen wir dabei, passende Leistungen wie Entlastungsbetrag, Haushaltshilfe, Alltagsbegleitung, Pflegehilfsmittel oder weitere Unterstützungsangebote sinnvoll zu nutzen.",
  },
];

export function pflegegrad1FaqForJsonLd(): { question: string; answer: string }[] {
  return PFLEGEGRAD1_ARTICLE_FAQ.map((item) => ({ question: item.question, answer: item.answer }));
}
