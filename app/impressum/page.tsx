import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und rechtliche Angaben – ${siteConfig.name}.`,
};

export default function ImpressumPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Impressum
        </h1>

        <div className="mt-8 max-w-3xl space-y-8 text-neutral-700">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0F4F68]">
            Angaben gemäß § 5 DDG
          </p>

          <section className="space-y-1">
            <p className="font-semibold text-neutral-900">V. Maucher und Philip Sonntag GbR</p>
            <p className="font-semibold text-neutral-900">Alltagshilfe Süd</p>
            <p>Hinter den Gärten 10</p>
            <p>87730 Bad Grönenbach</p>
            <p>Deutschland</p>
          </section>

          <section>
            <p className="font-semibold text-neutral-900">Vertreten durch die Gesellschafter:</p>
            <p className="mt-1">Valentin Maucher</p>
            <p>Philip Sonntag</p>
          </section>

          <section className="space-y-1">
            <h2 className="text-lg font-bold text-[#0F4F68]">Kontakt</h2>
            <p>
              <strong>Telefon:</strong>{" "}
              <a href="tel:+4983349893330" className="text-[#0F4F68] hover:underline">
                08334 / 9893330
              </a>
            </p>
            <p>
              <strong>E-Mail:</strong>{" "}
              <a href="mailto:info@alltagshilfe-sued.de" className="text-[#0F4F68] hover:underline">
                info@alltagshilfe-sued.de
              </a>
            </p>
          </section>

          <section>
            <p><strong>IK-Nummer:</strong> 460956028</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F4F68]">Haftung für Inhalte</h2>
            <p className="mt-2">
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen
              Gesetzen verantwortlich. Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
              Gewähr für die Aktualität, Richtigkeit und Vollständigkeit der bereitgestellten
              Inhalte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F4F68]">Haftung für Links</h2>
            <p className="mt-2">
              Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
              Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden derartige Links
              umgehend entfernt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F4F68]">Urheberrecht</h2>
            <p className="mt-2">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website
              unterliegen dem deutschen Urheberrecht. Jede Art der Verwertung außerhalb der Grenzen
              des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen
              Rechteinhabers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F4F68]">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="mt-2">
              Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </Container>
    </article>
  );
}
