"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BETRIEBLICH_STATISTIK_IMG_MAX_REM } from "@/components/pflegeberatung/betriebliche-statistik-layout";
import { cn } from "@/lib/utils";

/** Natürliche Pixelmaße von public/images/statistik_betriebliche.webp */
const STATISTIK_IMG = { w: 358, h: 538 } as const;

const IMG_MAX_REM = BETRIEBLICH_STATISTIK_IMG_MAX_REM;

/** Schatten nur entlang sichtbarer Bildpixel (Alpha) */
const STATISTIK_DROP_SHADOW =
  "[filter:drop-shadow(0_14px_28px_rgba(15,79,104,0.22))_drop-shadow(0_6px_14px_rgba(15,79,104,0.12))]";

/** Fakten etwas größer als zuvor, Gesamtbereich durch Bild/Abstände kleiner */
const FACT_TEXT =
  "text-pretty text-[1.2rem] font-semibold leading-snug text-[#0F4F68] sm:text-[1.3125rem] sm:leading-snug lg:text-[1.375rem]";

const FACTS_LEFT = [
  "70 % psychisch stark belastet",
  "75 % emotional belastet",
  "50 % berichten körperliche Beschwerden",
  "Jeder 4. fühlt sich am Limit oder überfordert",
] as const;

const FACTS_RIGHT = [
  "20 % berichten dauerhafte gesundheitliche Beeinträchtigung",
  "Nur 46 % arbeiten noch Vollzeit.",
  "Viele reduzieren Arbeitszeit oder steigen aus.",
  "Über 80 % der Pflegebedürftigen werden zu Hause versorgt.",
] as const;

const MOBILE_FACTS = [...FACTS_LEFT, ...FACTS_RIGHT] as const;

/** Abstand zwischen Fakten-Zeilen: optisch nacheinander „reinfliegend“ */
const FACT_STAGGER_MS = 105;
const FACT_BLOCK_GAP_MS = 120;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function FactList({
  items,
  align,
  show,
  reducedMotion,
  delayOffsetMs,
  listAriaLabel,
}: {
  items: readonly string[];
  align: "left" | "right" | "center";
  show: boolean;
  reducedMotion: boolean;
  /** Verzögerung der ersten Zeile dieser Liste (alle Fakten nacheinander: links, Pause, rechts) */
  delayOffsetMs: number;
  /** Optional: kombinierte Liste (mobil zentriert) */
  listAriaLabel?: string;
}) {
  const textAlign =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  const lgAlign =
    align === "center" ? "" : align === "right" ? "lg:text-right" : "lg:text-left";

  const defaultAria =
    align === "right" ? "Weitere Kennzahlen" : align === "center" ? "Kennzahlen zur Belastung" : "Kennzahlen zur Belastung";

  return (
    <ul
      className={cn("list-none space-y-3 sm:space-y-3.5 md:space-y-3.5 lg:space-y-4", textAlign, lgAlign)}
      aria-label={listAriaLabel ?? defaultAria}
    >
      {items.map((line, i) => {
        const fromSide =
          align === "center" ? undefined : align === "right" ? "translate-x-6" : "-translate-x-6";
        return (
          <li
            key={line}
            className={cn(
              "will-change-[transform,opacity]",
              reducedMotion
                ? "translate-x-0 translate-y-0 opacity-100"
                : "transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none",
              show ? "translate-x-0 translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              show || !fromSide ? undefined : fromSide,
            )}
            style={
              reducedMotion || !show
                ? undefined
                : { transitionDelay: `${delayOffsetMs + i * FACT_STAGGER_MS}ms` }
            }
          >
            <p className={FACT_TEXT}>{line}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function BetrieblichePflegeberatungFactsIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reducedMotion) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const ratio = entry.intersectionRatio;
        const top = entry.boundingClientRect.top;
        const vh = window.innerHeight;
        // Erst animieren, wenn der Bereich wirklich im Viewport liegt (nicht beim ersten Paint weit unten)
        if (ratio >= 0.1 && top < vh * 0.88 && top > -vh * 0.42) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const show = reducedMotion || inView;

  const imgMax = `${IMG_MAX_REM}rem`;

  return (
    <div
      ref={rootRef}
      className="relative z-10 mt-2 sm:mt-3 lg:mt-3"
      role="region"
      aria-labelledby="betrieblich-statistik-hub-heading"
    >
      <div
        className={cn(
          "transition-opacity duration-700 ease-out motion-reduce:transition-none",
          show ? "opacity-100" : "opacity-0",
        )}
      >
        <h2
          id="betrieblich-statistik-hub-heading"
          className={cn(
            "relative z-10 mx-auto mb-0 flex max-w-[min(100%,22rem)] flex-row flex-wrap items-center justify-center gap-3 text-pretty text-center font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:max-w-[min(100%,26rem)] sm:gap-4",
            "text-[1.35rem] sm:text-[1.5rem]",
            "md:mb-0 md:block md:max-w-3xl md:text-[1.875rem] lg:text-[1.8125rem] lg:leading-snug",
          )}
        >
          <span className="min-w-0 shrink text-center md:mx-auto">
            <span className="block sm:inline">Statistik zeigt: </span>
            <span className="block sm:inline">pflegende Angehörige sind:</span>
          </span>
          <span className="relative w-[4.25rem] shrink-0 sm:w-[4.75rem] md:hidden" aria-hidden>
            <Image
              src="/images/statistik_betriebliche.webp"
              alt=""
              width={STATISTIK_IMG.w}
              height={STATISTIK_IMG.h}
              sizes="96px"
              className={cn("h-auto w-full object-contain object-top", STATISTIK_DROP_SHADOW)}
            />
          </span>
        </h2>

        <div className="mx-auto mt-5 max-w-lg px-3 pb-1 md:hidden">
          <FactList
            items={MOBILE_FACTS}
            align="center"
            show={show}
            reducedMotion={reducedMotion}
            delayOffsetMs={0}
            listAriaLabel="Kennzahlen zur Belastung pflegender Angehöriger"
          />
        </div>

        <div className="mx-auto -mt-2 hidden w-full max-w-[min(68rem,calc(100vw-1.5rem))] flex-col items-stretch gap-2 sm:-mt-2.5 sm:gap-2.5 md:flex md:flex-row md:items-center md:justify-center md:gap-2.5 lg:-mt-3 lg:gap-3 xl:gap-3">
          <div className="relative z-20 order-1 flex min-h-0 min-w-0 w-full flex-1 justify-center md:max-w-none md:justify-end md:pr-1 lg:pr-3">
            <FactList
              items={FACTS_LEFT}
              align="right"
              show={show}
              reducedMotion={reducedMotion}
              delayOffsetMs={0}
            />
          </div>

          <aside
            className={cn(
              "relative z-[2] order-2 mx-auto flex w-full max-w-[min(100%,calc(100vw-2rem))] shrink-0 flex-col items-center justify-center md:mx-0 md:w-auto md:max-w-[min(36vw,var(--img-max))]",
            )}
            style={{ "--img-max": imgMax } as CSSProperties}
            aria-label="Statistik-Grafik"
          >
            <div
              className={cn(
                "relative z-[2] w-full max-w-[var(--img-max)] overflow-visible",
                reducedMotion
                  ? "translate-y-0 opacity-100"
                  : "transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none",
                show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
              style={
                reducedMotion || !show
                  ? undefined
                  : {
                      transitionDelay: `${
                        FACTS_LEFT.length * FACT_STAGGER_MS +
                        FACT_BLOCK_GAP_MS +
                        FACTS_RIGHT.length * FACT_STAGGER_MS +
                        80
                      }ms`,
                    }
              }
            >
              <Image
                src="/images/statistik_betriebliche.webp"
                alt="Grafik: Belastung pflegender Angehöriger"
                width={STATISTIK_IMG.w}
                height={STATISTIK_IMG.h}
                sizes="(max-width: 1023px) 840px, 760px"
                className={cn(
                  "relative z-[2] h-auto w-full max-w-full rounded-sm object-contain object-top",
                  STATISTIK_DROP_SHADOW,
                )}
              />
            </div>
          </aside>

          <div className="relative z-20 order-3 flex min-h-0 min-w-0 w-full flex-1 justify-center md:max-w-none md:justify-start md:pl-1 lg:pl-3">
            <FactList
              items={FACTS_RIGHT}
              align="left"
              show={show}
              reducedMotion={reducedMotion}
              delayOffsetMs={FACTS_LEFT.length * FACT_STAGGER_MS + FACT_BLOCK_GAP_MS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
