/**
 * Liest Partner-Supabase-Variablen aus .env.local und setzt sie im Vercel-Projekt per API.
 *
 * Voraussetzungen:
 * 1. Token: https://vercel.com/account/tokens → VERCEL_TOKEN in der Shell setzen (nicht committen).
 * 2. Projekt: einmal `npx vercel link` im Projektroot (legt .vercel/project.json an),
 *    oder VERCEL_PROJECT_ID und optional VERCEL_TEAM_ID setzen.
 *
 * Aufruf: npm run vercel:push-partner-env
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/** @param {string} content */
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

function loadVercelProjectMeta() {
  const p = path.join(root, ".vercel", "project.json");
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

async function createOrUpdateEnv(token, projectId, teamId, body) {
  const qp = new URLSearchParams({ upsert: "true" });
  if (teamId) qp.set("teamId", teamId);
  const url = `https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/env?${qp}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  return text;
}

async function main() {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) {
    console.error("Fehlt: Umgebungsvariable VERCEL_TOKEN.");
    console.error("Erstellen: https://vercel.com/account/tokens");
    console.error('Dann in PowerShell z. B.: $env:VERCEL_TOKEN="…"; npm run vercel:push-partner-env');
    process.exit(1);
  }

  const meta = loadVercelProjectMeta();
  const projectId =
    process.env.VERCEL_PROJECT_ID?.trim() || meta?.projectId || "";
  const teamId =
    process.env.VERCEL_TEAM_ID?.trim() ||
    process.env.VERCEL_ORG_ID?.trim() ||
    meta?.orgId ||
    undefined;

  if (!projectId) {
    console.error("Kein Projekt: VERCEL_PROJECT_ID setzen oder im Projektroot `npx vercel link` ausführen.");
    process.exit(1);
  }

  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Fehlt: .env.local (mit NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY).");
    process.exit(1);
  }

  const vars = parseEnvFile(fs.readFileSync(envPath, "utf8"));
  const url = vars.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = vars.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !url.startsWith("http")) {
    console.error("In .env.local: NEXT_PUBLIC_SUPABASE_URL fehlt oder ist ungültig.");
    process.exit(1);
  }
  if (!anon) {
    console.error("In .env.local: NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt oder ist leer.");
    process.exit(1);
  }

  const allTargets = ["production", "preview", "development"];
  const serverTargets = ["production", "preview"];

  /** @type {{ key: string; value: string; type: string; target: string[] }[]} */
  const items = [
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      value: url,
      type: "plain",
      target: allTargets,
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: anon,
      type: "encrypted",
      target: allTargets,
    },
  ];

  const siteUrl = vars.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    items.push({
      key: "NEXT_PUBLIC_SITE_URL",
      value: siteUrl,
      type: "plain",
      target: allTargets,
    });
  }

  const serviceRole = vars.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRole) {
    items.push({
      key: "SUPABASE_SERVICE_ROLE_KEY",
      value: serviceRole,
      type: "sensitive",
      target: serverTargets,
    });
  } else {
    console.warn(
      "Hinweis: SUPABASE_SERVICE_ROLE_KEY ist leer — wird nicht nach Vercel übertragen (Partner-Login reicht mit URL + Anon-Key).",
    );
  }

  for (const item of items) {
    process.stdout.write(`Setze ${item.key} … `);
    await createOrUpdateEnv(token, projectId, teamId, {
      key: item.key,
      value: item.value,
      type: item.type,
      target: item.target,
    });
    console.log("OK");
  }

  console.log("\nFertig. Vercel startet bei Bedarf neu: Deployments → … → Redeploy, oder ein leerer Commit + push.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
