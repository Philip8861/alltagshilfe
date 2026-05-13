"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setPartnerAccountDisabledByAdminAction } from "@/lib/actions/partner-account-admin";

type Props = {
  partnerId: string;
  disabled: boolean;
};

export function PartnerAccountDeactivateButton({ partnerId, disabled }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setMsg(null);
          const next = !disabled;
          const label = next ? "deaktivieren" : "reaktivieren";
          if (typeof window !== "undefined" && !window.confirm(`Partnerkonto wirklich ${label}?`)) return;
          startTransition(async () => {
            const r = await setPartnerAccountDisabledByAdminAction(partnerId, next);
            if (!r.ok) {
              setMsg(r.message);
              return;
            }
            router.refresh();
          });
        }}
        className={`min-h-9 rounded-xl px-2 py-1 text-xs font-semibold disabled:opacity-60 ${
          disabled
            ? "border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
            : "border border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100"
        }`}
      >
        {disabled ? "Konto reaktivieren" : "Konto deaktivieren"}
      </button>
      {msg ? (
        <span className="text-[0.65rem] font-medium text-red-700" role="alert">
          {msg}
        </span>
      ) : null}
    </div>
  );
}
