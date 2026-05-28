"use client";

import { useState } from "react";
import { formatCentsDe } from "@/lib/partner/referral-money";
import type { PartnerNetworkNode, PartnerNetworkTreeResult } from "@/lib/partner/network-tree";

type Props = {
  data: PartnerNetworkTreeResult;
  availablePeriods: { periodKey: string; label: string }[];
  onChangePeriod: (periodKey: string) => void;
  pendingPeriod?: string | null;
};

type PyramidNode = {
  key: string;
  partnerCode: string | null;
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
  const hasNetwork = totalDirect > 0 || data.sponsor?.partnerCode;

  return (
    <section
      aria-labelledby="partner-network-tree-heading"
      className="partner-dash-animate overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_10px_28px_-14px_rgba(15,79,104,0.28)] ring-1 ring-[#0F4F68]/8"
    >
      <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]/35" aria-hidden />

      <div className="border-b border-[#0F4F68]/10 bg-gradient-to-br from-[#F2F9FA] via-white to-white px-5 py-5 sm:px-6 sm:py-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/75">
              Strukturübersicht
            </p>
            <h2 id="partner-network-tree-heading" className="mt-1 text-xl font-semibold text-[#0F4F68] sm:text-2xl">
              Werbe-Netzwerk
            </h2>
            <div className="mt-2 h-1 w-full max-w-[8rem] overflow-hidden rounded-full bg-[#0F4F68]/15">
              <div
                className="h-full w-full origin-left scale-x-0 animate-partner-bar-fill rounded-full bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9]"
                style={{ animationDelay: "0.12s" }}
                aria-hidden
              />
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">
              {data.rootPartnerCode ? (
                <>
                  Ihr Code{" "}
                  <span className="font-mono font-semibold text-[#0F4F68]">{data.rootPartnerCode}</span>
                  {data.sponsor?.partnerCode ? (
                    <>
                      {" · "}geworben durch{" "}
                      <span className="font-mono font-semibold text-[#0F4F68]">{data.sponsor.partnerCode}</span>
                    </>
                  ) : null}
                </>
              ) : (
                "Es werden ausschließlich Partner-Codes angezeigt — keine personenbezogenen Daten."
              )}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-1 sm:items-end">
            <label
              htmlFor="network-period-select"
              className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/80"
            >
              Monat
            </label>
            <select
              id="network-period-select"
              value={data.periodKey}
              disabled={Boolean(pendingPeriod)}
              onChange={(e) => onChangePeriod(e.target.value)}
              className="min-w-[12rem] rounded-xl border border-[#0F4F68]/15 bg-white px-3 py-2.5 text-sm font-medium text-[#0F4F68] shadow-sm outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
            >
              {availablePeriods.map((p) => (
                <option key={p.periodKey} value={p.periodKey}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-lg">
          <StatCard label="Direkt geworben" value={totalDirect.toString()} accent="teal" />
          <StatCard label="Gesamtes Netzwerk" value={totalAll.toString()} accent="sky" />
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        {hasNetwork ? (
          <div className="overflow-x-auto pb-1">
            <div className="ahs-tree__canvas min-w-min px-2 sm:px-4">
              <div className="ahs-tree">
                <ul className="ahs-tree__root">
                  <PyramidLi node={root} />
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#0F4F68]/25 bg-[#F2F9FA]/60 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68]/10 text-[#0F4F68]">
              <NetworkIcon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#0F4F68]">Noch kein Werbe-Netzwerk</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
              Sobald Partner mit Ihrem Code angelegt werden, erscheinen sie hier in der Pyramiden-Struktur.
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <LegendPill tone="sponsor" label="Geworben durch" />
          <LegendPill tone="self" label="Sie" />
          <LegendPill tone="direct" label="Direkt · 5 %" />
          <LegendPill tone="indirect" label="Indirekt" />
        </div>

        <p className="mt-4 rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-[#fff8dc] to-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950">
          Direkte Werbung: 5&nbsp;% Werbeprovision auf die eigene freigegebene Abschlussprovision direkt geworbener
          Partner. Indirekte Partner sind nur zur Übersicht sichtbar — ohne direkten Werbeanspruch.
        </p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "teal" | "sky";
}) {
  const ring = accent === "teal" ? "border-[#0F4F68]/15 bg-white" : "border-sky-200/70 bg-sky-50/40";
  return (
    <div className={`rounded-xl border px-4 py-3 shadow-sm ${ring}`}>
      <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/75">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F4F68]">{value}</p>
    </div>
  );
}

function LegendPill({ tone, label }: { tone: "sponsor" | "self" | "direct" | "indirect"; label: string }) {
  const styles: Record<typeof tone, string> = {
    sponsor: "border-[#0F4F68]/25 bg-[#F2F9FA] text-[#0F4F68]",
    self: "border-[#3DB8C9]/40 bg-gradient-to-r from-[#E6F5F7] to-white text-[#0F4F68] ring-1 ring-[#3DB8C9]/20",
    direct: "border-sky-300/80 bg-sky-50 text-sky-900",
    indirect: "border-neutral-200 bg-neutral-50 text-neutral-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide ${styles[tone]}`}
    >
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
  const meta = nodeMeta(node);

  return (
    <div className="ahs-tree__node">
      <article
        className={`group relative min-w-[9.5rem] max-w-[13.5rem] overflow-hidden rounded-2xl border transition-shadow duration-200 hover:shadow-lg ${meta.card}`}
      >
        <div className={`h-1 w-full ${meta.stripe}`} aria-hidden />
        <div className="px-3.5 py-3 sm:px-4 sm:py-3.5">
          <div className="flex items-start gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.iconWrap}`}
              aria-hidden
            >
              <NodeIcon kind={node.kind} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-[0.6rem] font-bold uppercase tracking-[0.08em] ${meta.label}`}>{meta.title}</p>
              <p className={`mt-0.5 truncate font-mono text-sm font-semibold uppercase tracking-wide sm:text-base ${meta.code}`}>
                {node.partnerCode ?? "—"}
              </p>
            </div>
          </div>

          {node.kind === "direct" ? (
            <div className="mt-3 space-y-1.5 border-t border-sky-200/60 pt-2.5">
              <MoneyRow label="Eigene Abschlussprov." cents={node.ownCents ?? 0} tone="emerald" />
              <MoneyRow label="Ihre 5 % Werbeprov." cents={node.referralCents ?? 0} tone="sky" />
            </div>
          ) : node.kind === "indirect" ? (
            <p className="mt-2 rounded-md bg-white/70 px-2 py-1 text-[0.65rem] leading-snug text-neutral-600 ring-1 ring-neutral-200/80">
              Kein direkter Werbeanspruch
            </p>
          ) : null}
        </div>
      </article>

      {hasChildren ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Untergeordnete Partner anzeigen" : "Untergeordnete Partner ausblenden"}
          className="mt-1.5 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full border border-[#0F4F68]/20 bg-white px-2 text-xs font-bold text-[#0F4F68] shadow-sm transition hover:border-[#0F4F68]/35 hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-1"
        >
          {collapsed ? "+" : "−"}
        </button>
      ) : null}
    </div>
  );
}

function nodeMeta(node: PyramidNode) {
  switch (node.kind) {
    case "sponsor":
      return {
        title: "Geworben durch",
        card: "border-[#0F4F68]/20 bg-white shadow-[0_6px_18px_rgba(15,79,104,0.12)] ring-1 ring-[#0F4F68]/10",
        stripe: "bg-gradient-to-r from-[#0F4F68] to-[#0c3d52]",
        iconWrap: "bg-[#0F4F68]/10 text-[#0F4F68]",
        label: "text-[#0F4F68]/75",
        code: "text-[#0F4F68]",
      };
    case "self":
      return {
        title: "Sie · Ihre Position",
        card: "border-[#3DB8C9]/45 bg-gradient-to-b from-[#E8F6F8] via-white to-white shadow-[0_10px_26px_rgba(61,184,201,0.22)] ring-2 ring-[#3DB8C9]/25",
        stripe: "bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]",
        iconWrap: "bg-gradient-to-br from-[#0F4F68] to-[#3DB8C9] text-white shadow-sm",
        label: "text-[#0F4F68]",
        code: "text-[#0F4F68]",
      };
    case "direct":
      return {
        title: "Direkt geworben",
        card: "border-sky-200/90 bg-gradient-to-b from-sky-50/90 to-white shadow-[0_6px_16px_rgba(14,165,233,0.12)]",
        stripe: "bg-gradient-to-r from-sky-400 to-sky-600",
        iconWrap: "bg-sky-100 text-sky-800",
        label: "text-sky-800/80",
        code: "text-sky-950",
      };
    case "indirect":
    default:
      return {
        title: `Indirekt · Ebene ${Math.max(1, node.depth)}`,
        card: "border-neutral-200/90 bg-gradient-to-b from-neutral-50 to-white shadow-sm",
        stripe: "bg-neutral-300",
        iconWrap: "bg-neutral-100 text-neutral-600",
        label: "text-neutral-600",
        code: "text-neutral-800",
      };
  }
}

function MoneyRow({
  label,
  cents,
  tone,
}: {
  label: string;
  cents: number;
  tone: "emerald" | "sky";
}) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-50/90 text-emerald-900 ring-emerald-200/70"
      : "bg-sky-50/90 text-sky-900 ring-sky-200/70";
  return (
    <div className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 ring-1 ${cls}`}>
      <span className="text-[0.58rem] font-bold uppercase leading-tight tracking-wide opacity-85">{label}</span>
      <span className="shrink-0 text-xs font-semibold tabular-nums">{formatCentsDe(cents)}</span>
    </div>
  );
}

function NodeIcon({ kind }: { kind: PyramidNode["kind"] }) {
  if (kind === "self") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-1a6 6 0 0112 0v1" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "sponsor") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l2.5 7.5H22l-6 4.5 2.5 7.5L12 18l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 3z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "direct") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5V11z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
    </svg>
  );
}

function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v4M12 11l-5 6M12 11l5 6" strokeLinecap="round" />
    </svg>
  );
}
