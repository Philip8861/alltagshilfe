import type { Metadata } from "next";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { PARTNER_DEMO_CLIENTS } from "@/lib/partner/dashboard-demo-clients";
import { orderContactLine, partnerOrderStats } from "@/lib/partner/dashboard-order-utils";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import type { PflegeboxOrderRow } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Übersicht",
};

export default async function PartnerDashboardPage() {
  const { profile, email } = await requirePartnerLogin();

  let orders: PflegeboxOrderRow[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("pflegebox_orders")
      .select("id, partner_id, external_reference, status, summary_json, created_at")
      .eq("partner_id", profile.id)
      .order("created_at", { ascending: false });
    orders = (data as PflegeboxOrderRow[] | null) ?? [];
  } catch {
    orders = [];
  }

  const stats = partnerOrderStats(orders);
  const displayName = profile.display_name ?? profile.organization_name ?? email ?? "Partner";
  const { labelDe: payoutLabel, isoDate: payoutIso } = nextPayoutDateInfo();

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl">Übersicht</h1>
        <p className="text-sm text-neutral-600 sm:text-base">
          Ihre Zuordnungen und Provisionen —{" "}
          <span className="font-semibold text-neutral-800">{displayName}</span>
          {email ? (
            <>
              {" "}
              <span className="text-neutral-400">·</span>{" "}
              <span className="break-all text-neutral-600">{email}</span>
            </>
          ) : null}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 space-y-4 lg:max-w-sm" aria-labelledby="provisionen-heading">
          <h2 id="provisionen-heading" className="sr-only">
            Provisionen
          </h2>
          <div className="rounded-2xl border border-[#0F4F68]/18 bg-gradient-to-br from-[#E8F4F7] via-[#F2F9FA] to-white p-6 shadow-sm ring-1 ring-[#0F4F68]/5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Monatliche Tippgeberprovision</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-[#0F4F68]">128,50 €</p>
            <p className="mt-2 text-sm leading-snug text-neutral-600">
              Fortlaufende Vergütung für vermittelte Kontakte — Platzhalter bis Anbindung der Abrechnung.
            </p>
          </div>
          <div className="rounded-2xl border border-[#F78F2E]/35 bg-gradient-to-br from-[#FFF5ED] via-[#FFFAF5] to-white p-6 shadow-sm ring-1 ring-[#F78F2E]/15">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C45A0A]">Einmalprovision</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-[#B45309]">420,00 €</p>
            <p className="mt-2 text-sm leading-snug text-neutral-600">
              Einmalige Boni für abgeschlossene Erstkontakte — Platzhalter zur Veranschaulichung.
            </p>
          </div>
          <div className="rounded-xl border border-[#0F4F68]/12 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Auszahlung</p>
            <p className="mt-2 text-base font-semibold text-neutral-900">
              Nächste Auszahlung am <time dateTime={payoutIso}>{payoutLabel}</time>
            </p>
            <p className="mt-1 text-xs text-neutral-500">Regelmäßig zum Monatsersten (Beispielhinweis).</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-10">
          <section aria-labelledby="klienten-heading">
            <h2 id="klienten-heading" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
              Zugeordnete Klienten
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600">
              Beispieldaten zur Darstellung — später Anbindung an Ihre echten Stammdaten.
            </p>
            <div
              className="mt-4 overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm"
              role="region"
              aria-label="Klientenliste"
            >
              <table className="min-w-[640px] w-full text-left text-sm">
                <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/60 text-xs font-bold uppercase tracking-wide text-[#0F4F68]">
                  <tr>
                    <th className="px-4 py-3">Vorname</th>
                    <th className="px-4 py-3">Nachname</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Dienstleistung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {PARTNER_DEMO_CLIENTS.map((row) => (
                    <tr key={`${row.firstName}-${row.lastName}`} className="hover:bg-[#fafcfb]">
                      <td className="px-4 py-3 font-medium text-neutral-900">{row.firstName}</td>
                      <td className="px-4 py-3 text-neutral-800">{row.lastName}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-[#0F4F68]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0F4F68]">
                          {row.status}
                        </span>
                      </td>
                      <td className="max-w-[14rem] px-4 py-3 text-neutral-700 sm:max-w-none">{row.service}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="statistik-heading">
            <h2 id="statistik-heading" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
              Konfigurator in Zahlen
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600">Abgeschlossene Pflegebox-Konfigurationen.</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Gesamt</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.total}</p>
                <p className="mt-1 text-sm text-neutral-600">Abschlüsse</p>
              </li>
              <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Letzte 30 Tage</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.last30}</p>
                <p className="mt-1 text-sm text-neutral-600">Neu</p>
              </li>
              <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Letzte 7 Tage</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.last7}</p>
                <p className="mt-1 text-sm text-neutral-600">Neu</p>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#0F4F68]/10 pt-8" aria-labelledby="pflegebox-heading">
            <h2 id="pflegebox-heading" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
              Letzte Konfigurator-Abschlüsse
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">
              Sichtbar mit Ihrer Partner-ID (z. B. Link mit{" "}
              <code className="rounded bg-neutral-100 px-1 text-xs">?partner=Ihre-UUID</code>).
            </p>

            {orders.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-[#0F4F68]/20 bg-white p-8 text-center text-sm text-neutral-600">
                Noch keine Einträge. Sobald Konfigurationen Ihrem Konto zugeordnet werden, erscheinen sie hier.
              </p>
            ) : (
              <ul className="mt-6 space-y-3">
                {orders.map((row) => {
                  const summary = row.summary_json as Record<string, unknown> | null;
                  const contact = orderContactLine(summary);
                  const lines = Array.isArray(summary?.cartLines) ? summary.cartLines.length : null;
                  return (
                    <li
                      key={row.id}
                      className="rounded-2xl border border-[#0F4F68]/10 bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-neutral-900">
                          {row.external_reference ?? `Konfiguration ${row.id.slice(0, 8)}…`}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                          {row.status}
                        </span>
                      </div>
                      {contact ? <p className="mt-2 text-sm text-neutral-700">{contact}</p> : null}
                      {lines != null ? (
                        <p className="mt-1 text-xs text-neutral-500">{lines} Position(en) in der Box</p>
                      ) : null}
                      <p className="mt-2 text-xs text-neutral-500">
                        {new Date(row.created_at).toLocaleString("de-DE", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
