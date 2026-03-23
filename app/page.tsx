import Image from "next/image";
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
] as const;

export default function HomePage() {
  return (
    <article
      className="flex min-h-[60vh] w-full max-w-[100vw] flex-col pt-0 pb-0 -ml-4 sm:-ml-6 lg:-ml-8 pl-4 sm:pl-6 lg:pl-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <section className="w-full px-4 pt-0 sm:px-6 sm:pt-0 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-6 p-0 sm:p-0 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/80">In 3 Schritten zur passenden Hilfe</p>
            <h2 className="mt-2 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Schnell. Persönlich. Passend.</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3 text-sm text-neutral-700">
                <p className="font-semibold text-[#0F4F68]">1. Bedarf wählen</p>
                <p className="mt-1">Kurz angeben, wobei Sie Unterstützung wünschen.</p>
              </div>
              <div className="rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3 text-sm text-neutral-700">
                <p className="font-semibold text-[#0F4F68]">2. Daten ergänzen</p>
                <p className="mt-1">PLZ und Situation eintragen, wir prüfen Ihre Region.</p>
              </div>
              <div className="rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3 text-sm text-neutral-700">
                <p className="font-semibold text-[#0F4F68]">3. Rückmeldung erhalten</p>
                <p className="mt-1">Sie erhalten die passende Empfehlung von unserem Team.</p>
              </div>
            </div>
          </div>
          <div className="order-1 flex w-full justify-end lg:order-2">
            <div className="relative w-full max-w-lg lg:max-w-[42rem]">
              <div className="[filter:drop-shadow(0_16px_30px_rgba(15,79,104,0.24))_drop-shadow(0_6px_14px_rgba(15,79,104,0.16))]">
                <Image
                  src="/images/startseite_gemeinsam.png"
                  alt="Gemeinsam zur passenden Unterstützung im Alltag"
                  width={900}
                  height={700}
                  className="h-auto w-full rounded-none object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  </span>
                  <p className="text-base font-semibold leading-snug text-[#0F4F68]">{leistung.title}</p>
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
