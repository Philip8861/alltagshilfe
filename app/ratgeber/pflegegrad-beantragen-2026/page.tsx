import type { Metadata } from "next";
import Link from "next/link";
import { PflegegradBeantragen2026Article } from "@/components/ratgeber/PflegegradBeantragen2026Article";
import { RatgeberArticleHero } from "@/components/ratgeber/RatgeberArticleHero";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonLd } from "@/lib/ratgeber/article-json-ld";

const CANONICAL_PATH = "/ratgeber/pflegegrad-beantragen-2026" as const;
const HERO_IMAGE = "/images/Ratgeber/ratgeber.webp";

const H1_TITLE =
  "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung für Angehörige";

const META_TITLE = "Pflegegrad beantragen 2026: Anleitung, Antrag & Tipps";
const META_DESCRIPTION =
  "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung für Angehörige. Antrag bei der Pflegekasse, Begutachtung, Leistungen, Fristen und FAQ.";

const EXCERPT =
  "Pflegegrad beantragen 2026: So stellen Angehörige den Antrag richtig. Mit Ablauf, Fristen, MD-/MDK-Begutachtung, Leistungen und Checkliste.";

const publishedISO = "2026-01-15T09:00:00+02:00";
const modifiedISO = "2026-04-29T12:00:00+02:00";

const FAQ_JSON_LD: { question: string; answer: string }[] = [
  {
    question: "Wie beantrage ich einen Pflegegrad?",
    answer:
      "Der Antrag geht über Ihre Pflegekasse – je nach Einrichtung formlos, telefonisch, schriftlich oder über ein Online-Portal.",
  },
  {
    question: "Wer darf einen Pflegegrad beantragen?",
    answer:
      "Die pflegebedürftige Versichertenperson eigenständig oder Bevollmächtige mit nachgewiesener Vollmacht bzw. gesetzliche Vertretung.",
  },
  {
    question: "Ab wann bekomme ich Leistungen?",
    answer:
      "In der Regel richtet sich der Beginn nach dem Bescheid; bei Erstantrag spielt der Zeitpunkt der Antragstellung eine Rolle, soweit ein Anspruch besteht.",
  },
  {
    question: "Wie lange dauert die Entscheidung?",
    answer:
      "Es gelten beschleunigte Bearbeitungsfristen gegenüber Pflegekassen – den Bearbeitungsstand erfragen Sie direkt dort.",
  },
  {
    question: "Was prüft der Medizinische Dienst?",
    answer:
      "Die Selbstständigkeit in konkreten Alltagshandlungen – nicht isoliert nach Diagnosen.",
  },
  {
    question: "Was mache ich, wenn der Pflegegrad abgelehnt wird?",
    answer:
      "Bescheid prüfen, Gutachten anfordern, Widerspruchsfrist beachten und Begründung ggf. nachreichen oder Widerspruch einlegen.",
  },
  {
    question: "Kann ich Pflegegrad 1 beantragen?",
    answer:
      "Ja, wenn eine geringe Beeinträchtigung der Selbstständigkeit vorliegt; Pflegegrad 1 kann bereits Zugänge zu Leistungen wie dem Entlastungsbetrag eröffnen.",
  },
  {
    question: "Welche Unterlagen brauche ich?",
    answer:
      "Arztberichte, Medikamentenplan, Krankenhaus-/Reha-Schreiben, Pflegetagebuch, Vollmacht sowie Nachweise über Hilfen und Hilfsmittel.",
  },
  {
    question: "Muss ich beim MD-Termin alles zeigen?",
    answer:
      "Die Alltagssituation sollte realistisch dargestellt werden – weder beschönigen noch dramatisieren.",
  },
  {
    question: "Kann ich Hilfe beim Antrag bekommen?",
    answer:
      "Ja – z. B. durch Pflegeberatung, die Pflegekasse, Pflegestützpunkte oder strukturierte Unterstützung vor Ort.",
  },
];

function absUrl(path: string): string {
  try {
    return new URL(path, `${siteConfig.baseUrl.replace(/\/?$/, "/")}`).href;
  } catch {
    return `${siteConfig.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    type: "article",
    locale: siteConfig.locale === "de" ? "de_DE" : siteConfig.locale,
    siteName: siteConfig.name,
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: absUrl(CANONICAL_PATH),
    publishedTime: publishedISO,
    modifiedTime: modifiedISO,
    images: [{ url: absUrl(HERO_IMAGE), alt: "Ratgeber: Pflegegrad beantragen 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [absUrl(HERO_IMAGE)],
  },
};

export default function PflegegradBeantragen2026RatgeberPage() {
  const jsonLd = serializeRatgeberArticleJsonLd({
    headline: H1_TITLE,
    description: META_DESCRIPTION,
    articleUrlPath: CANONICAL_PATH,
    datePublished: publishedISO,
    dateModified: modifiedISO,
    imageUrl: HERO_IMAGE,
    breadcrumbs: [
      { name: "Start", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: H1_TITLE, path: CANONICAL_PATH },
    ],
    faq: FAQ_JSON_LD,
  });

  return (
    <article className="min-w-0 bg-[#FFFBF7] pb-16 sm:pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container className="max-w-3xl pt-6 sm:pt-10">
        <nav aria-label="Brotkrumen" className="mb-8 text-sm text-neutral-600">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className="text-[#0F4F68] underline-offset-4 hover:underline">
                Start
              </Link>
            </li>
            <li aria-hidden className="px-1">
              /
            </li>
            <li>
              <Link href="/ratgeber" className="text-[#0F4F68] underline-offset-4 hover:underline">
                Ratgeber
              </Link>
            </li>
            <li aria-hidden className="px-1">
              /
            </li>
            <li className="font-medium text-[#0F4F68]">Pflegegrad beantragen 2026</li>
          </ol>
        </nav>
      </Container>

      <RatgeberArticleHero
        title={H1_TITLE}
        footer={
          <Link
            href="/ratgeber/pflegegrad-beantragen-checkliste"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/35 bg-white px-5 py-2.5 text-center text-base font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68] sm:min-h-[46px]"
          >
            Checkliste &amp; weiterführender Ratgeber
          </Link>
        }
      />

      <Container className="max-w-3xl pt-8 sm:pt-10">
        <p className="text-pretty text-lg leading-relaxed text-neutral-700">{EXCERPT}</p>
        <p className="mt-3 text-sm text-neutral-600">
          Lesedauer: ca. <span className="font-semibold text-[#0F4F68]">16 Min.</span>
        </p>
        <div className="mt-6 rounded-xl border border-[#0F4F68]/14 bg-[#F2F9FA]/50 p-4 text-sm leading-relaxed text-neutral-700">
          <strong className="text-[#0F4F68]">Orientierungshinweis:</strong> Hier finden Sie allgemeine Information – keine
          Rechtsberatung. Verbindliche Leistungen klärt Ihre Pflegekasse im Einzelfall.
        </div>

        <div className="mt-10 space-y-10">
          <PflegegradBeantragen2026Article />
        </div>

        <VerwandteRatgeberBeitraege currentSlug="pflegegrad-beantragen-2026" />
      </Container>
    </article>
  );
}
