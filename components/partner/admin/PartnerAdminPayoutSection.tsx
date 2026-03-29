"use client";

import { Fragment, useActionState, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  adminTestPartnerPayoutRerunAction,
  type PartnerPayoutTestState,
} from "@/lib/actions/partner-admin-payout-test";
import {
  deletePartnerPayoutReportAction,
  updatePartnerPayoutReportAction,
  type PayoutReportCrudState,
} from "@/lib/actions/partner-payout-report-crud";
import { maskIban } from "@/lib/partner/iban-display";
import { formatProvisionEur } from "@/lib/partner/partner-tip-payout";
import type { PartnerAdminPayoutPeriod, PartnerProfile } from "@/lib/partner/types";

type AuthInfo = { email: string };

type Row = PartnerAdminPayoutPeriod["rows"][number];

function formatEurInput(n: number): string {
  if (!Number.isFinite(n)) return "0,00";
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function partnerRowName(pr: PartnerProfile | null): string {
  if (!pr) return "—";
  return (
    [pr.first_name?.trim(), pr.last_name?.trim()].filter(Boolean).join(" ") ||
    pr.display_name?.trim() ||
    "—"
  );
}

const payoutTestInitial: PartnerPayoutTestState = { ok: false, message: "" };
const crudInitial: PayoutReportCrudState = { ok: false, message: "" };

function PayoutReportEditPanel({
  row,
  onDone,
}: {
  row: Row;
  onDone: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updatePartnerPayoutReportAction, crudInitial);
  const [einmal, setEinmal] = useState(() => formatEurInput(row.einmal_eur));
  const [monatlich, setMonatlich] = useState(() => formatEurInput(row.monatlich_eur));

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      onDone();
    }
  }, [state.ok, router, onDone]);

  return (
    <div className="rounded-xl border border-[#0F4F68]/15 bg-[#F2F9FA]/80 p-4">
      <p className="text-xs font-bold uppercase text-[#0F4F68]/75">Beträge anpassen</p>
      <form action={formAction} className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <input type="hidden" name="report_id" value={row.id} />
        <div>
          <label className="text-[0.65rem] font-semibold text-neutral-600" htmlFor={`einmal-${row.id}`}>
            Einmal (EUR)
          </label>
          <input
            id={`einmal-${row.id}`}
            name="einmal_eur"
            value={einmal}
            onChange={(e) => setEinmal(e.target.value)}
            disabled={pending}
            className="mt-1 w-full min-w-[8rem] rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:w-36"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="text-[0.65rem] font-semibold text-neutral-600" htmlFor={`monat-${row.id}`}>
            Monatlich (EUR)
          </label>
          <input
            id={`monat-${row.id}`}
            name="monatlich_eur"
            value={monatlich}
            onChange={(e) => setMonatlich(e.target.value)}
            disabled={pending}
            className="mt-1 w-full min-w-[8rem] rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:w-36"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={pending}
            className="min-h-10 rounded-xl bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-50"
          >
            {pending ? "Speichert…" : "Speichern"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onDone}
            className="min-h-10 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Abbrechen
          </button>
        </div>
      </form>
      {!state.ok && state.message ? <p className="mt-2 text-xs text-rose-700">{state.message}</p> : null}
    </div>
  );
}

function DeletePayoutReportControl({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deletePartnerPayoutReportAction, crudInitial);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            !window.confirm(
              "Diese Zeile aus dem Auszahlungsbericht löschen? Einmal-Tipps dieses Partners für diesen Monat werden wieder freigegeben (nicht archiviert).",
            )
          ) {
            return;
          }
          const fd = new FormData();
          fd.set("report_id", reportId);
          startTransition(() => {
            formAction(fd);
          });
        }}
        className="min-h-9 w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-900 hover:bg-rose-100 disabled:opacity-50"
      >
        {pending ? "…" : "Löschen"}
      </button>
      {!state.ok && state.message ? <p className="mt-1 text-[0.65rem] text-rose-700">{state.message}</p> : null}
    </div>
  );
}

function PartnerAdminTestPayoutForm() {
  const [state, formAction, pending] = useActionState(adminTestPartnerPayoutRerunAction, payoutTestInitial);
  return (
    <form action={formAction} className="mt-4 flex max-w-2xl flex-col gap-3">
      <div className="min-w-0">
        <label htmlFor="test-payout-period" className="text-xs font-semibold text-neutral-600">
          Abrechnungsmonat (YYYY-MM)
        </label>
        <input
          id="test-payout-period"
          name="period_key"
          type="text"
          inputMode="numeric"
          placeholder="Leer lassen = Vormonat relativ zum Referenzdatum"
          disabled={pending}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 font-mono text-sm text-neutral-900"
          autoComplete="off"
        />
      </div>
      <div className="min-w-0">
        <label htmlFor="test-payout-reference-date" className="text-xs font-semibold text-neutral-600">
          Referenzdatum (optional, Europe/Berlin)
        </label>
        <input
          id="test-payout-reference-date"
          name="reference_date"
          type="date"
          disabled={pending}
          className="mt-1 w-full max-w-xs rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Wenn der Abrechnungsmonat leer ist, gilt der Vormonat zu diesem Tag (zum Experimentieren mit anderen
          „heute“-Monaten).
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full max-w-md items-center justify-center rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Läuft…" : "Test: Monat zurücksetzen und Abrechnung neu ausführen"}
      </button>
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-emerald-800" : "text-rose-800"}`} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

type Props = {
  payoutPeriods: PartnerAdminPayoutPeriod[];
  authById: Record<string, AuthInfo>;
};

export function PartnerAdminPayoutSection({ payoutPeriods, authById }: Props) {
  const [periodKey, setPeriodKey] = useState<string>(() => payoutPeriods[0]?.periodKey ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (payoutPeriods.length === 0) {
      setPeriodKey("");
      return;
    }
    if (!periodKey || !payoutPeriods.some((p) => p.periodKey === periodKey)) {
      setPeriodKey(payoutPeriods[0].periodKey);
    }
  }, [payoutPeriods, periodKey]);

  const active = useMemo(
    () => payoutPeriods.find((p) => p.periodKey === periodKey) ?? null,
    [payoutPeriods, periodKey],
  );

  const totals = useMemo(() => {
    if (!active) return { einmal: 0, monatlich: 0, sum: 0, rows: 0 };
    let einmal = 0;
    let monatlich = 0;
    for (const r of active.rows) {
      einmal += r.einmal_eur;
      monatlich += r.monatlich_eur;
    }
    return {
      einmal: Math.round(einmal * 100) / 100,
      monatlich: Math.round(monatlich * 100) / 100,
      sum: Math.round((einmal + monatlich) * 100) / 100,
      rows: active.rows.length,
    };
  }, [active]);

  const periodSummaries = useMemo(() => {
    return payoutPeriods.map((p) => {
      let e = 0;
      let m = 0;
      for (const r of p.rows) {
        e += r.einmal_eur;
        m += r.monatlich_eur;
      }
      const sum = Math.round((e + m) * 100) / 100;
      return {
        periodKey: p.periodKey,
        labelDe: p.labelDe,
        rowCount: p.rows.length,
        einmal: Math.round(e * 100) / 100,
        monatlich: Math.round(m * 100) / 100,
        sum,
      };
    });
  }, [payoutPeriods]);

  const grandTotal = useMemo(() => {
    let s = 0;
    for (const x of periodSummaries) s += x.sum;
    return Math.round(s * 100) / 100;
  }, [periodSummaries]);

  const triggerPrint = useCallback(() => {
    document.documentElement.classList.add("partner-payout-print-mode");
    window.print();
  }, []);

  useEffect(() => {
    const clear = () => document.documentElement.classList.remove("partner-payout-print-mode");
    window.addEventListener("afterprint", clear);
    return () => window.removeEventListener("afterprint", clear);
  }, []);

  const generatedLabel = useMemo(
    () =>
      new Date().toLocaleString("de-DE", {
        dateStyle: "long",
        timeStyle: "short",
      }),
    [],
  );

  return (
    <section
      className="partner-payout-print-root partner-dash-animate rounded-3xl border border-[#0F4F68]/10 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
      aria-labelledby="auszahlen-heading"
    >
      <h2 id="auszahlen-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
        Auszahlungsberichte
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-neutral-600">
        Abgeschlossene Monatsläufe (Europe/Berlin). Übersicht aller Perioden, Detail je Monat mit Bankdaten. Zeilen
        lassen sich korrigieren oder entfernen; Löschen gibt zugehörige Einmal-Tipps für diesen Monat wieder frei.
      </p>

      {payoutPeriods.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/80 px-4 py-8 text-center text-sm text-neutral-600">
          Noch keine abgeschlossenen Auszahlungsläufe. Nach Migration 011 und Cron: Lauf am 1. des Monats oder Test unten.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#F2F9FA] to-white p-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/65">Abrechnungsmonate</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#0F4F68]">{payoutPeriods.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-emerald-900/70">Summe aller Läufe</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-900">{formatProvisionEur(grandTotal)}</p>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-white p-4 sm:col-span-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-amber-950/75">Gewählter Monat</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">
                {active ? `${active.labelDe} (${active.periodKey})` : "—"}
              </p>
              <p className="mt-2 text-sm tabular-nums text-neutral-700">
                {active ? (
                  <>
                    Partner-Zeilen: <span className="font-semibold text-[#0F4F68]">{totals.rows}</span>
                    {" · "}
                    Einmal {formatProvisionEur(totals.einmal)} · Monatlich {formatProvisionEur(totals.monatlich)} ·{" "}
                    <span className="font-bold text-[#0F4F68]">Gesamt {formatProvisionEur(totals.sum)}</span>
                  </>
                ) : (
                  "—"
                )}
              </p>
            </div>
          </div>

          <div className="partner-payout-print-hide mt-8">
            <h3 className="text-sm font-bold text-[#0F4F68]">Alle Abrechnungsläufe</h3>
            <p className="mt-1 text-xs text-neutral-500">Klicken Sie eine Zeile oder Karte, um den Detailbereich zu laden.</p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200/80">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/70 text-xs">
                  <tr>
                    <th className="px-3 py-3">Monat</th>
                    <th className="px-3 py-3">Partner-Zeilen</th>
                    <th className="whitespace-nowrap px-3 py-3">Σ Einmal</th>
                    <th className="whitespace-nowrap px-3 py-3">Σ Monatlich</th>
                    <th className="whitespace-nowrap px-3 py-3">Σ Gesamt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {periodSummaries.map((s) => {
                    const sel = s.periodKey === periodKey;
                    return (
                      <tr
                        key={s.periodKey}
                        className={`cursor-pointer transition-colors hover:bg-[#f8fbfc] ${sel ? "bg-[#0F4F68]/6" : ""}`}
                        onClick={() => setPeriodKey(s.periodKey)}
                      >
                        <td className="px-3 py-3 font-medium text-neutral-900">
                          {s.labelDe}
                          <span className="ml-2 font-mono text-xs text-neutral-500">{s.periodKey}</span>
                        </td>
                        <td className="px-3 py-3 tabular-nums text-neutral-800">{s.rowCount}</td>
                        <td className="px-3 py-3 tabular-nums font-medium text-neutral-900">
                          {formatProvisionEur(s.einmal)}
                        </td>
                        <td className="px-3 py-3 tabular-nums font-medium text-neutral-900">
                          {formatProvisionEur(s.monatlich)}
                        </td>
                        <td className="px-3 py-3 tabular-nums font-bold text-[#0F4F68]">{formatProvisionEur(s.sum)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="min-w-0 flex-1 sm:max-w-md">
                <label htmlFor="payout-period-select" className="block text-xs font-bold uppercase text-[#0F4F68]/80">
                  Monat für Detail &amp; Druck
                </label>
                <select
                  id="payout-period-select"
                  value={periodKey}
                  onChange={(e) => setPeriodKey(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2"
                >
                  {payoutPeriods.map((p) => (
                    <option key={p.periodKey} value={p.periodKey}>
                      {p.labelDe} ({p.periodKey})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={triggerPrint}
                  disabled={!active || active.rows.length === 0}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#0F4F68]/25 bg-[#0F4F68] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0c3d52] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Liste drucken
                </button>
              </div>
            </div>
          </div>

          {active ? (
            <div className="mt-8">
              <p className="hidden text-center text-xs text-neutral-500 print:block">
                Alltagshilfe · Auszahlungsliste · {active.labelDe} · erstellt {generatedLabel}
              </p>
              <h3 className="mt-4 text-lg font-bold text-[#0F4F68] print:mt-2">Detail {active.labelDe}</h3>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200/80 print:border-neutral-400">
                <table className="min-w-[1040px] w-full text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/70 text-xs print:bg-neutral-100">
                    <tr>
                      <th className="px-3 py-3">Partner</th>
                      <th className="px-3 py-3">E-Mail</th>
                      <th className="px-3 py-3">IBAN (maskiert)</th>
                      <th className="px-3 py-3">BIC</th>
                      <th className="px-3 py-3">Kontoinhaber</th>
                      <th className="whitespace-nowrap px-3 py-3">Einmal</th>
                      <th className="whitespace-nowrap px-3 py-3">Monatlich</th>
                      <th className="whitespace-nowrap px-3 py-3">Gesamt</th>
                      <th className="partner-payout-print-hide whitespace-nowrap px-3 py-3">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {active.rows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-10 text-center text-neutral-600">
                          Keine Zeilen für diesen Monat.
                        </td>
                      </tr>
                    ) : (
                      active.rows.map((r) => {
                        const pr = r.profile;
                        const name = partnerRowName(pr);
                        const bic = pr?.bic?.trim();
                        const holder = pr?.account_holder?.trim();
                        const isEditing = editingId === r.id;
                        return (
                          <Fragment key={r.id}>
                            <tr className="align-top hover:bg-[#f8fbfc] print:break-inside-avoid">
                              <td className="px-3 py-3 font-medium text-neutral-900">{name}</td>
                              <td className="max-w-[14rem] break-all px-3 py-3 text-xs text-neutral-600">
                                {authById[r.partner_id]?.email ?? r.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-neutral-800">
                                {maskIban(pr?.iban ?? null)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-neutral-700">
                                {bic && bic.length > 0 ? bic : "—"}
                              </td>
                              <td className="max-w-[10rem] px-3 py-3 text-xs text-neutral-700">
                                {holder && holder.length > 0 ? holder : "—"}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 tabular-nums font-medium text-neutral-900">
                                {formatProvisionEur(r.einmal_eur)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 tabular-nums font-medium text-neutral-900">
                                {formatProvisionEur(r.monatlich_eur)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 tabular-nums font-bold text-[#0F4F68]">
                                {formatProvisionEur(r.total_eur)}
                              </td>
                              <td className="partner-payout-print-hide px-3 py-3 align-top">
                                <div className="flex min-w-[9rem] flex-col gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingId((id) => (id === r.id ? null : r.id))}
                                    className="min-h-9 rounded-lg border border-[#0F4F68]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                                  >
                                    {isEditing ? "Schließen" : "Bearbeiten"}
                                  </button>
                                  <DeletePayoutReportControl reportId={r.id} />
                                </div>
                              </td>
                            </tr>
                            {isEditing ? (
                              <tr className="partner-payout-print-hide bg-[#fafcfb]">
                                <td colSpan={9} className="px-3 py-4">
                                  <PayoutReportEditPanel row={r} onDone={() => setEditingId(null)} />
                                </td>
                              </tr>
                            ) : null}
                          </Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </>
      )}

      <div className="partner-payout-print-hide mt-10 border-t border-amber-200/90 pt-6">
        <h3 className="text-sm font-bold text-amber-950">Test: Monatsabrechnung</h3>
        <p className="mt-1 text-xs text-amber-950/85">
          Löscht die gespeicherte Abrechnung für den Monat, setzt zugehörige Einmal-Tipps zurück und führt den Lauf
          erneut aus. Nur zum Testen.
        </p>
        <PartnerAdminTestPayoutForm />
      </div>
    </section>
  );
}
