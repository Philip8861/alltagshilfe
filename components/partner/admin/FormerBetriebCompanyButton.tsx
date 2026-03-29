"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setFormerActiveCompanyAction, type AdminWorkflowState } from "@/lib/actions/partner-admin-workflow";

const initial: AdminWorkflowState = { ok: false, message: "" };

export function FormerBetriebCompanyButton({ tipId, isFormer }: { tipId: string; isFormer: boolean }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(setFormerActiveCompanyAction, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={formAction} className="inline-flex flex-col gap-1">
      <input type="hidden" name="tip_id" value={tipId} />
      <input type="hidden" name="former" value={isFormer ? "false" : "true"} />
      <button
        type="submit"
        disabled={pending}
        className="min-h-9 whitespace-nowrap rounded-xl border border-emerald-700/30 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-50"
      >
        {pending ? "…" : isFormer ? "Wieder aktiv" : "Ehemaliges Unternehmen"}
      </button>
      {!state.ok && state.message ? (
        <span className="max-w-[10rem] text-[0.6rem] text-red-700">{state.message}</span>
      ) : null}
    </form>
  );
}
