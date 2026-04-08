/**
 * Startseite – geführter Einstieg („Welche Unterstützung brauchen Sie gerade?“).
 *
 * Hier Texte und Ziele zentral pflegen:
 * - `HAUPT_KARTEN`, `UNTER_BEREICHE`, `MINI_ASSISTENT_SCHRITTE`
 * - `SERVICE_KEYS` / `serviceLinks` / `ergebnisInhalte`
 */

/** Interne Schlüssel für Ergebnis-CTAs und Links */
export type ServiceErgebnisKey =
  | "haushalt"
  | "pflegeberatung"
  | "pflegehilfsmittel"
  | "inkontinenz"
  | "pflegeshop"
  | "essen"
  | "leistungen_ueberblick"
  | "rueckruf";

export const serviceLinks: Record<
  ServiceErgebnisKey,
  { mehr?: string; kontakt: string; shop?: string }
> = {
  haushalt: {
    mehr: "/leistungen/haushaltshilfe",
    kontakt: "/kontakt",
  },
  pflegeberatung: {
    mehr: "/pflegeberatung",
    kontakt: "/kontakt",
  },
  pflegehilfsmittel: {
    mehr: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
    kontakt: "/kontakt",
  },
  inkontinenz: {
    mehr: "/inkontinenzversorgung",
    kontakt: "/kontakt",
  },
  pflegeshop: {
    mehr: "/pflegeshop",
    kontakt: "/kontakt",
    shop: "/pflegeshop",
  },
  essen: {
    mehr: "/leistungen/essen-auf-raeder",
    kontakt: "/kontakt",
  },
  leistungen_ueberblick: {
    mehr: "/leistungen",
    kontakt: "/kontakt",
  },
  rueckruf: {
    kontakt: "/kontakt",
  },
};

export type HauptKartenId = "alltag" | "beratung" | "bestimmt";

export const HAUPT_KARTEN: {
  id: HauptKartenId;
  titel: string;
  text: string;
}[] = [
  {
    id: "alltag",
    titel: "Ich brauche Hilfe im Alltag",
    text: "Haushaltshilfe, Alltagsbegleitung, Pflegehilfsmittel oder Unterstützung im Alltag finden",
  },
  {
    id: "beratung",
    titel: "Ich brauche Beratung zur Pflege",
    text: "Pflegeberatung nach §37.3 SGB XI, passende Leistungen und nächste Schritte klären",
  },
  {
    id: "bestimmt",
    titel: "Ich suche etwas Bestimmtes",
    text: "Inkontinenzversorgung, Pflegeshop oder Essen auf Räder im Raum Kempten",
  },
];

export const UNTER_BEREICHE: Record<
  HauptKartenId,
  {
    ueberschrift: string;
    text: string;
    optionen: { key: ServiceErgebnisKey; label: string; hinweis?: string }[];
  }
> = {
  alltag: {
    ueberschrift: "Wir helfen Ihnen, die passende Unterstützung zu finden",
    text: "Wählen Sie einfach aus, was gerade am besten zu Ihrer Situation passt. Wir zeigen Ihnen im nächsten Schritt die passende Unterstützung.",
    optionen: [
      { key: "haushalt", label: "Haushaltshilfe & Alltagsbegleitung" },
      { key: "pflegehilfsmittel", label: "Kostenfreie Pflegehilfsmittel" },
      { key: "inkontinenz", label: "Inkontinenzversorgung" },
      {
        key: "essen",
        label: "Essen auf Räder",
        hinweis: "Nur im Raum Kempten",
      },
    ],
  },
  beratung: {
    ueberschrift: "Gut, dass Sie sich informieren",
    text: "Pflegefragen sind oft komplex. Wir führen Sie Schritt für Schritt zur passenden Unterstützung oder zur persönlichen Beratung.",
    optionen: [
      { key: "pflegeberatung", label: "Pflegeberatung nach §37.3 SGB XI" },
      {
        key: "leistungen_ueberblick",
        label: "Welche Leistungen passen zu meiner Situation?",
      },
      { key: "rueckruf", label: "Ich wünsche einen Rückruf" },
    ],
  },
  bestimmt: {
    ueberschrift: "Sie können direkt zur passenden Leistung gehen",
    text: "",
    optionen: [
      { key: "pflegeshop", label: "Pflegeshop" },
      { key: "inkontinenz", label: "Inkontinenzversorgung" },
      { key: "pflegehilfsmittel", label: "Kostenfreie Pflegehilfsmittel" },
      {
        key: "essen",
        label: "Essen auf Räder im Raum Kempten",
        hinweis: "Nur im Raum Kempten",
      },
      { key: "haushalt", label: "Haushaltshilfe & Alltagsbegleitung" },
      { key: "pflegeberatung", label: "Pflegeberatung" },
    ],
  },
};

export const MINI_ASSISTENT_SCHRITTE = {
  schritt1: {
    frage: "Wobei dürfen wir helfen?",
    optionen: [
      { key: "haushalt" as const, label: "Hilfe im Alltag" },
      { key: "pflegeberatung" as const, label: "Pflegeberatung" },
      { key: "pflegehilfsmittel" as const, label: "Pflegehilfsmittel" },
      { key: "inkontinenz" as const, label: "Inkontinenzversorgung" },
      { key: "pflegeshop" as const, label: "Pflegeshop" },
      { key: "essen" as const, label: "Essen auf Räder" },
    ],
  },
  schritt2: {
    frage: "Für wen suchen Sie Unterstützung?",
    optionen: [
      { id: "mich", label: "Für mich" },
      { id: "angehoerige", label: "Für Angehörige" },
      { id: "informieren", label: "Ich informiere mich erst einmal" },
    ],
  },
  schritt3: {
    frage: "Was ist Ihnen jetzt am wichtigsten?",
    optionen: [
      { id: "kontakt", label: "Schnell Kontakt aufnehmen" },
      { id: "info", label: "Erst Informationen ansehen" },
      { id: "rueckruf", label: "Rückruf erhalten" },
      { id: "leistung", label: "Passende Leistung anzeigen" },
    ],
  },
};

/** Ergebnis-Texte nach Leistung (Hauptkarten + Assistent) */
export const ergebnisInhalte: Record<
  ServiceErgebnisKey,
  {
    titel: string;
    leistung: string;
    text: string;
    essenHinweis?: string;
  }
> = {
  haushalt: {
    titel: "Das könnte gut zu Ihrer Situation passen",
    leistung: "Haushaltshilfe & Alltagsbegleitung",
    text: "Wir unterstützen Sie im Alltag – persönlich und zuverlässig.",
  },
  pflegeberatung: {
    titel: "Die passende Unterstützung für Ihr Anliegen",
    leistung: "Pflegeberatung nach §37.3 SGB XI",
    text: "Wir beraten Sie verständlich und persönlich zu den nächsten Schritten.",
  },
  pflegehilfsmittel: {
    titel: "Diese Leistung passt wahrscheinlich gut",
    leistung: "Kostenfreie Pflegehilfsmittel",
    text: "Wir zeigen Ihnen, welche Pflegehilfsmittel möglich sind und wie Sie diese erhalten können.",
  },
  inkontinenz: {
    titel: "Passende Unterstützung für den Alltag",
    leistung: "Inkontinenzversorgung",
    text: "Wir helfen Ihnen dabei, die passende Versorgung einfach und diskret zu finden.",
  },
  pflegeshop: {
    titel: "Sie können direkt zu den passenden Produkten wechseln",
    leistung: "Pflegeshop",
    text: "Stöbern Sie in Ruhe in unserem Sortiment – wir sind bei Fragen für Sie da.",
  },
  essen: {
    titel: "Diese Leistung bieten wir im Raum Kempten an",
    leistung: "Essen auf Räder",
    text: "Frische Mahlzeiten – abgestimmt auf Ihre Situation, mit liebevoller Unterstützung bei uns.",
    essenHinweis: "Verfügbar nur im Raum Kempten",
  },
  leistungen_ueberblick: {
    titel: "Gern geben wir Ihnen Orientierung",
    leistung: "Unsere Leistungen im Überblick",
    text: "Auf einen Blick sehen Sie, wobei wir Sie unterstützen können – ganz ohne Verpflichtung.",
  },
  rueckruf: {
    titel: "Wir melden uns gern persönlich bei Ihnen",
    leistung: "Persönlicher Rückruf",
    text: "Schreiben Sie uns kurz Ihr Anliegen – wir rufen Sie zurück, sobald es uns möglich ist.",
  },
};

export const EINSTIEG_KOPF = {
  headline: "Welche Unterstützung brauchen Sie gerade?",
  subline:
    "Wir helfen Ihnen dabei, schnell die passende Unterstützung zu finden – für Sie selbst oder für Angehörige. Persönlich, verständlich und ohne komplizierte Wege.",
  vertrauen: "Persönliche Beratung · Schnelle Hilfe · Verständliche Empfehlung",
} as const;

export const EINSTIEG_CTA = {
  headline: "Unsicher, was am besten passt?",
  text: "Wir helfen Ihnen in wenigen Schritten zur passenden Unterstützung.",
  button: "Passende Hilfe finden",
} as const;

/** Primäre / sekundäre Buttons unter dem Ergebnis-Block */
export const ergebnisAktionen: Record<ServiceErgebnisKey, { label: string; href: string }[]> = {
  haushalt: [
    { label: "Mehr erfahren", href: serviceLinks.haushalt.mehr! },
    { label: "Rückruf anfordern", href: serviceLinks.haushalt.kontakt },
  ],
  pflegeberatung: [
    { label: "Beratung ansehen", href: serviceLinks.pflegeberatung.mehr! },
    { label: "Jetzt Rückruf anfragen", href: serviceLinks.pflegeberatung.kontakt },
  ],
  pflegehilfsmittel: [{ label: "Pflegehilfsmittel ansehen", href: serviceLinks.pflegehilfsmittel.mehr! }],
  inkontinenz: [{ label: "Mehr erfahren", href: serviceLinks.inkontinenz.mehr! }],
  pflegeshop: [{ label: "Zum Pflegeshop", href: serviceLinks.pflegeshop.shop! }],
  essen: [{ label: "Essen auf Räder ansehen", href: serviceLinks.essen.mehr! }],
  leistungen_ueberblick: [
    { label: "Leistungen ansehen", href: serviceLinks.leistungen_ueberblick.mehr! },
    { label: "Kontakt aufnehmen", href: serviceLinks.leistungen_ueberblick.kontakt },
  ],
  rueckruf: [{ label: "Kontakt & Rückruf", href: serviceLinks.rueckruf.kontakt }],
};
