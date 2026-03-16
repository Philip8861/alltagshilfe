"use server";

import { redirect } from "next/navigation";
import { karriereSchema, type KarriereFormData } from "@/lib/validations/karriere";
import { rateLimit } from "@/lib/rate-limit";

export type KarriereResult = { success: boolean; error?: string };

export async function submitKarriere(formData: FormData): Promise<KarriereResult> {
  const raw: Record<string, unknown> = {
    vorname: formData.get("vorname") ?? "",
    nachname: formData.get("nachname") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    stellenangebot: formData.get("stellenangebot") ?? "",
    agbs: formData.get("agbs") === "on",
    website: formData.get("website") ?? "",
  };

  const parsed = karriereSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.vorname?.[0] ??
      first.nachname?.[0] ??
      first.email?.[0] ??
      first.phone?.[0] ??
      first.stellenangebot?.[0] ??
      first.agbs?.[0] ??
      "Bitte prüfen Sie Ihre Eingaben.";
    return { success: false, error: message };
  }

  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    return { success: true };
  }

  const id = "karriere";
  const { success: allowed } = rateLimit(id);
  if (!allowed) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const data = parsed.data as KarriereFormData;
  console.info("[Karriere] Bewerbung erhalten", {
    vorname: data.vorname,
    nachname: data.nachname,
    email: data.email,
    stellenangebot: data.stellenangebot,
  });

  redirect("/karriere/danke");
}
