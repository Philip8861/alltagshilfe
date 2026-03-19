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
  // PLZ + Leerzeichen + (ein Nicht-Buchstabe ODER 2+ Zeichen für "ÔÇô") + Leerzeichen
  const re = /\b(\d{5})\s+(?:[^\dA-Za-z]|.{2,})\s*/g;
  let m;
  while ((m = re.exec(block)) !== null) plzSet.add(m[1]);
  return [...plzSet].sort();
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

const phonePrefixesToExclude = ["07522"]; // Telefonvorwahl Wangen, keine PLZ

for (let i = 0; i < keys.length; i++) {
  let list = extractPlz(blocks[i]);
  if (keys[i] === "Wangen") list = list.filter((p) => !phonePrefixesToExclude.includes(p));
  results[keys[i]] = list;
  console.log(keys[i], results[keys[i]].length, "PLZ");
}

console.log(JSON.stringify(results, null, 2));

// Optional: PLZ-Listen für config/standorte.ts ausgeben (zum Kopieren)
if (process.argv.includes("--ts")) {
  const out = path.join(__dirname, "..", "config", "standorte-plz-generated.json");
  fs.writeFileSync(out, JSON.stringify(results, null, 2), "utf8");
  console.log("Geschrieben:", out);
}
