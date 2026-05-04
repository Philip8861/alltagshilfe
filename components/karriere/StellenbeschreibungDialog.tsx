"use client";

import Link from "next/link";
import { type ReactNode, useId, useRef } from "react";
import { useKarriereApplyOptional } from "@/components/karriere/karriereApplyContext";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const ALLTAGSHELFER_EINLEITUNG_ABSÄTZE = [
  "Sie legen Wert auf flexible Arbeitszeiten, die sich Ihrem Alltag anpassen? Sie möchten mit Menschen arbeiten, Verantwortung übernehmen und dabei wirklich etwas bewirken? Dann könnte die Tätigkeit als Alltagshelfer*in genau zu Ihnen passen.",
  "Bei uns unterstützen Sie hilfs- und pflegebedürftige Menschen direkt in ihrem Zuhause. Sie helfen im Alltag, begleiten bei Erledigungen, unterstützen im Haushalt und schenken Zeit, Aufmerksamkeit und Entlastung. Pflegerische Maßnahmen gehören nicht zu Ihren Aufgaben. Wichtig sind Freude am Umgang mit Menschen, Zuverlässigkeit und die Bereitschaft, sich auf unterschiedliche Lebenssituationen einzulassen.",
  "Ein Quereinstieg ist jederzeit möglich. Die notwendige Weiterbildung nach § 45b SGB XI wird vollständig von uns finanziert und kann bequem von zu Hause aus absolviert werden.",
] as const;

const ALLTAGSHELFER_WIR_BIETEN = [
  "Freundliches und offenes Arbeitsklima",
  "Flexible Arbeitszeiten, die sich gut mit Ihrem Alltag vereinbaren lassen",
  "Leistungsgerechte und attraktive Vergütung",
  "Sachbezugskarte oder Wellpass",
  "Gesundheitsbonus",
  "Kilometergeld und volle Fahrtkostenerstattung",
  "Vergütung der Fahrzeiten zwischen den Einsätzen",
  "30 Urlaubstage, angerechnet auf eine 5-Tage-Woche",
  "Fort- und Weiterbildungen",
] as const;

const ALLTAGSHELFER_BETREUUNG = [
  "Begleitung bei Einkäufen, Terminen und Alltagserledigungen",
  "Unterstützung bei sozialen Aktivitäten",
  "Hilfe beim Aufbau und Erhalt einer Tagesstruktur",
  "Botengänge, zum Beispiel Apotheke, Post oder kleinere Erledigungen",
  "Zeit schenken, zuhören und im Alltag Sicherheit geben",
] as const;

const ALLTAGSHELFER_HAUSHALT = [
  "Lebensmitteleinkäufe erledigen",
  "Mahlzeiten vorbereiten oder zubereiten",
  "Reinigung des direkten Lebensbereiches",
  "Abfall trennen und entsorgen",
  "Wäsche waschen, bügeln, falten und einräumen",
  "Zimmerpflanzen versorgen",
  "Unterstützung bei der Versorgung von Haustieren",
] as const;

const ALLTAGSHELFER_PROFIL = [
  "Quereinstieg jederzeit möglich",
  "Freude am Umgang mit älteren, hilfs- oder pflegebedürftigen Menschen",
  "Zuverlässige, verantwortungsbewusste und selbstständige Arbeitsweise",
  "Einfühlungsvermögen, Geduld und ein freundliches Auftreten",
  "Bereitschaft zur Weiterbildung als Alltagshelfer*in gemäß § 45b SGB XI",
  "Sicherer Umgang mit Smartphone, Laptop oder Computer für die Online-Weiterbildung",
  "Führerschein Klasse B und eigener Pkw zwingend erforderlich, da wir unsere Klient*innen zuhause besuchen",
] as const;

const ALLTAGSHELFER_ABSCHLUSS =
  "Vorkenntnisse sind nicht erforderlich. Wichtig ist, dass Sie zuverlässig sind, gerne mit Menschen arbeiten und bereit sind, an der Weiterbildung zur Alltagshelfer*in gemäß § 45b SGB XI teilzunehmen. Die Weiterbildung umfasst insgesamt 22 Stunden, wird vollständig von uns finanziert und kann bequem von zu Hause aus besucht werden. Sie benötigen lediglich ein Smartphone, einen Laptop oder einen Computer mit Internetanschluss. Wir begleiten Sie bei allen Schritten, damit der Einstieg für Sie stressfrei gelingt.";

function OrangeCheck({ className }: { className?: string }) {
  return (
    <svg
      className={cn("mt-0.5 h-4 w-4 shrink-0 text-[#F78F2E] sm:h-[1.125rem] sm:w-[1.125rem]", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const PFLEGEBERATER_EINLEITUNG =
  "Sie möchten weiterhin nah am Menschen arbeiten, aber ohne Wochenenddienste, Feiertagsdienste und ständige Diskussionen um freie Tage? Dann könnte die ambulante Pflegeberatung genau der richtige nächste Schritt für Sie sein. Bei uns besuchen Sie pflegebedürftige Menschen und ihre Angehörigen zuhause, beraten zu möglichen Leistungen, geben praktische Tipps für den Alltag und helfen dabei, gute Lösungen für die Versorgung zu Hause zu finden. Gleichzeitig profitieren Sie von planbaren Arbeitszeiten, teilweise Homeoffice, mobilem Arbeiten und einer leistungsgerechten, attraktiven Vergütung.";

const PFLEGEBERATER_WIR_BIETEN = [
  "Bis zu 37,5 Stunden pro Woche in Vollzeit oder Teilzeit",
  "30 frei planbare Urlaubstage pro Jahr",
  "Leistungsgerechte und attraktive Vergütung mit zusätzlichen Bonusprogrammen und Provisionen",
  "Keine Wochenend- oder Feiertagsarbeit",
  "Teilweise Homeoffice und mobiles Arbeiten möglich",
  "Diensthandy für die tägliche Arbeit",
  "Umfassende Einarbeitung, die Sie optimal auf Ihr neues Berufsfeld vorbereitet",
  "Attraktive Konditionen und langfristige Sicherheit",
] as const;

const PFLEGEBERATER_AUFGABEN = [
  "Beratung von pflegebedürftigen Menschen und Angehörigen zu möglichen Leistungen der Pflegeversicherung",
  "Unterstützung bei Fragen rund um Pflegegrad, Entlastungsangebote, Versorgung zuhause und Alltagshilfen",
  "Durchführung von Beratungsgesprächen vor Ort, telefonisch oder digital",
  "Einschätzung der individuellen Pflegesituation und Erkennen von Unterstützungsbedarf",
  "Praktische Tipps geben, damit die Pflege zuhause leichter und sicherer gelingt",
  "Angehörige entlasten, Orientierung geben und passende nächste Schritte aufzeigen",
  "Dokumentation der Beratungsgespräche und sorgfältige Nachbereitung",
] as const;

const PFLEGEBERATER_PROFIL = [
  "Zertifikat als Pflegeberater*in nach § 7a SGB XI wünschenswert oder die Bereitschaft, diese Qualifikation mit unserer Unterstützung zu erwerben",
  "Abgeschlossene Ausbildung im Pflegebereich, zum Beispiel als Pflegefachkraft, Altenpfleger*in, Gesundheits- und Krankenpfleger*in oder eine vergleichbare Qualifikation",
  "Freude an Beratung, Kommunikation und verständlicher Erklärung von Pflegeleistungen",
  "Einfühlungsvermögen, Geduld und ein sicheres Auftreten",
  "Selbstständige, strukturierte und zuverlässige Arbeitsweise",
  "Sicherer Umgang mit digitalen Arbeitsmitteln oder die Bereitschaft, sich einzuarbeiten",
  "Führerschein Klasse B zwingend erforderlich",
  "Freude daran, unterwegs zu sein und Klient*innen in ihrem Zuhause zu beraten",
] as const;

const BUCHHALTER_EINLEITUNG =
  "Sie arbeiten gerne strukturiert, behalten auch bei vielen Aufgaben den Überblick und möchten mit Ihrer Arbeit etwas Sinnvolles unterstützen? Dann könnte diese Stelle genau zu Ihnen passen. Bei uns verbinden Sie Buchhaltung, Organisation und Verwaltung mit einer Aufgabe, die direkt den Menschen in der Region zugutekommt. Sie sorgen im Hintergrund dafür, dass Abläufe funktionieren, Anfragen bearbeitet werden und unser Team zuverlässig arbeiten kann. Gleichzeitig profitieren Sie von einem Gleitzeitarbeitsmodell, echter Teamkultur, festen Ansprechpartnern und einer leistungsgerechten Vergütung.";

const BUCHHALTER_WIR_BIETEN = [
  "Leistungsgerechte und attraktive Vergütung, abgestimmt auf Ihre Qualifikation und Erfahrung",
  "Gleitzeitarbeitsmodell für mehr Flexibilität im Alltag",
  "30 Tage Urlaub und betriebliche Altersvorsorge",
  "Wellpass oder Sachbezugskarte",
  "Echte Teamkultur, feste Ansprechpartner und ein wertschätzendes Arbeitsumfeld",
  "Umfassende Einarbeitung, damit Sie sich von Anfang an sicher fühlen",
  "Abwechslungsreicher Arbeitsplatz in einem jungen und dynamischen Unternehmen",
  "Sinnstiftende Arbeit in der Region, dort, wo Hilfe für Menschen ankommt",
] as const;

const BUCHHALTER_AUFGABEN = [
  "Bearbeitung laufender Buchhaltungs- und Verwaltungsaufgaben",
  "Prüfung, Vorbereitung und Ablage von Rechnungen, Belegen und Unterlagen",
  "Unterstützung bei Abrechnungen, Zahlungsübersichten und internen Auswertungen",
  "Verwaltung und Bearbeitung von Anfragen sowie Klientenkorrespondenz",
  "Terminplanung und Unterstützung bei der Organisation von Betreuungseinsätzen",
  "Unterstützung bei Dienstplangestaltung und Koordination von Mitarbeiteranfragen",
  "Allgemeine Büroaufgaben wie Telefonannahme, Postbearbeitung und Verwaltung von Büromaterial",
  "Zusammenarbeit mit verschiedenen Abteilungen, damit Abläufe zuverlässig funktionieren",
] as const;

const BUCHHALTER_HINWEIS =
  "Buchhalter*innen übernehmen typischerweise Aufgaben im Rechnungswesen wie das Vorbereiten von Abschlüssen, das Prüfen von Belegen und die Bearbeitung finanzieller Vorgänge. Deshalb passen Buchhaltungsaufgaben und strukturierte Verwaltung hier gut zusammen.";

const BUCHHALTER_PROFIL = [
  "Abgeschlossene kaufmännische Ausbildung, idealerweise als Bürokaufmann oder Bürokauffrau, Kaufmann oder Kauffrau für Büromanagement oder eine vergleichbare Qualifikation",
  "Quereinstieg möglich, wenn Sie gute organisatorische Fähigkeiten und sichere Computerkenntnisse mitbringen",
  "Erste Erfahrung im administrativen Bereich, idealerweise im Gesundheits- oder Sozialwesen",
  "Sicherer Umgang mit digitalen Arbeitsmitteln und gängigen Office-Programmen",
  "Strukturierte, organisierte und engagierte Arbeitsweise",
  "Verantwortungsbewusstsein, Genauigkeit und Freude an klaren Abläufen",
  "Teamgeist und starke Kommunikationsfähigkeiten",
  "Sehr gute Deutschkenntnisse in Wort und Schrift",
] as const;

const BUEROFACHKRAFT_EINLEITUNG_ABSÄTZE = [
  "Sie arbeiten gerne organisiert, behalten auch bei vielen Anfragen den Überblick und möchten Teil eines Teams sein, das Menschen im Alltag wirklich unterstützt? Dann könnte diese Stelle genau zu Ihnen passen.",
  "Bei uns sorgen Sie im Büro dafür, dass Anfragen, Termine, Betreuungseinsätze und interne Abläufe zuverlässig koordiniert werden. Sie sind eine wichtige Schnittstelle zwischen Klient*innen, Angehörigen und Mitarbeitenden und tragen dazu bei, dass Hilfe dort ankommt, wo sie gebraucht wird.",
] as const;

const BUEROFACHKRAFT_WIR_BIETEN = [
  "Ein sicherer, moderner Büroarbeitsplatz mit tollem Team",
  "Bis zu 37,5 Stunden pro Woche",
  "Planbare Arbeitszeiten von Montag bis Freitag",
  "30 Urlaubstage, angerechnet auf eine 5-Tage-Woche",
  "Attraktive Vergütung, abgestimmt auf Qualifikation und Erfahrung",
  "Betriebliche Altersvorsorge",
  "Wellpass oder Sachbezugskarte",
  "Umfassende Einarbeitung, damit Sie sich von Anfang an wohlfühlen",
  "Abwechslungsreicher Arbeitsplatz in einem wachsenden Unternehmen",
] as const;

const BUEROFACHKRAFT_AUFGABEN = [
  "Verwaltung und Bearbeitung von Anfragen",
  "Schriftliche und telefonische Klientenkorrespondenz",
  "Terminplanung und Unterstützung bei der Organisation von Beratungs- und Betreuungseinsätzen",
  "Koordination von Mitarbeiteranfragen",
  "Telefonannahme und Weiterleitung von Anliegen",
  "Postbearbeitung und allgemeine Büroorganisation",
  "Zusammenarbeit mit verschiedenen Bereichen, damit interne Abläufe zuverlässig funktionieren",
] as const;

const BUEROFACHKRAFT_PROFIL = [
  "Abgeschlossene kaufmännische Ausbildung, idealerweise als Bürokaufmann oder Bürokauffrau, Kaufmann oder Kauffrau für Büromanagement oder eine vergleichbare Qualifikation",
  "Quereinstieg möglich, wenn Sie gute organisatorische Fähigkeiten und sichere Computerkenntnisse mitbringen",
  "Erste Erfahrung im administrativen Bereich wünschenswert, idealerweise im Gesundheits- oder Sozialwesen",
  "Strukturierte, organisierte und engagierte Arbeitsweise",
  "Teamgeist und starke Kommunikationsfähigkeiten",
  "Freude am Umgang mit Menschen, sowohl telefonisch als auch schriftlich",
  "Sicherer Umgang mit digitalen Arbeitsmitteln",
  "Sehr gute Deutschkenntnisse in Wort und Schrift",
  "Verantwortungsbewusstsein, Zuverlässigkeit und ein freundliches Auftreten",
] as const;

function isPflegeberaterStelle(jobTitle: string) {
  return jobTitle.includes("Pflegeberater");
}

function isAlltagshelferStelle(jobTitle: string) {
  return jobTitle.includes("Alltagshelfer");
}

function isBuchhalterStelle(jobTitle: string) {
  return jobTitle.includes("Buchhalter");
}

function isBuerofachkraftStelle(jobTitle: string) {
  return jobTitle.toLowerCase().includes("bürofachkraft");
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-2.5 text-sm leading-relaxed text-neutral-700 sm:text-base">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5">
          <OrangeCheck />
          <span className="min-w-0 flex-1 break-words text-pretty">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        "mt-8 border-b border-[#0F4F68]/12 pb-2.5 text-sm font-bold uppercase tracking-wide text-[#0F4F68] sm:mt-10 sm:text-base",
        className,
      )}
    >
      {children}
    </h3>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return <h4 className="mt-4 text-sm font-semibold text-[#0F4F68] sm:text-base">{children}</h4>;
}

type StellenbeschreibungDialogTriggerProps = {
  jobTitle: string;
  className?: string;
};

function StelleninhaltSonstigeStelle({ jobTitle }: { jobTitle: string }) {
  return (
    <p className="text-pretty text-sm leading-relaxed text-neutral-800 sm:text-base">
      Für die Stelle „{jobTitle}“ beschreiben wir Ihnen Aufgaben und Rahmenbedingungen gern im persönlichen
      Gespräch. Bewerben Sie sich über den Button unten – wir melden uns bei Ihnen.
    </p>
  );
}

function StelleninhaltAlltagshelfer() {
  return (
    <>
      <div className="space-y-4">
        {ALLTAGSHELFER_EINLEITUNG_ABSÄTZE.map((absatz) => (
          <p
            key={absatz}
            className="text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base"
          >
            {absatz}
          </p>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-[#F2F9FA]/38 px-5 py-4 sm:mt-8 sm:px-6 sm:py-5">
        <SectionTitle className="!mt-0 sm:!mt-0">Was wir Ihnen bieten</SectionTitle>
        <SubTitle>Flexible Arbeit mit Sinn und Wertschätzung</SubTitle>
        <BulletList items={ALLTAGSHELFER_WIR_BIETEN} />
      </div>

      <SectionTitle>Ihre Aufgaben als Alltagshelfer*in</SectionTitle>
      <SubTitle>Betreuung und Alltagsbegleitung</SubTitle>
      <BulletList items={ALLTAGSHELFER_BETREUUNG} />
      <SubTitle>Haushaltshilfe und praktische Unterstützung</SubTitle>
      <BulletList items={ALLTAGSHELFER_HAUSHALT} />

      <SectionTitle>Ihr Profil</SectionTitle>
      <BulletList items={ALLTAGSHELFER_PROFIL} />

      <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base sm:mt-6">
        {ALLTAGSHELFER_ABSCHLUSS}
      </p>
    </>
  );
}

function StelleninhaltPflegeberater() {
  return (
    <>
      <p className="text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
        {PFLEGEBERATER_EINLEITUNG}
      </p>

      <div className="mt-6 rounded-2xl bg-[#F2F9FA]/38 px-5 py-4 sm:mt-8 sm:px-6 sm:py-5">
        <SectionTitle className="!mt-0 sm:!mt-0">Was wir Ihnen bieten</SectionTitle>
        <SubTitle>Mehr Freizeit und Flexibilität in Ihrem Leben</SubTitle>
        <BulletList items={PFLEGEBERATER_WIR_BIETEN} />
      </div>

      <SectionTitle>Ihre Aufgaben als Pflegeberater*in</SectionTitle>
      <BulletList items={PFLEGEBERATER_AUFGABEN} />

      <SectionTitle>Ihr Profil</SectionTitle>
      <BulletList items={PFLEGEBERATER_PROFIL} />
    </>
  );
}

function StelleninhaltBuchhalter() {
  return (
    <>
      <p className="text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
        {BUCHHALTER_EINLEITUNG}
      </p>

      <div className="mt-6 rounded-2xl bg-[#F2F9FA]/38 px-5 py-4 sm:mt-8 sm:px-6 sm:py-5">
        <SectionTitle className="!mt-0 sm:!mt-0">Was wir Ihnen bieten</SectionTitle>
        <BulletList items={BUCHHALTER_WIR_BIETEN} />
      </div>

      <SectionTitle>Ihre Aufgaben als Buchhalter*in</SectionTitle>
      <BulletList items={BUCHHALTER_AUFGABEN} />

      <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-700 sm:mt-6 sm:text-base">
        {BUCHHALTER_HINWEIS}
      </p>

      <SectionTitle>Ihr Profil</SectionTitle>
      <BulletList items={BUCHHALTER_PROFIL} />
    </>
  );
}

function StelleninhaltBuerofachkraft() {
  return (
    <>
      <div className="space-y-4">
        {BUEROFACHKRAFT_EINLEITUNG_ABSÄTZE.map((absatz) => (
          <p
            key={absatz}
            className="text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base"
          >
            {absatz}
          </p>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-[#F2F9FA]/38 px-5 py-4 sm:mt-8 sm:px-6 sm:py-5">
        <SectionTitle className="!mt-0 sm:!mt-0">Was wir Ihnen bieten</SectionTitle>
        <BulletList items={BUEROFACHKRAFT_WIR_BIETEN} />
      </div>

      <SectionTitle>Ihre Aufgaben als Bürofachkraft</SectionTitle>
      <BulletList items={BUEROFACHKRAFT_AUFGABEN} />

      <SectionTitle>Ihr Profil</SectionTitle>
      <BulletList items={BUEROFACHKRAFT_PROFIL} />
    </>
  );
}

export function StellenbeschreibungDialogTrigger({ jobTitle, className }: StellenbeschreibungDialogTriggerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bewerbenHref = `/kontakt?betreff=Bewerbung%20${encodeURIComponent(jobTitle)}`;
  const karriereApply = useKarriereApplyOptional();
  const interesseFormulierungSie =
    isPflegeberaterStelle(jobTitle) || isBuchhalterStelle(jobTitle) || isBuerofachkraftStelle(jobTitle);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        Stellenbeschreibung ansehen
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className={cn(
          /* Kein `flex` außer mit `open:` – sonst überschreibt Tailwind `display:none` des geschlossenen <dialog>. */
          "fixed inset-0 z-[100] m-0 max-h-none w-full max-w-none border-0 bg-transparent p-3 sm:p-5 md:p-8",
          "open:flex open:min-h-dvh open:items-center open:justify-center",
          "[&::backdrop]:bg-[#0F4F68]/45 [&::backdrop]:backdrop-blur-[2px]",
        )}
      >
        {/* Innen-Panel: UA-Styles vom <dialog> umgehen; Rand immer sichtbar, nie breiter als Viewport. */}
        <div
          className={cn(
            "flex min-w-0 max-h-[min(88dvh,calc(100dvh-2.5rem))] w-full max-w-[min(60rem,calc(100dvw-1.5rem))] flex-col self-center overflow-hidden rounded-3xl border-2 border-[#0F4F68]/15 bg-white shadow-[0_25px_80px_-12px_rgba(15,79,104,0.35)]",
            "sm:max-w-[min(60rem,calc(100dvw-2.5rem))]",
          )}
        >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#0F4F68]/8 bg-gradient-to-r from-[#FFF9F4]/95 via-[#F5FAFB]/92 to-white px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E8894A]/95 sm:text-sm">Karriere</p>
            <h2
              id={titleId}
              className="mt-1.5 text-balance text-xl font-bold leading-tight text-[#0F4F68] sm:text-2xl"
            >
              {jobTitle}
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl border border-[#0F4F68]/10 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:px-5"
            onClick={() => dialogRef.current?.close()}
          >
            Schließen
          </button>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain break-words px-5 py-6 sm:px-8 sm:py-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
          {isPflegeberaterStelle(jobTitle) ? (
            <StelleninhaltPflegeberater />
          ) : isAlltagshelferStelle(jobTitle) ? (
            <StelleninhaltAlltagshelfer />
          ) : isBuchhalterStelle(jobTitle) ? (
            <StelleninhaltBuchhalter />
          ) : isBuerofachkraftStelle(jobTitle) ? (
            <StelleninhaltBuerofachkraft />
          ) : (
            <StelleninhaltSonstigeStelle jobTitle={jobTitle} />
          )}

          <section
            className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 px-5 py-5 sm:mt-10 sm:px-6 sm:py-6"
            aria-labelledby="karriere-stellenbeschreibung-interesse-heading"
          >
            <h3
              id="karriere-stellenbeschreibung-interesse-heading"
              className="text-lg font-bold tracking-tight text-[#0F4F68] sm:text-xl"
            >
              {isBuerofachkraftStelle(jobTitle) ? "Interesse oder Fragen?" : "Interesse?"}
            </h3>
            <p className="mt-3 text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
              {isBuerofachkraftStelle(jobTitle) ? (
                <>
                  Dann freuen wir uns auf Ihre Bewerbung. Werden Sie Teil der {siteConfig.name} und unterstützen Sie uns
                  dabei, Senior*innen und pflegebedürftigen Menschen den Alltag zu erleichtern. Sie haben noch Fragen?
                  Wir stehen Ihnen gerne zur Verfügung!
                </>
              ) : interesseFormulierungSie ? (
                <>
                  Dann freuen wir uns auf Ihre Bewerbung. Werden Sie Teil der {siteConfig.name} und unterstützen Sie
                  uns dabei, Senior*innen und hilfsbedürftigen Menschen den Alltag zu erleichtern.
                </>
              ) : (
                <>
                  Dann freuen wir uns auf deine Bewerbung. Werde Teil der {siteConfig.name} und unterstütze uns dabei,
                  Senior*innen und hilfsbedürftigen Menschen den Alltag zu erleichtern.
                </>
              )}
            </p>
          </section>

          <div className="mt-8 space-y-3 border-t border-[#0F4F68]/10 pt-6 sm:mt-10 sm:space-y-4 sm:pt-8">
            {karriereApply ? (
              <button
                type="button"
                className="inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                onClick={() => {
                  dialogRef.current?.close();
                  window.requestAnimationFrame(() => karriereApply.openBewerbungsWizard(jobTitle));
                }}
              >
                Jetzt bewerben
              </button>
            ) : (
              <Link
                href={bewerbenHref}
                className="inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                onClick={() => dialogRef.current?.close()}
              >
                Jetzt bewerben
              </Link>
            )}
            {isBuerofachkraftStelle(jobTitle) ? (
              <Link
                href="/karriere#bewerbung-form"
                title="Kontaktformular mit Daniel Niebauer auf der Karriereseite"
                className="inline-flex w-full min-h-[48px] items-center justify-center rounded-xl border-2 border-[#0F4F68]/20 bg-white px-5 py-3 text-center text-base font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                onClick={() => dialogRef.current?.close()}
              >
                Jetzt Kontakt aufnehmen
              </Link>
            ) : null}
          </div>
        </div>
        </div>
      </dialog>
    </>
  );
}
