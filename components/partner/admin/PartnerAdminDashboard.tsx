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

function shortContact(s: Record<string, unknown> | null): string {
  if (!s?.contact || typeof s.contact !== "object") return "—";
  const c = s.contact as Record<string, unknown>;
  const fn = typeof c.firstName === "string" ? c.firstName : "";
  const ln = typeof c.lastName === "string" ? c.lastName : "";
  const em = typeof c.email === "string" ? c.email : "";
  const t = `${fn} ${ln}`.trim();
  return t ? `${t} (${em})` : em || "—";
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

export function PartnerAdminDashboard({ hasServiceRole, tips, orders, profiles, authById }: Props) {
  const [editProfile, setEditProfile] = useState<PartnerProfile | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [tipSort, setTipSort] = useState<{ key: string; dir: SortDir }>({
    key: "created_at",
    dir: "desc",
  });
  const [orderSort, setOrderSort] = useState<{ key: string; dir: SortDir }>({
    key: "created_at",
    dir: "desc",
  });
  const [partnerSort, setPartnerSort] = useState<{ key: string; dir: SortDir }>({
    key: "created_at",
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

  const sortedOrders = useMemo(() => {
    const rows = [...orders];
    const { key, dir } = orderSort;
    rows.sort((a, b) => {
      if (key === "created_at") {
        return compareNum(new Date(a.created_at).getTime(), new Date(b.created_at).getTime(), dir);
      }
      if (key === "reference") {
        return compareStr(a.external_reference ?? a.id, b.external_reference ?? b.id, dir);
      }
      if (key === "status") {
        return compareStr(a.status, b.status, dir);
      }
      if (key === "partner") {
        const pa = a.partner_id ? partnerDisplay(a.partner_id).name : "";
        const pb = b.partner_id ? partnerDisplay(b.partner_id).name : "";
        return compareStr(pa, pb, dir);
      }
      return 0;
    });
    return rows;
  }, [orders, orderSort, partnerDisplay]);

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

  const toggleTipSort = (key: string) => {
    setTipSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };
  const toggleOrderSort = (key: string) => {
    setOrderSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };
  const togglePartnerSort = (key: string) => {
    setPartnerSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };

  const scrollToCreate = () => {
    setShowCreate(true);
    window.setTimeout(() => {
      document.getElementById("partner-neu-anlegen")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <article>
      <div className="flex flex-col gap-4 border-b border-[#0F4F68]/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Partner-Verwaltung</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Aufträge, Tippgeber-Eingänge und Partnerstammdaten. Zugang nur mit System-Login.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={scrollToCreate}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0c3d52]"
          >
            Partner anlegen
          </button>
          <Link
            href="/partner/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-white"
          >
            Zum Partner-Login
          </Link>
          <SystemAdminLogoutButton />
        </div>
      </div>

      {!hasServiceRole ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950" role="status">
          <p className="font-semibold">SUPABASE_SERVICE_ROLE_KEY fehlt</p>
          <p className="mt-2">Ohne Service-Role sind keine Datenabfragen und kein Partner-Anlegen möglich.</p>
        </div>
      ) : null}

      {hasServiceRole ? (
        <>
          <section className="mt-10" aria-labelledby="auftraege-heading">
            <h2 id="auftraege-heading" className="text-xl font-bold text-[#0F4F68]">
              Aktuelle Aufträge
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-neutral-600">
              Tippgeber-Meldungen aus dem Partnerportal und Pflegebox-Konfigurationen. Spaltenköpfe zum Sortieren
              anklicken.
            </p>

            <div className="mt-4 rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm">
              <h3 className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/70 px-4 py-3 text-sm font-bold text-[#0F4F68]">
                Tippgeber-Eingänge
              </h3>
              <p className="border-b border-neutral-100 px-4 py-2 text-xs text-neutral-600">
                Leistungs-Farben:{" "}
                {SERVICE_SLUG_ORDER.map((slug) => (
                  <span
                    key={slug}
                    className={`mr-2 mb-1 inline-block rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${SERVICE_SLUG_BADGE_CLASS[slug]}`}
                  >
                    {PARTNER_RESPONSIBILITY_LABELS[slug]}
                  </span>
                ))}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/40 text-xs">
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
                        <td colSpan={5} className="px-4 py-8 text-center text-neutral-600">
                          Keine Tippgeber-Eingänge. Migration{" "}
                          <code className="rounded bg-neutral-100 px-1 text-xs">007</code> /{" "}
                          <code className="rounded bg-neutral-100 px-1 text-xs">008</code> prüfen.
                        </td>
                      </tr>
                    ) : (
                      sortedTips.map((t) => {
                        const pd = partnerDisplay(t.partner_id);
                        const label =
                          PARTNER_RESPONSIBILITY_LABELS[t.service_slug as PartnerResponsibilitySlug] ??
                          t.service_slug;
                        return (
                          <tr key={t.id} className="align-top hover:bg-neutral-50/80">
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
            </div>

            <div className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm">
              <h3 className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/70 px-4 py-3 text-sm font-bold text-[#0F4F68]">
                Pflegebox-Konfigurationen
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-[800px] w-full text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/40 text-xs">
                    <tr>
                      <th className="px-4 py-3">
                        <SortButton
                          label="Referenz"
                          active={orderSort.key === "reference"}
                          dir={orderSort.dir}
                          onClick={() => toggleOrderSort("reference")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <SortButton
                          label="Datum"
                          active={orderSort.key === "created_at"}
                          dir={orderSort.dir}
                          onClick={() => toggleOrderSort("created_at")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <SortButton
                          label="Partner"
                          active={orderSort.key === "partner"}
                          dir={orderSort.dir}
                          onClick={() => toggleOrderSort("partner")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <SortButton
                          label="Status"
                          active={orderSort.key === "status"}
                          dir={orderSort.dir}
                          onClick={() => toggleOrderSort("status")}
                        />
                      </th>
                      <th className="px-4 py-3">Kontakt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sortedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-neutral-600">
                          Keine Konfigurator-Abschlüsse.
                        </td>
                      </tr>
                    ) : (
                      sortedOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-neutral-50/80">
                          <td className="px-4 py-3 font-mono text-xs text-neutral-800">
                            {o.external_reference ?? o.id.slice(0, 8)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-neutral-700">
                            {new Date(o.created_at).toLocaleString("de-DE", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </td>
                          <td className="px-4 py-3 text-xs text-neutral-700">
                            {o.partner_id ? (
                              <>
                                <span className="font-medium">
                                  {partnerDisplay(o.partner_id).name}
                                </span>
                                {partnerDisplay(o.partner_id).code ? (
                                  <span className="ml-1 font-mono font-bold text-[#0F4F68]">
                                    {partnerDisplay(o.partner_id).code}
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-amber-800">nicht zugeordnet</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-800">
                              {o.status}
                            </span>
                          </td>
                          <td
                            className="max-w-[200px] truncate px-4 py-3 text-neutral-700"
                            title={shortContact(o.summary_json)}
                          >
                            {shortContact(o.summary_json)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="partner-neu-anlegen" className="mt-12 scroll-mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-[#0F4F68]">Partner anlegen</h2>
              <button
                type="button"
                onClick={() => setShowCreate((v) => !v)}
                className="text-sm font-semibold text-[#0F4F68] underline underline-offset-2"
                aria-expanded={showCreate}
              >
                {showCreate ? "Formular ausblenden" : "Formular einblenden"}
              </button>
            </div>
            {showCreate ? (
              <div className="mt-4">
                <CreatePartnerAccountForm />
              </div>
            ) : (
              <p className="mt-2 text-sm text-neutral-500">Formular ist eingeklappt — oben auf „Partner anlegen“ klicken.</p>
            )}
          </section>

          <section className="mt-12" aria-labelledby="partner-liste-heading">
            <h2 id="partner-liste-heading" className="text-xl font-bold text-[#0F4F68]">
              Partnerliste
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-neutral-600">
              Alle Details, bearbeiten oder löschen. Sortierung über die Spaltenköpfe.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm">
              <table className="min-w-[1180px] w-full text-left text-sm">
                <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/50 text-xs">
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
                      <td colSpan={11} className="px-4 py-8 text-center text-neutral-600">
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
                        <tr key={p.id} className="align-top hover:bg-neutral-50/80">
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
                                className="min-h-9 rounded-lg border border-[#0F4F68]/25 bg-white px-2 py-1 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
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

          <div className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-5 text-sm text-neutral-700">
            <p className="font-semibold text-[#0F4F68]">Hinweise</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                SQL:{" "}
                <code className="rounded bg-white px-1">004</code>, <code className="rounded bg-white px-1">006</code>,{" "}
                <code className="rounded bg-white px-1">007</code>, <code className="rounded bg-white px-1">008</code>
              </li>
              <li>
                Konfigurator: <code className="rounded bg-white px-1">/pflegebox?partner=PARTNER_UUID</code>
              </li>
            </ul>
          </div>
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
