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
  /** `center` = mittig im Viewport; `corner` = unten rechts (Desktop) / unten (Mobile) */
  placement?: "corner" | "center";
};

/** Promo-Box – unten rechts oder mittig, kein Vollbild-Modal */
export function InkoFloatingPromoShell({
  id,
  dataCta,
  ariaLabel,
  visible,
  onClose,
  children,
  className,
  placement = "corner",
}: InkoFloatingPromoShellProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  const card = (
    <div className="pointer-events-auto relative w-full max-w-[min(100%,26rem)] overflow-hidden rounded-2xl border border-neutral-200/95 bg-white shadow-[0_12px_40px_-16px_rgba(15,79,104,0.28)] ring-1 ring-[#0F4F68]/8 sm:max-w-[28rem]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0F4F68]/55 via-[#3d9aaa]/70 to-[#F78F2E]/70"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Hinweis schließen"
        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
      >
        <CloseIcon />
      </button>
      <div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-7">{children}</div>
    </div>
  );

  if (placement === "center") {
    return (
      <div
        id={id}
        role="dialog"
        aria-modal="false"
        aria-label={ariaLabel}
        data-cta={dataCta}
        className={cn(
          "fixed inset-0 z-[45] flex items-center justify-center p-4 sm:p-6",
          reducedMotion ? "opacity-100" : "animate-[inkoPromoIn_320ms_ease-out_forwards] opacity-0",
          className,
        )}
      >
        <button
          type="button"
          className="absolute inset-0 bg-[#0F4F68]/18"
          aria-label="Hinweis schließen"
          onClick={onClose}
        />
        <div className="relative z-[1] w-full max-w-[28rem]">{card}</div>
      </div>
    );
  }

  return (
    <div
      id={id}
      role="region"
      aria-label={ariaLabel}
      data-cta={dataCta}
      className={cn(
        "pointer-events-none fixed inset-x-3 bottom-4 z-[45] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-[22.5rem]",
        reducedMotion ? "opacity-100" : "animate-[inkoPromoIn_320ms_ease-out_forwards] opacity-0",
        className,
      )}
    >
      {card}
    </div>
  );
}
