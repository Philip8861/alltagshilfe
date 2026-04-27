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
              Wenn Sie uns über unsere Website kontaktieren, verarbeiten wir die von Ihnen eingegebenen Daten zur
              Bearbeitung Ihrer Anfrage. Formulare finden Sie unter anderem auf der{" "}
              <strong className="text-neutral-900">Kontaktseite</strong>, auf{" "}
              <strong className="text-neutral-900">regionalen Standortseiten</strong> und in der{" "}
              <strong className="text-neutral-900">Kooperationspartner-Übersicht</strong>, im Bereich{" "}
              <strong className="text-neutral-900">Karriere/Bewerbung</strong> sowie im{" "}
              <strong className="text-neutral-900">geschützten Partnerportal</strong> (Kontakt für angemeldete
              Partnerbetriebe).
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
              <li>weitere freiwillige Angaben (z. B. Rückrufzeit, PLZ, Leistungswünsche, Ortszuordnung)</li>
              <li>bei Bewerbungen: Angaben zur gewünschten Stelle, ggf. Lebenslauf und Anhänge per E-Mail-Anhang</li>
              <li>
                beim Pflegebox-Konfigurator: gewählte Artikel und Budgetnutzung (Konfigurationsdaten); optional ein
                Partner-Code zur Zuordnung
              </li>
            </ul>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Kommunikation bzw. Bewerbung) bzw. Art. 6
              Abs. 1 lit. f DSGVO (Bearbeitung allgemeiner Anfragen).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">5. Spam-Schutz und Rate-Limiting</h2>
            <p>
              Zum Schutz vor Missbrauch setzen wir technische Schutzmaßnahmen ein (u. a. Honeypot-Feld und
              anfragebezogene Begrenzung je IP-Adresse). Für die öffentliche Reichweitenmessung (siehe Abschnitt 6) kann
              die IP-Adresse zusätzlich in einem begrenzten Zeitfenster gezählt werden, um Überlastung zu vermeiden.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Schutz unserer Systeme und Verhinderung von Spam/Missbrauch).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">6. Reichweitenmessung (aggregierte Nutzungsstatistik)</h2>
            <p>
              Für die <strong className="text-neutral-900">öffentlich zugänglichen Bereiche</strong> unserer Website
              (ohne Partnerportal und ohne technische Systempfade) können wir die Häufigkeit von Seitenaufrufen in
              <strong className="text-neutral-900"> aggregierter Form</strong> auswerten: Es werden der abgerufene Pfad
              (URL), der Kalendertag (Europe/Berlin) und eine grobe Gerätekategorie (z. B. Mobilgerät oder Desktop,
              abgeleitet aus den Browser-Kennungen) in einer Datenbank bei Supabase (EU) hochgezählt. Es werden{" "}
              <strong className="text-neutral-900">keine Profile</strong> gebildet und in dieser Statistik-Tabelle keine
              personenbezogenen Merkmale wie Namen oder vollständige IP-Adressen gespeichert.
            </p>
            <p>
              Die Zählung erfolgt nur, wenn Sie in den Cookie-Einstellungen der Website der Kategorie{" "}
              <strong className="text-neutral-900">Statistik</strong> zugestimmt haben (Einwilligung, Art. 6 Abs. 1 lit. a
              DSGVO i. V. m. § 25 Abs. 1 TTDSG, soweit anwendbar). Ohne diese Einwilligung findet keine dieser
              Auswertungen statt.
            </p>
            <p>
              Client-seitige Seitenwechsel innerhalb der Anwendung werden – ebenfalls nur bei erteilter Einwilligung –
              ergänzend per sicherer Schnittstelle gemeldet, damit Aufrufe ohne vollständigen Dokumenten-Reload
              berücksichtigt werden können.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">7. Cookies, lokale Speicher und Einwilligung</h2>
            <p>
              Wir verwenden ein Cookie und den lokalen Speicher des Browsers, um Ihre Entscheidung im
              Cookie-Hinweis (Kategorien Statistik, Übersetzung, Marketing) zu speichern und bei Folgebesuchen
              anzuwenden. Diese Speicherung ist für die abgestufte Einwilligung technisch angezeigt.
            </p>
            <p>
              Wenn Sie der Kategorie <strong className="text-neutral-900">Übersetzung</strong> zustimmen, kann zusätzlich
              ein Cookie <code className="rounded bg-neutral-100 px-1 text-sm">googtrans</code> gesetzt werden, um die
              Sprachwahl der Google-Übersetzungskomponente zu steuern.
            </p>
            <p>
              Marketing-Cookies setzen wir derzeit nicht ein; die Option im Hinweis dient der Vorbereitung künftiger
              Dienste und wird erst nach gesonderter Aktivierung und Aktualisierung dieser Erklärung genutzt.
            </p>
            <p>
              Rechtsgrundlage für nicht notwendige Cookies und ähnliche Techniken ist Ihre Einwilligung (Art. 6 Abs. 1 lit.
              a DSGVO, § 25 TTDSG). Notwendige Speicherungen zur Auswahl und zum Betrieb des Hinweises stützen wir auf Art.
              6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an transparenter, nachweisbarer Einstellung).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">8. Sprachversion und Übersetzung (Google)</h2>
            <p>
              Die <strong className="text-neutral-900">englischsprachige Darstellung</strong> unserer Inhalte (Pfade unter{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">/en</code>) und die Einbindung des{" "}
              <strong className="text-neutral-900">Google Website Translators</strong> (Skripte von Google) setzen wir nur
              ein, wenn Sie dem in den Cookie-Einstellungen zugestimmt haben. Dabei können Daten (z. B. IP-Adresse,
              Nutzungsdaten des Übersetzungs-Widgets) an Google übermittelt werden; Google kann Daten auch in Drittländern
              (insbesondere die USA) verarbeiten. Es gelten die Datenschutzhinweise von Google LLC / Google Ireland
              Limited; je nach Produkt können Standardvertragsklauseln und weitere Garantien zum Einsatz kommen.
            </p>
            <p>
              Zusätzlich kann unser Server zur dynamischen Übersetzung einzelner Textfragmente die Schnittstelle{" "}
              <strong className="text-neutral-900">Google Translate</strong> (
              <code className="rounded bg-neutral-100 px-1 text-sm">translate.googleapis.com</code>) aufrufen. Die
              übermittelten Inhalte sind die jeweils zu übersetzenden Texte der öffentlichen Seite; ein Aufruf erfolgt nur
              bei aktivierter Einwilligung „Übersetzung“.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">9. Karten (OpenStreetMap)</h2>
            <p>
              Auf Seiten mit regionalen Karten können Kartenausschnitte über{" "}
              <strong className="text-neutral-900">OpenStreetMap</strong>-Kacheln (OpenStreetMap Foundation) geladen werden.
              Beim Abruf der Kacheln wird technisch Ihre IP-Adresse an die Server von OpenStreetMap übermittelt.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Darstellung unserer
              Standorte). Weitere Informationen:{" "}
              <a
                href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
                className="text-[#0F4F68] underline"
                rel="noopener noreferrer"
              >
                OpenStreetMap Foundation – Privacy
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">10. Online-Videokonferenz (Jitsi)</h2>
            <p>
              Die Seite zur <strong className="text-neutral-900">Online-Videoberatung</strong> kann – nach Ihrer aktiven
              Auswahl – eine Verbindung zum Dienst <strong className="text-neutral-900">Jitsi Meet</strong> (
              <code className="rounded bg-neutral-100 px-1 text-sm">meet.jit.si</code>) herstellen. Es werden Skripte von
              Jitsi geladen; Audio-, Video- und Metadaten der Konferenz werden von den Betreibern von Jitsi bzw. der
              eingesetzten Infrastruktur verarbeitet. Bitte beachten Sie die Datenschutzhinweise von 8x8 / Jitsi. Nutzung
              und Übermittlung personenbezogener Daten in der Konferenz erfolgen auf Grundlage Ihrer aktiven Teilnahme
              (Art. 6 Abs. 1 lit. b bzw. lit. a DSGVO, je nach Kontext).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">11. Externe Links und eingebettete Angebote</h2>
            <p>
              Unsere Website enthält Verlinkungen zu externen Angeboten (z. B. Messenger, Stellenportale, Shop- oder
              Hilfsmittelanbieter, soziale Netzwerke). Beim Anklicken eines externen Links oder Buttons gelten die
              Datenschutzbestimmungen des jeweiligen Anbieters.
            </p>
            <p>
              Auf Inhalte und Datenverarbeitung dieser externen Anbieter haben wir keinen Einfluss.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">12. Speicherdauer</h2>
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie dies für die jeweiligen Zwecke erforderlich ist oder
              gesetzliche Aufbewahrungspflichten bestehen. Anschließend werden die Daten gelöscht oder datenschutzkonform gesperrt.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">13. Ihre Rechte</h2>
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
            <h2 className="text-xl font-bold text-[#0F4F68]">14. Beschwerderecht bei einer Aufsichtsbehörde</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen
              Daten zu beschweren (Art. 77 DSGVO).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">15. Datensicherheit</h2>
            <p>
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufällige oder
              vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">16. Geschützter Partnerbereich (Kooperationspartner)</h2>
            <p>
              Für angeschlossene Kooperationspartner stellen wir einen passwortgeschützten Bereich zur Verfügung
              (Anmeldung per E-Mail und Passwort). Dort können je nach Freigabe Informationen zu gemeinsamen
              Projekten (z. B. abgeschlossene Pflegebox-Konfigurationen) angezeigt werden. Für die interne Verwaltung
              kann ein separater geschützter Admin-Zugang bestehen; dieser Bereich ist nicht Gegenstand der
              öffentlichen Reichweitenmessung.
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
            <h2 className="text-xl font-bold text-[#0F4F68]">17. Stand und Aktualisierung</h2>
            <p>
              Diese Datenschutzerklärung hat den Stand: <strong className="text-neutral-900">27. April 2026</strong>. Wir
              behalten uns vor, den Inhalt bei Änderungen der Rechtslage oder der eingesetzten Dienste anzupassen.
            </p>
          </section>
        </div>
      </Container>
    </article>
  );
}
