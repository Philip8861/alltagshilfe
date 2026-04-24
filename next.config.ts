import type { NextConfig } from "next";

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
