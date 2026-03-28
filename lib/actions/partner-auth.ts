"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimitPartnerLogin } from "@/lib/rate-limit";
import { partnerLoginSchema } from "@/lib/validations/partner";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PartnerLoginState = { ok: false; message: string } | { ok: true };

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() ?? "unknown";
    }
    return h.get("x-real-ip")?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

export async function partnerLoginAction(_prev: PartnerLoginState | null, formData: FormData): Promise<PartnerLoginState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Der Partnerbereich ist hier noch nicht eingerichtet." };
  }

  const ip = await clientIp();
  const limited = rateLimitPartnerLogin(ip);
  if (!limited.success) {
    return { ok: false, message: "Zu viele Versuche. Bitte später erneut versuchen." };
  }

  const parsed = partnerLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = first.email?.[0] ?? first.password?.[0] ?? "Bitte Eingaben prüfen.";
    return { ok: false, message: msg };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { ok: false, message: "Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen." };
    }
  } catch {
    return { ok: false, message: "Anmeldung fehlgeschlagen. Bitte später erneut versuchen." };
  }

  redirect("/partner/dashboard");
}

export async function partnerLogoutAction(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect("/partner/login");
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/partner/login");
}
