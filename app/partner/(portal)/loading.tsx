/**
 * Sofortiges Lade-Skelett für alle Portal-Seiten: Die Sidebar bleibt stehen, der Inhalt
 * wird beim Klick auf einen Navigationspunkt ohne Verzögerung angedeutet, bis die Daten da sind.
 */
export default function PartnerPortalLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Inhalt wird geladen …</span>

      <div className="flex items-center gap-5 rounded-2xl border border-[#d7e8ed] bg-white p-6 shadow-sm">
        <div className="h-14 w-14 shrink-0 rounded-full bg-[#e3f1f5]" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-6 w-2/5 max-w-xs rounded-md bg-[#dbe9ee]" />
          <div className="h-3.5 w-3/5 max-w-sm rounded-md bg-[#eaf2f5]" />
        </div>
        <div className="hidden h-11 w-36 rounded-xl bg-[#dbe9ee] sm:block" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-[#d7e8ed] bg-white p-6 shadow-sm">
            <div className="h-3 w-24 rounded bg-[#eaf2f5]" />
            <div className="mt-4 h-7 w-32 rounded-md bg-[#dbe9ee]" />
            <div className="mt-3 h-3 w-40 rounded bg-[#eaf2f5]" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#d7e8ed] bg-white p-6 shadow-sm">
        <div className="h-4 w-48 rounded bg-[#dbe9ee]" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border border-[#e3eef2] bg-[#f7fbfc] p-5">
              <div className="h-3 w-32 rounded bg-[#eaf2f5]" />
              <div className="mt-3 h-6 w-20 rounded-md bg-[#dbe9ee]" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#d7e8ed] bg-white shadow-sm">
        <div className="border-b border-[#e3eef2] px-6 py-4">
          <div className="h-4 w-56 rounded bg-[#dbe9ee]" />
        </div>
        <div className="space-y-3 p-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-[#f1f6f8]" />
          ))}
        </div>
      </div>
    </div>
  );
}
