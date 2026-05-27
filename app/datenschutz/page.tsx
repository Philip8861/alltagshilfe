import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { GtmMailtoLink, GtmPhoneLink } from "@/components/analytics/GtmContactIntentLink";

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
            welche Daten wir beim Besuch unserer Website verarbeiten, zu welchen Zwecken dies geschieht, auf welcher
            Rechtsgrundlage die Verarbeitung erfolgt und welche Rechte Ihnen nach der Datenschutz-Grundverordnung (DSGVO)
            zustehen.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="font-medium text-neutral-900">
              Valentin Maucher und Philip Sonntag GbR<br />
              Alltagshilfe Süd<br />
              Hinter den Gärten 10<br />
              87730 Bad Grönenbach
            </p>
            <p>
              Telefon:{" "}
              <GtmPhoneLink href="tel:+4983349893330" sourceComponent="datenschutz_tel" className="text-[#0F4F68] underline">
                08334 / 9893330
              </GtmPhoneLink>
              <br />
              E-Mail:{" "}
              <GtmMailtoLink
                href="mailto:info@alltagshilfe-sued.de"
                sourceComponent="datenschutz_email_header"
                className="text-[#0F4F68] underline"
              >
                info@alltagshilfe-sued.de
              </GtmMailtoLink>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
            <p>
              Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website
              sowie unserer Inhalte und Leistungen erforderlich ist oder soweit Sie uns Daten freiwillig mitteilen.
            </p>
            <p>
              Die Verarbeitung erfolgt insbesondere auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertrag, vorvertragliche
              Maßnahmen oder Anfrage), Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung), Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse) sowie – sofern eine Einwilligung eingeholt wird – Art. 6 Abs. 1 lit. a DSGVO.
            </p>
            <p>
              Sofern Sie uns freiwillig Angaben mitteilen, die Rückschlüsse auf Gesundheit, Pflegebedürftigkeit oder
              vergleichbare besonders schutzwürdige Umstände zulassen, verarbeiten wir diese Angaben nur, soweit dies zur
              Bearbeitung Ihrer Anfrage oder zur Durchführung angefragter Leistungen erforderlich ist. Bitte übermitteln Sie
              über unsere Formulare nur solche Angaben, die für Ihr Anliegen notwendig sind.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">3. Hosting, Domain/E-Mail und Server-Logdaten</h2>
            <p>
              Diese Website wird über die Hosting-Plattform <strong className="text-neutral-900">Vercel Inc.</strong>, USA,
              bereitgestellt. Beim Aufruf der Website werden Inhalte über die technische Infrastruktur und das globale
              Verteilnetzwerk von Vercel ausgeliefert. Dabei können technisch erforderliche Verbindungsdaten, insbesondere
              IP-Adresse, Zeitpunkt des Zugriffs, angeforderte URL, Browser- und Geräteinformationen sowie
              Referrer-Informationen verarbeitet werden.
            </p>
            <p>
              Mit Vercel besteht – soweit personenbezogene Daten im Rahmen der Auftragsverarbeitung verarbeitet werden –
              eine Vereinbarung zur Auftragsverarbeitung. Für etwaige Datenübermittlungen in Drittländer können
              Standardvertragsklauseln der EU-Kommission sowie ergänzende technische und organisatorische Maßnahmen zur
              Anwendung kommen.
            </p>
            <p>
              Die Domain und die genutzten E-Mail-Postfächer werden über{" "}
              <strong className="text-neutral-900">ALL-INKL.COM – Neue Medien Münnich</strong>, Deutschland, geführt. Bei
              der Nutzung von E-Mail-Kommunikation verarbeitet der Anbieter die üblichen technischen Übertragungs- und
              Metadaten der Nachricht.
            </p>
            <p>
              Beim Aufruf dieser Website werden technisch erforderliche Daten verarbeitet, um die Seite auszuliefern, die
              Stabilität zu gewährleisten und die Systemsicherheit zu schützen. Dazu können insbesondere gehören:
            </p>
            <ul className="list-disc pl-6">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>angeforderte URL oder Datei</li>
              <li>Browsertyp, Browserversion und Betriebssystem</li>
              <li>Referrer-URL</li>
              <li>technische Status- und Fehlercodes</li>
            </ul>
            <p>
              Für die Zustellung von Formularnachrichten an unsere E-Mail-Adressen wird ein SMTP-E-Mail-Versand genutzt.
              Der jeweilige Postfach- bzw. Hosting-Anbieter verarbeitet dabei die üblichen Übertragungs- und Metadaten der
              Nachricht.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im sicheren, stabilen und
              technisch fehlerfreien Betrieb der Website. Soweit die Verarbeitung zur Bearbeitung Ihrer Anfrage oder zur
              Durchführung vorvertraglicher Maßnahmen erforderlich ist, ist zusätzlich Art. 6 Abs. 1 lit. b DSGVO
              einschlägig.
            </p>
            <p>
              Bestimmte ältere Webadressen werden bei Aufruf automatisch per HTTP-Weiterleitung, z. B. Status 307 oder 308,
              auf die jeweils gültige Seite weitergeleitet. Dadurch werden keine zusätzlichen werblichen Tracking-Dienste
              eingeschaltet.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">4. Kontaktaufnahme über Formulare und E-Mail</h2>
            <p>
              Wenn Sie uns über unsere Website, per E-Mail oder telefonisch kontaktieren, verarbeiten wir die von Ihnen
              übermittelten Daten zur Bearbeitung Ihrer Anfrage.
            </p>
            <p>
              Formulare finden Sie unter anderem auf der Kontaktseite, auf regionalen Standortseiten, bei der betrieblichen
              Pflegeberatung, in der Kooperationspartner-Übersicht, im Bereich Karriere/Bewerbung sowie im geschützten
              Partnerportal für angemeldete Partnerbetriebe.
            </p>
            <p>Je nach Formular können insbesondere folgende Daten verarbeitet werden:</p>
            <ul className="list-disc pl-6">
              <li>Vorname und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Thema und Nachricht</li>
              <li>gewünschte Rückrufzeit</li>
              <li>Postleitzahl, Ort oder regionale Zuordnung</li>
              <li>gewünschte Leistungen oder sonstige freiwillige Angaben</li>
              <li>
                bei Bewerbungen: Angaben zur gewünschten Stelle, Bewerbungsunterlagen und bis zu zehn Dateianhänge,
                insgesamt bis 24 MB und pro Datei bis 8 MB, z. B. Lebenslauf, Zeugnisse oder Anschreiben
              </li>
              <li>
                beim Pflegebox-Konfigurator: gewählte Artikel, Budgetnutzung und Konfigurationsdaten sowie optional ein
                Partner-Code zur Zuordnung
              </li>
            </ul>
            <p>
              Ein separates CAPTCHA eines Drittanbieters, z. B. Google reCAPTCHA oder hCaptcha, wird nicht eingesetzt.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertrag, eine Leistung, eine
              Bewerbung oder vorvertragliche Maßnahmen gerichtet ist. Bei allgemeinen Anfragen ist Rechtsgrundlage Art. 6
              Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sachgerechten Bearbeitung eingehender Anfragen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">4a. Kontaktaufnahme per WhatsApp</h2>
            <p>
              Wenn Sie uns über den auf unserer Website angebotenen WhatsApp-Button oder QR-Code kontaktieren, nutzen wir
              den Messenger-Dienst WhatsApp zur schnellen Kommunikation. Anbieter ist die WhatsApp Ireland Limited, 4 Grand
              Canal Square, Grand Canal Harbour, Dublin 2, Irland (ein Tochterunternehmen der Meta Platforms Inc., USA).
            </p>
            <p>
              Bei der Nutzung von WhatsApp werden Ihre Telefonnummer sowie ggf. Ihr Name und Metadaten der Kommunikation an
              Server von Meta (teilweise auch in die USA) übertragen. Wir nutzen WhatsApp ausschließlich zur Beantwortung
              Ihrer konkreten Anfragen (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche Maßnahmen oder Art.
              6 Abs. 1 lit. f DSGVO bei allgemeinen Anfragen). Bitte beachten Sie, dass WhatsApp auf das Adressbuch unseres
              Mobilgeräts zugreifen kann. Wir bitten Sie, uns über diesen Kanal keine sensiblen Gesundheits- oder
              Pflegedaten (besondere Kategorien personenbezogener Daten gem. Art. 9 DSGVO) zu übermitteln. Weitere
              Informationen zur Datenverarbeitung finden Sie in der Datenschutzerklärung von WhatsApp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">5. Pflegebox-Konfigurator</h2>
            <p>
              Beim Abschluss des Pflegebox-Konfigurators werden Ihr Vor- und Nachname, gegebenenfalls ein freiwillig
              angegebener Kooperationspartner-Code sowie die von Ihnen gewählte Produktzusammenstellung gespeichert, damit
              wir die Anfrage bearbeiten und – soweit angegeben – einem Kooperationspartner zuordnen können.
            </p>
            <p>
              Die Speicherung kann in einer Datenbank bei unserem Auftragsverarbeiter{" "}
              <strong className="text-neutral-900">Supabase</strong> erfolgen, soweit der Dienst für diese Funktion
              eingerichtet ist. Die Datenbank wird nach unserer Konfiguration in einem EU-Rechenzentrum betrieben. Mit
              Supabase besteht – soweit personenbezogene Daten im Rahmen der Auftragsverarbeitung verarbeitet werden –
              eine Vereinbarung zur Auftragsverarbeitung.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Bearbeitung Ihrer Anfrage oder zur
              Durchführung vorvertraglicher Maßnahmen erforderlich ist. Soweit eine Zuordnung zu einem Kooperationspartner
              erfolgt, kann zusätzlich Art. 6 Abs. 1 lit. f DSGVO einschlägig sein. Unser berechtigtes Interesse liegt in der
              ordnungsgemäßen Bearbeitung und Zuordnung der Anfrage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">6. Bewerbungen</h2>
            <p>
              Wenn Sie sich über unsere Website oder per E-Mail bei uns bewerben, verarbeiten wir Ihre Bewerbungsdaten
              ausschließlich zur Durchführung des Bewerbungsverfahrens. Dazu gehören insbesondere Kontaktdaten,
              Bewerbungsunterlagen, Qualifikationen, Angaben zur gewünschten Stelle und die weitere Kommunikation mit Ihnen.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bzw. § 26 BDSG, soweit die Verarbeitung für die Entscheidung
              über die Begründung eines Beschäftigungsverhältnisses erforderlich ist.
            </p>
            <p>
              Kommt kein Beschäftigungsverhältnis zustande, löschen wir Bewerbungsunterlagen in der Regel spätestens sechs
              Monate nach Abschluss des Bewerbungsverfahrens, sofern keine gesetzlichen Aufbewahrungspflichten bestehen,
              keine Rechtsansprüche geltend gemacht werden oder Sie nicht ausdrücklich in eine längere Speicherung
              eingewilligt haben.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">7. Spam-Schutz und Rate-Limiting</h2>
            <p>
              Zum Schutz vor Missbrauch setzen wir technische Schutzmaßnahmen ein, unter anderem Honeypot-Felder und
              anfragebezogene Begrenzungen je IP-Adresse oder vergleichbare technische Merkmale. Dadurch sollen
              automatisierte Spam-Anfragen, Überlastung und missbräuchliche Nutzung verhindert werden.
            </p>
            <p>Es werden keine Dienste wie Google reCAPTCHA oder hCaptcha eingebunden.</p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im Schutz unserer Systeme,
              der Verhinderung von Spam und Missbrauch sowie der Sicherstellung der Funktionsfähigkeit unserer Website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">8. Reichweitenmessung und aggregierte Nutzungsstatistik</h2>
            <p>
              Für die öffentlich zugänglichen Bereiche unserer Website – ohne Partnerportal und ohne technische
              Systempfade – können wir die Häufigkeit von Seitenaufrufen in aggregierter Form auswerten.
            </p>
            <p>Dabei können insbesondere folgende Informationen verarbeitet werden:</p>
            <ul className="list-disc pl-6">
              <li>abgerufener Pfad bzw. URL</li>
              <li>Kalendertag nach der Zeitzone Europe/Berlin</li>
              <li>grobe Gerätekategorie, z. B. Mobilgerät oder Desktop, abgeleitet aus Browser-Kennungen</li>
              <li>Zählwert des Seitenaufrufs</li>
            </ul>
            <p>
              Diese Informationen werden in aggregierter Form in einer Datenbank bei Supabase hochgezählt. Es werden keine
              Nutzerprofile gebildet und in dieser Statistik-Tabelle keine Namen, E-Mail-Adressen oder vollständigen
              IP-Adressen gespeichert.
            </p>
            <p>
              Die Zählung erfolgt nur, wenn Sie in den Cookie-Einstellungen der Website der Kategorie „Statistik“
              zugestimmt haben.
            </p>
            <p>
              Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO sowie § 25 Abs. 1 TDDDG, soweit
              Informationen in Ihrem Endgerät gespeichert oder ausgelesen werden. Ohne diese Einwilligung findet diese
              Auswertung nicht statt.
            </p>
            <p>
              <strong className="text-neutral-900">Vercel Analytics</strong> und vergleichbare Onboarding-Analyse-Tools der
              Hosting-Plattform werden auf dieser Website nicht eingesetzt.
            </p>
            <p>
              Client-seitige Seitenwechsel innerhalb der Anwendung können – ebenfalls nur bei erteilter Einwilligung –
              ergänzend über eine sichere Schnittstelle gemeldet werden, damit Aufrufe ohne vollständigen Dokumenten-Reload
              berücksichtigt werden können.
            </p>
            <p>
              Zusätzlich werten wir aggregiert aus, über welche Quelle Anfragende auf uns aufmerksam geworden sind
              (Pflichtfrage in unseren Kontaktformularen, z. B. Google, Freunde &amp; Bekannte, Social Media, Plakat- oder
              Flyerwerbung, Medien, Pflegeberatung/Vermittlung, Per E-Mail, Sonstiges). Gespeichert werden ausschließlich
              <strong className="text-neutral-900"> aggregierte Zählwerte je Tag, Quelle und Formular-Typ</strong> in der
              Datenbank bei Supabase. Es werden weder Name, E-Mail-Adresse noch IP-Adresse zu diesen Zählwerten
              gespeichert; Rückschlüsse auf einzelne Personen sind ausgeschlossen. Rechtsgrundlage für diese
              Aggregat-Auswertung ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung unserer
              Marketingmaßnahmen). Ein Widerspruchsrecht nach Art. 21 DSGVO bleibt unberührt; bei Widerspruch löschen wir
              den entsprechenden Aggregat-Zähler nicht, da kein Personenbezug besteht.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">8a. Reichweitenmessung mit Google Analytics 4 (GA4)</h2>
            <p>
              Sofern aktiviert und nur bei Ihrer Einwilligung in die Kategorie „Statistik“ setzen wir den Webanalyse-Dienst
              <strong className="text-neutral-900"> Google Analytics 4</strong> der Google Ireland Limited, Gordon House,
              Barrow Street, Dublin 4, Irland („Google“) ein. Verarbeitet werden insbesondere gekürzte IP-Adresse,
              Geräte- und Browserinformationen, Referrer, aufgerufene Seiten, Verweildauer sowie aus diesen Angaben gebildete
              pseudonyme Kennungen. Eine Übermittlung an Google-Server, auch in den USA, ist möglich.
            </p>
            <p>
              Wir aktivieren in GA4 die <strong className="text-neutral-900">IP-Anonymisierung</strong> und nutzen den
              <strong className="text-neutral-900"> Google Consent Mode v2</strong>: Vor Ihrer Einwilligung sind die
              Speicherkategorien <em>analytics_storage</em>, <em>ad_storage</em>, <em>ad_user_data</em> und
              <em> ad_personalization</em> auf <em>denied</em> voreingestellt. Erst nach Ihrer Zustimmung werden die
              entsprechenden Kategorien auf <em>granted</em> gesetzt und das GA4-Skript geladen.
            </p>
            <p>
              Rechtsgrundlage für das Setzen oder Auslesen von Informationen in Ihrem Endgerät und die anschließende
              Verarbeitung ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO sowie § 25 Abs. 1 TDDDG. Sie können Ihre
              Einwilligung jederzeit mit Wirkung für die Zukunft über die Cookie-Einstellungen widerrufen.
            </p>
            <p>
              Weitere Informationen zur Datenverarbeitung durch Google finden Sie in der Datenschutzerklärung von Google
              unter{" "}
              <a
                href="https://policies.google.com/privacy"
                rel="noopener noreferrer"
                target="_blank"
                className="text-[#0F4F68] underline underline-offset-2 hover:text-[#F78F2E]"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">8b. Google Search Console</h2>
            <p>
              Zur Auswertung der Sichtbarkeit unserer Website in der Google-Suche nutzen wir die
              <strong className="text-neutral-900"> Google Search Console</strong>. Hierfür weisen wir Google die
              Eigentümerschaft an unserer Domain entweder per DNS-Eintrag oder durch ein Verifizierungs-Meta-Tag im
              <code className="rounded bg-neutral-100 px-1 text-sm">{`<head>`}</code> nach. Es werden <strong>keine</strong>
              {" "}personenbezogenen Daten unserer Besucherinnen und Besucher an Google übertragen, auch nicht
              {" "}IP-Adressen oder Endgerätedaten.
            </p>
            <p>
              In der Search Console erhalten wir aggregierte Auswertungen zu Suchanfragen, Klickraten, durchschnittlichen
              Positionen sowie zu Indexierungs- und Crawling-Status. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser
              berechtigtes Interesse liegt in der technischen Optimierung und Erreichbarkeit der Website über die
              Google-Suche.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">9. Cookies, lokale Speicher und Einwilligung</h2>
            <p>
              Wir verwenden Cookies und den lokalen Speicher Ihres Browsers, um Ihre Entscheidung im Cookie-Hinweis zu
              speichern und bei Folgebesuchen anzuwenden. Dabei können insbesondere Einstellungen zu den Kategorien
              Statistik, Übersetzung und Marketing gespeichert werden.
            </p>
            <p>
              Die Speicherung Ihrer Auswahl ist technisch erforderlich, um Ihre Entscheidung umzusetzen und zu
              dokumentieren. Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in
              einer transparenten und nachweisbaren Verwaltung Ihrer Datenschutz-Einstellungen.
            </p>
            <p>
              Für nicht notwendige Cookies, vergleichbare Speichertechniken und den Zugriff auf Informationen in Ihrem
              Endgerät ist Ihre Einwilligung erforderlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit §
              25 Abs. 1 TDDDG.
            </p>
            <p>
              Wenn Sie der Kategorie „Übersetzung“ zustimmen, kann zusätzlich ein Cookie namens „googtrans“ gesetzt
              werden, um die Sprachwahl der Google-Übersetzungskomponente zu steuern.
            </p>
            <p>
              Marketing-Cookies setzen wir derzeit nicht ein. Die Option im Cookie-Hinweis dient lediglich der Vorbereitung
              künftiger Dienste und wird erst nach gesonderter Aktivierung und Aktualisierung dieser Datenschutzerklärung
              genutzt.
            </p>
            <p>
              Sie können eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft über die Cookie-Einstellungen der
              Website ändern oder widerrufen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">10. Sprachversion und Übersetzung durch Google</h2>
            <p>
              Die englischsprachige Darstellung unserer Inhalte, insbesondere Pfade unter{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">/en</code>, und die Einbindung des Google Website
              Translators bzw. vergleichbarer Google-Übersetzungskomponenten erfolgen nur, wenn Sie der Kategorie
              „Übersetzung“ in den Cookie-Einstellungen zugestimmt haben.
            </p>
            <p>
              Bei aktivierter Übersetzungsfunktion können Verbindungen zu Diensten von Google hergestellt werden. Dabei
              können insbesondere Ihre IP-Adresse, technische Geräte- und Browserinformationen sowie Nutzungsdaten des
              Übersetzungs-Widgets an Google übermittelt werden. Google kann Daten auch in Drittländern, insbesondere den
              USA, verarbeiten.
            </p>
            <p>
              Anbieter können je nach Dienst Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland,
              und/oder Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA, sein.
            </p>
            <p>
              Zusätzlich kann unser Server zur dynamischen Übersetzung einzelner Textfragmente die Schnittstelle Google
              Translate bzw. Google Cloud Translation unter{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">translate.googleapis.com</code> aufrufen. Übermittelt
              werden dabei die jeweils zu übersetzenden Texte der öffentlichen Seite. Ein solcher Aufruf erfolgt nur bei
              aktivierter Einwilligung „Übersetzung“.
            </p>
            <p>
              Rechtsgrundlage für die Einbindung und die damit verbundenen Speicher- oder Zugriffsvorgänge ist Ihre
              Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 25 Abs. 1 TDDDG.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">11. Schriften und Google Fonts</h2>
            <p>
              Die Darstellung der Hauptwebsite nutzt die Schriftfamilie „Nunito Sans“ über die Next.js-Integration von
              Google Fonts. Die Schriftdateien werden nach unserer Konfiguration in der Regel über unsere eigene Website
              ausgeliefert, ohne dass Ihr Browser beim normalen Aufruf der Hauptwebsite zusätzliche Schriftdateien direkt
              von Google laden muss.
            </p>
            <p>
              Der Pflegebox-Konfigurator ist unter anderem über die Seite{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">/pflegehilfsmittel/pflegebox-konfigurator</code>{" "}
              eingebunden und lädt statische Dateien aus dem Pfad{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">/konfigurator/</code>. Dort können im HTML direkte
              Verweise auf <code className="rounded bg-neutral-100 px-1 text-sm">fonts.googleapis.com</code> und{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">fonts.gstatic.com</code> enthalten sein. Beim Aufruf
              dieses Konfigurators kann Ihr Browser daher eine Verbindung zu Google herstellen und technische Daten an
              Google übermitteln.
            </p>
            <p>
              Anbieter können je nach Dienst Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland,
              und/oder Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA, sein.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, soweit die Einbindung zur einheitlichen und ansprechenden
              Darstellung der Website erfolgt. Soweit hierfür eine Einwilligung erforderlich ist, erfolgt die Verarbeitung
              auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 25 Abs. 1 TDDDG.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">12. Karten</h2>
            <p>
              Wir binden derzeit keine eingebetteten interaktiven Karten mit Kartendaten von Drittanbietern, z. B. Google
              Maps oder OpenStreetMap-Kacheln, dauerhaft auf unseren Seiten ein. Sofern wir auf externe Kartendienste
              verlinken, gelten beim Aufruf dieser externen Dienste die Datenschutzbestimmungen des jeweiligen Anbieters.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">13. Online-Videokonferenz über Jitsi</h2>
            <p>
              Die öffentlich erreichbare Seite zur Online-Videoberatung wird nicht mehr angeboten und ist unter der
              früheren Adresse nicht mehr aufrufbar. Über diese Website wird derzeit keine Verbindung zum Dienst Jitsi Meet
              unter <code className="rounded bg-neutral-100 px-1 text-sm">meet.jit.si</code> hergestellt und es werden
              keine zugehörigen Skripte geladen.
            </p>
            <p>
              Soweit im Einzelfall eine Videokonferenz genutzt wird, gelten die Datenschutzhinweise des jeweiligen
              Anbieters (z. B. 8x8 / Jitsi).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">
              14. Externe Links, Messenger, Stellenportale, Shops und soziale Netzwerke
            </h2>
            <p>
              Unsere Website enthält Verlinkungen zu externen Angeboten, z. B. Messenger-Diensten, Stellenportalen,
              Shop- oder Hilfsmittelanbietern, sozialen Netzwerken oder anderen Websites.
            </p>
            <p>
              Wenn Sie einen externen Link oder Button anklicken, verlassen Sie unsere Website. Für die Datenverarbeitung
              auf den externen Seiten ist der jeweilige Anbieter verantwortlich. Es gelten die Datenschutzbestimmungen des
              jeweiligen Anbieters.
            </p>
            <p>Auf Inhalte und Datenverarbeitung dieser externen Anbieter haben wir keinen Einfluss.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">15. Newsletter und eingebettete Videos</h2>
            <p>Ein gesonderter Newsletter mit Anmeldung über diese Website wird derzeit nicht angeboten.</p>
            <p>
              YouTube-Videos oder andere Videoplayer werden derzeit nicht dauerhaft in unsere Seiten eingebettet. Falls wir
              auf externe Videoinhalte verlinken, gelten beim Aufruf die Datenschutzbestimmungen und Nutzungsbedingungen des
              jeweiligen Anbieters.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">16. Geschützter Partnerbereich für Kooperationspartner</h2>
            <p>
              Für angeschlossene Kooperationspartner stellen wir einen passwortgeschützten Bereich zur Verfügung. Die
              Anmeldung erfolgt per E-Mail-Adresse und Passwort.
            </p>
            <p>
              Im Partnerbereich können je nach Freigabe Informationen zu gemeinsamen Projekten angezeigt werden, z. B.
              abgeschlossene Pflegebox-Konfigurationen, die einem Kooperationspartner zugeordnet sind. Für die interne
              Verwaltung kann zusätzlich ein separater geschützter Admin-Zugang bestehen.
            </p>
            <p>
              Der geschützte Partnerbereich ist nicht Gegenstand der öffentlichen Reichweitenmessung. Die öffentliche
              Website bleibt ohne Zugangsdaten nutzbar. Der Partnerbereich ist für Suchmaschinen ausgeschlossen,
              insbesondere durch technische Maßnahmen wie <code className="rounded bg-neutral-100 px-1 text-sm">robots.txt</code>{" "}
              und <code className="rounded bg-neutral-100 px-1 text-sm">noindex</code>.
            </p>
            <p>
              Die technische Bereitstellung, insbesondere Authentifizierung und Datenbank, kann über Supabase erfolgen.
              Dabei können insbesondere folgende Daten verarbeitet werden:
            </p>
            <ul className="list-disc pl-6">
              <li>Nutzerkennung, z. B. UUID</li>
              <li>E-Mail-Adresse zur Anmeldung</li>
              <li>Passwortdaten in geschützter Form</li>
              <li>Anzeige- und Organisationsbezeichnung</li>
              <li>Rollen- und Berechtigungsinformationen</li>
              <li>fachliche Metadaten zu Konfigurationen, soweit diese dem Partner zugeordnet sind</li>
              <li>technische Protokoll- und Sicherheitsdaten</li>
            </ul>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Durchführung der Kooperation oder
              vorvertraglicher bzw. vertraglicher Maßnahmen erforderlich ist. Zusätzlich kann Art. 6 Abs. 1 lit. f DSGVO
              einschlägig sein. Unser berechtigtes Interesse liegt in einem sicheren Zugang, der Verwaltung von
              Partnerinformationen und dem Schutz vor Missbrauch.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">17. Speicherdauer</h2>
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie dies für die jeweiligen Zwecke erforderlich ist oder
              gesetzliche Aufbewahrungspflichten bestehen.
            </p>
            <p>
              Anfragen über Kontaktformulare oder per E-Mail speichern wir grundsätzlich nur so lange, wie dies zur
              Bearbeitung der Anfrage und etwaiger Anschlussfragen erforderlich ist. Handels- oder steuerrechtlich relevante
              Kommunikation kann entsprechend den gesetzlichen Aufbewahrungsfristen länger gespeichert werden.
            </p>
            <p>
              Bewerbungsdaten werden nach Abschluss des Bewerbungsverfahrens in der Regel spätestens nach sechs Monaten
              gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen, keine Rechtsansprüche geltend gemacht
              werden oder Sie nicht ausdrücklich in eine längere Speicherung eingewilligt haben.
            </p>
            <p>
              Technische Protokolldaten werden nur so lange gespeichert, wie dies zur Sicherstellung von Betrieb, Sicherheit
              und Fehleranalyse erforderlich ist.
            </p>
            <p>Nach Wegfall des jeweiligen Zwecks werden die Daten gelöscht oder datenschutzkonform gesperrt.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">18. Ihre Rechte</h2>
            <p>Sie haben nach der DSGVO insbesondere folgende Rechte:</p>
            <ul className="list-disc pl-6">
              <li>Recht auf Auskunft nach Art. 15 DSGVO</li>
              <li>Recht auf Berichtigung unrichtiger Daten nach Art. 16 DSGVO</li>
              <li>Recht auf Löschung nach Art. 17 DSGVO</li>
              <li>Recht auf Einschränkung der Verarbeitung nach Art. 18 DSGVO</li>
              <li>Recht auf Datenübertragbarkeit nach Art. 20 DSGVO</li>
              <li>Recht auf Widerspruch gegen bestimmte Verarbeitungen nach Art. 21 DSGVO</li>
              <li>Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft nach Art. 7 Abs. 3 DSGVO</li>
            </ul>
            <p>Wenn Sie eines dieser Rechte ausüben möchten, können Sie sich jederzeit an uns wenden:</p>
            <p>
              E-Mail:{" "}
              <GtmMailtoLink
                href="mailto:info@alltagshilfe-sued.de"
                sourceComponent="datenschutz_email_rights"
                className="text-[#0F4F68] underline"
              >
                info@alltagshilfe-sued.de
              </GtmMailtoLink>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">19. Widerspruchsrecht nach Art. 21 DSGVO</h2>
            <p>
              Wenn wir personenbezogene Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, haben Sie das
              Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen diese
              Verarbeitung einzulegen.
            </p>
            <p>
              Legen Sie Widerspruch ein, verarbeiten wir die betroffenen personenbezogenen Daten nicht mehr, es sei denn,
              wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und
              Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von
              Rechtsansprüchen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">20. Widerruf von Einwilligungen</h2>
            <p>
              Soweit eine Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese Einwilligung jederzeit mit Wirkung
              für die Zukunft widerrufen. Die Rechtmäßigkeit der Verarbeitung bis zum Zeitpunkt des Widerrufs bleibt
              unberührt.
            </p>
            <p>
              Einwilligungen zu Cookies, Statistik, Übersetzung oder vergleichbaren Funktionen können Sie über die
              Cookie-Einstellungen der Website ändern oder widerrufen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">21. Beschwerderecht bei einer Aufsichtsbehörde</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
              personenbezogenen Daten zu beschweren.
            </p>
            <p>Für nicht-öffentliche Stellen mit Sitz in Bayern ist in der Regel zuständig:</p>
            <p className="font-medium text-neutral-900">
              Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
              <br />
              Promenade 18
              <br />
              91522 Ansbach
              <br />
              Telefon: +49 (0) 981 180093-0
              <br />
              Website:{" "}
              <a
                href="https://www.lda.bayern.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F4F68] underline"
              >
                www.lda.bayern.de
              </a>
            </p>
            <p>
              Sie können sich auch an eine andere zuständige Datenschutz-Aufsichtsbehörde wenden, insbesondere in dem
              Mitgliedstaat Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
              Datenschutzverstoßes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">22. Datensicherheit</h2>
            <p>
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufällige oder
              vorsätzliche Manipulationen, Verlust, Zerstörung oder unbefugten Zugriff Dritter zu schützen.
            </p>
            <p>Unsere Sicherheitsmaßnahmen werden entsprechend der technischen Entwicklung fortlaufend angepasst.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F4F68]">23. Stand und Aktualisierung</h2>
            <p>
              Diese Datenschutzerklärung hat den Stand: <strong className="text-neutral-900">5. Mai 2026</strong>.
            </p>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich die Rechtslage, unsere Website, die
              eingesetzten Dienste oder unsere Datenverarbeitung ändern.
            </p>
          </section>
        </div>
      </Container>
    </article>
  );
}
