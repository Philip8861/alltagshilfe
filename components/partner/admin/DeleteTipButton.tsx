"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deletePartnerTipAction, type AdminWorkflowState } from "@/lib/actions/partner-admin-workflow";

const initial: AdminWorkflowState = { ok: false, message: "" };

export function DeleteTipButton({ tipId }: { tipId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deletePartnerTipAction, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form
      action={formAction}
      className="inline-flex flex-col gap-1"
      onSubmit={(e) => {
        if (!window.confirm("Diesen Tipp endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="tip_id" value={tipId} />
      <button
        type="submit"
        disabled={pending}
        className="min-h-9 whitespace-nowrap rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-900 transition hover:bg-rose-100 disabled:opacity-50"
      >
        {pending ? "…" : "Löschen"}
      </button>
      {!state.ok && state.message ? <span className="max-w-[10rem] text-[0.6rem] text-red-700">{state.message}</span> : null}
    </form>
  );
}
