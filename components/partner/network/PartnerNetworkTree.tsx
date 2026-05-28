"use client";

import { useState } from "react";
import { formatCentsDe } from "@/lib/partner/referral-money";
import type { PartnerNetworkNode, PartnerNetworkTreeResult } from "@/lib/partner/network-tree";

type Props = {
  data: PartnerNetworkTreeResult;
  /** Liste auswählbarer periodKeys (vom Server vorbereitet, aktueller zuerst). */
  availablePeriods: { periodKey: string; label: string }[];
  onChangePeriod: (periodKey: string) => void;
  pendingPeriod?: string | null;
};

export function PartnerNetworkTree({ data, availablePeriods, onChangePeriod, pendingPeriod }: Props) {
  const totalDirect = data.directChildren.length;
  const totalAll = data.totalNodes;

  return (
    <section
      aria-labelledby="partner-network-tree-heading"
      className="rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-[0_8px_22px_rgba(15,79,104,0.10)] sm:p-6"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 id="partner-network-tree-heading" className="text-lg font-semibold text-[#0F4F68] sm:text-xl">
            Werbe-Netzwerk
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-700">
            {data.rootPartnerCode ? (
              <>
                Ihr Partner-Code:{" "}
                <span className="font-mono font-semibold text-[#0F4F68]">{data.rootPartnerCode}</span>
                {data.sponsor?.partnerCode ? (
                  <>
                    {" · "}geworben durch{" "}
                    <span className="font-mono font-semibold text-[#0F4F68]">{data.sponsor.partnerCode}</span>
                  </>
                ) : null}
              </>
            ) : (
              "Aus Datenschutzgründen werden im Netzwerk ausschließlich Partner-Codes angezeigt."
            )}
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-1 sm:items-end">
          <label htmlFor="network-period-select" className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">
            Monat
          </label>
          <select
            id="network-period-select"
            value={data.periodKey}
            disabled={Boolean(pendingPeriod)}
            onChange={(e) => onChangePeriod(e.target.value)}
            className="min-w-[12rem] rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-[#0F4F68] outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          >
            {availablePeriods.map((p) => (
              <option key={p.periodKey} value={p.periodKey}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
        <Stat label="Direkt geworben" value={totalDirect.toString()} />
        <Stat label="Gesamtes Netzwerk" value={totalAll.toString()} />
      </div>

      <div className="mt-5">
        {data.directChildren.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#0F4F68]/30 bg-[#FAFBFC] px-4 py-6 text-center text-sm text-neutral-700">
            Sie haben aktuell keine geworbenen Partner. Sobald jemand mit Ihrem Partner-Code angelegt wird,
            erscheint die Person hier.
          </p>
        ) : (
          <ul className="space-y-3" aria-label="Werbe-Netzwerk">
            {data.directChildren.map((node, idx) => (
              <NetworkNodeRow key={`${node.partnerCode ?? "x"}-${idx}`} node={node} />
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950">
        Direkte Werbung: 5 % Werbeprovision auf eigene freigegebene Abschlussprovision der direkt geworbenen
        Partner. Indirekte Partner werden zur Übersicht angezeigt – aus diesen entsteht für Sie keine direkte
        Werbeprovision.
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-[#F8FAFB] px-3 py-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#0F4F68]/80">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums text-[#0F4F68]">{value}</p>
    </div>
  );
}

function NetworkNodeRow({ node }: { node: PartnerNetworkNode }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <li>
      <div
        className={`flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
          node.isDirectReferral
            ? "border-sky-200/80 bg-sky-50/60"
            : "border-neutral-200 bg-neutral-50"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {hasChildren ? (
            <button
              type="button"
              aria-label={open ? "Untergeordnete Partner ausblenden" : "Untergeordnete Partner anzeigen"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="grid h-7 w-7 place-items-center rounded-md border border-neutral-300 bg-white text-[#0F4F68] hover:bg-[#0F4F68]/5"
            >
              <span aria-hidden className="text-lg leading-none">
                {open ? "−" : "+"}
              </span>
            </button>
          ) : (
            <span className="grid h-7 w-7 place-items-center" aria-hidden>
              <span className="block h-2 w-2 rounded-full bg-neutral-400" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-mono text-sm font-semibold uppercase text-[#0F4F68]">
              {node.partnerCode ?? "—"}
            </p>
            <p className="text-xs text-neutral-600">
              {node.isDirectReferral
                ? "Direkt geworben"
                : `Indirekt · Ebene ${node.depth}`}
            </p>
          </div>
        </div>

        {node.isDirectReferral ? (
          <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:gap-3">
            <Money
              label="Eigene Abschlussprovision"
              cents={node.ownApprovedClosingCommissionCents ?? 0}
              tone="emerald"
            />
            <Money
              label="Ihre 5 % Werbeprovision"
              cents={node.referralCommissionForCurrentPartnerCents ?? 0}
              tone="sky"
            />
          </div>
        ) : (
          <p className="rounded-md bg-white px-3 py-2 text-xs text-neutral-700 ring-1 ring-neutral-200">
            Kein direkter Werbeanspruch.
          </p>
        )}
      </div>

      {hasChildren && open ? (
        <ul className="ml-6 mt-2 space-y-2 border-l-2 border-dashed border-[#0F4F68]/20 pl-3 sm:ml-9 sm:pl-4">
          {node.children.map((child, idx) => (
            <NetworkNodeRow key={`${child.partnerCode ?? "x"}-${idx}`} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Money({
  label,
  cents,
  tone,
}: {
  label: string;
  cents: number;
  tone: "emerald" | "sky";
}) {
  const palette =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-sky-200 bg-sky-50 text-sky-900";
  return (
    <div className={`rounded-md border ${palette} px-3 py-2`}>
      <p className="text-[0.6rem] font-bold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums sm:text-base">{formatCentsDe(cents)}</p>
    </div>
  );
}
