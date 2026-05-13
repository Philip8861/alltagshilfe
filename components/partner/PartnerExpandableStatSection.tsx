"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  /** Erste Ausklapp beim Laden (ein Abschnitt sinnvoll offen lassen). */
  defaultOpen?: boolean;
  children: ReactNode;
  /** Leicht abgesetzter Rand für Homepage-Traffic-Panel. */
  className?: string;
};

/** Admin & Partnerportal: klickbare Kachel mit ausklappbarem Inhalt (Übersicht statt endlos scrollen). */
export function PartnerExpandableStatSection({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#0F4F68]/14 bg-white shadow-[0_8px_30px_-18px_rgba(15,79,104,0.35)]",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[3.25rem] w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#F2F9FA]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/35 sm:min-h-[3.5rem] sm:items-center sm:gap-4 sm:px-5 sm:py-4"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-base font-bold text-[#0F4F68]">{title}</span>
          {subtitle ? <span className="text-sm text-neutral-600">{subtitle}</span> : null}
        </span>
        {badge !== undefined && badge !== null ? (
          <span className="shrink-0 rounded-full bg-[#0F4F68]/08 px-2.5 py-1 text-xs font-semibold text-[#0F4F68] tabular-nums">
            {badge}
          </span>
        ) : null}
        <svg
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 text-[#0F4F68] transition-transform duration-200 sm:mt-0",
            open ? "rotate-180" : "",
          )}
          aria-hidden
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div id={regionId} role="region" hidden={!open} className="border-t border-[#0F4F68]/12">
        {open ? <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div> : null}
      </div>
    </div>
  );
}
