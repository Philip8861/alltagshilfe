"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/** Cache-Buster bei aktualisiertem Asset; Wert bei neuer Grafik erhöhen. */
const JETZT_NEU_IMG = "/images/jetzt_neu.webp?v=11";

/** Doppelter drop-shadow wie Hero, Deckkraft ~50 % schwächer als Standard (0.1 / 0.06). */
const IMG_SHADOW =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.1))_drop-shadow(0_4px_12px_rgba(15,79,104,0.06))]";

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

type PromoCard = {
  title: string;
  body: ReactNode;
};

const DEFAULT_PROMO_CARDS: PromoCard[] = [
  {
    title: "Alles auf einen Blick",
    body: "Alle wichtigen Informationen zu Terminen und Rechnungen sind jederzeit für Sie verfügbar.",
  },
  {
    title: "Volle Kontrolle über Ihr Budget",
    body: "Sehen Sie jederzeit, wie Ihr aktuelles Budget aussieht – klar und verständlich dargestellt.",
  },
  {
    title: "Transparenz, die überzeugt",
    body: (
      <>
        Transparenz ist uns besonders wichtig:
        <br />
        Sie haben jederzeit Zugriff auf alle relevanten Daten.
      </>
    ),
  },
  {
    title: "Jederzeit & überall",
    body: "Ob Laptop oder Smartphone – Ihr Zugang ist jederzeit und von überall aus möglich.",
  },
  {
    title: "Kostenloser Service",
    body: "Diese neue Leistung ist für alle Kunden selbstverständlich kostenlos.",
  },
];

type JetztNeuPromoSectionProps = {
  /** Eindeutige ID für Überschrift und `aria-labelledby` der Sektion (z. B. pro Seite). */
  headingId: string;
  heading?: string;
  intro?: string;
  imageAlt?: string;
  cards?: PromoCard[];
  showHeadingStar?: boolean;
};

const FADE_STAGGER = "motion-safe:animate-fade-in-up motion-reduce:opacity-100";

export function JetztNeuPromoSection({
  headingId,
  heading = "Jetzt neu: Ihr persönlicher Überblick",
  intro = "Behalten Sie Ihre Termine, Rechnungen und Ihr Budget jederzeit im Blick – einfach, transparent und übersichtlich.",
  imageAlt = "Übersicht über Termine und Rechnungen in der App",
  cards = DEFAULT_PROMO_CARDS,
  showHeadingStar = true,
}: JetztNeuPromoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [animCycle, setAnimCycle] = useState(1);
  const wasOutside = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        const inView = e.isIntersecting && e.intersectionRatio >= 0.1;
        if (inView) {
          if (wasOutside.current) setAnimCycle((c) => c + 1);
          wasOutside.current = false;
        } else {
          wasOutside.current = true;
        }
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: [0, 0.1, 0.18] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const motionKey = reducedMotion ? "jetzt-neu-a11y" : animCycle;

  const imgClass =
    `mx-auto block h-auto w-full object-contain object-center ${IMG_SHADOW} [will-change:filter] motion-reduce:filter-none lg:mx-0 ` +
    (reducedMotion ? "" : "motion-safe:animate-jetzt-neu-img-lift ");

  return (
    <section
      ref={sectionRef}
      className="relative z-[10] overflow-x-clip bg-[#fafbfc] px-4 py-12 sm:px-6 sm:py-14 lg:px-[var(--ahs-page-gutter)] lg:py-16"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl">
        <div
          key={motionKey}
          className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-14"
        >
          <div className="w-full max-w-[min(100%,41rem)] shrink-0 leading-none lg:max-w-[min(100%,38.07rem)] lg:pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element -- statisches Promo-Asset; ohne Karten-Rahmen, Transparenz bis zum Seitenhintergrund */}
            <img
              src={JETZT_NEU_IMG}
              alt={imageAlt}
              width={915}
              height={704}
              decoding="async"
              loading="lazy"
              className={imgClass.trim()}
            />
          </div>
          <div className="min-w-0 flex-1 space-y-6 text-center lg:text-left lg:space-y-5">
            <div className="space-y-3">
              <h2
                id={headingId}
                className={`flex flex-wrap items-center justify-center gap-2 text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-3xl lg:justify-start ${FADE_STAGGER}`}
                style={reducedMotion ? undefined : { animationDelay: "140ms" }}
              >
                {showHeadingStar ? <PromoStar variant="head" /> : null}
                <span>{heading}</span>
              </h2>
              <p
                className={`text-pretty text-base font-medium leading-relaxed text-neutral-700 sm:text-lg ${FADE_STAGGER}`}
                style={reducedMotion ? undefined : { animationDelay: "260ms" }}
              >
                {intro}
              </p>
            </div>
            <ul className="list-none space-y-5 text-pretty sm:space-y-6">
              {cards.map((item, i) => (
                <li key={item.title} className="space-y-2">
                  <h3
                    className={`flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start ${FADE_STAGGER}`}
                    style={reducedMotion ? undefined : { animationDelay: `${380 + i * 95}ms` }}
                  >
                    <PromoStar variant="sm" />
                    <span>{item.title}</span>
                  </h3>
                  <p
                    className={`text-sm leading-relaxed text-neutral-700 sm:text-base ${FADE_STAGGER}`}
                    style={reducedMotion ? undefined : { animationDelay: `${460 + i * 95}ms` }}
                  >
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
