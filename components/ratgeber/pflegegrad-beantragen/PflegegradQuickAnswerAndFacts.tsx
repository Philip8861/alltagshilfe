import type { ReactNode } from "react";

import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";

export function PflegegradQuickAnswerBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-[#0F4F68]/14 bg-[#f9fcfc] px-4 py-4 sm:flex sm:gap-4 sm:px-5 sm:py-5">
      <div className="mb-3 flex shrink-0 justify-center text-[#0F4F68] sm:mb-0 sm:pt-1">
        <DecorativeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-[#0F4F68]">
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
    <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-[300px] border-collapse text-left text-[1.0425rem]">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-neutral-200 last:border-b-0">
              <th className="w-[42%] min-w-[140px] px-4 py-3 align-top font-semibold text-[#0F4F68] sm:px-5">
                {r.label}
              </th>
              <td className="px-4 py-3 text-neutral-800 sm:px-5">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
