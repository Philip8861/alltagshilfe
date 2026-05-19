import type { RatgeberFaqAccordionItem } from "@/components/ratgeber/ratgeber-faq-types";
import { PFLEGEBERATUNG_RHYTHMUS_FAQ_ANSWER } from "@/lib/pflegeberatung-sgb-xi-rhythm";

export type PflegegradFaqItem = RatgeberFaqAccordionItem;

/** FAQ nur für diese Ratgeberseite (JSON-LD + Darstellung): 8 Fragen. */
export const PFLEGEGRAD_ARTICLE_FAQ: RatgeberFaqAccordionItem[] = [
  {
    id: "faq-antwort-beantrag-wo",
    question: "Wie beantrage ich einen Pflegegrad?",
    answer:
      "Sie beantragen den Pflegegrad bei der Pflegekasse der betroffenen Person. Diese ist bei der jeweiligen Krankenkasse eingerichtet. Der Antrag kann telefonisch, schriftlich oder je nach Pflegekasse online gestellt werden.",
  },
  {
    id: "faq-angehoerige-beantragen",
    question: "Können Angehörige den Pflegegrad beantragen?",
    answer:
      "Ja, Angehörige können den Antrag stellen, wenn sie dazu bevollmächtigt sind. Eine schriftliche Vollmacht ist empfehlenswert, damit Rückfragen und weitere Schritte einfacher möglich sind.",
  },
  {
    id: "faq-dauer-entscheidung",
    question: "Wie lange dauert die Entscheidung über den Pflegegrad?",
    answer:
      "Die gesetzliche Bearbeitungsfrist beträgt grundsätzlich 25 Arbeitstage. In besonderen Situationen, zum Beispiel bei einem Krankenhausaufenthalt oder wenn die weitere Versorgung schnell organisiert werden muss, können kürzere Fristen gelten.",
  },
  {
    id: "faq-was-passiert-begutachtung",
    question: "Was passiert bei der Begutachtung?",
    answer:
      "Bei der Begutachtung wird geprüft, wie selbstständig die betroffene Person im Alltag ist. Es geht unter anderem um Mobilität, Selbstversorgung, Orientierung, Kommunikation, Umgang mit Medikamenten und die Gestaltung des Alltags.",
  },
  {
    id: "faq-angehoeriger-dabei",
    question: "Muss ein Angehöriger bei der Begutachtung dabei sein?",
    answer:
      "Es ist sehr empfehlenswert. Angehörige kennen den Alltag oft besser und können ergänzen, welche Hilfe regelmäßig nötig ist. Das ist besonders wichtig, wenn die betroffene Person ihren Hilfebedarf aus Scham, Unsicherheit oder Vergesslichkeit zu gering darstellt.",
  },
  {
    id: "faq-diagnose-oder-alltag",
    question: "Was zählt mehr: Diagnose oder Alltag?",
    answer:
      "Für den Pflegegrad ist nicht allein die Diagnose entscheidend. Wichtig ist, wie stark die Selbstständigkeit im Alltag eingeschränkt ist und wobei regelmäßig Unterstützung benötigt wird.",
  },
  {
    id: "faq-ablehnung",
    question: "Was kann ich tun, wenn der Pflegegrad abgelehnt wird?",
    answer:
      "Sie können Widerspruch einlegen. Die Frist beträgt grundsätzlich einen Monat ab Zugang des Bescheids. Fordern Sie das Gutachten an, prüfen Sie die Bewertung und begründen Sie den Widerspruch möglichst konkret. Alltagshilfe-Süd kann Sie dabei unterstützen.",
  },
  {
    id: "faq-pflegeberatung-turnus",
    question: "Wie oft ist die Pflegeberatung nach § 37 Abs. 3 SGB XI Pflicht?",
    answer: PFLEGEBERATUNG_RHYTHMUS_FAQ_ANSWER,
  },
  {
    id: "faq-alltagshilfe-hilft",
    question: "Kann Alltagshilfe-Süd beim Pflegegrad helfen?",
    answer:
      "Ja. Alltagshilfe-Süd unterstützt bei der ersten Orientierung, beim Pflegegrad-Antrag, bei der Vorbereitung auf die Begutachtung und beim Widerspruch. Außerdem helfen wir bei passenden Leistungen wie Entlastungsbetrag, Haushaltsreinigung, Alltagsbegleitung, Pflegehilfsmitteln, Inkontinenzversorgung über Rezept und weiteren Unterstützungsangeboten.",
  },
];

export function pflegegradBeantragenFaqForJsonLd(): { question: string; answer: string }[] {
  return PFLEGEGRAD_ARTICLE_FAQ.map((item) => ({ question: item.question, answer: item.answer }));
}
