import Image from "next/image";
import Link from "next/link";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";

/** Hero nur für /ratgeber/pflegegrad-beantragen */
export function PflegegradRatgeberHero() {
  return (
    <header className="border-b border-neutral-200 pb-8 pt-6 sm:pb-10 sm:pt-8">
      <nav aria-label="Brotkrumen" className={`${PROSE} text-sm text-neutral-600`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="text-[#0F4F68] underline-offset-2 hover:underline">
              Startseite
            </Link>
          </li>
          <li aria-hidden className="text-neutral-400">
            /
          </li>
          <li>
            <Link href="/ratgeber" className="text-[#0F4F68] underline-offset-2 hover:underline">
              Ratgeber
            </Link>
          </li>
          <li aria-hidden className="text-neutral-400">
            /
          </li>
          <li className="font-medium text-neutral-900">Pflegegrad beantragen</li>
        </ol>
      </nav>

      <div className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="min-w-0 max-w-xl flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/80">Ratgeber</p>
          <h1
            id="ratgeber-artikel-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[2.35rem] lg:leading-tight"
          >
            Pflegegrad beantragen: So erhalten Sie Schritt für Schritt die richtige Unterstützung
          </h1>
          <div className={`${PROSE} mt-5 space-y-4`}>
            <p>
              Wenn ein Mensch im Alltag dauerhaft Hilfe benötigt, ist der Pflegegrad oft der wichtigste erste Schritt. Erst
              mit einem anerkannten Pflegegrad können viele Leistungen der Pflegeversicherung genutzt werden – zum
              Beispiel Pflegegeld, Pflegesachleistungen, der Entlastungsbetrag, Pflegehilfsmittel, Unterstützung im
              Haushalt, Betreuung im Alltag oder weitere Hilfen zur Entlastung von Angehörigen.
            </p>
            <p>
              Für viele Familien ist der Antrag zunächst ungewohnt. Wo stellt man den Antrag? Was prüft der Medizinische
              Dienst? Welche Unterlagen sind wichtig? Wie bereitet man sich auf die Begutachtung vor? Und was kann man
              tun, wenn der Pflegegrad abgelehnt oder zu niedrig eingestuft wird?
            </p>
            <p>
              Dieser Ratgeber erklärt Schritt für Schritt, wie Sie 2026 einen Pflegegrad beantragen, worauf Sie achten
              sollten und wie Alltagshilfe-Süd Sie dabei unterstützen kann.
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-md shrink-0 overflow-hidden rounded-2xl lg:max-w-[380px] xl:max-w-[420px]">
          <Image
            src="/images/Ratgeber/ratgeber.webp"
            alt="Pflegeberatung: Gespräch mit älterer Person in vertrautem Umfeld"
            width={840}
            height={560}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
            priority
          />
        </div>
      </div>

      <dl
        className={`${PROSE} mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-neutral-200 pt-6 text-sm text-neutral-600 lg:mt-10`}
      >
        <div>
          <dt className="sr-only">Aktualisiert am</dt>
          <dd>Aktualisiert: April 2026</dd>
        </div>
        <div>
          <dt className="sr-only">Lesezeit</dt>
          <dd>Lesezeit: ca. 8 Minuten</dd>
        </div>
        <div className="min-w-0">
          <dt className="sr-only">Fachliche Prüfung</dt>
          <dd>
            Fachlich geprüft von{" "}
            <Link
              href="/pflegeberatung/private-pflegeberatung"
              className="text-[#0F4F68] underline-offset-2 hover:underline"
            >
              Alltagshilfe-Süd Pflegeberatung (privat)
            </Link>
          </dd>
        </div>
      </dl>
    </header>
  );
}
