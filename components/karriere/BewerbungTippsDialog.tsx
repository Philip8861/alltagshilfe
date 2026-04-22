"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/utils";

const BEWERBUNG_TIPPS = [
  "Fülle das Bewerbungsformular sorgfältig und vollständig aus.",
  "Lade alle relevanten Unterlagen hoch, insbesondere deinen Lebenslauf mit Foto sowie deine Abschlüsse und Zeugnisse.",
  "Gib deine aktuellen Kontaktdaten an und teile uns mit, zu welchen Zeiten du gut erreichbar bist – wir melden uns telefonisch bei dir.",
] as const;

function TippsGlühbirnenIcon({ gradientId }: { gradientId: string }) {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="8" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F78F2E" />
          <stop offset="1" stopColor="#F5B041" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M16 4c-4.42 0-8 3.58-8 8 0 2.8 1.44 5.26 3.62 6.68.5.32.88.82 1.06 1.4l.82 2.46A2 2 0 0015.18 24h1.64a2 2 0 001.68-.9l.82-2.45c.18-.58.56-1.08 1.06-1.4C22.56 17.26 24 14.8 24 12c0-4.42-3.58-8-8-8Z"
      />
      <path fill="#0F4F68" fillOpacity="0.35" d="M12 26h8v2H12v-2Zm2 4h4v2h-4v-2Z" />
      <circle cx="26" cy="7" r="1.5" fill="#F78F2E" opacity="0.9" />
      <circle cx="6" cy="10" r="1.2" fill="#F78F2E" opacity="0.75" />
      <path stroke="#0F4F68" strokeLinecap="round" strokeOpacity="0.4" strokeWidth="1.2" d="M22 5l2-2M28 14h2" />
    </svg>
  );
}

type BewerbungTippsFabProps = {
  className?: string;
};

export function BewerbungTippsFab({ className = "" }: BewerbungTippsFabProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const iconGradientId = useId().replace(/:/g, "");

  return (
    <>
      <button
        type="button"
        className={cn(
          "group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#F78F2E]/40 bg-gradient-to-br from-white to-[#FFF5EB] shadow-md transition hover:border-[#F78F2E] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:h-12 sm:w-12",
          className,
        )}
        aria-haspopup="dialog"
        aria-label="Tipps für deine Bewerbung öffnen"
        onClick={() => dialogRef.current?.showModal()}
      >
        <TippsGlühbirnenIcon gradientId={iconGradientId} />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed left-1/2 top-1/2 z-[100] w-[min(calc(100vw-1.5rem),26rem)] max-h-[min(90vh,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border-2 border-[#0F4F68]/20 bg-white p-0 shadow-2xl backdrop:bg-[#0F4F68]/35 open:flex open:flex-col [&::backdrop]:bg-[#0F4F68]/35"
      >
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-[#0F4F68]/10 bg-gradient-to-r from-[#F2F9FA] to-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F78F2E]/30 bg-white shadow-sm">
              <TippsGlühbirnenIcon gradientId={iconGradientId} />
            </span>
            <h2 id={titleId} className="text-lg font-bold leading-tight text-[#0F4F68] sm:text-xl">
              Tipps für deine Bewerbung
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-neutral-600 transition hover:bg-[#0F4F68]/10 hover:text-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            onClick={() => dialogRef.current?.close()}
          >
            Schließen
          </button>
        </div>
        <div className="px-5 py-5 text-sm leading-relaxed text-neutral-700 sm:px-6 sm:text-base">
          <p className="text-pretty font-medium text-[#0F4F68]">
            Damit wir deine Bewerbung schnell und vollständig bearbeiten können, beachte bitte folgende Punkte:
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-[#F78F2E]">
            {BEWERBUNG_TIPPS.map((t) => (
              <li key={t} className="text-pretty pl-1">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
