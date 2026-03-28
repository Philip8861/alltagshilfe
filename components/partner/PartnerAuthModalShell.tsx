"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

type PartnerAuthModalShellProps = {
  children: React.ReactNode;
  /** Für aria-labelledby auf der Überschrift */
  titleId: string;
};

/**
 * Vollbild-Overlay mit dunklem Hintergrund, Dialog mittig (Login / Registrieren).
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[3px]"
        aria-label="Schließen und zur Startseite"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,940px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#f7fafb] shadow-2xl ring-1 ring-black/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 justify-end border-b border-[#0F4F68]/10 bg-[#f7fafb]/95 px-2 py-1 backdrop-blur-sm sm:px-3">
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-2xl font-light leading-none text-[#0F4F68] hover:bg-[#0F4F68]/10"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-3 sm:px-8 sm:pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
