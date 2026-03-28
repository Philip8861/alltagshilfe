"use client";

import { useTransition } from "react";
import { systemAdminLogoutAction } from "@/lib/actions/system-admin";

export function SystemAdminLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => systemAdminLogoutAction())}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-white disabled:opacity-60"
    >
      {pending ? "Abmelden…" : "Verwaltung abmelden"}
    </button>
  );
}
