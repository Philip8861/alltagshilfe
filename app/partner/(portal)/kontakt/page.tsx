import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function PartnerKontaktPage() {
  return (
    <article className="partner-dash-animate mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#0F4F68] sm:text-3xl">Kontakt</h1>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Schreiben Sie uns – wir melden uns zeitnah bei Ihnen.
        </p>
      </div>
      <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
        <ContactForm />
      </div>
    </article>
  );
}
