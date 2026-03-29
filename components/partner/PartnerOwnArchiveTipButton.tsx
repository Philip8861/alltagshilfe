"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  archiveOwnPartnerTipAction,
  type PartnerOwnArchiveState,
} from "@/lib/actions/partner-own-tip-archive";

const initial: PartnerOwnArchiveState = { ok: true, message: "" };

type Props = {
  tipId: string;
  isArchived: boolean;
  variant?: "table" | "compact";
};

export function PartnerOwnArchiveTipButton({ tipId, isArchived, variant = "table" }: Props) {
  const router = useRouter();
  const wasPending = useRef(false);
  const [state, formAction, pending] = useActionState(archiveOwnPartnerTipAction, initial);

  useEffect(() => {
    if (wasPending.current && !pending && state.ok) {
      router.refresh();
    }
    wasPending.current = pending;
  }, [pending, state.ok, router]);

  const btnClass =
    variant === "compact"
      ? "min-h-8 rounded-lg border border-[#0F4F68]/25 bg-white px-2 py-1 text-[0.65rem] font-semibold text-[#0F4F68] hover:bg-[#F2F9FA] disabled:opacity-50"
      : "min-h-9 rounded-lg border border-[#0F4F68]/20 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA] disabled:opacity-50";

  return (
    <form action={formAction} className="inline-flex flex-col gap-1">
      <input type="hidden" name="tip_id" value={tipId} />
      <input type="hidden" name="archived" value={isArchived ? "false" : "true"} />
      <button type="submit" disabled={pending} className={btnClass}>
        {pending ? "…" : isArchived ? "Reaktivieren" : "Ins Archiv"}
      </button>
      {!state.ok && state.message ? (
        <span className="max-w-[10rem] text-[0.6rem] text-rose-700" role="alert">
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
