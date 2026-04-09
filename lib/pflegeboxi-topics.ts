import { PFLEGEBOX_KONFIGURATOR_PAGE } from "@/lib/pflegebox-konfigurator-path";

/** Eingeklappt: Sprechblase am Avatar */
export const PFLEGEBOXI_COLLAPSED_HINT =
  "Hallo ich bin Pflegeboxi, tippen Sie auf mich, ich helfe gerne weiter";

/** Geöffnet: erste Zeile in der Sprechblase, bevor ein Thema gewählt wurde */
export const PFLEGEBOXI_PANEL_INTRO =
  "Hallo, ich bin Pflegeboxi. Wählen Sie unten ein Thema – ich zeige Ihnen die passende Antwort.";

export type PflegeboxiTopicLink = { href: string; label: string };

export type PflegeboxiTopic = {
  label: string;
  answer: string;
  extraLinks?: PflegeboxiTopicLink[];
};

/**
 * Feste Themen + Antworten (kein Freitext-Chat).
 * Spiegel: `public/konfigurator/app.js` und `Konfigurator/app.js` (`PFLEGEBOXI_TOPICS`).
 */
export const PFLEGEBOXI_TOPICS: PflegeboxiTopic[] = [
  {
    label: "Kostet die Pflegebox etwas?",
    answer:
      "Ab Pflegegrad 1 ist sie für Sie komplett kostenfrei. Die Pflegekasse übernimmt die 42 Euro monatlich – Sie zahlen nichts für die Box.",
  },
  {
    label: "Wer hat Anspruch darauf?",
    answer:
      "Alle Personen ab Pflegegrad 1 haben den vollen gesetzlichen Anspruch auf diese monatliche Pauschale.",
  },
  {
    label: "Was ist in der Box?",
    answer:
      "Sie finden darin nützliche Helfer wie Einmalhandschuhe, Flächendesinfektion, Händedesinfektion, Bettschutzeinlagen, Masken und Schutzschürzen.",
  },
  {
    label: "Wie bestelle ich die Box?",
    answer:
      "In drei einfachen Schritten online konfigurieren, digital unterschreiben und wir übernehmen den gesamten Rest für Sie.",
    extraLinks: [{ href: PFLEGEBOX_KONFIGURATOR_PAGE, label: "Zum Konfigurator" }],
  },
  {
    label: "Muss ich Anträge ausfüllen?",
    answer:
      "Nein, wir erledigen die komplette Kommunikation mit der Pflegekasse. Sie können sich entspannt zurücklehnen.",
  },
  {
    label: "Wie lange dauert die Lieferung?",
    answer:
      "Nach der Freigabe durch Ihre Kasse erhalten Sie die Lieferung zuverlässig nach etwa fünf bis sieben Werktagen nach Hause.",
  },
  {
    label: "Gibt es eine Vertragsbindung?",
    answer:
      "Es gibt bei uns absolut keine festen Laufzeiten. Sie haben maximale Freiheit und können jederzeit kündigen.",
  },
  {
    label: "Kann ich den Inhalt ändern?",
    answer:
      "Ja, das ist problemlos möglich. Kontaktieren Sie uns einfach und wir passen Ihre Wunschbox für den nächsten Monat an.",
  },
  {
    label: "Muss ich monatlich Belege einreichen?",
    answer:
      "Nein, sobald der Dauerantrag steht, laufen die Belieferung und die Abrechnung ganz automatisch ab.",
  },
  {
    label: "Was passiert mit Restguthaben?",
    answer:
      "Die 42 Euro sind eine Höchstgrenze. Nicht genutztes Budget verfällt am Monatsende und wird nicht ausgezahlt.",
  },
  {
    label: "Gilt das auch im Pflegeheim?",
    answer:
      "Nein, der Anspruch besteht nur bei häuslicher Pflege. Im Heim ist die Einrichtung für diese Hygieneartikel zuständig.",
  },
  {
    label: "Geht das auch rückwirkend?",
    answer:
      "Eine rückwirkende Erstattung ist sehr schwierig. Stellen Sie den Antrag am besten so früh wie möglich direkt über uns.",
  },
  {
    label: "Sind Masken auch dabei?",
    answer:
      "Ja, medizinische Masken sowie FFP2 Masken sind fester Bestandteil und werden von der Kasse erstattet.",
  },
  {
    label: "Welche Qualität haben die Produkte?",
    answer:
      "Wir bieten Ihnen ausschließlich von Pflegekräften geprüfte und empfohlene Qualitätsprodukte für Ihren Pflegealltag.",
  },
  {
    label: "Warum bei Alltagshilfe Süd bestellen?",
    answer:
      "Wir bieten persönliche Erreichbarkeit, extrem schnelle Bearbeitung, direkten Kontakt ohne Warteschleifen und faire Arbeitsbedingungen.",
  },
  {
    label: "Zahle ich Versandkosten?",
    answer:
      "Der sorgfältig verpackte Versand erfolgt direkt aus Deutschland und ist für Sie immer absolut kostenfrei.",
  },
  {
    label: "Was sind Verbrauchshilfsmittel?",
    answer:
      "Das sind Hygieneartikel für den Einmalgebrauch wie Handschuhe, ganz im Gegensatz zu technischen Hilfsmitteln wie Pflegebetten.",
  },
  {
    label: "Welche Krankenkassen machen mit?",
    answer: "Wir sind bei ausnahmslos allen Krankenkassen in Deutschland offiziell zugelassen.",
  },
  {
    label: "Geht der Antrag auch per Post?",
    answer:
      "Ja, Sie können alles digital und papierarm unterschreiben oder auf Wunsch ganz klassisch den Postweg wählen.",
  },
  {
    label: "Wie erreiche ich Sie bei Fragen?",
    answer:
      "Rufen Sie uns gerne gebührenfrei unter 08334 9893330 an. Wir sind von Montag bis Freitag gerne für Sie da.",
  },
  {
    label: "Anderes Anliegen",
    answer:
      "Für individuelle Fragen erreichen Sie unseren Kundenservice am besten über die Kontaktseite – wir melden uns gern bei Ihnen.",
    extraLinks: [{ href: "/kontakt", label: "Zur Kontaktseite" }],
  },
];
