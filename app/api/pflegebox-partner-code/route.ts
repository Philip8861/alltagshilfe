import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimitPflegeboxPartnerLookup } from "@/lib/rate-limit";
import { createSupabaseServiceRoleClient, resolvePartnerProfileId } from "@/lib/supabase/service";

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
    return h.get("x-real-ip")?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * GET ?code=PARTNERCODE — prüft, ob ein Partner-Profil zu diesem Code existiert (Konfigurator).
 */
export async function GET(request: Request) {
  const ip = await clientIp();
  if (!rateLimitPflegeboxPartnerLookup(ip).success) {
    return NextResponse.json({ valid: false, error: "rate_limited" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim() ?? "";
  if (!code) {
    return NextResponse.json({ valid: false });
  }
  if (code.length > 80) {
    return NextResponse.json({ valid: false });
  }

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json({ valid: false, error: "not_configured" }, { status: 503 });
  }

  const id = await resolvePartnerProfileId(service, code);
  return NextResponse.json({ valid: Boolean(id) });
}
