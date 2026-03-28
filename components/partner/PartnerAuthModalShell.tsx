"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

type PartnerAuthModalShellProps = {
  children: React.ReactNode;
  titleId: string;
};

/**
 * Schwebende Karte: Seite dahinter bleibt sichtbar (leichter Schleier, kein undurchsichtiger Voll-Hintergrund).
 */
export function PartnerAuthModalShell({ children, titleId }: PartnerAuthModalShellProps) {
  const router = useRouter();
  const close = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div className="notranslate fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      <button
        type="button"
        className="pointer-events-auto absolute inset-0 z-0 bg-[#0F4F68]/[0.06] backdrop-blur-[2px]"
        aria-label="Schließen und zur Startseite"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="pointer-events-auto relative z-10 flex max-h-[min(92vh,880px)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/92 shadow-[0_25px_50px_-12px_rgba(15,79,104,0.28),0_0_0_1px_rgba(15,79,104,0.06)] backdrop-blur-xl sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-end border-b border-[#0F4F68]/[0.08] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-light leading-none text-[#0F4F68]/65 transition hover:bg-[#0F4F68]/[0.08] hover:text-[#0F4F68]"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}
