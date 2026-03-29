import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerPasswordChangeForm } from "@/components/partner/PartnerPasswordChangeForm";
import { requirePartnerLogin } from "@/lib/partner/auth";

export const metadata: Metadata = {
  title: "Passwort ändern",
};

export default async function PartnerEinstellungenPasswortPage() {
  noStore();
  await requirePartnerLogin();

  return (
    <div className="space-y-8">
      <nav className="partner-dash-animate text-sm text-neutral-600">
        <Link href="/partner/einstellungen" className="font-semibold text-[#0F4F68] hover:underline">
          ← Zurück zu Einstellungen
        </Link>
      </nav>

      <section
        className="partner-dash-animate partner-dash-delay-1 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="pw-heading"
      >
        <h1 id="pw-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
          Passwort ändern
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Nach dem Speichern können Sie sich mit dem neuen Passwort anmelden.
        </p>
        <div className="mt-6 max-w-md">
          <PartnerPasswordChangeForm />
        </div>
      </section>
    </div>
  );
}
