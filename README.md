# Unternehmens-Homepage

Moderne, performante und sichere Unternehmens-Website auf Basis von Next.js 15, TypeScript und Tailwind CSS.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Zod** (Validierung)
- Server Components, Server Actions, statische Generierung

## Projektstruktur

- `app/` – Routen und Seiten
- `components/` – UI, Layout (Header, Footer), Sections, Forms, SEO
- `config/` – Site-Konfiguration, Navigation, Feature-Flags
- `content/` – Inhalte (JSON/MD), CMS-ready
- `lib/` – Validierung, Server Actions, Rate-Limit, Utils

Ausführliche Regeln und Architektur: **docs/PROJECT-RULES.md**

## Entwicklung

```bash
npm install
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000)

## Build & Produktion

```bash
npm run build
npm start
```

Bei belegtem Port 3000: `npm run start:4000` (läuft dann auf Port 4000).

## Online bringen & Push → Live

**Empfohlen: Vercel** – einmal Git-Repo verbinden, danach bei jedem `git push` automatisch neu deployen.

1. Code auf GitHub (oder GitLab/Bitbucket) pushen.
2. Auf [vercel.com](https://vercel.com) anmelden, **New Project** → Repository importieren.
3. Optional: Umgebungsvariable `NEXT_PUBLIC_SITE_URL` auf die spätere Live-URL setzen (z. B. `https://ihr-projekt.vercel.app`).
4. **Deploy** – fertig. Ab dann: Änderungen committen und pushen → nach kurzer Zeit live sichtbar.

Ausführliche Schritte und Alternative (Netlify): **docs/DEPLOYMENT.md**

## Umgebung

Kopie von `.env.example` nach `.env` anlegen. Wichtig:

- `NEXT_PUBLIC_SITE_URL` – Basis-URL der Website (für Canonical, OG, Sitemap). Beim Umzug auf anderen Server nur hier anpassen.

## Neue Landingpage anlegen

1. Neue JSON-Datei in `content/landing/` anlegen (z. B. `meine-seite.json`) mit: `slug`, `title`, `description`, `heroTitle`, `heroSubtitle`, `ctaText`.
2. In `app/landing/[slug]/page.tsx` in `generateStaticParams()` den neuen Slug ergänzen (z. B. `{ slug: "meine-seite" }`).
3. Seite ist unter `/landing/meine-seite` erreichbar.

## Kontaktformular & interne E-Mails

- Validierung: Zod-Schema in `lib/validations/contact.ts`
- Server Action: `lib/actions/contact.ts` (Honeypot, Rate-Limit, Redirect zur Danke-Seite)
- Benachrichtigung per SMTP: `lib/email/internal-smtp.ts` — optional getrennte Ziele: `NOTIFICATION_TO_CONTACT`, `NOTIFICATION_TO_KARRIERE`, `NOTIFICATION_TO_PFLEGEBOX`, sonst Fallback `NOTIFICATION_TO` (siehe `.env.example`).

## Konfigurator (Phase 2)

Basis-Struktur vorbereitet unter `app/konfigurator/`. Erweiterung: Schritte und State in eigenen Komponenten, Lead-Erfassung am Ende per Server Action.

## Lizenz

Projektintern.
