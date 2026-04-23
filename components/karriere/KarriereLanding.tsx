import Image from "next/image";
import Link from "next/link";
import { ProtectedRasterMedia } from "@/components/home/ProtectedRasterMedia";
import { Container } from "@/components/layout/Container";
import { KarriereForm } from "@/components/forms/KarriereForm";
import { JetztBewerbenButton } from "@/components/karriere/JetztBewerbenButton";
import { StellenbeschreibungDialogTrigger } from "@/components/karriere/StellenbeschreibungDialog";
import { cn } from "@/lib/utils";

const HERO_IMG = "/images/Karriere1.webp";

/** Weißer Kartenrahmen 10px, Eckenradius 15px + Standard-Schatten (vgl. Leistungs-Landingpages). */
const STELLEN_WEISSER_RAHMEN =
  "rounded-[15px] border-[10px] border-solid border-white bg-white shadow-[0_10px_40px_rgba(15,79,104,0.07)] transition-shadow duration-300 hover:shadow-[0_16px_52px_rgba(15,79,104,0.11)]";

/**
 * Bogen von Hero (#fafbfc) zu „Offene Stellen“ (#FFFFFF): eine nach oben offene Kurve,
 * unten geschlossen; sitzt am unteren Hero-Rand (bündig zur Bildunterkante bei items-end).
 */
const KARRIERE_HERO_BOGEN_D =
  "M0,100 L0,52 Q600,4 1200,52 L1200,100 L0,100 Z";

/** Welle am oberen Rand: Mint-Stellenband (#F2F9FA) bzw. Kontaktbereich (#FFFFFF), von der jeweils darüber liegenden Fläche herunter (vgl. HaushaltshilfeLanding). */
const KARRIERE_KONTAKT_WELLEN_D =
  "M0,100 C200,26 420,6 600,18 C800,32 1010,75 1200,100 L1200,100 L0,100 Z";
const KARRIERE_WELLEN_OBEN_SVG_CLASS =
  "pointer-events-none absolute left-0 top-0 z-[1] h-16 w-full -translate-y-7 sm:h-[clamp(2.85rem,1.5rem+3.8vw,5rem)] sm:-translate-y-[clamp(0.9rem,0.35rem+2.1vw,3.2rem)]";

/** Einleitung unter der Überschrift „Die Alltagshilfe-Süd als neuer Arbeitgeber?“, vor den Stichpunkten. */
const KARRIERE_ARBEITGEBER_INTRO =
  "Bei uns stehen die Menschen im Mittelpunkt. Unsere Mitarbeitenden sind das Herz und Motor unserer Firma. Deshalb geben wir jeden Tag unser Bestes, handeln mit Überzeugung und schaffen ein Umfeld, in dem sich der Job dem Alltag anpasst und nicht der Alltag dem Job. Weil liebevolle Hilfe und gute Arbeit nur mit Herz wirklich gelingen.";

/** Arbeitgeber-Vorteile – Darstellung wie „Ihre Vorteile bei uns“ auf der Startseite. */
const KARRIERE_ARBEITGEBER_FAKTEN = [
  "Tarifgerechte Vergütung und planbare Arbeitszeiten mit klaren Strukturen",
  "Echte Teamkultur: Einarbeitung, fester Ansprechpartner und Unterstützung vor Ort",
  "Fort- und Weiterbildungen – wir investieren in Ihre Entwicklung",
  "Sinnstiftende Arbeit in der Region, nah bei Menschen im Alltag",
  "Flexible Modelle vom Minijob bis zur Vollzeit – mit Augenmaß in der Dienstplanung",
  "Leistungsbezüge wie Kilometergeld, Sachbezugskarte und Gesundheitsbonus",
  "30 Urlaubstage bei einer 5-Tage-Woche und faire Regelungen zu Ersatzzeiten",
  "Unbefristete Anstellung nach Probezeit bei guter Zusammenarbeit",
] as const;

/** Drei zentrale Arbeitgeber-Vorteile (einheitlich auf allen Stellenkarten). */
const STELLEN_VORTEILE = [
  "Tarifgerechte Vergütung, planbare Zeiten und klare Strukturen im Alltag",
  "Echte Teamkultur: Einarbeitung, fester Ansprechpartner und Unterstützung vor Ort",
  "Sinnstiftende Arbeit in der Region – dort, wo Hilfe für Menschen ankommt",
] as const;

const jobs = [
  { id: "alltagshelfer", title: "Alltagshelfer*in (m/w/d)", icon: "heart" },
  { id: "pflegeberater", title: "Pflegeberater*in (m/w/d)", icon: "hand" },
  { id: "buchhalter", title: "Buchhalter*in (m/w/d)", icon: "desk" },
  { id: "standortleiter", title: "Bürofachkraft (m/w/d)", icon: "star" },
] as const;

/** Kartenfarben passend zur Seite: Orange, sanft gelb (Pflegeberater), Grün, Blau. */
const JOB_CARD_THEME: Record<string, { article: string; header: string; icon: string; inner: string }> = {
  alltagshelfer: {
    article: "border-0 bg-white",
    header: "bg-[#FFFBF7]/95",
    icon: "bg-[#DEB896] text-white shadow-sm",
    inner: "bg-white",
  },
  pflegeberater: {
    article: "border-0 bg-white",
    header: "bg-amber-50/55",
    icon: "bg-amber-300/90 text-white shadow-sm",
    inner: "bg-white",
  },
  buchhalter: {
    article: "border-0 bg-white",
    header: "bg-emerald-50/50",
    icon: "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/25",
    inner: "bg-white",
  },
  standortleiter: {
    article: "border-0 bg-white",
    header: "bg-sky-50/50",
    icon: "bg-sky-600 text-white shadow-sm ring-1 ring-sky-800/20",
    inner: "bg-white",
  },
};

/** Sekundär-Aktion auf mintfarbenem Stellen-Hintergrund (#F2F9FA): heller Kartenkontrast. */
const STELLEN_BESCHREIBUNG_BTN =
  "border border-[#0F4F68]/12 bg-white text-[#0F4F68] hover:bg-[#f8fcfd] focus:ring-[#0F4F68]";

const BTN_BASE =
  "inline-flex min-h-[40px] w-full items-center justify-center rounded-lg px-2 py-2 text-center text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:min-h-[44px] sm:text-sm";

const iconPaths: Record<string, string> = {
  heart:
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  hand: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  desk: "M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

function JobIcon({ name }: { name: string }) {
  const d = iconPaths[name] || iconPaths.heart;
  return (
    <svg className="h-6 w-6 shrink-0 sm:h-7 sm:w-7 lg:h-6 lg:w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function VorteilHaken() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-[#F78F2E]"
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

function OffeneStellenSpalte() {
  return (
    <div
      id="offene-stellen"
      className="min-w-0 w-full scroll-mt-[var(--ahs-header-scroll-padding)]"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-fade-in-up sm:max-w-3xl">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl lg:text-[clamp(1.875rem,1.05rem+1.35vw,2.5rem)]">
          Unsere offenen Stellenangebote
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-sm font-medium text-neutral-600 sm:mt-4 sm:text-base">
          Bewirb dich jetzt, es dauert nur einen kleinen Moment
        </p>
      </div>
      <div className="relative left-1/2 mt-8 flex w-screen max-w-[100vw] -translate-x-1/2 justify-center px-3 sm:mt-10 sm:px-4 lg:px-6">
        <ul className="grid w-full max-w-[min(100rem,calc(100vw-1.5rem))] list-none grid-cols-1 items-stretch gap-6 perspective-[1600px] sm:grid-cols-2 sm:gap-8 sm:max-w-[min(100rem,calc(100vw-2rem))] lg:grid-cols-4 lg:gap-6 xl:gap-8">
        {jobs.map((job, index) => {
          const theme = JOB_CARD_THEME[job.id] ?? JOB_CARD_THEME.alltagshelfer;
          return (
            <li
              key={job.id}
              className="min-w-0 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-karriere-stelle-flip-in [transform-style:preserve-3d]"
              style={{ animationDelay: `${0.08 + index * 0.11}s` }}
            >
              <div className={cn("box-border h-full min-h-0 overflow-hidden", STELLEN_WEISSER_RAHMEN)}>
                <article
                  className={cn(
                    "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-0 transition-all hover:shadow-lg",
                    theme.article,
                  )}
                >
                  <div className={cn("px-3 py-4 text-center sm:px-4 sm:py-5", theme.header)}>
                    <span
                      className={cn(
                        "mx-auto flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11",
                        theme.icon,
                      )}
                    >
                      <JobIcon name={job.icon} />
                    </span>
                    <h3 className="mt-3 text-balance text-sm font-extrabold leading-snug text-[#0F4F68] sm:text-base lg:text-[1.05rem]">
                      {job.title}
                    </h3>
                  </div>
                  <div className={cn("flex min-h-0 flex-1 flex-col px-3 pb-4 pt-1 sm:px-4 sm:pb-4", theme.inner)}>
                    <div className="flex min-h-0 flex-1 flex-col justify-center">
                      <ul className="space-y-1.5 text-[11px] leading-snug text-neutral-700 sm:space-y-2 sm:text-xs lg:text-[11px] xl:text-xs">
                        {STELLEN_VORTEILE.map((h) => (
                          <li key={h} className="flex items-start gap-1.5 sm:gap-2">
                            <VorteilHaken />
                            <span className="text-pretty">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 pt-3">
                      <StellenbeschreibungDialogTrigger
                        jobTitle={job.title}
                        className={cn(BTN_BASE, STELLEN_BESCHREIBUNG_BTN)}
                      />
                      <JetztBewerbenButton
                        jobTitle={job.title}
                        className={cn(
                          BTN_BASE,
                          "bg-[#0F4F68] text-white hover:bg-[#0c3d52] focus:ring-[#0F4F68]",
                        )}
                      />
                    </div>
                  </div>
                </article>
              </div>
            </li>
          );
        })}
        </ul>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-pretty text-center text-sm text-neutral-700 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-fade-in-up sm:mt-10 sm:max-w-3xl sm:text-base [animation-delay:0.55s] motion-reduce:[animation-delay:0s]">
        Kein Treffer in der Viererreihe? Oft entstehen die besten Teams, wenn jemand einfach „Hallo“ sagt. Erzählen Sie uns, was Sie auszeichnet – und bewerben Sie sich{" "}
        <a
          href="#bewerbung-form"
          title="Zum Kontakt- und Bewerbungsformular (Daniel Niebauer)"
          className="font-bold text-[#0F4F68] underline decoration-[#0F4F68] underline-offset-2 transition-colors hover:text-[#0c3d52] hover:decoration-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded-sm"
        >
          initiativ
        </a>{" "}
        bei uns.
      </p>
    </div>
  );
}

function KarriereArbeitgeberVorteile() {
  return (
    <div className="mx-auto w-full max-w-6xl text-center opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-fade-in-up [animation-delay:0.12s] motion-reduce:[animation-delay:0s]">
      <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl">
        Die Alltagshilfe-Süd als neuer Arbeitgeber?
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-pretty text-sm font-bold leading-relaxed text-neutral-800 sm:mt-5 sm:text-base">
        {KARRIERE_ARBEITGEBER_INTRO}
      </p>
      <ul
        className="mt-6 grid gap-4 text-left sm:mt-7 sm:grid-cols-2 sm:gap-x-6"
        aria-label="Vorteile als Arbeitgeber Alltagshilfe-Süd"
      >
        {KARRIERE_ARBEITGEBER_FAKTEN.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/75 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]"
          >
            <ProtectedRasterMedia className="inline-flex shrink-0 select-none [-webkit-user-drag:none]">
              <img
                src="/images/haken.webp"
                alt=""
                aria-hidden
                width={38}
                height={38}
                draggable={false}
                className="mt-0.5 h-[38px] w-[38px] object-contain"
              />
            </ProtectedRasterMedia>
            <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bewerbungsformular links; rechte Spalte wie app/kontakt/page.tsx, Inhalt Daniel Niebauer. */
function KarriereBewerbungUndAnsprechpartner() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="order-2 flex min-w-0 flex-col lg:order-1">
          <div className="mx-auto w-full max-w-xl rounded-2xl bg-[#F2F9FA] p-6 sm:p-8 lg:mx-0 lg:max-w-none lg:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">Kontakt</h2>
            <div className="mt-8 sm:mt-10">
              <KarriereForm hideFileAttachments />
            </div>
            <p className="mt-8 text-sm text-neutral-500">
              Weitere Informationen zur Datenverarbeitung finden Sie in unserer{" "}
              <Link href="/datenschutz" className="underline hover:text-neutral-700">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="order-1 flex min-w-0 flex-col items-center gap-6 text-center lg:order-2">
          <div className="flex w-full flex-col items-center">
            <div
              className="relative aspect-[4/3] w-full max-w-md overflow-visible opacity-0 animate-fade-in-up sm:max-w-lg"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="relative h-full w-full isolate [transform:translateZ(0)] [backface-visibility:hidden]">
                <Image
                  src="/images/Daniel_Niebauer.webp"
                  alt="Daniel Niebauer – Personalreferent, Alltagshilfe-Süd"
                  fill
                  className="object-contain drop-shadow-[0_4px_20px_rgba(15,79,104,0.18)]"
                  sizes="(max-width: 1024px) 90vw, 50vw"
                />
              </div>
            </div>
            <div
              className="relative z-10 -mt-10 w-full max-w-sm rounded-xl bg-[#F2F9FA] px-6 py-3 text-center text-lg font-bold text-[#0F4F68] sm:-mt-12 sm:max-w-md sm:py-4 sm:text-xl"
              style={{ boxShadow: "0 -2px 12px rgba(15, 79, 104, 0.15)" }}
            >
              Daniel Niebauer
            </div>
            <p className="mx-auto mt-2.5 max-w-sm text-center text-xs font-semibold text-neutral-600 sm:max-w-md sm:text-sm">
              Personalreferent
            </p>
          </div>
          <div className="mx-auto w-full max-w-md opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <p className="text-base font-semibold text-[#0F4F68] sm:text-lg">Ihr Ansprechpartner</p>
            <a
              href="tel:+4983349893330"
              className="mt-2 flex items-center justify-center gap-2 text-3xl font-bold tabular-nums text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded sm:text-4xl"
              aria-label="Anrufen: 08334 9893330"
            >
              <svg
                className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
                style={{ color: "#F78F2E" }}
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>08334 / 9893330</span>
            </a>
            <ul className="mt-5 space-y-2 text-base text-neutral-700 sm:text-lg">
              <li>
                <span className="font-semibold text-[#0F4F68]">Mo–Do:</span> 08:30 – 12:00 und 13:00 – 16:00
              </li>
              <li>
                <span className="font-semibold text-[#0F4F68]">Freitag:</span> 08:30 – 12:00
              </li>
            </ul>

            <section
              className="mt-8 border-t border-neutral-200 pt-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
              aria-labelledby="karriere-daniel-email-heading"
            >
              <h3 id="karriere-daniel-email-heading" className="text-sm font-semibold text-neutral-600">
                E-Mail
              </h3>
              <a
                href="mailto:daniel.niebauer@alltagshilfe-sued.de"
                className="mt-2 block break-all text-base font-medium text-[#0F4F68] hover:underline sm:text-lg"
              >
                daniel.niebauer@alltagshilfe-sued.de
              </a>
              <p className="mt-5 text-sm text-neutral-700">
                Für eine allgemeine Nachricht nutzen Sie gern unser{" "}
                <Link
                  href="/kontakt"
                  className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                >
                  Kontaktformular
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export function KarriereLanding() {
  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article
        id="karriere-landing"
        className="min-w-0 scroll-mt-[var(--ahs-header-scroll-padding)] overflow-x-clip overflow-y-visible"
      >
        <section
          aria-labelledby="karriere-hero-heading"
          className="relative isolate z-0 min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] pb-0 pt-0"
        >
          {/* Bild wie zuvor oben/rechts; Bogen unten bleibt separat am Hero-Rand. */}
          <div className="relative min-h-[min(60vh,508px)] w-full sm:min-h-[min(56.8vh,478px)] lg:min-h-[min(54vh,448px)]">
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 w-[75%] max-w-[75vw] overflow-x-clip overflow-y-visible">
              <div className="flex h-full justify-end overflow-visible">
                <Image
                  src={HERO_IMG}
                  alt="Karriere bei der Alltagshilfe-Süd – Team und Arbeitgeber"
                  width={970}
                  height={495}
                  priority
                  sizes="75vw"
                  className="h-auto max-h-[min(60vh,508px)] w-auto max-w-full object-contain object-right object-top sm:max-h-[min(56.8vh,478px)] lg:max-h-[min(54vh,448px)]"
                />
              </div>
            </div>
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-[8] w-[75%] max-w-[75vw] bg-gradient-to-r from-[#fafbfc] from-0% via-white/55 via-[28%] to-transparent to-[58%] sm:from-[#fafbfc] sm:via-white/90 sm:via-[38%] sm:to-transparent sm:to-[82%] lg:via-white/95 lg:via-[40%] lg:to-[88%]"
              aria-hidden
            />
            {/* Mobil: zentriert ohne translate; ab sm leicht nach rechts wie Desktop. */}
            <div className="relative z-10 mx-auto flex min-h-[min(60vh,508px)] w-full max-w-7xl flex-col justify-center px-4 py-5 max-sm:items-center sm:min-h-[min(56.8vh,478px)] sm:items-stretch sm:px-6 sm:py-6 lg:min-h-[min(54vh,448px)] lg:px-[var(--ahs-page-gutter)] lg:py-7">
              <div className="box-border w-full max-w-full max-sm:flex max-sm:justify-center">
                <header className="w-full max-w-xl text-center max-sm:mx-auto max-sm:max-w-[min(100%,22rem)] max-sm:translate-x-0 sm:translate-x-5 lg:max-w-[min(100%,30rem)] lg:translate-x-7 xl:max-w-[34rem]">
                  <h1
                    id="karriere-hero-heading"
                    className="text-balance text-3xl font-bold leading-snug tracking-tight text-[#0F4F68] opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-karriere-hero-in sm:text-4xl md:text-5xl lg:text-[clamp(2rem,1.05rem+1.85vw,2.85rem)] xl:text-[clamp(2.15rem,1.15rem+1.7vw,3.05rem)]"
                  >
                    <span className="block">Starte jetzt deine neue Karriere</span>
                    <span className="mt-1 block sm:mt-1.5">bei der Alltagshilfe-Süd</span>
                  </h1>
                  <div
                    className="mt-5 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-fade-in-up sm:mt-6"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Link
                      href="#offene-stellen"
                      className="inline-flex w-full min-h-[2.75rem] transform items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-2.5 text-sm font-semibold leading-snug text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:min-h-[2.85rem] sm:w-auto sm:max-w-[min(100%,22rem)] sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-3.5 md:text-lg"
                    >
                      Bewirb dich jetzt in 1 Minute
                    </Link>
                  </div>
                </header>
              </div>
            </div>
            {/* Bogenübergang nach unten in den weißen Bereich „Offene Stellen“. */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[3.25rem] w-full max-sm:h-[2.75rem] sm:h-[clamp(3.5rem,2rem+4vw,5.25rem)]"
              aria-hidden
            >
              <svg
                className="h-full w-full"
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden
              >
                <path d={KARRIERE_HERO_BOGEN_D} fill="#FFFFFF" />
              </svg>
            </div>
          </div>
        </section>

        <section
          id="bewerbung"
          className="relative z-10 -mt-px overflow-x-visible bg-[#FFFFFF] pb-0 pt-8 sm:pt-10 lg:pt-12"
        >
          <Container className="relative w-full pb-8 sm:pb-10 lg:pb-12">
            <KarriereArbeitgeberVorteile />
          </Container>
          <div className="relative left-1/2 mt-16 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip bg-[#F2F9FA] pb-12 sm:mt-20 sm:pb-16 lg:mt-24 lg:pb-20">
            <svg
              className={KARRIERE_WELLEN_OBEN_SVG_CLASS}
              viewBox="0 0 1200 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden
            >
              <path d={KARRIERE_KONTAKT_WELLEN_D} fill="#F2F9FA" />
            </svg>
            <Container className="relative z-[2] w-full pt-[clamp(2.25rem,3vw+1rem,3.25rem)]">
              <OffeneStellenSpalte />
            </Container>
          </div>
          <div
            id="bewerbung-form"
            className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-[var(--ahs-header-scroll-padding)] overflow-x-clip bg-[#FFFFFF] pb-12 pt-[clamp(2.75rem,4vw+1.5rem,4.5rem)] sm:pb-16 sm:pt-[clamp(3rem,4.5vw+1.5rem,4.75rem)] lg:pb-20 lg:pt-[clamp(3.25rem,5vw+1.5rem,5rem)]"
          >
            <svg
              className={KARRIERE_WELLEN_OBEN_SVG_CLASS}
              viewBox="0 0 1200 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden
            >
              <path d={KARRIERE_KONTAKT_WELLEN_D} fill="#FFFFFF" />
            </svg>
            <Container className="relative z-10 w-full">
              <KarriereBewerbungUndAnsprechpartner />
            </Container>
          </div>
        </section>

        <section
          className="border-t border-neutral-200 bg-[#FAFBFC] py-8 sm:py-10"
          aria-labelledby="karriere-initiativ-heading"
        >
          <Container>
            <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
              <h2
                id="karriere-initiativ-heading"
                className="text-base font-bold text-[#0F4F68] sm:text-lg"
              >
                Initiativbewerbung
              </h2>
              <p className="max-w-md text-pretty text-center text-sm text-neutral-600 sm:max-w-lg sm:text-base">
                Keine passende Stelle? Schreiben Sie uns initiativ – wir melden uns bei Ihnen.
              </p>
              <Link
                href="#bewerbung-form"
                title="Zum Kontakt- und Bewerbungsformular auf dieser Seite"
                className="inline-flex min-h-[2.5rem] shrink-0 items-center justify-center rounded-full border-2 border-[#F78F2E] bg-white px-5 py-2 text-sm font-bold tracking-wide text-[#F78F2E] shadow-[0_4px_14px_rgba(247,143,46,0.35)] ring-2 ring-[#F78F2E]/25 transition hover:bg-[#F78F2E] hover:text-white hover:shadow-[0_6px_20px_rgba(247,143,46,0.45)] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:min-h-[2.65rem] sm:px-6 sm:text-[0.95rem]"
              >
                Initiativ bewerben
              </Link>
            </div>
          </Container>
        </section>
      </article>
    </div>
  );
}
