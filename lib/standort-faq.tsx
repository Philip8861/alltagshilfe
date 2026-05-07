import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Standort } from "@/config/standorte";

const HAUSHALTSHILFE_URL = "/leistungen/haushaltshilfe";

export const STANDORT_FAQ_LINK_CLASS =
  "font-semibold text-[#0F4F68] underline underline-offset-2 decoration-[#0F4F68]/40 hover:decoration-[#F78F2E] hover:text-[#0c3d52]";

export type StandortFaqItem = { q: string; answerPlain: string; answer: ReactNode };

/**
 * Dieselben FAQ wie auf den Standortseiten. Mit `standort: null` für die Startseite
 * (ohne „Sie erreichen Standort X …“).
 */
export function buildStandortStyleFaq(standort: Standort | null): StandortFaqItem[] {
  const brand = siteConfig.name;

  const welcherStandortBlock: StandortFaqItem = standort
    ? {
        q: "Welcher Standort ist für mich zuständig?",
        answerPlain: `Auf dieser Seite erreichen Sie den Standort ${standort.name}. Für andere Orte und Postleitzahlen finden Sie den passenden Standort über den Standortsucher auf der Website.`,
        answer: (
          <>
            Auf dieser Seite erreichen Sie <strong>{standort.name}</strong>. Für andere Orte und Postleitzahlen finden Sie
            den passenden Standort in Ihrer Nähe mit unserem{" "}
            <Link href="/standorte" className={STANDORT_FAQ_LINK_CLASS}>
              Standortsucher
            </Link>
            .
          </>
        ),
      }
    : {
        q: "Welcher Standort ist für mich zuständig?",
        answerPlain: `Welchen Standort Sie für Ihre Adresse oder Postleitzahl benötigen, finden Sie mit unserem Standortsucher auf der Website von ${brand}.`,
        answer: (
          <>
            Den passenden Standort in Ihrer Nähe finden Sie mit unserem{" "}
            <Link href="/standorte" className={STANDORT_FAQ_LINK_CLASS}>
              Standortsucher
            </Link>
            .
          </>
        ),
      };

  return [
    {
      q: `Hat die ${brand} noch freie Kapazitäten?`,
      answerPlain: `Ja, in der Regel haben wir an allen unseren Standorten noch freie Kapazitäten. Vom Erstgespräch bis zum ersten Besuch dauert es meist etwa 2 Wochen.`,
      answer: (
        <>
          Ja, in der Regel haben wir an <strong>allen unseren Standorten</strong> noch freie Kapazitäten. Vom{" "}
          <strong>Erstgespräch</strong> bis zum <strong>ersten Besuch</strong> dauert es meist etwa <strong>2 Wochen</strong>.
        </>
      ),
    },
    {
      q: "Gibt es eine feste Vertragslaufzeit oder lange Bindungen?",
      answerPlain:
        "Nein. Sie können uns ganz entspannt kennenlernen. Wenn unser Angebot doch nicht zu Ihnen passt, können Sie unsere Leistungen jederzeit kündigen.",
      answer: (
        <>
          <strong>Nein.</strong> Sie können uns ganz entspannt kennenlernen. Wenn unser Angebot doch nicht zu Ihnen
          passt, können Sie unsere Leistungen <strong>jederzeit kündigen</strong>.
        </>
      ),
    },
    {
      q: "Was passiert, wenn ich einen Termin krankheitsbedingt nicht wahrnehmen kann?",
      answerPlain: "Kein Problem. Wir rechnen nur Leistungen ab, die tatsächlich stattgefunden haben.",
      answer: (
        <>
          Kein Problem. Wir rechnen nur Leistungen ab, die <strong>tatsächlich stattgefunden</strong> haben.
        </>
      ),
    },
    {
      q: "Kommt zu mir immer eine feste Bezugsperson?",
      answerPlain:
        "Ja, wir planen für Sie nach Möglichkeit eine feste Bezugsperson ein. Nur bei Urlaub oder Krankheit kann es zu einer Vertretung kommen. In diesem Fall informieren wir Sie frühzeitig.",
      answer: (
        <>
          Ja, wir planen für Sie nach Möglichkeit eine <strong>feste Bezugsperson</strong> ein. Nur bei{" "}
          <strong>Urlaub</strong> oder <strong>Krankheit</strong> kann es zu einer Vertretung kommen. In diesem Fall
          informieren wir Sie <strong>frühzeitig</strong>.
        </>
      ),
    },
    {
      q: "Kann der Entlastungsbetrag von 131 € über uns genutzt werden?",
      answerPlain:
        "Ja. Wir sind bei allen Pflegekassen in Deutschland zugelassen, sodass die Abrechnung problemlos möglich ist. Hintergrundinfos finden Sie im Ratgeber-Bereich auf unserer Website.",
      answer: (
        <>
          <strong>Ja.</strong> Wir sind bei <strong>allen Pflegekassen in Deutschland</strong> zugelassen, sodass die
          Abrechnung problemlos möglich ist. Hintergrundinfos zu Pflege-Leistungen und dem Alltag finden Sie in unserem{" "}
          <Link href="/ratgeber" className={STANDORT_FAQ_LINK_CLASS}>
            Ratgeber-Bereich
          </Link>
          .
        </>
      ),
    },
    {
      q: "Kann die Ersatzpflege beziehungsweise Verhinderungspflege von 3.539 € über uns genutzt werden?",
      answerPlain:
        "Ja. Auch die Ersatzpflege beziehungsweise Verhinderungspflege kann über uns genutzt werden. Wir sind bei allen Pflegekassen in Deutschland zugelassen.",
      answer: (
        <>
          <strong>Ja.</strong> Auch die <strong>Ersatzpflege</strong> beziehungsweise <strong>Verhinderungspflege</strong>{" "}
          kann über uns genutzt werden. Wir sind bei <strong>allen Pflegekassen in Deutschland</strong> zugelassen.
        </>
      ),
    },
    {
      q: "Wie funktioniert die monatliche Abrechnung?",
      answerPlain:
        "Ganz unkompliziert. Entweder rechnen wir direkt mit Ihrer Pflegekasse ab oder Sie erhalten von uns die Rechnungen und Leistungsnachweise per Post und können diese selbst einreichen.",
      answer: (
        <>
          Ganz unkompliziert. Entweder rechnen wir <strong>direkt mit Ihrer Pflegekasse</strong> ab, oder Sie erhalten
          von uns die <strong>Rechnungen</strong> und <strong>Leistungsnachweise</strong> per Post und können diese selbst
          einreichen.
        </>
      ),
    },
    {
      q: "Kann ich meine Rechnungen und Termine selbst im Blick behalten?",
      answerPlain:
        "Ja. Sie erhalten Zugangsdaten für unsere Partnerapp und können Ihre Termine und Unterlagen bequem digital einsehen. Auf Wunsch schicken wir Ihnen Rechnungen und Leistungsnachweise auch per Post zu.",
      answer: (
        <>
          <strong>Ja.</strong> Sie erhalten Zugangsdaten für unsere <strong>Partnerapp</strong> und können Ihre{" "}
          <strong>Termine</strong> und <strong>Unterlagen</strong> bequem digital einsehen. Auf Wunsch schicken wir Ihnen
          Rechnungen und Leistungsnachweise auch <strong>per Post</strong> zu.
        </>
      ),
    },
    welcherStandortBlock,
    {
      q: "Kommen private Kosten auf mich zu?",
      answerPlain:
        "Nein, solange die Leistungen im Rahmen der Budgets Ihrer Pflegekasse bleiben. Im Erstgespräch rechnen wir gemeinsam aus, welche Leistungen Ihnen zustehen.",
      answer: (
        <>
          <strong>Nein</strong>, solange die Leistungen im Rahmen der <strong>Budgets Ihrer Pflegekasse</strong> bleiben.
          Im <strong>Erstgespräch</strong> rechnen wir gemeinsam aus, welche Leistungen Ihnen zustehen.
        </>
      ),
    },
    {
      q: "Kann ich auch mehrere Dienstleister gleichzeitig nutzen?",
      answerPlain:
        "Ja, das ist möglich. Eine Kombination aus mehreren Dienstleistern ist kein Problem, zum Beispiel aus Pflegedienst und Haushaltsdienst.",
      answer: (
        <>
          <strong>Ja</strong>, das ist möglich. Eine Kombination aus mehreren Dienstleistern ist kein Problem, zum
          Beispiel aus <strong>Pflegedienst</strong> und <strong>Haushaltsdienst</strong>.
        </>
      ),
    },
    {
      q: `Wie viele Stunden erhalte ich im Monat über ${brand}?`,
      answerPlain: `Das ist ganz unterschiedlich und hängt von Ihrem Pflegegrad sowie den verfügbaren Budgets ab. Gerne beraten wir Sie dazu im Erstgespräch.`,
      answer: (
        <>
          Das ist <strong>ganz unterschiedlich</strong> und hängt von Ihrem <strong>Pflegegrad</strong> sowie den
          verfügbaren <strong>Budgets</strong> ab. Gerne beraten wir Sie dazu im <strong>Erstgespräch</strong>. Details zu
          Leistungen finden Sie auch unter{" "}
          <Link href={HAUSHALTSHILFE_URL} className={STANDORT_FAQ_LINK_CLASS}>
            Haushaltshilfe
          </Link>
          .
        </>
      ),
    },
    {
      q: "Ist mein Alltagshelfer oder meine Alltagshelferin versichert?",
      answerPlain:
        "Ja. Alle Mitarbeiterinnen und Mitarbeiter sind umfassend über uns versichert. Dabei sind sowohl Personenschäden als auch Sachschäden an Ihrem Eigentum abgesichert.",
      answer: (
        <>
          <strong>Ja.</strong> Alle Mitarbeiterinnen und Mitarbeiter sind <strong>umfassend über uns versichert</strong>.
          Dabei sind sowohl <strong>Personenschäden</strong> als auch <strong>Sachschäden</strong> an Ihrem Eigentum
          abgesichert.
        </>
      ),
    },
  ];
}

export function standortFaqJsonLd(items: StandortFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.answerPlain },
    })),
  };
}
