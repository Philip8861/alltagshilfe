const ITEMS = [
  "Pflegekasse kontaktiert",
  "Antrag gestellt",
  "Datum der Antragstellung notiert",
  "Vollmacht vorbereitet",
  "Arztberichte gesammelt",
  "Medikamentenplan bereitgelegt",
  "Pflegetagebuch geführt",
  "Begutachtung vorbereitet",
  "Vertrauensperson für Termin eingeplant",
  "Bescheid und Gutachten geprüft",
  "Widerspruchsfrist notiert",
  "Bei Bedarf Beratung angefragt",
];

export function PflegegradChecklistSection() {
  return (
    <ul className="mt-6 space-y-3">
      {ITEMS.map((t) => (
        <li key={t} className="flex gap-3 text-[1.0625rem] leading-relaxed text-neutral-800">
          <span className="mt-0.5 shrink-0 text-[#F78F2E]" aria-hidden>
            ✓
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
