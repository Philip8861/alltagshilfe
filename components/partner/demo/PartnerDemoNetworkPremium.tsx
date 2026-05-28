"use client";

import "./demo-network-tree.css";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PartnerNetworkTreeViewport } from "@/components/partner/network/PartnerNetworkTreeViewport";
import { usePartnerNetworkViewport } from "@/components/partner/network/PartnerNetworkTreeViewportContext";
import { formatCentsDe } from "@/lib/partner/referral-money";
import type { PartnerNetworkNode, PartnerNetworkTreeResult } from "@/lib/partner/network-tree";
import {
  getDemoAvatarGradient,
  getDemoAvatarInitials,
  PARTNER_DEMO_MAX_MUSTERMANN_AVATAR,
} from "@/lib/partner/partner-demo-avatars";
import {
  PARTNER_DEMO_MAX_MUSTERMANN_CODE,
  PARTNER_DEMO_MAX_MUSTERMANN_NAME,
} from "@/lib/partner/partner-demo-muster-mann-data";

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

const INITIAL_VIEW_SCALE = 0.88;

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

export function PartnerDemoNetworkPremium({ data }: Props) {
  const isMobile = useIsMobileSm();
  const totalDirect = data.directChildren.length;
  const totalAll = data.totalNodes;
  const root = useMemo(() => buildPyramid(data), [data]);
  const rootCode = data.rootPartnerCode ?? PARTNER_DEMO_MAX_MUSTERMANN_CODE;
  const sponsorCode = data.sponsor?.partnerCode ?? null;

  return (
    <section
      aria-labelledby="demo-network-heading"
      className="partner-dash-animate w-full rounded-3xl bg-gradient-to-b from-slate-50/90 via-white to-white p-4 sm:p-6 lg:p-8"
    >
      <h2 id="demo-network-heading" className="sr-only">
        Werbe-Netzwerk Demo
      </h2>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,15.5rem)_1fr] xl:items-start">
        <NetworkProfileHeader code={rootCode} />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <DemoKpiCard label="Ihr Code" value={rootCode} accent="teal" icon={<IconQr className="h-5 w-5" />} mono />
          {sponsorCode ? (
            <DemoKpiCard
              label="Geworben von"
              value={sponsorCode}
              accent="blue"
              icon={<IconUsers className="h-5 w-5" />}
              mono
            />
          ) : null}
          <DemoKpiCard
            label="Direkt geworben"
            value={String(totalDirect)}
            accent="green"
            icon={<IconUserPlus className="h-5 w-5" />}
          />
          <DemoKpiCard
            label="Gesamtes Netzwerk"
            value={String(totalAll)}
            accent="violet"
            icon={<IconNetwork className="h-5 w-5" />}
          />
        </ul>
      </div>

      <div className="relative mt-8 sm:mt-10">
        <div className="-mx-2 w-[calc(100%+1rem)] sm:-mx-4 sm:w-[calc(100%+2rem)]">
          <PartnerNetworkTreeViewport
            isMobile={isMobile}
            initialViewScale={INITIAL_VIEW_SCALE}
            layoutKey={`demo-${totalAll}-${rootCode}-${isMobile ? "m" : "d"}`}
          >
            <div className="px-2 py-4 sm:px-4 sm:py-6">
              <div className="demo-network-tree">
                <ul className="demo-network-tree__root">
                  <DemoTreeBranch node={root} isMobile={isMobile} />
                </ul>
              </div>
            </div>
          </PartnerNetworkTreeViewport>
        </div>
      </div>
    </section>
  );
}

function NetworkProfileHeader({ code }: { code: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5 xl:flex-col xl:items-start xl:gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-[#3DB8C9]/30 ring-offset-2 ring-offset-white">
        <Image
          src={PARTNER_DEMO_MAX_MUSTERMANN_AVATAR}
          alt=""
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-slate-900 sm:text-xl">{PARTNER_DEMO_MAX_MUSTERMANN_NAME}</p>
        <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide text-[#0F4F68]">{code}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          Aktiv
        </span>
      </div>
    </div>
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
    <li className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${s.icon}`} aria-hidden>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p>
        <p
          className={`mt-0.5 truncate text-xl font-semibold tabular-nums sm:text-2xl ${mono ? "font-mono uppercase tracking-wide" : ""} ${s.value}`}
        >
          {value}
        </p>
      </div>
    </li>
  );
}

function DemoAvatar({
  partnerCode,
  displayName,
  size = "md",
  imageSrc,
}: {
  partnerCode: string | null;
  displayName?: string | null;
  size?: "sm" | "md" | "lg";
  imageSrc?: string;
}) {
  const dim = size === "lg" ? "h-12 w-12 text-sm" : size === "md" ? "h-10 w-10 text-xs" : "h-8 w-8 text-[0.65rem]";
  const initials = getDemoAvatarInitials(partnerCode, displayName);
  const gradient = getDemoAvatarGradient(partnerCode);

  if (imageSrc) {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-full ${dim}`}>
        <Image src={imageSrc} alt="" fill className="object-cover" sizes="48px" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-inner ${gradient} ${dim}`}
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
    <div className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 ${cls}`}>
      <span className="text-[0.58rem] font-semibold uppercase leading-tight tracking-wide opacity-80">{label}</span>
      <span className="shrink-0 text-xs font-semibold tabular-nums">{formatCentsDe(cents)}</span>
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
  const userToggledRef = useRef(false);

  const handleClick = () => {
    userToggledRef.current = true;
    onToggle();
  };

  useLayoutEffect(() => {
    if (!userToggledRef.current) return;
    userToggledRef.current = false;
    viewport?.centerOnElement(ref.current);
  }, [collapsed, viewport]);

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

function DemoTreeBranch({ node, isMobile }: { node: PyramidNode; isMobile: boolean }) {
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
    <li className="demo-network-tree__branch">
      <DemoTreeNodeCard node={node} />
      {hasChildren ? (
        <TreeConnector collapsed={collapsed} expanded={!collapsed} onToggle={() => setCollapsed((v) => !v)} />
      ) : null}
      {hasChildren && !collapsed ? (
        <>
          <div className="demo-network-tree__stem" aria-hidden />
          <ul className="demo-network-tree__children">
            {node.children.map((c) => (
              <DemoTreeBranch key={c.key} node={c} isMobile={isMobile} />
            ))}
          </ul>
        </>
      ) : null}
    </li>
  );
}

function DemoTreeNodeCard({ node }: { node: PyramidNode }) {
  const compact = node.kind === "indirect";
  const isSelf = node.kind === "self";
  const isSponsor = node.kind === "sponsor";
  const isDirect = node.kind === "direct";

  const cardBase =
    "relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md";
  const width = compact
    ? "w-[8.5rem] sm:w-[9.5rem]"
    : isDirect
      ? "w-[11rem] sm:w-[12.5rem]"
      : "w-[10.5rem] sm:w-[11.5rem]";

  let cardCls = `${cardBase} ${width} border-slate-200/70`;
  if (isSelf) {
    cardCls = `${cardBase} ${width} border-2 border-[#3DB8C9]/55 shadow-[0_0_0_4px_rgba(61,184,201,0.12),0_16px_40px_-14px_rgba(15,79,104,0.22)]`;
  } else if (isSponsor) {
    cardCls = `${cardBase} ${width} border-sky-100/90 shadow-[0_8px_24px_-12px_rgba(15,79,104,0.15)]`;
  }

  const label = isSponsor
    ? "Geworben von"
    : isSelf
      ? "Ihre Position"
      : isDirect
        ? "Direkt geworben"
        : `Indirekt · Ebene ${Math.max(1, node.depth)}`;

  return (
    <div
      className="demo-network-tree__node"
      data-network-focus={node.kind === "sponsor" || node.kind === "self" || node.kind === "direct" ? "true" : undefined}
      data-network-focus-top={node.kind === "sponsor" || node.kind === "self" ? "true" : undefined}
    >
      {isSelf ? (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#3DB8C9]/40 bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9] px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wider text-white shadow-sm">
          Sie
        </span>
      ) : null}

      <article className={cardCls}>
        <div className="p-3.5 sm:p-4">
          <div className="flex items-start gap-3">
            {isSelf ? (
              <DemoAvatar
                partnerCode={node.partnerCode}
                displayName={PARTNER_DEMO_MAX_MUSTERMANN_NAME}
                size="lg"
                imageSrc={PARTNER_DEMO_MAX_MUSTERMANN_AVATAR}
              />
            ) : isSponsor || isDirect ? (
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isSponsor ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-600"
                }`}
                aria-hidden
              >
                {isSponsor ? <IconStar className="h-4 w-4" /> : <IconLock className="h-4 w-4" />}
              </div>
            ) : (
              <DemoAvatar partnerCode={node.partnerCode} size="sm" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p>
              {isSelf ? (
                <>
                  <p className="mt-0.5 truncate text-sm font-bold text-slate-900">{PARTNER_DEMO_MAX_MUSTERMANN_NAME}</p>
                  <p className="mt-0.5 font-mono text-xs font-semibold uppercase tracking-wide text-[#0F4F68]">
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

          {isDirect ? (
            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
              <CommissionPill label="Eigene Abschlussprov." cents={node.ownCents ?? 0} tone="green" />
              <CommissionPill label="Ihre Werbeprov." cents={node.referralCents ?? 0} tone="blue" />
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}

function IconQr({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M17 17h4v4M14 17h3" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19v-1a5 5 0 0110 0v1" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14 19v-1a3.5 3.5 0 013-3.2" strokeLinecap="round" />
    </svg>
  );
}

function IconUserPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19v-1a5 5 0 018.9-2.5M16 11v6M13 14h6" strokeLinecap="round" />
    </svg>
  );
}

function IconNetwork({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v4M12 11l-5 6M12 11l5 6" strokeLinecap="round" />
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

function IconLock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5V11z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
