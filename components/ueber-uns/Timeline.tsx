"use client";

import { useEffect, useRef, useState } from "react";

type Milestone = {
  date: string;
  title: string;
  description: string;
};

const MILESTONES: Milestone[] = [
  { date: "01.08.2020", title: "Erste Idee und Firmengründung", description: "Zertifizierung als Grundlage für den Aufbau." },
  { date: "01.04.2021", title: "Eröffnung der Alltagshilfe-Allgäu", description: "Tag der Eröffnung und erster Einsatz beim Klienten Zuhause." },
  { date: "01.04.2022", title: "Eröffnung Standort Wangen", description: "Eröffnung für die Bodenseeregion durch Frau Sonntag." },
  { date: "2023", title: "Umzug nach Sulzberg", description: "Neuer Firmensitz in Sulzberg." },
  { date: "01.10.2023", title: "Neue Dienstleistung: Pflegehilfsmittel", description: "Zertifizierung zum Versenden von Pflegehilfsmitteln." },
  { date: "03.06.2024", title: "Pflegeberatungsstelle", description: "Anerkennung als offizielle Pflegeberatungsstelle." },
  { date: "2025", title: "Namensänderung", description: "Von Alltagshilfe-Allgäu zu Alltagshilfe-Süd." },
  { date: "01.12.2025", title: "Neue Dienstleistung: Betriebliche Pflegeberatung", description: "Als neuer Benefit für Unternehmen." },
  { date: "01.01.2026", title: "Eröffnung neuer Standorte", description: "Eröffnung in Engen/Konstanz durch Frau Maucher und Augsburg durch Frau Riegel." },
  { date: "01.01.2026", title: "Umzug", description: "Umzug von Sulzberg nach Bad Grönenbach." },
  { date: "2026", title: "Eröffnung Standort Ulm", description: "Neuer Standort für Ulm, Neu-Ulm und die umliegende Region." },
  { date: "01.06.2026", title: "Eröffnung Pflegeshop", description: "Eröffnung des Pflegeshops." },
];

export function Timeline() {
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (entry.isIntersecting && Number.isFinite(idx)) {
            setVisible((prev) => ({ ...prev, [idx]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative mt-10 w-full" aria-label="Timeline Meilensteine">
      <h2 className="text-center text-4xl font-bold text-[#0F4F68]">Unsere Meilensteine</h2>

      <div className="relative mx-auto mt-7 max-w-6xl">
        <div className="absolute left-4 top-0 h-full w-[3px] rounded-full bg-[#0F4F68] md:left-1/2 md:-translate-x-1/2" aria-hidden />

        <ul className="space-y-4 md:space-y-5">
          {MILESTONES.map((item, idx) => {
            const isOdd = idx % 2 === 1;
            const isVisible = visible[idx];

            return (
              <li
                key={`${item.date}-${item.title}`}
                data-idx={idx}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className={`relative md:flex ${isOdd ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <span className="absolute left-4 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-[#0F4F68] ring-2 ring-[#F78F2E]/45 md:left-1/2 md:-translate-x-1/2" aria-hidden />

                <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                  <article
                    className={`rounded-xl border border-[#0F4F68]/10 bg-white p-4 shadow-sm transition duration-500 hover:-translate-y-0.5 hover:shadow-md ${
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#0F4F68]">{item.date}</p>
                      <span className="rounded-full bg-[#F78F2E]/15 px-2 py-0.5 text-[11px] font-bold text-[#0F4F68]">#{idx + 1}</span>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-slate-800">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  </article>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
