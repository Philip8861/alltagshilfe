"use client";

import { useId, useMemo, useState } from "react";

import { PartnerNoteDetails } from "@/components/partner/PartnerNoteDetails";
import { PartnerOwnArchiveTipButton } from "@/components/partner/PartnerOwnArchiveTipButton";
import type { PartnerPortalTableColumns } from "@/lib/partner/portal-preferences";
import type { PartnerStatuslisteRow, StatuslisteVariant } from "@/lib/partner/portal-preferences";

type Props = {
  variant: StatuslisteVariant;
  rows: PartnerStatuslisteRow[];
  emptyHint: string;
  theadClass: string;
  columns: PartnerPortalTableColumns;
  demoMode?: boolean;
};

function visibleColumnCount(variant: StatuslisteVariant, c: PartnerPortalTableColumns): number {
  let n = 0;
  if (c.vorname) n += 1;
  if (c.nachname) n += 1;
  if (variant !== "einmal" && c.firma) n += 1;
  if (c.datum) n += 1;
  if (c.status) n += 1;
  if (c.betrag) n += 1;
  if (c.notiz) n += 1;
  if (c.archivButton) n += 1;
  if (c.typ) n += 1;
  return Math.max(1, n);
}

export function PartnerStatuslisteTable({
  variant,
  rows,
  emptyHint,
  theadClass,
  columns: cols,
  demoMode = false,
}: Props) {
  const filterId = useId();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const statuses = useMemo(() => Array.from(new Set(rows.map((r) => r.pill.label))).sort(), [rows]);
  const filteredRows = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("de-DE");
    return rows.filter((r) => (!status || r.pill.label === status) && (!term ||
      [r.vorname, r.nachname, r.firma, r.datum, r.typ, r.adminNote].join(" ").toLocaleLowerCase("de-DE").includes(term)));
  }, [rows, query, status]);
  const noResults = rows.length > 0 ? "Keine passenden Vermittlungen. Ändern Sie Ihre Suche oder den Statusfilter." : emptyHint;
  const colCount = visibleColumnCount(variant, cols);
  const showFirmaCol = variant !== "einmal" && cols.firma;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={`${filterId}-search`} className="mb-1.5 block text-xs font-semibold text-[#637782]">Vermittlungen durchsuchen</label>
          <input id={`${filterId}-search`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, Firma oder Leistung suchen …" className="min-h-11 w-full rounded-xl border border-[#dce5ea] bg-white px-3 text-sm text-[#183a49] placeholder:text-[#71838c] focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/15" />
        </div>
        <div className="sm:w-52">
          <label htmlFor={`${filterId}-status`} className="mb-1.5 block text-xs font-semibold text-[#637782]">Status</label>
          <select id={`${filterId}-status`} value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-11 w-full rounded-xl border border-[#dce5ea] bg-white px-3 text-sm text-[#183a49]">
            <option value="">Alle Status</option>
            {statuses.map((label) => <option key={label} value={label}>{label}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-3 flex min-h-6 flex-wrap items-center justify-between gap-2 text-xs text-[#637782]">
        <p role="status" aria-live="polite">{filteredRows.length} {filteredRows.length === 1 ? "Eintrag" : "Einträge"}{query || status ? ` von ${rows.length}` : ""}</p>
        {query || status ? <button type="button" onClick={() => { setQuery(""); setStatus(""); }} className="inline-flex min-h-11 items-center font-semibold text-[#0F4F68] underline-offset-4 hover:underline">Filter zurücksetzen</button> : null}
      </div>
      <div className="space-y-3 md:hidden">
        {filteredRows.length === 0 ? <p className="rounded-xl bg-[#f6f8fa] px-5 py-8 text-center text-sm leading-6 text-[#637782]">{noResults}</p> : filteredRows.map((r) => (
          <article key={r.id} className="rounded-2xl border border-[#d7e8ed] bg-gradient-to-br from-white to-[#f5fafb] p-4 shadow-[0_4px_12px_-7px_rgba(15,79,104,0.18)]">
            {cols.vorname || cols.nachname ? <h3 className="break-words font-semibold text-[#183a49]">{[cols.vorname ? r.vorname : "", cols.nachname ? r.nachname : ""].filter(Boolean).join(" ") || "Vermittlung"}</h3> : null}
            {showFirmaCol && r.firma ? <p className="mt-1 break-words text-sm text-[#637782]">{r.firma}</p> : null}
            {cols.status ? <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${r.pill.className}`}>{r.pill.label}</span> : null}
            <dl className="mt-4 space-y-2 text-sm">
              {cols.datum ? <div className="flex justify-between gap-3"><dt className="text-[#637782]">Datum</dt><dd>{r.datum}</dd></div> : null}
              {cols.betrag ? <div className="flex justify-between gap-3"><dt className="text-[#637782]">Betrag</dt><dd className="font-semibold tabular-nums">{r.betrag}</dd></div> : null}
              {cols.typ ? <div className="flex justify-between gap-3"><dt className="text-[#637782]">Leistung</dt><dd className="max-w-[65%] text-right">{r.typ}</dd></div> : null}
            </dl>
            {cols.notiz ? <div className="mt-4 border-t border-[#edf1f4] pt-3"><PartnerNoteDetails tipId={r.tipId} note={r.adminNote} /></div> : null}
            {cols.archivButton && !demoMode ? <div className="mt-3"><PartnerOwnArchiveTipButton tipId={r.tipId} isArchived={r.isArchived} /></div> : null}
          </article>
        ))}
      </div>
      <div className="partner-table-scroll hidden overflow-x-auto rounded-xl border border-[#e0e8ed] md:block" role="region" aria-label="Vermittlungsliste, horizontal scrollbar" tabIndex={0}>
      <table className="min-w-[48rem] w-full text-left text-sm">
        <thead>
          <tr className={`border-b border-neutral-200 text-[11px] font-semibold uppercase tracking-wide ${theadClass}`}>
            {cols.vorname ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Vorname</th> : null}
            {cols.nachname ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Nachname</th> : null}
            {showFirmaCol ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Firma</th> : null}
            {cols.datum ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Datum</th> : null}
            {cols.status ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Status</th> : null}
            {cols.betrag ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Betrag</th> : null}
            {cols.notiz ? <th scope="col" className="min-w-[8rem] px-3 py-3 sm:px-4">Notiz</th> : null}
            {cols.archivButton ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Mein Archiv</th> : null}
            {cols.typ ? <th scope="col" className="whitespace-nowrap px-3 py-3 sm:px-4">Typ</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {filteredRows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="px-4 py-12 text-center text-neutral-600">
                {noResults}
              </td>
            </tr>
          ) : (
            filteredRows.map((r) => (
              <tr key={r.id} className="bg-white hover:bg-neutral-50/80">
                {cols.vorname ? (
                  <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.vorname}</td>
                ) : null}
                {cols.nachname ? (
                  <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.nachname}</td>
                ) : null}
                {showFirmaCol ? (
                  <td title={r.firma || undefined} className="max-w-[12rem] truncate px-3 py-3 text-neutral-800 sm:max-w-[14rem] sm:px-4">
                    {r.firma || "—"}
                  </td>
                ) : null}
                {cols.datum ? (
                  <td className="whitespace-nowrap px-3 py-3 text-neutral-800 sm:px-4">{r.datum}</td>
                ) : null}
                {cols.status ? (
                  <td className="px-3 py-3 sm:px-4">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-center text-xs font-medium ${r.pill.className}`}
                    >
                      {r.pill.label}
                    </span>
                  </td>
                ) : null}
                {cols.betrag ? (
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-neutral-900 sm:px-4">{r.betrag}</td>
                ) : null}
                {cols.notiz ? (
                  <td className="max-w-[14rem] px-3 py-3 align-top text-neutral-800 sm:px-4">
                    <PartnerNoteDetails tipId={r.tipId} note={r.adminNote} />
                  </td>
                ) : null}
                {cols.archivButton ? (
                  <td className="px-3 py-3 align-top sm:px-4">
                    {demoMode ? (
                      <span className="text-xs text-neutral-400" title="Nur im echten Partnerportal verfügbar">
                        —
                      </span>
                    ) : (
                      <PartnerOwnArchiveTipButton tipId={r.tipId} isArchived={r.isArchived} />
                    )}
                  </td>
                ) : null}
                {cols.typ ? (
                  <td className="px-3 py-3 sm:px-4">
                    <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${r.typeClass}`}>
                      {r.typ}
                    </span>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
