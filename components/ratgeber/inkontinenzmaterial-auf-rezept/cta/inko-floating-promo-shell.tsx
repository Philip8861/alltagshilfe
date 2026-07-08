"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

type InkoFloatingPromoShellProps = {
  id: string;
  dataCta: string;
  ariaLabel: string;
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Größere Karte für zentrierte Popups (30s, Beratungsauswahl) */
  size?: "default" | "large";
};

/** Zentriertes Promo-Modal – mobil scrollbar, Desktop großzügig */
export function InkoFloatingPromoShell({
  id,
  dataCta,
  ariaLabel,
  visible,
  onClose,
  children,
  className,
  size = "default",
}: InkoFloatingPromoShellProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const isLarge = size === "large";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const card = (
    <div
      className={cn(
        "pointer-events-auto relative w-full overflow-hidden rounded-2xl border bg-white ring-1 ring-[#0F4F68]/8",
        isLarge
          ? "max-w-[min(100%,32rem)] border-[#0F4F68]/14 shadow-[0_20px_48px_-16px_rgba(15,79,104,0.35)] sm:max-w-[36rem] sm:rounded-3xl md:max-w-[44rem] lg:max-w-[46rem]"
          : "max-w-[min(100%,26rem)] border-neutral-200/95 shadow-[0_12px_40px_-16px_rgba(15,79,104,0.28)] sm:max-w-[28rem]",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0F4F68]/55 via-[#3d9aaa]/70 to-[#F78F2E]/70"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Hinweis schließen"
        className="absolute right-2 top-2 z-[2] flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:right-3 sm:top-3 md:h-10 md:w-10"
      >
        <CloseIcon />
      </button>
      <div
        className={cn(
          isLarge
            ? "max-h-[min(78dvh,100%)] overflow-y-auto overscroll-contain px-4 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-8 md:px-10 md:pb-10 md:pt-10"
            : "px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-7",
        )}
      >
        {children}
      </div>
    </div>
  );

  const enterAnim = reducedMotion
    ? "opacity-100"
    : isLarge
      ? "animate-[inkoPromoInLarge_380ms_ease-out_forwards] opacity-0"
      : "animate-[inkoPromoIn_320ms_ease-out_forwards] opacity-0";

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      data-cta={dataCta}
      className={cn(
        "fixed inset-0 z-[45] flex items-end justify-center overflow-y-auto overscroll-contain",
        "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]",
        "sm:items-center sm:p-4 md:p-8",
        enterAnim,
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "fixed inset-0",
          isLarge
            ? "bg-[#041a22]/55 backdrop-blur-[6px] sm:bg-[#041a22]/65 sm:backdrop-blur-[10px] md:backdrop-blur-[14px]"
            : "bg-[#0F4F68]/25 backdrop-blur-[4px]",
        )}
        aria-label="Hinweis schließen"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-[1] my-auto w-full shrink-0",
          isLarge ? "max-w-[min(100%,46rem)]" : "max-w-[28rem]",
        )}
      >
        {card}
      </div>
    </div>
  );
}
