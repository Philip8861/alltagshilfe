"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

type PartnerAuthModalShellProps = {
  children: React.ReactNode;
  /** Für aria-labelledby auf der Überschrift */
  titleId: string;
};

/**
 * Vollbild-Overlay mit dunklem Hintergrund, breiter Dialog mittig (Login / Registrieren).
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

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="notranslate fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-10">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        aria-label="Schließen und zur Startseite"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-gradient-to-b from-white via-white to-[#f0f8fa] shadow-[0_32px_64px_-20px_rgba(15,79,104,0.45),0_0_0_1px_rgba(15,79,104,0.06)] sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-end px-4 pb-1 pt-3 sm:px-8 sm:pt-5">
          <button
            type="button"
            onClick={close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100/90 text-lg font-light leading-none text-neutral-600 shadow-sm transition hover:bg-neutral-200 hover:text-neutral-900"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-0 sm:px-10 sm:pb-12">
          {children}
        </div>
      </div>
    </div>
  );
}
