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

/** Platzhalter-Kontakt (einheitlich für alle Standorte bis echte Daten gepflegt sind). */
const PLATZHALTER_TEL = "+49 8349 98933-30";
const PLATZHALTER_TEL_HREF = "tel:+4983349893330";
const PLATZHALTER_EMAIL = "standort@alltagshilfe-sued.de";

const WANGEN_IMAGE = "/images/Wangen.webp";

const STANDORTE: StandortKarte[] = [
  {
    name: "Standort Allgäu",
    address: "Hinter den Gärten 10",
    plzOrt: "87700 Bad Grönenbach",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Außern", "Kempten", "Immenstadt", "Sonthofen", "Kaufbeuren", "Memmingen", "Wildpoldsried", "Bezigau", "Buchenberg"],
    imageSrc: WANGEN_IMAGE,
    imageAlt: "Standort Allgäu",
  },
  {
    name: "Wangen (Bodenseeregion)",
    address: "Musterstraße 1",
    plzOrt: "88239 Wangen im Allgäu",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Wangen", "Ravensburg", "Leutkirch", "Isny", "Kißlegg", "Aulendorf", "Bad Waldsee"],
    imageSrc: WANGEN_IMAGE,
    imageAlt: "Standort Wangen im Allgäu",
  },
  {
    name: "Standort Augsburg",
    address: "Beispielweg 5",
    plzOrt: "86150 Augsburg",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Augsburg", "Friedberg", "Königsbrunn", "Gersthofen", "Neusäß", "Stadtbergen", "Bobingen"],
    imageSrc: WANGEN_IMAGE,
    imageAlt: "Standort Augsburg",
  },
  {
    name: "Standort Engen/Konstanz",
    address: "Sampleplatz 2",
    plzOrt: "78234 Engen",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Engen", "Konstanz", "Singen", "Radolfzell", "Stockach", "Überlingen", "Pfullendorf"],
    imageSrc: WANGEN_IMAGE,
    imageAlt: "Standort Engen/Konstanz",
  },
];

export function StandortKarten() {
  const [contactPopupOpen, setContactPopupOpen] = useState(false);

  const openContactPopup = useCallback(() => setContactPopupOpen(true), []);
  const closeContactPopup = useCallback(() => setContactPopupOpen(false), []);

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

  return (
    <>
      <section className="mt-10 lg:mt-12" aria-labelledby="standorte-heading">
        <h2 id="standorte-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl mb-6">
          Unsere 4 Standorte
        </h2>
        <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STANDORTE.map((s) => (
            <li key={s.name}>
              <article
                className="flex flex-col h-full rounded-2xl border border-[#0F4F68]/15 bg-white overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  boxShadow: "0 4px 14px rgba(242, 249, 250, 0.9), 0 2px 6px rgba(15, 79, 104, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(242, 249, 250, 1), 0 8px 20px rgba(15, 79, 104, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(242, 249, 250, 0.9), 0 2px 6px rgba(15, 79, 104, 0.08)";
                }}
              >
                {s.imageSrc && (
                  <div className="relative w-full aspect-[16/9] max-h-[200px] bg-[#F2F9FA] shrink-0">
                    <Image
                      src={s.imageSrc}
                      alt={s.imageAlt ?? s.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex flex-col flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#0F4F68]">
                    {s.name}
                  </h3>
                  <p className="mt-1.5 text-neutral-600 text-sm">
                    {s.address}<br />
                    {s.plzOrt}
                  </p>
                  <p className="mt-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Dienstleistungen u. a. in:
                  </p>
                  <p className="mt-1 text-sm text-neutral-700 leading-snug">
                    {s.orte.join(", ")}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#0F4F68]/10 flex flex-wrap gap-x-4 gap-y-1 text-sm">
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
                    onClick={openContactPopup}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e07d1f] focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                  >
                    Kontakt aufnehmen
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Pop-up: Kontaktformular wie auf Kontakt-Seite */}
      {contactPopupOpen && (
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
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F2F9FA] p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 id="kontakt-popup-title" className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">
                Kontakt
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
              Schreiben Sie uns – wir melden uns zeitnah bei Ihnen.
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
        </div>
      )}
    </>
  );
}
