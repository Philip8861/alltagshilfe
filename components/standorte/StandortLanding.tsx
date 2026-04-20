import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/config/site";
import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";
import { STARTSEITE_VORTEILE } from "@/lib/startseite-vorteile";
import { LeistungenKachelGrid } from "@/components/home/LeistungenKachelGrid";
import { phoneHrefToWhatsAppUrl, type Standort } from "@/config/standorte";
import { getPlzOrtMapLines, getPlzOrtMapsEmbedSrc } from "@/config/plz-ort-map-centers";

const CONTACT_ANCHOR = "#standort-kontakt";
const HAUSHALTSHILFE_URL = "/leistungen/haushaltshilfe";

const HERO_VORTEILE = [
  "Freie Kapazitäten & kurze Wartezeiten",
  "Zugelassen bei allen Krankenkassen",
  "Feste Bezugsperson statt ständiger Wechsel",
] as const;

const WELLEN_D =
  "M0,100 C200,26 420,6 600,18 C800,32 1010,75 1200,100 L1200,100 L0,100 Z";

const WELLEN_SVG_CLASS =
  "pointer-events-none absolute left-0 top-0 z-0 h-16 w-full -translate-y-7 sm:h-[clamp(2.85rem,1.5rem+3.8vw,5rem)] sm:-translate-y-[clamp(0.9rem,0.35rem+2.1vw,3.2rem)]";

const LINK_CLASS =
  "font-semibold text-[#0F4F68] underline underline-offset-2 decoration-[#0F4F68]/40 hover:decoration-[#F78F2E] hover:text-[#0c3d52]";

function HeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

type FaqItem = { q: string; answerPlain: string; answer: ReactNode };

function buildStandortFaq(input: {
  plz: string;
  ort: string;
  standort: Standort;
  contactHref: string;
}): FaqItem[] {
  const { plz, ort, standort, contactHref } = input;
  const bueroOrt = standort.schemaAddress.addressLocality;

  return [
    {
      q: `Wer ist für ${ort} und die PLZ ${plz} zuständig?`,
      answerPlain: `Anfragen aus diesem Gebiet werden von ${standort.name} koordiniert (Büro ${bueroOrt}). Sie erreichen das Team über die auf dieser Seite angegebene Telefonnummer und E-Mail.`,
      answer: (
        <>
          Ihre Anfrage aus <strong>{ort}</strong> (PLZ <strong>{plz}</strong>) bearbeitet{" "}
          <strong>{standort.name}</strong> mit Sitz in <strong>{bueroOrt}</strong>. Telefon und E-Mail auf dieser Seite
          führen direkt zu diesem Büro.
        </>
      ),
    },
    {
      q: "Welche Leistungen kann ich hier anfragen?",
      answerPlain:
        "Haushaltshilfe, Alltagsbegleitung, Pflegeberatung nach SGB XI und kostenfreie Pflegehilfsmittel – je nach Voraussetzung. Details zu Ablauf und Umfang finden Sie auf der ausführlichen Haushaltshilfe-Seite.",
      answer: (
        <>
          Unter anderem <strong>Haushaltshilfe</strong>, <strong>Alltagsbegleitung</strong>,{" "}
          <strong>Pflegeberatung</strong> und <strong>Pflegehilfsmittel</strong>. Die vollständige Darstellung mit Ablauf
          und Beispielen finden Sie unter{" "}
          <Link href={HAUSHALTSHILFE_URL} className={LINK_CLASS}>
            Haushaltshilfe
          </Link>
          .
        </>
      ),
    },
    {
      q: "Wie schnell kann ich einen Termin oder eine Rückmeldung bekommen?",
      answerPlain:
        "Am schnellsten geht es telefonisch über die lokale Standortnummer. Alternativ nutzen Sie das Kontaktformular auf dieser Seite – wir melden uns zeitnah.",
      answer: (
        <>
          Am direktesten erreichen Sie uns über die <strong>örtliche Rufnummer</strong> oben auf der Seite. Über das{" "}
          <Link href={contactHref} className={LINK_CLASS}>
            Kontaktformular
          </Link>{" "}
          geht es ebenfalls – wir antworten zeitnah.
        </>
      ),
    },
    {
      q: "Wo finde ich ausführliche Infos zu Kosten, Kasse und Entlastungsbetrag?",
      answerPlain:
        "Ausführliche Antworten zu Kosten, Krankenkasse und Entlastungsbetrag stehen auf der Haushaltshilfe-Seite in der FAQ-Sektion.",
      answer: (
        <>
          Dafür lohnt sich die{" "}
          <Link href={`${HAUSHALTSHILFE_URL}#haushalt-faq-heading`} className={LINK_CLASS}>
            FAQ auf der Seite Haushaltshilfe
          </Link>
          – dort gehen wir ausführlich auf Kosten, Kassen und häufige Fragen ein, ohne diese Texte auf jeder
          Standortseite zu wiederholen.
        </>
      ),
    },
  ];
}

export type StandortLandingProps = {
  slug: string;
  plz: string;
  ort: string;
  standort: Standort;
};

export function StandortLanding({ slug, plz, ort, standort }: StandortLandingProps) {
  const FAQ = buildStandortFaq({ plz, ort, standort, contactHref: CONTACT_ANCHOR });
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.answerPlain },
    })),
  };

  const whatsappHref = phoneHrefToWhatsAppUrl(standort.phoneHref);
  const hoursParts = standort.hours.split(/\s*·\s*/).filter(Boolean);
  const plzOrtMapInfo = getPlzOrtMapLines(slug, plz, ort);

  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article id="standort-landing" className="min-w-0 scroll-mt-24 overflow-x-clip overflow-y-visible">
        {/* Bild oben bündig unter Header; vertikaler Text-Offset nur auf der linken Spalte (lg), Schriftposition wie zuvor */}
        <section className="relative z-0 box-border w-full pt-0 pb-6 sm:pb-8 lg:pb-[clamp(1.5rem,2vw+0.75rem,2.5rem)]">
          <div className="box-border mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
            <div className="relative min-w-0">
              <div className="flex min-w-0 items-start justify-end">
                <div
                  className="relative ml-auto w-full min-w-0 max-w-full -mr-4 self-start opacity-0 animate-fade-in-up motion-reduce:opacity-100 sm:-mr-6 lg:mr-[calc((100vw-100%)/-2)] lg:max-w-[min(88vw,min(100%,52rem))]"
                  style={{ animationDelay: "0.08s" }}
                >
                  <div className="w-full">
                    <Image
                      src="/images/startseite_front.webp"
                      alt={`Pflegeberatung, Haushaltshilfe und Betreuung in ${plz} ${ort}`}
                      width={900}
                      height={700}
                      sizes="(max-width: 1023px) 100vw, (max-width: 1400px) 88vw, 900px"
                      className="box-border block h-auto w-full max-w-full object-contain object-right-top [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 max-w-lg text-left sm:max-w-xl lg:absolute lg:left-0 lg:right-auto lg:top-[clamp(2rem,5vh+1.25rem,4.75rem)] lg:mt-0 lg:w-full lg:max-w-none lg:-translate-x-[5%] lg:translate-y-0">
                <header className="text-left lg:max-w-[min(42vw,clamp(22rem,32vw+8rem,30rem))] xl:max-w-[min(38vw,clamp(23rem,28vw+9rem,31rem))] 2xl:max-w-[min(34vw,clamp(24rem,26vw+10rem,32rem))]">
                  <h1
                    className="text-left text-[clamp(0.8125rem,2.9vw+0.45rem,1.875rem)] font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(2rem,1.05rem+2.6vw,3rem)]"
                    style={{ animationDelay: "0s" }}
                  >
                    <span className="block whitespace-nowrap">
                      Pflegeberatung, Haushaltshilfe
                    </span>
                    <span className="mt-0.5 block whitespace-nowrap sm:mt-1">
                      &amp; Betreuung in {plz} {ort}
                    </span>
                  </h1>
                  <ul
                    className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5 lg:space-y-[clamp(0.65rem,0.35rem+0.9vw,1rem)]"
                    aria-label="Ihre Vorteile auf einen Blick"
                  >
                    {HERO_VORTEILE.map((line, i) => (
                      <li
                        key={line}
                        className="flex items-center gap-3 text-pretty text-lg font-semibold leading-snug text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-xl lg:text-[clamp(1.05rem,0.82rem+0.5vw,1.35rem)]"
                        style={{ animationDelay: `${0.68 + i * 0.26}s` }}
                      >
                        <HeroCheckIcon />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="mt-5 opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:mt-6"
                    style={{ animationDelay: "1.22s" }}
                  >
                    <Link
                      href={CONTACT_ANCHOR}
                      className="inline-flex min-h-[48px] w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto lg:px-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] lg:py-[clamp(0.6rem,0.45rem+0.45vw,0.9rem)] lg:text-[clamp(1rem,0.82rem+0.55vw,1.15rem)]"
                    >
                      Jetzt Kontakt aufnehmen
                    </Link>
                    <p className="mt-3 max-w-prose text-pretty text-sm leading-snug text-neutral-600 sm:text-base lg:text-[clamp(1.05rem,0.85rem+0.42vw,1.15rem)]">
                      Unverbindliche Erstberatung – wir melden uns zeitnah bei Ihnen.
                    </p>
                  </div>
                </header>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 overflow-x-clip bg-[#F2F9FA] px-4 pb-14 pt-[clamp(2.5rem,4.5vw,4.25rem)] sm:px-6 sm:pb-16 lg:px-[var(--ahs-page-gutter)] lg:pb-20"
          aria-labelledby="standort-angebot-heading"
        >
          <svg className={WELLEN_SVG_CLASS} viewBox="0 0 1200 100" preserveAspectRatio="none" fill="none" aria-hidden>
            <path d={WELLEN_D} fill="#F2F9FA" />
          </svg>
          <div className="relative z-[1] mx-auto w-full max-w-6xl px-0 sm:px-0">
            <RevealOnScroll>
              <LeistungenKachelGrid
                id="standort-angebot-heading"
                heading={`Wir bieten folgende Leistungen an Ihrem Standort ${plz} ${ort} an:`}
                subtitle="Persönlich, zuverlässig und mit viel Herz im Alltag."
                headingClassName="text-balance"
              />
            </RevealOnScroll>
          </div>
        </section>

        <section
          className="relative z-20 mt-12 w-full px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-[var(--ahs-page-gutter)]"
          aria-labelledby="standort-vorteile-heading"
        >
          <div className="mx-auto w-full max-w-6xl">
            <RevealOnScroll>
              <h3
                id="standort-vorteile-heading"
                className="text-center text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl"
              >
                Ihre Vorteile bei uns
              </h3>
              <p className="mx-auto mt-2 max-w-3xl text-center text-sm text-neutral-600 sm:text-base">
                Verlässlich, transparent und nah bei Ihnen - mit klaren Prozessen und echter Unterstützung im Alltag.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {STARTSEITE_VORTEILE.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/75 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- wie Startseite: statisches Haken-Icon */}
                    <img
                      src="/images/haken.webp"
                      alt=""
                      aria-hidden
                      width={38}
                      height={38}
                      className="mt-0.5 h-[38px] w-[38px] shrink-0 object-contain"
                    />
                    <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        <section className="relative border-t border-[#0F4F68]/10 bg-white py-14 sm:py-16" aria-labelledby="standort-faq-heading">
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <RevealOnScroll>
              <h2
                id="standort-faq-heading"
                className="text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
              >
                Fragen zu diesem Standort
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-neutral-600 sm:text-base">
                Kurz beantwortet – ausführliche FAQ zur Haushaltshilfe verlinken wir bewusst zentral, statt identische
                Texte auf hunderten Seiten zu wiederholen.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
              <div className="mt-8 space-y-3 sm:mt-10">
                {FAQ.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-[#0F4F68]/12 bg-[#fafbfc] shadow-[0_2px_16px_rgba(15,79,104,0.06)] transition hover:border-[#F78F2E]/35 open:border-[#0F4F68]/18"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-[#0F4F68] sm:px-5 [&::-webkit-details-marker]:hidden">
                      <span className="text-base font-semibold leading-snug sm:text-[1.05rem]">{item.q}</span>
                      <span
                        className="inline-flex shrink-0 rounded-full bg-[#F78F2E]/12 p-1.5 text-[#F78F2E] transition-transform duration-200 group-open:rotate-180"
                        aria-hidden
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="border-t border-[#0F4F68]/8 bg-white px-4 pb-4 pt-2 text-pretty text-sm leading-relaxed text-neutral-600 sm:px-5 sm:text-base">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </RevealOnScroll>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        </section>

        <section
          id="standort-kontakt"
          className="scroll-mt-24 border-t border-[#0F4F68]/10 bg-white py-16 sm:py-24"
          aria-labelledby="standort-kontakt-heading"
        >
          <Container className="w-full">
            <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div className="order-2 flex min-w-0 flex-col lg:order-1">
                <div className="mx-auto w-full max-w-xl rounded-2xl bg-[#F2F9FA] p-6 sm:p-8 lg:mx-0 lg:max-w-none lg:p-10">
                  <h2
                    id="standort-kontakt-heading"
                    className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
                  >
                    Kontakt
                  </h2>
                  <div className="mt-4 space-y-4 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
                    <p>
                      Für Ihre Suche in <strong>{plz}</strong> <strong>{ort}</strong> ist unser Standort{" "}
                      <strong>{standort.name}</strong> zuständig.
                    </p>
                    <p>
                      Gerne können Sie direkt hier unser Kontaktformular nutzen – Ihre Anfrage wird automatisch an den
                      passenden Standort weitergeleitet und dort schnellstmöglich bearbeitet.
                    </p>
                  </div>

                  <div className="mt-10">
                    <ContactForm />
                  </div>
                  <p className="mt-8 text-sm text-neutral-500">
                    Weitere Informationen zur Datenverarbeitung finden Sie in unserer{" "}
                    <Link href="/datenschutz" className="underline hover:text-neutral-700">
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="order-1 flex min-w-0 flex-col items-center gap-6 text-center lg:order-2">
                <div className="flex w-full flex-col items-center">
                  <div className="relative aspect-[4/3] w-full max-w-md overflow-visible sm:max-w-lg">
                    <div className="relative h-full w-full isolate [transform:translateZ(0)] [backface-visibility:hidden]">
                      <Image
                        src="/images/Kontakt_Bild.webp"
                        alt={`Kontakt – ${standort.name}`}
                        fill
                        className="object-contain drop-shadow-[0_4px_20px_rgba(15,79,104,0.18)]"
                        sizes="(max-width: 1024px) 90vw, 50vw"
                      />
                    </div>
                  </div>
                  <div
                    className="relative z-10 -mt-10 w-full max-w-sm rounded-xl bg-[#F2F9FA] px-6 py-3 text-center text-lg font-semibold text-[#0F4F68] sm:-mt-12 sm:max-w-md sm:py-4 sm:text-xl"
                    style={{ boxShadow: "0 -2px 12px rgba(15, 79, 104, 0.15)" }}
                  >
                    Wir freuen uns über Ihren Anruf!
                  </div>
                </div>
                <div className="mx-auto w-full max-w-md">
                  <p className="text-base font-semibold text-[#0F4F68] sm:text-lg">Telefonnummer Ihres Standorts</p>
                  <a
                    href={standort.phoneHref}
                    className="mt-2 flex items-center justify-center gap-2 text-3xl font-bold tabular-nums text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded sm:text-4xl"
                    aria-label={`Anrufen: ${standort.phone}`}
                  >
                    <svg
                      className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                      style={{ color: "#F78F2E" }}
                    >
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <span>{standort.phone}</span>
                  </a>
                  <ul className="mt-5 space-y-2 text-base text-neutral-700 sm:text-lg">
                    {hoursParts.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>

                  <section className="mt-8 border-t border-neutral-200 pt-6" aria-labelledby="standort-whatsapp-heading">
                    <h3 id="standort-whatsapp-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                      Oder schreiben Sie uns bequem
                      <br />
                      per Whatsapp
                    </h3>
                    <p className="mt-3 text-sm text-neutral-700">
                      Nutzen Sie den Button – so erreichen Sie diesen Standort direkt per WhatsApp. Für andere Kanäle
                      steht Ihnen unsere{" "}
                      <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline hover:no-underline">
                        zentrale Kontaktseite
                      </Link>{" "}
                      zur Verfügung.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#25D366]"
                        style={{ backgroundColor: "#25D366" }}
                        aria-label="Per WhatsApp an diesen Standort schreiben"
                      >
                        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                    <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-6">
                      <div className="flex justify-center">
                        <Image
                          src="/images/QR_Code.webp"
                          alt={`QR-Code WhatsApp – ${standort.name}`}
                          width={176}
                          height={176}
                          className="h-auto w-44 max-w-full object-contain"
                          unoptimized
                        />
                      </div>

                      <div className="overflow-hidden rounded-xl border border-[#0F4F68]/20 bg-[#F2F9FA]/80 shadow-[0_10px_22px_rgba(15,79,104,0.2)] shadow-[0_4px_12px_rgba(15,79,104,0.12)]">
                        <div className="border-b border-[#0F4F68]/15 bg-[#F2F9FA] px-4 py-3 text-center sm:px-5">
                          <p className="text-base font-semibold text-neutral-700 sm:text-lg">
                            {plz} {ort}
                          </p>
                          <p className="mt-1 text-sm text-neutral-600">Kartenansicht Ihres Suchgebiets (PLZ/Ort)</p>
                        </div>
                        <div className="relative aspect-[4/3] w-full min-h-[220px] bg-neutral-200">
                          <iframe
                            title={`Google Maps: Suchgebiet ${plz} ${ort}`}
                            src={getPlzOrtMapsEmbedSrc(plz, ort)}
                            className="absolute inset-0 h-full w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                          />
                        </div>
                        <p className="px-4 py-3 text-center">
                          <a
                            href={plzOrtMapInfo.mapsHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                          >
                            Größere Karte und Route in Google Maps öffnen
                          </a>
                        </p>
                      </div>

                      {plzOrtMapInfo.coordsLine ? (
                        <p className="text-center text-sm text-neutral-700">
                          <span className="font-semibold text-[#0F4F68]">Koordinaten (Suchgebiet): </span>
                          {plzOrtMapInfo.coordsLine}
                        </p>
                      ) : null}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-[#0F4F68]/10 bg-[#fafbfc] py-12" aria-label="Abschluss">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
              <p className="text-neutral-600">
                {siteConfig.name} unterstützt Sie mit Haushaltshilfe in {ort} und Umgebung. Zur Übersicht aller Regionen:{" "}
                <Link href="/standorte" className="font-semibold text-[#0F4F68] underline-offset-2 hover:underline">
                  Standorte
                </Link>
                .
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={CONTACT_ANCHOR}
                  className="inline-flex rounded-lg bg-[#F78F2E] px-8 py-3 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                >
                  Jetzt Kontakt aufnehmen
                </Link>
                <Link
                  href="/standorte"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[#0F4F68] px-6 py-3 font-semibold text-[#0F4F68] transition-colors hover:bg-[#0F4F68]/5 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  Zurück zur Standortsuche
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      </article>
    </div>
  );
}
