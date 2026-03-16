import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: `Datenschutzerklärung – ${siteConfig.name}.`,
};

export default function DatenschutzPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Datenschutzerklärung
        </h1>
        <div className="mt-8 max-w-3xl space-y-6 text-neutral-600 prose prose-neutral">
          <p>
            Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend
            informieren wir Sie über die Verarbeitung von Daten auf dieser Website.
          </p>
          <h2 className="text-xl font-semibold text-neutral-900 mt-8">
            Verantwortliche Stelle
          </h2>
          <p>
            Verantwortlich für die Datenverarbeitung ist [Angabe des
            Verantwortlichen].
          </p>
          <h2 className="text-xl font-semibold text-neutral-900 mt-8">
            Erhebung und Speicherung personenbezogener Daten
          </h2>
          <p>
            Beim Besuch dieser Website werden durch den Browser automatisch
            Informationen an den Server übermittelt. Dabei kann es sich um
            IP-Adresse, Datum und Uhrzeit des Zugriffs, übertragene Datenmenge
            und anfragende Quelle handeln.
          </p>
          <h2 className="text-xl font-semibold text-neutral-900 mt-8">
            Kontaktformular
          </h2>
          <p>
            Wenn Sie uns per Kontaktformular ansprechen, werden die von Ihnen
            angegebenen Daten zur Bearbeitung Ihrer Anfrage verarbeitet. Eine
            Weitergabe an Dritte erfolgt nicht ohne Ihre Einwilligung.
          </p>
          <p className="mt-8">
            Bitte passen Sie diese Datenschutzerklärung an Ihren konkreten
            Betrieb und ggf. eingesetzte Dienste (z. B. Analytics, Cookies) an
            und lassen Sie sie rechtlich prüfen.
          </p>
        </div>
      </Container>
    </article>
  );
}
