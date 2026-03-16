# Konfigurator per iframe einbinden (GitHub Pages + WordPress)

## Teil 1: Konfigurator auf GitHub Pages bringen

### Schritt 1 – GitHub-Konto und Repository

1. Gehe zu **https://github.com** und melde dich an (oder erstelle ein Konto).
2. Klicke auf **„New“** (grüner Button) oder **„Create repository“**.
3. **Repository-Name:** z. B. `pflegebox-konfigurator` (kann der Nutzer nicht sehen).
4. **Public** auswählen, **„Create repository“** klicken.
5. Auf der leeren Repo-Seite siehst du Anweisungen zum Hochladen. Wähle **„uploading an existing file“** (Dateien hochladen).

### Schritt 2 – Alle Konfigurator-Dateien hochladen

Lade **alle** Dateien aus deinem Konfigurator-Ordner hoch:

- `index.html`
- `style.css`
- `app.js`
- `Hintergrundbild_Konfigurator.jpg`
- `Box.png`
- Alle weiteren Bilder, die du im Konfigurator nutzt (z. B. Artikelbilder)

**Wichtig:** Alle Dateien in die **oberste Ebene** des Repositories hochladen (nicht in Unterordner, außer du legst einen Ordner „bilder“ an – dann musst du die Pfade in `index.html` / `app.js` anpassen).

### Schritt 3 – GitHub Pages aktivieren

1. Im Repository: **Settings** (Zahnrad) klicken.
2. Links im Menü **„Pages“** wählen.
3. Unter **„Source“**: **„Deploy from a branch“** auswählen.
4. **Branch:** `main` (oder `master`), Ordner **`/ (root)`**.
5. **Save** klicken.
6. Einige Sekunden warten. Oben erscheint dann eine Meldung mit der URL, z. B.:
   `https://DEIN-GITHUB-NAME.github.io/pflegebox-konfigurator/`

Diese URL ist deine **Konfigurator-URL** für den iframe.

---

## Teil 2: iframe in WordPress einbinden

### Schritt 4 – WordPress-Seite anlegen

1. In deinem WordPress.com-Dashboard: **Seiten** → **Neue Seite** (oder **Seite hinzufügen**).
2. **Titel:** z. B. „Pflegebox konfigurieren“ oder „Konfigurator“.
3. Im Editor einen **Block hinzufügen**:
   - Auf **„+“** (Block hinzufügen) klicken.
   - Nach **„Benutzerdefiniertes HTML“** oder **„Custom HTML“** suchen und auswählen.

### Schritt 5 – iframe-Code einfügen

In den **Custom-HTML-Block** folgenden Code einfügen – und **`DEINE-GITHUB-PAGES-URL`** durch deine echte Konfigurator-URL ersetzen (z. B. `https://deinname.github.io/pflegebox-konfigurator/`):

```html
<div style="width: 100%; max-width: 1100px; margin: 0 auto;">
  <iframe 
    src="DEINE-GITHUB-PAGES-URL" 
    width="100%" 
    height="900" 
    style="border: none; min-height: 85vh; display: block;"
    title="Pflegebox-Konfigurator">
  </iframe>
</div>
```

**Beispiel**, wenn deine URL `https://maxmustermann.github.io/pflegebox-konfigurator/` ist:

```html
<div style="width: 100%; max-width: 1100px; margin: 0 auto;">
  <iframe 
    src="https://maxmustermann.github.io/pflegebox-konfigurator/" 
    width="100%" 
    height="900" 
    style="border: none; min-height: 85vh; display: block;"
    title="Pflegebox-Konfigurator">
  </iframe>
</div>
```

### Schritt 6 – Seite speichern und veröffentlichen

- **Entwurf speichern** oder **Veröffentlichen** klicken.
- Seite aufrufen: Die WordPress-URL bleibt in der Adresszeile (z. B. `konfiguratortest0.wordpress.com/pflegebox-konfigurieren`), der Konfigurator erscheint darin – für den Nutzer unsichtbar, dass er von GitHub kommt.

---

## Checkliste

- [ ] GitHub-Repository erstellt und alle Dateien (HTML, CSS, JS, Bilder) hochgeladen
- [ ] Unter Settings → Pages: Source = Branch `main`, Root, gespeichert
- [ ] Konfigurator-URL notiert (z. B. `https://xxx.github.io/pflegebox-konfigurator/`)
- [ ] WordPress-Seite mit Custom-HTML-Block angelegt
- [ ] iframe-Code mit der echten URL eingefügt und Seite veröffentlicht

Wenn du später die URL änderst (z. B. anderes Repo), musst du nur in WordPress den iframe-`src` anpassen.
