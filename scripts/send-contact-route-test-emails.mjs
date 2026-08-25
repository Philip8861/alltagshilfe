/**
 * Sendet Test-E-Mails für alle internen Kontakt-Routen (ohne Statistik).
 * Aufruf: node scripts/send-contact-route-test-emails.mjs
 *
 * Nutzt SMTP_* aus .env.local. Kein recordContactSource – reine Routing-Prüfung.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

function parseEnvFile(content) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseList(raw) {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function resolveAnfragenmanager() {
  const fromEnv = parseList(process.env.NOTIFICATION_TO_ANFRAGENMANAGER);
  return fromEnv.length > 0 ? fromEnv : ["anfragenmanager@alltagshilfe-sued.de"];
}

function resolveKarriere() {
  const fromEnv = parseList(process.env.NOTIFICATION_TO_KARRIERE);
  return fromEnv.length > 0 ? fromEnv : ["daniel.niebauer@alltagshilfe-sued.de"];
}

function resolveKarriereContactTopic() {
  const only = parseList(process.env.NOTIFICATION_TO_CONTACT_TOPIC_KARRIERE);
  return only.length > 0 ? only : resolveKarriere();
}

function resolveBetrieblich() {
  const fromEnv = parseList(process.env.NOTIFICATION_TO_BETRIEBLICH_ANGEBOT);
  return fromEnv.length > 0 ? fromEnv : ["philip.sonntag@alltagshilfe-sued.de"];
}

function resolvePflegebox() {
  const specific = parseList(process.env.NOTIFICATION_TO_PFLEGEBOX);
  if (specific.length > 0) return specific;
  return parseList(process.env.NOTIFICATION_TO);
}

function parseSmtp() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !user || pass === undefined || pass === "") return null;
  const port = Number.parseInt(process.env.SMTP_PORT ?? "465", 10);
  const secureFlag = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure =
    secureFlag === "true" || secureFlag === "1"
      ? true
      : secureFlag === "false" || secureFlag === "0"
        ? false
        : port === 465;
  const from =
    process.env.MAIL_FROM?.trim() || `Alltagshilfe-Süd <${user}>`;
  return { host, port, secure, auth: { user, pass }, from };
}

const TEST_STAMP = new Date().toISOString();

/** @type {{ id: string; label: string; to: string[]; subject: string; kind: string }[]} */
const ROUTES = [
  {
    id: "kontakt",
    label: "Kontaktformular (allgemein)",
    to: resolveAnfragenmanager(),
    subject: "Anfragenmanager: Kontakt – Routing-Test",
    kind: "contact",
  },
  {
    id: "ratgeber-kontakt",
    label: "Kontaktformular Ratgeber",
    to: resolveAnfragenmanager(),
    subject: "Anfragenmanager: Ratgeber – Routing-Test",
    kind: "contact",
  },
  {
    id: "hilfefinder",
    label: "Hilfe-Finder",
    to: resolveAnfragenmanager(),
    subject: "Anfragenmanager: Hilfe-Finder – Rückruf gewünscht (Routing-Test)",
    kind: "contact",
  },
  {
    id: "landingpage-social",
    label: "Social-Media-Landingpage",
    to: resolveAnfragenmanager(),
    subject: "Anfragenmanager: Social-Media-Landingpage – Rückruf gewünscht (Routing-Test)",
    kind: "contact",
  },
  {
    id: "ratgeber-inko",
    label: "Ratgeber Inkontinenz-Rückruf",
    to: resolveAnfragenmanager(),
    subject: "Anfragenmanager: Ratgeber – Inkontinenz-Rückruf (Routing-Test)",
    kind: "contact",
  },
  {
    id: "karriere-formular",
    label: "Karriere-Bewerbungsformular",
    to: resolveKarriere(),
    subject: "Karriere: Routing-Test – Test, Routing",
    kind: "karriere",
  },
  {
    id: "kontakt-karriere",
    label: "Kontaktformular Thema Karriere",
    to: resolveKarriereContactTopic(),
    subject: "Kontakt: Karriere",
    kind: "contact",
  },
  {
    id: "kooperation",
    label: "Kooperationsanfrage",
    to: ["philip.sonntag@alltagshilfe-sued.de"],
    subject: "Kontakt: Kooperation",
    kind: "contact",
  },
  {
    id: "betrieblich-angebot",
    label: "Betriebliche Pflegeberatung (Angebot-Popup)",
    to: resolveBetrieblich(),
    subject: "Anfrage: Betriebliche Pflegeberatung (Angebot)",
    kind: "contact",
  },
  {
    id: "pflegebox",
    label: "Pflegebox-Bestellung",
    to: resolvePflegebox(),
    subject: "Pflegebox: Routing-Test – Testbestellung",
    kind: "pflegebox",
  },
];

function buildBody(route) {
  return [
    "[ROUTING-TEST – KEINE ECHTE ANFRAGE]",
    "",
    `Kanal: ${route.label}`,
    `Route-ID: ${route.id}`,
    `Zeitstempel: ${TEST_STAMP}`,
    "",
    "Diese E-Mail dient ausschließlich der Prüfung des E-Mail-Routings.",
    "Sie wurde NICHT über ein Website-Formular ausgelöst und wird NICHT in der Statistik gezählt.",
    "",
    "Bitte nach dem Test wieder löschen.",
  ].join("\n");
}

async function main() {
  if (!fs.existsSync(envPath)) {
    console.error("Fehlt: .env.local (SMTP_* muss gesetzt sein).");
    process.exit(1);
  }
  Object.assign(process.env, parseEnvFile(fs.readFileSync(envPath, "utf8")));

  const useProduction = process.argv.includes("--production");
  if (useProduction) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
    const secret = process.env.PARTNER_SYSTEM_ADMIN_SECRET?.trim();
    if (!siteUrl || !secret || secret.length < 24) {
      console.error("Für --production: NEXT_PUBLIC_SITE_URL und PARTNER_SYSTEM_ADMIN_SECRET in .env.local nötig.");
      process.exit(1);
    }
    const url = `${siteUrl}/api/partner/admin/contact-route-test`;
    console.log(`Rufe Production-API auf: ${url}`);
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`HTTP ${res.status}:`, body);
      process.exit(1);
    }
    console.log(JSON.stringify(body, null, 2));
    for (const r of body.results ?? []) {
      console.log(`${r.ok ? "OK" : "FEHLER"}  ${r.id} → ${r.to}${r.error ? ` (${r.error})` : ""}`);
    }
    process.exit(body.ok ? 0 : 1);
    return;
  }

  const conn = parseSmtp();
  if (!conn) {
    console.error("SMTP nicht konfiguriert (SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local).");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: conn.host,
    port: conn.port,
    secure: conn.secure,
    auth: conn.auth,
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 25_000,
    ...(conn.port === 587 && !conn.secure ? { requireTLS: true } : {}),
  });

  /** @type {{ id: string; ok: boolean; to: string; subject: string; error?: string }[]} */
  const results = [];

  for (const route of ROUTES) {
    if (route.to.length === 0) {
      results.push({
        id: route.id,
        ok: false,
        to: "(kein Empfänger konfiguriert)",
        subject: route.subject,
        error: "NOTIFICATION_TO / NOTIFICATION_TO_PFLEGEBOX fehlt",
      });
      continue;
    }

    const subject = `[ROUTING-TEST] ${route.subject}`;
    try {
      await transporter.sendMail({
        from: conn.from,
        to: route.to.join(", "),
        subject,
        text: buildBody(route),
      });
      results.push({
        id: route.id,
        ok: true,
        to: route.to.join(", "),
        subject,
      });
      console.log(`OK  ${route.id} → ${route.to.join(", ")}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({
        id: route.id,
        ok: false,
        to: route.to.join(", "),
        subject: route.subject,
        error: msg,
      });
      console.error(`FEHLER ${route.id}: ${msg}`);
    }
  }

  console.log("\n--- Zusammenfassung ---");
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.id}: ${r.to} | ${r.subject}${r.error ? ` | ${r.error}` : ""}`);
  }

  const failed = results.filter((r) => !r.ok);
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
