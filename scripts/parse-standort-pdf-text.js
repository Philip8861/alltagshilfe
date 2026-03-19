const fs = require("fs");
const path = require("path");

// PDF-Text von npx pdf-parse text public/Standortlisten.pdf (gespeichert)
const rawPath = path.join(__dirname, "standortlisten-extract.txt");
let text;
try {
  const buf = fs.readFileSync(rawPath);
  // Windows redirect erzeugt oft UTF-16LE
  text = buf[0] === 0xff && buf[1] === 0xfe ? buf.toString("utf16le") : buf.toString("utf8");
} catch {
  console.error("Bitte zuerst ausführen: npx pdf-parse text public/Standortlisten.pdf > scripts/standortlisten-extract.txt");
  process.exit(1);
}

function extractPlz(block) {
  const plzSet = new Set();
  const re = /\b(\d{5})\s+(?:[^\dA-Za-z]|.{2,})\s*/g;
  let m;
  while ((m = re.exec(block)) !== null) plzSet.add(m[1]);
  return [...plzSet].sort();
}

/**
 * PLZ → Ortsname: Text *zwischen* zwei PLZ-Marken (nicht Regex bis zur nächsten PLZ),
 * damit z. B. "87435 – Kempten 87663 – Lengenwang" korrekt wird:
 * 87435→Kempten, 87663→Lengenwang (nicht 87435→Lengenwang).
 */
function extractPlzToOrt(block) {
  const plzToOrt = {};
  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    const plzRe = /\b(\d{5})\b/g;
    const hits = [...line.matchAll(plzRe)];
    if (hits.length === 0) continue;
    for (let i = 0; i < hits.length; i++) {
      const plz = hits[i][1];
      const from = hits[i].index + 5;
      const to = i + 1 < hits.length ? hits[i + 1].index : line.length;
      let ort = line.slice(from, to).trim();
      // Häufig im PDF-Text: „ÔÇô“ statt echtem Gedankenstrich (Encoding)
      ort = ort.replace(/^ÔÇô\s*/, "");
      ort = ort.replace(/^[\s\u2013\u2014\-\u2212\u00AD·.:]+/, "").trim();
      ort = ort.replace(/^[^\p{L}]+/gu, "").trim();
      ort = ort.replace(/\s+/g, " ");
      if (!ort || !/[A-Za-zÄÖÜäöüß\u00C0-\u024F]/.test(ort)) continue;
      plzToOrt[plz] = ort;
    }
  }
  return plzToOrt;
}

const keys = ["Allgäu", "Wangen", "Augsburg", "Engen/Konstanz"];
const results = {};
let idxAllgau = text.indexOf("86498");
let idxWangen = text.indexOf("Wangen (Bodensee");
if (idxWangen === -1) idxWangen = text.indexOf("Wangen");
let idxAugsburgStart = text.indexOf("\nAugsburg\n");
if (idxAugsburgStart === -1) idxAugsburgStart = text.indexOf("Ulmer Stra");
if (idxAugsburgStart === -1) idxAugsburgStart = text.indexOf("82278");
const idxEngen = text.indexOf("Engen/Konstanz");

const blocks = [
  text.slice(idxAllgau, idxWangen > 0 ? idxWangen : text.length),
  text.slice(idxWangen, idxAugsburgStart > 0 ? idxAugsburgStart : text.length),
  text.slice(idxAugsburgStart > 0 ? idxAugsburgStart : text.length, idxEngen > 0 ? idxEngen : text.length),
  text.slice(idxEngen, text.length),
];

const phonePrefixesToExclude = ["07522"];

const plzToOrt = {};
for (let i = 0; i < keys.length; i++) {
  let list = extractPlz(blocks[i]);
  if (keys[i] === "Wangen") list = list.filter((p) => !phonePrefixesToExclude.includes(p));
  results[keys[i]] = list;
  Object.assign(plzToOrt, extractPlzToOrt(blocks[i]));
  console.log(keys[i], results[keys[i]].length, "PLZ");
}
phonePrefixesToExclude.forEach((p) => delete plzToOrt[p]);

const output = { ...results, plzToOrt };
console.log(JSON.stringify(output, null, 2));

if (process.argv.includes("--ts")) {
  const out = path.join(__dirname, "..", "config", "standorte-plz-generated.json");
  fs.writeFileSync(out, JSON.stringify(output, null, 2), "utf8");
  console.log("Geschrieben:", out);
}
