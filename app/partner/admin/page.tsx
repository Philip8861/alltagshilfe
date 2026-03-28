import Link from "next/link";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";
import { requirePartnerAdmin } from "@/lib/partner/auth";
import type { PartnerProfile } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PartnerAdminPage() {
  await requirePartnerAdmin();

  let profiles: PartnerProfile[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("partner_profiles")
      .select("id, display_name, organization_name, role, created_at")
      .order("created_at", { ascending: false });
    profiles = (data as PartnerProfile[] | null) ?? [];
  } catch {
    profiles = [];
  }

  return (
    <article>
      <div className="flex flex-col gap-4 border-b border-[#0F4F68]/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Partner &amp; System</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Verwaltung der Partnerkonten. Rollen und sensible Einstellungen bitte in Supabase (Auth / SQL) pflegen.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/partner/dashboard"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-white"
          >
            Zur Übersicht
          </Link>
          <PartnerLogoutButton />
        </div>
      </div>

      <section className="mt-10 overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm" aria-label="Partnerliste">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/50 text-xs font-bold uppercase tracking-wide text-[#0F4F68]">
            <tr>
              <th className="px-4 py-3">Organisation / Name</th>
              <th className="px-4 py-3">Rolle</th>
              <th className="px-4 py-3">Nutzer-ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutral-600">
                  Keine Profile gefunden. Legen Sie Nutzer in Supabase Auth an — es wird automatisch ein Partner-Profil
                  angelegt.
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/80">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {p.organization_name ?? p.display_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{p.role}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <div className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-5 text-sm text-neutral-700">
        <p className="font-semibold text-[#0F4F68]">Hinweise</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Neue Partner: in Supabase unter Authentication anlegen; Profilzeile entsteht per Trigger.</li>
          <li>Admin-Rolle: in der Tabelle <code className="rounded bg-white px-1">partner_profiles</code> auf{" "}
            <code className="rounded bg-white px-1">admin</code> setzen.</li>
          <li>Shop &amp; App: dieselbe PostgreSQL-Datenbank kann später per API (Row Level Security) genutzt werden.</li>
        </ul>
      </div>
    </article>
  );
}
