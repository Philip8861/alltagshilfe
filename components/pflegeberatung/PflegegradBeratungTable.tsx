import {
  PFLEGEBERATUNG_RHYTHMUS_HALBJAERLICH_VERPFLICHTEND,
  PFLEGEBERATUNG_RHYTHMUS_PG4_5,
} from "@/lib/pflegeberatung-sgb-xi-rhythm";

/**
 * Übersicht Beratungspflicht je Pflegegrad (Paragraf 37 Abs. 3 SGB XI, bei Pflegegeld + häuslicher Angehörigenpflege).
 */
const ROWS = [
  {
    grad: "Pflegegrad 1",
    status: "Nicht verpflichtet",
    statusTone: "freiwillig" as const,
    rhythmus: "Bis zu 2× jährlich kostenlos möglich",
  },
  {
    grad: "Pflegegrad 2",
    status: "Verpflichtend",
    statusTone: "pflicht" as const,
    rhythmus: PFLEGEBERATUNG_RHYTHMUS_HALBJAERLICH_VERPFLICHTEND,
  },
  {
    grad: "Pflegegrad 3",
    status: "Verpflichtend",
    statusTone: "pflicht" as const,
    rhythmus: PFLEGEBERATUNG_RHYTHMUS_HALBJAERLICH_VERPFLICHTEND,
  },
  {
    grad: "Pflegegrad 4",
    status: "Verpflichtend",
    statusTone: "pflicht" as const,
    rhythmus: PFLEGEBERATUNG_RHYTHMUS_PG4_5,
  },
  {
    grad: "Pflegegrad 5",
    status: "Verpflichtend",
    statusTone: "pflicht" as const,
    rhythmus: PFLEGEBERATUNG_RHYTHMUS_PG4_5,
  },
] as const;

type PflegegradBeratungTableProps = {
  /** Wenn die Seite bereits eine sichtbare H2 hat, nur Screenreader-Beschriftung der Tabelle */
  captionSrOnly?: boolean;
};

export function PflegegradBeratungTable({ captionSrOnly = false }: PflegegradBeratungTableProps) {
  const captionClass = captionSrOnly
    ? "sr-only"
    : "border-b border-[#0F4F68]/10 bg-[#F2F9FA]/80 px-3 py-3 text-left text-[0.8125rem] font-bold leading-snug text-[#0F4F68] sm:px-4 sm:py-3.5 sm:text-base";

  return (
    <div className="w-full min-w-0">
      <div className="overflow-x-auto rounded-2xl border border-[#0F4F68]/15 bg-white shadow-[0_4px_24px_rgba(15,79,104,0.08)] [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[280px] border-collapse text-left text-sm sm:min-w-0 sm:text-[0.95rem]">
          <caption className={captionClass}>
            Übersicht Beratungspflicht je Pflegegrad nach Paragraf 37 Absatz 3 SGB XI
          </caption>
          <thead>
            <tr className="border-b border-[#0F4F68]/12 bg-[#0F4F68]/[0.06] text-[#0F4F68]">
              <th scope="col" className="px-3 py-2.5 font-extrabold sm:px-4 sm:py-3">
                Pflegegrad
              </th>
              <th scope="col" className="px-3 py-2.5 font-extrabold sm:px-4 sm:py-3">
                Pflicht?
              </th>
              <th scope="col" className="px-3 py-2.5 font-extrabold sm:px-4 sm:py-3">
                Turnus
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.grad}
                className="border-b border-[#0F4F68]/8 last:border-b-0 odd:bg-white even:bg-[#F2F9FA]/35"
              >
                <th scope="row" className="px-3 py-2.5 font-bold text-[#0F4F68] sm:px-4 sm:py-3">
                  {row.grad}
                </th>
                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                  <span
                    className={
                      row.statusTone === "pflicht"
                        ? "inline-flex rounded-lg bg-[#F78F2E]/15 px-2 py-0.5 text-xs font-bold text-[#c45f0c] sm:text-sm"
                        : "inline-flex rounded-lg bg-[#0F4F68]/10 px-2 py-0.5 text-xs font-bold text-[#0F4F68] sm:text-sm"
                    }
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-neutral-700 sm:px-4 sm:py-3">{row.rhythmus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
