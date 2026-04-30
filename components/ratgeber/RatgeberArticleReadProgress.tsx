"use client";

import { useEffect, useState } from "react";

/**
 * Letzter Abschnitt, dessen Anfang bereits oberhalb der Schwelle liegt – grober Lesefortschritt nach Kapiteln.
 */
export function useArticleSectionReadPercent(sectionIds: readonly string[], options?: { offsetPx?: number }) {
  const offsetPx = options?.offsetPx ?? 140;
  const [percent, setPercent] = useState(0);
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    if (!idsKey) return;

    const ids = idsKey.split("|");
    const n = ids.length;

    const update = () => {
      let activeIndex = -1;
      for (let i = 0; i < n; i++) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= offsetPx) activeIndex = i;
      }
      if (activeIndex < 0) {
        setPercent(0);
        return;
      }
      setPercent(Math.min(100, Math.round(((activeIndex + 1) / n) * 100)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [idsKey, offsetPx]);

  return percent;
}

export function RatgeberArticleReadProgressBar({
  sectionIds,
  className = "",
  compact = false,
}: {
  sectionIds: readonly string[];
  className?: string;
  /** Kompaktere Darstellung (z. B. in der Seitenleiste oben). */
  compact?: boolean;
}) {
  const pct = useArticleSectionReadPercent(sectionIds);

  if (sectionIds.length === 0) return null;

  return (
    <div className={`${compact ? "mt-0" : "mt-4"} ${className}`.trim()}>
      <div
        className={`flex items-center justify-between gap-2 text-neutral-600 ${compact ? "text-[0.7rem]" : "text-xs"}`}
      >
        <span className="font-medium text-[#0F4F68]">Lesefortschritt</span>
        <span
          className={`tabular-nums font-semibold text-[#0F4F68] ${compact ? "text-[0.8rem]" : ""}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {pct}%
        </span>
      </div>
      <div
        className={`${compact ? "mt-1.5 h-1.5" : "mt-2 h-2"} w-full overflow-hidden rounded-full bg-neutral-200/90`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Lesefortschritt im Artikel"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0F4F68]/85 to-[#F78F2E]/90 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {!compact ? (
        <p className="mt-1.5 text-[0.65rem] leading-snug text-neutral-500">
          Orientierung anhand des Kapitels, in dem Sie sich gerade befinden.
        </p>
      ) : null}
    </div>
  );
}

/** Kompakt unter dem Sidebar-Teaser: Label + Prozent, ohne Fortschrittsbalken. */
export function RatgeberArticleReadProgressStack({
  sectionIds,
  className = "",
}: {
  sectionIds: readonly string[];
  className?: string;
}) {
  const pct = useArticleSectionReadPercent(sectionIds);

  if (sectionIds.length === 0) return null;

  return (
    <div className={`flex w-full flex-col items-center text-center ${className}`.trim()}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/85 sm:text-xs">Lesefortschritt</p>
      <p
        className="mt-1.5 text-2xl font-extrabold tabular-nums leading-none text-[#0F4F68] sm:text-[1.65rem]"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Lesefortschritt: ${pct} Prozent`}
      >
        {pct}%
      </p>
    </div>
  );
}
