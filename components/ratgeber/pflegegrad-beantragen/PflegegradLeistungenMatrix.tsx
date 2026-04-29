/** Leistungen 2026 – eine kompakte Matrix (Pflegegrad 1–5) */
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
    <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white pb-px">
      <table className="min-w-[640px] w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-3 py-3 text-left font-semibold text-[#0F4F68] sm:px-4">Leistung</th>
            {headPg.map((pg) => (
              <th key={pg} className="border-l border-neutral-100 px-2 py-3 text-center font-semibold text-[#0F4F68] sm:px-3">
                Pflegegrad {pg}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-neutral-100 last:border-b-0">
              <td className="max-w-[12rem] px-3 py-2.5 align-top font-medium text-neutral-800 sm:px-4">
                {r.label}
              </td>
              {r.vals.map((v, i) => (
                <td
                  key={`${r.label}-${i}`}
                  className="border-l border-neutral-100 px-2 py-2.5 text-center tabular-nums text-neutral-800 sm:px-3"
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
