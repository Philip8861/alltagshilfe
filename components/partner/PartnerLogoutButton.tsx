"use client";

import { useTransition } from "react";
import { partnerLogoutAction } from "@/lib/actions/partner-auth";

export function PartnerLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => partnerLogoutAction())}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-white disabled:opacity-60"
    >
      {pending ? "Abmelden…" : "Abmelden"}
    </button>
  );
}
