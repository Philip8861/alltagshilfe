"use client";

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

export function PartnerStatuslisteTable({ variant, rows, emptyHint, theadClass, columns: cols }: Props) {
  const colCount = visibleColumnCount(variant, cols);
  const showFirmaCol = variant !== "einmal" && cols.firma;

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200/90">
      <table className="min-w-[48rem] w-full text-left text-sm">
        <thead>
          <tr className={`border-b border-neutral-200 text-xs font-semibold uppercase ${theadClass}`}>
            {cols.vorname ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Vorname</th> : null}
            {cols.nachname ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Nachname</th> : null}
            {showFirmaCol ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Firma</th> : null}
            {cols.datum ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Datum</th> : null}
            {cols.status ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Status</th> : null}
            {cols.betrag ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Betrag</th> : null}
            {cols.notiz ? <th className="min-w-[8rem] px-3 py-3 sm:px-4">Notiz</th> : null}
            {cols.archivButton ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Mein Archiv</th> : null}
            {cols.typ ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Typ</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="px-4 py-12 text-center text-neutral-600">
                {emptyHint}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="bg-white hover:bg-neutral-50/80">
                {cols.vorname ? (
                  <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.vorname}</td>
                ) : null}
                {cols.nachname ? (
                  <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.nachname}</td>
                ) : null}
                {showFirmaCol ? (
                  <td className="max-w-[12rem] truncate px-3 py-3 text-neutral-800 sm:max-w-[14rem] sm:px-4">
                    {r.firma || "—"}
                  </td>
                ) : null}
                {cols.datum ? (
                  <td className="whitespace-nowrap px-3 py-3 text-neutral-800 sm:px-4">{r.datum}</td>
                ) : null}
                {cols.status ? (
                  <td className="px-3 py-3 sm:px-4">
                    <span
                      className={`inline-flex items-center justify-center rounded px-2.5 py-0.5 text-center text-xs font-medium ${r.pill.className}`}
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
                    <PartnerOwnArchiveTipButton tipId={r.tipId} isArchived={r.isArchived} />
                  </td>
                ) : null}
                {cols.typ ? (
                  <td className={`px-3 py-3 sm:px-4 ${r.typCellClass}`}>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${r.typeClass}`}>
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
  );
}
