import Link from "next/link";
import { CreatePartnerAccountForm } from "@/components/partner/CreatePartnerAccountForm";
import { DeletePartnerUserButton } from "@/components/partner/DeletePartnerUserButton";
import { SystemAdminLogoutButton } from "@/components/partner/SystemAdminLogoutButton";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";
import { formatResponsibilityAreasList } from "@/lib/partner/responsibility-areas";
import type { PartnerProfile } from "@/lib/partner/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

type AuthUserInfo = {
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
};

function partnerPasswordNote(profile: PartnerProfile): string {
  if (profile.password_changed_at) {
    return `Partner hat geändert: ${new Date(profile.password_changed_at).toLocaleString("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    })}`;
  }
  return "Noch nicht vom Partner geändert (Initialpasswort)";
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

export default async function PartnerAdminPage() {
  await requireSystemAdmin();

  const svc = createSupabaseServiceRoleClient();

  let profiles: PartnerProfile[] = [];
  const authById = new Map<string, AuthUserInfo>();
  let orders: {
    id: string;
    partner_id: string | null;
    external_reference: string | null;
    created_at: string;
    summary_json: Record<string, unknown> | null;
  }[] = [];

  if (svc) {
    try {
      const [profRes, ordRes, listRes] = await Promise.all([
        svc
          .from("partner_profiles")
          .select(
            "id, display_name, organization_name, role, created_at, updated_at, salutation, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at",
          )
          .order("created_at", { ascending: false }),
        svc
          .from("pflegebox_orders")
          .select("id, partner_id, external_reference, created_at, summary_json")
          .order("created_at", { ascending: false })
          .limit(100),
        svc.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      ]);
      profiles = (profRes.data as PartnerProfile[] | null) ?? [];
      orders = (ordRes.data as typeof orders | null) ?? [];
      if (!listRes.error && listRes.data?.users) {
        for (const u of listRes.data.users) {
          authById.set(u.id, {
            email: u.email ?? "",
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at ?? null,
          });
        }
      }
    } catch {
      profiles = [];
      orders = [];
    }
  }

  return (
    <article>
      <div className="flex flex-col gap-4 border-b border-[#0F4F68]/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Partner-Verwaltung</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Partner anlegen, alle Stammdaten einsehen, Passwort-Änderungen nachvollziehen (kein Klartext — nur
            Zeitstempel). Zugang nur über System-Login (
            <Link href="/partner/admin-login" className="font-semibold underline underline-offset-2">
              neu anmelden
            </Link>
            ).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/partner/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-white"
          >
            Zum Partner-Login
          </Link>
          <SystemAdminLogoutButton />
        </div>
      </div>

      {!svc ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950" role="status">
          <p className="font-semibold">SUPABASE_SERVICE_ROLE_KEY fehlt</p>
          <p className="mt-2">
            Ohne Service-Role können keine Nutzer angelegt werden. Key nur serverseitig setzen (Vercel / .env.local).
          </p>
        </div>
      ) : (
        <CreatePartnerAccountForm />
      )}

      <section className="mt-10" aria-labelledby="partner-bereich-heading">
        <h2 id="partner-bereich-heading" className="text-xl font-bold text-[#0F4F68]">
          Partner-Bereich — Übersicht
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Alle angelegten Partner mit Login-E-Mail aus Supabase Auth, Kontaktdaten und Zuständigkeiten. Passwörter
          werden nicht gespeichert; nach Passwortwechsel durch den Partner erscheint das Datum der Änderung.
        </p>
        <div
          className="mt-4 overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm"
          role="region"
          aria-label="Partnerliste Detail"
        >
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/50 text-xs font-bold uppercase tracking-wide text-[#0F4F68]">
              <tr>
                <th className="whitespace-nowrap px-3 py-3">E-Mail</th>
                <th className="whitespace-nowrap px-3 py-3">Ansprechpartner</th>
                <th className="px-3 py-3">Firma</th>
                <th className="whitespace-nowrap px-3 py-3">Telefon</th>
                <th className="px-3 py-3">Angeworben von</th>
                <th className="min-w-[10rem] px-3 py-3">Zuständigkeit</th>
                <th className="min-w-[11rem] px-3 py-3">Passwort</th>
                <th className="whitespace-nowrap px-3 py-3">Rolle</th>
                <th className="whitespace-nowrap px-3 py-3">Profil seit</th>
                <th className="whitespace-nowrap px-3 py-3">Letzter Login</th>
                <th className="px-3 py-3">Nutzer-ID</th>
                <th className="whitespace-nowrap px-3 py-3">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {!svc || profiles.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-neutral-600">
                    Keine Partner-Profile gefunden. SQL-Migrationen{" "}
                    <code className="rounded bg-neutral-100 px-1 text-xs">004_partner_profiles_admin_fields.sql</code>,{" "}
                    <code className="rounded bg-neutral-100 px-1 text-xs">006_partner_salutation.sql</code> in Supabase
                    ausführen, falls Spalten fehlen.
                  </td>
                </tr>
              ) : (
                profiles.map((p) => {
                  const auth = authById.get(p.id);
                  const email = auth?.email ?? "—";
                  const name =
                    [p.first_name?.trim(), p.last_name?.trim()].filter(Boolean).join(" ") ||
                    p.display_name?.trim() ||
                    "—";
                  const label = p.organization_name ?? name ?? p.id.slice(0, 8);
                  return (
                    <tr key={p.id} className="align-top hover:bg-neutral-50/80">
                      <td className="max-w-[14rem] px-3 py-3">
                        <span className="break-all font-medium text-neutral-900">{email}</span>
                      </td>
                      <td className="px-3 py-3 text-neutral-800">{name}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-neutral-700">
                        {p.salutation === "herr" ? "Herr" : p.salutation === "frau" ? "Frau" : "—"}
                      </td>
                      <td className="max-w-[10rem] px-3 py-3 text-neutral-700">{p.organization_name ?? "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-neutral-700">{p.phone ?? "—"}</td>
                      <td className="max-w-[10rem] px-3 py-3 text-neutral-700">{p.recruited_by ?? "—"}</td>
                      <td className="px-3 py-3 text-xs text-neutral-700">
                        {formatResponsibilityAreasList(p.responsibility_areas ?? [])}
                      </td>
                      <td className="px-3 py-3 text-xs leading-snug text-neutral-700">{partnerPasswordNote(p)}</td>
                      <td className="px-3 py-3 text-neutral-700">{p.role}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-neutral-600">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleString("de-DE", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-neutral-600">
                        {auth?.last_sign_in_at
                          ? new Date(auth.last_sign_in_at).toLocaleString("de-DE", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="px-3 py-3 font-mono text-[0.65rem] text-neutral-500">{p.id}</td>
                      <td className="px-3 py-3">
                        <DeletePartnerUserButton userId={p.id} displayLabel={label} />
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
        className="mt-12 overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm"
        aria-label="Pflegebox-Abschlüsse"
      >
        <h2 className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/50 px-4 py-3 text-lg font-bold text-[#0F4F68]">
          Pflegebox-Konfigurationen (letzte 100)
        </h2>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#0F4F68]/10 text-xs font-bold uppercase tracking-wide text-[#0F4F68]">
            <tr>
              <th className="px-4 py-3">Referenz</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Kontakt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {!svc || orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-600">
                  Noch keine Abschlüsse oder keine Verbindung.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-neutral-800">
                    {o.external_reference ?? o.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {new Date(o.created_at).toLocaleString("de-DE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                    {o.partner_id ? (
                      o.partner_id.slice(0, 8) + "…"
                    ) : (
                      <span className="font-sans text-amber-800">nicht zugeordnet</span>
                    )}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-neutral-700" title={shortContact(o.summary_json)}>
                    {shortContact(o.summary_json)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <p className="border-t border-[#0F4F68]/10 px-4 py-3 text-xs text-neutral-600">
          Zuordnung in Supabase SQL:{" "}
          <code className="rounded bg-neutral-100 px-1">
            {`update public.pflegebox_orders set partner_id = 'PARTNER_UUID' where id = 'ORDER_UUID';`}
          </code>
        </p>
      </section>

      <div className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-5 text-sm text-neutral-700">
        <p className="font-semibold text-[#0F4F68]">Hinweise</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Neue Spalten:{" "}
            <code className="rounded bg-white px-1">supabase/migrations/004_partner_profiles_admin_fields.sql</code> im
            SQL-Editor ausführen.
          </li>
          <li>
            Öffentliche Selbstregistrierung abschalten – neue Partner nur über dieses Formular oder manuell in Supabase
            Auth.
          </li>
          <li>
            Konfigurator-Link: <code className="rounded bg-white px-1">/pflegebox?partner=PARTNER_UUID</code>
          </li>
          <li>
            <strong>Löschen:</strong> Entfernt den Nutzer in Supabase Auth;{" "}
            <code className="rounded bg-white px-1">partner_profiles</code> per Kaskade. Pflegebox-Abschlüsse bleiben,
            Partner-Zuordnung wird aufgehoben.
          </li>
        </ul>
      </div>
    </article>
  );
}
