# Homepage online bringen & Push → Live

So bringen Sie die Seite ins Internet und sehen Änderungen nach jedem Push sofort.

---

## Empfohlen: Vercel (kostenlos, ideal für Next.js)

Vercel ist von den Next.js-Machern. Einmal einrichten, danach: **Push = sofort online**.

### 1. Code bei GitHub/GitLab/Bitbucket ablegen

Falls noch nicht geschehen:

```bash
cd c:\Users\info\Desktop\Homepage
git init
git add .
git commit -m "Initial commit"
```

Dann ein neues Repository auf [github.com](https://github.com) (oder GitLab/Bitbucket) anlegen und verbinden:

```bash
git remote add origin https://github.com/IHR-USERNAME/IHR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### 2. Bei Vercel anmelden & Projekt verbinden

1. Gehen Sie auf [vercel.com](https://vercel.com) und melden Sie sich an (z. B. mit GitHub).
2. **Add New…** → **Project**.
3. **Import** Ihres Git-Repositories (z. B. GitHub → Repository auswählen).
4. Vercel erkennt Next.js automatisch. **Build Command:** `npm run build`, **Output:** Next.js – nichts ändern.
5. Unter **Environment Variables** (empfohlen):
   - **Name:** `NEXT_PUBLIC_SITE_URL`  
   - **Value:** Ihre spätere Live-URL, z. B. `https://ihr-projekt.vercel.app` (oder Ihre eigene Domain).
   - **Partnerportal / Supabase** (sonst funktioniert der Login online nicht): dieselben Werte wie lokal in `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Optional (nur wenn Sie die Pflegebox-Abschluss-API nutzen): `SUPABASE_SERVICE_ROLE_KEY` — nur serverseitig, niemals als `NEXT_PUBLIC_`.
6. **Deploy** klicken.

**Automatisch aus `.env.local` nach Vercel übernehmen (CLI):** Einmal [Vercel-Token](https://vercel.com/account/tokens) erzeugen, im Projektroot `npx vercel link` ausführen (falls noch nicht geschehen), dann z. B. in PowerShell:

`$env:VERCEL_TOKEN="IHR_TOKEN"; npm run vercel:push-partner-env`

Das Skript setzt/aktualisiert die Supabase-Variablen (und `NEXT_PUBLIC_SITE_URL`, falls in `.env.local` gesetzt). Anschließend in Vercel ein **Redeploy** auslösen oder erneut pushen.

Nach dem ersten Build erhalten Sie eine URL wie `https://homepage-xxx.vercel.app`.

### 3. Ab jetzt: Push = Update online

Immer wenn Sie Änderungen pushen:

```bash
git add .
git commit -m "Beschreibung der Änderung"
git push
```

Vercel baut und veröffentlicht automatisch. Nach 1–2 Minuten ist die neue Version unter Ihrer Vercel-URL (und ggf. eigener Domain) sichtbar.

### Eigene Domain (optional)

In Vercel: **Project → Settings → Domains** → Domain hinzufügen (z. B. `www.alltagshilfe-sued.de`). Die angezeigten DNS-Einträge beim Domain-Anbieter eintragen.

---

## Alternative: Netlify

1. [netlify.com](https://netlify.com) → Anmelden → **Add new site** → **Import an existing project**.
2. Git-Provider verbinden, Repository wählen.
3. Netlify erkennt Next.js meist automatisch. **Build command:** `npm run build` – Publish-Pfad lässt Netlify setzen.
4. **NEXT_PUBLIC_SITE_URL** auf die Netlify-URL (oder eigene Domain) setzen.
5. **Deploy** – danach bei jedem Push automatisch neu deployen.

---

## Checkliste vor dem ersten Deploy

- [ ] `npm run build` läuft lokal ohne Fehler.
- [ ] In der Hosting-Plattform **Environment Variable** `NEXT_PUBLIC_SITE_URL` auf die finale URL setzen (z. B. `https://ihr-projekt.vercel.app`).
- [ ] **Partnerportal:** `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` in der Hosting-Plattform setzen (oder `npm run vercel:push-partner-env` mit Token, siehe oben).
- [ ] Optional: Eigene Domain in der Plattform eintragen und DNS wie beschrieben konfigurieren.

---

## Kurz: Workflow „immer wieder pushen“

1. Lokal entwickeln: `npm run dev`
2. Änderungen testen
3. Committen und pushen: `git add .` → `git commit -m "…"` → `git push`
4. Warten bis der Build durch ist (Vercel/Netlify zeigen den Status)
5. Live-URL im Browser prüfen – die Änderungen sind online.
