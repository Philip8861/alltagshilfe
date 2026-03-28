import { NextResponse } from "next/server";
import { getPartnerSession } from "@/lib/partner/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * Leichte Session-Abfrage für die Startseite (Client-Fetch).
 * Die Startseite selbst bleibt ohne cookies()/getPartnerSession im RSC-Tree — weniger 500er auf Edge/Vercel.
 * Nur booleans + Anzeigenamen, kein userId im JSON.
 */
export async function GET() {
  try {
    const configured = isSupabaseConfigured();
    if (!configured) {
      return NextResponse.json(
        {
          configured: false,
          authenticated: false,
          hasProfile: false,
          displayName: null,
          email: null,
        },
        { headers: { "Cache-Control": "private, no-store, max-age=0" } },
      );
    }

    const session = await getPartnerSession();
    const authenticated = Boolean(session?.userId);
    const hasProfile = Boolean(session?.profile?.id);
    const displayName =
      session?.profile?.display_name ??
      session?.profile?.organization_name ??
      session?.email ??
      null;

    return NextResponse.json(
      {
        configured: true,
        authenticated,
        hasProfile,
        displayName,
        email: session?.email ?? null,
      },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  } catch {
    return NextResponse.json(
      {
        configured: isSupabaseConfigured(),
        authenticated: false,
        hasProfile: false,
        displayName: null,
        email: null,
      },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  }
}
