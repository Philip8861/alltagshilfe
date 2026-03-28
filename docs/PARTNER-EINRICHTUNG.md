# Partnerportal & Verwaltung – Schritt für Schritt

Diese Anleitung richtet **Supabase**, **lokale Umgebung**, **Vercel** und die **interne Partner-Verwaltung** ein. Alles, was nur in deinen Konten geht, musst du selbst klicken; der Code und die Skripte liegen im Repo.

---

## Teil A – Supabase (einmalig)

### Schritt 1: Projekt anlegen oder öffnen

1. Gehe zu [supabase.com](https://supabase.com) und melde dich an.
2. Wähle ein bestehendes Projekt oder **New project**.
3. Region möglichst **EU** (z. B. Frankfurt), damit Daten in der EU bleiben.

### Schritt 2: SQL-Migration ausführen

1. Im Supabase-Dashboard: **SQL Editor** → **New query**.
2. Inhalt der Datei `supabase/migrations/001_partner_portal.sql` aus diesem Repository **vollständig** einfügen und **Run** ausführen.
3. Falls du schon früher Nutzer in `auth.users` hattest und die noch keine Zeile in `partner_profiles` haben: optional `supabase/migrations/002_backfill_partner_profiles.sql` ebenfalls ausführen.

### Schritt 3: E-Mail-Login aktivieren, Selbstregistrierung abschalten

1. **Authentication** → **Providers** → **E-Mail** aktivieren (E-Mail + Passwort), falls noch nicht geschehen.
2. **Sign ups** / öffentliche Registrierung **deaktivieren**, damit sich niemand selbst als Partner registrieren kann. Partner werden nur über **/partner/admin** (mit Service Role) angelegt.

### Schritt 4: API-Keys kopieren

1. **Project Settings** (Zahnrad) → **API**.
2. Notiere dir (nur für dich, nicht committen):
   - **Project URL** → wird `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → wird `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (geheim) → wird `SUPABASE_SERVICE_ROLE_KEY`  
     Nur serverseitig verwenden; **niemals** als `NEXT_PUBLIC_*` oder im Client-Code.

---

## Teil B – Lokale Datei `.env.local`

### Schritt 5: Datei anlegen

1. Im **Projektroot** (Ordner `Homepage`) eine Datei **`.env.local`** anlegen (liegt in `.gitignore`, wird nicht mit Git hochgeladen).
2. Orientierung: `.env.example` im gleichen Ordner öffnen und die relevanten Zeilen übernehmen.

### Schritt 6: Supabase-Variablen eintragen

Trage ein (Werte aus Schritt 4):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Ohne **Service Role** funktioniert die **Verwaltung** (`/partner/admin`, Partner anlegen) nicht.

**Kurzname statt E-Mail:** Trägt jemand nur einen Namen ohne `@` ein (Login und Verwaltung), wird intern `name@<Domain>` an Supabase geschickt. Standard-Domain: `partners.invalid`. Optional in `.env.local` und Vercel identisch setzen: `NEXT_PUBLIC_PARTNER_AUTH_EMAIL_DOMAIN=ihre-subdomain.intern` (nur Hostname, kein `https://`). Mit `@` eingegebene echte E-Mail-Adressen bleiben unverändert.

### Schritt 7: Verwaltungs-Login (System-Admin)

Wähle einen **Benutzernamen** und ein **starkes Passwort** nur für die interne Verwaltung (nicht dasselbe wie dein Supabase-Login).

Für das Secret im Terminal im Projektordner:

```bash
npm run partner:admin-secret
```

Den ausgegebenen String kopieren.

In `.env.local` ergänzen:

```env
PARTNER_SYSTEM_ADMIN_USER=dein-interner-name
PARTNER_SYSTEM_ADMIN_PASSWORD=dein-starkes-passwort
PARTNER_SYSTEM_ADMIN_SECRET=<Ausgabe von npm run partner:admin-secret, mindestens 24 Zeichen>
```

### Schritt 8: Optional – öffentliche Site-URL

Für Canonical und Metadaten (siehe `.env.example`):

```env
NEXT_PUBLIC_SITE_URL=https://deine-live-domain.de
```

Lokal kannst du z. B. `http://localhost:3000` nutzen.

### Schritt 9: Prüfen

```bash
npm run check:partner-env
```

Melde „OK“ für Supabase und Verwaltung; bei Fehlern die genannten Variablen ergänzen.

### Schritt 10: Lokal testen

```bash
npm run dev
```

- Verwaltung: [http://localhost:3000/partner/admin-login](http://localhost:3000/partner/admin-login) → nach Login [http://localhost:3000/partner/admin](http://localhost:3000/partner/admin) → Partner anlegen.
- Partner-Login: [http://localhost:3000/partner/login](http://localhost:3000/partner/login) mit dem von der Verwaltung angelegten Konto.

---

## Teil C – Vercel (Live)

### Schritt 11: Umgebungsvariablen in Vercel (manuell)

1. [vercel.com](https://vercel.com) → dein **Projekt** → **Settings** → **Environment Variables**.
2. Für **Production** (und bei Bedarf **Preview**) dieselben Namen und Werte wie in `.env.local` anlegen:
   - `NEXT_PUBLIC_SITE_URL` (deine echte Live-URL, z. B. `https://….vercel.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PARTNER_SYSTEM_ADMIN_USER`
   - `PARTNER_SYSTEM_ADMIN_PASSWORD`
   - `PARTNER_SYSTEM_ADMIN_SECRET`
3. **Save** nach jeder Variable oder am Ende gesammelt.

### Schritt 12: Oder: Variablen per Skript aus `.env.local` pushen

Wenn `.env.local` vollständig ist:

1. [Vercel Token](https://vercel.com/account/tokens) erzeugen.
2. Im Projektroot einmal `npx vercel link` ausführen (falls noch nicht geschehen).
3. In **PowerShell** (Beispiel):

```powershell
$env:VERCEL_TOKEN="dein-token"
npm run vercel:push-partner-env
```

Das Skript setzt Supabase-URL, Anon-Key, optional `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY` und – wenn alle drei gesetzt sind – die `PARTNER_SYSTEM_ADMIN_*` Variablen. Anschließend trotzdem **Redeploy** auslösen (siehe unten).

### Schritt 13: Neu bauen (Redeploy)

Nach Änderungen an Env-Variablen: **Deployments** → bei dem letzten Deployment **⋯** → **Redeploy** (oder einen neuen Commit pushen).

### Schritt 14: Live testen

- `https://deine-domain/partner/admin-login` → Verwaltung.
- Partner anlegen → mit diesem Konto `https://deine-domain/partner/login` testen.

---

## Kurz-Checkliste

- [ ] SQL `001_partner_portal.sql` (und ggf. `002_…`) in Supabase ausgeführt  
- [ ] E-Mail-Provider an, **Sign-ups aus**  
- [ ] `.env.local` mit URL, Anon, **Service Role**, `PARTNER_SYSTEM_ADMIN_*`  
- [ ] `npm run check:partner-env` ohne Fehler  
- [ ] Vercel: alle genannten Variablen gesetzt + **Redeploy**  
- [ ] Verwaltung und Partner-Login auf der Live-URL getestet  

Bei Problemen zuerst Browser-Cache/Cookies für `/partner/*` leeren oder Inkognito nutzen.
