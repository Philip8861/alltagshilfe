import { readFile } from "node:fs/promises";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FORM_V1_PREVIEW_SAMPLE, fillFormV1Pdf } from "@/lib/pdf/fill-form-v1";
import { resolveFormV1TemplatePath } from "@/lib/pdf/resolve-form-v1-template";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";

export async function GET(request: NextRequest) {
  const ok = await getSystemAdminSession();
  if (!ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/partner/admin-login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const templatePath = resolveFormV1TemplatePath();
  let templateBytes: Uint8Array;
  try {
    templateBytes = await readFile(templatePath);
  } catch {
    return new NextResponse(
      "Vorlage-PDF fehlt. Lege die Blanko-Datei als private/forms/form-v1-blank.pdf ab " +
        "oder setze FORM_V1_PDF_TEMPLATE_PATH auf einen gültigen Pfad.",
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  try {
    const filled = await fillFormV1Pdf(templateBytes, FORM_V1_PREVIEW_SAMPLE);
    return new NextResponse(Buffer.from(filled), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="formular-vorschau-max-mustermann.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "PDF konnte nicht erzeugt werden.";
    return new NextResponse(msg, { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
