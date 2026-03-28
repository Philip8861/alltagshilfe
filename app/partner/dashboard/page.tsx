import Link from "next/link";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";
import { requirePartnerLogin } from "@/lib/partner/auth";
import type { PflegeboxOrderRow } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const displayName = profile.display_name ?? profile.organization_name ?? email ?? "Partner";

  return (
    <article>
      <div className="flex flex-col gap-4 border-b border-[#0F4F68]/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Partnerbereich</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Übersicht</h1>
          <p className="mt-1 text-sm text-neutral-600">Angemeldet als {displayName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.role === "admin" ? (
            <Link
              href="/partner/admin"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e67e22]"
            >
              Admin-Einstellungen
            </Link>
          ) : null}
          <PartnerLogoutButton />
        </div>
      </div>

      <section className="mt-10" aria-labelledby="pflegebox-heading">
        <h2 id="pflegebox-heading" className="text-xl font-bold text-[#0F4F68]">
          Abgeschlossene Pflegebox-Konfigurationen
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Hier erscheinen Einträge aus dem Pflegebox-Konfigurator, sobald die Anbindung an die Datenbank eingerichtet
          ist. Aktuell sehen Sie nur Ihre zugeordneten Datensätze.
        </p>

        {orders.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-[#0F4F68]/20 bg-white p-8 text-center text-sm text-neutral-600">
            Noch keine Einträge. Sobald Konfigurationen Ihrem Konto zugeordnet werden, erscheinen sie hier.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((row) => (
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
                <p className="mt-2 text-xs text-neutral-500">
                  {new Date(row.created_at).toLocaleString("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
