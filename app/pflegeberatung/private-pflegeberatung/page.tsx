import type { Metadata } from "next";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { Container } from "@/components/layout/Container";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PRIVATE_PFLEGEBERATUNG_FAQ } from "@/lib/private-pflegeberatung-faq";
import { siteConfig } from "@/config/site";

const PAGE_PATH = "/pflegeberatung/private-pflegeberatung";

export const metadata: Metadata = {
  title: "Private Pflegeberatung nach Paragraf 37 Absatz 3 SGB XI",
  description:
    "Pflegeberatung mit Herz: Angehörige entlasten und Pflegegeld sichern. Kostenlos über die Pflegekasse – mit Erinnerungssystem, fester Ansprechperson und optionalem Videocall.",
  alternates: { canonical: PAGE_PATH },
};

const VORTEILE = [
  "Wir erinnern Sie verlässlich an alle bevorstehenden Termine",
  "Wir schicken Ihnen ausschließlich hoch qualifizierte Pflegeberater und Pflegeberaterinnen",
  "Schnelle Terminvergabe ganz ohne lange Wartezeiten",
  "Es entstehen für Sie keinerlei Kosten, die Krankenkasse übernimmt diese komplett",
  "Wir helfen Ihnen tatkräftig bei Formularen, Anträgen und auch bei einem komplexen Widerspruch",
  "Sie profitieren von einem engen Kontakt und behalten stets Ihre gleichbleibende feste Ansprechperson",
  "Maximale Flexibilität: Jede zweite Beratung kann ganz bequem per Videocall stattfinden",
] as const;

const pflegegradCards = [
  {
    title: "Pflegegrad 1",
    body: "Der Einsatz ist nicht gesetzlich verpflichtend. Sie dürfen die kostenlose Beratung jedoch bis zu zweimal im Jahr freiwillig in Anspruch nehmen.",
  },
  {
    title: "Pflegegrad 2 und 3",
    body: "Der Beratungseinsatz ist halbjährlich verpflichtend.",
  },
  {
    title: "Pflegegrad 4 und 5",
    body: "Der Beratungseinsatz ist vierteljährlich verpflichtend.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRIVATE_PFLEGEBERATUNG_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 6.848-9.787a.75.75 0 011.052-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function VideoCallBadge() {
  return (
    <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#0F4F68]/20 bg-gradient-to-br from-[#F2F9FA] to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white" aria-hidden>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </span>
        <div>
          <p className="text-sm font-bold text-[#0F4F68]">Beratung per Videocall</p>
          <p className="mt-1 text-sm text-neutral-600">
            Ab dem zweiten Termin darf jede zweite Beratung digital per Videocall erfolgen – unkompliziert und zeitsparend.
          </p>
        </div>
      </div>
      <Link
        href="/pflegeberatung/online-videoberatung"
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center self-start rounded-xl bg-[#F78F2E] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:self-center"
      >
        Zur Online-Videoberatung
      </Link>
    </div>
  );
}

export default function PrivatePflegeberatungPage() {
  return (
    <article className="pb-20 sm:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Block 1: Hero */}
      <header className="border-b border-[#0F4F68]/10 bg-white">
        <Container className="py-12 sm:py-16 lg:py-20">
          <nav className="text-sm text-neutral-500" aria-label="Brotkrumen">
            <ol className="flex flex-wrap gap-x-1 gap-y-1">
              <li>
                <Link href="/" className="hover:text-[#0F4F68]">
                  Start
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/pflegeberatung" className="hover:text-[#0F4F68]">
                  Pflegeberatung
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-neutral-700">Private Pflegeberatung</li>
            </ol>
          </nav>
          <h1 className="mt-6 max-w-4xl text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
            Pflegeberatung nach Paragraf 37 Absatz 3 SGB XI
          </h1>
          <p className="mt-4 max-w-3xl text-xl font-semibold text-neutral-800 sm:text-2xl">
            Gute Pflege beginnt mit einer guten Pflegeberatung.
          </p>
          <p className="mt-3 max-w-2xl text-lg font-medium text-[#0F4F68]/90 sm:text-xl">
            Beratung mit Herz: Angehörige entlasten und Pflegegeld sichern.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
            >
              Termin anfragen
            </Link>
            <Link
              href="/pflegeberatung"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#0F4F68]/25 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Alle Pflegeberatungs-Angebote
            </Link>
          </div>
        </Container>
      </header>

      {/* Block 2 */}
      <section className="py-14 sm:py-16" aria-labelledby="philosophie-heading">
        <Container>
          <h2 id="philosophie-heading" className="sr-only">
            Unsere Philosophie und Qualität
          </h2>
          <div className="mx-auto max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
            <p>
              Die Qualität unserer Pflegeberatung liegt uns besonders am Herzen. Sehr viele pflegende Angehörige wissen gar
              nicht genau, welche gesetzlichen Leistungen ihnen eigentlich zustehen und verschenken bares Geld. Oftmals wird
              man im Internet falsch oder unzureichend informiert. Noch schlimmer sind Beratungsstellen, die nur auf eine
              schnelle Unterschrift aus sind, ohne wirklich zu helfen. Wir machen das anders: Wir nehmen uns die nötige Zeit
              für Sie. Unser Ziel ist es, Sie umfassend, ehrlich und auf Augenhöhe zu beraten, damit Sie im Alltag optimal
              entlastet werden.
            </p>
          </div>
        </Container>
      </section>

      {/* Block 3 */}
      <section className="border-y border-[#0F4F68]/10 bg-[#F2F9FA]/40 py-14 sm:py-16" aria-labelledby="vorteile-heading">
        <Container>
          <h2 id="vorteile-heading" className="text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl">
            Ihre Vorteile bei uns
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {VORTEILE.map((text) => (
              <li
                key={text}
                className="flex gap-3 rounded-xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm sm:p-5"
              >
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#F78F2E]" />
                <span className="text-sm font-medium leading-snug text-neutral-800 sm:text-base">{text}</span>
              </li>
            ))}
          </ul>
          <VideoCallBadge />
        </Container>
      </section>

      {/* Block 4 */}
      <section className="py-14 sm:py-16" aria-labelledby="pflicht-heading">
        <Container>
          <h2 id="pflicht-heading" className="text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl">
            Wann ist die Beratung verpflichtend?
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pflegegradCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-[0_4px_20px_rgba(15,79,104,0.06)] sm:p-6"
              >
                <h3 className="text-lg font-bold text-[#0F4F68]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border-l-4 border-[#F78F2E] bg-[#FFFBF7] p-5 sm:p-6">
            <p className="text-sm font-bold text-[#0F4F68]">Wichtiger Hinweis</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 sm:text-base">
              Wenn Sie wichtige Fristen versäumen, kann die Kasse Ihr Pflegegeld kürzen oder vorübergehend aussetzen. Damit
              Ihnen das auf keinen Fall passiert, greift unser verlässliches Erinnerungssystem. Gut zu wissen: Damit Sie noch
              flexibler sind, darf jeder zweite Termin ganz unkompliziert digital als Videocall durchgeführt werden.
            </p>
          </div>
        </Container>
      </section>

      {/* Block 5 */}
      <section className="border-t border-[#0F4F68]/10 bg-white py-14 sm:py-16" aria-labelledby="bewertungen-heading">
        <Container>
          <h2 id="bewertungen-heading" className="text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl">
            Unsere Bewertungen
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Überzeugen Sie sich selbst von unserer Qualität. Hier erfahren Sie aus erster Hand, was andere Familien über
            unsere Arbeit, unsere Unterstützung und unsere Pflegeberatung sagen.
          </p>
          <div className="mt-8">
            <KundenstimmenCarousel embedded />
          </div>
          <div
            id="bewertungen-plugin-slot"
            className="mt-10 rounded-xl border border-dashed border-[#0F4F68]/25 bg-[#F2F9FA]/30 p-6 text-center text-sm text-neutral-600"
          >
            <p>
              Platz für ein externes Bewertungswidget (z. B. ProvenExpert oder eingebettete Karten). Der Entwickler kann den
              Anbieter-Code hier einfügen, ohne die übrigen Inhalte zu ändern.
            </p>
          </div>
        </Container>
      </section>

      {/* Block 6: FAQ */}
      <section className="border-t border-[#0F4F68]/10 bg-[#fafbfc] py-14 sm:py-16" aria-labelledby="faq-heading">
        <Container>
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl">
            Häufig gestellte Fragen rund um die Pflegeberatung
          </h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion items={PRIVATE_PFLEGEBERATUNG_FAQ} />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-600">
            Weitere Fragen? Wir sind für Sie da:{" "}
            <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#F78F2E]">
              Kontakt zu {siteConfig.name}
            </Link>
            .
          </p>
        </Container>
      </section>
    </article>
  );
}
