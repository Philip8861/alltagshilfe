"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY_SITE_LANG = "ahs_site_lang";

const DE_TO_EN: Record<string, string> = {
  "Alltagshilfe-Süd": "Alltagshilfe-South",
  "Mehr Unterstützung.": "More support.",
  "Mehr Entlastung.": "More relief.",
  "Mehr Zeit fürs Wesentliche.": "More time for what matters.",
  "Ihr verlässlicher Partner für Haushaltshilfe, Betreuung, Pflegeberatung und Pflegehilfsmittel.":
    "Your trusted partner for household help, companionship, care counseling, and care aids.",
  "Unsere Leistungen im Überblick": "Our Services at a Glance",
  "Persönlich, zuverlässig und mit viel Herz im Alltag.": "Personal, reliable, and caring support in everyday life.",
  "Haushaltshilfe & Alltagsbegleitung": "Household Help & Everyday Support",
  "Pflegeberatung nach §37.3 SGB XI": "Care Counseling under §37.3 SGB XI",
  "Kostenfreie Pflegehilfsmittel": "Free Care Aids",
  Inkontinenzversorgung: "Incontinence Care",
  Pflegeshop: "Care Shop",
  "Betriebliche Pflegeberatung": "Workplace Care Counseling",
  "Essen auf Räder (im Raum Kempten)": "Meals on Wheels (Kempten area)",
  "Mit viel Herz und Engagement sind wir für Sie da.": "We are here for you with care and dedication.",
  "Was uns besonders wichtig ist: Wir möchten dazu beitragen, dass Sie Ihren Alltag so lange wie möglich selbstbestimmt gestalten und in Ihrem vertrauten Zuhause bleiben können. Unsere Unterstützung orientiert sich dabei an Ihren individuellen Bedürfnissen und Ihrer persönlichen Lebenssituation.":
    "What matters most to us: we want to help you live independently for as long as possible and stay in your familiar home. Our support is tailored to your personal needs and life situation.",
  "Ihre Vorteile bei uns": "Your Benefits with Us",
  "Verlässlich, transparent und nah bei Ihnen - mit klaren Prozessen und echter Unterstützung im Alltag.":
    "Reliable, transparent, and close to you - with clear processes and real support in everyday life.",
  "Zugelassen bei allen Pflege- und Krankenkassen in Deutschland":
    "Approved by all care and health insurance providers in Germany",
  "Schnelle Terminvergabe bei all unseren Dienstleistungen": "Quick appointment scheduling for all our services",
  "Volle Transparenz dank App: Rechnungen und kommende Termine jederzeit einsehbar":
    "Full transparency via app: invoices and upcoming appointments available anytime",
  "Ab Pflegegrad 1: Nutzen Sie Ihren Entlastungsbetrag von 131 Euro für unsere Leistungen":
    "From care level 1: use your relief amount of 131 euros for our services",
  "Neu ab Pflegegrad 2: Bis zu 3.539 Euro Ersatzpflege / Verhinderungspflege über uns abrechenbar":
    "New from care level 2: up to 3,539 euros substitute/respite care billable through us",
  "Umfangreiche Dienstleistungen rund um Betreuung, Entlastung, Alltagshilfe und Pflegeberatung aus einer Hand.":
    "Comprehensive services for care, relief, daily support, and counseling from one source.",
  "Auch wenn wir eine Leistung nicht direkt anbieten: Unser starkes Netzwerk hilft weiter":
    "Even if we do not offer a service directly: our strong partner network helps further.",
  "Wir sind nicht nur in Städten, sondern auch in ländlichen Regionen und Dörfern für Sie unterwegs":
    "We are available not only in cities, but also in rural regions and villages.",
  "Welche Unterstützung benötigen Sie aktuell?": "What kind of support do you currently need?",
  "Finden Sie in nur 60 Sekunden die passende Hilfe.": "Find the right support in just 60 seconds.",
  "Passende Hilfe finden": "Find the Right Support",
  "Sie müssen nicht alles schon wissen - wir führen Sie Schritt für Schritt.":
    "You do not need to know everything yet - we guide you step by step.",
  "Google-Rezensionen · 5,0 Sterne": "Google Reviews · 5.0 Stars",
  "Das sagen unsere Kunden*innen": "What Our Clients Say",
  "Bewertung auswählen": "Select Review",
};

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

function applyTranslation(root: HTMLElement, lang: "de" | "en") {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const node = current as MarkedTextNode;
    const parentTag = node.parentElement?.tagName ?? "";
    if (!["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parentTag)) {
      if (lang === "de") {
        if (typeof node.__ahsOriginalText === "string") {
          node.textContent = node.__ahsOriginalText;
          delete node.__ahsOriginalText;
        }
      } else {
        const currentText = node.textContent ?? "";
        const normalized = normalize(currentText);
        const translated = DE_TO_EN[normalized];
        if (translated) {
          if (typeof node.__ahsOriginalText !== "string") {
            node.__ahsOriginalText = currentText;
          }
          const { leading, trailing } = splitWhitespace(currentText);
          node.textContent = `${leading}${translated}${trailing}`;
        }
      }
    }
    current = walker.nextNode();
  }
}

export function LocalHomepageTranslator() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const target = document.getElementById("main-content");
    if (!target) return;

    const getLang = (): "de" | "en" => {
      try {
        return localStorage.getItem(STORAGE_KEY_SITE_LANG) === "en" ? "en" : "de";
      } catch {
        return "de";
      }
    };

    const run = () => {
      applyTranslation(target, getLang());
    };

    run();
    const obs = new MutationObserver(() => run());
    obs.observe(target, { childList: true, subtree: true });

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_SITE_LANG) run();
    };
    const onApplyLanguage = () => run();

    window.addEventListener("storage", onStorage);
    window.addEventListener("ahs-apply-language", onApplyLanguage);

    return () => {
      obs.disconnect();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ahs-apply-language", onApplyLanguage);
    };
  }, [pathname]);

  return null;
}

