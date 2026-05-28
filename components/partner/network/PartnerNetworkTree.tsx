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

type PyramidNode = {
  key: string;
  partnerCode: string | null;
  /** "sponsor" = Knoten ÜBER dem Viewer, "self" = Viewer, "direct" = direkte Kinder, "indirect" = Enkel etc. */
  kind: "sponsor" | "self" | "direct" | "indirect";
  ownCents: number | null;
  referralCents: number | null;
  depth: number;
  children: PyramidNode[];
};

function transformDescendant(node: PartnerNetworkNode, isDirect: boolean, parentKey: string, idx: number): PyramidNode {
  const key = `${parentKey}/${node.partnerCode ?? "x"}-${idx}`;
  return {
    key,
    partnerCode: node.partnerCode,
    kind: isDirect ? "direct" : "indirect",
    ownCents: isDirect ? node.ownApprovedClosingCommissionCents : null,
    referralCents: isDirect ? node.referralCommissionForCurrentPartnerCents : null,
    depth: node.depth,
    children: node.children.map((c, i) => transformDescendant(c, false, key, i)),
  };
}

function buildPyramid(data: PartnerNetworkTreeResult): PyramidNode {
  const selfKey = `self-${data.rootPartnerCode ?? "me"}`;
  const selfNode: PyramidNode = {
    key: selfKey,
    partnerCode: data.rootPartnerCode,
    kind: "self",
    ownCents: null,
    referralCents: null,
    depth: 0,
    children: data.directChildren.map((c, i) => transformDescendant(c, true, selfKey, i)),
  };
  if (data.sponsor) {
    return {
      key: `sponsor-${data.sponsor.partnerCode ?? "s"}`,
      partnerCode: data.sponsor.partnerCode,
      kind: "sponsor",
      ownCents: null,
      referralCents: null,
      depth: -1,
      children: [selfNode],
    };
  }
  return selfNode;
}

export function PartnerNetworkTree({ data, availablePeriods, onChangePeriod, pendingPeriod }: Props) {
  const totalDirect = data.directChildren.length;
  const totalAll = data.totalNodes;
  const root = buildPyramid(data);

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

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="min-w-full">
          <div className="ahs-tree">
            <ul className="ahs-tree__root">
              <PyramidLi node={root} />
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.7rem] text-neutral-700">
        <LegendDot tone="ahs" label="Sponsor" />
        <LegendDot tone="self" label="Sie" />
        <LegendDot tone="direct" label="Direkt geworben (5 % Werbeprovision)" />
        <LegendDot tone="indirect" label="Indirekt (kein Werbeanspruch)" />
      </div>

      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950">
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

function LegendDot({ tone, label }: { tone: "ahs" | "self" | "direct" | "indirect"; label: string }) {
  const cls =
    tone === "ahs"
      ? "bg-[#0F4F68]"
      : tone === "self"
        ? "bg-[#3DB8C9]"
        : tone === "direct"
          ? "bg-sky-500"
          : "bg-neutral-400";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${cls}`} aria-hidden />
      {label}
    </span>
  );
}

function PyramidLi({ node }: { node: PyramidNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <li>
      <NodeBox node={node} hasChildren={hasChildren} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      {hasChildren && !collapsed ? (
        <ul>
          {node.children.map((c) => (
            <PyramidLi key={c.key} node={c} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function NodeBox({
  node,
  hasChildren,
  collapsed,
  onToggle,
}: {
  node: PyramidNode;
  hasChildren: boolean;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const palette = paletteFor(node.kind);
  const labelKind =
    node.kind === "sponsor"
      ? "Geworben durch"
      : node.kind === "self"
        ? "Sie"
        : node.kind === "direct"
          ? "Direkt geworben"
          : `Indirekt · Ebene ${Math.max(1, node.depth)}`;

  return (
    <div className="ahs-tree__node">
      <div
        className={`min-w-[8.75rem] max-w-[12rem] rounded-xl border px-3 py-2.5 shadow-[0_4px_12px_rgba(15,79,104,0.10)] sm:px-4 sm:py-3 ${palette.box}`}
      >
        <p className={`text-[0.6rem] font-bold uppercase tracking-wide ${palette.label}`}>{labelKind}</p>
        <p className={`mt-1 font-mono text-sm font-semibold uppercase tabular-nums sm:text-base ${palette.code}`}>
          {node.partnerCode ?? "—"}
        </p>
        {node.kind === "direct" ? (
          <div className="mt-2 grid grid-cols-1 gap-1.5">
            <MoneyChip
              label="Eigene Abschlussprov."
              cents={node.ownCents ?? 0}
              tone="emerald"
            />
            <MoneyChip
              label="Ihre 5 %"
              cents={node.referralCents ?? 0}
              tone="sky"
            />
          </div>
        ) : null}
      </div>

      {hasChildren ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Untergeordnete Partner anzeigen" : "Untergeordnete Partner ausblenden"}
          className="mt-1 grid h-6 w-6 place-items-center rounded-full border border-[#0F4F68]/30 bg-white text-[#0F4F68] shadow-sm hover:bg-[#0F4F68]/5"
        >
          <span aria-hidden className="text-base leading-none">
            {collapsed ? "+" : "−"}
          </span>
        </button>
      ) : null}
    </div>
  );
}

function paletteFor(kind: PyramidNode["kind"]): {
  box: string;
  label: string;
  code: string;
} {
  switch (kind) {
    case "sponsor":
      return {
        box: "border-[#0F4F68]/35 bg-[#F2F9FA] ring-1 ring-[#0F4F68]/20",
        label: "text-[#0F4F68]/80",
        code: "text-[#0F4F68]",
      };
    case "self":
      return {
        box: "border-[#3DB8C9]/55 bg-gradient-to-b from-[#E6F5F7] to-white ring-1 ring-[#3DB8C9]/30",
        label: "text-[#0F4F68]/85",
        code: "text-[#0F4F68]",
      };
    case "direct":
      return {
        box: "border-sky-300 bg-sky-50",
        label: "text-sky-900/80",
        code: "text-sky-900",
      };
    case "indirect":
    default:
      return {
        box: "border-neutral-200 bg-neutral-50",
        label: "text-neutral-700",
        code: "text-neutral-800",
      };
  }
}

function MoneyChip({
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
      : "border-sky-200 bg-white text-sky-900";
  return (
    <div className={`rounded-md border ${palette} px-2 py-1`}>
      <p className="text-[0.55rem] font-bold uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-[0.78rem] font-semibold tabular-nums">{formatCentsDe(cents)}</p>
    </div>
  );
}
