import type { NextConfig } from "next";

/**
 * Alte WordPress-/Stadt-Landing-URLs (ohne www, Pfad ab Root) → aktuelle Standortseiten.
 * Zuordnung über PLZ-Gebiete in config/standorte-plz-generated.json (Allgäu, Wangen, Augsburg, Engen/Konstanz).
 */
const LEGACY_STADT_PATH_TO_STANDORT_SLUG: Record<string, string> = {
  augsburg: "augsburg",
  "bad-woerishofen": "allgaeu",
  friedrichshafen: "wangen",
  fuessen: "allgaeu",
  isny: "wangen",
  kaufbeuren: "allgaeu",
  kempten: "allgaeu",
  konstanz: "engen",
  "leutkirch-im-allgaeu": "wangen",
  lindau: "wangen",
  lindenberg: "wangen",
  memmingen: "wangen",
  ravensburg: "wangen",
  "sonthofen-immenstadt": "allgaeu",
  tettnang: "wangen",
  ueberlingen: "engen",
  "wangen-3": "wangen",
};

function legacyStadtRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const [stadtPath, standortSlug] of Object.entries(LEGACY_STADT_PATH_TO_STANDORT_SLUG)) {
    const destination = `/standorte/${standortSlug}`;
    out.push(
      { source: `/${stadtPath}`, destination, permanent: true },
      { source: `/${stadtPath}/`, destination, permanent: true },
      { source: `/${stadtPath}/:path+`, destination, permanent: true },
    );
  }
  return out;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * Karriere-Bewerbung (Kurzcheck + ggf. Formular): Anhänge bis 24 MB.
   * Ohne Erhöhung bricht Next.js Server Actions bei ~1 MB ab – Upload wirkt dann „kaputt“.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  async redirects() {
    return [
      ...legacyStadtRedirects(),
      { source: "/blog", destination: "/ratgeber", permanent: true },
      { source: "/blog/:path*", destination: "/ratgeber", permanent: true },
      { source: "/leistungen", destination: "/", permanent: true },
      {
        source: "/leistungen/pflegeberatung-einsaetze",
        destination: "/pflegeberatung/private-pflegeberatung",
        permanent: true,
      },
      {
        source: "/leistungen/pflegehilfsmittelbox",
        destination: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
        permanent: true,
      },
      {
        source: "/leistungen/betriebliche-pflegeberatung",
        destination: "/pflegeberatung",
        permanent: true,
      },
      {
        source: "/leistungen/betreuung-beschaeftigung",
        destination: "/leistungen/alltagsbegleitung-betreuung",
        permanent: true,
      },
      {
        source: "/leistungen/einkaufsservice",
        destination: "/#unsere-leistungen",
        permanent: true,
      },
    ];
  },
  /* Konfigurator: nach CSS/HTML-Änderungen nicht aus CDN-Browser-Cache „tot“ laden */
  async headers() {
    return [
      {
        source: "/konfigurator/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
