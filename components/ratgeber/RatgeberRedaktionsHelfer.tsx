"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type PartnerSessionPayload = {
  configured: boolean;
  authenticated: boolean;
  hasProfile: boolean;
  role: "partner" | "admin" | null;
};

function buildChangeRequestBlock(params: {
  pathname: string;
  origin: string;
  selection: string;
  desiredText: string;
  en: boolean;
}): string {
  const { pathname, origin, selection, desiredText, en } = params;
  const title = en ? "RATGEBER CHANGE REQUEST" : "RATGEBER-TEXTÄNDERUNG";
  const selLabel = en ? "SELECTED ORIGINAL" : "MARKIERTER ORIGINALTEXT";
  const wantLabel = en ? "DESIRED TEXT / INSTRUCTION" : "GEWÜNSCHTER TEXT ODER ANWEISUNG";
  const hint = en
    ? "Paste this block into Cursor (or your editor). The AI can locate the passage via URL + quoted text."
    : "Diesen Block in Cursor (oder den Chat) einfügen: KI findet die Stelle über URL + zitierten Originaltext.";

  return [
    `=== ${title} ===`,
    `${en ? "Page" : "Seite"}: ${origin}${pathname}`,
    `${en ? "Time" : "Zeit"}: ${new Date().toISOString()}`,
    "",
    `${selLabel}:`,
    "---",
    selection.trim() || (en ? "(none — mark text on the page first)" : "(keine Auswahl — bitte Text auf der Seite markieren)"),
    "---",
    "",
    `${wantLabel}:`,
    desiredText.trim() || (en ? "(add here)" : "(hier ergänzen)"),
    "",
    hint,
  ].join("\n");
}

export function RatgeberRedaktionsHelfer() {
  const pathname = usePathname() ?? "/";
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const [session, setSession] = useState<PartnerSessionPayload | null>(null);
  const [open, setOpen] = useState(false);
  const [desired, setDesired] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/partner/session", { credentials: "same-origin", cache: "no-store" });
        const json = (await res.json()) as Partial<PartnerSessionPayload>;
        if (cancelled) return;
        setSession({
          configured: Boolean(json.configured),
          authenticated: Boolean(json.authenticated),
          hasProfile: Boolean(json.hasProfile),
          role: json.role === "admin" || json.role === "partner" ? json.role : null,
        });
      } catch {
        if (!cancelled) setSession({ configured: false, authenticated: false, hasProfile: false, role: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin = session?.authenticated && session.hasProfile && session.role === "admin";

  const copySelection = useCallback(async () => {
    const sel = typeof window !== "undefined" ? window.getSelection()?.toString() ?? "" : "";
    const text = buildChangeRequestBlock({
      pathname,
      origin: window.location.origin,
      selection: sel,
      desiredText: desired,
      en,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }, [pathname, desired, en]);

  const copyPageOnly = useCallback(async () => {
    const text = buildChangeRequestBlock({
      pathname,
      origin: typeof window !== "undefined" ? window.location.origin : "",
      selection: "",
      desiredText: desired,
      en,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }, [pathname, desired, en]);

  if (!isAdmin) return null;

  return (
    <div
      className="pointer-events-auto fixed bottom-4 left-4 z-[2147483000] max-w-[min(calc(100vw-2rem),22rem)] text-left"
      lang={en ? "en" : "de"}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-[#0F4F68]/25 bg-white/95 px-4 py-2 text-xs font-bold text-[#0F4F68] shadow-lg backdrop-blur-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
        >
          {en ? "Editor" : "Redaktion"}
        </button>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#0F4F68]/20 bg-white/98 p-4 text-sm text-neutral-800 shadow-[0_12px_40px_rgba(15,79,104,0.2)] backdrop-blur-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-[#0F4F68]">{en ? "Ratgeber change helper" : "Ratgeber-Redaktion"}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]"
              aria-label={en ? "Close" : "Schließen"}
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-600">
            {en
              ? "Select text in the article, optionally describe the change below, then copy the block for Cursor/AI."
              : "Text im Artikel markieren, unten optional die gewünschte Fassung notieren, dann den Block kopieren und in Cursor einfügen."}
          </p>
          <label htmlFor="ratgeber-redaktion-wunsch" className="mt-3 block text-xs font-semibold text-neutral-700">
            {en ? "Desired wording (optional)" : "Gewünschter Text (optional)"}
          </label>
          <textarea
            id="ratgeber-redaktion-wunsch"
            value={desired}
            onChange={(e) => setDesired(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-y rounded-lg border border-neutral-200 px-2 py-1.5 text-xs text-neutral-900 focus:border-[#0F4F68]/40 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20"
          />
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void copySelection()}
              className="rounded-lg bg-[#0F4F68] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              {en ? "Copy page + selection" : "Seite + Markierung kopieren"}
            </button>
            <button
              type="button"
              onClick={() => void copyPageOnly()}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F4F68] transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              {en ? "Copy page context only" : "Nur Seitenkontext kopieren"}
            </button>
          </div>
          {copied ? (
            <p className="mt-2 text-xs font-semibold text-emerald-700" role="status">
              {en ? "Copied." : "In die Zwischenablage kopiert."}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
