import { NextResponse } from "next/server";

type TranslateRequest = {
  texts?: string[];
  source?: string;
  target?: string;
};

function parseTranslatedText(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return "";
  const segments = data[0] as unknown[];
  return segments
    .map((segment) => (Array.isArray(segment) ? String(segment[0] ?? "") : ""))
    .join("")
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TranslateRequest;
    const texts = Array.isArray(body.texts) ? body.texts.filter((t) => typeof t === "string" && t.trim().length > 0) : [];
    if (texts.length === 0) {
      return NextResponse.json({ translations: [] });
    }

    const source = (body.source ?? "de").toLowerCase();
    const target = (body.target ?? "en").toLowerCase();

    const translations: string[] = [];
    for (const text of texts) {
      const params = new URLSearchParams({
        client: "gtx",
        sl: source,
        tl: target,
        dt: "t",
        q: text,
      });
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        translations.push(text);
        continue;
      }
      const raw = (await res.json()) as unknown;
      const translated = parseTranslatedText(raw);
      translations.push(translated || text);
    }

    return NextResponse.json({ translations });
  } catch {
    return NextResponse.json({ translations: [] }, { status: 200 });
  }
}

