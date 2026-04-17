"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";

export type StandortKarte = {
  name: string;
  subline?: string;
  address: string;
  plzOrt: string;
  phone: string;
  phoneHref: string;
  email: string;
  orte: string[];
  imageSrc?: string;
  imageAlt?: string;
};

/** Gemeinsames Motiv für alle Standort-Karten. */
const STANDORT_CARD_BILD = "/images/standort_gemeinsam.webp";

const STANDORTE: StandortKarte[] = [
  {
    name: "Standort Allgäu",
    address: "Hinter den Gärten 10",
    plzOrt: "87730 Bad Grönenbach",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
    email: "Info@alltagshilfe-sued.de",
    orte: [
      "Kempten",
      "Immenstadt",
      "Sonthofen",
      "Kaufbeuren",
      "Memmingen",
      "Wildpoldsried",
      "Betzigau",
      "Buchenberg",
      "Mindelheim",
      "Ottobeuren",
      "Füssen",
      "Oberstdorf",
      "u. a.",
    ],
    imageSrc: STANDORT_CARD_BILD,
    imageAlt: "Standort Allgäu",
  },
  {
    name: "Wangen (Bodenseeregion)",
    address: "Karlstraße 3",
    plzOrt: "88239 Wangen im Allgäu",
    phone: "07522 / 9151686",
    phoneHref: "tel:+4975229151686",
    email: "wangen@alltagshilfe-sued.de",
    orte: [
      "Wangen",
      "Lindau",
      "Friedrichshafen",
      "Ravensburg",
      "Leutkirch",
      "Isny",
      "Kißlegg",
      "Memmingen",
      "Biberach",
      "Tettnang",
      "u. a.",
    ],
    imageSrc: STANDORT_CARD_BILD,
    imageAlt: "Standort Wangen im Allgäu",
  },
  {
    name: "Standort Augsburg",
    address: "Ulmer Straße 160",
    plzOrt: "86156 Augsburg",
    phone: "0821 / 48046200",
    phoneHref: "tel:+4982148046200",
    email: "augsburg@alltagshilfe-sued.de",
    orte: [
      "Augsburg",
      "Friedberg",
      "Königsbrunn",
      "Gersthofen",
      "Neusäß",
      "Stadtbergen",
      "Bobingen",
      "Aichach",
      "Mering",
      "u. a.",
    ],
    imageSrc: STANDORT_CARD_BILD,
    imageAlt: "Standort Augsburg",
  },
   {
    name: "Standort Engen/Konstanz",
    address: "Robert-Bosch-Straße 1",
    plzOrt: "78234 Engen",
    phone: "07733 / 948880",
    phoneHref: "tel:+497733948880",
    email: "engen@alltagshilfe-sued.de",
    orte: [
      "Engen",
      "Konstanz",
      "Singen",
      "Radolfzell",
      "Stockach",
      "Tuttlingen",
      "Überlingen",
      "Pfullendorf",
      "u. a.",
    ],
    imageSrc: STANDORT_CARD_BILD,
    imageAlt: "Standort Engen/Konstanz",
  },
];

/** Custom-Event von Karte: GPS-Symbol geklickt → gleiches Pop-up öffnen */
export const STANDORTE_OPEN_CONTACT_EVENT = "standorte-open-contact";

export function StandortKarten() {
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [selectedStandortName, setSelectedStandortName] = useState<string | null>(null);

  const openContactPopup = useCallback((standortName: string) => {
    setSelectedStandortName(standortName);
    setContactPopupOpen(true);
  }, []);
  const closeContactPopup = useCallback(() => {
    setContactPopupOpen(false);
    setSelectedStandortName(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContactPopup();
    };
    if (contactPopupOpen) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [contactPopupOpen, closeContactPopup]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ standortName: string }>;
      if (ev.detail?.standortName) openContactPopup(ev.detail.standortName);
    };
    window.addEventListener(STANDORTE_OPEN_CONTACT_EVENT, handler);
    return () => window.removeEventListener(STANDORTE_OPEN_CONTACT_EVENT, handler);
  }, [openContactPopup]);

  return (
    <>
      <section className="mt-10 lg:mt-12" aria-labelledby="standorte-heading">
        <h2 id="standorte-heading" className="text-2xl font-bold text-[#0F4F68] sm:text-3xl mb-6">
          Unsere 4 Standorte
        </h2>
        <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STANDORTE.map((s) => (
            <li key={s.name}>
              <article
                className="flex flex-col h-full rounded-2xl border border-[#0F4F68]/15 bg-white overflow-visible transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  boxShadow: "0 2px 8px rgba(15, 79, 104, 0.25), 0 4px 14px rgba(242, 249, 250, 1), 0 8px 24px rgba(242, 249, 250, 1), 0 12px 32px rgba(230, 245, 247, 1), 0 18px 44px rgba(242, 249, 250, 0.95)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 79, 104, 0.3), 0 8px 20px rgba(242, 249, 250, 1), 0 14px 32px rgba(242, 249, 250, 1), 0 20px 44px rgba(230, 245, 247, 1), 0 28px 56px rgba(242, 249, 250, 0.95)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 79, 104, 0.25), 0 4px 14px rgba(242, 249, 250, 1), 0 8px 24px rgba(242, 249, 250, 1), 0 12px 32px rgba(230, 245, 247, 1), 0 18px 44px rgba(242, 249, 250, 0.95)";
                }}
              >
                {s.imageSrc && (
                  <div className="relative w-full aspect-[16/9] max-h-[200px] bg-[#F2F9FA] shrink-0 overflow-hidden rounded-t-2xl">
                    <Image
                      src={s.imageSrc}
                      alt={s.imageAlt ?? s.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-6 sm:p-7 flex flex-col flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-[#0F4F68]">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-neutral-600 text-base">
                    {s.address}<br />
                    {s.plzOrt}
                  </p>
                  <p className="mt-3 text-sm font-medium text-neutral-500 uppercase tracking-wide">
                    Dienstleistungen u. a. in:
                  </p>
                  <p className="mt-1.5 text-base text-neutral-700 leading-snug">
                    {s.orte.join(", ")}
                  </p>
                  <div className="mt-5 pt-5 border-t border-[#0F4F68]/10 flex flex-wrap gap-x-4 gap-y-1 text-base">
                    <a
                      href={s.phoneHref}
                      className="font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                    >
                      {s.phone}
                    </a>
                    <Link
                      href={`mailto:${s.email}`}
                      className="font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                    >
                      {s.email}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => openContactPopup(s.name)}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#e07d1f] focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                  >
                    Kontakt aufnehmen
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Pop-up: Kontaktformular + Standort-Orte-Liste daneben */}
      {contactPopupOpen && (() => {
        const selectedStandort = STANDORTE.find((s) => s.name === selectedStandortName);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kontakt-popup-title"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden
              onClick={closeContactPopup}
            />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F2F9FA] shadow-xl">
              <div className="flex flex-col lg:flex-row">
                {/* Formular (links bzw. oben mobil) */}
                <div className="flex-1 min-w-0 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h2 id="kontakt-popup-title" className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">
                      {selectedStandortName ? `Kontakt ${selectedStandortName}` : "Kontakt"}
                    </h2>
                    <button
                      type="button"
                      onClick={closeContactPopup}
                      className="shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-[#0F4F68]/10 hover:text-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                      aria-label="Schließen"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-neutral-600">
                    Wir freuen uns über Ihre Nachricht.
                  </p>
                  <div className="mt-8">
                    <ContactForm />
                  </div>
                  <p className="mt-6 text-sm text-neutral-500">
                    Weitere Informationen zur Datenverarbeitung finden Sie in unserer{" "}
                    <Link href="/datenschutz" className="underline hover:text-neutral-700" onClick={closeContactPopup}>
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>

                {/* Rechte Spalte: Zuordnung dieses Standorts – Text + Orte-Liste */}
                {selectedStandort && selectedStandort.orte.length > 0 && (
                  <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-[#0F4F68]/15 bg-white/60 lg:rounded-r-2xl p-5 sm:p-6">
                    <p className="text-sm text-neutral-700 leading-snug">
                      Diese Nachricht wird an den Standort <strong className="text-[#0F4F68]">{selectedStandort.name}</strong> übermittelt. Dieser ist Ihr Ansprechpartner für Anfragen aus folgenden Städten und Regionen:
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#0F4F68]">
                      Städte und Regionen
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2" role="list">
                      {selectedStandort.orte.map((ort) => (
                        <li
                          key={ort}
                          className="rounded-lg bg-[#0F4F68]/10 px-2.5 py-1.5 text-sm font-medium text-[#0F4F68]"
                        >
                          {ort}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
