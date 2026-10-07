import type { RatgeberFaqAccordionItem } from "@/components/ratgeber/ratgeber-faq-types";

/**
 * FAQ zum Beitrag „Pflegereform 2027: Diese 7 Dinge …“ — ausschließlich aus dem Beitragstext abgeleitet
 * (Stand 7. Oktober 2026), keine zusätzlichen Fakten.
 */
export const PFLEGEREFORM2027_ARTICLE_FAQ: RatgeberFaqAccordionItem[] = [
  {
    id: "pr27-faq-beschlossen",
    question: "Ist die Pflegereform 2027 schon beschlossen?",
    answer:
      "Nein. Am 30. September 2026 hat das Bundeskabinett den Entwurf des Pflegeneuordnungsgesetzes beschlossen. Der Gesetzentwurf muss aber noch durch das weitere parlamentarische Verfahren. Einzelne Regelungen können sich dabei noch ändern. Die Reform ist damit noch kein geltendes Recht.",
  },
  {
    id: "pr27-faq-pflegegrad-verlieren",
    question: "Verliere ich meinen Pflegegrad, wenn die Schwellenwerte 2027 steigen?",
    answer:
      "Nach dem aktuellen Entwurf nicht. Die Voraussetzungen für die Pflegegrade 1 bis 3 sollen zwar verschärft und die Schwellenwerte bei der Begutachtung angehoben werden. Für bereits anerkannte Pflegegrade ist aber ein Besitzstandsschutz vorgesehen: Niemand soll seinen Pflegegrad allein deshalb verlieren, weil die neuen Grenzwerte eingeführt werden.",
  },
  {
    id: "pr27-faq-entlastungsbetrag-pg1",
    question: "Was soll mit dem Entlastungsbetrag bei Pflegegrad 1 passieren?",
    answer:
      "Bei Pflegegrad 1 soll der heutige Entlastungsbetrag von 131 Euro monatlich entfallen. Stattdessen soll Pflegegrad 1 stärker auf Prävention, Beratung und Begleitung ausgerichtet werden. In den Pflegegraden 2 bis 5 soll der Entlastungsbetrag nach dem derzeitigen Entwurf in einem neuen Sozialraumbudget aufgehen, vorgesehen sind dort 175 Euro monatlich.",
  },
  {
    id: "pr27-faq-hoeherstufung-2026",
    question: "Sollte ich eine Höherstufung noch 2026 beantragen?",
    answer:
      "Nur, wenn sich der Pflegebedarf wirklich verändert hat. Der Gesetzentwurf sieht vor, dass grundsätzlich das Recht gilt, das zum Zeitpunkt der Antragstellung maßgeblich ist. Da die Schwellenwerte für die Pflegegrade 1 bis 3 ab 2027 steigen sollen, raten Sozialverbände und Patientenorganisationen Menschen mit bestehendem Pflegebedarf, eine notwendige Antragstellung noch 2026 zu prüfen. Niemand sollte aus Angst vor der Reform irgendeinen Antrag stellen.",
  },
  {
    id: "pr27-faq-entlastungsbetrag-verfall",
    question: "Verfällt nicht genutzter Entlastungsbetrag aus 2026 zum Jahresende?",
    answer:
      "Nach geltendem Recht nicht automatisch am 31. Dezember. Nicht verbrauchte Beträge aus 2026 können grundsätzlich in das erste Halbjahr 2027 übertragen werden. Trotzdem lohnt es sich, jetzt zu prüfen, ob benötigte Hilfe im Haushalt oder bei der Betreuung bereits genutzt wird.",
  },
  {
    id: "pr27-faq-verhinderungspflege",
    question: "Wie hoch ist der gemeinsame Jahresbetrag für Verhinderungs- und Kurzzeitpflege 2026?",
    answer:
      "Seit Juli 2025 gibt es für Verhinderungspflege und Kurzzeitpflege einen gemeinsamen Jahresbetrag. Pflegebedürftigen ab Pflegegrad 2 stehen 2026 unter den gesetzlichen Voraussetzungen insgesamt bis zu 3.539 Euro pro Kalenderjahr zur Verfügung. Das sind nicht zweimal 3.539 Euro, sondern ein gemeinsamer Betrag für beide Leistungen.",
  },
  {
    id: "pr27-faq-arbeitgeber",
    question: "Was hat die Pflegereform mit meinem Arbeitgeber zu tun?",
    answer:
      "Viele pflegende Angehörige sind berufstätig. Wenn Pflegegrade, Entlastungsleistungen und Budgets neu geordnet werden, entsteht Beratungsbedarf, der oft in die Arbeitszeit fällt. Mit der betrieblichen Pflegeberatung von Alltagshilfe-Süd können Arbeitgeber ihren Beschäftigten eine persönliche Pflegebegleitung als Benefit anbieten: vertraulich, mit fester Ansprechperson und Hilfe bei Anträgen, Höherstufung, Leistungen und Widersprüchen.",
  },
];

export function pflegereform2027FaqForJsonLd(): { question: string; answer: string }[] {
  return PFLEGEREFORM2027_ARTICLE_FAQ.map((item) => ({ question: item.question, answer: item.answer }));
}
