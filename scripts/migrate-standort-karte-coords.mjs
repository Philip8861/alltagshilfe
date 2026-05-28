import fs from "fs";
import {
  containerPercentToMapPercent,
  roundMapCoord,
} from "../lib/standort-karte-coords.ts";

const W = 1000;
const H = (W * 2.5) / 3;
const file = "config/standort-karte.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

function convert(p) {
  const m = containerPercentToMapPercent(p.left, p.top, W, H);
  return { left: roundMapCoord(m.left), top: roundMapCoord(m.top) };
}

data.hauptmarker = data.hauptmarker.map((m) => ({ ...m, ...convert(m) }));
data.punkte = data.punkte.map((p) => convert(p));
if (data.ortsLabels?.length) {
  data.ortsLabels = data.ortsLabels.map((o) => ({ ...o, ...convert(o) }));
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Migrated ${data.punkte.length} Punkte, ${data.hauptmarker.length} Marker`);
