import type { ReactNode } from "react";

import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";

export function PflegegradQuickAnswerBox({ children }: { children: ReactNode }) {
  return (
    <div className="group relative mt-6 overflow-hidden rounded-2xl border border-[#0F4F68]/14 bg-[linear-gradient(140deg,#f9fcfc_0%,#ffffff_45%,#f8fbfb_100%)] px-4 py-[1.1rem] shadow-[0_1px_0_0_rgba(15,79,104,0.05)] sm:flex sm:gap-4 sm:px-5 sm:py-[1.25rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0F4F68]/25 to-transparent"
      />
      <div className="mb-3 flex shrink-0 justify-center text-[#0F4F68] sm:mb-0 sm:pt-0.5">
        <DecorativeIcon className="h-8 w-8 sm:h-9 sm:w-9 transition-transform group-hover:scale-[1.02]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </DecorativeIcon>
      </div>
      <div className="text-[1.0625rem] leading-[1.72] text-neutral-800">{children}</div>
    </div>
  );
}

export function PflegegradFactsOverviewTable() {
  const rows = [
    { label: "Zuständige Stelle", value: "Pflegekasse der jeweiligen Krankenkasse" },
    { label: "Wer kann beantragen?", value: "Die pflegebedürftige Person selbst oder eine bevollmächtigte Person" },
    { label: "Antragsform", value: "Telefonisch, schriftlich oder je nach Pflegekasse online" },
    {
      label: "Begutachtung",
      value: "Medizinischer Dienst oder andere Gutachter; bei Privatversicherten Medicproof",
    },
    { label: "Dauer", value: "Grundsätzlich 25 Arbeitstage" },
    { label: "Wichtig", value: "Datum der Antragstellung notieren und Bescheid prüfen" },
  ];
  return (
    <figure className="mt-6">
      <figcaption className="sr-only">
        Zusammenstellung der zentralen Daten zum Pflegegrad-Antrag
      </figcaption>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_2px_8px_-4px_rgba(15,79,104,0.12)]">
        <table className="w-full min-w-[320px] border-collapse text-left text-[1.025rem] sm:text-[1.0425rem]">
          <thead>
            <tr className="border-b border-neutral-200 bg-gradient-to-br from-neutral-50 to-[#f6fafc]">
              <th scope="col" className="px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5">
                Thema
              </th>
              <th scope="col" className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5">
                Kurzinfo
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className={i % 2 === 1 ? "bg-[#fafcfc]/95" : "bg-white"}>
                <th
                  scope="row"
                  className="w-[40%] min-w-[148px] border-b border-neutral-100 px-4 py-[0.8rem] align-top font-semibold leading-snug text-[#0F4F68] sm:px-5"
                >
                  {r.label}
                </th>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
