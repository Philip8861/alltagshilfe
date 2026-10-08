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
import { formatPayoutPeriodLabelDe } from "@/lib/partner/payout-period";
import {
  formatCentsDe,
  PARTNER_DIRECT_REFERRAL_RATE_LABEL,
  referralCentsFromOwnCents,
} from "@/lib/partner/referral-money";
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
  /** Anzahl aller Knoten unterhalb (für „n im Netzwerk“-Badge). */
  descendantCount: number;
};

const INITIAL_VIEW_SCALE = 0.92;
const RATE_LABEL_NBSP = PARTNER_DIRECT_REFERRAL_RATE_LABEL.replace(" ", "\u00a0");
/** Beispielrechnung in der Seitenleiste (aus der Konstante abgeleitet, nicht hart codiert). */
const EXAMPLE_PARTNER_CENTS = 15000;
const EXAMPLE_REFERRAL_CENTS = referralCentsFromOwnCents(EXAMPLE_PARTNER_CENTS);

function countDescendants(nodes: PartnerNetworkNode[]): number {
  let n = 0;
  for (const node of nodes) n += 1 + countDescendants(node.children);
  return n;
}

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
    descendantCount: countDescendants(node.children),
  };
}

function buildPyramid(data: PartnerNetworkTreeResult, totalReferralCents: number): PyramidNode {
  const selfKey = `self-${data.rootPartnerCode ?? "me"}`;
  const selfNode: PyramidNode = {
    key: selfKey,
    partnerCode: data.rootPartnerCode,
    kind: "self",
    ownCents: data.rootOwnApprovedClosingCommissionCents ?? null,
    referralCents: totalReferralCents,
    depth: 0,
    children: data.directChildren.map((c, i) => transformDescendant(c, true, selfKey, i)),
    descendantCount: data.totalNodes,
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
      descendantCount: 0,
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
  const totalReferralCents = useMemo(
    () => data.directChildren.reduce((sum, c) => sum + (c.referralCommissionForCurrentPartnerCents ?? 0), 0),
    [data.directChildren],
  );
  const root = useMemo(() => buildPyramid(data, totalReferralCents), [data, totalReferralCents]);
  const rootCode = data.rootPartnerCode ?? viewer.partnerCode ?? "—";
  const sponsorCode = data.sponsor?.partnerCode ?? null;
  const hasNetwork = totalDirect > 0 || Boolean(sponsorCode);
  const layoutPrefix = layoutKeyPrefix ? `${layoutKeyPrefix}-` : "";
  const useDemoAvatars = layoutKeyPrefix === "demo";
  const periodLabel = formatPayoutPeriodLabelDe(data.periodKey);
  const activeDirect = data.directChildren.filter(
    (c) => (c.ownApprovedClosingCommissionCents ?? 0) > 0,
  ).length;
  const depthCount = maxDepth(data.directChildren);

  return (
    <section aria-labelledby={headingId} className="w-full space-y-4 sm:space-y-5">
      <NetworkPageHeader
        headingId={headingId}
        heading={srHeading}
        viewer={viewer}
        code={rootCode}
        periodLabel={periodLabel}
      />

      <ul className="partner-dash-animate partner-dash-delay-1 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KpiCard
          label="Geworben von"
          value={sponsorCode ?? "—"}
          hint={sponsorCode ? "Ihr Werber" : "Direkt von uns angelegt"}
          accent="blue"
          icon={<IconUsers />}
          mono={Boolean(sponsorCode)}
        />
        <KpiCard
          label="Direkt geworben"
          value={String(totalDirect)}
          hint={
            totalDirect === 0
              ? "zählen für Ihre Provision"
              : `${activeDirect} mit Abschluss im ${periodLabel}`
          }
          accent="green"
          icon={<IconUserPlus />}
        />
        <KpiCard
          label="Gesamtes Netzwerk"
          value={String(totalAll)}
          hint={totalAll === totalDirect ? "alle Ebenen" : `${totalAll - totalDirect} indirekt (tiefere Ebenen)`}
          accent="violet"
          icon={<IconNetwork />}
        />
        <KpiCard
          label="Ihre Werbeprovision"
          value={formatCentsDe(totalReferralCents)}
          hint={`${RATE_LABEL_NBSP} · ${periodLabel}`}
          accent="teal"
          icon={<IconEuro />}
          emphasize
        />
      </ul>

      <div className="partner-dash-animate partner-dash-delay-2 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)]">
          {hasNetwork ? (
            <PartnerNetworkTreeViewport
              isMobile={isMobile}
              initialViewScale={INITIAL_VIEW_SCALE}
              layoutKey={`${layoutPrefix}${totalAll}-${rootCode}-${isMobile ? "m" : "d"}`}
              toolbarStart={
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-sm font-semibold text-[#0F4F68]">Struktur</h2>
                  <span className="truncate rounded-full bg-[#0F4F68]/8 px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums text-[#0F4F68]">
                    {totalAll === 0
                      ? "Noch keine geworbenen Partner"
                      : `${totalAll} Partner · ${depthCount} ${depthCount === 1 ? "Ebene" : "Ebenen"}`}
                  </span>
                </div>
              }
            >
              <PartnerNetworkTreeRoot
                root={root}
                viewer={viewer}
                isMobile={isMobile}
                useDemoAvatars={useDemoAvatars}
              />
            </PartnerNetworkTreeViewport>
          ) : (
            <EmptyNetworkState code={rootCode} />
          )}
        </div>

        <NetworkSidePanel periodLabel={periodLabel} hasSponsor={Boolean(sponsorCode)} />
      </div>
    </section>
  );
}

function maxDepth(nodes: PartnerNetworkNode[]): number {
  let d = 0;
  for (const n of nodes) d = Math.max(d, n.depth, maxDepth(n.children));
  return d;
}

/* ------------------------------------------------------------------ */
/* Kopfbereich                                                         */
/* ------------------------------------------------------------------ */

function NetworkPageHeader({
  headingId,
  heading,
  viewer,
  code,
  periodLabel,
}: {
  headingId: string;
  heading: string;
  viewer: PartnerNetworkViewer;
  code: string;
  periodLabel: string;
}) {
  const showActive = viewer.isActive !== false;

  return (
    <header className="partner-dash-animate rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)] sm:p-5">
      <div className="flex flex-wrap items-center gap-4 sm:gap-5">
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

        <div className="min-w-0 flex-1">
          <h1 id={headingId} className="text-xl font-semibold leading-tight text-[#0F4F68] sm:text-2xl">
            {heading}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-700">
            <span className="font-semibold text-slate-900">{viewer.displayName}</span>
            {showActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                Aktiv
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-neutral-600">
                Deaktiviert
              </span>
            )}
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <span
            className="inline-flex h-10 items-center rounded-lg border border-[#0F4F68]/12 bg-[#F8FBFC] px-3 text-xs font-medium text-neutral-700"
            title="Beträge beziehen sich auf diesen Monat"
          >
            Monat {periodLabel}
          </span>
          <CopyCodeButton code={code} />
        </div>
      </div>
    </header>
  );
}

function CopyCodeButton({ code }: { code: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | null>(null);
  const canCopy = code !== "—";

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const flash = (next: "copied" | "failed") => {
    setState(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1800);
  };

  const onCopy = async () => {
    if (!canCopy) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("copy failed");
      }
      flash("copied");
    } catch {
      flash("failed");
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={!canCopy}
      aria-live="polite"
      className="group inline-flex h-10 items-center gap-2 rounded-lg border border-[#0F4F68]/20 bg-white pl-3 pr-2.5 text-sm shadow-sm transition hover:border-[#0F4F68]/40 hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] disabled:cursor-not-allowed disabled:opacity-60"
      title="Ihren Partner-Code in die Zwischenablage kopieren"
    >
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-400">Ihr Code</span>
      <span className="font-mono text-sm font-bold uppercase tracking-wide text-[#0F4F68]">{code}</span>
      <span
        className={`inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[0.62rem] font-semibold transition ${
          state === "copied"
            ? "bg-emerald-100 text-emerald-800"
            : state === "failed"
              ? "bg-rose-100 text-rose-800"
              : "bg-[#0F4F68]/8 text-[#0F4F68] group-hover:bg-[#0F4F68]/14"
        }`}
      >
        {state === "copied" ? "Kopiert" : state === "failed" ? "Fehler" : <IconCopy />}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* KPI-Karten                                                          */
/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  hint,
  accent,
  icon,
  mono = false,
  emphasize = false,
}: {
  label: string;
  value: string;
  hint?: string;
  accent: "teal" | "blue" | "green" | "violet";
  icon: ReactNode;
  mono?: boolean;
  emphasize?: boolean;
}) {
  const styles = {
    teal: { icon: "bg-[#E8F6F8] text-[#0F4F68]", value: "text-[#0F4F68]" },
    blue: { icon: "bg-sky-50 text-sky-700", value: "text-sky-800" },
    green: { icon: "bg-emerald-50 text-emerald-700", value: "text-emerald-700" },
    violet: { icon: "bg-violet-50 text-violet-700", value: "text-violet-700" },
  } as const;
  const s = styles[accent];

  return (
    <li
      className={`group flex min-w-0 items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-[0_2px_12px_-6px_rgba(15,79,104,0.18)] transition-shadow duration-200 hover:shadow-[0_10px_28px_-12px_rgba(15,79,104,0.25)] sm:gap-4 sm:p-4 ${
        emphasize ? "border-[#3DB8C9]/45 ring-1 ring-[#3DB8C9]/15" : "border-slate-200/60"
      }`}
    >
      <div className="hidden sm:block">
        <KpiIconSlot className={s.icon}>{icon}</KpiIconSlot>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.6rem] font-bold uppercase leading-tight tracking-[0.1em] text-slate-400 sm:text-[0.62rem] sm:tracking-[0.12em]">
          {label}
        </p>
        <p
          className={`mt-0.5 truncate text-xl font-bold tabular-nums sm:text-2xl ${mono ? "font-mono uppercase tracking-wide" : ""} ${s.value}`}
        >
          {value}
        </p>
        {hint ? (
          <p className="mt-0.5 line-clamp-2 text-[0.68rem] leading-snug text-neutral-500 sm:text-xs">{hint}</p>
        ) : null}
      </div>
    </li>
  );
}

function KpiIconSlot({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-[1.04] sm:h-11 sm:w-11 ${className}`}
      aria-hidden
    >
      <span className="grid h-[22px] w-[22px] place-items-center [&_svg]:block [&_svg]:h-full [&_svg]:w-full">
        {children}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Seitenleiste: Erklärung, Legende, Datenschutz                       */
/* ------------------------------------------------------------------ */

function NetworkSidePanel({ periodLabel, hasSponsor }: { periodLabel: string; hasSponsor: boolean }) {
  return (
    <aside className="flex min-w-0 flex-col gap-4" aria-label="Erläuterungen zum Werbe-Netzwerk">
      <div className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)] sm:p-5">
        <h2 className="text-sm font-semibold text-[#0F4F68]">So funktioniert Ihre Werbeprovision</h2>
        <ol className="mt-3 space-y-3">
          <HowStep n={1} title="Code weitergeben">
            Interessierte Partner nennen bei der Anlage Ihren Partner-Code.
          </HowStep>
          <HowStep n={2} title="Partner wird Ihnen zugeordnet">
            Der neue Partner erscheint hier als <strong className="font-semibold">direkt geworben</strong>.
          </HowStep>
          <HowStep n={3} title={`${RATE_LABEL_NBSP} zusätzlich – von uns`}>
            Schließt Ihr Partner Verträge ab, erhalten Sie monatlich {RATE_LABEL_NBSP} auf seinen Gesamtumsatz
            zusätzlich. Sein Anteil bleibt ungekürzt.
          </HowStep>
        </ol>
        <p className="mt-4 rounded-lg border border-[#0F4F68]/10 bg-[#F8FBFC] px-3 py-2 text-[0.72rem] leading-snug text-neutral-700">
          <span className="font-semibold text-[#0F4F68]">Beispiel:</span> Ihr Partner erhält{" "}
          {formatCentsDe(EXAMPLE_PARTNER_CENTS)} Abschlussprovision im Monat – Sie erhalten zusätzlich{" "}
          {formatCentsDe(EXAMPLE_REFERRAL_CENTS)}.
        </p>
      </div>

      <div className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)] sm:p-5">
        <h2 className="text-sm font-semibold text-[#0F4F68]">Legende</h2>
        <ul className="mt-3 space-y-2.5 text-xs text-neutral-700">
          {hasSponsor ? (
            <LegendRow swatch="bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9]" title="Ihr Werber">
              Der Partner, der Sie geworben hat.
            </LegendRow>
          ) : null}
          <LegendRow swatch="bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]" title="Ihre Position">
            Eigene Abschlussprovision und Ihre gesamte Werbeprovision.
          </LegendRow>
          <LegendRow swatch="bg-gradient-to-r from-sky-400 to-cyan-400" title="Direkt geworben">
            Zählt für Ihre Provision: {RATE_LABEL_NBSP} auf den Gesamtumsatz dieses Partners.
          </LegendRow>
          <LegendRow swatch="bg-slate-300" title="Indirekt">
            Von Ihren Partnern geworben – fließt über deren Gesamtumsatz anteilig in Ihre Provision ein.
          </LegendRow>
        </ul>
        <p className="mt-4 flex items-start gap-2 border-t border-[#0F4F68]/10 pt-3 text-[0.7rem] leading-snug text-neutral-500">
          <IconShield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0F4F68]/70" />
          <span>
            Aus Datenschutzgründen werden nur Partner-Codes angezeigt, keine Namen. Beträge: freigegebene
            Abschlüsse im {periodLabel}.
          </span>
        </p>
      </div>
    </aside>
  );
}

function HowStep({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0F4F68] to-[#3DB8C9] text-[0.7rem] font-bold text-white"
        aria-hidden
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-neutral-600">{children}</p>
      </div>
    </li>
  );
}

function LegendRow({ swatch, title, children }: { swatch: string; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className={`mt-1 h-2 w-6 shrink-0 rounded-full ${swatch}`} aria-hidden />
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 leading-snug text-neutral-600">{children}</p>
      </div>
    </li>
  );
}

function EmptyNetworkState({ code }: { code: string }) {
  return (
    <div className="px-6 py-12 text-center sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4F68]/10 text-[#0F4F68] [&_svg]:h-7 [&_svg]:w-7">
        <IconNetwork />
      </div>
      <p className="mt-4 text-base font-semibold text-[#0F4F68]">Noch kein Werbe-Netzwerk</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
        Geben Sie Ihren Partner-Code weiter. Sobald ein Partner mit Ihrem Code angelegt wird, erscheint er hier – und
        Sie erhalten {RATE_LABEL_NBSP} auf seinen Gesamtumsatz zusätzlich.
      </p>
      <div className="mt-5 flex justify-center">
        <CopyCodeButton code={code} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Baum                                                                */
/* ------------------------------------------------------------------ */

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
      <div className="px-3 py-4 sm:px-6 sm:py-6">
        <div ref={treeRef} className="partner-network-tree">
          <ul className="partner-network-tree__root">
            <NetworkTreeBranch node={root} viewer={viewer} isMobile={isMobile} useDemoAvatars={useDemoAvatars} />
          </ul>
        </div>
      </div>
    </PartnerNetworkTreeLayoutContext.Provider>
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

function CommissionPill({
  label,
  cents,
  tone,
  muted = false,
}: {
  label: string;
  cents: number;
  tone: "green" | "blue";
  muted?: boolean;
}) {
  const cls =
    tone === "green"
      ? "border-emerald-100 bg-emerald-50/90 text-emerald-900"
      : "border-sky-100 bg-sky-50/90 text-sky-900";
  return (
    <div className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${cls} ${muted ? "opacity-70" : ""}`}>
      <span className="text-[0.58rem] font-semibold uppercase leading-tight tracking-wide opacity-75">{label}</span>
      <span className="shrink-0 text-[0.8rem] font-bold tabular-nums">{formatCentsDe(cents)}</span>
    </div>
  );
}

function TreeConnector({
  collapsed,
  onToggle,
  expanded,
  childCount,
}: {
  collapsed: boolean;
  onToggle: () => void;
  expanded: boolean;
  childCount: number;
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
      aria-label={
        collapsed
          ? `${childCount} untergeordnete Partner anzeigen`
          : "Untergeordnete Partner ausblenden"
      }
      title={collapsed ? `${childCount} geworbene Partner anzeigen` : "Ebene zuklappen"}
      className={`inline-flex h-8 items-center justify-center gap-1 rounded-full border bg-white text-[#0F4F68] shadow-sm transition hover:border-[#3DB8C9]/60 hover:bg-[#F2F9FA] hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DB8C9] ${
        collapsed ? "border-[#3DB8C9]/50 px-2.5" : "w-8 border-slate-200/90"
      }`}
    >
      {collapsed ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <span className="text-[0.68rem] font-bold tabular-nums">{childCount}</span>
        </>
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
          <TreeConnector
            collapsed={collapsed}
            expanded={!collapsed}
            onToggle={() => setCollapsed((v) => !v)}
            childCount={node.children.length}
          />
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
    ? "w-[17rem]"
    : compact
      ? "w-[10.5rem]"
      : isDirect || hasProvision
        ? "w-[14.5rem]"
        : "w-[12.5rem]";
  const nodeAvatarUrl = useDemoAvatars ? getDemoPartnerAvatarUrl(node.partnerCode) : null;

  let cardCls = `${cardBase} ${width} border-slate-200/60 shadow-[0_3px_14px_-6px_rgba(15,79,104,0.16)]`;
  if (isSelf) {
    cardCls = `${cardBase} ${width} border-2 border-[#3DB8C9]/55 shadow-[0_0_0_4px_rgba(61,184,201,0.12),0_20px_46px_-16px_rgba(15,79,104,0.32)]`;
  } else if (isSponsor) {
    cardCls = `${cardBase} ${width} border-sky-100 shadow-[0_8px_26px_-12px_rgba(15,79,104,0.18)]`;
  } else if (isDirect) {
    cardCls = `${cardBase} ${width} border-sky-200/70 shadow-[0_6px_20px_-10px_rgba(14,116,144,0.28)]`;
  }

  const label = isSponsor
    ? "Ihr Werber"
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
        : "bg-slate-300";

  const showMoney = isSelf || isDirect || hasProvision;

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

      <article className={cardCls} aria-label={`${label}: ${node.partnerCode ?? "ohne Code"}`}>
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
              <div className="flex items-start justify-between gap-2">
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                {!isSelf && !isSponsor && node.descendantCount > 0 ? (
                  <span
                    className="shrink-0 rounded-full bg-[#0F4F68]/8 px-1.5 py-px text-[0.58rem] font-semibold tabular-nums text-[#0F4F68]"
                    title={`${node.descendantCount} Partner unterhalb`}
                  >
                    +{node.descendantCount}
                  </span>
                ) : null}
              </div>
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

          {showMoney ? (
            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
              <CommissionPill
                label="Eigene Abschlussprov."
                cents={node.ownCents ?? 0}
                tone="green"
                muted={(node.ownCents ?? 0) === 0}
              />
              {isSelf ? (
                <CommissionPill
                  label="Ihre Werbeprovision"
                  cents={node.referralCents ?? 0}
                  tone="blue"
                  muted={(node.referralCents ?? 0) === 0}
                />
              ) : null}
              {isDirect ? (
                <CommissionPill
                  label={`Ihr Anteil (${RATE_LABEL_NBSP})`}
                  cents={node.referralCents ?? 0}
                  tone="blue"
                  muted={(node.referralCents ?? 0) === 0}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

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

function IconEuro() {
  const p = kpiIconProps();
  return (
    <svg {...p}>
      <path d="M18.5 6.5A7 7 0 0 0 7 12a7 7 0 0 0 11.5 5.5" />
      <path d="M4 10h9M4 14h8" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
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
