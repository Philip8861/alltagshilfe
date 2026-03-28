"use client";

import { useActionState, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreatePartnerAccountForm } from "@/components/partner/CreatePartnerAccountForm";
import { DeletePartnerUserButton } from "@/components/partner/DeletePartnerUserButton";
import { PartnerEditModal } from "@/components/partner/admin/PartnerEditModal";
import { SystemAdminLogoutButton } from "@/components/partner/SystemAdminLogoutButton";
import {
  PARTNER_TIP_ADMIN_STATUSES,
  PARTNER_TIP_STATUS_LABELS,
} from "@/lib/partner/partner-tip-admin";
import { partnerTipPayloadSummary } from "@/lib/partner/partner-tip-summary";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import {
  SERVICE_SLUG_ORDER,
  SERVICE_SLUG_BADGE_CLASS,
  serviceBadgeClass,
} from "@/lib/partner/service-slug-styles";
import type { PartnerProfile, PartnerTipAdminStatus, PartnerTipSubmissionRow } from "@/lib/partner/types";
import { updatePartnerTipStatusAction, type AdminWorkflowState } from "@/lib/actions/partner-admin-workflow";

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
type AdminSection = "auftraege" | "anlegen" | "liste" | "statistik";
type StatSortKey =
  | "name"
  | "email"
  | "profile"
  | "tipsTotal"
  | "tipsNeu"
  | "tipsBearbeitung"
  | "tipsErledigt"
  | "tipsAbgelehnt"
  | "boxOrders";

type Props = {
  hasServiceRole: boolean;
  tips: PartnerTipSubmissionRow[];
  orders: OrderRow[];
  profiles: PartnerProfile[];
  authById: Record<string, AuthInfo>;
};

const tipInitial: AdminWorkflowState = { ok: false, message: "" };

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

function SectionNavTile({
  title,
  description,
  active,
  onSelect,
}: {
  title: string;
  description: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex min-h-[5.5rem] flex-col justify-center rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 sm:min-h-[6.25rem] sm:px-6 sm:py-5",
        active
          ? "border-[#0F4F68] bg-gradient-to-br from-[#0F4F68] to-[#0c3d52] text-white shadow-[0_12px_40px_-12px_rgba(15,79,104,0.55)] ring-2 ring-[#0F4F68]/20"
          : "border-[#0F4F68]/12 bg-white text-[#0F4F68] shadow-sm hover:border-[#0F4F68]/28 hover:shadow-md",
      ].join(" ")}
    >
      <span className={`text-base font-bold sm:text-lg ${active ? "" : "group-hover:text-[#0c3d52]"}`}>{title}</span>
      <span className={`mt-1 text-xs leading-snug sm:text-sm ${active ? "text-white/85" : "text-neutral-600"}`}>
        {description}
      </span>
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

function TipStatusSelect({ tipId, status }: { tipId: string; status: PartnerTipAdminStatus }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updatePartnerTipStatusAction, tipInitial);
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);
  return (
    <form action={formAction} className="flex min-w-[10rem] flex-col gap-1">
      <input type="hidden" name="tip_id" value={tipId} />
      <select
        name="admin_status"
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
        }}
        className="w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-900 disabled:opacity-60"
        aria-label="Status Tippgeber-Eingang"
      >
        {PARTNER_TIP_ADMIN_STATUSES.map((s) => (
          <option key={s} value={s}>
            {PARTNER_TIP_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {state.ok ? <span className="text-[0.65rem] text-emerald-700">Gespeichert</span> : null}
      {!state.ok && state.message ? <span className="text-[0.65rem] text-red-700">{state.message}</span> : null}
    </form>
  );
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
  tipsNeu: number;
  tipsBearbeitung: number;
  tipsErledigt: number;
  tipsAbgelehnt: number;
  boxOrders: number;
  lastSignIn: string | null;
};

export function PartnerAdminDashboard({ hasServiceRole, tips, orders, profiles, authById }: Props) {
  const [section, setSection] = useState<AdminSection>("auftraege");
  const [editProfile, setEditProfile] = useState<PartnerProfile | null>(null);

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

  const sortedTips = useMemo(() => {
    const rows = [...tips];
    const { key, dir } = tipSort;
    const slugOrder = new Map(SERVICE_SLUG_ORDER.map((s, i) => [s, i]));
    rows.sort((a, b) => {
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
    return rows;
  }, [tips, tipSort, partnerDisplay]);

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
    const tipsByStatus: Record<PartnerTipAdminStatus, number> = {
      neu: 0,
      in_bearbeitung: 0,
      erledigt: 0,
      abgelehnt: 0,
    };
    for (const t of tips) {
      tipsByStatus[t.admin_status] += 1;
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
      const neu = ts.filter((x) => x.admin_status === "neu").length;
      const inB = ts.filter((x) => x.admin_status === "in_bearbeitung").length;
      const erl = ts.filter((x) => x.admin_status === "erledigt").length;
      const abg = ts.filter((x) => x.admin_status === "abgelehnt").length;
      const last = authById[p.id]?.last_sign_in_at ?? null;
      return {
        profile: p,
        email: authById[p.id]?.email ?? "—",
        tipsTotal: ts.length,
        tipsNeu: neu,
        tipsBearbeitung: inB,
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
    <article className="mx-auto max-w-6xl">
      <header className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F4F68]/55">Administration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">Partner-Verwaltung</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-600 sm:text-base">
          Zentrale Übersicht: Tippgeber-Eingänge, neue Partner und Stammdaten. Nur mit System-Login.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/partner/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#0F4F68]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA]"
          >
            Zum Partner-Login
          </Link>
          <SystemAdminLogoutButton />
        </div>
      </header>

      {!hasServiceRole ? (
        <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white p-6 text-center text-sm text-amber-950 shadow-sm" role="status">
          <p className="font-semibold">SUPABASE_SERVICE_ROLE_KEY fehlt</p>
          <p className="mt-2 text-neutral-700">Ohne Service-Role sind keine Datenabfragen und kein Partner-Anlegen möglich.</p>
        </div>
      ) : null}

      {hasServiceRole ? (
        <>
          <nav
            className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Bereiche Partner-Verwaltung"
          >
            <SectionNavTile
              title="Aktuelle Aufträge"
              description="Tippgeber-Eingänge bearbeiten und Status setzen"
              active={section === "auftraege"}
              onSelect={() => setSection("auftraege")}
            />
            <SectionNavTile
              title="Partner anlegen"
              description="Neues Konto mit Zugangsdaten erstellen"
              active={section === "anlegen"}
              onSelect={() => setSection("anlegen")}
            />
            <SectionNavTile
              title="Partnerliste"
              description="Alle Partner, bearbeiten oder löschen"
              active={section === "liste"}
              onSelect={() => setSection("liste")}
            />
            <SectionNavTile
              title="Statistik"
              description="Gesamtübersicht und Kennzahlen je Partner"
              active={section === "statistik"}
              onSelect={() => setSection("statistik")}
            />
          </nav>

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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sortedTips.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-neutral-600">
                          Keine Tippgeber-Eingänge.
                        </td>
                      </tr>
                    ) : (
                      sortedTips.map((t) => {
                        const pd = partnerDisplay(t.partner_id);
                        const label =
                          PARTNER_RESPONSIBILITY_LABELS[t.service_slug as PartnerResponsibilitySlug] ??
                          t.service_slug;
                        return (
                          <tr key={t.id} className="align-top transition-colors hover:bg-[#f8fbfc]">
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
                              <TipStatusSelect tipId={t.id} status={t.admin_status} />
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
                <p className="mt-2 text-sm text-neutral-600">Gesamtübersicht und Kennzahlen je registriertem Profil.</p>
              </div>

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
                  <p className="mt-2 flex flex-wrap gap-2 text-[0.7rem] text-neutral-600">
                    <span>Neu: {globalStats.tipsByStatus.neu}</span>
                    <span>In Bearbeitung: {globalStats.tipsByStatus.in_bearbeitung}</span>
                    <span>Erledigt: {globalStats.tipsByStatus.erledigt}</span>
                    <span>Abgelehnt: {globalStats.tipsByStatus.abgelehnt}</span>
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

              <div>
                <h3 className="text-lg font-bold text-[#0F4F68]">Je Partner</h3>
                <p className="mt-1 text-sm text-neutral-600">Tipps nach Status und Anzahl Konfigurator-Aufträge mit Partner-ID.</p>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200/80">
                  <table className="min-w-[960px] w-full text-left text-sm">
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
                            label="Neu"
                            active={statSort.key === "tipsNeu"}
                            dir={statSort.dir}
                            onClick={() => toggleStatSort("tipsNeu")}
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
                            label="Erledigt"
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
                            <td className="px-3 py-3 tabular-nums text-neutral-700">{row.tipsNeu}</td>
                            <td className="px-3 py-3 tabular-nums text-neutral-700">{row.tipsBearbeitung}</td>
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
            </section>
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
