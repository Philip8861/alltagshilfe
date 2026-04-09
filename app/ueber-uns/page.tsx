import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Timeline } from "@/components/ueber-uns/Timeline";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Alltagshilfe-Süd: Hauswirtschaftsdienst, Betreuungsdienst und Pflegeberatung mit regionaler Stärke im Allgäu, Bodenseeraum, Augsburg und Engen/Konstanz.`,
};

export default function UeberUnsPage() {
  return (
    <article className="pt-0 pb-16 sm:pb-24">
      <Container>
        <section className="relative pt-0">
          <div className="flex justify-end">
            <div className="relative ml-auto w-full max-w-[50rem] lg:mr-[calc((100vw-100%)/-2)]">
              <div className="w-full [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))]">
                <Image
                  src="/images/über_uns.webp"
                  alt="Alltagshilfe-Süd Teamvorstellung"
                  width={900}
                  height={700}
                  className="block h-auto w-full object-contain object-right"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

          <header className="relative z-10 mt-8 max-w-2xl lg:absolute lg:left-0 lg:top-[46%] lg:mt-0 lg:-translate-y-1/2">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] opacity-0 animate-fade-in-up motion-reduce:opacity-100 sm:text-4xl">
              Die Alltagshilfe-Süd stellt sich vor
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-700 opacity-0 animate-fade-in-up motion-reduce:opacity-100" style={{ animationDelay: "0.12s" }}>
              Grüß Gott und herzlich willkommen! Wir freuen uns sehr über Ihren Besuch auf unserer Homepage und über
              Ihr Interesse an unserem Unternehmen. Gerne möchten wir Ihnen die Alltagshilfe-Süd näher vorstellen und
              Ihnen einen Einblick in unsere Arbeit, unsere Werte und unser Angebot geben.
            </p>
          </header>
        </section>

        <section
          className="relative z-20 left-1/2 right-1/2 mt-12 -ml-[50vw] -mr-[50vw] w-screen bg-[#F2F9FA] px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 lg:px-[var(--ahs-page-gutter)]"
          aria-label="Unternehmensgeschichte Alltagshilfe-Süd"
        >
          <svg
            className="pointer-events-none absolute left-0 top-0 h-14 w-full -translate-y-[68%] sm:h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
          </svg>
          <div
            className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-2 bg-gradient-to-b from-[#F2F9FA]/85 to-transparent"
            aria-hidden
          />
          <div className="mx-auto max-w-5xl space-y-5 text-neutral-700 opacity-0 animate-fade-in-up motion-reduce:opacity-100">
          <p>
            Die Alltagshilfe-Süd ist ein professioneller Hauswirtschafts-, Betreuungs- und Beratungsdienst für
            pflegebedürftige Menschen. Das Unternehmen entstand aus nahezu einem Jahrzehnt praktischer Erfahrung in der
            Pflege und verfolgt seit Beginn das Ziel, Menschen mit Unterstützungsbedarf eine verlässliche Versorgung,
            persönliche Begleitung und fachkundige Beratung im häuslichen Umfeld zu ermöglichen.
          </p>
          <p>
            Die erste Grundlage sowie die Zertifizierung erfolgten bereits im Jahr 2020. Am 01.04.2021
            wurde die Alltagshilfe-Süd offiziell von Philip Sonntag und Valentin Maucher gegründet. Beide sind
            examinierte Gesundheits- und Krankenpfleger und brachten von Anfang an ihre pflegerische Fachkompetenz,
            ihre Praxiserfahrung und ihr Verständnis für die tatsächlichen Bedürfnisse pflegebedürftiger Menschen in
            den Aufbau des Unternehmens ein. In den ersten Jahren waren die Gründer selbst täglich im Einsatz und
            konnten dadurch die Versorgungssituation in der Region unmittelbar mitgestalten.
          </p>
          <p>
            Mit der steigenden Nachfrage entwickelte sich das Unternehmen kontinuierlich weiter. Im Jahr 2022 eröffnete
            Frau Sonntag den Standort Wangen für die Bodenseeregion. Am 01.10.2023 wurde das Angebot um
            Pflegehilfsmittel erweitert. Ein bedeutender Meilenstein folgte am 03.06.2024: Seit diesem Zeitpunkt ist die
            Alltagshilfe-Süd offiziell anerkannte Pflegeberatungsstelle mit eigenen Pflegeberaterinnen und
            Pflegeberatern an allen Standorten.
          </p>
          <p>
            Im Jahr 2025 erfolgte zudem die Umbenennung von Alltagshilfe-Allgäu zu Alltagshilfe-Süd. Damit wurde die
            gewachsene regionale Ausrichtung des Unternehmens auch nach außen einheitlich sichtbar. Seit dem 01.12.2025
            ergänzt außerdem die betriebliche Pflegeberatung das Angebot. Damit unterstützt die Alltagshilfe-Süd
            Unternehmen sowie Beschäftigte, die Pflegeverantwortung übernehmen, durch fachlich fundierte Beratung und
            praxistaugliche Lösungen zur besseren Vereinbarkeit von Beruf und Pflegesituation.
          </p>
          <p>
            Zu Beginn des Jahres 2026 wurde die regionale Präsenz gezielt ausgebaut: Am 01.01.2026 eröffnete Frau
            Riegel den neuen Standort Augsburg. Ebenfalls am 01.01.2026 wurde der Standort Konstanz/Engen unter der
            Leitung von Frau Maucher eröffnet. Anfang 2026 folgte darüber hinaus der Umzug in größere Räumlichkeiten
            nach Bad Grönenbach, nachdem zuvor bereits 2024 der Umzug nach Sulzberg erfolgt war. Diese Entwicklung
            spiegelt das kontinuierliche Wachstum des Unternehmens und die steigende Bedeutung professioneller
            Unterstützungs- und Beratungsangebote für pflegebedürftige Menschen in Süddeutschland wider.
          </p>
          <p>
            Am 01.05.2026 folgte die Eröffnung unseres Pflegeshops. Heute steht die Alltagshilfe-Süd für fachlich fundierte Dienstleistungen, regionale Nähe und eine
            professionelle Pflegeberatung mit persönlichem Anspruch. Das Leistungsportfolio wird fortlaufend
            weiterentwickelt, unter anderem durch den geplanten Ausbau der Inkontinenzversorgung und weitere regionale
            Projekte. Der Anspruch bleibt dabei unverändert: pflegebedürftige Menschen kompetent, verlässlich und
            menschlich zu begleiten und ihnen eine bestmögliche Versorgung im eigenen Zuhause zu ermöglichen.
          </p>
          </div>
        </section>

        <Timeline />
      </Container>
    </article>
  );
}
