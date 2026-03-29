"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePartnerTipStatusAction, type AdminWorkflowState } from "@/lib/actions/partner-admin-workflow";
import { PARTNER_TIP_ADMIN_STATUSES, PARTNER_TIP_STATUS_LABELS } from "@/lib/partner/partner-tip-admin";
import type { PartnerTipAdminStatus } from "@/lib/partner/types";

const initial: AdminWorkflowState = { ok: false, message: "" };

type Props = {
  tipId: string;
  status: PartnerTipAdminStatus;
  adminVisibleNote: string | null;
};

export function TipStatusEditor({ tipId, status, adminVisibleNote }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updatePartnerTipStatusAction, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={formAction} className="flex min-w-[12rem] max-w-[18rem] flex-col gap-2">
      <input type="hidden" name="tip_id" value={tipId} />
      <label className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#0F4F68]/80" htmlFor={`tip-status-${tipId}`}>
        Status
      </label>
      <select
        id={`tip-status-${tipId}`}
        name="admin_status"
        defaultValue={status}
        disabled={pending}
        className="w-full rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900 disabled:opacity-60"
        aria-label="Status Tippgeber-Eingang"
      >
        {PARTNER_TIP_ADMIN_STATUSES.map((s) => (
          <option key={s} value={s}>
            {PARTNER_TIP_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <label className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#0F4F68]/80" htmlFor={`tip-note-${tipId}`}>
        Notiz für Partner
      </label>
      <textarea
        id={`tip-note-${tipId}`}
        name="admin_visible_note"
        rows={2}
        maxLength={2000}
        defaultValue={adminVisibleNote ?? ""}
        disabled={pending}
        placeholder="Wird in der Partner-Statusliste unter „Notiz“ angezeigt …"
        className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-9 rounded-xl bg-[#0F4F68] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0c3d52] disabled:opacity-50"
      >
        {pending ? "Speichert…" : "Speichern"}
      </button>
      {state.ok ? <span className="text-[0.65rem] text-emerald-700">Gespeichert.</span> : null}
      {!state.ok && state.message ? <span className="text-[0.65rem] text-red-700">{state.message}</span> : null}
    </form>
  );
}
