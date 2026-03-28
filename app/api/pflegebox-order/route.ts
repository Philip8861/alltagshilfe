import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimitPflegeboxOrder } from "@/lib/rate-limit";
import { pflegeboxOrderBodySchema } from "@/lib/validations/pflegebox-order";
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

export async function POST(request: Request) {
  const ip = await clientIp();
  if (!rateLimitPflegeboxOrder(ip).success) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = pflegeboxOrderBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const partnerId = await resolvePartnerProfileId(service, parsed.data.partnerRef);

  const externalRef = `PB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  const summary_json = {
    version: 1,
    cartLines: parsed.data.cartLines,
    totalBudgetUsed: parsed.data.totalBudgetUsed,
    partnerRefRaw: (parsed.data.partnerRef ?? "").trim() || null,
    contact: {
      firstName: parsed.data.contact.firstName,
      lastName: parsed.data.contact.lastName,
      email: parsed.data.contact.email,
      phone: parsed.data.contact.phone?.trim() || null,
      plz: parsed.data.contact.plz?.trim() || null,
    },
    submittedAt: new Date().toISOString(),
  };

  const { data, error } = await service
    .from("pflegebox_orders")
    .insert({
      partner_id: partnerId,
      external_reference: externalRef,
      status: "completed",
      summary_json,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id, reference: externalRef });
}
