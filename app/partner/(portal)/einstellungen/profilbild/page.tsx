import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerAvatarUploadForm } from "@/components/partner/PartnerAvatarUploadForm";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { partnerTeamMemberLabel } from "@/lib/partner/betrieblich-team-member-label";
import { partnerAvatarPublicUrl } from "@/lib/partner/partner-avatar-shared";

export const metadata: Metadata = {
  title: "Profilbild",
};

export default async function PartnerEinstellungenProfilbildPage() {
  noStore();
  const { profile, email } = await requirePartnerLogin();
  const displayName = partnerTeamMemberLabel(profile, email);
  const avatarUrl = partnerAvatarPublicUrl(profile.avatar_path, profile.updated_at);

  return (
    <div className="space-y-8">
      <nav className="partner-dash-animate text-sm text-neutral-600">
        <Link href="/partner/einstellungen" className="font-semibold text-[#0F4F68] hover:underline">
          ← Zurück zu Einstellungen
        </Link>
      </nav>

      <section
        className="partner-dash-animate partner-dash-delay-1 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="avatar-heading"
      >
        <h1 id="avatar-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
          Profilbild
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Laden Sie ein Foto hoch und passen Sie den Ausschnitt an — so erscheint es überall im Partnerportal.
        </p>
        <div className="mt-6 max-w-xl">
          <PartnerAvatarUploadForm
            avatarUrl={avatarUrl}
            partnerCode={profile.partner_referral_code ?? null}
            displayName={displayName}
          />
        </div>
      </section>
    </div>
  );
}
