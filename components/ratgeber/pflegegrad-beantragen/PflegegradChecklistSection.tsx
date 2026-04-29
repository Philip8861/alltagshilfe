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
    <div className="mt-6 rounded-2xl border border-neutral-200/90 bg-[linear-gradient(180deg,#fdfefe_0%,#ffffff_50%)] px-4 py-5 shadow-[inset_0_1px_0_0_rgba(15,79,104,0.04)] sm:px-6 sm:py-6">
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-1">
        {ITEMS.map((t) => (
          <li key={t} className="flex gap-3 rounded-lg border border-transparent py-0.5 transition hover:border-neutral-200/80 hover:bg-white/80 sm:py-1">
            <span
              className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#F78F2E]/45 bg-[linear-gradient(145deg,#ffffff_0%,#fffaf5_100%)] text-[0.72rem] font-bold text-[#e06d1a]"
              aria-hidden
            >
              ✓
            </span>
            <span className="text-[1.0425rem] leading-relaxed text-neutral-800">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
