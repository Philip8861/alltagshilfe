"use client";

import "./partner-network-tree.css";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PartnerNetworkTreeViewport } from "@/components/partner/network/PartnerNetworkTreeViewport";
import { PartnerNetworkTreeLayoutContext, usePartnerNetworkTreeLayout } from "@/components/partner/network/PartnerNetworkTreeLayoutContext";
import { usePartnerNetworkViewport } from "@/components/partner/network/PartnerNetworkTreeViewportContext";
import {
  getDemoAvatarGradient,
  getDemoAvatarInitials,
  getDemoPartnerAvatarUrl,
} from "@/lib/partner/partner-demo-avatars";
import { resolveNetworkTreeCollisions } from "@/lib/partner/partner-network-tree-layout";
import { formatCentsDe } from "@/lib/partner/referral-money";
import type { PartnerNetworkNode, PartnerNetworkTreeResult } from "@/lib/partner/network-tree";

export type PartnerNetworkViewer = {
  displayName: string;
  partnerCode: string | null;
  avatarUrl?: string | null;
  isActive?: boolean;
};

type Props = {
  data: PartnerNetworkTreeResult;
  viewer: PartnerNetworkViewer;
  layoutKeyPrefix?: string;
  headingId?: string;
  srHeading?: string;
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

const INITIAL_VIEW_SCALE = 0.88;

function transformDescendant(node: PartnerNetworkNode, isDirect: boolean, parentKey: string, idx: number): PyramidNode {
  const key = `${parentKey}/${node.partnerCode ?? "x"}-${idx}`;
  return {
    key,
    partnerCode: node.partnerCode,
    kind: isDirect ? "direct" : "indirect",
    ownCents: node.ownApprovedClosingCommissionCents,
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
    ownCents: data.rootOwnApprovedClosingCommissionCents ?? null,
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

export function PartnerNetworkPremium({
  data,
  viewer,
  layoutKeyPrefix = "",
  headingId = "partner-network-heading",
  srHeading = "Werbe-Netzwerk",
}: Props) {
  const isMobile = useIsMobileSm();
  const totalDirect = data.directChildren.length;
  const totalAll = data.totalNodes;
  const root = useMemo(() => buildPyramid(data), [data]);
  const rootCode = data.rootPartnerCode ?? viewer.partnerCode ?? "—";
  const sponsorCode = data.sponsor?.partnerCode ?? null;
  const hasNetwork = totalDirect > 0 || Boolean(sponsorCode);
  const layoutPrefix = layoutKeyPrefix ? `${layoutKeyPrefix}-` : "";
  const useDemoAvatars = layoutKeyPrefix === "demo";

  return (
    <section aria-labelledby={headingId} className="partner-dash-animate w-full">
      <h2 id={headingId} className="sr-only">
        {srHeading}
      </h2>

      <NetworkProfileHeader viewer={viewer} code={rootCode} />

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <DemoKpiCard label="Ihr Code" value={rootCode} accent="teal" icon={<IconQr />} mono />
        {sponsorCode ? (
          <DemoKpiCard
            label="Geworben von"
            value={sponsorCode}
            accent="blue"
            icon={<IconUsers />}
            mono
          />
        ) : null}
        <DemoKpiCard
          label="Direkt geworben"
          value={String(totalDirect)}
          accent="green"
          icon={<IconUserPlus />}
        />
        <DemoKpiCard
          label="Gesamtes Netzwerk"
          value={String(totalAll)}
          accent="violet"
          icon={<IconNetwork />}
        />
      </ul>

      <div className="relative mt-5 sm:mt-6">
        {hasNetwork ? (
          <div className="-mx-2 w-[calc(100%+1rem)] sm:-mx-4 sm:w-[calc(100%+2rem)]">
            <PartnerNetworkTreeViewport
              isMobile={isMobile}
              initialViewScale={INITIAL_VIEW_SCALE}
              layoutKey={`${layoutPrefix}${totalAll}-${rootCode}-${isMobile ? "m" : "d"}`}
            >
              <PartnerNetworkTreeRoot
                root={root}
                viewer={viewer}
                isMobile={isMobile}
                useDemoAvatars={useDemoAvatars}
              />
            </PartnerNetworkTreeViewport>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#0F4F68]/20 bg-white/80 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68]/10 text-[#0F4F68] [&_svg]:h-6 [&_svg]:w-6">
              <IconNetwork />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#0F4F68]">Noch kein Werbe-Netzwerk</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
              Sobald Partner mit Ihrem Code angelegt werden, erscheinen sie hier in der Pyramiden-Struktur.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function PartnerNetworkTreeRoot({
  root,
  viewer,
  isMobile,
  useDemoAvatars,
}: {
  root: PyramidNode;
  viewer: PartnerNetworkViewer;
  isMobile: boolean;
  useDemoAvatars: boolean;
}) {
  const treeRef = useRef<HTMLDivElement>(null);
  const [layoutTick, setLayoutTick] = useState(0);
  const requestLayout = useCallback(() => setLayoutTick((t) => t + 1), []);

  useLayoutEffect(() => {
    if (isMobile || !treeRef.current) return;
    const el = treeRef.current;
    const run = () => resolveNetworkTreeCollisions(el);
    run();
    const frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [isMobile, root, layoutTick]);

  return (
    <PartnerNetworkTreeLayoutContext.Provider value={requestLayout}>
      <div className="px-2 py-2 sm:px-4 sm:py-3">
        <div ref={treeRef} className="partner-network-tree">
          <ul className="partner-network-tree__root">
            <NetworkTreeBranch node={root} viewer={viewer} isMobile={isMobile} useDemoAvatars={useDemoAvatars} />
          </ul>
        </div>
      </div>
    </PartnerNetworkTreeLayoutContext.Provider>
  );
}

function NetworkProfileHeader({ viewer, code }: { viewer: PartnerNetworkViewer; code: string }) {
  const showActive = viewer.isActive !== false;

  return (
    <header className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white px-4 py-3.5 shadow-[0_2px_12px_-6px_rgba(15,79,104,0.18)] sm:gap-5 sm:px-5">
      <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
        <NetworkAvatar
          partnerCode={viewer.partnerCode}
          displayName={viewer.displayName}
          size="profile"
          ring
          imageSrc={viewer.avatarUrl ?? undefined}
        />
        {showActive ? (
          <span
            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
            aria-hidden
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <p className="text-lg font-bold leading-tight text-slate-900 sm:text-xl">{viewer.displayName}</p>
          <span className="rounded-md bg-[#E8F6F8] px-2 py-0.5 font-mono text-xs font-semibold tracking-wide text-[#0F4F68]">
            {code}
          </span>
        </div>
        {showActive ? (
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Aktiv
          </span>
        ) : null}
      </div>
    </header>
  );
}

function DemoKpiCard({
  label,
  value,
  accent,
  icon,
  mono = false,
}: {
  label: string;
  value: string;
  accent: "teal" | "blue" | "green" | "violet";
  icon: ReactNode;
  mono?: boolean;
}) {
  const styles = {
    teal: { icon: "bg-[#E8F6F8] text-[#0F4F68]", value: "text-[#0F4F68]" },
    blue: { icon: "bg-sky-50 text-sky-700", value: "text-sky-800" },
    green: { icon: "bg-emerald-50 text-emerald-700", value: "text-emerald-700" },
    violet: { icon: "bg-violet-50 text-violet-700", value: "text-violet-700" },
  } as const;

  const s = styles[accent];

  return (
    <li className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_2px_12px_-6px_rgba(15,79,104,0.18)] transition-shadow duration-200 hover:shadow-[0_10px_28px_-12px_rgba(15,79,104,0.25)] sm:gap-4 sm:p-5">
      <KpiIconSlot className={s.icon}>{icon}</KpiIconSlot>
      <div className="min-w-0 flex-1">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <p
          className={`mt-0.5 truncate text-2xl font-bold tabular-nums sm:text-[1.65rem] ${mono ? "font-mono uppercase tracking-wide" : ""} ${s.value}`}
        >
          {value}
        </p>
      </div>
    </li>
  );
}

function NetworkAvatar({
  partnerCode,
  displayName,
  size = "md",
  imageSrc,
  ring = false,
}: {
  partnerCode: string | null;
  displayName?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "profile";
  imageSrc?: string;
  ring?: boolean;
}) {
  const dim =
    size === "profile"
      ? "h-14 w-14 text-base sm:h-16 sm:w-16"
      : size === "xl"
      ? "h-14 w-14 text-base"
      : size === "lg"
        ? "h-12 w-12 text-sm"
        : size === "md"
          ? "h-10 w-10 text-xs"
          : "h-9 w-9 text-[0.7rem]";
  const ringCls = ring ? "ring-2 ring-[#3DB8C9]/35 ring-offset-2 ring-offset-white" : "";
  const initials = getDemoAvatarInitials(partnerCode, displayName);
  const gradient = getDemoAvatarGradient(partnerCode);

  if (imageSrc) {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-full ${dim} ${ringCls}`}>
        <Image src={imageSrc} alt="" fill className="object-cover" sizes="56px" unoptimized />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold uppercase tracking-tight text-white shadow-[inset_0_-2px_6px_rgba(0,0,0,0.12)] ${gradient} ${dim} ${ringCls}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function CommissionPill({ label, cents, tone }: { label: string; cents: number; tone: "green" | "blue" }) {
  const cls =
    tone === "green"
      ? "border-emerald-100 bg-emerald-50/90 text-emerald-900"
      : "border-sky-100 bg-sky-50/90 text-sky-900";
  return (
    <div className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${cls}`}>
      <span className="text-[0.58rem] font-semibold uppercase leading-tight tracking-wide opacity-75">{label}</span>
      <span className="shrink-0 text-[0.8rem] font-bold tabular-nums">{formatCentsDe(cents)}</span>
    </div>
  );
}

function TreeConnector({
  collapsed,
  onToggle,
  expanded,
}: {
  collapsed: boolean;
  onToggle: () => void;
  expanded: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const viewport = usePartnerNetworkViewport();
  const requestTreeLayout = usePartnerNetworkTreeLayout();
  const userToggledRef = useRef(false);

  const handleClick = () => {
    userToggledRef.current = true;
    onToggle();
  };

  useLayoutEffect(() => {
    if (!userToggledRef.current) return;
    userToggledRef.current = false;
    requestTreeLayout?.();
    viewport?.centerOnElement(ref.current);
  }, [collapsed, viewport, requestTreeLayout]);

  return (
    <button
      ref={ref}
      type="button"
      data-no-pan
      onClick={handleClick}
      aria-expanded={expanded}
      aria-label={collapsed ? "Untergeordnete Partner anzeigen" : "Untergeordnete Partner ausblenden"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/90 bg-white text-[#0F4F68] shadow-sm transition hover:border-[#3DB8C9]/40 hover:bg-slate-50 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DB8C9]"
    >
      {collapsed ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M5 12h14" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function shouldCollapseOnMobile(node: PyramidNode): boolean {
  return (node.kind === "self" || node.kind === "direct") && node.children.length > 0;
}

function NetworkTreeBranch({
  node,
  viewer,
  isMobile,
  useDemoAvatars,
}: {
  node: PyramidNode;
  viewer: PartnerNetworkViewer;
  isMobile: boolean;
  useDemoAvatars: boolean;
}) {
  const [collapsed, setCollapsed] = useState(() => isMobile && shouldCollapseOnMobile(node));
  const hasChildren = node.children.length > 0;
  const requestTreeLayout = usePartnerNetworkTreeLayout();

  useEffect(() => {
    if (isMobile && shouldCollapseOnMobile(node)) {
      setCollapsed(true);
    } else if (!isMobile) {
      setCollapsed(false);
    }
  }, [isMobile, node]);

  useLayoutEffect(() => {
    if (!isMobile) requestTreeLayout?.();
  }, [collapsed, isMobile, requestTreeLayout]);

  return (
    <li className="partner-network-tree__branch">
      <div className="partner-network-tree__node-stack">
        <NetworkTreeNodeCard node={node} viewer={viewer} useDemoAvatars={useDemoAvatars} />
        {hasChildren ? (
          <TreeConnector collapsed={collapsed} expanded={!collapsed} onToggle={() => setCollapsed((v) => !v)} />
        ) : null}
        {hasChildren && !collapsed ? <div className="partner-network-tree__stem" aria-hidden /> : null}
      </div>
      {hasChildren && !collapsed ? (
        <ul className="partner-network-tree__children">
          {node.children.map((c) => (
            <NetworkTreeBranch key={c.key} node={c} viewer={viewer} isMobile={isMobile} useDemoAvatars={useDemoAvatars} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function NetworkTreeNodeCard({
  node,
  viewer,
  useDemoAvatars,
}: {
  node: PyramidNode;
  viewer: PartnerNetworkViewer;
  useDemoAvatars: boolean;
}) {
  const hasProvision = node.ownCents != null && node.ownCents > 0;
  const compact = node.kind === "indirect" && !hasProvision;
  const isSelf = node.kind === "self";
  const isSponsor = node.kind === "sponsor";
  const isDirect = node.kind === "direct";

  const cardBase =
    "relative shrink-0 overflow-hidden rounded-2xl border bg-white transition-shadow duration-200 hover:shadow-lg";
  const width = isSelf
    ? "w-[16.5rem]"
    : compact
      ? "w-[10.5rem]"
      : isDirect || hasProvision
        ? "w-[14rem]"
        : "w-[12.5rem]";
  const nodeAvatarUrl = useDemoAvatars ? getDemoPartnerAvatarUrl(node.partnerCode) : null;

  let cardCls = `${cardBase} ${width} border-slate-200/60 shadow-[0_3px_14px_-6px_rgba(15,79,104,0.16)]`;
  if (isSelf) {
    cardCls = `${cardBase} ${width} border-2 border-[#3DB8C9]/55 shadow-[0_0_0_4px_rgba(61,184,201,0.12),0_20px_46px_-16px_rgba(15,79,104,0.32)]`;
  } else if (isSponsor) {
    cardCls = `${cardBase} ${width} border-sky-100 shadow-[0_8px_26px_-12px_rgba(15,79,104,0.18)]`;
  }

  const label = isSponsor
    ? "Geworben von"
    : isSelf
      ? "Ihre Position"
      : isDirect
        ? "Direkt geworben"
        : `Indirekt · Ebene ${Math.max(1, node.depth)}`;

  const accentBar = isSelf
    ? "bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]"
    : isSponsor
      ? "bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9]"
      : isDirect
        ? "bg-gradient-to-r from-sky-400 to-cyan-400"
        : "bg-slate-200";

  return (
    <div
      className="partner-network-tree__node"
      data-network-focus={node.kind === "sponsor" || node.kind === "self" || node.kind === "direct" ? "true" : undefined}
      data-network-focus-top={node.kind === "sponsor" || node.kind === "self" ? "true" : undefined}
    >
      {isSelf ? (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/60 bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9] px-3 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_6px_16px_-6px_rgba(15,79,104,0.5)]">
          Sie
        </span>
      ) : null}

      <article className={cardCls}>
        <div className={`h-1 w-full ${accentBar}`} aria-hidden />
        <div className={isSelf ? "p-4 sm:p-5" : compact ? "p-3" : "p-3.5 sm:p-4"}>
          <div className="flex items-start gap-3">
            {isSelf ? (
              <NetworkAvatar
                partnerCode={node.partnerCode}
                displayName={viewer.displayName}
                size="xl"
                ring
                imageSrc={viewer.avatarUrl ?? undefined}
              />
            ) : isSponsor ? (
              useDemoAvatars ? (
                <NetworkAvatar
                  partnerCode={node.partnerCode}
                  size="md"
                  imageSrc={nodeAvatarUrl ?? undefined}
                />
              ) : (
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F4F68] to-[#3DB8C9] text-white shadow-sm"
                  aria-hidden
                >
                  <IconStar className="h-5 w-5" />
                </div>
              )
            ) : (
              <NetworkAvatar
                partnerCode={node.partnerCode}
                size={compact ? "sm" : "md"}
                imageSrc={nodeAvatarUrl ?? undefined}
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
              {isSelf ? (
                <>
                  <p className="mt-0.5 text-base font-bold leading-tight text-slate-900 sm:text-lg">
                    {viewer.displayName}
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold uppercase tracking-wide text-[#0F4F68]">
                    {node.partnerCode ?? "—"}
                  </p>
                </>
              ) : (
                <p className="mt-1 break-all font-mono text-sm font-bold uppercase tracking-wide text-slate-800">
                  {node.partnerCode ?? "—"}
                </p>
              )}
            </div>
          </div>

          {(isSelf || isDirect || (node.ownCents != null && node.ownCents > 0)) ? (
            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
              <CommissionPill label="Eigene Abschlussprov." cents={node.ownCents ?? 0} tone="green" />
              {isDirect ? (
                <CommissionPill label="Prov. geworbene Partner" cents={node.referralCents ?? 0} tone="blue" />
              ) : null}
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}

function KpiIconSlot({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-[1.04] ${className}`}
      aria-hidden
    >
      <span className="grid h-[22px] w-[22px] place-items-center [&_svg]:block [&_svg]:h-full [&_svg]:w-full">
        {children}
      </span>
    </div>
  );
}

function kpiIconProps() {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
}

function IconQr() {
  const p = kpiIconProps();
  return (
    <svg {...p}>
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="16" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="16" width="5" height="5" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
}

function IconUsers() {
  const p = kpiIconProps();
  return (
    <svg {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconUserPlus() {
  const p = kpiIconProps();
  return (
    <svg {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}

function IconNetwork() {
  const p = kpiIconProps();
  return (
    <svg {...p}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 3l2.5 7.5H22l-6 4.5 2.5 7.5L12 18l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 3z" strokeLinejoin="round" />
    </svg>
  );
}
