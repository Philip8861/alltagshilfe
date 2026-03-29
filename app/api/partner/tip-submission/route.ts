import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { insertPartnerTipSubmission } from "@/lib/partner/insert-partner-tip-submission";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { partnerTipSubmissionSchema } from "@/lib/validations/partner-tips";

/**
 * Tipp absenden über Route Handler: nutzt dieselben Cookies wie der Browser-Request
 * (zuverlässiger als manche Server-Action-Läufe mit Supabase-Session).
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, message: "Supabase ist nicht konfiguriert." }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = partnerTipSubmissionSchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, message: issue?.message || "Bitte alle Pflichtfelder ausfüllen." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ ok: false, message: "Nicht angemeldet." }, { status: 401 });
    }

    const { data: profile, error: profErr } = await supabase
      .from("partner_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (profErr || !profile?.id) {
      return NextResponse.json({ ok: false, message: "Kein Partnerprofil." }, { status: 403 });
    }

    const result = await insertPartnerTipSubmission(profile.id, parsed.data);
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 500 });
    }

    revalidatePath("/partner/dashboard");
    revalidatePath("/partner/statistik");
    revalidatePath("/partner/admin");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Unerwarteter Fehler." }, { status: 500 });
  }
}
