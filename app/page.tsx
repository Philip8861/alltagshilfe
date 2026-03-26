import Image from "next/image";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { StartEinstiegsHilfe } from "@/components/home/StartEinstiegsHilfe";
import { StandortNummerEinsReveal } from "@/components/standorte/StandortNummerEinsReveal";
import { StandortWechselBild } from "@/components/standorte/StandortWechselBild";

const HERO_INTRO = {
  brand: "Alltagshilfe-Süd",
  taglineLines: [
    "Mehr Unterstützung.",
    "Mehr Entlastung.",
    "Mehr Zeit fürs Wesentliche.",
  ],
  partnerLine:
    "Ihr verlässlicher Partner für Haushaltshilfe, Betreuung, Pflegeberatung und Pflegehilfsmittel.",
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
    title: "Betriebliche Pflegeberatung",
    icon: "briefcase",
  },
  {
    title: "Essen auf Räder (im Raum Kempten)",
    icon: "meal",
  },
] as const;

const LEISTUNGS_LINKS: Record<(typeof LEISTUNGEN)[number]["icon"], string> = {
  home: "/leistungen/haushaltshilfe",
  chat: "/leistungen/pflegeberatung-einsaetze",
  box: "/leistungen/pflegehilfsmittelbox",
  shield: "/inkontinenzversorgung",
  cart: "/pflegeshop",
  briefcase: "/leistungen/betriebliche-pflegeberatung",
  meal: "/leistungen/essen-auf-raeder",
};

const VORTEILE = [
  "Zugelassen bei allen Pflege- und Krankenkassen in Deutschland",
  "Schnelle Terminvergabe bei all unseren Dienstleistungen",
  "Volle Transparenz dank App: Rechnungen und kommende Termine jederzeit einsehbar",
  "Ab Pflegegrad 1: Nutzen Sie Ihren Entlastungsbetrag von 131 Euro für unsere Leistungen",
  "Neu ab Pflegegrad 2: Bis zu 3.539 Euro Ersatzpflege / Verhinderungspflege über uns abrechenbar",
  "Umfangreiche Dienstleistungen rund um Betreuung, Entlastung, Alltagshilfe und Pflegeberatung aus einer Hand.",
  "Auch wenn wir eine Leistung nicht direkt anbieten: Unser starkes Netzwerk hilft weiter",
  "Wir sind nicht nur in Städten, sondern auch in ländlichen Regionen und Dörfern für Sie unterwegs",
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
                className="relative ml-auto w-full max-w-[50rem] opacity-0 animate-fade-in-up motion-reduce:opacity-100 lg:mr-[calc((100vw-100%)/-2)]"
                style={{ animationDelay: "0.08s" }}
              >
                <div className="w-full [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))]">
                  {/* Hero: unoptimized — Next/Image-Wrapper würde die feste horizontale Einordnung verschieben. */}
                  <Image
                    src="/images/startseite_front.webp"
                    alt="Gemeinsam zur passenden Unterstützung im Alltag"
                    width={900}
                    height={700}
                    className="block h-auto w-full object-contain object-right"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <header
              className="relative z-10 mt-8 max-w-lg text-left sm:max-w-xl lg:absolute lg:left-0 lg:right-auto lg:top-[39%] lg:mt-0 lg:max-w-[min(26rem,42vw)] lg:-translate-y-1/2 xl:left-[min(0.25rem,1vw)] xl:max-w-[min(28rem,38vw)] 2xl:left-[min(0.5rem,2vw)] 2xl:max-w-[min(30rem,34vw)]"
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
              <p
                className="mt-5 max-w-prose text-pretty text-base font-normal leading-relaxed text-neutral-600 opacity-0 animate-fade-in-up sm:mt-6 sm:text-[1.05rem]"
                style={{ animationDelay: "1.22s" }}
              >
                {HERO_INTRO.partnerLine}
              </p>
            </header>
          </div>

          <div className="lg:-mt-[10%]">
            <StartEinstiegsHilfe />
          </div>
        </div>
      </section>

      <section className="relative z-20 mt-2 w-full bg-[#F2F9FA] px-4 pt-8 pb-10 sm:mt-4 sm:px-6 sm:pt-12 sm:pb-12 lg:px-8">
        <svg
          className="pointer-events-none absolute left-0 top-0 h-12 w-full -translate-y-[68%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
        </svg>
        <div className="mx-auto w-full max-w-6xl p-1 sm:p-2">
          <h2 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">Unsere Leistungen im Überblick</h2>
          <p className="mt-2 text-sm text-[#8a6a55] sm:text-base">Persönlich, zuverlässig und mit viel Herz im Alltag.</p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LEISTUNGEN.map((leistung, index) => (
              <Link
                key={leistung.title}
                href={LEISTUNGS_LINKS[leistung.icon]}
                className="rounded-2xl px-4 py-4 opacity-0 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_0_24px_rgba(15,79,104,0.15)] animate-fade-in-up focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                style={{ animationDelay: `${0.06 * (index + 1)}s` }}
              >
                <article className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white"
                    aria-hidden
                  >
                    {leistung.icon === "home" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
                      </svg>
                    )}
                    {leistung.icon === "chat" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16v11H7.6L4 18.6V4zm4 4v2h8V8H8zm0 4v2h5v-2H8z" />
                      </svg>
                    )}
                    {leistung.icon === "box" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 7.2 12 3l9 4.2v9.6L12 21l-9-4.2V7.2zm9 8.5 6.8-3.2V8.6L12 11.8 5.2 8.6v3.9l6.8 3.2z" />
                      </svg>
                    )}
                    {leistung.icon === "shield" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2 4 5.2v6.1c0 5.1 3.4 9.8 8 10.7 4.6-.9 8-5.6 8-10.7V5.2L12 2zm-1 13.2-3-3 1.4-1.4 1.6 1.6 3.6-3.6 1.4 1.4-5 5z" />
                      </svg>
                    )}
                    {leistung.icon === "cart" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 4H4v2h1.3l2 9.1h9.6l1.7-6.8H8.5L8 6h12V4H7zm2 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                      </svg>
                    )}
                    {leistung.icon === "briefcase" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 4h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v3H2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2zm6 3V6H9v1h6zM2 13h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" />
                      </svg>
                    )}
                    {leistung.icon === "meal" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4v7" />
                        <path d="M7 4v7" />
                        <path d="M4 8h3" />
                        <path d="M6 11v9" />
                        <path d="M14 4c2.2 0 4 1.8 4 4v12" />
                        <path d="M18 8h-4" />
                      </svg>
                    )}
                  </span>
                  <p className="text-lg font-semibold leading-snug text-[#0F4F68]">{leistung.title}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      <section className="relative z-20 mt-6 w-full px-4 sm:mt-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-[#0F4F68]/28 to-transparent" aria-hidden />
          <h3 className="text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl">Ihre Vorteile bei uns</h3>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600 sm:text-base">
            Verlässlich, transparent und nah bei Ihnen - mit klaren Prozessen und echter Unterstützung im Alltag.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {VORTEILE.map((item) => (
              <li className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/75 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]" key={item}>
                <img src="/images/haken.webp" alt="" aria-hidden width={38} height={38} className="mt-0.5 h-[38px] w-[38px] shrink-0 object-contain" />
                <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <KundenstimmenCarousel />

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
