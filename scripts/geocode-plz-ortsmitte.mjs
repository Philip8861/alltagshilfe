/**
 * Erzeugt config/plz-centroids-ortsmitte.json: Nominatim (Ortsmitte / PLZ).
 * node scripts/geocode-plz-ortsmitte.mjs
 * node scripts/geocode-plz-ortsmitte.mjs --retry-failed   (nur Einträge noch identisch zu geometrischem Fallback)
 */
import fs from "fs";
import { fileURLToPath } from "url";
import pathMod from "path";

const __dirname = pathMod.dirname(fileURLToPath(import.meta.url));
const root = pathMod.join(__dirname, "..");

const UA =
  "Alltagshilfe-Sued-Homepage/1.0 (internes PLZ-Geocoding; https://www.alltagshilfe-sued.de/impressum)";

const retryFailed = process.argv.includes("--retry-failed");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** PDF-Abkürzung „b“ → „bei“ für Nominatim. */
function normalizeOrt(ort) {
  return ort.replace(/\sb\s+/gi, " bei ").trim();
}

function parseFirstHit(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

async function nominatimGet(params) {
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Accept-Language": "de",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function geocodeOrtsmitte(plz, ortRaw) {
  const ort = normalizeOrt(ortRaw);

  const r1 = await nominatimGet(
    new URLSearchParams({
      format: "json",
      postalcode: plz,
      city: ort,
      countrycodes: "de",
      limit: "1",
    }),
  );
  let h = parseFirstHit(r1);
  if (h) return h;

  await sleep(1100);

  const r2 = await nominatimGet(
    new URLSearchParams({
      format: "json",
      q: `${plz} ${ort}, Deutschland`,
      countrycodes: "de",
      limit: "1",
    }),
  );
  h = parseFirstHit(r2);
  if (h) return h;

  if (ort !== ortRaw) {
    await sleep(1100);
    const r2b = await nominatimGet(
      new URLSearchParams({
        format: "json",
        q: `${plz} ${ortRaw}, Deutschland`,
        countrycodes: "de",
        limit: "1",
      }),
    );
    h = parseFirstHit(r2b);
    if (h) return h;
  }

  await sleep(1100);
  const r3 = await nominatimGet(
    new URLSearchParams({
      format: "json",
      postalcode: plz,
      countrycodes: "de",
      limit: "1",
    }),
  );
  h = parseFirstHit(r3);
  if (h) return h;

  if (/^861\d{2}$/.test(plz) && /viertel/i.test(ortRaw)) {
    await sleep(1100);
    const r4 = await nominatimGet(
      new URLSearchParams({
        format: "json",
        q: `${plz} Augsburg, Deutschland`,
        countrycodes: "de",
        limit: "1",
      }),
    );
    return parseFirstHit(r4);
  }

  return null;
}

async function main() {
  const generated = JSON.parse(
    fs.readFileSync(pathMod.join(root, "config", "standorte-plz-generated.json"), "utf8"),
  );
  const plzToOrt = generated.plzToOrt ?? {};
  const oldCent = JSON.parse(fs.readFileSync(pathMod.join(root, "config", "plz-centroids.json"), "utf8"));
  const outPath = pathMod.join(root, "config", "plz-centroids-ortsmitte.json");

  let existing = {};
  if (retryFailed && fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
  }

  const plzs = Object.keys(oldCent).sort();
  const out = retryFailed ? { ...existing } : {};
  let geocoded = 0;
  let fallback = 0;
  let skipped = 0;

  for (const plz of plzs) {
    const ort = plzToOrt[plz];
    if (!ort) {
      if (!retryFailed) {
        out[plz] = oldCent[plz];
        fallback++;
        console.warn(`Kein Ortsname für ${plz}, Fallback geometrisch.`);
      }
      continue;
    }

    if (retryFailed) {
      const prev = existing[plz];
      const old = oldCent[plz];
      const stillFallback =
        prev &&
        old &&
        Math.abs(prev.lat - old.lat) < 1e-9 &&
        Math.abs(prev.lng - old.lng) < 1e-9;
      if (!stillFallback) {
        skipped++;
        continue;
      }
    }

    try {
      const c = await geocodeOrtsmitte(plz, ort);
      if (c) {
        out[plz] = c;
        geocoded++;
      } else if (!retryFailed) {
        out[plz] = oldCent[plz];
        fallback++;
        console.warn(`Nominatim leer: ${plz} ${ort}`);
      } else {
        console.warn(`Retry leer: ${plz} ${ort}`);
        fallback++;
      }
    } catch (e) {
      if (!retryFailed) {
        out[plz] = oldCent[plz];
        fallback++;
      }
      console.warn(`Fehler ${plz} ${ort}:`, e?.message ?? e);
    }
    await sleep(1100);
  }

  if (retryFailed) {
    fs.writeFileSync(outPath, JSON.stringify(out));
    console.log(
      `Aktualisiert: ${outPath} (neu geocodiert: ${geocoded}, Retry-Fallback: ${fallback}, übersprungen: ${skipped})`,
    );
  } else {
    fs.writeFileSync(outPath, JSON.stringify(out));
    console.log(`Geschrieben: ${outPath} (Nominatim: ${geocoded}, Fallback: ${fallback}, gesamt: ${plzs.length})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
