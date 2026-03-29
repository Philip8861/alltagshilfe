import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { requirePartnerLogin } from "@/lib/partner/auth";

export const metadata: Metadata = {
  title: "Einstellungen",
};

const tileBase =
  "partner-dash-animate flex min-h-[4.5rem] w-full items-center justify-between gap-4 rounded-2xl border border-[#0F4F68]/15 bg-white px-5 py-4 text-left shadow-sm transition hover:border-[#0F4F68]/28 hover:bg-[#F2F9FA]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

const tiles: { href: string; title: string; description: string; delayClass: string }[] = [
  {
    href: "/partner/einstellungen/passwort",
    title: "Passwort ändern",
    description: "Neues Passwort für die Anmeldung festlegen.",
    delayClass: "partner-dash-delay-1",
  },
  {
    href: "/partner/einstellungen/email",
    title: "E-Mail ändern",
    description: "Anmelde-Adresse aktualisieren.",
    delayClass: "partner-dash-delay-2",
  },
  {
    href: "/partner/einstellungen/statuslisten",
    title: "Statuslisten einstellen",
    description: "Listen, Spalten und Ihr Archiv verwalten.",
    delayClass: "partner-dash-delay-3",
  },
  {
    href: "/partner/einstellungen/vertraege",
    title: "Verträge",
    description: "Rahmenverträge und Dokumente (Ausbau geplant).",
    delayClass: "partner-dash-delay-4",
  },
];

function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function PartnerEinstellungenPage() {
  noStore();
  await requirePartnerLogin();

  return (
    <div className="space-y-8">
      <div className="partner-dash-animate">
        <h1 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">Einstellungen</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Wählen Sie einen Bereich — die Details öffnen sich auf der nächsten Seite.
        </p>
      </div>

      <ul className="mx-auto flex max-w-xl list-none flex-col gap-3 p-0 sm:max-w-2xl" role="list">
        {tiles.map((t) => (
          <li key={t.href} className={t.delayClass}>
            <Link href={t.href} className={`${tileBase} group`}>
              <span className="min-w-0">
                <span className="block font-semibold text-[#0F4F68] group-hover:underline">{t.title}</span>
                <span className="mt-0.5 block text-sm text-neutral-600">{t.description}</span>
              </span>
              <span className="shrink-0 text-[#0F4F68] opacity-80 group-hover:opacity-100" aria-hidden>
                <ChevronIcon />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
