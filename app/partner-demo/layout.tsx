import type { Metadata } from "next";
import Link from "next/link";
import { PartnerDemoShell } from "@/components/partner/demo/PartnerDemoShell";

export const metadata: Metadata = {
  title: "Partnerportal – Demo",
  description:
    "Öffentliche Schulungs-Demo: Partner-Dashboard und Werbe-Netzwerk mit Beispieldaten (Max Mustermann). Kein Login, keine echten personenbezogenen Daten.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PartnerDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div
        role="status"
        className="sticky top-0 z-50 border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm leading-snug text-amber-950 sm:py-3"
      >
        <strong className="font-semibold">Schulungs-Demo</strong>
        {" — "}
        Max Mustermann ({""}
        <span className="font-mono text-xs uppercase">MM2847</span>
        {") · Beamer-tauglich, keine echten Daten. "}
        <Link href="/kooperation" className="font-semibold text-[#0F4F68] underline underline-offset-2">
          Kooperation
        </Link>
        {" · "}
        <Link href="/partner/login" className="font-semibold text-[#0F4F68] underline underline-offset-2">
          Partner werden
        </Link>
      </div>
      <PartnerDemoShell>{children}</PartnerDemoShell>
    </div>
  );
}
