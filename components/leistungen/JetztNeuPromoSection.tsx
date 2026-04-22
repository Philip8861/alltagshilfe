import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";

/** Cache-Buster bei aktualisiertem Asset; Wert bei neuer Grafik erhöhen. */
const JETZT_NEU_IMG = "/images/jetzt_neu.webp?v=5";

/** Wie Hero-Grafiken: doppelter drop-shadow folgt der Alphamaske (kein Schatten auf transparenten Flächen). */
const JETZT_NEU_IMG_CLASS =
  "mx-auto block h-auto w-full object-contain object-center [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter] motion-reduce:filter-none lg:mx-0";

const PROMO_ICON_HEAD =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 sm:h-10 sm:w-10 [&_svg]:h-[1.35rem] [&_svg]:w-[1.35rem] sm:[&_svg]:h-6 sm:[&_svg]:w-6";

const PROMO_ICON_SM =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4F68]/10 [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem] sm:[&_svg]:h-[1.3rem] sm:[&_svg]:w-[1.3rem]";

function PromoStar({ variant, className = "" }: { variant: "head" | "sm"; className?: string }) {
  const wrap = variant === "head" ? PROMO_ICON_HEAD : PROMO_ICON_SM;
  return (
    <span className={`${wrap} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2.35l2.82 5.71 6.31.92-4.56 4.44 1.08 6.28L12 16.65l-5.65 2.97 1.08-6.28-4.56-4.44 6.31-.92L12 2.35z"
          fill="#F78F2E"
          fillOpacity={variant === "head" ? 0.28 : 0.22}
          stroke="#F78F2E"
          strokeWidth="1.45"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

type JetztNeuPromoSectionProps = {
  /** Eindeutige ID für Überschrift und `aria-labelledby` der Sektion (z. B. pro Seite). */
  headingId: string;
};

export function JetztNeuPromoSection({ headingId }: JetztNeuPromoSectionProps) {
  return (
    <section
      className="relative z-[10] overflow-x-clip bg-[#fafbfc] px-4 py-12 sm:px-6 sm:py-14 lg:px-[var(--ahs-page-gutter)] lg:py-16"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll delayMs={80}>
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
            <div className="w-full max-w-[min(100%,33.88rem)] shrink-0 leading-none lg:max-w-[min(100%,31.46rem)] lg:pt-1">
              {/* eslint-disable-next-line @next/next/no-img-element -- statisches Promo-Asset; ohne Karten-Rahmen, Transparenz bis zum Seitenhintergrund */}
              <img
                src={JETZT_NEU_IMG}
                alt="Übersicht über Termine und Rechnungen in der App"
                width={915}
                height={704}
                decoding="async"
                loading="lazy"
                className={JETZT_NEU_IMG_CLASS}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-6 text-center lg:text-left lg:space-y-5">
              <div className="space-y-3">
                <h2
                  id={headingId}
                  className="flex flex-wrap items-center justify-center gap-2 text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-3xl lg:justify-start"
                >
                  <PromoStar variant="head" />
                  <span>Jetzt neu: Ihr persönlicher Überblick</span>
                </h2>
                <p className="text-pretty text-base font-medium leading-relaxed text-neutral-700 sm:text-lg">
                  Behalten Sie Ihre Termine, Rechnungen und Ihr Budget jederzeit im Blick – einfach, transparent und
                  übersichtlich.
                </p>
              </div>
              <ul className="list-none space-y-5 text-pretty sm:space-y-6">
                <li className="space-y-2">
                  <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                    <PromoStar variant="sm" />
                    <span>Alles auf einen Blick</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                    Alle wichtigen Informationen zu Terminen und Rechnungen sind jederzeit für Sie verfügbar.
                  </p>
                </li>
                <li className="space-y-2">
                  <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                    <PromoStar variant="sm" />
                    <span>Volle Kontrolle über Ihr Budget</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                    Sehen Sie jederzeit, wie Ihr aktuelles Budget aussieht – klar und verständlich dargestellt.
                  </p>
                </li>
                <li className="space-y-2">
                  <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                    <PromoStar variant="sm" />
                    <span>Transparenz, die überzeugt</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                    Transparenz ist uns besonders wichtig:
                    <br />
                    Sie haben jederzeit Zugriff auf alle relevanten Daten.
                  </p>
                </li>
                <li className="space-y-2">
                  <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                    <PromoStar variant="sm" />
                    <span>Jederzeit &amp; überall</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                    Ob Laptop oder Smartphone – Ihr Zugang ist jederzeit und von überall aus möglich.
                  </p>
                </li>
                <li className="space-y-2">
                  <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                    <PromoStar variant="sm" />
                    <span>Kostenloser Service</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                    Diese neue Leistung ist für alle Kunden selbstverständlich kostenlos.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
