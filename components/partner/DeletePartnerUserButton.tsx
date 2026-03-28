"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  deletePartnerUserAction,
  type DeletePartnerUserState,
} from "@/lib/actions/system-admin";

const initial: DeletePartnerUserState = { ok: false, message: "" };

type Props = {
  userId: string;
  displayLabel: string;
};

export function DeletePartnerUserButton({ userId, displayLabel }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deletePartnerUserAction, initial);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state.ok, router]);

  const err = !state.ok && state.message ? state.message : null;

  return (
    <form
      action={formAction}
      className="inline-flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        const q = `Partner-Konto endgültig löschen?\n\n${displayLabel}\n\nDiese Aktion kann nicht rückgängig gemacht werden.`;
        if (!window.confirm(q)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="user_id" value={userId} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Partner-Konto ${displayLabel} löschen`}
        className="inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "Löschen…" : "Löschen"}
      </button>
      {err ? (
        <span className="text-xs text-red-700" role="alert">
          {err}
        </span>
      ) : null}
      {state.ok ? (
        <span className="text-xs text-emerald-800" role="status">
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
