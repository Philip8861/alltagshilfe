import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { siteConfig } from "@/config/site";
import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";
import { STARTSEITE_VORTEILE, STARTSEITE_VORTEILE_INTRO } from "@/lib/startseite-vorteile";

const HERO_IMG = "/images/operation.webp";

const HERO_GLOW_CLASS =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]";

const HERO_VORTEILE = [
  "Wir übernehmen die Kommunikation mit Ihrer Krankenkasse",
  "Unkomplizierte und schnelle Terminvergabe",
  "Für Sie entstehen keine Kosten",
] as const;

const WELLEN_D =
  "M0,100 C200,26 420,6 600,18 C800,32 1010,75 1200,100 L1200,100 L0,100 Z";

const WELLEN_SVG_CLASS =
  "pointer-events-none absolute left-0 top-0 z-0 h-16 w-full -translate-y-7 sm:h-[clamp(2.85rem,1.5rem+3.8vw,5rem)] sm:-translate-y-[clamp(0.9rem,0.35rem+2.1vw,3.2rem)]";

function HeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

const SCHRITTE = [
  {
    step: "Schritt 1",
    title: "Unverbindlich anfragen",
    description:
      "Kontaktieren Sie uns telefonisch oder über das Kontaktformular. Wir klären kurz Ihren Bedarf und die nächsten Schritte – ohne Verpflichtung.",
  },
  {
    step: "Schritt 2",
    title: "Kommunikation mit Ihrer Krankenkasse",
    description:
      "Wir übernehmen die Kommunikation mit Ihrer Krankenkasse und informieren Sie, sobald alles geklärt ist.",
  },
  {
    step: "Schritt 3",
    title: "Planung der Einsätze",
    description:
      "Nach der Genehmigung planen wir gemeinsam die Einsatzzeiten und sorgen dafür, dass Sie schnell Unterstützung im Alltag erhalten.",
  },
] as const;

const LEISTUNGS_TILES = [
  "Reinigung der Wohnung",
  "Hilfe bei Anträgen und Formularen",
  "Einkaufsservice",
  "Wäsche waschen & bügeln",
  "Fahrten zum Arzt, zu Behörden usw.",
  "Individuelle Hilfsleistungen nach Absprache",
] as const;

/** „Ihre Vorteile bei uns“: nur auf dieser Seite ohne die drei Pflege-/KK-Punkte der Startseitenliste. */
const HNO_VORTEILE_BEI_UNS_AUSGESCHLOSSEN = new Set<string>([
  "Zugelassen bei allen Pflege- und Krankenkassen in Deutschland",
  "Ab Pflegegrad 1: Nutzen Sie Ihren Entlastungsbetrag von 131 Euro für unsere Leistungen",
  "Neu ab Pflegegrad 2: Bis zu 3.539 Euro Ersatzpflege / Verhinderungspflege über uns abrechenbar",
]);

const HNO_VORTEILE_BEI_UNS = [
  "Wir übernehmen die Kommunikation und Abrechnung mit Ihrer Krankenkasse",
  ...STARTSEITE_VORTEILE.filter((item) => !HNO_VORTEILE_BEI_UNS_AUSGESCHLOSSEN.has(item)),
];

export function HilfeNachOperationLanding() {
  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article
        id="hilfe-nach-operation-hero"
        className="min-w-0 scroll-mt-24 overflow-x-clip overflow-y-visible lg:overflow-x-visible"
      >
        <section className="relative z-0 box-border mx-auto w-full min-w-0 max-w-7xl overflow-x-clip px-4 pb-10 pt-0 sm:px-6 sm:pb-16 lg:overflow-x-visible lg:px-[var(--ahs-page-gutter)] lg:pb-[clamp(4rem,9vh+1.5rem,7rem)] lg:pt-[clamp(2rem,5vh+1.25rem,4.75rem)] xl:pb-[clamp(5rem,10vh+1.5rem,8rem)]">
          <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-center lg:justify-items-stretch lg:gap-x-[clamp(1.5rem,3vw,3.25rem)] lg:gap-y-0">
            <div className="box-border w-full min-w-0 max-w-full space-y-[clamp(1.25rem,2vh+0.75rem,1.75rem)] lg:min-w-0 lg:justify-self-start lg:space-y-[clamp(1.15rem,1.6vh+0.7rem,1.75rem)] lg:-translate-x-[clamp(0.75rem,4.5vw,3rem)] lg:pr-0 motion-reduce:lg:translate-x-0">
              <h1
                className="text-[clamp(1rem,3.5vw+0.45rem,2.25rem)] font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(1.6rem,0.95rem+2.1vw,2.85rem)]"
                style={{ animationDelay: "0s" }}
              >
                <span className="block whitespace-nowrap">Hilfe nach Operation, Unfall</span>
                <span className="block whitespace-nowrap">oder Schwangerschaft</span>
              </h1>
              <ul
                className="mt-5 min-w-0 space-y-3 sm:mt-6 sm:space-y-3.5 lg:mt-0 lg:space-y-[clamp(0.65rem,0.35rem+0.9vw,1rem)]"
                aria-label="Ihre Vorteile auf einen Blick"
              >
                {HERO_VORTEILE.map((line, i) => (
                  <li
                    key={line}
                    className="flex min-w-0 flex-nowrap items-start gap-3 text-lg font-semibold leading-snug text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-xl lg:items-start lg:text-[clamp(1.05rem,0.82rem+0.5vw,1.35rem)]"
                    style={{ animationDelay: `${0.45 + i * 0.22}s` }}
                  >
                    <HeroCheckIcon className="mt-0.5 shrink-0 lg:mt-0" />
                    <span
                      className={
                        i === 0
                          ? "min-w-0 flex-1 max-sm:text-[0.9375rem]"
                          : "min-w-0 flex-1 max-sm:text-pretty max-sm:text-[0.9375rem] sm:whitespace-nowrap"
                      }
                    >
                      {i === 0 ? (
                        <>
                          <span className="whitespace-nowrap">Wir übernehmen die Kommunikation mit Ihrer</span>
                          <br />
                          <span className="whitespace-nowrap">Krankenkasse</span>
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="pt-2 opacity-0 motion-reduce:opacity-100 animate-fade-in-up"
                style={{ animationDelay: "1.12s" }}
              >
                <Link
                  href="/kontakt"
                  className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto lg:w-auto lg:px-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] lg:py-[clamp(0.6rem,0.45rem+0.45vw,0.9rem)] lg:text-[clamp(1rem,0.82rem+0.55vw,1.15rem)]"
                >
                  Jetzt Kontakt aufnehmen
                </Link>
                <p className="mt-3 min-w-0 max-w-full text-pretty text-center text-sm leading-snug text-neutral-600 sm:text-left lg:text-[clamp(0.8rem,0.7rem+0.35vw,0.95rem)]">
                  Unverbindliche Erstberatung – wir melden uns zeitnah bei Ihnen.
                </p>
              </div>
            </div>

            <div className="box-border w-full min-w-0 max-w-full lg:min-h-0 lg:translate-x-[clamp(1.75rem,8vw,6.25rem)] lg:justify-self-stretch lg:self-center motion-reduce:lg:translate-x-0">
              <div className="box-border flex justify-center overflow-x-visible bg-[#fafbfc] px-4 pt-3 pb-8 sm:px-8 sm:pt-4 sm:pb-10 lg:flex lg:justify-end lg:pl-2 lg:pr-0 lg:pb-[clamp(1.75rem,3.5vh+0.75rem,3.25rem)] lg:pt-0">
                <div
                  className="mx-auto w-full min-w-0 max-w-[min(100%,72rem)] opacity-0 motion-reduce:opacity-100 animate-fade-in-up max-lg:flex max-lg:max-w-full max-lg:justify-center lg:ml-auto lg:w-full lg:max-w-full"
                  style={{ animationDelay: "0.08s" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- statisches Hero-Asset */}
                  <img
                    src={HERO_IMG}
                    alt="Hilfe nach Operation, Unfall oder Schwangerschaft – Unterstützung im Alltag bei Ihnen zu Hause"
                    width={1200}
                    height={800}
                    decoding="async"
                    fetchPriority="high"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1536px) 66vw, 1200px"
                    className={`box-border h-auto w-full max-w-full origin-center object-contain object-center max-lg:mx-auto max-lg:-translate-y-2 max-lg:scale-100 lg:origin-right lg:object-contain lg:object-right lg:translate-x-[min(7%,2.85rem)] lg:scale-[0.96] xl:translate-x-[min(9%,3.5rem)] ${HERO_GLOW_CLASS}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 overflow-x-clip bg-[#F2F9FA] px-4 pb-16 pt-[clamp(2.5rem,4.5vw,4.25rem)] sm:px-6 sm:pb-20 lg:px-[var(--ahs-page-gutter)] lg:pb-24"
          aria-labelledby="hno-leistungen-heading"
        >
          <svg
            className={WELLEN_SVG_CLASS}
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d={WELLEN_D} fill="#F2F9FA" />
          </svg>
          <div className="relative z-[1] mx-auto max-w-7xl">
            <RevealOnScroll>
              <div className="mb-10 sm:mb-12">
                <h2 id="hno-leistungen-heading" className="text-center text-3xl font-bold text-[#0F4F68] sm:text-4xl">
                  Sie benötigen schnelle &amp; unkomplizierte Hilfe?
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-pretty text-left text-neutral-600 sm:text-base lg:text-center">
                  Nach einer Operation, einem Unfall oder während der Schwangerschaft stehen wir Ihnen zuverlässig zur
                  Seite. Wir unterstützen Sie im Alltag, koordinieren notwendige Schritte und übernehmen die
                  Kommunikation mit Kranken- und Pflegekassen. So können Sie sich ganz auf Ihre Genesung und Ihr
                  Wohlbefinden konzentrieren.
                </p>
                <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-semibold text-[#0F4F68] sm:text-xl">
                  Wir bieten Ihnen folgende Hilfe:
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120}>
              <ul className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 md:grid-cols-3">
                {LEISTUNGS_TILES.map((label) => (
                  <li
                    key={label}
                    className="rounded-xl border border-[#0F4F68]/10 bg-white p-4 text-sm font-semibold text-[#0F4F68] shadow-sm sm:text-base"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        <section
          className="relative z-[11] overflow-x-clip bg-[#fafbfc] px-4 pb-16 pt-[clamp(2.5rem,4.5vw,4.25rem)] sm:px-6 sm:pb-20 lg:px-[var(--ahs-page-gutter)] lg:pb-24"
          aria-labelledby="hno-schritte-heading"
        >
          <svg
            className={WELLEN_SVG_CLASS}
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d={WELLEN_D} fill="#fafbfc" />
          </svg>
          <div className="relative z-[1] mx-auto max-w-7xl">
            <RevealOnScroll>
              <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
                <h2
                  id="hno-schritte-heading"
                  className="text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
                >
                  So einfach zur passenden Alltagsunterstützung
                </h2>
                <p className="mt-3 text-pretty text-sm text-[#8a6a55] sm:text-base">
                  Drei Schritte zur verlässlichen Alltagsunterstützung, schnell &amp; unkompliziert
                </p>
              </div>
            </RevealOnScroll>

            <ol className="grid auto-rows-fr gap-6 md:grid-cols-3 md:gap-8 md:items-stretch">
              {SCHRITTE.map((item, i) => (
                <li key={item.step} className="flex min-h-0 list-none">
                  <RevealOnScroll delayMs={i * 150} className="h-full min-h-0 w-full">
                    <div className="flex h-full min-h-[18rem] flex-col items-center rounded-2xl border border-[#0F4F68]/10 bg-white p-6 text-center shadow-[0_10px_40px_rgba(15,79,104,0.07)] transition-shadow duration-300 hover:shadow-[0_16px_52px_rgba(15,79,104,0.11)] sm:min-h-[19rem] sm:p-7">
                      <div className="mb-4 inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] px-4 text-sm font-bold text-white sm:text-base">
                        {item.step}
                      </div>
                      <h3 className="text-balance text-lg font-bold text-[#0F4F68]">{item.title}</h3>
                      <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-neutral-600 sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </RevealOnScroll>
                </li>
              ))}
            </ol>

            <RevealOnScroll delayMs={200}>
              <div className="mt-10 flex flex-col items-center gap-2 sm:mt-12">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:text-lg"
                >
                  Anfrage stellen
                </Link>
                <p className="text-center text-sm text-neutral-500">Unverbindlich · Wir melden uns bei Ihnen</p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section
          className="relative z-20 w-full overflow-x-clip bg-white px-4 pb-14 pt-[clamp(4.25rem,9vw,6.25rem)] sm:px-6 sm:pb-16 sm:pt-[clamp(4.75rem,10vw,6.75rem)] lg:px-[var(--ahs-page-gutter)] lg:pb-20"
          aria-labelledby="hno-vorteile-heading"
        >
          <svg
            className={WELLEN_SVG_CLASS}
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d={WELLEN_D} fill="#ffffff" />
          </svg>
          <RevealOnScroll>
            <div className="relative z-[1] mx-auto w-full max-w-6xl">
              <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                <h2
                  id="hno-vorteile-heading"
                  className="text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
                >
                  Ihre Vorteile bei uns
                </h2>
                <p className="mt-2 text-pretty text-sm text-neutral-600 sm:text-base">{STARTSEITE_VORTEILE_INTRO}</p>
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {HNO_VORTEILE_BEI_UNS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/75 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/haken.webp"
                      alt=""
                      aria-hidden
                      width={38}
                      height={38}
                      className="mt-0.5 h-[38px] w-[38px] shrink-0 object-contain"
                    />
                    <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </section>

        <KundenstimmenCarousel />

        <section className="border-t border-[#0F4F68]/10 bg-white py-12" aria-label="Abschluss">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
              <p className="text-neutral-600">
                {siteConfig.name} unterstützt Sie nach Operation, Unfall oder in der Schwangerschaft bzw. Wochenbett in Ihrer
                Region. Fragen? Wir sind für Sie da – über{" "}
                <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline-offset-2 hover:underline">
                  Kontaktseite
                </Link>
                .
              </p>
              <Link
                href="/kontakt"
                className="mt-6 inline-flex rounded-lg bg-[#F78F2E] px-8 py-3 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
              >
                Jetzt Kontakt aufnehmen
              </Link>
            </div>
          </RevealOnScroll>
        </section>
      </article>
    </div>
  );
}
