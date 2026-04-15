"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Natürliche Pixelmaße von public/images/statistik.webp */
const STATISTIK_IMG = { w: 307, h: 461 } as const;

/** Schatten nur entlang sichtbarer Bildpixel (Alpha), nicht um die Bounding-Box */
const STATISTIK_DROP_SHADOW =
  "[filter:drop-shadow(0_14px_28px_rgba(15,79,104,0.22))_drop-shadow(0_6px_14px_rgba(15,79,104,0.12))]";

const CHIP =
  "rounded-xl border border-[#0F4F68]/12 bg-[#F8FCFD] px-3 py-2 shadow-sm sm:px-3.5 sm:py-2.5";

const CHIP_TEXT = "text-pretty text-[0.8125rem] font-semibold leading-snug text-[#0F4F68] sm:text-sm";

const CHIP_SOURCE = "mt-1 border-t border-[#0F4F68]/10 pt-1 text-[0.7rem] font-medium leading-snug text-neutral-600 sm:text-xs";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-[#F78F2E] sm:text-xs">{children}</p>
  );
}

function FactChip({ text, source }: { text: string; source?: string }) {
  return (
    <div className={CHIP}>
      <p className={CHIP_TEXT}>{text}</p>
      {source ? <p className={CHIP_SOURCE}>{source}</p> : null}
    </div>
  );
}

function BulletChip({ children }: { children: ReactNode }) {
  return (
    <div className={CHIP}>
      <p className={`${CHIP_TEXT} flex gap-2`}>
        <span className="shrink-0 text-[#F78F2E]" aria-hidden>
          →
        </span>
        <span className="min-w-0">{children}</span>
      </p>
    </div>
  );
}

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

const LEFT_FACTS: { text: string; source?: string }[] = [
  { text: "~70 % psychisch stark belastet" },
  { text: "75 % emotional belastet" },
  { text: ">50 % berichten körperliche Beschwerden", source: "Diakonie-Umfrage & Praxisdaten" },
  { text: "Jeder 4. fühlt sich am Limit oder überfordert", source: "WiDO / AOK-Studie" },
  { text: ">40 % haben körperliche Beschwerden (z. B. Rücken)" },
  { text: ">20 % berichten dauerhafte gesundheitliche Beeinträchtigung", source: "Bundesgesundheitsportal" },
  { text: "40–60 % erleben extremen Stress", source: "internationale Studien" },
];

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

  const colGap = "flex flex-col gap-2 sm:gap-2.5";

  return (
    <div
      ref={rootRef}
      className="relative mt-[calc(2rem+3cm)] sm:mt-[calc(2.5rem+3cm)]"
      role="region"
      aria-labelledby="betrieblich-statistik-hub-heading"
    >
      <div
        className={cn(
          "transition-opacity duration-700 ease-out motion-reduce:transition-none",
          show ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-6 xl:gap-8">
          {/* Links: Umfragen & Kennzahlen — auf Mobile unter dem Bild */}
          <div className={cn(colGap, "order-1 min-w-0 flex-1")}>
            <SectionLabel>Studien & Kennzahlen</SectionLabel>
            <div className={colGap}>
              {LEFT_FACTS.map((f) => (
                <FactChip key={f.text} text={f.text} source={f.source} />
              ))}
            </div>
          </div>

          {/* Mitte: Grafik */}
          <aside
            className="order-2 mx-auto flex w-full max-w-[17.5rem] shrink-0 flex-col items-center sm:max-w-[19rem] lg:max-w-[min(100%,16.25rem)]"
            aria-label="Statistik-Grafik"
          >
            <h2
              id="betrieblich-statistik-hub-heading"
              className="text-center text-pretty text-lg font-extrabold tracking-tight text-[#0F4F68] sm:text-xl"
            >
              Statistik zeigt:
            </h2>
            <div className="mt-3 flex justify-center lg:mt-4">
              <Image
                src="/images/statistik.webp"
                alt="Grafik: Belastung durch Pflege und betrieblicher Kontext"
                width={STATISTIK_IMG.w}
                height={STATISTIK_IMG.h}
                sizes="(max-width: 1023px) 304px, 260px"
                className={cn("h-auto w-full max-w-full rounded-sm", STATISTIK_DROP_SHADOW)}
              />
            </div>
          </aside>

          {/* Rechts: Kontext, Risiken, Arbeitgeber — auf Mobile zuerst unter Überschrift / vor Bild sinnvoll: nach Bild */}
          <div className={cn(colGap, "order-3 min-w-0 flex-1")}>
            <div>
              <SectionLabel>Gleichzeitig</SectionLabel>
              <div className={colGap}>
                <FactChip text="~5–7 Millionen Menschen pflegen Angehörige" />
                <FactChip text="Der Großteil der Pflege passiert zu Hause durch Familie." />
              </div>
            </div>

            <div>
              <SectionLabel>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden>⚠️</span>
                  <span>Was das bedeutet</span>
                </span>
              </SectionLabel>
              <FactChip text='Pflege ist kein „Nebenbei-Thema", sondern:' />
              <div className={colGap}>
                <BulletChip>ein dauerhafter Hochstress-Zustand</BulletChip>
                <BulletChip>oft vergleichbar mit einem zweiten Vollzeitjob</BulletChip>
                <BulletChip>verbunden mit Gesundheitsrisiken (psychisch + körperlich)</BulletChip>
              </div>
            </div>

            <div>
              <SectionLabel>Zusätzlich zeigt Forschung</SectionLabel>
              <div className={colGap}>
                <FactChip text="Pflege erhöht das Risiko für Depressionen messbar." />
                <FactChip text="Belastung gilt als klarer Risikofaktor für psychische Erkrankungen." />
              </div>
            </div>

            <div>
              <SectionLabel>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden>🏢</span>
                  <span>Auswirkungen auf Unternehmen</span>
                </span>
              </SectionLabel>
              <div className={colGap}>
                <FactChip text="Pflege betrifft direkt die Arbeitswelt." />
                <FactChip text="Nur 46 % arbeiten noch Vollzeit." />
                <FactChip text="Viele reduzieren Arbeitszeit oder steigen aus." source="VdK-Studie" />
              </div>
            </div>

            <div>
              <SectionLabel>Folgen für Arbeitgeber</SectionLabel>
              <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:gap-2.5">
                <FactChip text="Steigende Fehlzeiten" />
                <FactChip text="Produktivitätsverlust" />
                <FactChip text="Mitarbeiterkündigungen" />
                <FactChip text="Mentale Überlastung im Job" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
