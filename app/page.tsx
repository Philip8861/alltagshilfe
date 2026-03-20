import { StandortAnthrazitRule } from "@/components/standorte/StandortAnthrazitRule";
import { StandortNummerEinsReveal } from "@/components/standorte/StandortNummerEinsReveal";
import { StandortWechselBild } from "@/components/standorte/StandortWechselBild";

const STARTSEITE_LEISTUNGEN_INTRO = {
  heading: "Mit viel Herz und Engagement sind wir in Süddeutschland für Sie da.",
  text: "Wir begleiten Sie zuverlässig in den Bereichen Haushaltshilfe, Betreuung und Pflegeberatung und stehen Ihnen in jeder Lebenssituation unterstützend zur Seite. Bei uns finden Sie passende Hilfe aus einer Hand, persönlich, vertrauensvoll und mit dem Blick auf das, was Ihnen wirklich wichtig ist.",
};

const HEADING_CLASS =
  "text-3xl font-bold text-[#0F4F68] sm:text-4xl w-full max-w-lg self-start";
const INTRO_BODY_CLASS = "text-lg text-neutral-700 leading-relaxed sm:text-xl";
const LEISTUNGEN = [
  "Haushaltshilfe & Alltagsbegleitung",
  "Pflegeberatung nach §37.3 SGB XI",
  "Kostenfreie Pflegehilfsmittel",
  "Inkontinenzversorgung",
  "Pflegeshop",
] as const;

export default function HomePage() {
  return (
    <article
      className="flex min-h-[60vh] w-full max-w-[100vw] flex-col pt-0 pb-0 -ml-4 sm:-ml-6 lg:-ml-8 pl-4 sm:pl-6 lg:pl-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="mx-auto mt-6 w-full px-4 sm:mt-8 sm:px-6 lg:px-8" role="presentation">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0F4F68]/28 to-transparent" aria-hidden />
      </div>

      <StandortAnthrazitRule className="mt-6 sm:mt-8" />

      <section className="relative z-20 mt-4 w-full sm:mt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 lg:gap-10">
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
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-[#0F4F68]/12 bg-white/70 p-5 shadow-[0_10px_24px_rgba(15,79,104,0.06)] sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">Unsere Leistungen:</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEISTUNGEN.map((leistung, index) => (
              <article
                key={leistung}
                className="rounded-xl border border-[#0F4F68]/12 bg-white px-4 py-4 opacity-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up"
                style={{ animationDelay: `${0.06 * (index + 1)}s` }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E]"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                    </svg>
                  </span>
                  <p className="text-base font-semibold leading-snug text-[#0F4F68]">{leistung}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-0 -mx-4 -mt-[9%] min-h-[26vh] flex-1 bg-[#F2F9FA] px-4 pt-16 pb-20 sm:-mx-6 sm:pt-18 sm:pb-24 lg:-mx-8 lg:px-8">
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
