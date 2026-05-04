"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Bewertung = {
  name: string;
  meta: string;
  text: string;
};

const BEWERTUNGEN: Bewertung[] = [
  {
    name: "Sabine Schäfer",
    meta: "6 Rezensionen · Neu · vor 3 Stunden",
    text: "Ich brauchte mit erstmal Pflegestufe 1 Hilfe im Haushalt. Es war gar nicht so leicht überhaupt jemanden zu finden, der mich mit dem geringen Bedarf im Haushaltsbereich überhaupt unterstützt. Die Damen bei der Organisation waren freundlich und konnten sofort helfen. Meine Haushaltshilfe ist sehr freundlich und fleißig. Jetzt habe ich die Hilfe schon über ein Jahr und bin zufrieden und sehr entlastet dadurch. Das ist einfach spitze und erleichtert mein Leben sehr. Da bin ich von Herzen dankbar. Auch die Abrechnung klappt komplikationslos. Das ist einfach toll!",
  },
  {
    name: "TMy",
    meta: "86 Rezensionen · vor einer Woche",
    text: "Gerade ist bei uns ziemlich Chaos. Mein Onkel ist im Krankenhaus und ich kümmer mich aktuell um meine Oma. Deshalb war ich echt dankbar für schnelle Hilfe. Die Terminverschiebung ging super unkompliziert und Frau Wagenzink war total freundlich und verständnisvoll. Genau so wünscht man sich Unterstützung, wenn eh schon alles drunter und drüber geht. Vielen lieben Dank!",
  },
  {
    name: "Tati",
    meta: "5 Rezensionen · vor 2 Monaten",
    text: "Sehr freundliche telefonische Beratung. Absolut empfehlenswert.",
  },
  {
    name: "Elmas Sert",
    meta: "1 Rezension · vor einem Monat",
    text: "Wir haben eine sehr freundliche Beratung vor Ort erhalten. Unterstützung wurde nach kurzer Zeit unkompliziert geschickt. Vielen Dank!",
  },
  {
    name: "Elena Zimmermann",
    meta: "Local Guide · 11 Rezensionen · vor 2 Wochen",
    text: "Ich bin rundum zufrieden mit der Alltagshilfe-Süd. Der Kontakt ist immer freundlich, zuverlässig und unkompliziert. Die Unterstützung im Alltag ist eine große Hilfe und alles wird sehr sorgfältig und engagiert erledigt. Man merkt, dass hier mit viel Herz gearbeitet wird. Vielen Dank für die tolle Unterstützung – ich kann den Service absolut weiterempfehlen!",
  },
  {
    name: "Ta K.",
    meta: "2 Rezensionen · 17 Fotos · vor einem Jahr",
    text: "Nach einem Beratungsgespräch wurde der Bedarf konkret geklärt und zeitnah eine hauswirtschaftliche Fachkraft eingesetzt. Neben den Reinigungsarbeiten und dem Kochen wurden auch Begleitungen übernommen. Besonders wertvoll: flexible, bedarfsgerechte Unterstützung, direkte Abrechnung mit den Kassen und immer erreichbare Ansprechpartnerinnen.",
  },
  {
    name: "Patricia Schmidt",
    meta: "6 Rezensionen · vor einer Woche",
    text: "Herzlichen Dank. Angerufen und am gleichen Tag noch einen Termin bekommen. Frau Riegel hat mich sehr freundlich und kompetent beraten und direkt eine passende Unterstützung organisiert. Diesen Service kann ich absolut empfehlen.",
  },
  {
    name: "Alf Laumann",
    meta: "1 Rezension · vor einer Woche",
    text: "Nach meinem Oberschenkelhalsbruch war ich auf Hilfe angewiesen. Die Unterstützung kam pünktlich, sehr hilfsbereit und zuverlässig. Auch der Kontakt mit dem Büro war perfekt. Vielen Dank für den großartigen Service.",
  },
  {
    name: "Kathi Bühler",
    meta: "2 Rezensionen · vor 2 Monaten",
    text: "Unsere Oma wird wöchentlich unterstützt, wodurch wir Angehörigen sehr entlastet werden. Vielen Dank für die professionelle und liebevolle Betreuung. Von Pflegeberatung über Hilfeleistungen bis zu Formularen fühlt man sich hier fachgerecht begleitet.",
  },
  {
    name: "Iris Huber",
    meta: "2 Rezensionen · vor 4 Monaten",
    text: "Ich war in einer Notlage und mir und meiner Familie wurde sofort auf die beste Art und Weise geholfen. Das gesamte Team ist sehr kompetent und sehr freundlich. Vielen Dank für die Unterstützung!",
  },
  {
    name: "E. A.",
    meta: "10 Rezensionen · vor 5 Monaten",
    text: "Alles bestens, top Service.",
  },
  {
    name: "Petra Kupzok",
    meta: "5 Rezensionen · vor 10 Monaten",
    text: "Herzlichen Dank für die vielfältige Unterstützung. Egal ob Termine oder Anträge – wir bekommen immer Hilfe und wichtige Infos. Das Personal ist hilfsbereit und nicht aufdringlich. Ich fühle mich bei der Alltagshilfe-Süd sehr gut aufgehoben.",
  },
];

type KundenstimmenCarouselProps = {
  /** Ohne große Außenabstände und ohne eigene H2 – für Unterseiten unter bestehender Überschrift */
  embedded?: boolean;
  /** Startseite: erschwert Drag/Rechtsklick auf Stern-Grafiken (nur Abschreckung). */
  protectImages?: boolean;
};

export function KundenstimmenCarousel({ embedded = false, protectImages = false }: KundenstimmenCarouselProps) {
  const [index, setIndex] = useState(0);
  const [starCount, setStarCount] = useState(0);

  const count = useMemo(() => BEWERTUNGEN.length, []);

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 8000);
    return () => window.clearInterval(id);
  }, [count]);

  useEffect(() => {
    setStarCount(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setStarCount(Math.min(n, 5));
      if (n >= 5) window.clearInterval(id);
    }, 140);
    return () => window.clearInterval(id);
  }, [index]);

  return (
    <section
      className={
        embedded
          ? "relative z-10 w-full"
          : "relative z-20 mt-16 w-full px-4 sm:mt-20 sm:px-6 lg:mt-24 lg:px-[var(--ahs-page-gutter)]"
      }
      aria-label="Kundenstimmen"
    >
      <div className={embedded ? "mx-auto w-full max-w-6xl py-2 text-center" : "mx-auto w-full max-w-6xl p-5 text-center sm:p-7"}>
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-2.5",
            protectImages && "select-none [-webkit-user-drag:none]"
          )}
          aria-hidden
          onContextMenu={protectImages ? (e) => e.preventDefault() : undefined}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i < starCount;
            const newest = filled && i === starCount - 1;
            const settled = filled && i < starCount - 1;
            return (
              <Image
                key={`${index}-star-${i}`}
                src="/images/star.png"
                alt=""
                width={39}
                height={39}
                sizes="39px"
                draggable={protectImages ? false : undefined}
                className={cn(
                  "h-[39px] w-[39px]",
                  !filled && "scale-[0.72] opacity-[0.22]",
                  settled && "scale-100 opacity-100 motion-reduce:transition-none",
                  newest &&
                    "scale-100 opacity-100 motion-safe:animate-star-pop-in motion-reduce:!animate-none motion-reduce:opacity-100"
                )}
              />
            );
          })}
        </div>
        {!embedded ? (
          <>
            <p className="mt-2 text-sm font-semibold text-[#0F4F68]/75">Google-Rezensionen · 5,0 Sterne</p>
            <h2 className="mt-1 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Das sagen unsere Kunden*innen</h2>
          </>
        ) : (
          <p className="mt-2 text-sm font-semibold text-[#0F4F68]/75">Google-Rezensionen · 5,0 Sterne</p>
        )}

        <div className={embedded ? "mt-4 text-left" : "mt-5 text-left"}>
          <article key={`${BEWERTUNGEN[index]?.name}-${index}`} className="animate-fade-in-up p-1">
            <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">
              <span aria-hidden>&bdquo;</span>
              {BEWERTUNGEN[index]?.text}
              <span aria-hidden>&ldquo;</span>
            </p>
            <p className="mt-4 text-sm font-semibold text-[#0F4F68]">{BEWERTUNGEN[index]?.name}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{BEWERTUNGEN[index]?.meta}</p>
          </article>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Bewertung auswählen">
          {BEWERTUNGEN.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                i === index
                  ? "border-[#F78F2E] bg-[#F78F2E] text-white"
                  : "border-[#0F4F68]/25 bg-white text-[#0F4F68]/45 hover:border-[#0F4F68]/45 hover:text-[#0F4F68]/65"
              )}
              aria-label={`Bewertung ${i + 1} anzeigen`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

