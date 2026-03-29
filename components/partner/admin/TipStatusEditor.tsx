"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePartnerTipStatusAction, type AdminWorkflowState } from "@/lib/actions/partner-admin-workflow";
import { PARTNER_TIP_ADMIN_STATUSES, PARTNER_TIP_STATUS_LABELS } from "@/lib/partner/partner-tip-admin";
import { PARTNER_TIP_STATUS_SELECT_CLASS } from "@/lib/partner/partner-tip-status-ui";
import type { PartnerTipAdminStatus } from "@/lib/partner/types";

const initial: AdminWorkflowState = { ok: false, message: "" };

type Props = {
  tipId: string;
  status: PartnerTipAdminStatus;
  adminVisibleNote: string | null;
};

export function TipStatusEditor({ tipId, status, adminVisibleNote }: Props) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<PartnerTipAdminStatus>(status);
  const [note, setNote] = useState(adminVisibleNote ?? "");
  const [noteOpen, setNoteOpen] = useState(Boolean((adminVisibleNote ?? "").trim()));
  const wasPending = useRef(false);

  const [state, formAction, pending] = useActionState(updatePartnerTipStatusAction, initial);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  useEffect(() => {
    const n = adminVisibleNote ?? "";
    setNote(n);
    if (n.trim()) setNoteOpen(true);
  }, [adminVisibleNote]);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (!state.ok && state.message) {
        setSelectedStatus(status);
        setNote(adminVisibleNote ?? "");
      }
    }
    wasPending.current = pending;
  }, [pending, state.ok, state.message, status, adminVisibleNote]);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const selectStyle =
    PARTNER_TIP_STATUS_SELECT_CLASS[selectedStatus] ??
    "border-neutral-200 bg-white focus:border-[#0F4F68] focus:ring-[#0F4F68]/20";

  return (
    <form action={formAction} className="flex min-w-[12rem] max-w-[18rem] flex-col gap-2">
      <input type="hidden" name="tip_id" value={tipId} />
      <label className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#0F4F68]/80" htmlFor={`tip-status-${tipId}`}>
        Status
      </label>
      <select
        id={`tip-status-${tipId}`}
        name="admin_status"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as PartnerTipAdminStatus)}
        disabled={pending}
        className={`w-full rounded-xl border px-2.5 py-2 text-xs font-semibold text-neutral-900 shadow-sm outline-none ring-0 transition focus:ring-2 disabled:opacity-60 ${selectStyle}`}
        aria-label="Status Tippgeber-Eingang"
      >
        {PARTNER_TIP_ADMIN_STATUSES.map((s) => (
          <option key={s} value={s}>
            {PARTNER_TIP_STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {noteOpen ? (
        <>
          <label className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#0F4F68]/80" htmlFor={`tip-note-${tipId}`}>
            Notiz für Partner
          </label>
          <textarea
            id={`tip-note-${tipId}`}
            name="admin_visible_note"
            rows={3}
            maxLength={2000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={pending}
            placeholder="Wird in der Partner-Statusliste unter „Notiz“ angezeigt …"
            className="w-full resize-y rounded-xl border border-violet-200/90 bg-violet-50/40 px-2.5 py-2 text-xs text-neutral-900 placeholder:text-violet-900/40 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/25 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => {
              setNoteOpen(false);
              setNote(adminVisibleNote ?? "");
            }}
            className="self-start text-[0.65rem] font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline"
          >
            Notiz-Bereich ausblenden
          </button>
        </>
      ) : (
        <>
          <input type="hidden" name="admin_visible_note" value={adminVisibleNote ?? ""} />
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="rounded-xl border border-dashed border-violet-300/90 bg-violet-50/50 px-2.5 py-2 text-left text-[0.7rem] font-semibold text-violet-900 transition hover:border-violet-400 hover:bg-violet-50"
          >
            + Notiz für Partner hinzufügen (optional)
          </button>
        </>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-9 rounded-xl bg-[#0F4F68] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0c3d52] disabled:opacity-50"
      >
        {pending ? "Speichert…" : "Speichern"}
      </button>
      {state.ok ? (
        <span className="rounded-lg bg-emerald-50 px-2 py-1.5 text-[0.65rem] font-medium text-emerald-800 ring-1 ring-emerald-200/80">
          Gespeichert.
        </span>
      ) : null}
      {!state.ok && state.message ? (
        <p className="rounded-lg bg-rose-50 px-2 py-1.5 text-[0.65rem] font-medium leading-snug text-rose-900 ring-1 ring-rose-200/90" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
