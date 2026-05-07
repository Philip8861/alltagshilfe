"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArchiveTipButton } from "@/components/partner/admin/ArchiveTipButton";
import { DeleteTipButton } from "@/components/partner/admin/DeleteTipButton";
import { FormerBetriebCompanyButton } from "@/components/partner/admin/FormerBetriebCompanyButton";
import { CreatePartnerAccountForm } from "@/components/partner/CreatePartnerAccountForm";
import { PartnerRegistrationEmailTestBox } from "@/components/partner/PartnerRegistrationEmailTestBox";
import { DeletePartnerUserButton } from "@/components/partner/DeletePartnerUserButton";
import { PartnerEditModal } from "@/components/partner/admin/PartnerEditModal";
import { TipStatusEditor } from "@/components/partner/admin/TipStatusEditor";
import { PARTNER_TIP_ADMIN_STATUSES, PARTNER_TIP_STATUS_LABELS } from "@/lib/partner/partner-tip-admin";
import { partnerTipPayloadSummary } from "@/lib/partner/partner-tip-summary";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import {
  SERVICE_SLUG_ORDER,
  SERVICE_SLUG_BADGE_CLASS,
  serviceBadgeClass,
  serviceRowAccentBorderClass,
} from "@/lib/partner/service-slug-styles";
import { formatProvisionEur } from "@/lib/partner/partner-tip-payout";
import { AdminHomepageTrafficPanel } from "@/components/partner/admin/AdminHomepageTrafficPanel";
import { AdminContactSourcesPanel } from "@/components/partner/admin/AdminContactSourcesPanel";
import { PartnerAdminPayoutSection } from "@/components/partner/admin/PartnerAdminPayoutSection";

const AdminStatisticsCharts = dynamic(
  () => import("./AdminStatisticsCharts").then((m) => ({ default: m.AdminStatisticsCharts })),
  {
    ssr: false,
    loading: () => <p className="text-sm text-neutral-500">Diagramme werden geladen…</p>,
  },
);
import {
  inAdminAktiveUnternehmen,
  inAdminAuftraegeQueue,
  inAdminEhemaligeUnternehmen,
} from "@/lib/partner/partner-tip-betrieblich-queue";
import type {
  PartnerAdminPayoutPeriod,
  PartnerProfile,
  PartnerTipAdminStatus,
  PartnerTipSubmissionRow,
} from "@/lib/partner/types";

type AuthInfo = {
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
};

type OrderRow = {
  id: string;
  partner_id: string | null;
  external_reference: string | null;
  status: string;
  created_at: string;
  summary_json: Record<string, unknown> | null;
};

type SortDir = "asc" | "desc";
type AdminSection =
  | "auftraege"
  | "aktive_unternehmen"
  | "archiv"
  | "anlegen"
  | "liste"
  | "statistik"
  | "auszahlen";
type StatSortKey =
  | "name"
  | "email"
  | "profile"
  | "tipsTotal"
  | "tipsBearbeitung"
  | "tipsTermin"
  | "tipsWarten"
  | "tipsBezahlt"
  | "tipsErledigt"
  | "tipsAbgelehnt"
  | "boxOrders";

type Props = {
  hasServiceRole: boolean;
  tips: PartnerTipSubmissionRow[];
  orders: OrderRow[];
  profiles: PartnerProfile[];
  authById: Record<string, AuthInfo>;
  payoutPeriods: PartnerAdminPayoutPeriod[];
  initialBereich: AdminSection;
};

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wide hover:text-[#0c3d52] ${
        active ? "text-[#0F4F68]" : "text-[#0F4F68]/70"
      }`}
    >
      {label}
      {active ? (dir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );
}

function partnerPasswordNote(profile: PartnerProfile): string {
  if (profile.password_changed_at) {
    return `Geändert: ${new Date(profile.password_changed_at).toLocaleString("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    })}`;
  }
  return "Initialpasswort";
}

function compareStr(a: string, b: string, dir: SortDir): number {
  const c = a.localeCompare(b, "de", { sensitivity: "base" });
  return dir === "asc" ? c : -c;
}

function compareNum(a: number, b: number, dir: SortDir): number {
  return dir === "asc" ? a - b : b - a;
}

type PartnerStatRow = {
  profile: PartnerProfile;
  email: string;
  tipsTotal: number;
  tipsBearbeitung: number;
  tipsTermin: number;
  tipsWarten: number;
  tipsBezahlt: number;
  tipsErledigt: number;
  tipsAbgelehnt: number;
  boxOrders: number;
  lastSignIn: string | null;
};

export function PartnerAdminDashboard({
  hasServiceRole,
  tips,
  orders,
  profiles,
  authById,
  payoutPeriods,
  initialBereich,
}: Props) {
  const [section, setSection] = useState<AdminSection>(initialBereich);
  useEffect(() => {
    setSection(initialBereich);
  }, [initialBereich]);

  const [editProfile, setEditProfile] = useState<PartnerProfile | null>(null);
  const [chartYear, setChartYear] = useState(() => new Date().getFullYear());
  const [statistikTeil, setStatistikTeil] = useState<"partner" | "homepage">("partner");

  const [tipSort, setTipSort] = useState<{ key: string; dir: SortDir }>({
    key: "created_at",
    dir: "desc",
  });
  const [partnerSort, setPartnerSort] = useState<{ key: string; dir: SortDir }>({
    key: "created_at",
    dir: "desc",
  });
  const [statSort, setStatSort] = useState<{ key: StatSortKey; dir: SortDir }>({
    key: "tipsTotal",
    dir: "desc",
  });

  const profileById = useMemo(() => new Map(profiles.map((p) => [p.id, p])), [profiles]);

  const partnerDisplay = useCallback(
    (pid: string) => {
      const p = profileById.get(pid);
      const auth = authById[pid];
      const name = [p?.first_name?.trim(), p?.last_name?.trim()].filter(Boolean).join(" ") || "—";
      const code = p?.partner_referral_code?.trim();
      return { name, code, email: auth?.email ?? "—" };
    },
    [profileById, authById],
  );

  const activeTips = useMemo(() => tips.filter((t) => !t.archived_at), [tips]);
  const auftraegeQueueTips = useMemo(() => activeTips.filter(inAdminAuftraegeQueue), [activeTips]);
  const aktiveUnternehmenTips = useMemo(() => activeTips.filter(inAdminAktiveUnternehmen), [activeTips]);
  const ehemaligeUnternehmenTips = useMemo(() => activeTips.filter(inAdminEhemaligeUnternehmen), [activeTips]);
  const archivedTips = useMemo(() => tips.filter((t) => t.archived_at), [tips]);

  const sortTipRows = useCallback(
    (rows: PartnerTipSubmissionRow[]) => {
      const copy = [...rows];
      const { key, dir } = tipSort;
      const slugOrder = new Map(SERVICE_SLUG_ORDER.map((s, i) => [s, i]));
      copy.sort((a, b) => {
        if (key === "created_at") {
          return compareNum(new Date(a.created_at).getTime(), new Date(b.created_at).getTime(), dir);
        }
        if (key === "service") {
          const ia = slugOrder.get(a.service_slug as PartnerResponsibilitySlug) ?? 99;
          const ib = slugOrder.get(b.service_slug as PartnerResponsibilitySlug) ?? 99;
          const byColor = compareNum(ia, ib, dir);
          if (byColor !== 0) return byColor;
          return compareStr(a.service_slug, b.service_slug, "asc");
        }
        if (key === "status") {
          return compareStr(a.admin_status, b.admin_status, dir);
        }
        if (key === "partner") {
          const pa = partnerDisplay(a.partner_id).name + partnerDisplay(a.partner_id).email;
          const pb = partnerDisplay(b.partner_id).name + partnerDisplay(b.partner_id).email;
          return compareStr(pa, pb, dir);
        }
        return 0;
      });
      return copy;
    },
    [tipSort, partnerDisplay],
  );

  const sortedAuftraegeTips = useMemo(() => sortTipRows(auftraegeQueueTips), [auftraegeQueueTips, sortTipRows]);
  const sortedAktiveUnternehmenTips = useMemo(
    () => sortTipRows(aktiveUnternehmenTips),
    [aktiveUnternehmenTips, sortTipRows],
  );
  const sortedEhemaligeUnternehmenTips = useMemo(
    () => sortTipRows(ehemaligeUnternehmenTips),
    [ehemaligeUnternehmenTips, sortTipRows],
  );
  const sortedArchivedTips = useMemo(() => sortTipRows(archivedTips), [archivedTips, sortTipRows]);

  const sortedProfiles = useMemo(() => {
    const rows = [...profiles];
    const { key, dir } = partnerSort;
    rows.sort((a, b) => {
      if (key === "created_at") {
        const ta = new Date(a.created_at ?? 0).getTime();
        const tb = new Date(b.created_at ?? 0).getTime();
        return compareNum(ta, tb, dir);
      }
      if (key === "email") {
        return compareStr(authById[a.id]?.email ?? "", authById[b.id]?.email ?? "", dir);
      }
      if (key === "name") {
        const na = [a.first_name, a.last_name].filter(Boolean).join(" ");
        const nb = [b.first_name, b.last_name].filter(Boolean).join(" ");
        return compareStr(na, nb, dir);
      }
      if (key === "code") {
        return compareStr(a.partner_referral_code ?? "", b.partner_referral_code ?? "", dir);
      }
      return 0;
    });
    return rows;
  }, [profiles, partnerSort, authById]);

  const globalStats = useMemo(() => {
    const partners = profiles.filter((p) => p.role === "partner").length;
    const admins = profiles.filter((p) => p.role === "admin").length;
    const tipsByStatus = Object.fromEntries(PARTNER_TIP_ADMIN_STATUSES.map((s) => [s, 0])) as Record<
      PartnerTipAdminStatus,
      number
    >;
    for (const t of tips) {
      if (tipsByStatus[t.admin_status] !== undefined) tipsByStatus[t.admin_status] += 1;
      else tipsByStatus.in_bearbeitung += 1;
    }
    const boxTotal = orders.length;
    const boxUnassigned = orders.filter((o) => !o.partner_id).length;
    return { partners, admins, totalProfiles: profiles.length, tipsByStatus, tipsTotal: tips.length, boxTotal, boxUnassigned };
  }, [profiles, tips, orders]);

  const partnerStatRows: PartnerStatRow[] = useMemo(() => {
    const tipsByPartner = new Map<string, PartnerTipSubmissionRow[]>();
    for (const t of tips) {
      const list = tipsByPartner.get(t.partner_id) ?? [];
      list.push(t);
      tipsByPartner.set(t.partner_id, list);
    }
    const ordersByPartner = new Map<string, number>();
    for (const o of orders) {
      if (o.partner_id) {
        ordersByPartner.set(o.partner_id, (ordersByPartner.get(o.partner_id) ?? 0) + 1);
      }
    }
    return profiles.map((p) => {
      const ts = tipsByPartner.get(p.id) ?? [];
      const inB = ts.filter((x) => x.admin_status === "in_bearbeitung").length;
      const term = ts.filter((x) => x.admin_status === "termin_vereinbart").length;
      const wart = ts.filter((x) => x.admin_status === "warten_auf_rueckmeldung").length;
      const bez = ts.filter((x) => x.admin_status === "bezahlt").length;
      const erl = ts.filter((x) => x.admin_status === "erledigt").length;
      const abg = ts.filter((x) => x.admin_status === "abgelehnt").length;
      const last = authById[p.id]?.last_sign_in_at ?? null;
      return {
        profile: p,
        email: authById[p.id]?.email ?? "—",
        tipsTotal: ts.length,
        tipsBearbeitung: inB,
        tipsTermin: term,
        tipsWarten: wart,
        tipsBezahlt: bez,
        tipsErledigt: erl,
        tipsAbgelehnt: abg,
        boxOrders: ordersByPartner.get(p.id) ?? 0,
        lastSignIn: last,
      };
    });
  }, [profiles, tips, orders, authById]);

  const sortedStatRows = useMemo(() => {
    const rows = [...partnerStatRows];
    const { key, dir } = statSort;
    const mul = dir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      if (key === "name") {
        const na = [a.profile.first_name, a.profile.last_name].filter(Boolean).join(" ");
        const nb = [b.profile.first_name, b.profile.last_name].filter(Boolean).join(" ");
        return mul * na.localeCompare(nb, "de", { sensitivity: "base" });
      }
      if (key === "email") {
        return mul * a.email.localeCompare(b.email, "de", { sensitivity: "base" });
      }
      if (key === "profile") {
        return mul * (new Date(a.profile.created_at ?? 0).getTime() - new Date(b.profile.created_at ?? 0).getTime());
      }
      const va = a[key] as number;
      const vb = b[key] as number;
      return mul * (va - vb);
    });
    return rows;
  }, [partnerStatRows, statSort]);

  const toggleTipSort = (key: string) => {
    setTipSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };
  const togglePartnerSort = (key: string) => {
    setPartnerSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };
  const toggleStatSort = (key: StatSortKey) => {
    setStatSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );
  };

  return (
    <article className="mx-auto w-full max-w-[min(100%,90rem)] space-y-6 sm:space-y-8">
      {!hasServiceRole ? (
        <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white p-6 text-center text-sm text-amber-950 shadow-sm" role="status">
          <p className="font-semibold">SUPABASE_SERVICE_ROLE_KEY fehlt</p>
          <p className="mt-2 text-neutral-700">Ohne Service-Role sind keine Datenabfragen und kein Partner-Anlegen möglich.</p>
        </div>
      ) : null}

      {hasServiceRole ? (
        <>
          {section === "auftraege" ? (
            <section
              className="partner-dash-animate rounded-3xl border border-[#0F4F68]/10 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
              aria-labelledby="auftraege-heading"
            >
              <h2 id="auftraege-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Aktuelle Aufträge
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Tippgeber-Meldungen aus dem Partnerportal. Spaltenköpfe sortieren.
              </p>
              <p className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
                <span className="font-semibold text-[#0F4F68]">Leistungen:</span>
                {SERVICE_SLUG_ORDER.map((slug) => (
                  <span
                    key={slug}
                    className={`inline-block rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${SERVICE_SLUG_BADGE_CLASS[slug]}`}
                  >
                    {PARTNER_RESPONSIBILITY_LABELS[slug]}
                  </span>
                ))}
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/80">
                <table className="min-w-[900px] w-full text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/70 text-xs">
                    <tr>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Datum"
                          active={tipSort.key === "created_at"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("created_at")}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Partner"
                          active={tipSort.key === "partner"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("partner")}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Dienstleistung"
                          active={tipSort.key === "service"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("service")}
                        />
                      </th>
                      <th className="px-3 py-3">Kurzinfo</th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Status"
                          active={tipSort.key === "status"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("status")}
                        />
                      </th>
                      <th className="whitespace-nowrap px-3 py-3">Archiv</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sortedAuftraegeTips.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-neutral-600">
                          Keine aktiven Tippgeber-Eingänge.
                        </td>
                      </tr>
                    ) : (
                      sortedAuftraegeTips.map((t) => {
                        const pd = partnerDisplay(t.partner_id);
                        const label =
                          PARTNER_RESPONSIBILITY_LABELS[t.service_slug as PartnerResponsibilitySlug] ??
                          t.service_slug;
                        return (
                          <tr
                            key={t.id}
                            className={`align-top transition-colors hover:bg-[#f8fbfc] ${serviceRowAccentBorderClass(t.service_slug)}`}
                          >
                            <td className="whitespace-nowrap px-3 py-3 text-neutral-700">
                              {new Date(t.created_at).toLocaleString("de-DE", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </td>
                            <td className="px-3 py-3">
                              <span className="font-medium text-neutral-900">{pd.name}</span>
                              {pd.code ? (
                                <span className="ml-1 font-mono text-xs font-bold text-[#0F4F68]">{pd.code}</span>
                              ) : null}
                              <div className="break-all text-xs text-neutral-500">{pd.email}</div>
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${serviceBadgeClass(t.service_slug)}`}
                              >
                                {label}
                              </span>
                            </td>
                            <td className="max-w-[240px] px-3 py-3 text-xs text-neutral-700">
                              {partnerTipPayloadSummary(t.payload, t.service_slug)}
                            </td>
                            <td className="px-3 py-3">
                              <TipStatusEditor
                                tipId={t.id}
                                status={t.admin_status}
                                adminVisibleNote={t.admin_visible_note}
                                serviceSlug={t.service_slug}
                                paidAmountEur={t.paid_amount_eur}
                              />
                            </td>
                            <td className="px-3 py-3 align-top">
                              <div className="flex flex-col gap-2">
                                <ArchiveTipButton tipId={t.id} isArchived={false} />
                                <DeleteTipButton tipId={t.id} />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {section === "aktive_unternehmen" ? (
            <div className="space-y-10">
              <section
                className="partner-dash-animate rounded-3xl border border-emerald-200/90 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
                aria-labelledby="aktive-unternehmen-heading"
              >
                <h2 id="aktive-unternehmen-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                  Aktive Unternehmen
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Betriebliche Pflegeberatung mit Vertragsabschluss und hinterlegter monatlicher Provision. Status und
                  Betrag sind weiter bearbeitbar. „Ehemalig“ verschiebt den Eintrag nur in die Liste unten (kein
                  Partner-Archiv).
                </p>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/80">
                  <table className="min-w-[960px] w-full text-left text-sm">
                    <thead className="border-b border-[#0F4F68]/10 bg-emerald-50/80 text-xs">
                      <tr>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Datum"
                            active={tipSort.key === "created_at"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("created_at")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Partner"
                            active={tipSort.key === "partner"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("partner")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Dienstleistung"
                            active={tipSort.key === "service"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("service")}
                          />
                        </th>
                        <th className="px-3 py-3">Kurzinfo</th>
                        <th className="whitespace-nowrap px-3 py-3">Monatliche Provision</th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Status"
                            active={tipSort.key === "status"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("status")}
                          />
                        </th>
                        <th className="whitespace-nowrap px-3 py-3">Liste</th>
                        <th className="whitespace-nowrap px-3 py-3">Admin-Archiv</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {sortedAktiveUnternehmenTips.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-neutral-600">
                            Keine aktiven Unternehmen mit erfasster Monatsprovision.
                          </td>
                        </tr>
                      ) : (
                        sortedAktiveUnternehmenTips.map((t) => {
                          const pd = partnerDisplay(t.partner_id);
                          const label =
                            PARTNER_RESPONSIBILITY_LABELS[t.service_slug as PartnerResponsibilitySlug] ??
                            t.service_slug;
                          const prov =
                            t.paid_amount_eur != null && Number.isFinite(Number(t.paid_amount_eur))
                              ? formatProvisionEur(Number(t.paid_amount_eur))
                              : "—";
                          return (
                            <tr
                              key={t.id}
                              className={`align-top transition-colors hover:bg-[#f8fbfc] ${serviceRowAccentBorderClass(t.service_slug)}`}
                            >
                              <td className="whitespace-nowrap px-3 py-3 text-neutral-700">
                                {new Date(t.created_at).toLocaleString("de-DE", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </td>
                              <td className="px-3 py-3">
                                <span className="font-medium text-neutral-900">{pd.name}</span>
                                {pd.code ? (
                                  <span className="ml-1 font-mono text-xs font-bold text-[#0F4F68]">{pd.code}</span>
                                ) : null}
                                <div className="break-all text-xs text-neutral-500">{pd.email}</div>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${serviceBadgeClass(t.service_slug)}`}
                                >
                                  {label}
                                </span>
                              </td>
                              <td className="max-w-[240px] px-3 py-3 text-xs text-neutral-700">
                                {partnerTipPayloadSummary(t.payload, t.service_slug)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm font-semibold tabular-nums text-emerald-900">
                                {prov}
                              </td>
                              <td className="px-3 py-3">
                                <TipStatusEditor
                                  tipId={t.id}
                                  status={t.admin_status}
                                  adminVisibleNote={t.admin_visible_note}
                                  serviceSlug={t.service_slug}
                                  paidAmountEur={t.paid_amount_eur}
                                />
                              </td>
                              <td className="px-3 py-3 align-top">
                                <FormerBetriebCompanyButton tipId={t.id} isFormer={false} />
                              </td>
                              <td className="px-3 py-3 align-top">
                                <div className="flex flex-col gap-2">
                                  <ArchiveTipButton tipId={t.id} isArchived={false} />
                                  <DeleteTipButton tipId={t.id} />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section
                className="partner-dash-animate rounded-3xl border border-amber-200/90 bg-amber-50/40 p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.2)] sm:p-8"
                aria-labelledby="ehemalige-unternehmen-heading"
              >
                <h2 id="ehemalige-unternehmen-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                  Ehemalige Unternehmen
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Vertrag beendet oder kein aktives Unternehmen mehr – nur für die Admin-Übersicht. Provision und
                  Auszahlungslogik laufen unverändert weiter.
                </p>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white">
                  <table className="min-w-[960px] w-full text-left text-sm">
                    <thead className="border-b border-[#0F4F68]/10 bg-amber-50/90 text-xs">
                      <tr>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Datum"
                            active={tipSort.key === "created_at"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("created_at")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Partner"
                            active={tipSort.key === "partner"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("partner")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Dienstleistung"
                            active={tipSort.key === "service"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("service")}
                          />
                        </th>
                        <th className="px-3 py-3">Kurzinfo</th>
                        <th className="whitespace-nowrap px-3 py-3">Monatliche Provision</th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Status"
                            active={tipSort.key === "status"}
                            dir={tipSort.dir}
                            onClick={() => toggleTipSort("status")}
                          />
                        </th>
                        <th className="whitespace-nowrap px-3 py-3">Liste</th>
                        <th className="whitespace-nowrap px-3 py-3">Admin-Archiv</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {sortedEhemaligeUnternehmenTips.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-neutral-600">
                            Keine ehemaligen Unternehmen.
                          </td>
                        </tr>
                      ) : (
                        sortedEhemaligeUnternehmenTips.map((t) => {
                          const pd = partnerDisplay(t.partner_id);
                          const label =
                            PARTNER_RESPONSIBILITY_LABELS[t.service_slug as PartnerResponsibilitySlug] ??
                            t.service_slug;
                          const prov =
                            t.paid_amount_eur != null && Number.isFinite(Number(t.paid_amount_eur))
                              ? formatProvisionEur(Number(t.paid_amount_eur))
                              : "—";
                          return (
                            <tr
                              key={t.id}
                              className={`align-top transition-colors hover:bg-[#f8fbfc] ${serviceRowAccentBorderClass(t.service_slug)}`}
                            >
                              <td className="whitespace-nowrap px-3 py-3 text-neutral-700">
                                {new Date(t.created_at).toLocaleString("de-DE", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </td>
                              <td className="px-3 py-3">
                                <span className="font-medium text-neutral-900">{pd.name}</span>
                                {pd.code ? (
                                  <span className="ml-1 font-mono text-xs font-bold text-[#0F4F68]">{pd.code}</span>
                                ) : null}
                                <div className="break-all text-xs text-neutral-500">{pd.email}</div>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${serviceBadgeClass(t.service_slug)}`}
                                >
                                  {label}
                                </span>
                              </td>
                              <td className="max-w-[240px] px-3 py-3 text-xs text-neutral-700">
                                {partnerTipPayloadSummary(t.payload, t.service_slug)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm font-semibold tabular-nums text-emerald-900">
                                {prov}
                              </td>
                              <td className="px-3 py-3">
                                <TipStatusEditor
                                  tipId={t.id}
                                  status={t.admin_status}
                                  adminVisibleNote={t.admin_visible_note}
                                  serviceSlug={t.service_slug}
                                  paidAmountEur={t.paid_amount_eur}
                                />
                              </td>
                              <td className="px-3 py-3 align-top">
                                <FormerBetriebCompanyButton tipId={t.id} isFormer />
                              </td>
                              <td className="px-3 py-3 align-top">
                                <div className="flex flex-col gap-2">
                                  <ArchiveTipButton tipId={t.id} isArchived={false} />
                                  <DeleteTipButton tipId={t.id} />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : null}

          {section === "archiv" ? (
            <section
              className="partner-dash-animate rounded-3xl border border-[#0F4F68]/10 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
              aria-labelledby="archiv-heading"
            >
              <h2 id="archiv-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Aufträge Archiv
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Nur Einträge, die Sie hier ins Admin-Archiv legen („Ins Archiv“). Status und Notiz bleiben bearbeitbar;
                „Reaktivieren“ holt den Eintrag zurück. Partner-Archiv und Ablehnung betrieblich verschieben hier nichts.
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/80">
                <table className="min-w-[900px] w-full text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/70 text-xs">
                    <tr>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Datum"
                          active={tipSort.key === "created_at"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("created_at")}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Partner"
                          active={tipSort.key === "partner"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("partner")}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Dienstleistung"
                          active={tipSort.key === "service"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("service")}
                        />
                      </th>
                      <th className="px-3 py-3">Kurzinfo</th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Status"
                          active={tipSort.key === "status"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("status")}
                        />
                      </th>
                      <th className="whitespace-nowrap px-3 py-3">Archiv</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sortedArchivedTips.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-neutral-600">
                          Keine archivierten Aufträge.
                        </td>
                      </tr>
                    ) : (
                      sortedArchivedTips.map((t) => {
                        const pd = partnerDisplay(t.partner_id);
                        const label =
                          PARTNER_RESPONSIBILITY_LABELS[t.service_slug as PartnerResponsibilitySlug] ??
                          t.service_slug;
                        return (
                          <tr
                            key={t.id}
                            className={`align-top transition-colors hover:bg-[#f8fbfc] ${serviceRowAccentBorderClass(t.service_slug)}`}
                          >
                            <td className="whitespace-nowrap px-3 py-3 text-neutral-700">
                              {new Date(t.created_at).toLocaleString("de-DE", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </td>
                            <td className="px-3 py-3">
                              <span className="font-medium text-neutral-900">{pd.name}</span>
                              {pd.code ? (
                                <span className="ml-1 font-mono text-xs font-bold text-[#0F4F68]">{pd.code}</span>
                              ) : null}
                              <div className="break-all text-xs text-neutral-500">{pd.email}</div>
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${serviceBadgeClass(t.service_slug)}`}
                              >
                                {label}
                              </span>
                            </td>
                            <td className="max-w-[240px] px-3 py-3 text-xs text-neutral-700">
                              {partnerTipPayloadSummary(t.payload, t.service_slug)}
                            </td>
                            <td className="px-3 py-3">
                              <TipStatusEditor
                                tipId={t.id}
                                status={t.admin_status}
                                adminVisibleNote={t.admin_visible_note}
                                serviceSlug={t.service_slug}
                                paidAmountEur={t.paid_amount_eur}
                              />
                            </td>
                            <td className="px-3 py-3 align-top">
                              <div className="flex flex-col gap-2">
                                <ArchiveTipButton tipId={t.id} isArchived />
                                <DeleteTipButton tipId={t.id} />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {section === "anlegen" ? (
            <section
              className="partner-dash-animate rounded-3xl border border-[#0F4F68]/10 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
              aria-labelledby="anlegen-heading"
            >
              <h2 id="anlegen-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Partner anlegen
              </h2>
              <p className="mt-2 text-sm text-neutral-600">Neues Partnerkonto inkl. einmalig angezeigtem Passwort und Code.</p>
              <div className="mt-6">
                <PartnerRegistrationEmailTestBox />
              </div>
              <div className="mt-8">
                <CreatePartnerAccountForm />
              </div>
            </section>
          ) : null}

          {section === "liste" ? (
            <section
              className="partner-dash-animate rounded-3xl border border-[#0F4F68]/10 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
              aria-labelledby="partner-liste-heading"
            >
              <h2 id="partner-liste-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Partnerliste
              </h2>
              <p className="mt-2 text-sm text-neutral-600">Alle Details, bearbeiten oder löschen. Sortierung über die Spaltenköpfe.</p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/80">
                <table className="min-w-[1180px] w-full text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/60 text-xs">
                    <tr>
                      <th className="px-3 py-3">
                        <SortButton
                          label="E-Mail"
                          active={partnerSort.key === "email"}
                          dir={partnerSort.dir}
                          onClick={() => togglePartnerSort("email")}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Name"
                          active={partnerSort.key === "name"}
                          dir={partnerSort.dir}
                          onClick={() => togglePartnerSort("name")}
                        />
                      </th>
                      <th className="whitespace-nowrap px-3 py-3">Anrede</th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Code"
                          active={partnerSort.key === "code"}
                          dir={partnerSort.dir}
                          onClick={() => togglePartnerSort("code")}
                        />
                      </th>
                      <th className="px-3 py-3">Firma</th>
                      <th className="px-3 py-3">Telefon</th>
                      <th className="px-3 py-3">Zuständigkeit</th>
                      <th className="px-3 py-3">Passwort</th>
                      <th className="px-3 py-3">Rolle</th>
                      <th className="px-3 py-3">
                        <SortButton
                          label="Profil seit"
                          active={partnerSort.key === "created_at"}
                          dir={partnerSort.dir}
                          onClick={() => togglePartnerSort("created_at")}
                        />
                      </th>
                      <th className="whitespace-nowrap px-3 py-3">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sortedProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-4 py-12 text-center text-neutral-600">
                          Keine Partner-Profile.
                        </td>
                      </tr>
                    ) : (
                      sortedProfiles.map((p) => {
                        const auth = authById[p.id];
                        const email = auth?.email ?? "—";
                        const name =
                          [p.first_name?.trim(), p.last_name?.trim()].filter(Boolean).join(" ") ||
                          p.display_name?.trim() ||
                          "—";
                        const label = p.organization_name ?? name ?? p.id.slice(0, 8);
                        return (
                          <tr key={p.id} className="align-top transition-colors hover:bg-[#f8fbfc]">
                            <td className="max-w-[12rem] px-3 py-3">
                              <span className="break-all font-medium text-neutral-900">{email}</span>
                            </td>
                            <td className="px-3 py-3 text-neutral-800">{name}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-neutral-700">
                              {p.salutation === "herr" ? "Herr" : p.salutation === "frau" ? "Frau" : "—"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-bold text-[#0F4F68]">
                              {p.partner_referral_code?.trim() || "—"}
                            </td>
                            <td className="max-w-[8rem] px-3 py-3 text-neutral-700">{p.organization_name ?? "—"}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-neutral-700">{p.phone ?? "—"}</td>
                            <td className="max-w-[10rem] px-3 py-3 text-xs text-neutral-700">
                              {(p.responsibility_areas ?? []).map((slug) => (
                                <span
                                  key={slug}
                                  className={`mb-1 mr-1 inline-block rounded-full border px-1.5 py-0.5 text-[0.65rem] font-medium ${serviceBadgeClass(slug)}`}
                                >
                                  {PARTNER_RESPONSIBILITY_LABELS[slug as PartnerResponsibilitySlug] ?? slug}
                                </span>
                              ))}
                              {!p.responsibility_areas?.length ? "—" : null}
                            </td>
                            <td className="px-3 py-3 text-xs text-neutral-700">{partnerPasswordNote(p)}</td>
                            <td className="px-3 py-3 text-neutral-700">{p.role}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-xs text-neutral-600">
                              {p.created_at
                                ? new Date(p.created_at).toLocaleString("de-DE", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                                : "—"}
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex flex-col gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditProfile(p)}
                                  className="min-h-9 rounded-xl border border-[#0F4F68]/25 bg-white px-2 py-1 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                                >
                                  Bearbeiten
                                </button>
                                <DeletePartnerUserButton userId={p.id} displayLabel={label} />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {section === "statistik" ? (
            <section
              className="partner-dash-animate space-y-8 rounded-3xl border border-[#0F4F68]/10 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
              aria-labelledby="stat-heading"
            >
              <div>
                <h2 id="stat-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                  Statistik
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  {statistikTeil === "partner"
                    ? "Partner-Programm: Profile, Tipps, Pflegebox und Kennzahlen je Partner."
                    : "Homepage: aggregierte Seitenaufrufe der öffentlichen Website (ohne personenbezogene Daten)."}
                </p>
              </div>

              <div
                className="flex flex-wrap gap-2 border-b border-[#0F4F68]/12 pb-3"
                role="tablist"
                aria-label="Statistik-Bereich"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={statistikTeil === "partner"}
                  onClick={() => setStatistikTeil("partner")}
                  className={`min-h-11 rounded-xl px-4 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 sm:px-5 sm:text-base ${
                    statistikTeil === "partner"
                      ? "bg-[#0F4F68] text-white shadow-sm"
                      : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
                  }`}
                >
                  Statistik Partner-Programm
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={statistikTeil === "homepage"}
                  onClick={() => setStatistikTeil("homepage")}
                  className={`min-h-11 rounded-xl px-4 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 sm:px-5 sm:text-base ${
                    statistikTeil === "homepage"
                      ? "bg-[#0F4F68] text-white shadow-sm"
                      : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
                  }`}
                >
                  Statistik Homepage
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div>
                  <label htmlFor="admin-chart-year" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
                    Jahr {statistikTeil === "homepage" ? "(Auswertung Homepage)" : "(Verlaufsdiagramm Partner)"}
                  </label>
                  <input
                    id="admin-chart-year"
                    type="number"
                    min={2020}
                    max={2100}
                    value={chartYear}
                    onChange={(e) => setChartYear(Number(e.target.value))}
                    className="mt-2 w-28 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20"
                  />
                </div>
              </div>

              {statistikTeil === "partner" ? (
                <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#F2F9FA] to-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/65">Profile gesamt</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{globalStats.totalProfiles}</p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Partner: {globalStats.partners} · Admin-Rolle: {globalStats.admins}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#F2F9FA]/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/65">Tippgeber-Eingänge</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{globalStats.tipsTotal}</p>
                  <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[0.65rem] leading-snug text-neutral-600">
                    {PARTNER_TIP_ADMIN_STATUSES.map((s) => (
                      <span key={s}>
                        {PARTNER_TIP_STATUS_LABELS[s]}: {globalStats.tipsByStatus[s]}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#F2F9FA]/60 to-white p-5 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/65">Pflegebox-Abschlüsse (DB)</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{globalStats.boxTotal}</p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Ohne Partner-Zuordnung: {globalStats.boxUnassigned}
                  </p>
                </div>
              </div>

              <AdminStatisticsCharts
                tips={tips}
                orders={orders}
                chartYear={chartYear}
                profiles={profiles}
                authById={authById}
              />

              <div>
                <h3 className="text-lg font-bold text-[#0F4F68]">Je Partner</h3>
                <p className="mt-1 text-sm text-neutral-600">Tipps nach Status und Anzahl Konfigurator-Aufträge mit Partner-ID.</p>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200/80">
                  <table className="min-w-[1100px] w-full text-left text-sm">
                    <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/60 text-xs">
                      <tr>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Name"
                            active={statSort.key === "name"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("name")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="E-Mail"
                            active={statSort.key === "email"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("email")}
                          />
                        </th>
                        <th className="px-3 py-3">Code</th>
                        <th className="px-3 py-3">Rolle</th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Tipps"
                            active={statSort.key === "tipsTotal"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsTotal")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Bearb."
                            active={statSort.key === "tipsBearbeitung"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsBearbeitung")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Termin"
                            active={statSort.key === "tipsTermin"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsTermin")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Warten"
                            active={statSort.key === "tipsWarten"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsWarten")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Bezahlt"
                            active={statSort.key === "tipsBezahlt"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsBezahlt")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Vertrag"
                            active={statSort.key === "tipsErledigt"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsErledigt")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Abgelehnt"
                            active={statSort.key === "tipsAbgelehnt"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsAbgelehnt")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Box"
                            active={statSort.key === "boxOrders"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("boxOrders")}
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortButton
                            label="Profil seit"
                            active={statSort.key === "profile"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("profile")}
                          />
                        </th>
                        <th className="px-3 py-3">Letzte Anmeldung</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {sortedStatRows.map((row) => {
                        const p = row.profile;
                        const name =
                          [p.first_name?.trim(), p.last_name?.trim()].filter(Boolean).join(" ") ||
                          p.display_name?.trim() ||
                          "—";
                        return (
                          <tr key={p.id} className="transition-colors hover:bg-[#f8fbfc]">
                            <td className="px-3 py-3 font-medium text-neutral-900">{name}</td>
                            <td className="max-w-[11rem] break-all px-3 py-3 text-xs text-neutral-700">{row.email}</td>
                            <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-bold text-[#0F4F68]">
                              {p.partner_referral_code?.trim() || "—"}
                            </td>
                            <td className="px-3 py-3 text-neutral-700">{p.role}</td>
                            <td className="px-3 py-3 tabular-nums font-semibold text-neutral-900">{row.tipsTotal}</td>
                            <td className="px-3 py-3 tabular-nums text-neutral-700">{row.tipsBearbeitung}</td>
                            <td className="px-3 py-3 tabular-nums text-indigo-800">{row.tipsTermin}</td>
                            <td className="px-3 py-3 tabular-nums text-violet-800">{row.tipsWarten}</td>
                            <td className="px-3 py-3 tabular-nums text-teal-800">{row.tipsBezahlt}</td>
                            <td className="px-3 py-3 tabular-nums text-emerald-800">{row.tipsErledigt}</td>
                            <td className="px-3 py-3 tabular-nums text-rose-800">{row.tipsAbgelehnt}</td>
                            <td className="px-3 py-3 tabular-nums text-neutral-800">{row.boxOrders}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-xs text-neutral-600">
                              {p.created_at
                                ? new Date(p.created_at).toLocaleString("de-DE", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                                : "—"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-xs text-neutral-600">
                              {row.lastSignIn
                                ? new Date(row.lastSignIn).toLocaleString("de-DE", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
                </>
              ) : (
                <>
                  <AdminHomepageTrafficPanel chartYear={chartYear} />
                  <div className="mt-10 border-t border-[#0F4F68]/15 pt-8">
                    <AdminContactSourcesPanel chartYear={chartYear} />
                  </div>
                </>
              )}
            </section>
          ) : null}

          {section === "auszahlen" ? (
            <PartnerAdminPayoutSection payoutPeriods={payoutPeriods} authById={authById} />
          ) : null}
        </>
      ) : null}

      {editProfile ? (
        <PartnerEditModal
          open
          profile={editProfile}
          email={authById[editProfile.id]?.email ?? "—"}
          onClose={() => setEditProfile(null)}
        />
      ) : null}
    </article>
  );
}

