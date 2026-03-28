/**
 * Prüft, ob .env.local die Variablen für Partnerportal + Pflegebox-API enthält.
 * Aufruf: npm run check:partner-env
 *
 * Hinweis: NEXT_PUBLIC_* wird auf Vercel beim Build eingebaut — nach Änderung dort immer Redeploy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

if (!fs.existsSync(envPath)) {
  console.error("Fehlt: .env.local im Projektroot.");
  console.error("Lege die Datei an (siehe .env.example) und trage die drei Supabase-Variablen ein.");
  process.exit(1);
}

const vars = parseEnvFile(fs.readFileSync(envPath, "utf8"));
const missing = required.filter((k) => !vars[k] || !String(vars[k]).trim());

if (missing.length) {
  console.error("In .env.local fehlen oder sind leer:");
  missing.forEach((k) => console.error("  -", k));
  console.error("\nQuelle: Supabase → Project Settings → API");
  process.exit(1);
}

const urlRaw = String(vars.NEXT_PUBLIC_SUPABASE_URL).trim();
if (!urlRaw.startsWith("http")) {
  console.error("NEXT_PUBLIC_SUPABASE_URL muss mit https:// beginnen (Supabase Project URL).");
  process.exit(1);
}
if (urlRaw.includes(" ") || String(vars.NEXT_PUBLIC_SUPABASE_ANON_KEY).includes(" ")) {
  console.warn("Warnung: URL oder Anon-Key enthält Leerzeichen — Anführungszeichen in .env prüfen.");
}

console.log("OK: .env.local enthält URL, Anon-Key und Service-Role-Key.");

const verwaltung = [
  "PARTNER_SYSTEM_ADMIN_USER",
  "PARTNER_SYSTEM_ADMIN_PASSWORD",
  "PARTNER_SYSTEM_ADMIN_SECRET",
];
const missV = verwaltung.filter((k) => !vars[k] || !String(vars[k]).trim());
console.log("\n--- Partner-Verwaltung (/partner/admin-login) ---");
if (missV.length) {
  console.warn("Noch nicht gesetzt (ohne diese geht die Verwaltung nicht):");
  missV.forEach((k) => console.warn("  -", k));
  console.warn('\nSECRET erzeugen: npm run partner:admin-secret');
  console.warn("Siehe auch .env.example");
} else {
  const sec = String(vars.PARTNER_SYSTEM_ADMIN_SECRET).trim();
  if (sec.length < 24) {
    console.error("PARTNER_SYSTEM_ADMIN_SECRET muss mindestens 24 Zeichen haben.");
    process.exit(1);
  }
  console.log("OK: Verwaltungs-Login (USER, PASSWORD, SECRET) ist gesetzt.");
}

console.log("\n--- Was Sie noch selbst tun müssen (nicht automatisierbar) ---");
console.log("1) Vercel: dieselben Variablen wie in .env.local unter Environment Variables (Production).");
console.log("2) Vercel: Nach jeder Änderung an NEXT_PUBLIC_* → Deployments → Redeploy (neuer Build).");
console.log("3) Optional: Variablen per Skript: VERCEL_TOKEN=... npm run vercel:push-partner-env");
console.log("4) Supabase: Sign-ups aus; SQL 001_partner_portal.sql ausgeführt.");
