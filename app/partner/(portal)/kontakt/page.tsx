import type { Metadata } from "next";
import { PartnerSupportForm } from "@/components/partner/PartnerSupportForm";
import { PARTNER_SUPPORT_CONTACT_NAME } from "@/lib/partner/partner-support-contact";

export const metadata: Metadata = {
  title: "Hilfe & Kontakt",
};

export default function PartnerKontaktPage() {
  return (
    <article className="partner-dash-animate mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5a7c89]">Hilfe &amp; Kontakt</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F4F68] sm:text-3xl">Ihr Anliegen an {PARTNER_SUPPORT_CONTACT_NAME}</h1>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Ihr persönlicher Ansprechpartner im Partnerprogramm. Die Nachricht geht direkt an ihn.
        </p>
      </div>
      <div className="partner-dash-animate partner-dash-delay-1 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
        <PartnerSupportForm />
      </div>
    </article>
  );
}
