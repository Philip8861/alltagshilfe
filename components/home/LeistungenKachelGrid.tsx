import Link from "next/link";
import {
  LEISTUNGS_LINKS_BY_ICON,
  type LeistungKachelIcon,
  STARTSEITE_LEISTUNGEN_KACHELN,
} from "@/lib/startseite-leistungen";

type Props = {
  id?: string;
  heading: string;
  subtitle: string;
  /** z. B. für Standortseiten: etwas weniger Padding oben */
  className?: string;
  /** Zusatzklassen für die Überschrift (z. B. scroll-mt auf der Startseite) */
  headingClassName?: string;
  /** Startseite: Einleitung zentriert unter dem Header-Bild */
  introAlign?: "left" | "center";
};

function LeistungIconGlyph({ icon }: { icon: LeistungKachelIcon }) {
  if (icon === "home") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
      </svg>
    );
  }
  if (icon === "people") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3m-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0h-1c1.2.9 2 2.24 2 3.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    );
  }
  if (icon === "assistenz") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  if (icon === "chat") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v11H7.6L4 18.6V4zm4 4v2h8V8H8zm0 4v2h5v-2H8z" />
      </svg>
    );
  }
  if (icon === "box") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 7.2 12 3l9 4.2v9.6L12 21l-9-4.2V7.2zm9 8.5 6.8-3.2V8.6L12 11.8 5.2 8.6v3.9l6.8 3.2z" />
      </svg>
    );
  }
  if (icon === "cart") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 4H4v2h1.3l2 9.1h9.6l1.7-6.8H8.5L8 6h12V4H7zm2 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    );
  }
  if (icon === "briefcase") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 4h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v3H2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2zm6 3V6H9v1h6zM2 13h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" />
      </svg>
    );
  }
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4v7" />
      <path d="M7 4v7" />
      <path d="M4 8h3" />
      <path d="M6 11v9" />
      <path d="M14 4c2.2 0 4 1.8 4 4v12" />
      <path d="M18 8h-4" />
    </svg>
  );
}

export function LeistungenKachelGrid({
  id,
  heading,
  subtitle,
  className = "",
  headingClassName = "",
  introAlign = "left",
}: Props) {
  const titleClass = `text-2xl font-bold text-[#0F4F68] sm:text-3xl ${headingClassName}`.trim();
  const introCenter = introAlign === "center";
  return (
    <div className={className}>
      {id ? (
        <h2 id={id} className={`${titleClass} ${introCenter ? "mx-auto max-w-3xl text-center" : ""}`.trim()}>
          {heading}
        </h2>
      ) : (
        <h2 className={`${titleClass} ${introCenter ? "mx-auto max-w-3xl text-center" : ""}`.trim()}>{heading}</h2>
      )}
      <p
        className={`mt-2 text-sm text-[#8a6a55] sm:text-base ${introCenter ? "mx-auto max-w-2xl text-center" : ""}`.trim()}
      >
        {subtitle}
      </p>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STARTSEITE_LEISTUNGEN_KACHELN.map((leistung, index) => (
          <Link
            key={leistung.title}
            href={LEISTUNGS_LINKS_BY_ICON[leistung.icon]}
            className="rounded-2xl px-4 py-4 opacity-0 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_0_24px_rgba(15,79,104,0.15)] animate-fade-in-up focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            style={{ animationDelay: `${0.06 * (index + 1)}s` }}
          >
            <article className="flex items-start gap-3">
              <span
                className="mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white"
                aria-hidden
              >
                <LeistungIconGlyph icon={leistung.icon} />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-lg font-semibold leading-snug text-[#0F4F68]">{leistung.title}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
