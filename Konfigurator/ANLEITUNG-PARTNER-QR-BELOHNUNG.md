# Partner-Flyer mit QR-Code und Belohnung – technische Umsetzung

## Funktionsweise (für dich)

1. **Jeder Partner bekommt eine eigene URL** mit seiner Partner-ID, z. B.  
   `https://deine-seite.de/konfigurator/?ref=PARTNER-001`
2. **QR-Code** auf dem Flyer verweist auf genau diese URL (plus den gleichen Link als Text).
3. Kunde scannt QR → öffnet Konfigurator **mit** `?ref=PARTNER-001` → Partner-ID wird im Browser gespeichert.
4. Kunde konfiguriert die Box und schließt ab (z. B. über „Nächster Schritt“ und ein Kontakt-/Bestellformular).
5. Beim Absenden des Formulars wird die **Partner-ID mitgeschickt** → ihr könnt zuordnen, welcher Partner die Empfehlung ausgelöst hat, und die Belohnung vergeben.

---

## Was im Konfigurator schon umgesetzt ist

- Beim Aufruf der Seite wird aus der URL gelesen: **`?ref=...`** oder **`?partner=...`** (z. B. `?ref=PARTNER-001`).
- Diese Partner-ID wird im Browser (localStorage) gespeichert und bleibt erhalten, auch wenn der Nutzer nur diese eine Seite nutzt.
- In deinem JavaScript steht die Funktion **`getPartnerRef()`** zur Verfügung. Sobald du ein Absende-Formular (z. B. bei „Nächster Schritt“) einbaust, kannst du damit die gespeicherte Partner-ID auslesen und z. B. in einem versteckten Formularfeld mitsenden.

**Beispiel**, wenn du ein Formular absendest (per E-Mail oder an euren Server):

- Verstecktes Feld: **Partner / Empfohlen von:** `getPartnerRef()`  
  → So seht ihr pro Absendung, welcher Partner (welche Partner-ID) dahintersteht.

---

## Was du noch brauchst

### 1. Partner-IDs und URLs festlegen

- Du legst pro Partner eine **eindeutige ID** fest (z. B. `PARTNER-001`, `Mueller-Apotheke`, `Beratungsstelle-XY`).
- Die **URL pro Partner** ist dann immer:
  - **Wenn Konfigurator auf GitHub Pages liegt:**  
    `https://deinname.github.io/pflegebox-konfigurator/?ref=PARTNER-001`
  - **Wenn Konfigurator in WordPress eingebettet ist:**  
    `https://konfiguratortest0.wordpress.com/pflegebox-konfigurator/?ref=PARTNER-001`  
  (Pfad ggf. anpassen, wichtig ist nur das `?ref=PARTNER-001`.)

### 2. Formular „Abschluss / Nächster Schritt“

- Ein Formular, in dem der Kunde z. B. Name, Adresse, gewählte Box zusammenfasst und abschickt.
- In diesem Formular:
  - Ein **verstecktes Feld** (hidden) mit dem Namen z. B. `partner_ref` / `empfohlen_von`.
  - Der **Wert** wird per JavaScript gesetzt: `getPartnerRef()` (steht bereits in `app.js`).
- Das Formular schickt die Daten an:
  - eure E-Mail (z. B. über Contact Form 7, WPForms o. Ä. in WordPress), **inkl.**
  - oder an euren Server/eine Datenbank, wo ihr die Zuordnung „Abschluss ↔ Partner-ID“ speichert.

So könnt ihr pro Abschluss sehen, welcher Partner die Person empfohlen hat, und die Belohnung zuordnen.

### 3. QR-Codes pro Partner

- **Eine URL pro Partner** (siehe oben).
- **Einen QR-Code pro URL** erzeugen. Das geht z. B. mit:
  - [qr-code-generator.com](https://www.qr-code-generator.com/) (einfach URL einfügen, QR herunterladen),
  - [goqr.me](https://goqr.me/),
  - oder in WordPress mit einem Plugin wie „QR Code Generator“ (URL pro Seite/Partner eintragen).
- Auf dem **Flyer**: QR-Code + denselben Link als Text (z. B. kurze URL oder „Konfigurator öffnen: [Link]“), damit Nutzer ohne Scanner den Link eintippen können.

### 4. Flyer drucken

- Pro Partner: eigener Flyer mit **eigenem QR-Code und eigener URL** (mit seiner `ref=...`).
- Kein Partner teilt sich eine URL; dann ist die Zuordnung eindeutig.

---

## Kurz-Checkliste

| Schritt | Erledigt? |
|--------|-----------|
| Partner-IDs festlegen (z. B. Liste: PARTNER-001, PARTNER-002, …) | |
| Konfigurator-URL kennen (WordPress oder GitHub Pages) | |
| Pro Partner: URL mit `?ref=PARTNER-XXX` bilden | |
| Pro Partner: QR-Code zur jeweiligen URL erstellen | |
| Absende-Formular („Nächster Schritt“) mit verstecktem Feld `partner_ref` = `getPartnerRef()` | |
| Formular sendet Daten (E-Mail/Server) inkl. Partner-ID | |
| Prozess: Belohnung an Partner bei Abschluss anhand Partner-ID vergeben | |

---

## Wichtig

- **Eine URL (und ein QR-Code) pro Partner** – dann ist die Zuordnung technisch eindeutig.
- Die Partner-ID wird **beim ersten Aufruf** aus der URL gelesen und gespeichert; der Kunde muss also über den **Partner-Link** (oder Partner-QR) auf die Seite kommen, damit die Belohnung zuordenbar ist.

Wenn du möchtest, können wir als Nächstes konkret das Formular („Nächster Schritt“) und das versteckte Feld für `getPartnerRef()` in deiner Seite einbauen.
