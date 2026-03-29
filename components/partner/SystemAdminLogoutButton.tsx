"use client";

import { useTransition } from "react";
import { systemAdminLogoutAction } from "@/lib/actions/system-admin";

type Props = { variant?: "default" | "sidebar" };

export function SystemAdminLogoutButton({ variant = "default" }: Props) {
  const [pending, startTransition] = useTransition();

  const sidebar =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#0F4F68]/25 text-[#0F4F68] transition-all duration-200 ease-out hover:bg-[#0F4F68]/10 motion-safe:hover:scale-110 motion-safe:active:scale-[0.94] motion-safe:hover:-translate-y-0.5 disabled:opacity-50";
  const def =
    "inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-white disabled:opacity-60";

  return (
    <button
      type="button"
      disabled={pending}
      title="Verwaltung abmelden"
      aria-label="Verwaltung abmelden"
      onClick={() => startTransition(() => systemAdminLogoutAction())}
      className={variant === "sidebar" ? sidebar : def}
    >
      {variant === "sidebar" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={pending ? "opacity-50" : ""}
          aria-hidden
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : pending ? (
        "Abmelden…"
      ) : (
        "Verwaltung abmelden"
      )}
    </button>
  );
}
