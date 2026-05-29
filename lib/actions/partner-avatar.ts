"use server";

import { revalidatePath } from "next/cache";
import {
  PARTNER_AVATAR_BUCKET,
  PARTNER_AVATAR_MAX_BYTES,
  detectPartnerAvatarMime,
  partnerAvatarExtForMime,
  partnerAvatarPublicUrl,
  partnerAvatarStoragePath,
} from "@/lib/partner/partner-avatar-shared";
import {
  isPartnerAccountDisabled,
  PARTNER_ACCOUNT_DISABLED_MESSAGE,
  requirePartnerLogin,
} from "@/lib/partner/auth";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type PartnerAvatarActionResult =
  | { ok: true; avatarUrl: string | null }
  | { ok: false; message: string };

function revalidateAvatarPaths() {
  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/team");
  revalidatePath("/partner/einstellungen/profilbild");
}

export async function uploadPartnerAvatarAction(formData: FormData): Promise<PartnerAvatarActionResult> {
  const { userId, profile } = await requirePartnerLogin();
  if (isPartnerAccountDisabled(profile)) {
    return { ok: false, message: PARTNER_ACCOUNT_DISABLED_MESSAGE };
  }

  const file = formData.get("avatar");
  if (!(file instanceof File)) {
    return { ok: false, message: "Bitte wählen Sie ein Bild aus." };
  }

  if (file.size > PARTNER_AVATAR_MAX_BYTES) {
    return { ok: false, message: "Das Bild darf maximal 500 KB groß sein." };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const mime = detectPartnerAvatarMime(buffer);
  if (!mime) {
    return { ok: false, message: "Nur JPG-, JPEG- oder PNG-Dateien sind erlaubt." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "Speicher ist derzeit nicht verfügbar. Bitte später erneut versuchen." };
  }

  const ext = partnerAvatarExtForMime(mime);
  const storagePath = partnerAvatarStoragePath(userId, ext);

  const { error: uploadErr } = await svc.storage.from(PARTNER_AVATAR_BUCKET).upload(storagePath, buffer, {
    upsert: true,
    contentType: mime,
    cacheControl: "3600",
  });

  if (uploadErr) {
    console.error("[uploadPartnerAvatarAction] storage:", uploadErr.message);
    return { ok: false, message: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  const { error: updateErr } = await svc
    .from("partner_profiles")
    .update({ avatar_path: storagePath, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateErr) {
    console.error("[uploadPartnerAvatarAction] profile update:", updateErr.message);
    await svc.storage.from(PARTNER_AVATAR_BUCKET).remove([storagePath]);
    return { ok: false, message: "Profil konnte nicht aktualisiert werden." };
  }

  revalidateAvatarPaths();
  const cacheKey = new Date().toISOString();
  return { ok: true, avatarUrl: partnerAvatarPublicUrl(storagePath, cacheKey) };
}

export async function removePartnerAvatarAction(): Promise<PartnerAvatarActionResult> {
  const { userId, profile } = await requirePartnerLogin();
  if (isPartnerAccountDisabled(profile)) {
    return { ok: false, message: PARTNER_ACCOUNT_DISABLED_MESSAGE };
  }

  const currentPath = profile.avatar_path?.trim();
  if (!currentPath) {
    return { ok: true, avatarUrl: null };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "Speicher ist derzeit nicht verfügbar. Bitte später erneut versuchen." };
  }

  const { error: updateErr } = await svc
    .from("partner_profiles")
    .update({ avatar_path: null, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateErr) {
    console.error("[removePartnerAvatarAction] profile update:", updateErr.message);
    return { ok: false, message: "Profilbild konnte nicht entfernt werden." };
  }

  const { error: removeErr } = await svc.storage.from(PARTNER_AVATAR_BUCKET).remove([currentPath]);
  if (removeErr) {
    console.warn("[removePartnerAvatarAction] storage remove:", removeErr.message);
  }

  revalidateAvatarPaths();
  return { ok: true, avatarUrl: null };
}
