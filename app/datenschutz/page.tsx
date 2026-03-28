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
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Datenschutzerklärung
        </h1>

        <div className="mt-8 max-w-4xl space-y-8 text-neutral-700">
          <p>
            Wir nehmen den Schutz Ihrer personenbezogenen Daten sehr ernst. Nachfolgend informieren wir Sie darüber,
            welche Daten wir beim Besuch unserer Website verarbeiten, zu welchen Zwecken dies geschieht und welche Rechte
            Ihnen nach der Datenschutz-Grundverordnung (DSGVO) zustehen.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="font-medium text-neutral-900">
              V. Maucher und Philip Sonntag GbR<br />
              Alltagshilfe Süd<br />
              Hinter den Gärten 10<br />
              87730 Bad Grönenbach
            </p>
            <p>
              Telefon: <a href="tel:+4983349893330" className="text-[#0F4F68] underline">08334 / 9893330</a><br />
              E-Mail: <a href="mailto:info@alltagshilfe-sued.de" className="text-[#0F4F68] underline">info@alltagshilfe-sued.de</a>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
            <p>
              Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website
              sowie unserer Inhalte und Leistungen erforderlich ist.
            </p>
            <p>
              Die Verarbeitung erfolgt auf Grundlage der DSGVO, insbesondere Art. 6 Abs. 1 lit. b (Vertrag/Anfrage),
              lit. c (rechtliche Verpflichtung), lit. f (berechtigtes Interesse) und – sofern eingeholt – lit. a (Einwilligung).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">3. Hosting und Server-Logdaten</h2>
            <p>
              Beim Aufruf dieser Website werden technisch erforderliche Daten verarbeitet, um die Seite auszuliefern und die
              Systemsicherheit zu gewährleisten. Dazu können insbesondere gehören:
            </p>
            <ul className="list-disc pl-6">
              <li>IP-Adresse (gekürzt/soweit technisch bedingt)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>angeforderte URL/Datei</li>
              <li>Browsertyp und Betriebssystem</li>
              <li>Referrer-URL</li>
            </ul>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem und stabilem Betrieb).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">4. Kontaktaufnahme über Formulare</h2>
            <p>
              Wenn Sie uns über Formulare (z. B. auf der Kontaktseite oder im Hilfe-Finder) kontaktieren, verarbeiten wir die
              von Ihnen eingegebenen Daten zur Bearbeitung Ihrer Anfrage.
            </p>
            <p>
              Beim <strong className="text-neutral-900">Abschluss des Pflegebox-Konfigurators</strong> werden Ihr
              Vor- und Nachname, gegebenenfalls ein freiwilliger Kooperationspartner-Code sowie die von Ihnen gewählte
              Produktzusammenstellung (Konfiguration) gespeichert, damit wir die Anfrage bearbeiten und – soweit angegeben –
              einem Kooperationspartner zuordnen können. Die Speicherung erfolgt in einer Datenbank bei unserem
              Auftragsverarbeiter (Supabase, EU), soweit der Dienst eingerichtet ist.
            </p>
            <p>Je nach Formular können insbesondere folgende Daten verarbeitet werden:</p>
            <ul className="list-disc pl-6">
              <li>Vorname, Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Thema und Nachricht</li>
              <li>weitere freiwillige Angaben (z. B. Rückrufzeit, PLZ, Leistungswünsche)</li>
              <li>
                beim Pflegebox-Konfigurator: gewählte Artikel und Budgetnutzung (Konfigurationsdaten); optional ein
                Partner-Code zur Zuordnung
              </li>
            </ul>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Kommunikation) bzw. Art. 6 Abs. 1 lit. f DSGVO
              (Bearbeitung allgemeiner Anfragen).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">5. Spam-Schutz und Rate-Limiting</h2>
            <p>
              Zum Schutz vor Missbrauch setzen wir technische Schutzmaßnahmen ein (u. a. Honeypot-Feld und
              anfragebezogene Begrenzung je IP-Adresse). Hierzu wird die IP-Adresse kurzfristig verarbeitet.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Schutz unserer Systeme und Verhinderung von Spam/Missbrauch).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">6. Cookies und Tracking</h2>
            <p>
              Nach aktuellem Stand setzen wir keine nicht notwendigen Tracking- oder Marketing-Cookies ein.
              Sollten künftig Analyse- oder Marketingdienste eingeführt werden, erfolgt dies nur auf Basis eines
              entsprechenden Consent-Mechanismus und mit Aktualisierung dieser Datenschutzerklärung.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">7. Externe Links und Drittinhalte</h2>
            <p>
              Unsere Website enthält Verlinkungen zu externen Websites (z. B. WhatsApp, Indeed oder externe Shop-Seiten).
              Beim Anklicken eines externen Links gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
            </p>
            <p>
              Auf Inhalte und Datenverarbeitung dieser externen Anbieter haben wir keinen Einfluss.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">8. Speicherdauer</h2>
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie dies für die jeweiligen Zwecke erforderlich ist oder
              gesetzliche Aufbewahrungspflichten bestehen. Anschließend werden die Daten gelöscht oder datenschutzkonform gesperrt.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">9. Ihre Rechte</h2>
            <p>Sie haben nach der DSGVO insbesondere folgende Rechte:</p>
            <ul className="list-disc pl-6">
              <li>Auskunft (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen Verarbeitungen (Art. 21 DSGVO)</li>
              <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">10. Beschwerderecht bei einer Aufsichtsbehörde</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen
              Daten zu beschweren (Art. 77 DSGVO).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">11. Datensicherheit</h2>
            <p>
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufällige oder
              vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">12. Geschützter Partnerbereich (Kooperationspartner)</h2>
            <p>
              Für angeschlossene Kooperationspartner stellen wir einen passwortgeschützten Bereich zur Verfügung
              (Anmeldung per E-Mail und Passwort). Dort können je nach Freigabe Informationen zu gemeinsamen
              Projekten (z. B. abgeschlossene Pflegebox-Konfigurationen) angezeigt werden.
            </p>
            <p>
              <strong className="text-neutral-900">Auftragsverarbeitung / Hosting der Daten:</strong> Die technische
              Bereitstellung (Authentifizierung und Datenbank) kann über den Dienst{" "}
              <strong className="text-neutral-900">Supabase</strong> (PostgreSQL, EU-Rechenzentrum, z. B. Frankfurt)
              erfolgen. Es besteht mit dem Anbieter ein Auftragsverarbeitungsvertrag (Standardvertragsklauseln /
              DPA), soweit personenbezogene Daten im Partnerkontext verarbeitet werden. Verarbeitete Daten können
              insbesondere sein: Nutzerkennung (UUID), E-Mail-Adresse zur Anmeldung, ggf. Anzeige- und
              Organisationsbezeichnung sowie fachliche Metadaten zu Konfigurationen, soweit diese dem Partner
              zugeordnet sind.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung der Kooperation / vorvertragliche und
              vertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Zugang und
              Missbrauchsschutz), soweit keine andere Grundlage greift.
            </p>
            <p>
              Die öffentliche Website bleibt ohne diese Zugangsdaten nutzbar; der Partnerbereich ist für Suchmaschinen
              ausgeschlossen (<code className="rounded bg-neutral-100 px-1 text-sm">robots.txt</code>,{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">noindex</code>).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">13. Stand und Aktualisierung</h2>
            <p>
              Diese Datenschutzerklärung hat den Stand: {new Date().toLocaleDateString("de-DE")}. Wir behalten uns vor,
              den Inhalt bei Änderungen der Rechtslage oder der eingesetzten Dienste anzupassen.
            </p>
          </section>
        </div>
      </Container>
    </article>
  );
}
