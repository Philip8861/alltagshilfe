import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = `
AOK Baden-Württemberg
AOK Bayern
AOK Bremen/Bremerhaven
AOK Hessen
AOK Nordost
AOK NordWest
AOK Plus
AOK Rheinland-Pfalz/Saarland
AOK Rheinland/Hamburg
AOK Sachsen-Anhalt
AOK Niedersachsen
Audi BKK
BAHN-BKK
Barmer
Bertelsmann BKK
BIG direkt gesund
BKK Akzo Nobel Bayern
BKK B. Braun Aesculap
BKK Deutsche Bank AG
BKK Deutsche Post
BKK EWE
BKK EVM
BKK Evonik
BKK Faber-Castell & Partner
BKK Freudenberg
BKK Gildemeister Seidensticker
BKK Grillo-Werke
BKK Herkules
BKK HMR
BKK Linde
BKK MAHLE
BKK Melitta HMR
BKK Miele
BKK MTU Friedrichshafen
BKK Pfalz
BKK PricewaterhouseCoopers
BKK Public
BKK Rieker Ricosta Weisser
BKK RWE
BKK Salzgitter
BKK Scheufelen
BKK Technoform
BKK Textilgruppe Hof
BKK VDN
BKK Verkehrsbau Union
BKK Voralb
BKK Werra-Meissner
BKK Wirtschaft & Finanzen
BKK ZF & Partner
BMW BKK
Bosch BKK
Continentale BKK
DAK-Gesundheit
DIE BERGISCHE KRANKENKASSE
energie-BKK
Ernst & Young BKK
Heimat Krankenkasse
HEK – Hanseatische Krankenkasse
IKK Brandenburg und Berlin
IKK classic
IKK gesund plus
IKK Südwest
KKH Kaufmännische Krankenkasse
Knappschaft
mhplus Krankenkasse
Mobil Krankenkasse
Novitas BKK
pronova BKK
R+V Betriebskrankenkasse
Salus BKK
SBK Siemens-Betriebskrankenkasse
SECURVITA BKK
SKD BKK
Süddeutsche Krankenkasse
Techniker Krankenkasse
TK
Universität Bielefeld BKK
vivida bkk
WMF BKK
Zimmer BKK
actimonda bkk
atlas BKK ahlmann
BKK Akzent
BKK BPW Bergische Achsen
BKK Diakonie
BKK Dürkopp Adler
BKK Euregio
BKK exklusiv
BKK firmus
BKK Gesundheit
BKK Groz-Beckert
BKK Karl Mayer
BKK KBA
BKK Krones
BKK Merck
BKK Mobil Oil
BKK PwC
BKK Schwarzwald-Baar-Heuberg
BKK Stadt Augsburg
BKK24
Debeka BKK
Handelskrankenkasse (hkk)
Knappschaft-Bahn-See
Merck BKK
VIACTIV Krankenkasse
BKK Würth
BKK WMF
Daimler BKK
Betriebskrankenkasse Schwarzwald-Baar
IKK – Die Innovationskasse
Kaufmännische Krankenkasse – KKH
`;
const names = raw
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);
const uniq = [...new Set(names)].sort((a, b) => a.localeCompare(b, "de"));
const out = path.join(__dirname, "../public/konfigurator/krankenkassen.json");
fs.writeFileSync(out, JSON.stringify({ krankenkassen: uniq }));
console.log("written", uniq.length, out);
