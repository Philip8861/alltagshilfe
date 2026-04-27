"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";

const CTA_LABEL = "Jetzt Kooperationspartner werden" as const;

type BereichDef = {
  id: string;
  title: string;
  lede: string;
  paragraphs: string[];
  info: string;
  mehrHref: string;
  mehrLabel: string;
  align: "left" | "right";
};

const BEREICHE: BereichDef[] = [
  {
    id: "pflegehilfsmittel",
    title: "Pflegehilfsmittel",
    align: "left",
    lede: "Werden Sie Ansprechpartner für unsere kostenfreie Pflegehilfsmittelversorgung – inklusive Pflegebox und persönlicher Beratung vor Ort.",
    paragraphs: [
      "Wir beliefern pflegebedürftige Menschen zuverlässig mit den Produkten, die der Leistungsträger freigibt – transparent dokumentiert über unser Partner-Dashboard.",
      "Ideal für Apotheken, Sanitätshäuser, Pflegedienste oder Beratungsstellen, die ihre Kundschaft um eine starke Hilfsmittel-Lösung erweitern möchten.",
    ],
    info: "Provision und Abrechnung sind vertraglich geregelt; Sie erhalten Übersicht über Tippgeberprovision und Statuslisten.",
    mehrHref: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
    mehrLabel: "Mehr zu Pflegehilfsmitteln",
  },
  {
    id: "betriebliche-pflegeberatung",
    title: "Betriebliche Pflegeberatung",
    align: "right",
    lede: "Ergänzen Sie Ihr betriebliches Gesundheitsmanagement um unsere Pflegeberatung nach § 7a SGB XI – ohne Mehraufwand in Ihrer Personalabteilung.",
    paragraphs: [
      "Wir übernehmen die strukturierte Beratung Ihrer Beschäftigten zu Pflegegrad, Entlastungsleistungen und Versorgungsoptionen – DSGVO-konform und dokumentiert.",
      "Perfekt für Arbeitgeber, Sozialberatungen und Betriebsärzte, die ihren Teams echten Mehrwert bieten wollen.",
    ],
    info: "Kooperationsmodelle mit klarer Rollenverteilung; Anbindung an Ihre internen Kommunikationskanäle nach Absprache.",
    mehrHref: "/pflegeberatung#betriebliche-pflegeberatung",
    mehrLabel: "Betriebliche Pflegeberatung ansehen",
  },
  {
    id: "private-pflegeberatung",
    title: "Private Pflegeberatung",
    align: "left",
    lede: "Verweisen Sie angehörige oder Mandanten an eine erfahrene Pflegeberatung – mit festen Qualitätsstandards und nachvollziehbaren Abläufen.",
    paragraphs: [
      "Von der ersten Orientierung bis zu Hilfsmitteln und Anträgen: wir begleiten Familien einfühlsam und fachlich fundiert.",
      "Geeignet für Rechtsanwälte, Steuerberater, Hausärzte und soziale Träger mit Schnittstelle zur häuslichen Pflege.",
    ],
    info: "Sie bleiben vertrauensvoller Erstkontakt – wir liefern die Pflegeexpertise und halten Sie bei Bedarf auf dem Laufenden.",
    mehrHref: "/pflegeberatung/private-pflegeberatung",
    mehrLabel: "Private Pflegeberatung ansehen",
  },
  {
    id: "hauswirtschaft-betreuung",
    title: "Hauswirtschaft & Betreuung",
    align: "right",
    lede: "Bündeln Sie Kräfte mit uns, wenn es um Haushaltshilfe, Alltagsbegleitung und entlastende Angebote für pflegende Angehörige geht.",
    paragraphs: [
      "Gemeinsam erreichen wir mehr Haushalte – mit abgestimmten Kapazitäten, einheitlicher Qualität und klarer Kommunikation gegenüber Kostenträgern.",
      "Interessant für Netzwerke aus ambulanten Diensten, Sozialstationen und kommunalen Koordinierungsstellen.",
    ],
    info: "Wir klären Zuständigkeiten und Marketing-Botschaften mit Ihnen, damit Anfragen sauber ankommen und bearbeitet werden.",
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
            Wählen Sie Ihr Schwerpunktfeld – wir melden uns mit den passenden Unterlagen und dem weiteren Vorgehen.
          </p>
        </header>

        <div className="mt-12 space-y-10 sm:mt-14 sm:space-y-12 lg:mt-16 lg:space-y-14" role="list">
          {BEREICHE.map((b, index) => {
            const isRight = b.align === "right";
            return (
              <div key={b.id} role="listitem">
                <article
                  className={[
                    "relative overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br p-6 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.25)] sm:p-8 lg:p-10",
                    isRight
                      ? "from-white via-[#f7fbfc] to-[#eef6f9] lg:ml-8 lg:rounded-r-[2rem] lg:rounded-l-3xl lg:pl-12 lg:pr-14"
                      : "from-[#f7fbfc] via-white to-white lg:mr-8 lg:rounded-l-[2rem] lg:rounded-r-3xl lg:pl-14 lg:pr-12",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex flex-col gap-4",
                      isRight ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] text-sm font-bold text-white",
                        isRight ? "lg:order-1" : "",
                      ].join(" ")}
                      aria-hidden
                    >
                      {index + 1}
                    </span>
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
                    <p
                      className={[
                        "max-w-2xl rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm font-medium leading-snug text-amber-950 sm:text-[0.9375rem]",
                        isRight ? "lg:ml-auto" : "",
                      ].join(" ")}
                    >
                      <span className="font-semibold text-amber-900">Information: </span>
                      {b.info}
                    </p>
                    <div
                      className={[
                        "mt-2 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap",
                        isRight ? "sm:justify-end" : "sm:justify-start",
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
