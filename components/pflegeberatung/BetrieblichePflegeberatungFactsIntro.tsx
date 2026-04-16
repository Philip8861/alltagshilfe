"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  BETRIEBLICH_STATISTIK_IMG_MAX_REM,
  BETRIEBLICH_STATISTIK_VISIBLE_HEIGHT_RATIO,
} from "@/components/pflegeberatung/betriebliche-statistik-layout";
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
  "~70 % psychisch stark belastet",
  "75 % emotional belastet",
  "50 % berichten körperliche Beschwerden",
  "Jeder 4. fühlt sich am Limit oder überfordert",
] as const;

const FACTS_RIGHT = [
  "20 % berichten dauerhafte gesundheitliche Beeinträchtigung",
  "Nur 46 % arbeiten noch Vollzeit.",
  "Viele reduzieren Arbeitszeit oder steigen aus.",
] as const;

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
  delayBase,
}: {
  items: readonly string[];
  align: "left" | "right";
  show: boolean;
  reducedMotion: boolean;
  delayBase: number;
}) {
  const textAlign = align === "right" ? "text-right" : "text-left";
  const lgAlign = align === "right" ? "lg:text-right" : "lg:text-left";

  return (
    <ul
      className={cn("list-none space-y-3 sm:space-y-3.5 md:space-y-3.5 lg:space-y-4", textAlign, lgAlign)}
      aria-label={align === "right" ? "Weitere Kennzahlen" : "Kennzahlen zur Belastung"}
    >
      {items.map((line, i) => (
        <li
          key={line}
          className={cn(
            "will-change-transform",
            reducedMotion
              ? "translate-x-0 opacity-100"
              : "transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none",
            show ? "translate-x-0 opacity-100" : "opacity-0",
            show ? undefined : align === "right" ? "translate-x-5" : "-translate-x-5",
          )}
          style={
            reducedMotion || !show ? undefined : { transitionDelay: `${delayBase + i * 70}ms` }
          }
        >
          <p className={FACT_TEXT}>{line}</p>
        </li>
      ))}
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
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const show = reducedMotion || inView;

  const imgMax = `${IMG_MAX_REM}rem`;
  /** Kürzt den unteren, oft transparenten Streifen aus der Layout-Höhe (Welle bleibt sichtbar) */
  const imgLayoutMaxHeightRem = IMG_MAX_REM * (STATISTIK_IMG.h / STATISTIK_IMG.w) * BETRIEBLICH_STATISTIK_VISIBLE_HEIGHT_RATIO;

  return (
    <div
      ref={rootRef}
      className="relative z-20 mt-6 sm:mt-8 lg:mt-10"
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
          className="mx-auto max-w-3xl text-pretty text-center text-[1.40625rem] font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-[1.5625rem] md:text-[1.875rem] lg:text-[1.8125rem] lg:leading-snug"
        >
          <span className="block sm:inline">Statistik zeigt: </span>
          <span className="block sm:inline">pflegende Angehörige sind:</span>
        </h2>

        <div className="mx-auto mt-2 flex w-full max-w-[min(68rem,calc(100vw-1.5rem))] flex-col items-stretch gap-5 sm:mt-3 sm:gap-6 md:flex-row md:items-center md:justify-center md:gap-4 lg:mt-4 lg:gap-5 xl:gap-6">
          <div className="order-1 flex min-h-0 min-w-0 w-full flex-1 justify-center md:max-w-none md:justify-end md:pr-1 lg:pr-3">
            <FactList
              items={FACTS_LEFT}
              align="right"
              show={show}
              reducedMotion={reducedMotion}
              delayBase={80}
            />
          </div>

          <aside
            className={cn(
              "order-2 mx-auto flex w-full max-w-[min(100%,calc(100vw-2rem))] shrink-0 flex-col items-center justify-center md:mx-0 md:w-auto md:max-w-[min(36vw,var(--img-max))]",
            )}
            style={{ "--img-max": imgMax } as CSSProperties}
            aria-label="Statistik-Grafik"
          >
            <div
              className={cn(
                "w-full max-w-[var(--img-max)] overflow-hidden",
                reducedMotion
                  ? "translate-y-0 opacity-100"
                  : "transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none",
                show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
              style={{
                maxHeight: `${imgLayoutMaxHeightRem}rem`,
                ...(reducedMotion || !show ? {} : { transitionDelay: "220ms" }),
              }}
            >
              <Image
                src="/images/statistik_betriebliche.webp"
                alt="Grafik: Belastung pflegender Angehöriger"
                width={STATISTIK_IMG.w}
                height={STATISTIK_IMG.h}
                sizes="(max-width: 1023px) 650px, 580px"
                className={cn(
                  "h-auto w-full max-w-full rounded-sm object-contain object-top",
                  STATISTIK_DROP_SHADOW,
                )}
              />
            </div>
          </aside>

          <div className="order-3 flex min-h-0 min-w-0 w-full flex-1 justify-center md:max-w-none md:justify-start md:pl-1 lg:pl-3">
            <FactList
              items={FACTS_RIGHT}
              align="left"
              show={show}
              reducedMotion={reducedMotion}
              delayBase={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
