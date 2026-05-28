import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const punktSchema = z.object({
  left: z.number().min(0).max(100),
  top: z.number().min(0).max(100),
});

const hauptmarkerSchema = punktSchema.extend({
  label: z.string().min(1).max(80),
  sublabel: z.string().max(80).optional(),
  href: z.string().max(200).optional(),
  labelAbove: z.boolean().optional(),
});

const ortsLabelSchema = punktSchema.extend({
  label: z.string().min(1).max(80),
  withX: z.boolean().optional(),
});

const payloadSchema = z.object({
  hauptmarker: z.array(hauptmarkerSchema).min(1).max(20),
  punkte: z.array(punktSchema).max(500),
  ortsLabels: z.array(ortsLabelSchema).max(50).optional(),
});

const CONFIG_PATH = path.join(process.cwd(), "config", "standort-karte.json");

function devOnly() {
  return process.env.NODE_ENV === "development";
}

export async function GET() {
  if (!devOnly()) {
    return NextResponse.json({ error: "Nur in der Entwicklung verfügbar." }, { status: 403 });
  }
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Konfiguration nicht lesbar." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!devOnly()) {
    return NextResponse.json({ error: "Nur in der Entwicklung verfügbar." }, { status: 403 });
  }
  try {
    const parsed = payloadSchema.parse(await request.json());
    const output: z.infer<typeof payloadSchema> = {
      hauptmarker: parsed.hauptmarker.map((m) => ({
        ...m,
        left: Math.round(m.left * 10) / 10,
        top: Math.round(m.top * 10) / 10,
      })),
      punkte: parsed.punkte.map((p) => ({
        left: Math.round(p.left * 10) / 10,
        top: Math.round(p.top * 10) / 10,
      })),
      ortsLabels: parsed.ortsLabels ?? [],
    };
    await fs.writeFile(CONFIG_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
    return NextResponse.json({ ok: true, saved: output });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Ungültige Daten.", details: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
