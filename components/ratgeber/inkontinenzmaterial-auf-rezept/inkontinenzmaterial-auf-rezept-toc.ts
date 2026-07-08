import type { RatgeberArticleTocEntry } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";

export const INKONTINENZMATERIAL_AUF_REZEPT_TOC: readonly RatgeberArticleTocEntry[] = [
  { id: "blick", label: "Das Wichtigste in Kürze" },
  { id: "bedeutung", label: "Was bedeutet „Inkontinenzmaterial auf Rezept“?" },
  { id: "anspruch", label: "Wer hat Anspruch?" },
  { id: "pflegegrad", label: "Braucht man einen Pflegegrad?" },
  { id: "produkte", label: "Welche Produkte bezahlt die Krankenkasse?" },
  { id: "kosten", label: "Was kostet Inkontinenzmaterial 2026?" },
  { id: "aufzahlung", label: "Muss man eine Aufzahlung akzeptieren?" },
  { id: "ablauf", label: "Wie läuft der Antrag ab?" },
  { id: "rezept", label: "Was muss auf dem Rezept stehen?" },
  { id: "menge", label: "Wie viel Material steht mir zu?" },
  { id: "nicht-passen", label: "Was tun, wenn Produkte nicht passen?" },
  { id: "ablehnung", label: "Was tun bei Ablehnung?" },
  { id: "fehler", label: "Häufige Fehler" },
  { id: "beispiel", label: "Beispiel aus der Praxis" },
  { id: "checkliste", label: "Checkliste für Angehörige" },
  { id: "faq-inkontinenz", label: "FAQ" },
  { id: "fazit", label: "Fazit" },
  { id: "quellen", label: "Quellen" },
] as const;
