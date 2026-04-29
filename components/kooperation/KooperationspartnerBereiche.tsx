"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/config/site";

const CTA_LABEL = "Jetzt Kooperationspartner werden" as const;

/** Wie Kooperations-Hero (`HERO_IMG_BASE`): gleicher Bildschatten. */
const KOOP_CARD_IMG_SHADOW =
  "object-contain [filter:drop-shadow(8px_12px_20px_rgba(15,79,104,0.18))_drop-shadow(6px_6px_14px_rgba(15,79,104,0.1))] [will-change:filter]";

const PFLEGEHILFSMITTEL_CORNER_IMG = {
  src: "/images/kooperation_pflegehilfsmittel.webp",
  width: 516,
  height: 403,
} as const;

const BETRIEBLICH_CORNER_IMG = {
  src: "/images/kooperation_betriebliche_pflegeberatung.webp",
  width: 516,
  height: 403,
} as const;

const HAUSWIRTSCHAFT_CORNER_IMG = {
  src: "/images/kooperation_hauswirtschaft.webp",
  width: 516,
  height: 403,
} as const;

const PRIVATE_PFLEGE_CORNER_IMG = {
  src: "/images/kooperation_private_pflegeberatung.webp",
  width: 516,
  height: 403,
} as const;

/** Karten mit Teaserbild, das über die Kante ragt. */
const KOOP_CORNER_OVERFLOW_IDS = new Set([
  "pflegehilfsmittel",
  "betriebliche-pflegeberatung",
  "private-pflegeberatung",
  "hauswirtschaft-betreuung",
]);

/** Teaser oben links/rechts; 80 % der zuletzt genutzten Maximalgröße (20 % kleiner). */
const KOOP_CORNER_IMG_SIZE =
  "h-auto w-[min(66%,25.875rem)] max-w-[495px] sm:w-[min(62%,29.25rem)] sm:max-w-[495px] lg:max-w-[520px]";

const KOOP_CORNER_TEXT_PR =
  "pr-[clamp(7.4rem,30vw,10.5rem)] sm:pr-[clamp(8.8rem,35vw,14.5rem)] md:pr-[min(58%,17.6rem)] lg:pr-[min(72%,25.2rem)]";

const KOOP_CORNER_TEXT_PL =
  "pl-[clamp(7.4rem,30vw,10.5rem)] sm:pl-[clamp(8.8rem,35vw,14.5rem)] md:pl-[min(58%,17.6rem)] lg:pl-[min(72%,25.2rem)]";

/** Gleiche Optik wie die Haken bei „Ihre Vorteile“ im Kooperations-Hero. */
function KooperationHeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] sm:h-10 sm:w-10 ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.2rem] w-[1.2rem] sm:h-[1.35rem] sm:w-[1.35rem]"
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

type BereichDef = {
  id: string;
  title: string;
  lede: string;
  paragraphs: string[];
  /** Optional: Zwischenüberschrift vor der Vorteilsliste (orangene Haken). */
  featuresHeading?: string;
  /** Vorteilszeilen mit Titel + Fließtext – Darstellung wie Hero-Liste, keine Kästen. */
  features?: readonly { title: string; text: string }[];
  /** Kurzer Hinweis im Amber-Kasten; weglassen, wenn nichts Nötiges. */
  info?: string;
  mehrHref: string;
  mehrLabel: string;
  align: "left" | "right";
};

const BEREICHE: BereichDef[] = [
  {
    id: "pflegehilfsmittel",
    title: "Pflegehilfsmittel",
    align: "left",
    lede: "Sie arbeiten regelmäßig mit pflegebedürftigen Personen oder deren Angehörigen zusammen und empfehlen Pflegehilfsmittel für die häusliche Versorgung?",
    paragraphs: [
      `Dann werden Sie Kooperationspartner von ${siteConfig.name}. Wir stellen Ihnen eigene Flyer sowie einen persönlichen Partner-Code zur Verfügung, der bei jeder Bestellung angegeben werden kann. So können Sie vermittelte Vorgänge einfach zuordnen, den Status nachvollziehen und nach erfolgreichem Abschluss eine Tippgeberprovision erhalten.`,
    ],
    featuresHeading: "Ihre Vorteile als Kooperationspartner",
    features: [
      {
        title: "Eigene Flyer für Ihre Kunden",
        text: "Sie erhalten eigene Flyer mit Ihrem Partner-Code, die Sie direkt an pflegebedürftige Personen und Angehörige weitergeben können.",
      },
      {
        title: "Persönlicher Partner-Code",
        text: "Jede Empfehlung kann über Ihren individuellen Code zugeordnet werden – transparent und nachvollziehbar.",
      },
      {
        title: "Provision bei erfolgreichem Abschluss",
        text: "Kommt es über Ihre Empfehlung zu einer erfolgreichen Versorgung, erhalten Sie eine Tippgeberprovision.",
      },
    ],
    mehrHref: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
    mehrLabel: "Mehr zu Pflegehilfsmitteln",
  },
  {
    id: "betriebliche-pflegeberatung",
    title: "Betriebliche Pflegeberatung für Ihre Unternehmenskunden",
    align: "right",
    lede: "Sie beraten Firmen, Arbeitgeber oder HR-Abteilungen zu Benefits, betrieblichem Gesundheitsmanagement oder Mitarbeiterbindung?",
    paragraphs: [
      `Dann erweitern Sie Ihr Angebot um einen Beratungsbaustein mit echtem Alltagsnutzen: die betriebliche Pflegeberatung der ${siteConfig.name}.`,
      "Wir unterstützen Beschäftigte Ihrer Unternehmenskunden bei Fragen zu Pflegegrad, Entlastungsleistungen, Versorgungsoptionen und der Organisation der häuslichen Pflege.",
      "Hier erleben Betriebe einen Benefit, der einen echten Unterschied macht und sie auf den demografischen Wandel vorbereitet.",
    ],
    featuresHeading: "Ihre Vorteile als Kooperationspartner",
    features: [
      {
        title: "Einfach vermittelbar und klar erklärbar",
        text: "Das Angebot ist leicht verständlich und spricht ein Problem an, das viele Unternehmen bereits heute betrifft: die Vereinbarkeit von Beruf und Pflege.",
      },
      {
        title: "Professionelle Umsetzung durch Alltagshilfe-Süd",
        text: "Die fachliche Beratung, Durchführung und Betreuung übernehmen wir. Sie können Ihren Unternehmenskunden eine hochwertige Lösung anbieten, ohne zusätzlichen Aufwand.",
      },
      {
        title: "Transparent & übersichtlich",
        text: "Über unser Dashboard sehen Sie jeden Status und die monatliche Tippgeberprovision.",
      },
    ],
    mehrHref: "/pflegeberatung#betriebliche-pflegeberatung",
    mehrLabel: "Betriebliche Pflegeberatung ansehen",
  },
  {
    id: "private-pflegeberatung",
    title: "Private Pflegeberatung",
    align: "left",
    lede: "Sie arbeiten mit pflegebedürftigen Menschen oder Angehörigen zusammen, die Unterstützung bei Beratungsbesuchen, Anträgen oder Formularen benötigen?",
    paragraphs: [
      `Dann können Sie diese Personen vertrauensvoll an ${siteConfig.name} weiterempfehlen. Wir bieten verpflichtende Beratungsbesuche nach § 37 Abs. 3 SGB XI an und unterstützen Familien zusätzlich bei Fragen rund um Pflegegrad, Leistungen, Anträge und notwendige Unterlagen.`,
      "Unsere geschulten Pflegeberater nehmen sich Zeit für die individuelle Situation vor Ort.",
    ],
    featuresHeading: "Ihre Vorteile als Kooperationspartner",
    features: [
      {
        title: "Verlässliche Hilfe für Pflegebedürftige und Angehörige",
        text: "Ihre Kontakte erhalten klare Orientierung zu Beratungsbesuchen, Leistungen und Unterlagen – ohne dass Sie selbst inhaltlich in Vorleistung treten müssen.",
      },
      {
        title: "Geschulte Pflegeberater mit Zeit für die Situation",
        text: "Unsere Beratungen erfolgen durch geschulte Pflegeberater, die strukturiert beraten, zuhören und gemeinsam mit den Betroffenen sinnvolle nächste Schritte besprechen.",
      },
      {
        title: "Tippgeberprovision bei erfolgreicher Beratung",
        text: "Wird eine von Ihnen vermittelte Beratung erfolgreich durchgeführt, erhalten Sie eine Tippgeberprovision.",
      },
    ],
    mehrHref: "/pflegeberatung/private-pflegeberatung",
    mehrLabel: "Private Pflegeberatung ansehen",
  },
  {
    id: "hauswirtschaft-betreuung",
    title: "Hauswirtschaft & Betreuung",
    align: "right",
    lede: "Sie arbeiten mit Menschen, Angehörigen oder Familien zusammen, die im Alltag Unterstützung benötigen?",
    paragraphs: [
      `Dann können Sie diese Personen unkompliziert an ${siteConfig.name} weitervermitteln. Wir helfen schnell und zuverlässig bei Anfragen rund um Haushaltshilfe, Alltagsbegleitung und Betreuung.`,
      "Ob Unterstützung im Haushalt, Begleitung im Alltag oder Entlastung für Angehörige: Wir nehmen Kontakt auf, klären den Bedarf und begleiten die weitere Umsetzung. So erhalten die betroffenen Personen schnelle Hilfe, während Sie als vertrauter Ansprechpartner entlastet werden.",
    ],
    featuresHeading: "Ihre Vorteile als Kooperationspartner",
    features: [
      {
        title: "Schnelle Hilfe für Ihre Kontakte",
        text: "Menschen, die Unterstützung im Alltag benötigen, erhalten über uns eine unkomplizierte erste Einschätzung und passende Hilfe.",
      },
      {
        title: "Klare Weitervermittlung ohne Mehraufwand",
        text: "Sie geben den Kontakt weiter, wir übernehmen die weitere Abstimmung, Beratung und Organisation.",
      },
      {
        title: "Tippgeberprovision bei erfolgreicher Vermittlung",
        text: "Kommt über Ihre Empfehlung eine erfolgreiche Zusammenarbeit zustande, erhalten Sie eine Tippgeberprovision.",
      },
    ],
    mehrHref: "/leistungen/haushaltshilfe",
    mehrLabel: "Leistung Haushaltshilfe",
  },
];

function modalMessageFor(bereich: BereichDef): string {
  return [
    `Kooperationsanfrage – Bereich: ${bereich.title}`,
    "",
    "Bitte beschreiben Sie kurz Ihr Unternehmen oder Ihre Einrichtung und wie Sie sich die Zusammenarbeit vorstellen.",
    "",
  ].join("\n");
}

export function KooperationspartnerBereiche() {
  const [openBereich, setOpenBereich] = useState<BereichDef | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => setOpenBereich(null), []);

  useEffect(() => {
    if (!openBereich) return;
    const t = window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openBereich, close]);

  return (
    <section
      id="jetzt-kooperationspartner-werden"
      className="border-t border-[#0F4F68]/10 bg-white scroll-mt-24"
      aria-labelledby={titleId}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-[var(--ahs-page-gutter)] lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#F78F2E]">Kooperation</p>
          <h2 id={titleId} className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl">
            {CTA_LABEL}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-neutral-700 sm:text-lg">
            Wählen Sie die passende Dienstleistung für Ihre Kooperation aus. Aktuell bieten wir vier Kooperationsbereiche
            an. Anschließend melden wir uns für ein persönliches Gespräch und stimmen gemeinsam die nächsten Schritte mit
            Ihnen ab.
          </p>
        </header>

        <div className="mt-10 space-y-8 sm:mt-12 sm:space-y-10 lg:mt-16 lg:space-y-14" role="list">
          {BEREICHE.map((b) => {
            const isRight = b.align === "right";
            return (
              <div key={b.id} role="listitem" className="min-w-0 w-full max-w-full">
                <article
                  className={[
                    "relative mx-auto w-full max-w-full rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br p-5 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.25)] sm:p-8 lg:p-10",
                    KOOP_CORNER_OVERFLOW_IDS.has(b.id) ? "overflow-visible" : "overflow-hidden",
                    isRight
                      ? "from-white via-[#f7fbfc] to-[#eef6f9] lg:ml-8 lg:rounded-r-[2rem] lg:rounded-l-3xl lg:pl-12 lg:pr-14"
                      : "from-[#f7fbfc] via-white to-white lg:mr-8 lg:rounded-l-[2rem] lg:rounded-r-3xl lg:pl-14 lg:pr-12",
                  ].join(" ")}
                >
                  {b.id === "pflegehilfsmittel" ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- Teaserbild wie Hero (filter-Schatten), kein Next/Image-Wrapper */
                    <img
                      src={PFLEGEHILFSMITTEL_CORNER_IMG.src}
                      alt="Pflegehilfsmittel – Kooperation"
                      width={PFLEGEHILFSMITTEL_CORNER_IMG.width}
                      height={PFLEGEHILFSMITTEL_CORNER_IMG.height}
                      decoding="async"
                      className={`pointer-events-none absolute right-0 top-0 z-10 select-none sm:-top-5 sm:-right-5 lg:-right-6 lg:-top-6 ${KOOP_CORNER_IMG_SIZE} ${KOOP_CARD_IMG_SHADOW}`}
                    />
                  ) : null}
                  {b.id === "private-pflegeberatung" ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- Teaserbild wie Hero (filter-Schatten), kein Next/Image-Wrapper */
                    <img
                      src={PRIVATE_PFLEGE_CORNER_IMG.src}
                      alt="Private Pflegeberatung – Kooperation"
                      width={PRIVATE_PFLEGE_CORNER_IMG.width}
                      height={PRIVATE_PFLEGE_CORNER_IMG.height}
                      decoding="async"
                      className={`pointer-events-none absolute right-0 top-2 z-10 select-none sm:-top-5 sm:-right-5 lg:-right-6 lg:-top-6 ${KOOP_CORNER_IMG_SIZE} ${KOOP_CARD_IMG_SHADOW}`}
                    />
                  ) : null}
                  {b.id === "betriebliche-pflegeberatung" ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- Teaserbild wie Hero (filter-Schatten), kein Next/Image-Wrapper */
                    <img
                      src={BETRIEBLICH_CORNER_IMG.src}
                      alt="Betriebliche Pflegeberatung – Kooperation"
                      width={BETRIEBLICH_CORNER_IMG.width}
                      height={BETRIEBLICH_CORNER_IMG.height}
                      decoding="async"
                      className={`pointer-events-none absolute left-0 top-0 z-10 select-none sm:-top-5 sm:-left-5 lg:-left-6 lg:-top-6 ${KOOP_CORNER_IMG_SIZE} ${KOOP_CARD_IMG_SHADOW}`}
                    />
                  ) : null}
                  {b.id === "hauswirtschaft-betreuung" ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- Teaserbild wie Hero (filter-Schatten), kein Next/Image-Wrapper */
                    <img
                      src={HAUSWIRTSCHAFT_CORNER_IMG.src}
                      alt="Hauswirtschaft und Betreuung – Kooperation"
                      width={HAUSWIRTSCHAFT_CORNER_IMG.width}
                      height={HAUSWIRTSCHAFT_CORNER_IMG.height}
                      decoding="async"
                      className={`pointer-events-none absolute left-0 top-0 z-10 select-none sm:-top-5 sm:-left-5 lg:-left-6 lg:-top-6 ${KOOP_CORNER_IMG_SIZE} ${KOOP_CARD_IMG_SHADOW}`}
                    />
                  ) : null}
                  <div
                    className={[
                      "flex min-w-0 flex-col gap-4 text-left",
                      isRight ? "lg:items-end lg:text-right" : "lg:items-start",
                      KOOP_CORNER_OVERFLOW_IDS.has(b.id)
                        ? b.id === "private-pflegeberatung"
                          ? "pt-[13.25rem] sm:pt-0"
                          : "pt-[11.5rem] sm:pt-0"
                        : "",
                      b.id === "pflegehilfsmittel" || b.id === "private-pflegeberatung"
                        ? KOOP_CORNER_TEXT_PR
                        : "",
                      b.id === "betriebliche-pflegeberatung" || b.id === "hauswirtschaft-betreuung"
                        ? KOOP_CORNER_TEXT_PL
                        : "",
                    ].join(" ")}
                  >
                    <h3 className="text-xl font-bold tracking-tight text-[#0F4F68] sm:text-2xl lg:max-w-2xl">
                      {b.title}
                    </h3>
                    <p className="max-w-2xl text-base font-medium leading-relaxed text-[#0F4F68]/95 sm:text-[1.05rem]">
                      {b.lede}
                    </p>
                    <div
                      className={[
                        "max-w-2xl space-y-3 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base",
                        isRight ? "lg:ml-auto" : "",
                      ].join(" ")}
                    >
                      {b.paragraphs.map((p, i) => (
                        <p key={`${b.id}-p-${i}`}>{p}</p>
                      ))}
                    </div>
                    {b.featuresHeading ? (
                      <h4
                        id={`${b.id}-vorteile-heading`}
                        className={[
                          "max-w-2xl text-lg font-bold tracking-tight text-[#0F4F68] sm:text-xl",
                          isRight ? "lg:ml-auto lg:text-right" : "",
                        ].join(" ")}
                      >
                        {b.featuresHeading}
                      </h4>
                    ) : null}
                    {b.features && b.features.length > 0 ? (
                      <ul
                        className={[
                          "list-none w-full max-w-2xl space-y-3 text-pretty sm:space-y-3.5",
                          isRight ? "lg:ml-auto" : "",
                        ].join(" ")}
                        aria-labelledby={b.featuresHeading ? `${b.id}-vorteile-heading` : undefined}
                        aria-label={b.featuresHeading ? undefined : "Vorteile im Überblick"}
                      >
                        {b.features.map((f) => (
                          <li
                            key={f.title}
                            className={[
                              "flex w-full min-w-0 items-start gap-3 sm:items-center lg:items-start",
                              isRight ? "lg:flex-row-reverse" : "",
                            ].join(" ")}
                          >
                            <KooperationHeroCheckIcon className="mt-0.5 shrink-0 sm:mt-0" />
                            <div
                              className={[
                                "min-w-0 flex-1 space-y-1 text-left",
                                isRight ? "lg:text-right" : "",
                              ].join(" ")}
                            >
                              <p className="text-[1.05rem] font-semibold leading-snug text-[#0F4F68] sm:text-[1.125rem]">
                                {f.title}
                              </p>
                              <p className="text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
                                {f.text}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {b.info?.trim() ? (
                      <p
                        className={[
                          "max-w-2xl rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm font-medium leading-snug text-amber-950 sm:text-[0.9375rem]",
                          isRight ? "lg:ml-auto" : "",
                        ].join(" ")}
                      >
                        <span className="font-semibold text-amber-900">Information: </span>
                        {b.info}
                      </p>
                    ) : null}
                    <div
                      className={[
                        "mt-2 flex w-full min-w-0 max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap",
                        isRight ? "sm:justify-start lg:justify-end" : "sm:justify-start",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenBereich(b)}
                        className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2 sm:min-h-[3.125rem] sm:px-8"
                      >
                        {CTA_LABEL}
                      </button>
                      <Link
                        href={b.mehrHref}
                        className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border-2 border-[#0F4F68]/30 bg-white/80 px-6 py-3 text-base font-semibold text-[#0F4F68] transition hover:border-[#0F4F68] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:min-h-[3.125rem] sm:px-8"
                      >
                        {b.mehrLabel}
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-neutral-600 sm:mt-12">
          Bereits registriert?{" "}
          <Link href="/partner/login" className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline">
            Zum Partner-Login
          </Link>
        </p>
      </div>

      {openBereich ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0b2a36]/60 backdrop-blur-[2px]"
            aria-label="Dialog schließen"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="koop-anfrage-dialog-title"
            className="relative z-[101] flex max-h-[min(92dvh,920px)] w-full max-w-lg flex-col rounded-t-2xl border border-[#0F4F68]/15 bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id="koop-anfrage-dialog-title" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                  Anfrage stellen
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Bereich: <span className="font-semibold text-neutral-800">{openBereich.title}</span>
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="shrink-0 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]"
              >
                Schließen
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <ContactForm
                key={openBereich.id}
                fieldIdPrefix="koop-anfrage-"
                topicHidden
                hiddenTopic="Kooperation"
                initialMessage={modalMessageFor(openBereich)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
