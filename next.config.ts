import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
      {
        source: "/standorte/86156-pfersee",
        destination: "/standorte/86156-augsburg",
        permanent: true,
      },
      {
        source: "/standorte/86153-oberhausen",
        destination: "/standorte/86153-innenstadt",
        permanent: true,
      },
      {
        source: "/standorte/88441-streitberg",
        destination: "/standorte/88441-mittelbiberach",
        permanent: true,
      },
      {
        source: "/standorte/88454-winkel",
        destination: "/standorte/88454-hochdorf-an-der-riss",
        permanent: true,
      },
      {
        source: "/standorte/88662-berlingen",
        destination: "/standorte/88662-ueberlingen",
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
