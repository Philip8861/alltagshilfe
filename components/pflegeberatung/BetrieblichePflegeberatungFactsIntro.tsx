"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

/** Illustrierende Werte zur Verdeutlichung des Potenzials (keine individuelle Prognose). */
const AU_CHART_DATA = [
  { label: "Typischer Ausgangspunkt", tage: 14 },
  { label: "Bei wirksamer Entlastung¹", tage: 8 },
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

function FadeUp({
  show,
  reducedMotion,
  delayMs,
  className,
  children,
}: {
  show: boolean;
  reducedMotion: boolean;
  delayMs: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "will-change-transform",
        reducedMotion
          ? "opacity-100"
          : "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100",
        !reducedMotion && (show ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"),
        className,
      )}
      style={reducedMotion || !show ? undefined : { transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const show = reducedMotion || inView;

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-[#0F4F68]/12 bg-white/95 p-5 shadow-sm sm:p-8"
      role="region"
      aria-label="Kennzahlen und Einsparungspotenzial"
    >
      <div className="space-y-6 sm:space-y-8">
        <FadeUp show={show} reducedMotion={reducedMotion} delayMs={0}>
          <p className="text-pretty text-lg font-bold leading-snug text-[#0F4F68] sm:text-xl">
            Wussten Sie, dass 10&nbsp;% Ihrer Belegschaft bereits jetzt eine „zweite Schicht“ am Krankenbett leisten?
          </p>
        </FadeUp>

        <FadeUp show={show} reducedMotion={reducedMotion} delayMs={140}>
          <p className="text-pretty text-base font-semibold leading-relaxed text-neutral-800 sm:text-[1.05rem]">
            Pflegebelastung ist der Treiber für psychische Erkrankungen – der zweithäufigste Grund für Fehltage in
            2024.
          </p>
        </FadeUp>

        <FadeUp show={show} reducedMotion={reducedMotion} delayMs={280}>
          <div className="rounded-xl border border-[#0F4F68]/10 bg-gradient-to-b from-[#f8fcfd] to-white p-4 sm:p-6">
            <h3 className="text-base font-extrabold text-[#0F4F68] sm:text-lg">
              Einsparungspotenzial durch Reduktion von AU-Tagen
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Schematische Darstellung: weniger krankheitsbedingte Ausfälle, wenn Pflegebelastung im Betrieb adressiert
              wird.
            </p>
            <div className="mt-4 h-[220px] w-full sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...AU_CHART_DATA]}
                  layout="vertical"
                  margin={{ top: 8, right: 28, left: 4, bottom: 8 }}
                  barCategoryGap={18}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 16]}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(v) => `${v}`}
                    label={{ value: "Tage (illustrativ)", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={148}
                    tick={{ fill: "#0F4F68", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} Tage`, "Modellannahme"]}
                    labelStyle={{ color: "#0F4F68", fontWeight: 600 }}
                    contentStyle={{ borderRadius: 12, border: "1px solid #0F4F6820" }}
                  />
                  <Bar
                    dataKey="tage"
                    fill="#0F4F68"
                    radius={[0, 6, 6, 0]}
                    name="Tage"
                    isAnimationActive={show}
                    animationDuration={reducedMotion ? 0 : 900}
                    animationEasing="ease-out"
                  >
                    <LabelList
                      dataKey="tage"
                      position="right"
                      formatter={(v: number) => `${v}`}
                      style={{ fill: "#0F4F68", fontWeight: 700, fontSize: 13 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
              ¹ Beispielwerte zur Veranschaulichung, keine Zusage für Ihr Unternehmen. Konkrete Kennzahlen und Quellen
              besprechen wir gern persönlich.
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
