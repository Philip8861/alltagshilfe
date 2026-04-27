import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PartnerAuthModalShell } from "@/components/partner/PartnerAuthModalShell";
import { PartnerPasswordRecoveryForm } from "@/components/partner/PartnerPasswordRecoveryForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Neues Passwort festlegen",
  robots: { index: false, follow: false },
};

export default async function PartnerPasswortZuruecksetzenPage() {
  if (!isSupabaseConfigured()) {
    redirect("/partner/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/partner/login?reason=reset_expired");
  }

  return (
    <PartnerAuthModalShell titleId="partner-pwd-recovery-heading">
      <article className="partner-dash-animate text-center">
        <h1
          id="partner-pwd-recovery-heading"
          className="text-2xl font-semibold tracking-tight text-[#0F4F68] sm:text-3xl"
        >
          Neues Passwort festlegen
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600 sm:text-base">
          Sie haben sich per E-Mail-Link angemeldet. Bitte wählen Sie jetzt ein neues Passwort für den Partnerbereich.
        </p>
        <PartnerPasswordRecoveryForm />
      </article>
    </PartnerAuthModalShell>
  );
}
