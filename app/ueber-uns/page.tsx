import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Alltagshilfe Süd: Hauswirtschaftsdienst, Betreuungsdienst und Pflegeberatung mit regionaler Stärke im Allgäu, Bodenseeraum, Augsburg und Engen/Konstanz.`,
};

export default function UeberUnsPage() {
  const meilensteine = [
    { titel: "2020", text: "Erste Idee und Zertifizierung als Grundlage für den Aufbau.", icon: "start" },
    { titel: "01.04.2021", text: "Offizielle Gründung durch Philip Sonntag und Valentin Maucher.", icon: "gruendung" },
    { titel: "01.04.2022", text: "Eröffnung des Standorts Wangen für die Bodenseeregion.", icon: "standort" },
    { titel: "01.10.2023", text: "Start der kostenfreien Pflegeboxen aus eigenem Lager im Allgäu.", icon: "box" },
    { titel: "03.06.2024", text: "Anerkennung als Pflegeberatungsstelle mit eigenen Beraterinnen und Beratern.", icon: "beratung" },
    { titel: "2025", text: "Namensänderung von Alltagshilfe-Allgäu zu Alltagshilfe-Süd.", icon: "rename" },
    { titel: "01.12.2025", text: "Aufbau der betrieblichen Pflegeberatung für Unternehmen.", icon: "business" },
    { titel: "01.01.2026", text: "Gründung der Standorte Engen/Konstanz und Augsburg.", icon: "standort" },
    { titel: "01.01.2026", text: "Eröffnung des Standortes Engen/Konstanz und Augsburg.", icon: "standort" },
    { titel: "Anfang 2026", text: "Umzug in größere Räumlichkeiten nach Bad Grönenbach.", icon: "move" },
  ] as const;

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
            <p className="inline-flex rounded-full bg-[#0F4F68]/8 px-4 py-1 text-sm font-semibold text-[#0F4F68]">
              Alltagshilfe Süd
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
              Die Alltagshilfe-Süd stellt sich vor
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-700">
              Grüß Gott und herzlich willkommen! Wir freuen uns sehr über Ihren Besuch auf unserer Homepage und über
              Ihr Interesse an unserem Unternehmen. Gerne möchten wir Ihnen die Alltagshilfe-Süd näher vorstellen und
              Ihnen einen Einblick in unsere Arbeit, unsere Werte und unser Angebot geben.
            </p>
          </header>
        </section>

        <section className="relative mt-12 max-w-5xl overflow-hidden rounded-3xl border border-[#0F4F68]/10 bg-[#F2F9FA] p-6 sm:p-8" aria-label="Unternehmensgeschichte Alltagshilfe Süd">
          <svg
            className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-[70%] sm:h-14"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d="M0,120 C240,36 430,12 600,25 C820,42 1015,94 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
          </svg>
          <div className="space-y-5 text-neutral-700">
          <p>
            Die Alltagshilfe Süd ist ein professioneller Hauswirtschaftsdienst und Betreuungsdienst, der 2021 aus
            fast einem Jahrzehnt praktischer Erfahrung in der Pflege entstanden ist. Unser Ziel ist klar: Menschen
            mit Unterstützungsbedarf ein sicheres, selbstbestimmtes und möglichst unabhängiges Leben im gewohnten
            Zuhause zu ermöglichen.
          </p>
          <p>
            Die erste Idee und Zertifizierung erfolgte bereits 2020. Am 01.04.2021 wurde die Alltagshilfe Süd
            offiziell von Philip Sonntag und Valentin Maucher gegründet - beide Gesundheits- und Krankenpfleger mit dem
            Anspruch, den Pflegealltag von Familien spürbar zu entlasten. In den Anfangsjahren waren die Gründer
            täglich selbst im Einsatz und konnten so die Bedürfnisse in der Region sehr genau kennenlernen.
          </p>
          <p>
            Mit der steigenden Nachfrage wuchs unser Unternehmen kontinuierlich weiter: 2022 kam der Standort Wangen
            für die Bodenseeregion hinzu, 2024 folgte der Umzug nach Sulzberg und Anfang 2026 der nächste Schritt in
            größere Räumlichkeiten nach Bad Grönenbach. Heute verbinden wir lokale Nähe mit professionellen Prozessen
            und persönlicher Betreuung.
          </p>
          <p>
            Unser Leistungsportfolio wurde gezielt erweitert: Seit 01.10.2023 bieten wir kostenfreie Pflegeboxen an,
            seit 03.06.2024 sind wir offiziell anerkannte Pflegeberatungsstelle mit eigenen Pflegeberaterinnen und
            Pflegeberatern an allen Standorten. 2025 erfolgte außerdem die Namensänderung von Alltagshilfe-Allgäu zu
            Alltagshilfe-Süd. Mit der betrieblichen Pflegeberatung unterstützen wir seit 01.12.2025
            zusätzlich Unternehmen dabei, Beruf und Pflege besser zu vereinbaren.
          </p>
          <p>
            Auch in Zukunft bleiben wir in Bewegung: Mit der Inkontinenzversorgung und weiteren regionalen Projekten
            entwickeln wir unsere Angebote stetig weiter. Dabei bleibt unser Anspruch unverändert: verlässlich,
            menschlich und hochprofessionell im Pflegealltag für Familien in Süddeutschland.
          </p>
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden rounded-3xl border border-[#0F4F68]/10 bg-[#F2F9FA] p-6 sm:p-8" aria-label="Unsere Standorte stellen sich vor">
          <svg
            className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-[60%] sm:h-14"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d="M0,120 C230,34 430,12 620,24 C830,38 1015,88 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
          </svg>
          <h2 className="text-3xl font-bold text-[#0F4F68] sm:text-4xl">Unsere Standorte stellen sich vor</h2>
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_10px_25px_rgba(15,79,104,0.12)]">
              <Image src="/images/standort_gemeinsam.webp" alt="Platzhalterbild Standort Allgäu" width={1200} height={700} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0F4F68]">Standort Allgäu stellt sich vor</h3>
                <p className="mt-2 text-sm text-neutral-600">Standortleitung: Name folgt</p>
                <p className="mt-3 text-neutral-700 italic">"Wir möchten Menschen in ihrer vertrauten Umgebung stärken und ihnen echte Sicherheit im Alltag geben."</p>
              </div>
            </article>
            <article className="overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_10px_25px_rgba(15,79,104,0.12)]">
              <Image src="/images/startseite_front.webp" alt="Platzhalterbild Standort Wangen" width={1200} height={700} className="h-44 w-full object-cover" unoptimized />
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0F4F68]">Standort Wangen stellt sich vor</h3>
                <p className="mt-2 text-sm text-neutral-600">Standortleitung: Name folgt</p>
                <p className="mt-3 text-neutral-700 italic">"Wir tun, was wir tun, weil jede Familie schnelle, verlässliche und menschliche Unterstützung verdient."</p>
              </div>
            </article>
            <article className="overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_10px_25px_rgba(15,79,104,0.12)]">
              <Image src="/images/Kontakt_Bild.webp" alt="Platzhalterbild Standort Augsburg" width={1200} height={700} className="h-44 w-full object-cover" unoptimized />
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0F4F68]">Standort Augsburg stellt sich vor</h3>
                <p className="mt-2 text-sm text-neutral-600">Standortleitung: Name folgt</p>
                <p className="mt-3 text-neutral-700 italic">"Unser Antrieb ist es, Pflegealltag leichter zu machen - professionell, herzlich und nah am Menschen."</p>
              </div>
            </article>
            <article className="overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_10px_25px_rgba(15,79,104,0.12)]">
              <Image src="/images/standort_gemeinsam.webp" alt="Platzhalterbild Standort Engen/Konstanz" width={1200} height={700} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0F4F68]">Standort Engen/Konstanz stellt sich vor</h3>
                <p className="mt-2 text-sm text-neutral-600">Standortleitung: Name folgt</p>
                <p className="mt-3 text-neutral-700 italic">"Wir begleiten mit Haltung und Herz, damit Selbstbestimmung und Lebensqualität erhalten bleiben."</p>
              </div>
            </article>
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden rounded-3xl border border-[#0F4F68]/12 bg-white p-7 sm:p-9" aria-label="Meilensteine">
          <svg
            className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-[60%] sm:h-14"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d="M0,120 C230,34 430,12 620,24 C830,38 1015,88 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
          </svg>
          <h2 className="text-3xl font-bold text-[#0F4F68] sm:text-4xl">Unsere Meilensteine</h2>
          <ul className="mt-7 space-y-6">
            {meilensteine.map((punkt, idx) => (
              <li
                key={`${punkt.titel}-${punkt.text}`}
                className="relative flex items-start gap-4 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/55 px-4 py-4 text-neutral-700 shadow-[0_6px_16px_rgba(15,79,104,0.08)] sm:gap-5 sm:px-5"
              >
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/20 text-lg font-extrabold text-[#0F4F68] ring-1 ring-[#F78F2E]/45 sm:h-12 sm:w-12">
                  {idx + 1}
                </span>
                <span className="pt-0.5 text-base sm:text-lg">
                  <strong className="text-[#0F4F68]">{punkt.titel}:</strong>{" "}
                  <span className="leading-relaxed">{punkt.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </article>
  );
}
