/**
 * Prüft, ob .env.local die Variablen für Partnerportal + Pflegebox-API enthält.
 * Aufruf: npm run check:partner-env
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

if (!String(vars.NEXT_PUBLIC_SUPABASE_URL).startsWith("http")) {
  console.error("NEXT_PUBLIC_SUPABASE_URL muss mit http beginnen.");
  process.exit(1);
}

console.log("OK: .env.local enthält URL, Anon-Key und Service-Role-Key.");
