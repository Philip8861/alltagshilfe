# Unternehmens-Homepage – Projekt-Regeln und Architektur

Diese Datei ist die verbindliche Referenz für Architektur, Tech-Stack, Seitenstruktur und Umsetzungsregeln. Bei jeder Arbeit am Projekt sind diese Regeln zu beachten.

---

## 0. Oberste Prioritäten und Arbeitsweise

- **Eigenständiges Ausführen:** Der Agent darf alles selbst ausführen, was er für richtig hält. Keine Rückfrage bei jeder Kleinigkeit – sinnvolle technische und gestalterische Entscheidungen eigenständig treffen und umsetzen. Nur bei echten Zielkonflikten oder fehlenden Vorgaben nachfragen.

- **Sicherheit hat oberste Priorität:** Hacking-Sicherheit und Datenschutz (DSGVO) stehen über allen anderen Anforderungen. Jede Änderung muss sicherheitskonform sein: sichere Formularverarbeitung, keine sensiblen Daten im Frontend, Security-Headers, CSP, Rate-Limiting, Validierung serverseitig, saubere Fehlerbehandlung ohne Information Leakage. Bei Unsicherheit: die sichere Variante wählen.

- **Google SEO immer mitdenken:** Die Seite soll so gebaut werden, dass Google sie mag – schnell, sicher und suchmaschinenfreundlich. Bei jeder neuen Seite und jedem neuen Feature: Metadata, semantisches HTML, saubere URLs, strukturierte Daten (JSON-LD), Core Web Vitals (LCP, INP, CLS), indexierbare Inhalte und interne Verlinkung berücksichtigen.

- **Mobile extrem wichtig:** Immer an die Mobile-Version denken – Mobile First. Jedes Layout, jede Komponente und jede Interaktion muss auf Smartphones und Tablets gut funktionieren und lesbar sein. Touch-Ziele groß genug, keine horizontalen Scrolls, Performance auf mobilen Netzen beachten. Vor dem Abschluss: auf echten Geräten oder Viewports prüfen.

- **Später: Google Analytics & Cookie-Banner:** Die Architektur muss vorbereitet sein: Google Analytics und Cookie-Banner werden später eingebaut. Kein Tracking ohne Consent; Consent-Banner-Komponente und Platzhalter für Script-Loading (z. B. consent-gated) von Anfang an einkalkulieren. Keine Analytics-Skripte im MVP ohne Consent-Logik.

- **Bilder/Grafiken – Größe:** Wenn Bilder oder Grafiken zu groß sind (z. B. Dateigröße oder Pixelmaße für Web ungeeignet), den Nutzer darauf hinweisen und ggf. Optimierung oder kleinere Varianten vorschlagen.

- **Hosting-Portabilität / Server-Umzug:** Die Seite wird anfangs entwickelt und kann später auf einen anderen Server bzw. eine andere Hosting-Plattform umziehen. Daher: keine fest verdrahteten absoluten URLs auf die aktuelle Domain; Basis-URL (z. B. für Canonical, OG, Sitemap) über Umgebungsvariable (z. B. `NEXT_PUBLIC_SITE_URL` oder `VERCEL_URL`). Keine plattformspezifischen Annahmen im Code (Standard-Next.js-Build); Deployment soll auf beliebigem Node-Hosting oder Vercel/Netlify/etc. möglich sein. „Erst programmieren, dann umziehen“ – ohne Code-Änderung.

---

## 1. Empfohlene Architektur

- **Next.js 15** mit App Router: maximale Nutzung von Server Components, Streaming, React Server Components.
- **Hybrid-Rendering**: Startseite, Landingpages, rechtliche Seiten und Blog-Listen **statisch** (SSG) wo möglich; dynamische Teile (Formulare, Konfigurator) über Server Actions / minimale Client Components.
- **Strikte Trennung**: UI-Komponenten, Business-Logik (Validierung, Rate-Limiting), Content (MD/JSON/CMS-ready) und Konfiguration (Env, Feature-Flags) getrennt.
- **Security-by-Design**: Validierung immer serverseitig (z. B. Zod), keine sensiblen Daten im Client, CSP und Security-Headers zentral.

---

## 2. Seitenstruktur (App Router)

| Pfad | Typ | Beschreibung |
|------|-----|--------------|
| `/` | SSG | Startseite (Hero, Leistungen, Trust, Referenzen, FAQ, CTA, Footer) |
| `/ueber-uns` | SSG | Über uns |
| `/leistungen` | SSG | Leistungsübersicht |
| `/leistungen/[slug]` | SSG | Einzelleistung |
| `/landing/[slug]` | SSG/dynamisch | Landingpages |
| `/kontakt` | Hybrid | Kontaktseite + Formular (Server Action) |
| `/kontakt/danke` | SSG | Danke-Seite nach Formularversand |
| `/blog`, `/blog/[slug]` | SSG | Blog-Übersicht und Einzelbeitrag |
| `/faq` | SSG | FAQ |
| `/referenzen`, `/team` | SSG | Referenzen, Team |
| `/konfigurator`, `/konfigurator/zusammenfassung` | Hybrid | Konfigurator + Lead-Erfassung |
| `/impressum`, `/datenschutz` | SSG | Rechtliche Seiten |
| `/download/[slug]` | optional | Leadmagnet-Seiten |
| 404 | SSG | not-found |

**Skalierbarkeit**: Neue Landingpages = neuer Eintrag in Konfiguration (z. B. `content/landing/*.json`) + Route `/landing/[slug]`; keine neuen Dateien pro Seite nötig.

---

## 3. Technische Entscheidungen

- **Framework**: Next.js 15 (stable), App Router.
- **Sprache**: TypeScript strict.
- **Styling**: Tailwind CSS (v3 oder v4).
- **Validierung**: Zod (Forms + API).
- **Formulare**: Native HTML + Server Actions (MVP); optional später React Hook Form.
- **State (Konfigurator)**: React `useState` + optional URL-SearchParams.
- **Content**: MDX oder JSON im Repo, CMS-ready Struktur.
- **Bilder**: next/image, AVIF/WebP.
- **Fonts**: next/font.
- **Security**: next.config.js + Middleware (CSP, X-Frame-Options, HSTS).
- **Rate Limiting**: In-Memory (MVP), später Redis.
- **Spam-Schutz**: Honeypot + optional Turnstile/hCaptcha serverseitig.
- **Strukturierte Daten**: JSON-LD pro Seitentyp (Organization, LocalBusiness, FAQ, BreadcrumbList).
- **i18n**: Vorbereitung über Ordnerstruktur (`[locale]`), keine Library im MVP.

---

## 4. Ordnerstruktur

- **app/**: Nur Routing und Seiten-Composition; wenig Logik.
- **components/ui**: Buttons, Input, Card, etc.
- **components/layout**: Header, Footer, Container.
- **components/sections**: Hero, Leistungen, Trust, Referenzen, FAQ, CTA.
- **components/forms**: ContactForm, Konfigurator-Steps.
- **components/seo**: JsonLd, Breadcrumbs, Metadata-Helfer.
- **components/consent**: Cookie-Banner (Platzhalter).
- **lib/validations**: Zod-Schemas.
- **lib/actions**: Server Actions (contact, configurator).
- **lib/**: rate-limit.ts, security.ts, utils.ts.
- **content/**: pages, leistungen, landing, blog, faq, site.json.
- **config/**: site.ts, navigation.ts, features.ts.
- **middleware.ts**: Security-Headers, ggf. Rate-Limit-Route.

---

## 5. Feature-Phasierung

### MVP (Phase 1)
Next.js 15 + TS + Tailwind + App Router. Startseite (Hero, Leistungen, Trust, Referenzen, FAQ, CTA, Footer). Header, Footer. Kontaktformular mit Zod, Honeypot, Rate-Limiting, Danke-Seite. Über uns, Leistungen + [slug], Impressum, Datenschutz. Eine Beispiel-Landingpage. SEO (Metadata, OG, Twitter, Canonical, robots.txt, sitemap.xml, JSON-LD). Security-Headers, CSP. 404, Barrierefreiheit-Basis. next/image, next/font, kleine Bundles.

### Phase 2
Blog (Liste + [slug]). FAQ-Seite + Section auf Landingpages. Konfigurator (mehrstufig, State, Zusammenfassung, Lead-Erfassung). Mehr Landingpages, Trust, FAQ-, CTA-Module. Cookie/Consent-UI. FAQ-Schema, BreadcrumbList, Article-Schema.

### Phase 3
Mehrsprachigkeit, CMS-Anbindung, Download-Seiten, E2E-Tests, Redis Rate-Limiting, Analytics/Consent-Integration.

---

## 6. Cursor-Agenten-Einsatz

- **Haupt-Agent (Composer/Agent)**: Durchgängig für Umsetzung (Layout, Formulare, Landingpages, Konfigurator, SEO, Security, Doku).
- **Shell-Agent**: Terminal (npm install, next build, Linter, Tests).
- **Explore-Agent**: Schnelle Suche im Code („Wo wird X verwendet?“).
- **General-Purpose**: Nur bei Recherche außerhalb des Repos.

---

## 7. Regeln für die Umsetzung

- Immer **docs/PROJECT-RULES.md** beachten bei Architektur- und Feature-Entscheidungen.
- **Sicherheit zuerst:** Hacking-Schutz und Datenschutz haben Vorrang; bei jeder Änderung prüfen.
- **Google SEO mitdenken:** Jede Seite schnell, indexierbar, mit Metadata und strukturierten Daten; Core Web Vitals einhalten.
- **Mobile immer mitdenken:** Mobile First; jede UI auf kleinen Viewports und Touch prüfen.
- **Analytics & Cookie-Banner später:** Struktur consent-gated vorbereiten; kein Tracking ohne Consent.
- **Hosting-portabel:** Basis-URL über Env; kein Code, der an einen festen Server gebunden ist – Umzug ohne Anpassung möglich.
- Eigenständig umsetzen, was fachlich sinnvoll ist; nur bei echten Unklarheiten nachfragen.
- Server Components bevorzugen; Client Components nur für Interaktivität.
- Keine sensiblen Daten im Frontend; Validierung immer serverseitig (Zod).
- Performance: LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1; kleine Bundles, keine unnötigen Third-Party-Skripte.
- Barrierefreiheit: semantisches HTML, Labels, Fokus, Kontrast, prefers-reduced-motion.
- Conversion und SEO: klare CTAs, Metadata pro Seite, strukturierte Daten, saubere URLs.

---

## 8. Weitere verbindliche Regeln (vor Start beachten)

### Umgebung & Secrets
- **.env nie committen.** Nur .env.example mit Platzhaltern (ohne echte Werte) ins Repo. Alle Secrets über Umgebungsvariablen; keine API-Keys, Passwörter oder Tokens im Frontend oder in Logs/Fehlermeldungen.

### Git & Repo
- **.gitignore vollständig:** .env, .next, node_modules, .vercel, IDE-spezifische Dateien. Keine sensiblen Daten in der Commit-Historie.

### Dependencies
- **Minimal:** Nur nötige Pakete; Next/React-Bordmittel bevorzugen. Vor Release `npm audit` ausführen; bekannte Schwachstellen beheben. Keine unnötigen Libraries (z. B. kein jQuery, keine doppelten Util-Libs).

### Fehlerbehandlung & Logging
- **Keine Information Leakage:** Nutzern nur generische, freundliche Fehlermeldungen zeigen (z. B. „Etwas ist schiefgelaufen“). Stacktraces, DB-Details oder interne Pfade nie an den Client. Serverseitig strukturiert loggen (Fehler, Sicherheitsrelevantes); Logs nicht in Response einbauen.

### Input & XSS
- **Validieren und absichern:** Nutzereingaben mit Zod validieren; bei dynamischer Ausgabe (z. B. in HTML-Attributen oder wo React nicht escaped) explizit escapen/sanitisieren. Kein `dangerouslySetInnerHTML` mit Nutzerdaten ohne Sanitisierung.

### URLs & Redirects
- **Einheitlich:** URLs in Kleinbuchstaben; Entscheidung zu trailing slashes (z. B. keine) durchgängig. Canonical-URLs immer HTTPS. Bei URL-Änderungen (z. B. Umstellung auf neue Struktur) 301-Redirects einplanen.

### Barrierefreiheit (konkret)
- **Skip-Link** zur Hauptnavigation; **Fokus-Reihenfolge** logisch; **aria-**Attribute wo nötig (z. B. live regions bei dynamischen Meldungen). **Alt-Texte** für alle inhaltstragenden Bilder; ausreichender **Kontrast** (WCAG 2.1 AA). Formulare mit `<label>` und Fehlermeldungen zuordenbar. **Tastaturbedienung** für alle interaktiven Elemente prüfen.

### Recht & Consent
- **Keine nicht notwendigen Cookies oder Tracking ohne Consent.** Datenschutz-Seite im Footer verlinkt; Impressum klar auffindbar. Cookie-/Consent-Banner vor dem Setzen nicht notwendiger Cookies; DSGVO-konforme Texte und Opt-in.

### Content & Platzhalter
- **Inhalte von Code trennen.** Platzhalter so gestalten, dass Layout und SEO prüfbar sind (z. B. realistische Längen, echte Überschriftenstruktur). Keine „Lorem ipsum“-Blöcke ohne semantische Struktur; Platzhalter in content/ oder config, nicht im Komponenten-Code.

### Browser & Geräte
- **Support definieren:** z. B. letzte 2 Versionen der gängigen Browser (Chrome, Firefox, Safari, Edge). In diesen und auf typischen Viewports (Mobile, Tablet, Desktop) testen. Keine Annahme „funktioniert überall gleich“ ohne Check.

### Strukturierte Daten (JSON-LD)
- **Vor Go-Live validieren:** z. B. mit Google Rich Results Test oder Schema.org Validator. Keine ungültigen oder irreführenden Schemata ausliefern.

### Bilder und Grafiken
- **Größe prüfen:** Wenn Bilder oder Grafiken zu groß sind (z. B. sehr hohe Dateigröße oder überdimensionierte Pixelmaße für Web), den Nutzer darauf hinweisen und Bescheid sagen. Optimierung (z. B. Komprimierung, WebP, passende Auflösung) oder kleinere Varianten vorschlagen.

### Testbarkeit
- **Kritische Pfade testbar halten:** Formularversand, Hauptnavigation, 404. Keine unnötig versteckten oder zufälligen IDs; Komponenten so bauen, dass sie später gut per E2E oder Integrationstests ansprechbar sind.

### Mobile (extrem wichtig)
- **Mobile First:** Jedes Layout und jede Komponente zuerst für kleine Viewports entwerfen, dann erweitern. Touch-Ziele mind. 44×44 px; keine rein hover-abhängigen Aktionen; Texte ohne horizontales Scrollen lesbar. Auf echten Geräten oder DevTools-Viewports testen.

### Google Analytics & Cookie-Banner (spätere Integration)
- **Vorbereitung von Anfang an:** Cookie-Banner-Komponente (UI + Zustand) und ein Konzept für consent-gates (z. B. Script erst nach Opt-in laden). Keine Analytics-, Tracking- oder Marketing-Cookies ohne Consent. Später: Google Analytics (oder vergleichbar) nur nach Nutzerzustimmung einbinden; Platzhalter/Slots im Layout dafür vorsehen.

### Hosting-Portabilität / Server-Umzug
- **Umzugsfähig bauen:** Die Seite soll später ohne Code-Änderung auf einer anderen Plattform/anderem Server gehostet werden können. Keine hardcodierten absoluten URLs (z. B. `https://meine-domain.de`); stattdessen Basis-URL aus Umgebungsvariable (z. B. `NEXT_PUBLIC_SITE_URL`). Sitemap, Canonical, Open Graph, Redirects und E-Mails (wenn konfigurierbar) von dieser Variable abhängig machen. Standard-Next.js nutzen, keine Host-spezifischen Hacks; Build soll auf Vercel, eigenem Node-Server, Netlify o. Ä. laufen.
