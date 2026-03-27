import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Barrierefreie Homepage",
  description:
    "Informationen zur barrierefreien Homepage von Alltagshilfe-Süd: Einstellungen für Schriftgröße, Kontrast, Vorlesemodus, Cursor und Sprachumschaltung.",
};

export default function BarrierefreiheitPage() {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-[#0F4F68] sm:text-4xl">Barrierefreie Homepage</h1>
      <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
        Auf unserer Website können Sie die Darstellung individuell anpassen: Schriftgröße, Zeilenabstand, Farben,
        Vorlese-Modus, Maus-Cursor und Sprachumschaltung (Deutsch/Englisch).
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-neutral-700">
        <li>Schriftgröße und Schriftart per +/- und Pfeilsteuerung</li>
        <li>Seite heller machen sowie Schwarz/Weiß-Modus</li>
        <li>Vorlese-Modus für Inhalte der aktuellen Seite</li>
        <li>Vergrößerter, besser sichtbarer Maus-Cursor</li>
        <li>Sprachumschaltung Deutsch/Englisch über das Barrierefreiheits-Popup</li>
      </ul>
      <p className="mt-6 text-neutral-700">
        Die Einstellungen erreichen Sie über das Lupen-Symbol unten rechts oder über den Bereich im Footer.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-2.5 font-semibold text-white hover:bg-[#0c3d52]"
        >
          Zur Startseite
        </Link>
      </div>
    </article>
  );
}

