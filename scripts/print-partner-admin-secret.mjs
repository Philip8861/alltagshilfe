/**
 * Gibt einen zufälligen Wert für PARTNER_SYSTEM_ADMIN_SECRET aus (min. 24 Zeichen).
 * Aufruf: npm run partner:admin-secret
 */
import { randomBytes } from "crypto";

const hex = randomBytes(32).toString("hex");
console.log("Kopieren nach .env.local / Vercel als PARTNER_SYSTEM_ADMIN_SECRET=\n");
console.log(hex);
console.log("\n(Länge:", hex.length, "Zeichen)");
