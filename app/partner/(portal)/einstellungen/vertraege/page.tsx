import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verträge",
};

export default function PartnerVertraegePage() {
  return (
    <div className="space-y-6">
      <nav className="partner-dash-animate text-sm text-neutral-600">
        <Link href="/partner/einstellungen" className="font-semibold text-[#0F4F68] hover:underline">
          ← Einstellungen
        </Link>
      </nav>
      <div className="partner-dash-animate partner-dash-delay-1">
        <h1 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">Verträge</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Ablage für Rahmenverträge und PDFs — Upload und Verwaltung folgen.
        </p>
      </div>
      <div
        className="partner-dash-animate partner-dash-delay-2 rounded-2xl border border-dashed border-[#0F4F68]/25 bg-[#f7fafb] p-10 text-center"
        role="status"
      >
        <p className="text-sm font-medium text-[#0F4F68]">PDF-Upload in Planung</p>
        <p className="mt-2 text-sm text-neutral-600">
          Diese Seite ist vorbereitet. Sobald Speicherort und Freigaben feststehen, können Sie Dokumente hier
          hochladen.
        </p>
      </div>
    </div>
  );
}
