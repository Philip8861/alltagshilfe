import type { Metadata } from "next";
import Link from "next/link";
import { PartnerPasswordChangeForm } from "@/components/partner/PartnerPasswordChangeForm";

export const metadata: Metadata = {
  title: "Einstellungen",
};

export default function PartnerEinstellungenPage() {
  return (
    <div className="space-y-10">
      <div className="partner-dash-animate">
        <h1 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">Einstellungen</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Zugangsdaten und Unterlagen für die Zusammenarbeit.
        </p>
      </div>

      <section
        className="partner-dash-animate partner-dash-delay-1 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="pw-heading"
      >
        <h2 id="pw-heading" className="text-lg font-bold text-[#0F4F68]">
          Passwort ändern
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Nach dem Speichern können Sie sich mit dem neuen Passwort anmelden.
        </p>
        <div className="mt-6 max-w-md">
          <PartnerPasswordChangeForm />
        </div>
      </section>

      <section
        className="partner-dash-animate partner-dash-delay-2 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="vertraege-teaser"
      >
        <h2 id="vertraege-teaser" className="text-lg font-bold text-[#0F4F68]">
          Verträge
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Hier können Sie später Rahmenverträge und Dokumente als PDF hinterlegen. Der Upload wird in einer
          folgenden Ausbaustufe ergänzt.
        </p>
        <div className="mt-5">
          <Link
            href="/partner/einstellungen/vertraege"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-[#0F4F68]/5 px-5 py-2.5 text-sm font-semibold text-[#0F4F68] transition hover:border-[#0F4F68]/40 hover:bg-[#0F4F68]/10"
          >
            Zu Verträgen
          </Link>
        </div>
      </section>
    </div>
  );
}
