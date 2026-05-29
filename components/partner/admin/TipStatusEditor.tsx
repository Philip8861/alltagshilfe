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
  serviceSlug: string;
  paidAmountEur: number | null;
  /** Partner-Standard für monatliche Provision (Betrieb), falls noch kein Betrag gesetzt. */
  defaultMonthlyProvisionEur?: number | null;
};

function formatPayoutInputHint(eur: number | null): string {
  if (eur == null || !Number.isFinite(eur)) return "";
  return String(eur).includes(".") ? String(eur).replace(".", ",") : String(eur);
}

export function TipStatusEditor({
  tipId,
  status,
  adminVisibleNote,
  serviceSlug,
  paidAmountEur,
  defaultMonthlyProvisionEur = null,
}: Props) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<PartnerTipAdminStatus>(status);
  const [note, setNote] = useState(adminVisibleNote ?? "");
  const [noteOpen, setNoteOpen] = useState(Boolean((adminVisibleNote ?? "").trim()));
  const [payoutInput, setPayoutInput] = useState(() =>
    formatPayoutInputHint(paidAmountEur ?? defaultMonthlyProvisionEur),
  );
  const wasPending = useRef(false);

  const [state, formAction, pending] = useActionState(updatePartnerTipStatusAction, initial);

  const isBetrieblich = serviceSlug === "betriebliche_pflegeberatung";
  const showPayoutField = selectedStatus === "vertragsabschluss_erfolgreich" && isBetrieblich;
  const showRejectionGrund = selectedStatus === "nicht_erfolgreich" && isBetrieblich;

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  useEffect(() => {
    const n = adminVisibleNote ?? "";
    setNote(n);
    if (n.trim()) setNoteOpen(true);
  }, [adminVisibleNote]);

  useEffect(() => {
    setPayoutInput(formatPayoutInputHint(paidAmountEur ?? defaultMonthlyProvisionEur));
  }, [paidAmountEur, defaultMonthlyProvisionEur]);

  useEffect(() => {
    if (showRejectionGrund) setNoteOpen(true);
  }, [showRejectionGrund]);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (!state.ok && state.message) {
        setSelectedStatus(status);
        setNote(adminVisibleNote ?? "");
        setPayoutInput(formatPayoutInputHint(paidAmountEur ?? defaultMonthlyProvisionEur));
      }
    }
    wasPending.current = pending;
  }, [pending, state.ok, state.message, status, adminVisibleNote, paidAmountEur, defaultMonthlyProvisionEur]);

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

      {showPayoutField ? (
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/60 px-2.5 py-2">
          <label className="text-[0.65rem] font-semibold text-amber-950" htmlFor={`tip-payout-${tipId}`}>
            Monatliche Provision (EUR)
          </label>
          <p className="mt-0.5 text-[0.6rem] leading-snug text-amber-900/85">
            Erforderlich bei „Vertragsabschluss erfolgreich“ (betriebliche Pflegeberatung). Leer lassen übernimmt den
            Partner-Standard, falls hinterlegt.
          </p>
          <input
            id={`tip-payout-${tipId}`}
            name="payout_amount_eur"
            type="text"
            inputMode="decimal"
            value={payoutInput}
            onChange={(e) => setPayoutInput(e.target.value)}
            disabled={pending}
            placeholder="z. B. 128,50"
            className="mt-1.5 w-full rounded-lg border border-amber-300/80 bg-white px-2 py-1.5 text-xs font-semibold tabular-nums text-neutral-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 disabled:opacity-60"
            autoComplete="off"
          />
        </div>
      ) : (
        <input type="hidden" name="payout_amount_eur" value="" />
      )}

      {showRejectionGrund ? (
        <div className="rounded-xl border border-rose-200/90 bg-rose-50/60 px-2.5 py-2">
          <label className="text-[0.65rem] font-semibold text-rose-950" htmlFor={`tip-grund-${tipId}`}>
            Ablehnungsgrund <span className="text-rose-700">*</span>
          </label>
          <p className="mt-0.5 text-[0.6rem] leading-snug text-rose-900/85">
            Wird dem Partner als Notiz angezeigt. Der Eintrag wird ins Partner-Archiv verschoben; die Provision entfällt.
          </p>
          <textarea
            id={`tip-grund-${tipId}`}
            name="admin_visible_note"
            rows={3}
            maxLength={2000}
            required
            minLength={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={pending}
            placeholder="Kurz begründen …"
            className="mt-1.5 w-full resize-y rounded-lg border border-rose-300/80 bg-white px-2 py-1.5 text-xs text-neutral-900 placeholder:text-rose-900/35 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-400/30 disabled:opacity-60"
          />
        </div>
      ) : noteOpen ? (
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
          {state.message ?? "Gespeichert."}
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
