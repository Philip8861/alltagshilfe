import Image from "next/image";
import { StandortAnthrazitRule } from "@/components/standorte/StandortAnthrazitRule";
import { StandortNummerEinsReveal } from "@/components/standorte/StandortNummerEinsReveal";
import { StandortWechselBild } from "@/components/standorte/StandortWechselBild";

const HERO_INTRO = {
  brand: "Alltagshilfe-Süd",
  taglineLines: [
    "Mehr Unterstützung.",
    "Mehr Entlastung.",
    "Mehr Zeit fürs Wesentliche.",
  ],
} as const;

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

const STARTSEITE_LEISTUNGEN_INTRO = {
  heading: "Mit viel Herz und Engagement sind wir für Sie da.",
  text: "Was uns besonders wichtig ist: Wir möchten dazu beitragen, dass Sie Ihren Alltag so lange wie möglich selbstbestimmt gestalten und in Ihrem vertrauten Zuhause bleiben können. Unsere Unterstützung orientiert sich dabei an Ihren individuellen Bedürfnissen und Ihrer persönlichen Lebenssituation.",
};

const HEADING_CLASS =
  "text-3xl font-bold text-[#0F4F68] sm:text-4xl w-full max-w-lg self-start";
const INTRO_BODY_CLASS = "text-lg text-neutral-700 leading-relaxed sm:text-xl";
const LEISTUNGEN = [
  {
    title: "Haushaltshilfe & Alltagsbegleitung",
    icon: "home",
  },
  {
    title: "Pflegeberatung nach §37.3 SGB XI",
    icon: "chat",
  },
  {
    title: "Kostenfreie Pflegehilfsmittel",
    icon: "box",
  },
  {
    title: "Inkontinenzversorgung",
    icon: "shield",
  },
  {
    title: "Pflegeshop",
    icon: "cart",
  },
  {
    title: "Essen auf Räder (nur Raum Kempten)",
    icon: "meal",
  },
] as const;

export default function HomePage() {
  return (
    <article
      className="flex min-h-[60vh] w-full max-w-[100vw] flex-col pt-0 pb-0"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <section className="w-full pt-0 pb-6 sm:pb-8 lg:pb-10">
        <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
          {/* Oberer Bereich: Bild rechts, Überschrift + drei Punkte links, etwas oberhalb der Bildmitte (Desktop) */}
          <div className="relative">
            <div className="flex justify-end">
              <div
                className="relative w-full max-w-[56rem] opacity-0 animate-fade-in-up motion-reduce:opacity-100"
                style={{ animationDelay: "0.08s" }}
              >
                <div className="[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))]">
                  <Image
                    src="/images/startseite_front.webp"
                    alt="Gemeinsam zur passenden Unterstützung im Alltag"
                    width={900}
                    height={700}
                    className="h-auto w-full object-contain"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>

            <header
              className="relative z-10 mt-8 max-w-lg text-left sm:max-w-xl lg:absolute lg:left-0 lg:right-auto lg:top-[38%] lg:mt-0 lg:max-w-[min(26rem,42vw)] lg:-translate-y-1/2 xl:left-[min(0.25rem,1vw)] xl:max-w-[min(28rem,38vw)] 2xl:left-[min(0.5rem,2vw)] 2xl:max-w-[min(30rem,34vw)]"
            >
              <h1
                className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 animate-fade-in-up sm:text-4xl lg:text-[2.35rem] xl:text-[2.6rem]"
                style={{ animationDelay: "0s" }}
              >
                {HERO_INTRO.brand}
              </h1>
              <ul
                className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5"
                aria-label="Ihre Vorteile auf einen Blick"
              >
                {HERO_INTRO.taglineLines.map((line, i) => (
                  <li
                    key={line}
                    className="flex items-center gap-3 text-pretty text-lg font-semibold leading-snug text-[#0F4F68] opacity-0 animate-fade-in-up sm:text-xl lg:text-[1.28rem]"
                    style={{
                      /* Nach Abschluss der Überschriften-Animation (~0,6s) nacheinander */
                      animationDelay: `${0.68 + i * 0.26}s`,
                    }}
                  >
                    <HeroCheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </header>
          </div>

          <div className="mt-12 sm:mt-14 lg:mt-16">
            <p
              className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/80 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "1.55s" }}
            >
              In 3 Schritten zur passenden Hilfe
            </p>
            <h2
              className="mt-2 text-2xl font-bold text-[#0F4F68] opacity-0 animate-fade-in-up sm:text-3xl"
              style={{ animationDelay: "1.32s" }}
            >
              Schnell. Persönlich. Passend.
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div
                className="rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3 text-sm text-neutral-700 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "1.7s" }}
              >
                <p className="font-semibold text-[#0F4F68]">1. Bedarf wählen</p>
                <p className="mt-1">Kurz angeben, wobei Sie Unterstützung wünschen.</p>
              </div>
              <div
                className="rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3 text-sm text-neutral-700 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "1.78s" }}
              >
                <p className="font-semibold text-[#0F4F68]">2. Daten ergänzen</p>
                <p className="mt-1">PLZ und Situation eintragen, wir prüfen Ihre Region.</p>
              </div>
              <div
                className="rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3 text-sm text-neutral-700 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "1.86s" }}
              >
                <p className="font-semibold text-[#0F4F68]">3. Rückmeldung erhalten</p>
                <p className="mt-1">Sie erhalten die passende Empfehlung von unserem Team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="mx-auto mt-12 w-full px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-8"
        role="presentation"
      >
        <div className="mx-auto w-full max-w-6xl space-y-2">
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-[#0F4F68]/28 to-transparent"
            aria-hidden
          />
          {/* Frühere, gut sichtbare Strukturlinie (~2/3 Breite, weiche Enden); immediate = sofort sichtbar oberhalb der Falz */}
          <StandortAnthrazitRule immediate className="px-0 sm:px-0 lg:px-0" />
        </div>
      </div>

      <section className="relative z-20 mt-12 w-full px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 lg:gap-10">
          <div className="relative z-20 order-3 flex w-full max-w-full justify-center pb-2 pt-1 sm:order-1 lg:w-[50%] lg:max-w-3xl lg:shrink-0 lg:justify-center lg:px-6 lg:pb-4 lg:pt-2 sm:px-4">
            <div className="w-full max-w-full" style={{ width: "min(491px, calc(100vw - 3rem))" }}>
              <div className="[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))]">
                <StandortWechselBild
                  alt="Betreuung und Zuwendung: Team Alltagshilfe-Süd mit Seniorin im Freien"
                  sizes="(max-width: 640px) min(491px, 88vw), 491px"
                />
              </div>
            </div>
          </div>

          <StandortNummerEinsReveal className="order-1 w-full min-w-0 px-4 sm:order-2 sm:px-6 lg:flex-1 lg:max-w-lg lg:self-start lg:px-8">
            <h2 className={HEADING_CLASS}>{STARTSEITE_LEISTUNGEN_INTRO.heading}</h2>
            <p className={INTRO_BODY_CLASS}>{STARTSEITE_LEISTUNGEN_INTRO.text}</p>
          </StandortNummerEinsReveal>
        </div>
      </section>

      <section className="relative z-20 mt-10 w-full px-4 sm:mt-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[#f2c9a3]/20 bg-gradient-to-br from-[#fffbf8] via-[#fffefd] to-white p-5 shadow-[0_10px_24px_rgba(120,78,45,0.06)] sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">Unsere Leistungen im Überblick</h2>
          <p className="mt-2 text-sm text-[#8a6a55] sm:text-base">Persoenlich, zuverlaessig und mit viel Herz im Alltag.</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEISTUNGEN.map((leistung, index) => (
              <article
                key={leistung.title}
                className="rounded-2xl border border-[#e9c8a8]/35 bg-gradient-to-r from-white to-[#fffdfa] px-4 py-4 opacity-0 shadow-[0_5px_12px_rgba(120,78,45,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(120,78,45,0.09)] animate-fade-in-up"
                style={{ animationDelay: `${0.06 * (index + 1)}s` }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white shadow-sm"
                    aria-hidden
                  >
                    {leistung.icon === "home" && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3.2 3.5 10v10.3h6.2v-6.3h4.6v6.3h6.2V10L12 3.2z" />
                      </svg>
                    )}
                    {leistung.icon === "chat" && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16v11H7.6L4 18.6V4zm4 4v2h8V8H8zm0 4v2h5v-2H8z" />
                      </svg>
                    )}
                    {leistung.icon === "box" && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 7.2 12 3l9 4.2v9.6L12 21l-9-4.2V7.2zm9 8.5 6.8-3.2V8.6L12 11.8 5.2 8.6v3.9l6.8 3.2z" />
                      </svg>
                    )}
                    {leistung.icon === "shield" && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2 4 5.2v6.1c0 5.1 3.4 9.8 8 10.7 4.6-.9 8-5.6 8-10.7V5.2L12 2zm-1 13.2-3-3 1.4-1.4 1.6 1.6 3.6-3.6 1.4 1.4-5 5z" />
                      </svg>
                    )}
                    {leistung.icon === "cart" && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 4H4v2h1.3l2 9.1h9.6l1.7-6.8H8.5L8 6h12V4H7zm2 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                      </svg>
                    )}
                    {leistung.icon === "meal" && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4v7" />
                        <path d="M7 4v7" />
                        <path d="M4 8h3" />
                        <path d="M6 11v9" />
                        <path d="M14 4c2.2 0 4 1.8 4 4v12" />
                        <path d="M18 8h-4" />
                      </svg>
                    )}
                  </span>
                  <p className="text-base font-semibold leading-snug text-[#0F4F68]">{leistung.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-0 -mt-[9%] min-h-[26vh] flex-1 bg-[#F2F9FA] px-4 pt-16 pb-20 sm:pt-18 sm:pb-24 lg:px-8">
        <svg
          className="pointer-events-none absolute left-0 top-0 h-12 w-full -translate-y-[70%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z"
            fill="#F2F9FA"
          />
        </svg>
        <div
          className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-2 bg-gradient-to-b from-[#F2F9FA]/85 to-transparent"
          aria-hidden
        />
      </div>
    </article>
  );
}
