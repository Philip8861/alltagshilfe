import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const HAUSHALTSHILFE_FAQ_LINK_CLASS =
  "font-semibold text-[#0F4F68] underline underline-offset-2 decoration-[#0F4F68]/40 hover:decoration-[#F78F2E] hover:text-[#0c3d52]";

export type HaushaltshilfeFaqItem = { q: string; answerPlain: string; answer: ReactNode };

const brand = siteConfig.name;

export const HAUSHALTSHILFE_FAQ: HaushaltshilfeFaqItem[] = [
  {
    q: "Welche Aufgaben werden übernommen?",
    answerPlain:
      "Typische Leistungen sind Bodenreinigung, Fensterputzen, Bad- und Küchenreinigung sowie Ordnung halten. Der Umfang wird an Ihren Bedarf angepasst.",
    answer: (
      <>
        Typische Leistungen sind <strong>Bodenreinigung</strong>, <strong>Fensterputzen</strong>,{" "}
        <strong>Bad- und Küchenreinigung</strong> sowie <strong>Ordnung halten</strong>. Wir passen uns Ihrem Bedarf an.
      </>
    ),
  },
  {
    q: `Wo bietet ${brand} ihre Leistung an?`,
    answerPlain: `${brand} unterstützt in Städten und ländlichen Regionen. Ob wir in Ihrer Nähe sind, prüfen Sie über den Standortsucher auf der Seite Standorte.`,
    answer: (
      <>
        Wir unterstützen in <strong>Städten und ländlichen Regionen</strong>. Ob wir in Ihrer Nähe sind, prüfen Sie mit
        unserem{" "}
        <Link href="/standorte" className={HAUSHALTSHILFE_FAQ_LINK_CLASS}>
          Standortsucher
        </Link>
        .
      </>
    ),
  },
  {
    q: "Werden die Kosten übernommen?",
    answerPlain: `Als zugelassener Partner rechnen wir mit allen Pflege- und Krankenkassen ab.`,
    answer: (
      <>
        Als <strong>zugelassener Partner</strong> rechnen wir mit <strong>allen Pflege- und Krankenkassen</strong> ab.
      </>
    ),
  },
  {
    q: "Wie wird abgerechnet?",
    answerPlain:
      "Die Bezahlung erfolgt über die Pflegekasse, die Krankenkasse oder privat. Im Beratungsgespräch klären wir Ihre Möglichkeiten.",
    answer: (
      <>
        Die Bezahlung erfolgt über die <strong>Pflegekasse</strong>, die <strong>Krankenkasse</strong> oder{" "}
        <strong>privat</strong>. Wir beraten Sie gerne zu Ihren Möglichkeiten, gern auch über unsere{" "}
        <Link href="/kontakt" className={HAUSHALTSHILFE_FAQ_LINK_CLASS}>
          Kontaktseite
        </Link>
        .
      </>
    ),
  },
  {
    q: "Gilt der Entlastungsbetrag von 131 Euro?",
    answerPlain:
      "Ab Pflegegrad 1 können Sie den monatlichen Entlastungsbetrag von 131 Euro für qualifizierte Leistungen nutzen, sofern die Voraussetzungen erfüllt sind.",
    answer: (
      <>
        Ab <strong>Pflegegrad 1</strong> können Sie diesen monatlichen Betrag für unsere Leistungen nutzen, wenn die
        gesetzlichen Voraussetzungen erfüllt sind. Details zum Entlastungsbetrag finden Sie auch in unserem{" "}
        <Link href="/ratgeber/entlastungsbetrag-131-euro" className={HAUSHALTSHILFE_FAQ_LINK_CLASS}>
          Ratgeber
        </Link>
        .
      </>
    ),
  },
  {
    q: `Kann ich 3.539 Euro für Ersatzpflege und Verhinderungspflege über ${brand} nutzen?`,
    answerPlain: `Ja, ab Pflegegrad 2 können Sie Ersatzpflege und Verhinderungspflege bis zum gesetzlich vorgesehenen Jahresbudget über ${brand} abrechnen lassen, sofern die Voraussetzungen erfüllt sind.`,
    answer: (
      <>
        Ja, ab einem <strong>Pflegegrad 2</strong> ist das unkompliziert möglich, wenn die gesetzlichen und vertraglichen
        Voraussetzungen erfüllt sind. Wir unterstützen Sie bei der Abrechnung.
      </>
    ),
  },
  {
    q: "Brauche ich einen Pflegegrad?",
    answerPlain:
      "Für Leistungen über die Pflegekasse ist in der Regel ein Pflegegrad erforderlich. Über die Krankenkasse oder privat ist Hilfe auch ohne Pflegegrad möglich, je nach Einzelfall.",
    answer: (
      <>
        Für Leistungen der <strong>Pflegekasse</strong> ja. Über die <strong>Krankenkasse</strong> oder{" "}
        <strong>privat</strong> ist Hilfe auch ohne Pflegegrad möglich.
      </>
    ),
  },
  {
    q: "Gibt es eine feste Bezugsperson?",
    answerPlain:
      "Ja, eine persönliche Beziehung ist wichtig; ein Wechsel der Bezugsperson erfolgt nur in dringenden Fällen.",
    answer: (
      <>
        Ja, eine <strong>persönliche Beziehung</strong> ist uns wichtig, daher ist ein Wechsel nur in dringenden Fällen
        notwendig.
      </>
    ),
  },
  {
    q: "Wie schnell startet die Hilfe?",
    answerPlain:
      "Termine werden zeitnah vergeben. Der Start hängt von regionalen Kapazitäten ab; darüber informieren wir Sie umgehend.",
    answer: (
      <>
        Wir vergeben Termine <strong>zeitnah</strong>. Der Start hängt von regionalen Kapazitäten ab, über die wir Sie
        sofort informieren.
      </>
    ),
  },
  {
    q: "Gibt es eine App für Termine?",
    answerPlain: `Ja, über die App von ${brand} sind Termine und Rechnungen jederzeit einsehbar.`,
    answer: (
      <>
        Ja, über unsere <strong>App</strong> haben Sie <strong>Termine und Rechnungen</strong> jederzeit transparent im
        Blick.
      </>
    ),
  },
  {
    q: "Wie stelle ich eine Anfrage?",
    answerPlain: `Kontaktieren Sie ${brand} telefonisch oder über das Online-Formular für ein unverbindliches Erstgespräch.`,
    answer: (
      <>
        Kontaktieren Sie uns einfach telefonisch oder per{" "}
        <Link href="/kontakt" className={HAUSHALTSHILFE_FAQ_LINK_CLASS}>
          Online-Formular
        </Link>{" "}
        für ein unverbindliches Erstgespräch.
      </>
    ),
  },
];

export const HAUSHALTSHILFE_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HAUSHALTSHILFE_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.answerPlain },
  })),
} as const;
