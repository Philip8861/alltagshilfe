import { randomInt } from "crypto";

/**
 * Exakt 8 Zeichen: mind. ein Großbuchstabe, Kleinbuchstabe, Ziffer, Sonderzeichen.
 * Kryptografisch sicher für initiale Zugangsdaten (Server only).
 */
export function generatePartnerInitialPassword(): string {
  const LOWER = "abcdefghijkmnopqrstuvwxyz";
  const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const DIGITS = "23456789";
  const SPECIAL = "!@#$%&*?";
  const all = LOWER + UPPER + DIGITS + SPECIAL;

  const required = [
    UPPER[randomInt(UPPER.length)],
    LOWER[randomInt(LOWER.length)],
    DIGITS[randomInt(DIGITS.length)],
    SPECIAL[randomInt(SPECIAL.length)],
  ];
  const rest: string[] = [];
  for (let i = 0; i < 4; i++) {
    rest.push(all[randomInt(all.length)]);
  }
  const chars = [...required, ...rest];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = chars[i]!;
    chars[i] = chars[j]!;
    chars[j] = tmp;
  }
  return chars.join("");
}
