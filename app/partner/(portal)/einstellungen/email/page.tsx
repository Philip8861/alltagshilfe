import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerEmailChangeForm } from "@/components/partner/PartnerEmailChangeForm";
import { requirePartnerLogin } from "@/lib/partner/auth";

export const metadata: Metadata = {
  title: "E-Mail ändern",
};

export default async function PartnerEinstellungenEmailPage() {
  noStore();
  const { email } = await requirePartnerLogin();
  const currentEmail = email?.trim() || "";

  return (
    <div className="space-y-8">
      <nav className="partner-dash-animate text-sm text-neutral-600">
        <Link href="/partner/einstellungen" className="font-semibold text-[#0F4F68] hover:underline">
          ← Zurück zu Einstellungen
        </Link>
      </nav>

      <section
        className="partner-dash-animate partner-dash-delay-1 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="email-heading"
      >
        <h1 id="email-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
          E-Mail ändern
        </h1>
        <div className="mt-6 max-w-md">
          <PartnerEmailChangeForm currentEmail={currentEmail} />
        </div>
      </section>
    </div>
  );
}
