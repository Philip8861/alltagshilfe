"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  /** Große Kennzahl (z.B. Aufrufe gesamt). */
  metricPrimary?: ReactNode;
  metricHint?: string;
  selected: boolean;
  onClick: () => void;
  /**
   * Nur Titel (+ optional sehr kurzer Zusatz) zentriert – für übergreifende Statistikwahl ohne Kennzahlen-Vorschau.
   */
  presentation?: "default" | "labelOnly";
};

/**
 * Großes Quadrat als Auswahl für Homepage-Statistik-Abschnitte (Admin).
 * Mobile: hohe Kachel ohne erzwungenes Quadrat; ab sm eher quadratisch.
 */
export function HomepageStatTileButton({
  title,
  subtitle,
  metricPrimary,
  metricHint,
  selected,
  onClick,
  presentation = "default",
}: Props) {
  if (presentation === "labelOnly") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 px-4 py-6 text-center shadow-[0_10px_34px_-20px_rgba(15,79,104,0.45)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/35",
          "max-sm:min-h-[9.5rem] sm:aspect-square sm:min-h-[12rem]",
          selected
            ? "border-[#0F4F68] bg-gradient-to-br from-[#dfeef3] to-white ring-2 ring-[#0F4F68]/25"
            : "border-[#0F4F68]/14 bg-white hover:border-[#0F4F68]/38 hover:bg-[#f8fbfc]",
        )}
      >
        <p className="text-sm font-bold leading-snug text-[#0F4F68] sm:text-[0.95rem]">{title}</p>
        {subtitle ? <p className="text-xs leading-snug text-neutral-600">{subtitle}</p> : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full flex-col justify-between gap-3 rounded-2xl border-2 p-5 text-left shadow-[0_10px_34px_-20px_rgba(15,79,104,0.45)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/35",
        "max-sm:min-h-[9.5rem] sm:aspect-square sm:min-h-[12rem]",
        selected
          ? "border-[#0F4F68] bg-gradient-to-br from-[#dfeef3] to-white ring-2 ring-[#0F4F68]/25"
          : "border-[#0F4F68]/14 bg-white hover:border-[#0F4F68]/38 hover:bg-[#f8fbfc]",
      )}
    >
      <div className="min-w-0">
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/80">{title}</p>
        {subtitle ? <p className="mt-2 text-xs leading-snug text-neutral-600">{subtitle}</p> : null}
      </div>
      {metricPrimary != null ? (
        <div>
          <p className="text-3xl font-bold tabular-nums leading-none text-[#0F4F68] sm:text-[2.15rem]">
            {metricPrimary}
          </p>
          {metricHint ? <p className="mt-2 text-[0.7rem] leading-snug text-neutral-600">{metricHint}</p> : null}
        </div>
      ) : (
        <p className="text-sm font-semibold text-[#0F4F68]/90">Auswertung anzeigen</p>
      )}
    </button>
  );
}
