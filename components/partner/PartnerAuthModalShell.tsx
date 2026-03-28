"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

type PartnerAuthModalShellProps = {
  children: React.ReactNode;
  /** Für aria-labelledby auf der Überschrift */
  titleId: string;
};

/**
 * Partner-Login: helleres Overlay als z. B. Cookie-/Hilfs-Dialoge (Marken-Teal, geringere Deckkraft).
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
    <div className="notranslate fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-[#e8f4f8]/95 via-[#f0f9fb] to-white p-3 sm:p-6 md:p-10">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-[#0F4F68]/18 backdrop-blur-[2px] transition-opacity"
        aria-label="Schließen und zur Startseite"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_24px_48px_-12px_rgba(15,79,104,0.2),0_0_0_1px_rgba(15,79,104,0.06)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-end border-b border-[#0F4F68]/08 bg-gradient-to-r from-white to-[#f4fafc] px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-light leading-none text-[#0F4F68]/70 transition hover:bg-[#0F4F68]/10 hover:text-[#0F4F68]"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
