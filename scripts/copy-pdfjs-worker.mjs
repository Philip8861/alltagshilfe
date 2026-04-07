/**
 * Kopiert den pdf.js-Worker nach public/ (CSP: same-origin, kein CDN).
 * Läuft per npm postinstall.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const dest = path.join(root, "public", "pdfjs", "pdf.worker.min.mjs");

try {
  if (!fs.existsSync(src)) {
    console.warn("[copy-pdfjs-worker] Quelle fehlt, übersprungen:", src);
    process.exit(0);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("[copy-pdfjs-worker] → public/pdfjs/pdf.worker.min.mjs");
} catch (e) {
  console.warn("[copy-pdfjs-worker]", e);
  process.exit(0);
}
