import type { Metadata } from "next";
import Link from "next/link";
import { HomePartnerLoginBlock } from "@/components/home/HomePartnerLoginBlock";
import { siteConfig } from "@/config/site";

const PAGE_PATH = "/kooperation";
const PAGE_SURFACE = "#fafbfc" as const;

/** Originalmaße `kooperation_neu.webp` (VP8X-Canvas), für CLS und Darstellung in Originalgröße. */
const KOOPERATION_HERO_IMG = {
  src: "/images/kooperation_neu.webp",
  width: 1011,
  height: 504,
} as const;

const HERO_KURZ_VORTEILE = [
  "Transparenz & Übersichtlichkeit dank eigenem Dashboard",
  "Monatliche Tippgeberprovision",
  "Schnelle Bearbeitung aller Vorgänge",
] as const;

function HeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] sm:h-10 sm:w-10 ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.2rem] w-[1.2rem] sm:h-[1.35rem] sm:w-[1.35rem]"
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

const HERO_IMG_BASE =
  "block h-auto w-full max-w-full object-contain [filter:drop-shadow(8px_12px_20px_rgba(15,79,104,0.18))_drop-shadow(6px_6px_14px_rgba(15,79,104,0.1))] [will-change:filter]";

const ANIM_IN = "opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none";
const ANIM_RISE = "animate-fade-in-rise motion-reduce:animate-none";

export const metadata: Metadata = {
  title: "Kooperation",
  description: `Kooperation mit ${siteConfig.name}: starkes Netzwerk, Partner-Dashboard, Tippgeberprovision und schnelle Bearbeitung.`,
  alternates: { canonical: PAGE_PATH },
};

export default function KooperationPage() {
  return (
    <article className="overflow-x-visible pb-0 sm:pb-0" style={{ backgroundColor: PAGE_SURFACE }}>
      <header className="overflow-visible bg-white">
        <div className="mx-auto max-w-7xl overflow-visible px-4 pt-2 pb-10 sm:px-6 sm:pt-4 sm:pb-14 lg:px-[var(--ahs-page-gutter)] lg:pt-16 lg:pb-20">
          <div className="mx-auto flex w-full max-w-[min(100%,72rem)] flex-col items-center gap-8 overflow-visible lg:mx-0 lg:mr-auto lg:flex-row lg:justify-start lg:items-center lg:gap-x-11 lg:gap-y-6 xl:gap-x-[3.75rem]">
            <div className="flex w-full min-w-0 shrink-0 justify-center overflow-visible lg:max-w-[min(100%,1011px)] lg:-translate-x-[20%] lg:-ml-4 lg:-mr-5 xl:-ml-6 xl:-mr-7">
              <div className="box-content w-full max-w-[min(100%,1011px)] overflow-visible px-2 pt-1 pb-2 sm:px-3 sm:pb-4 lg:px-1 lg:py-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- wie Private Pflegeberatung: natives img vermeidet Next/Image-Wrapper (overflow) */}
                <img
                  src={KOOPERATION_HERO_IMG.src}
                  alt={`Kooperation mit ${siteConfig.name}`}
                  width={KOOPERATION_HERO_IMG.width}
                  height={KOOPERATION_HERO_IMG.height}
                  decoding="async"
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 1011px"
                  className={`${HERO_IMG_BASE} ${ANIM_RISE} mx-auto h-auto w-full max-w-[min(100%,1011px)] object-contain object-center`}
                  style={{ animationDelay: "40ms" }}
                />
              </div>
            </div>

            <div className="flex w-full min-w-0 max-w-xl shrink-0 flex-col items-center overflow-visible text-center lg:max-w-[min(100%,31rem)] lg:items-start lg:text-left xl:max-w-[33rem]">
              <h1
                className={`${ANIM_IN} max-w-[24rem] text-balance text-[1.375rem] font-extrabold leading-snug tracking-tight text-[#0F4F68] sm:max-w-2xl sm:text-[1.65rem] sm:leading-tight lg:max-w-none lg:whitespace-nowrap lg:text-[clamp(1.5rem,0.6rem+1.4vw,2.75rem)] lg:leading-[1.12]`}
                style={{ animationDelay: "110ms" }}
              >
                Kooperation mit der {siteConfig.name}
              </h1>
              <p
                className={`${ANIM_IN} mt-4 w-full max-w-xl text-pretty text-[1.05rem] font-medium leading-relaxed text-[#0F4F68] sm:mt-5 sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.375rem]`}
                style={{ animationDelay: "190ms" }}
              >
                Profitieren Sie von einem starken Netzwerk.
              </p>
              <ul
                className={`${ANIM_IN} mx-auto mt-5 w-full max-w-xl space-y-3 text-left sm:mt-6 sm:space-y-3.5 lg:mx-0`}
                style={{ animationDelay: "240ms" }}
                aria-label="Ihre Vorteile als Partner auf einen Blick"
              >
                {HERO_KURZ_VORTEILE.map((line) => (
                  <li key={line} className="flex w-full items-start gap-3 sm:items-center lg:items-start">
                    <HeroCheckIcon className="mt-0.5 sm:mt-0" />
                    <span className="min-w-0 flex-1 text-pretty text-left text-[1.05rem] font-semibold leading-snug text-[#0F4F68] sm:text-[1.125rem]">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className={`${ANIM_IN} mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start`}
                style={{ animationDelay: "400ms" }}
              >
                <Link
                  href="/partner/login"
                  className="inline-flex min-h-[3.625rem] min-w-[11.5rem] items-center justify-center rounded-xl bg-[#F78F2E] px-8 py-4 text-[1.2rem] font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:min-h-[3.75rem] sm:px-9 sm:py-[1.15rem] sm:text-[1.21875rem]"
                >
                  Partner werden
                </Link>
                <Link
                  href="/partner-demo/dashboard"
                  className="inline-flex min-h-[3.625rem] min-w-[11.5rem] items-center justify-center rounded-xl border-2 border-[#0F4F68] bg-white px-8 py-4 text-[1.2rem] font-semibold text-[#0F4F68] hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:min-h-[3.75rem] sm:px-9 sm:py-[1.15rem] sm:text-[1.21875rem]"
                >
                  Demo ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <HomePartnerLoginBlock />
    </article>
  );
}
