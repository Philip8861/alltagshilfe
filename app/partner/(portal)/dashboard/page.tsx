import type { Metadata } from "next";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { orderContactLine, partnerOrderStats } from "@/lib/partner/dashboard-order-utils";
import type { PflegeboxOrderRow } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Start",
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <aside
          className="w-full shrink-0 rounded-2xl border border-[#0F4F68]/15 bg-gradient-to-br from-[#0F4F68] to-[#0c3d52] p-6 text-white shadow-lg shadow-[#0F4F68]/20 sm:p-7 lg:order-2 lg:max-w-sm lg:text-right"
          aria-labelledby="umsatz-heading"
        >
          <p id="umsatz-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">
            Aktuelle Umsätze
          </p>
          <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">—</p>
          <p className="mt-2 text-sm leading-snug text-white/85">
            Auswertung und Abrechnung werden hier ergänzt. Platzhalter bis Daten angebunden sind.
          </p>
        </aside>

        <div className="min-w-0 flex-1 space-y-2 lg:order-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl">Start</h1>
          <p className="text-sm text-neutral-600 sm:text-base">
            Übersicht für <span className="font-semibold text-neutral-800">{displayName}</span>
            {email ? (
              <>
                {" "}
                <span className="text-neutral-400">·</span>{" "}
                <span className="break-all text-neutral-600">{email}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <section aria-labelledby="statistik-heading">
        <h2 id="statistik-heading" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
          Statistik
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600">
          Basierend auf zugeordneten Pflegebox-Abschlüssen (Konfigurator).
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Gesamt</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.total}</p>
            <p className="mt-1 text-sm text-neutral-600">Abgeschlossene Konfigurationen</p>
          </li>
          <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Letzte 30 Tage</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.last30}</p>
            <p className="mt-1 text-sm text-neutral-600">Neue Einträge</p>
          </li>
          <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Letzte 7 Tage</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.last7}</p>
            <p className="mt-1 text-sm text-neutral-600">Neue Einträge</p>
          </li>
        </ul>
      </section>

      <section className="border-t border-[#0F4F68]/10 pt-8" aria-labelledby="pflegebox-heading">
        <h2 id="pflegebox-heading" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
          Abgeschlossene Pflegebox-Konfigurationen
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Sichtbar sind Konfigurationen mit Ihrer Partner-ID (z. B. Link mit{" "}
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
  );
}
