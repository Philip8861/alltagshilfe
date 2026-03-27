"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY_SITE_LANG = "ahs_site_lang";

type MarkedTextNode = Text & {
  __ahsOriginalText?: string;
};

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitWhitespace(value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return { leading, trailing };
}

function isEligibleText(node: Text) {
  const text = normalize(node.textContent ?? "");
  if (!text || text.length < 2) return false;
  if (/^[0-9.,:%\-+()/\s]+$/.test(text)) return false;
  const parent = node.parentElement;
  if (!parent) return false;
  if (parent.closest("[data-no-local-translate], .notranslate")) return false;
  const tag = parent.tagName;
  return !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE", "SVG"].includes(tag);
}

async function requestTranslations(texts: string[]) {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, source: "de", target: "en" }),
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { translations?: string[] };
  return Array.isArray(data.translations) ? data.translations : [];
}

export function LocalSiteTranslator() {
  const pathname = usePathname();
  const cacheRef = useRef<Map<string, string>>(new Map());
  const runningRef = useRef(false);

  useEffect(() => {
    const root = document.getElementById("app-shell");
    if (!root) return;

    const getLang = (): "de" | "en" => {
      try {
        return localStorage.getItem(STORAGE_KEY_SITE_LANG) === "en" ? "en" : "de";
      } catch {
        return "de";
      }
    };

    const restoreGerman = () => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while (current) {
        const node = current as MarkedTextNode;
        if (typeof node.__ahsOriginalText === "string") {
          node.textContent = node.__ahsOriginalText;
          delete node.__ahsOriginalText;
        }
        current = walker.nextNode();
      }
    };

    const applyEnglish = async () => {
      if (runningRef.current) return;
      runningRef.current = true;
      try {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes: MarkedTextNode[] = [];
        const needed = new Set<string>();
        let current = walker.nextNode();
        while (current) {
          const node = current as MarkedTextNode;
          if (isEligibleText(node)) {
            const currentText = node.textContent ?? "";
            const original = typeof node.__ahsOriginalText === "string" ? node.__ahsOriginalText : currentText;
            const key = normalize(original);
            if (key) {
              nodes.push(node);
              if (!cacheRef.current.has(key)) needed.add(key);
            }
          }
          current = walker.nextNode();
        }

        const unknownTexts = Array.from(needed);
        const chunkSize = 20;
        for (let i = 0; i < unknownTexts.length; i += chunkSize) {
          const chunk = unknownTexts.slice(i, i + chunkSize);
          const translated = await requestTranslations(chunk);
          chunk.forEach((sourceText, idx) => {
            const targetText = translated[idx] || sourceText;
            cacheRef.current.set(sourceText, targetText);
          });
        }

        for (const node of nodes) {
          const currentText = node.textContent ?? "";
          const original = typeof node.__ahsOriginalText === "string" ? node.__ahsOriginalText : currentText;
          const key = normalize(original);
          const translated = cacheRef.current.get(key);
          if (!translated || translated === key) continue;
          if (typeof node.__ahsOriginalText !== "string") {
            node.__ahsOriginalText = currentText;
          }
          const { leading, trailing } = splitWhitespace(original);
          node.textContent = `${leading}${translated}${trailing}`;
        }
      } finally {
        runningRef.current = false;
      }
    };

    const run = () => {
      if (getLang() === "en") {
        void applyEnglish();
      } else {
        restoreGerman();
      }
    };

    run();

    let debounceTimer: number | undefined;
    const observer = new MutationObserver(() => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(run, 120);
    });
    observer.observe(root, { childList: true, subtree: true });

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_SITE_LANG) run();
    };
    const onApplyLanguage = () => run();
    window.addEventListener("storage", onStorage);
    window.addEventListener("ahs-apply-language", onApplyLanguage);

    return () => {
      observer.disconnect();
      if (debounceTimer) window.clearTimeout(debounceTimer);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ahs-apply-language", onApplyLanguage);
    };
  }, [pathname]);

  return null;
}

