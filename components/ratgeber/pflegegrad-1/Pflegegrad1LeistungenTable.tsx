/** Leistungsübersicht Pflegegrad 1 — Desktop-Tabelle + Mobil-Karten */
const ROWS: { leistung: string; anspruch: string; hinweis: string }[] = [
  { leistung: "Entlastungsbetrag", anspruch: "Ja", hinweis: "Bis zu 131 € monatlich" },
  { leistung: "Pflegegeld", anspruch: "Nein", hinweis: "Erst ab Pflegegrad 2" },
  {
    leistung: "Pflegesachleistungen",
    anspruch: "Nein",
    hinweis:
      "Erst ab Pflegegrad 2; Ausnahme: Entlastungsbetrag kann bei Pflegegrad 1 auch für bestimmte zugelassene Pflegedienstleistungen genutzt werden",
  },
  { leistung: "Pflegehilfsmittel zum Verbrauch", anspruch: "Ja", hinweis: "Bis zu 42 € monatlich" },
  {
    leistung: "Technische Pflegehilfsmittel",
    anspruch: "Möglich",
    hinweis: "Zum Beispiel Hausnotruf, Pflegebett oder Lagerungshilfen bei Notwendigkeit",
  },
  {
    leistung: "Wohnumfeldverbessernde Maßnahmen",
    anspruch: "Möglich",
    hinweis: "Bis zu 4.180 € je Maßnahme",
  },
  { leistung: "Pflegeberatung", anspruch: "Ja", hinweis: "Beratung durch Pflegekasse oder geeignete Beratungsstellen" },
  { leistung: "Pflegekurse für Angehörige", anspruch: "Ja", hinweis: "Für Angehörige und ehrenamtlich Pflegende" },
  { leistung: "Verhinderungspflege", anspruch: "Nein", hinweis: "Grundsätzlich erst ab Pflegegrad 2" },
  {
    leistung: "Kurzzeitpflege regulär",
    anspruch: "Nein",
    hinweis: "Bei Pflegegrad 1 nur begrenzt über den Entlastungsbetrag nutzbar",
  },
  {
    leistung: "Tages- und Nachtpflege",
    anspruch: "Eingeschränkt",
    hinweis: "Keine eigenen Leistungsbeträge, aber Nutzung über Entlastungsbetrag möglich",
  },
  { leistung: "Hausnotruf", anspruch: "Möglich", hinweis: "Als technisches Pflegehilfsmittel bei erfüllten Voraussetzungen" },
  {
    leistung: "Zuschüsse für Pflege-WG",
    anspruch: "Möglich",
    hinweis: "Unter bestimmten Voraussetzungen",
  },
];

export function Pflegegrad1LeistungenTable() {
  return (
    <figure className="mt-6">
      <figcaption className="sr-only">Leistungen bei Pflegegrad 1 im Überblick</figcaption>

      <div className="hidden overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_2px_8px_-4px_rgba(15,79,104,0.12)] md:block">
        <table className="w-full min-w-[520px] border-collapse text-left text-[0.98rem] sm:text-[1.025rem]">
          <thead>
            <tr className="border-b border-neutral-200 bg-gradient-to-br from-neutral-50 to-[#f6fafc]">
              <th scope="col" className="px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e] sm:px-5">
                Leistung bei Pflegegrad 1
              </th>
              <th
                scope="col"
                className="w-[7rem] border-l border-neutral-100 px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e] sm:px-4"
              >
                Anspruch?
              </th>
              <th scope="col" className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e] sm:px-5">
                Betrag / Hinweis
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.leistung} className={i % 2 === 1 ? "bg-[#fafcfc]/95" : "bg-white"}>
                <th
                  scope="row"
                  className="border-b border-neutral-100 px-4 py-[0.75rem] align-top font-semibold leading-snug text-[#0F4F68] sm:px-5"
                >
                  {r.leistung}
                </th>
                <td className="border-b border-neutral-100 px-3 py-[0.75rem] text-center align-top font-medium text-neutral-800 sm:px-4">
                  {r.anspruch}
                </td>
                <td className="border-b border-neutral-100 px-4 py-[0.75rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.hinweis}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-0 space-y-3 md:hidden">
        {ROWS.map((r) => (
          <li
            key={r.leistung}
            className="rounded-xl border border-neutral-200/95 bg-white px-4 py-3.5 shadow-[0_1px_6px_-4px_rgba(15,79,104,0.12)]"
          >
            <p className="font-semibold leading-snug text-[#0F4F68]">{r.leistung}</p>
            <p className="mt-2 text-sm font-medium text-neutral-700">
              <span className="text-[#5a959e]">Anspruch: </span>
              {r.anspruch}
            </p>
            <p className="mt-1.5 text-[0.98rem] leading-relaxed text-neutral-800">{r.hinweis}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
}
