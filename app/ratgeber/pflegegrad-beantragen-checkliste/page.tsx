import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";
import { PflegegradBeantragenLeadForm } from "@/components/ratgeber/PflegegradBeantragenLeadForm";

const CANONICAL_PATH = "/ratgeber/pflegegrad-beantragen-checkliste" as const;
const HERO_IMAGE = "/images/Ratgeber/ratgeber.webp";

const META_TITLE = "Pflegegrad beantragen: Checkliste, Unterlagen & Tipps 2026" as const;
const META_DESCRIPTION =
  "Pflegegrad beantragen leicht erklärt: Schritt-für-Schritt-Checkliste, wichtige Unterlagen, Vorbereitung auf die Begutachtung und Tipps für Angehörige.";

const KEYWORDS = [
  "Pflegegrad beantragen",
  "Pflegegrad Antrag",
  "Pflegegrad Checkliste",
  "Pflegegrad Unterlagen",
  "MD Begutachtung vorbereiten",
  "Pflegegrad für Angehörige beantragen",
  "Pflegekasse Antrag",
  "Pflegegrad Widerspruch",
];

const publishedISO = "2026-04-27T08:00:00+02:00";
const modifiedISO = "2026-04-27T12:00:00+02:00";

function absUrl(path: string): string {
  try {
    return new URL(path, `${siteConfig.baseUrl.replace(/\/?$/, "/")}`).href;
  } catch {
    return `${siteConfig.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Wann sollte man einen Pflegegrad beantragen?",
    a: "So früh wie der Pflege- oder Hilfebedarf absehbar wird und voraussichtlich mindestens sechs Monate besteht oder wenn bereits Alltagsteilnahme spürbar erschwert ist. Zu langes Warten verschenkt keine Leistungen dauerhaft bei der Erstantragstellung, aber spätere Leistungen starten später.",
  },
  {
    q: "Wo beantragt man einen Pflegegrad?",
    a: "Bei der zuständigen Pflegeversicherung (Pflegekasse) der versicherten Person – häufig identisch mit der gesetzlichen Krankenkasse, sofern die Person dort pflegeversicherungspflichtig versichert ist. Privat Vollversicherte wenden sich an den zuständigen privaten Pflegeversicherungsanbieter nach dessen Unterlagenweg.",
  },
  {
    q: "Kann ich den Pflegegrad für meine Mutter oder meinen Vater beantragen?",
    a: "Sie können Unterstützung geben und mit Betroffenenbevollmächtigung oder wenn die pflegebedürftige Person handlungsunfähig ist und gesetzliche Vertretung besteht häufig handeln. Ohne entsprechende Vollmacht oder gesetzliche Stellung reicht oft die Mitwirkung: Formulare gemeinsam ausfüllen, Termine koordinieren, Begleitung bei der Begutachtung organisieren.",
  },
  {
    q: "Reicht ein formloser Antrag?",
    a: "Ja, um den Leistungsanspruch wirksam anzustoßen, reicht in der Regel ein formloser Schriftteil mit Angaben zur pflegebedürftigen Person. Die Pflegekasse fordert später strukturierte weiteren Unterlagen oder den standardisierten Fragebogen an.",
  },
  {
    q: "Wer entscheidet über den Pflegegrad?",
    a: "Die Pflegekasse trifft nach Einholung eines medizinischen Dienstlichen Begutachtungsergebnisses den Bescheid. Der medizinische Dienst oder ein zugelassener privater Gutachterdienst dokumentiert Begutachtungserkenntnis; die Bewertungsmethodik folgt dem gesetzlichen Regelwerk und der Punktbewertung in den Modulen.",
  },
  {
    q: "Was wird bei der Begutachtung geprüft?",
    a: "Die sechs Module Selbstständigkeit (Mobilität, Kognition und Verhalten, Selbstversorgung, Krankheitsbezogene besondere Bedarfe, Gestaltung des Alltags und sozialer Kontakte) werden dokumentiert mit typischen Aktivitäten der Alltagskompetenz. Ziel ist nicht die Krankheit selbst, sondern hilfebedürftige Einschränkungen zur Teilhabe sicherzuverlässlich festhalten.",
  },
  {
    q: "Was tun, wenn der Pflegegrad abgelehnt wird?",
    a: "Bescheid sorgfältig lesen, Fristen für Widerspruch notieren, Gutachten anfordern, Punkteübertrag prüfen. Viele Ablehnungen lassen sich im Widerspruchsverfahren klären, wenn Argumentation oder dokumentierte Leistungen unvollständig waren oder eine ergänzte Begutachtung hilft.",
  },
];

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: KEYWORDS,
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    type: "article",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: absUrl(CANONICAL_PATH),
    publishedTime: publishedISO,
    modifiedTime: modifiedISO,
    images: [{ url: absUrl(HERO_IMAGE), alt: "Ratgeber: Pflegegrad beantragen – Checkliste für Angehörige" }],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [absUrl(HERO_IMAGE)],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: META_TITLE,
  description: META_DESCRIPTION,
  image: absUrl(HERO_IMAGE),
  datePublished: publishedISO,
  dateModified: modifiedISO,
  author: { "@type": "Organization", name: siteConfig.name },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(CANONICAL_PATH) },
  inLanguage: "de-DE",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Start", item: absUrl("/") },
    { "@type": "ListItem", position: 2, name: "Ratgeber", item: absUrl("/ratgeber") },
    { "@type": "ListItem", position: 3, name: META_TITLE, item: absUrl(CANONICAL_PATH) },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function IconCheck(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const TOC_ENTRIES: { href: string; label: string }[] = [
  { href: "#das-wichtigste", label: "Das Wichtigste in Kürze" },
  { href: "#wann-sinnvoll", label: "Wann ist ein Pflegegrad sinnvoll?" },
  { href: "#zustaendige-kasse", label: "Zuständige Pflegekasse" },
  { href: "#antrag-stellen", label: "Pflegegrad-Antrag stellen" },
  { href: "#musterformulierung", label: "Musterformulierung für den Antrag" },
  { href: "#unterlagen", label: "Unterlagen sammeln" },
  { href: "#pflegetagebuch", label: "Pflegetagebuch führen" },
  { href: "#begutachtung", label: "Begutachtung vorbereiten" },
  { href: "#ehrlichkeit", label: "Ehrlich beim Begutachtungstermin" },
  { href: "#bescheid", label: "Bescheid prüfen" },
  { href: "#widerspruch", label: "Ablehnung: Widerspruch" },
  { href: "#kompakte-checkliste", label: "Kompakte Download-Checkliste" },
  { href: "#lead-download", label: "Checkliste per E-Mail" },
  { href: "#leistungen", label: "Leistungen nach dem Pflegegrad" },
  { href: "#fehler", label: "Häufige Fehler" },
  { href: "#faq", label: "FAQ" },
  { href: "#abschluss-cta", label: "Beratungsangebot" },
];

export default function PflegegradBeantragenRatgeberPage() {
  return (
    <article className="bg-[#FFFBF7] pb-16 pt-12 sm:pb-24 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Container className="max-w-5xl">
        <nav aria-label="Brotkrumen" className="mb-8 text-sm text-neutral-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="text-[#0F4F68] underline underline-offset-2 hover:text-[#084056]" href="/">
                Start
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link className="text-[#0F4F68] underline underline-offset-2 hover:text-[#084056]" href="/ratgeber">
                Ratgeber
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-neutral-700">Pflegegrad beantragen</li>
          </ol>
        </nav>

        <header className="overflow-hidden rounded-3xl border border-[#efcba7]/50 bg-gradient-to-br from-[#fffaf4] via-white to-[#f7fbfc] p-6 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[#0F4F68]/90 px-3 py-1 text-xs font-semibold text-white">
              Aktualisiert 2026
            </span>
            <span className="inline-flex rounded-full border border-[#0F4F68]/20 bg-white px-3 py-1 text-xs font-semibold text-[#0F4F68]">
              Mit Checkliste
            </span>
            <span className="inline-flex rounded-full border border-[#F47C20]/35 bg-[#FFF4ED] px-3 py-1 text-xs font-semibold text-[#c45a0c]">
              Für Angehörige
            </span>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0F4F68]/80">Ratgeber</p>
              <h1 className="mt-2 text-balance text-3xl font-extrabold leading-tight text-[#0F4F68] sm:text-4xl lg:text-[2.35rem]">
                Pflegegrad beantragen: Die große Checkliste für Angehörige
              </h1>
              <p className="mt-4 max-w-prose text-lg leading-relaxed text-neutral-700">
                Klare Schritte, realistische Vorbereitung auf die Begutachtung und die richtigen Unterlagen –
                ohne Juristendeutsch, dafür mit Praxisbezug für Ihren Pflegealltag.
              </p>

              <ul className="mt-6 flex flex-wrap gap-3 gap-y-4 text-xs text-neutral-600 sm:text-sm">
                <li className="flex items-center gap-2 rounded-xl border border-[#0F4F68]/15 bg-white/90 px-3 py-2">
                  <svg className="h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 21s-8-4.5-8-11l8-4 8 4c0 6.5-8 11-8 11z" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                  Fachlich geprüft
                </li>
                <li className="flex items-center gap-2 rounded-xl border border-[#0F4F68]/15 bg-white/90 px-3 py-2">
                  <svg className="h-5 w-5 shrink-0 text-[#0F4F68]" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                  Aktualisiert 2026
                </li>
                <li className="flex items-center gap-2 rounded-xl border border-[#0F4F68]/15 bg-white/90 px-3 py-2">
                  <svg className="h-5 w-5 shrink-0 text-[#F47C20]" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M8 21h8v-9a5 5 0 00-10 0v9zm4-12a3 3 0 013 3"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="6" r="3" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                  Für Angehörige erklärt
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#kompakte-checkliste"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#F47C20] px-8 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#e06d15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
                >
                  Checkliste ansehen
                </a>
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[#0F4F68]/30 bg-white px-8 py-3 text-center text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
                >
                  Beratung anfragen
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div
                className="absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br from-[#F78F2E]/25 via-transparent to-[#0F4F68]/15 blur-md"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[1.65rem] border border-white shadow-[0_22px_50px_-20px_rgba(15,79,104,0.45)]">
                <Image
                  src={HERO_IMAGE}
                  alt="Beratende Person mit Unterlagen – Pflegegrad-Antrag und Organisation im Familienalltag"
                  width={560}
                  height={420}
                  className="h-auto w-full object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14.5rem] xl:grid-cols-[minmax(0,1fr)_17rem]">
          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold text-[#0F4F68]">Inhalt</p>
                <ol className="mt-3 max-h-[70vh] space-y-2 overflow-y-auto text-sm lg:max-h-[calc(100vh-11rem)]">
                  {TOC_ENTRIES.map((e) => (
                    <li key={e.href}>
                      <a
                        href={e.href}
                        className="block rounded-lg px-2 py-1.5 text-neutral-700 underline-offset-4 transition hover:bg-[#F2F9FA] hover:text-[#0F4F68] hover:underline"
                      >
                        {e.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-6 hidden rounded-xl border border-dashed border-neutral-300 bg-[#fafafa] p-4 text-xs text-neutral-600 lg:block">
                <p>Hinweis: Dieser Beitrag ersetzt keine individuelle Pflege- oder Rechtsberatung.</p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-12 lg:order-first">
            <section
              id="das-wichtigste"
              className="scroll-mt-28 rounded-2xl border border-[#0F4F68]/12 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-bold text-[#0F4F68] sm:text-2xl">Das Wichtigste in Kürze</h2>
              <ul className="mt-5 space-y-3 text-neutral-800">
                {[
                  "Antrag bei der zuständigen Pflegekasse stellen – telefonisch, online oder schriftlich.",
                  "Ein formloser Antrag reicht zunächst aus, um den Leistungsanspruch anzustoßen.",
                  "Leistungen gelten in der Regel ab dem Monat der Antragstellung (mit den gesetzlichen Ausnahmen).",
                  "Begutachtung und Angaben sorgfältig vorbereiten – realistisch, nicht dramatisiert oder verharmlost.",
                  "Bei unzureichendem Pflegegrad oder Ablehnung Frist für Widerspruch prüfen und Unterlagen zusammentragen.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <IconCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <MidCta />

            <section id="wann-sinnvoll" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Wann ist ein Pflegegrad sinnvoll?</h2>
              <p className="leading-relaxed text-neutral-700">
                Ein Pflegegrad ist sinnvoll, sobald die Selbstständigkeit im Alltag voraussichtlich mindestens sechs Monate
                eingeschränkt ist oder bereits jetzt konkrete Unterstützung bei Körperpflege, Haushalt, Mobilität, Ernährung,
                Gedächtnis oder Krankheitsbewältigung nötig wird. Für Angehörige gilt: Wer früh klärt, welche Hilfen
                gebraucht werden, entscheidet nicht „über zu vorgezogene Pflege“, sondern schafft rechtzeitig Zugänge zu
                Leistungen und Beratung.
              </p>
              <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-sm text-neutral-800">
                <p className="font-semibold text-[#0F4F68]">Merke</p>
                <p className="mt-1">
                  Der Pflegegrad beschreibt den Hilfebedarf im Alltag, nicht nur die Diagnose. Auch ohne stationären
                  Pflegebedarf können Punktzahl und Grad angemessen sein.
                </p>
              </div>
            </section>

            <section id="zustaendige-kasse" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Zuständige Pflegekasse finden</h2>
              <p className="leading-relaxed text-neutral-700">
                Wer gesetzlich krankenversichert ist, ist in der Regel auch in der gesetzlichen Pflegeversicherung
                versichert – die Pflegekasse ist dann oft dieselbe Einrichtung wie die Krankenkasse. Privat
                Vollversicherte wenden sich an den privaten Pflegeversicherer. Studierende, geringfügig Beschäftigte
                und einige Sonderfälle haben eigene Regeln; bei Unsicherheit hilft ein kurzer Anruf bei der
                Krankenkasse oder die Prüfung des Versicherungsnachweises.
              </p>
              <ul className="space-y-2 text-neutral-700">
                {[
                  "Versichertennummer und Adresse der pflegebedürftigen Person bereithalten.",
                  "Wohnort und ggf. Umzug dokumentieren – Zuständigkeit kann sich ändern.",
                  "Bei mehreren potenziellen Kassen: die meldepflichtige Krankenkasse nutzen.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="antrag-stellen" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Pflegegrad-Antrag stellen</h2>
              <p className="leading-relaxed text-neutral-700">
                Sie können den Antrag telefonisch, schriftlich oder über Online-Portale der Kasse starten, sofern
                angeboten. Wichtig ist die eindeutige Antragstellung mit Identifikation der pflegebedürftigen Person.
                Die Pflegekasse dokumentiert das Datum des Eingangs – darauf können sich spätere Zeitfragen zur
                Leistung beziehen. Mit der weiteren Bearbeitung erhalten Sie häufig Fragebögen („Pflegeantragstellung
                strukturiert nach Modulen“) und Hinweise zur hausbegleitenden Begutachtung.
              </p>
              <div className="rounded-xl border border-amber-300/70 bg-[#FFF8EE] p-4 text-sm text-neutral-800">
                <div className="flex gap-2">
                  <svg className="h-6 w-6 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 9v3.5m0 4h.01M10.29 3.86L2.82 17a2 2 0 001.71 3h13.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-[#0F4F68]">Häufiger Fehler</p>
                    <p className="mt-1">
                      Antrag nur „mental“ vorbereiten, ohne Eingang zu dokumentieren. Ohne fristwahrende
                      Antragstellung verschiebt sich der Beginn möglicher Leistungen.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="musterformulierung" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Musterformulierung für den Antrag</h2>
              <p className="leading-relaxed text-neutral-700">
                Eine sachliche, klare Formulierung erleichtert die Bearbeitung. Passen Sie Namen, Daten und
                Vertretung an. Dieses Muster ersetzt keine Rechtsberatung.
              </p>
              <blockquote className="rounded-xl border border-[#0F4F68]/12 bg-[#F8FCFD] p-5 text-sm leading-relaxed text-neutral-800">
                <p>
                  Sehr geehrte Damen und Herren,
                  <br />
                  <br />
                  hiermit beantrage ich die Feststellung des Pflegegrades für [Vor- und Nachname, Geburtsdatum,
                  Versichertennummer] aufgrund einer voraussichtlich dauerhaften oder länger andauernden
                  Einschränkung der Selbstständigkeit im Alltag. Bitte teilen Sie mir mit, welche weiteren
                  Unterlagen Sie benötigen und vereinbaren Sie für die Begutachtung einen vereinbarungsfähigen
                  Termin. Mit freundlichen Grüßen …
                </p>
              </blockquote>
              <MidCta variant="kurz" />
            </section>

            <section id="unterlagen" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Diese Unterlagen sollten Sie sammeln</h2>
              <p className="leading-relaxed text-neutral-700">
                Nicht jede Liste ist immer vollständig – die Pflegekasse kann gezielt nach Dokumentation fragen.
                Folgende Dokumente erleichentern oft die Bewertung:
              </p>
              <div className="-mx-1 overflow-x-auto rounded-xl border border-[#0F4F68]/12">
                <table className="min-w-[32rem] w-full border-collapse text-left text-sm sm:min-w-0">
                  <caption className="sr-only">
                    Beispiele für sinnvolle Unterlagen beim Pflegegrad-Antrag
                  </caption>
                  <thead className="bg-[#0F4F68] text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Unterlage</th>
                      <th className="px-4 py-3 font-semibold">Nutzen für die Bewertung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0F4F68]/15 bg-white">
                    <tr>
                      <td className="px-4 py-3 text-neutral-800">Ärztliche Befunde, Arztbriefe</td>
                      <td className="px-4 py-3 text-neutral-700">Nachvollziehbarkeit des Krankheitsverlaufs</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-neutral-800">Entlassbriefe/Reha</td>
                      <td className="px-4 py-3 text-neutral-700">Übergänge nach Klinikaufenthalt</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-neutral-800">Medikationsplan</td>
                      <td className="px-4 py-3 text-neutral-700">Belege für Nebenwirkungen / Einschränkungen</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-neutral-800">Therapie-/Reha-Nachweise</td>
                      <td className="px-4 py-3 text-neutral-700">Funktionsentwicklung und Übungsstand</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-neutral-800">Vollmacht / Betreuungsurkunde</td>
                      <td className="px-4 py-3 text-neutral-700">Klarheit der Vertretung bei der Begutachtung</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="pflegetagebuch" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Pflegetagebuch führen</h2>
              <p className="leading-relaxed text-neutral-700">
                Ein dokumentierter Überblick über typische zwei Wochen hilft beim Ausfüllen der Fragebogen und beim
                Gespräch mit dem Gutachter: Zu welchen Tageszeiten treten Orientierungslosigkeit, Gleichgewichtsstörungen
                oder Kraftlosigkeit auf? Wie lange brauchen Routinen? Wer übernimmt was in der eingespielten
                Routine? Halten Sie Fakten sachlich fest – keine dramatischen, aber auch keine herunterspielerischen
                Formulierungen.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {["Datum und Uhrzeit", "Aktivität / Situation", "Benötigte Hilfe (Dauer, wer)", "Besonderheiten (Stürze, Verweigerung, Schmerz)"].map(
                  (h) => (
                    <li key={h} className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3 text-sm text-neutral-800">
                      {h}
                    </li>
                  ),
                )}
              </ul>
            </section>

            <section id="begutachtung" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Die Begutachtung vorbereiten</h2>
              <p className="leading-relaxed text-neutral-700">
                Die Begutachtung zu Hause soll typische Hilfe und typische Umwelt abbilden. Reduzieren Sie keine
                verkehrssicheren Hilfsmittel aus Scham – der Alltag zählt. Bereiten Sie ruhigen Sitzplatz, Beleuchtung
                und relevante Alltagsgegenstände vor (Medikamentenschrank, Rollator, Duschhilfen). Eine vertraute
                Person kann anwesend sein, sollte aber nicht für die betroffene Person antworten, wenn diese selbst
                antworten kann.
              </p>
            </section>

            <section id="ehrlichkeit" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Beim Begutachtungstermin ehrlich bleiben</h2>
              <p className="leading-relaxed text-neutral-700">
                Weder bagatellisieren noch übertreiben: Beides führt zu Verzerrungen. Beschreiben Sie konkrete
                Beispiele aus dem letzten Monat. Wenn etwas schwankt (gute und schlechte Tage), sagen Sie das offen.
                Das Gutachterteam kennt die Bandbreite von Verläufen bei Demenz, nach Schlaganfall oder bei
                degenerativen Erkrankungen.
              </p>
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-neutral-800">
                <p className="font-semibold text-[#0F4F68]">Warnung vor Minimierung aus Anstandsdenken</p>
                <p className="mt-1">
                  Angehörige sollten keine „Demonstration von Höchstleistungen“ forcieren und nicht die geleisteten
                  Stunden verkürzen. Die Begutachtung soll den Regelbedarf abbilden – nicht einen idealisierten kurzen
                  Tag.
                </p>
              </div>
            </section>

            <section id="bescheid" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Bescheid prüfen</h2>
              <p className="leading-relaxed text-neutral-700">
                Der Bescheid soll Grad, Bewertungsübersicht, Rechtsmittelbelehrung und Zeitpunkte enthalten. Vergleichen
                Sie Punktezahl und Modulgewichte mit eigenen Dokumentationsnotizen und dem Pflegetagebuch. Wenn
                zentrale Aktivitäten in der Bewertung fehlen, kann das ein Ansatzpunkt für Rückfragen oder einen späteren
                Widerspruch sein.
              </p>
            </section>

            <section id="widerspruch" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Pflegegrad abgelehnt oder zu niedrig: Widerspruch</h2>
              <p className="leading-relaxed text-neutral-700">
                Widerspruch ist ein formales Verwaltungsinstrument: Frist aus dem Bescheid beachten, schriftlich und
                begründet sein. Dokumentierte Einschränkungen ergänzend einreichen, ergänzendes Gutachten wenn
                sachlich gerechtfertigt. Bei vertretbarem Zweifel lohnen häufig Vorgespräche einer Beratung oder
                sozialrechtlich versierter Stelle – keine Rechtsberatung hier, aber strukturierte Hinweise erhältlich,
                etwa über{" "}
                <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                  unsere Kontaktaufnahme
                </Link>
                .
              </p>
              <p className="text-sm text-neutral-600">
                Vertiefende Einordnung zur Widerspruchsstrategie:{" "}
                <Link
                  href="/ratgeber/pflegegrad-widerspruch"
                  className="font-medium text-[#0F4F68] underline underline-offset-2"
                >
                  Ratgeber „Pflegegrad Widerspruch“ (geplant)
                </Link>
                .
              </p>
            </section>

            <section
              id="kompakte-checkliste"
              className="scroll-mt-28 space-y-5 rounded-2xl border-2 border-[#0F4F68]/18 bg-white p-6 shadow-md sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-[#0F4F68]">Kompakte Download-Checkliste</h2>
                <span className="rounded-full bg-[#0F4F68]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#0F4F68]">
                  Druckvorlage später per E-Mail
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  "Antrag Datum / Kanal dokumentiert",
                  "Pflegekasse / Ansprechpartner notiert",
                  "Fragebogen vollständig + Kopie",
                  "Pflegetagebuch 14 Tage konsistent geführt",
                  "Arzt-/Entlass-/Medikamente Unterlagen kopiert sortiert",
                  "Begutachtung: ruhige Atmosphäre, Routine sichtbar, Vertretungsklärung",
                  "Bescheid: Punktespiegel gegen Tagebuch geprüft",
                  "Widerspruchsfrist im Kalender / Akte gesetzt wenn nötig",
                ].map((t) => (
                  <li key={t} className="flex gap-3 rounded-xl bg-[#F8FCFD]/80 px-3 py-2">
                    <IconCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden />
                    <span className="text-neutral-800">{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="lead-download" className="scroll-mt-28 space-y-5 rounded-2xl border border-[#F47C20]/35 bg-gradient-to-br from-white via-[#FFF8F2] to-white p-6 shadow-sm sm:p-8">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold text-[#0F4F68]">Kostenlose Pflegegrad-Checkliste herunterladen</h2>
                <p className="mt-3 leading-relaxed text-neutral-700">
                  Erhalten Sie die wichtigsten Schritte zur Beantragung des Pflegegrades als kompakte Checkliste –
                  ideal zur Vorbereitung auf den Antrag und die Begutachtung.
                </p>
              </div>
              <PflegegradBeantragenLeadForm />
              <MidCta variant="minimal" />
            </section>

            <section id="leistungen" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Welche Leistungen können nach dem Pflegegrad wichtig sein?</h2>
              <p className="leading-relaxed text-neutral-700">
                Je nach Grad kommen etwa Pflegegeld, anrechenbare Pflegesachleistungen, Relief über Entlastungsbetrag,
                hilfreiche Mittel gegen Mehrbedarf, Verhinderungs- oder Kurzzeitregelungen in Betracht. Vertiefungen:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Hinweis: Einige URLs sind strukturelle Platzhalter; fehlende Ziel-Ratgeber liefern 404 bis die Seiten existieren. */}
                <LinkCard href="/ratgeber/pflegegeld-2026" title="Pflegegeld (Überblick 2026)" />
                <LinkCard href="/ratgeber/pflegegrad-1-leistungen" title="Pflegegrad 1 – Leistungen im Detail" />
                <LinkCard href="/ratgeber/pflegegrad-2-leistungen" title="Pflegegrad 2 – Leistungen im Detail" />
                <LinkCard href="/ratgeber/entlastungsbetrag-131-euro" title="Entlastungsbetrag 131 Euro" />
                <LinkCard href="/ratgeber/verhinderungspflege" title="Verhinderungspflege" />
                <LinkCard href="/ratgeber/pflegehilfsmittel" title="Pflegehilfsmittel" />
              </div>
              <p className="text-sm text-neutral-600">
                Bereits online: Ausführliche Artikel zum{" "}
                <Link className="font-medium text-[#0F4F68] underline" href="/ratgeber/pflegegrad-1-der-ultimative-leitfaden">
                  Pflegegrad 1 im Leitfaden
                </Link>
                {" "}und zum{" "}
                <Link className="font-medium text-[#0F4F68] underline" href="/ratgeber/pflegegrad-2-alles-was-du-wissen-musst">
                  Pflegegrad 2 Ratgeber
                </Link>
                . Der{" "}
                <Link className="font-medium text-[#0F4F68] underline" href="/ratgeber/entlastungsbetrag-131-euro">
                  Entlastungsbetrag von 131 Euro
                </Link>{" "}
                schließt häufig an alle Grade an – falls anerkannt.
              </p>
            </section>

            <section id="fehler" className="scroll-mt-28 space-y-4 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">Häufige Fehler beim Pflegegrad-Antrag</h2>
              <div className="space-y-3">
                {[
                  {
                    titel: "Angaben schönreden oder extrem übertreiben",
                    body: "Beides untergräbt Glaubwürdigkeit. Nutzen Sie sachliche Alltagsbeschreibungen.",
                  },
                  {
                    titel: "Begutachtung zu „kuratieren“ wie ein Fotoshooting",
                    body: "Ordnung okay – aber gelebter chaotischer Alltag soll sichtbar bleiben, wenn er Teil des Hilfebedürfnisses ist.",
                  },
                  {
                    titel: "Nach Umfallerkenntnis keine Nachfassung beim Bescheid",
                    body: "Punkteübertrag falsch angelegter Module prüfen, gezielt rückfragen oder Widerspruch erwägen.",
                  },
                ].map((b) => (
                  <div key={b.titel} className="rounded-xl border border-amber-300/70 bg-[#FFF9F3] px-4 py-3">
                    <p className="font-semibold text-[#0F4F68]">{b.titel}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-700">{b.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq" className="scroll-mt-28 rounded-2xl border border-[#0F4F68]/12 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-[#0F4F68]">FAQ</h2>
              <div className="mt-6 space-y-2">
                {FAQ_ITEMS.map((item) => (
                  <details key={item.q} className="group rounded-xl border border-[#0F4F68]/12 bg-[#fafcfb] px-4 py-3 open:bg-white">
                    <summary className="cursor-pointer list-none font-semibold text-[#0F4F68] [&::-webkit-details-marker]:hidden">
                      <span className="flex items-start justify-between gap-3">
                        {item.q}
                        <span className="mt-1 shrink-0 text-xs text-neutral-500 transition group-open:rotate-180" aria-hidden>
                          ▼
                        </span>
                      </span>
                    </summary>
                    <p className="mt-3 border-t border-[#0F4F68]/10 pt-3 text-sm leading-relaxed text-neutral-700">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <FinalCta />

            <div className="rounded-2xl border border-[#0F4F68]/15 bg-neutral-50/90 p-5 text-center text-xs text-neutral-600 sm:p-6">
              <p>
                Fachlich geprüft · Aktualisiert 2026 · Für Angehörige verständlich aufbereitet · Dieser Beitrag ersetzt keine
                individuelle Pflege- oder Rechtsberatung.
              </p>
            </div>

            <VerwandteRatgeberBeitraege currentSlug="pflegegrad-beantragen-checkliste" />
          </div>
        </div>
      </Container>
    </article>
  );
}

function MidCta({ variant = "default" }: { variant?: "default" | "kurz" | "minimal" }) {
  if (variant === "minimal") {
    return (
      <div className="rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA]/80 px-5 py-4 text-sm text-neutral-700">
        <p>Kurzentscheidung: Wir begleiten strukturiert – von der Unterlagenliste bis zur Begutachtung.</p>
        <Link
          href="/kontakt"
          className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0F4F68] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0c3d52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F47C20] sm:text-sm"
        >
          Jetzt Beratung anfragen
        </Link>
      </div>
    );
  }
  if (variant === "kurz") {
    return (
      <div className="rounded-xl border border-[#0F4F68]/12 bg-gradient-to-r from-[#F2F9FA] to-white px-5 py-5">
        <p className="font-semibold text-[#0F4F68]">Rückfragen?</p>
        <p className="mt-1 text-sm text-neutral-700">
          Sprechen Sie uns an – wir helfen beim Ordnen der Argumente und Dokumente, ohne Rechtsberatung zu ersetzen.
        </p>
        <Link
          href="/kontakt"
          className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#0F4F68]/30 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA]"
        >
          Kontakt
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-[#0F4F68]/15 bg-gradient-to-br from-[#F2F9FA] via-white to-[#FFF8F2] px-6 py-7 shadow-sm">
      <h3 className="text-lg font-bold text-[#0F4F68]">Unterwegs und unsicher beim nächsten Schritt?</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700 sm:text-base">
        Wir unterstützen Sie bei strukturierter Vorbereitung, typischen Unterlagen für die Begutachtung und beim
        realistischen Einschätzen des Hilfebedarfs – abgestimmt auf Familie und Alltag zu Hause.
      </p>
      <Link
        href="/kontakt"
        className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0F4F68] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#0c3d52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F47C20]"
      >
        Pflegeberatung kontaktieren
      </Link>
    </div>
  );
}

function LinkCard({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-[#0F4F68]/12 bg-[#fafcfb] px-4 py-3 text-sm font-semibold text-[#0F4F68] shadow-sm transition hover:border-[#0F4F68]/30 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
    >
      <span>{title}</span>
      <span className="text-neutral-400 transition group-hover:translate-x-0.5" aria-hidden>
        →
      </span>
    </Link>
  );
}

function FinalCta() {
  return (
    <section
      id="abschluss-cta"
      className="scroll-mt-28 overflow-hidden rounded-3xl border border-[#0F4F68]/15 bg-gradient-to-br from-[#0F4F68] via-[#125a75] to-[#0a3d52] p-8 text-white shadow-lg sm:p-10"
      aria-labelledby="final-cta-heading"
    >
      <h2 id="final-cta-heading" className="text-2xl font-bold leading-snug sm:text-3xl">
        Sie möchten einen Pflegegrad beantragen und wissen nicht, wo Sie anfangen sollen?
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">
        Wir unterstützen Sie bei der Vorbereitung, zeigen Ihnen wichtige Unterlagen und helfen Ihnen dabei, den
        Pflegebedarf realistisch einzuschätzen.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/kontakt"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#F47C20] px-8 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#e06d15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Pflegegrad-Beratung anfragen
        </Link>
        <Link
          href="/ratgeber"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/60 bg-white/10 px-8 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Weitere Pflege-Ratgeber lesen
        </Link>
      </div>
    </section>
  );
}
