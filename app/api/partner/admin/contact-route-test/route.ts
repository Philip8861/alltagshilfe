import { NextResponse } from "next/server";
import { sendAllContactRouteTestEmails } from "@/lib/email/contact-route-test";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";

export const runtime = "nodejs";

async function isAuthorized(request: Request): Promise<boolean> {
  if (await getSystemAdminSession()) return true;
  const secret = process.env.PARTNER_SYSTEM_ADMIN_SECRET?.trim();
  if (!secret || secret.length < 24) return false;
  const auth = request.headers.get("authorization")?.trim();
  return auth === `Bearer ${secret}`;
}

/** POST: Test-E-Mails für alle Kontakt-Routen (Admin, keine Statistik). */
export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ ok: false, error: "Nicht autorisiert." }, { status: 401 });
  }

  const results = await sendAllContactRouteTestEmails();
  const failed = results.filter((r) => !r.ok);

  return NextResponse.json({
    ok: failed.length === 0,
    sent: results.filter((r) => r.ok).length,
    failed: failed.length,
    results,
  });
}
