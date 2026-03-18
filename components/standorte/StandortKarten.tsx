import Image from "next/image";
import Link from "next/link";

export type StandortKarte = {
  name: string;
  subline?: string;
  address: string;
  plzOrt: string;
  phone: string;
  phoneHref: string;
  email: string;
  orte: string[];
  imageSrc?: string;
  imageAlt?: string;
};

/** Platzhalter-Kontakt (einheitlich für alle Standorte bis echte Daten gepflegt sind). */
const PLATZHALTER_TEL = "+49 8349 98933-30";
const PLATZHALTER_TEL_HREF = "tel:+4983349893330";
const PLATZHALTER_EMAIL = "standort@alltagshilfe-sued.de";

const STANDORTE: StandortKarte[] = [
  {
    name: "Standort Allgäu",
    address: "Hinter den Gärten 10",
    plzOrt: "87700 Bad Grönenbach",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Außern", "Kempten", "Immenstadt", "Sonthofen", "Kaufbeuren", "Memmingen", "Wildpoldsried", "Bezigau", "Buchenberg"],
  },
  {
    name: "Wangen (Bodenseeregion)",
    address: "Musterstraße 1",
    plzOrt: "88239 Wangen im Allgäu",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Wangen", "Ravensburg", "Leutkirch", "Isny", "Kißlegg", "Aulendorf", "Bad Waldsee"],
    imageSrc: "/images/Wangen.webp",
    imageAlt: "Standort Wangen im Allgäu",
  },
  {
    name: "Standort Augsburg",
    address: "Beispielweg 5",
    plzOrt: "86150 Augsburg",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Augsburg", "Friedberg", "Königsbrunn", "Gersthofen", "Neusäß", "Stadtbergen", "Bobingen"],
  },
  {
    name: "Standort Engen/Konstanz",
    address: "Sampleplatz 2",
    plzOrt: "78234 Engen",
    phone: PLATZHALTER_TEL,
    phoneHref: PLATZHALTER_TEL_HREF,
    email: PLATZHALTER_EMAIL,
    orte: ["Engen", "Konstanz", "Singen", "Radolfzell", "Stockach", "Überlingen", "Pfullendorf"],
  },
];

export function StandortKarten() {
  return (
    <section className="mt-10 lg:mt-12" aria-labelledby="standorte-heading">
      <h2 id="standorte-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl mb-6">
        Unsere 4 Standorte
      </h2>
      <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {STANDORTE.map((s) => (
          <li key={s.name}>
            <article className="flex flex-col h-full rounded-2xl border border-[#0F4F68]/15 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {s.imageSrc && (
                <div className="relative w-full aspect-[2/1] max-h-[140px] bg-[#F2F9FA] shrink-0">
                  <Image
                    src={s.imageSrc}
                    alt={s.imageAlt ?? s.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-5 sm:p-6 flex flex-col flex-1 min-w-0">
                <h3 className="text-lg font-bold text-[#0F4F68]">
                  {s.name}
                </h3>
                <p className="mt-1.5 text-neutral-600 text-sm">
                  {s.address}<br />
                  {s.plzOrt}
                </p>
                <p className="mt-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Dienstleistungen u. a. in:
                </p>
                <p className="mt-1 text-sm text-neutral-700 leading-snug">
                  {s.orte.join(", ")}
                </p>
                <div className="mt-4 pt-4 border-t border-[#0F4F68]/10 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a
                    href={s.phoneHref}
                    className="font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                  >
                    {s.phone}
                  </a>
                  <Link
                    href={`mailto:${s.email}`}
                    className="font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                  >
                    {s.email}
                  </Link>
                </div>
                <Link
                  href="/kontakt"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e07d1f] focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                >
                  Kontakt aufnehmen
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
