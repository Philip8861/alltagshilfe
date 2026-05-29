import type { NextConfig } from "next";

/**
 * Alte WordPress-/Stadt-Landing-URLs → `/standorte/{slug}?plz=&ort=` (wie Standortsucher).
 * PLZ/Ort passend zu `config/standorte-plz-generated.json` (Ortsnamen für konsistente Anzeige).
 */
const LEGACY_STADT_REDIRECTS: {
  path: string;
  standortSlug: string;
  plz: string;
  ort: string;
}[] = [
  { path: "augsburg", standortSlug: "augsburg", plz: "86156", ort: "Augsburg" },
  { path: "bad-woerishofen", standortSlug: "allgaeu", plz: "86825", ort: "Bad Wörishofen" },
  { path: "friedrichshafen", standortSlug: "wangen", plz: "88045", ort: "Friedrichshafen" },
  { path: "fuessen", standortSlug: "allgaeu", plz: "87629", ort: "Füssen" },
  { path: "isny", standortSlug: "wangen", plz: "88316", ort: "Isny im Allgäu" },
  { path: "kaufbeuren", standortSlug: "allgaeu", plz: "87600", ort: "Kaufbeuren" },
  { path: "kempten", standortSlug: "allgaeu", plz: "87435", ort: "Kempten" },
  { path: "konstanz", standortSlug: "engen", plz: "78462", ort: "Konstanz" },
  { path: "leutkirch-im-allgaeu", standortSlug: "wangen", plz: "88299", ort: "Leutkirch im Allgäu" },
  { path: "lindau", standortSlug: "wangen", plz: "88131", ort: "Lindau" },
  { path: "lindenberg", standortSlug: "wangen", plz: "88161", ort: "Lindenberg im Allgäu" },
  { path: "memmingen", standortSlug: "wangen", plz: "87700", ort: "Memmingen" },
  { path: "ravensburg", standortSlug: "wangen", plz: "88212", ort: "Ravensburg" },
  { path: "sonthofen-immenstadt", standortSlug: "allgaeu", plz: "87527", ort: "Sonthofen" },
  { path: "tettnang", standortSlug: "wangen", plz: "88069", ort: "Tettnang" },
  { path: "ueberlingen", standortSlug: "engen", plz: "88662", ort: "Überlingen" },
  { path: "wangen-3", standortSlug: "wangen", plz: "88239", ort: "Wangen im Allgäu" },
  { path: "ulm", standortSlug: "ulm", plz: "89073", ort: "Ulm" },
  { path: "neu-ulm", standortSlug: "ulm", plz: "89231", ort: "Neu-Ulm" },
  { path: "blaustein", standortSlug: "ulm", plz: "89134", ort: "Blaustein" },
  { path: "senden", standortSlug: "ulm", plz: "89250", ort: "Senden" },
  { path: "dornstadt", standortSlug: "ulm", plz: "89160", ort: "Dornstadt" },
  { path: "elchingen", standortSlug: "ulm", plz: "89275", ort: "Elchingen" },
  { path: "nersingen", standortSlug: "ulm", plz: "89278", ort: "Nersingen" },
];

function legacyStadtRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const row of LEGACY_STADT_REDIRECTS) {
    const qs = new URLSearchParams({ plz: row.plz, ort: row.ort }).toString();
    const destination = `/standorte/${row.standortSlug}?${qs}`;
    out.push(
      { source: `/${row.path}`, destination, permanent: true },
      { source: `/${row.path}/`, destination, permanent: true },
      { source: `/${row.path}/:path+`, destination, permanent: true },
    );
  }
  return out;
}

/** Alte WP-/Marketing-Pfade → aktuelle App-Routen (Migration alltagshilfe-sued.de). */
function legacyHauptnavigationRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  const out: { source: string; destination: string; permanent: boolean }[] = [
    { source: "/unsere-leistungen", destination: "/#unsere-leistungen", permanent: true },
    { source: "/unsere-leistungen/", destination: "/#unsere-leistungen", permanent: true },
    { source: "/unsere-leistungen/:path+", destination: "/#unsere-leistungen", permanent: true },
  ];
  for (const slug of ["karriere", "kontakt", "impressum", "datenschutz"] as const) {
    out.push({ source: `/${slug}/`, destination: `/${slug}`, permanent: true });
  }
  return out;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/partner-avatars/**",
      },
      ...(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
        if (!url) return [];
        try {
          const { hostname } = new URL(url);
          if (hostname.endsWith(".supabase.co")) return [];
          return [
            {
              protocol: "https" as const,
              hostname,
              pathname: "/storage/v1/object/public/partner-avatars/**",
            },
          ];
        } catch {
          return [];
        }
      })(),
    ],
  },
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
      ...legacyHauptnavigationRedirects(),
      {
        source: "/private-pflegeberatung",
        destination: "/pflegeberatung/private-pflegeberatung",
        permanent: true,
      },
      {
        source: "/private-pflegeberatung/",
        destination: "/pflegeberatung/private-pflegeberatung",
        permanent: true,
      },
      {
        source: "/private-pflegeberatung/:path+",
        destination: "/pflegeberatung/private-pflegeberatung",
        permanent: true,
      },
      {
        source: "/betriebliche-pflegeberatung",
        destination: "/pflegeberatung#betriebliche-pflegeberatung",
        permanent: true,
      },
      {
        source: "/betriebliche-pflegeberatung/",
        destination: "/pflegeberatung#betriebliche-pflegeberatung",
        permanent: true,
      },
      {
        source: "/betriebliche-pflegeberatung/:path+",
        destination: "/pflegeberatung#betriebliche-pflegeberatung",
        permanent: true,
      },
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
        destination: "/pflegeberatung#betriebliche-pflegeberatung",
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
