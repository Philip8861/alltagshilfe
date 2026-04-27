import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partnerportal – Demo",
  description:
    "Öffentliche Demo: Partner-Dashboard mit Beispieldaten (Max Mustermann). Kein Login, keine echten personenbezogenen Daten.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PartnerDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div
        role="status"
        className="border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm leading-snug text-amber-950 sm:py-3"
      >
        <strong className="font-semibold">Demoansicht</strong>
        {" — "}
        Beispieldaten für Max Mustermann, kein Login, keine echten Vorgänge.{" "}
        <Link href="/kooperation" className="font-semibold text-[#0F4F68] underline underline-offset-2">
          Zurück zur Kooperation
        </Link>
        {" · "}
        <Link href="/partner/login" className="font-semibold text-[#0F4F68] underline underline-offset-2">
          Partner werden
        </Link>
      </div>
      <div className="mx-auto w-full max-w-[min(100%,96rem)] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</div>
    </div>
  );
}
