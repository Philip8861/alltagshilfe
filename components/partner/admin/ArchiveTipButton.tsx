"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { archivePartnerTipAction, type AdminWorkflowState } from "@/lib/actions/partner-admin-workflow";

const initial: AdminWorkflowState = { ok: false, message: "" };

export function ArchiveTipButton({ tipId, isArchived }: { tipId: string; isArchived: boolean }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(archivePartnerTipAction, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={formAction} className="inline-flex flex-col gap-1">
      <input type="hidden" name="tip_id" value={tipId} />
      <input type="hidden" name="archived" value={isArchived ? "false" : "true"} />
      <button
        type="submit"
        disabled={pending}
        className="min-h-9 whitespace-nowrap rounded-xl border border-[#0F4F68]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] disabled:opacity-50"
      >
        {pending ? "…" : isArchived ? "Reaktivieren" : "Ins Archiv"}
      </button>
      {!state.ok && state.message ? <span className="max-w-[10rem] text-[0.6rem] text-red-700">{state.message}</span> : null}
    </form>
  );
}
