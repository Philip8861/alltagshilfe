/** Client- und server-taugliche Konstanten/Validierung für Partner-Profilbilder. */

export const PARTNER_AVATAR_BUCKET = "partner-avatars";
export const PARTNER_AVATAR_MAX_BYTES = 512_000;
export const PARTNER_AVATAR_ACCEPT = "image/jpeg,image/png,.jpg,.jpeg,.png";
export const PARTNER_AVATAR_OUTPUT_SIZE = 512;

export type PartnerAvatarMime = "image/jpeg" | "image/png";

export function partnerAvatarStoragePath(userId: string, ext: "jpg" | "png"): string {
  return `${userId}/avatar.${ext}`;
}

export function partnerAvatarPublicUrl(
  avatarPath: string | null | undefined,
  cacheKey?: string | null,
): string | null {
  const path = avatarPath?.trim();
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  const url = `${base}/storage/v1/object/public/${PARTNER_AVATAR_BUCKET}/${path}`;
  const key = cacheKey?.trim();
  if (!key) return url;
  return `${url}?v=${encodeURIComponent(key)}`;
}

export function detectPartnerAvatarMime(bytes: Uint8Array): PartnerAvatarMime | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  return null;
}

export function partnerAvatarExtForMime(mime: PartnerAvatarMime): "jpg" | "png" {
  return mime === "image/png" ? "png" : "jpg";
}

export function isAllowedPartnerAvatarClientType(type: string): boolean {
  const t = type.toLowerCase();
  return t === "image/jpeg" || t === "image/png";
}
