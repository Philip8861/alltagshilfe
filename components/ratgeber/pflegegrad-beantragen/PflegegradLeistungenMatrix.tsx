/** Leistungen 2026 – kompakte Matrix (Pflegegrad 1–5) */
export function PflegegradLeistungenMatrix() {
  const headPg = ["1", "2", "3", "4", "5"];

  const rows = [
    {
      label: "Pflegegeld monatlich",
      vals: ["–", "347 €", "599 €", "800 €", "990 €"],
    },
    {
      label: "Pflegesachleistungen monatlich",
      vals: ["–", "796 €", "1.497 €", "1.859 €", "2.299 €"],
    },
    {
      label: "Entlastungsbetrag monatlich",
      vals: ["131 €", "131 €", "131 €", "131 €", "131 €"],
    },
    {
      label: "Pflegehilfsmittel zum Verbrauch",
      vals: ["bis 42 €", "bis 42 €", "bis 42 €", "bis 42 €", "bis 42 €"],
    },
    {
      label: "Wohnumfeldverbessernde Maßnahmen je Maßnahme",
      vals: ["bis 4.180 €", "bis 4.180 €", "bis 4.180 €", "bis 4.180 €", "bis 4.180 €"],
    },
  ];

  return (
    <figure className="mt-6">
      <figcaption className="mb-3 text-[0.8rem] text-neutral-600 sm:text-[0.85rem]">
        Orientierungswerte gemäß gängiger Veröffentlichungen (Stand 2026) – verbindlich ist der jeweilige Bescheid.
      </figcaption>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white pb-px shadow-[0_2px_12px_-5px_rgba(15,79,104,0.14)]">
        <table className="min-w-[680px] w-full border-collapse text-sm text-[0.9375rem]">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-b border-neutral-200 bg-gradient-to-b from-[#f6fafc] via-[#fafcfc] to-white">
              <th
                scope="col"
                className="sticky left-0 z-[2] px-3 py-3 text-left font-semibold text-[#0F4F68] shadow-[8px_0_12px_-8px_rgba(0,0,0,0.15)] backdrop-blur-[2px] sm:px-4 bg-gradient-to-br from-neutral-50 via-[#f6fafc] to-[#eef6f8]"
              >
                Leistung
              </th>
              {headPg.map((pg) => (
                <th
                  key={pg}
                  scope="col"
                  className="border-l border-neutral-100 px-2 py-3 text-center font-semibold text-[#0F4F68] sm:min-w-[4.75rem] sm:px-3"
                >
                  <span className="hidden sm:inline">Pflegegrad {pg}</span>
                  <span className="sm:hidden">PG {pg}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr
                key={r.label}
                className={`border-b border-neutral-100/95 last:border-b-0 ${ri % 2 === 1 ? "bg-[#fcfcfb]" : ""}`}
              >
                <th
                  scope="row"
                  className="sticky left-0 z-[1] max-w-[13rem] border-r border-transparent bg-white px-3 py-[0.72rem] text-left align-top text-[0.85rem] font-semibold leading-snug text-[#0d4256] backdrop-blur-[2px] sm:max-w-none sm:bg-gradient-to-br sm:from-neutral-50/90 sm:via-[#fafcfc] sm:to-white sm:px-4 md:text-[0.935rem]"
                >
                  {r.label}
                </th>
                {r.vals.map((v, i) => (
                  <td
                    key={`${r.label}-${i}`}
                    className="border-l border-neutral-100 px-2 py-[0.72rem] text-center text-[0.9rem] font-medium tabular-nums text-[#1a4a58] sm:px-3"
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
