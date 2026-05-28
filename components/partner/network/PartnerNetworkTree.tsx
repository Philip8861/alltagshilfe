"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatCentsDe } from "@/lib/partner/referral-money";
import type { PartnerNetworkNode, PartnerNetworkTreeResult } from "@/lib/partner/network-tree";
import { PartnerNetworkTreeViewport } from "@/components/partner/network/PartnerNetworkTreeViewport";
import { usePartnerNetworkViewport } from "@/components/partner/network/PartnerNetworkTreeViewportContext";

type Props = {
  data: PartnerNetworkTreeResult;
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

function useIsMobileSm() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

const INITIAL_VIEW_SCALE = 0.9;

export function PartnerNetworkTree({ data }: Props) {
  const isMobile = useIsMobileSm();
  const totalDirect = data.directChildren.length;
  const totalAll = data.totalNodes;
  const root = buildPyramid(data);
  const hasNetwork = totalDirect > 0 || data.sponsor?.partnerCode;

  return (
    <section aria-labelledby="partner-network-tree-heading" className="partner-dash-animate w-full">
      <NetworkTopBar
        rootPartnerCode={data.rootPartnerCode}
        sponsorCode={data.sponsor?.partnerCode ?? null}
        totalDirect={totalDirect}
        totalAll={totalAll}
      />

      <div className="relative px-0 pb-2 pt-1 sm:pb-3 sm:pt-2">
        <div className="relative motion-safe:animate-partner-network-tree-in">
          {hasNetwork ? (
            <div className="-mx-2 w-[calc(100%+1rem)] sm:-mx-4 sm:w-[calc(100%+2rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
              <PartnerNetworkTreeViewport
                isMobile={isMobile}
                initialViewScale={INITIAL_VIEW_SCALE}
                layoutKey={`${totalAll}-${data.rootPartnerCode ?? ""}-${isMobile ? "m" : "d"}`}
              >
                <div className="px-1 py-2 sm:px-2 sm:py-3">
                  <div className="ahs-tree">
                    <ul className="ahs-tree__root">
                      <PyramidLi node={root} isMobile={isMobile} />
                    </ul>
                  </div>
                </div>
              </PartnerNetworkTreeViewport>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#0F4F68]/20 bg-white/50 px-6 py-12 text-center backdrop-blur-[2px]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68]/10 text-[#0F4F68] motion-safe:animate-partner-soft-float">
                <NetworkIcon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-semibold text-[#0F4F68]">Noch kein Werbe-Netzwerk</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
                Sobald Partner mit Ihrem Code angelegt werden, erscheinen sie hier in der Pyramiden-Struktur.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NetworkTopBar({
  rootPartnerCode,
  sponsorCode,
  totalDirect,
  totalAll,
}: {
  rootPartnerCode: string | null;
  sponsorCode: string | null;
  totalDirect: number;
  totalAll: number;
}) {
  return (
    <div className="px-0 py-3.5 sm:py-4">
      <h2 id="partner-network-tree-heading" className="sr-only">
        Werbe-Netzwerk
      </h2>
      <ul className="mx-auto flex max-w-4xl flex-wrap items-stretch justify-center gap-2 sm:gap-3">
        <TopBarStat
          label="Ihr Code"
          value={rootPartnerCode ?? "—"}
          mono
          tone="self"
          delayMs={80}
        />
        {sponsorCode ? (
          <TopBarStat label="Geworben von" value={sponsorCode} mono tone="sponsor" delayMs={160} />
        ) : null}
        <TopBarStat label="Direkt geworben" value={totalDirect} tone="direct" delayMs={240} count />
        <TopBarStat label="Gesamtes Netzwerk" value={totalAll} tone="network" delayMs={320} count />
      </ul>
    </div>
  );
}

function TopBarStat({
  label,
  value,
  mono = false,
  count = false,
  tone,
  delayMs,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
  count?: boolean;
  tone: "self" | "sponsor" | "direct" | "network";
  delayMs: number;
}) {
  const toneStyles = {
    self: "border-[#3DB8C9]/35 bg-white/90 bg-gradient-to-b from-[#E8F6F8]/90 to-white ring-1 ring-[#3DB8C9]/15",
    sponsor: "border-[#0F4F68]/18 bg-white/90 bg-gradient-to-b from-[#F2F9FA]/90 to-white",
    direct: "border-sky-200/80 bg-white/90 bg-gradient-to-b from-sky-50/80 to-white",
    network: "border-[#0F4F68]/15 bg-white/90 bg-gradient-to-b from-white to-[#F2F9FA]/80",
  } as const;

  const accentBar = {
    self: "from-[#0F4F68] to-[#3DB8C9]",
    sponsor: "from-[#0F4F68] to-[#0c3d52]",
    direct: "from-sky-400 to-sky-600",
    network: "from-[#0F4F68]/70 to-[#3DB8C9]/80",
  } as const;

  return (
    <li
      className={`partner-dash-animate relative min-w-[7.5rem] flex-1 overflow-hidden rounded-xl border px-3 py-2.5 text-center shadow-sm sm:min-w-[8.5rem] sm:px-4 sm:py-3 ${toneStyles[tone]}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className={`absolute inset-x-3 top-0 h-0.5 rounded-full bg-gradient-to-r ${accentBar[tone]} opacity-80`}
        aria-hidden
      />
      <p className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-[#0F4F68]/70 sm:text-[0.6rem]">{label}</p>
      <p
        className={`mt-1 font-semibold text-[#0F4F68] ${mono ? "partner-code-settle font-mono text-sm uppercase tracking-wide sm:text-base" : "text-xl tabular-nums sm:text-2xl"}`}
      >
        {count && typeof value === "number" ? <AnimatedCount value={value} /> : value}
      </p>
    </li>
  );
}

function AnimatedCount({ value, className = "" }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setDisplay(0);
    setHighlight(false);

    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const start = performance.now();
    const durationMs = 900;

    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(value * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
        setHighlight(true);
        timeout = setTimeout(() => setHighlight(false), 850);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [value]);

  return (
    <span
      className={[
        "tabular-nums transition-[text-shadow,color] duration-300",
        highlight ? "partner-euro-highlight" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {display}
    </span>
  );
}

function shouldCollapseOnMobile(node: PyramidNode): boolean {
  return (node.kind === "self" || node.kind === "direct") && node.children.length > 0;
}

function PyramidLi({ node, isMobile }: { node: PyramidNode; isMobile: boolean }) {
  const [collapsed, setCollapsed] = useState(() => isMobile && shouldCollapseOnMobile(node));
  const hasChildren = node.children.length > 0;

  useEffect(() => {
    if (isMobile && shouldCollapseOnMobile(node)) {
      setCollapsed(true);
    } else if (!isMobile) {
      setCollapsed(false);
    }
  }, [isMobile, node.key, node.kind, node.children.length]);

  return (
    <li className="ahs-tree__branch">
      <NodeBox node={node} hasChildren={hasChildren} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      {hasChildren && !collapsed ? (
        <>
          <div className="ahs-tree__stem" aria-hidden />
          <ul className="ahs-tree__children">
            {node.children.map((c) => (
              <PyramidLi key={c.key} node={c} isMobile={isMobile} />
            ))}
          </ul>
        </>
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
  const toggleRef = useRef<HTMLButtonElement>(null);
  const viewport = usePartnerNetworkViewport();
  const userToggledRef = useRef(false);
  const meta = nodeMeta(node);
  const compact = node.kind === "indirect";
  const cardWidth = compact
    ? "min-w-[6.75rem] max-w-[9rem] sm:min-w-[7.5rem] sm:max-w-[10rem]"
    : node.kind === "direct"
      ? "min-w-[10rem] max-w-[13.5rem] sm:min-w-[10.5rem]"
      : "min-w-[8rem] max-w-[12rem] sm:min-w-[8.5rem]";

  const handleToggle = () => {
    userToggledRef.current = true;
    onToggle();
  };

  useLayoutEffect(() => {
    if (!userToggledRef.current) return;
    userToggledRef.current = false;
    viewport?.centerOnElement(toggleRef.current);
  }, [collapsed, viewport]);

  return (
    <div
      className="ahs-tree__node"
      data-network-focus={node.kind === "sponsor" || node.kind === "self" || node.kind === "direct" ? "true" : undefined}
      data-network-focus-top={node.kind === "sponsor" || node.kind === "self" ? "true" : undefined}
    >
      <article
        className={`group relative overflow-hidden rounded-xl border transition-shadow duration-200 hover:shadow-lg sm:rounded-2xl ${cardWidth} ${meta.card}`}
      >
        <div className={`h-1 w-full ${meta.stripe}`} aria-hidden />
        <div className={compact ? "px-2.5 py-2 sm:px-3 sm:py-2.5" : "px-3 py-2.5 sm:px-4 sm:py-3.5"}>
          <div className={`flex items-start ${compact ? "gap-2" : "gap-2.5"}`}>
            <div
              className={`flex shrink-0 items-center justify-center rounded-lg ${compact ? "h-7 w-7" : "h-9 w-9"} ${meta.iconWrap}`}
              aria-hidden
            >
              <NodeIcon kind={node.kind} compact={compact} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`font-bold uppercase tracking-[0.08em] ${compact ? "text-[0.55rem]" : "text-[0.6rem]"} ${meta.label}`}>
                {meta.title}
              </p>
              <p
                className={`mt-0.5 break-all font-mono font-semibold uppercase leading-tight tracking-wide ${compact ? "text-xs" : "text-sm sm:text-base"} ${meta.code}`}
              >
                {node.partnerCode ?? "—"}
              </p>
            </div>
          </div>

          {node.kind === "direct" ? (
            <div className="mt-2.5 space-y-1.5 border-t border-sky-200/60 pt-2 sm:mt-3 sm:pt-2.5">
              <MoneyRow label="Eigene Abschlussprov." shortLabel="Eigene Prov." cents={node.ownCents ?? 0} tone="emerald" />
              <MoneyRow label="Ihre Werbeprov." shortLabel="Werbeprov." cents={node.referralCents ?? 0} tone="sky" />
            </div>
          ) : null}
        </div>
      </article>

      {hasChildren ? (
        <button
          ref={toggleRef}
          type="button"
          data-no-pan
          onClick={handleToggle}
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
  shortLabel,
  cents,
  tone,
}: {
  label: string;
  shortLabel: string;
  cents: number;
  tone: "emerald" | "sky";
}) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-50/90 text-emerald-900 ring-emerald-200/70"
      : "bg-sky-50/90 text-sky-900 ring-sky-200/70";
  return (
    <div className={`flex items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 ring-1 sm:gap-2 ${cls}`}>
      <span className="text-[0.58rem] font-bold uppercase leading-tight tracking-wide opacity-85 sm:hidden">
        {shortLabel}
      </span>
      <span className="hidden text-[0.58rem] font-bold uppercase leading-tight tracking-wide opacity-85 sm:inline">
        {label}
      </span>
      <span className="shrink-0 text-[0.7rem] font-semibold tabular-nums sm:text-xs">{formatCentsDe(cents)}</span>
    </div>
  );
}

function NodeIcon({ kind, compact = false }: { kind: PyramidNode["kind"]; compact?: boolean }) {
  const size = compact ? 14 : 18;
  if (kind === "self") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-1a6 6 0 0112 0v1" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "sponsor") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l2.5 7.5H22l-6 4.5 2.5 7.5L12 18l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 3z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "direct") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5V11z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
