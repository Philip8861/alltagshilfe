# Schritt 1: Code zu GitHub pushen

Führen Sie die Befehle **in dieser Reihenfolge** in PowerShell oder der Eingabeaufforderung aus.  
Arbeitsordner: `c:\Users\info\Desktop\Homepage`

---

## 1. Git-Benutzer einmalig einrichten (nur beim ersten Mal nötig)

```powershell
git config --global user.email "IHRE-EMAIL@beispiel.de"
git config --global user.name "Ihr Name"
```
Ersetzen Sie durch Ihre echte E-Mail und Ihren Namen (z. B. für GitHub).

---

## 2. Ersten Commit anlegen

```powershell
cd c:\Users\info\Desktop\Homepage
git commit -m "Homepage bereit für Deployment"
```

---

## 3. Neues Repository auf GitHub anlegen

1. Im Browser öffnen: **https://github.com/new**
2. **Repository name:** z. B. `homepage` oder `alltagshilfe-sued`
3. **Public** auswählen
4. **Nicht** "Add a README" oder .gitignore ankreuzen (Repo soll leer sein)
5. Auf **Create repository** klicken

---

## 4. GitHub als Remote hinzufügen und pushen

GitHub zeigt nach dem Anlegen eine URL an. Ersetzen Sie `IHR-GITHUB-USERNAME` und `IHR-REPO-NAME` durch Ihre Angaben (z. B. `maxmustermann` und `homepage`).

```powershell
cd c:\Users\info\Desktop\Homepage
git branch -M main
git remote add origin https://github.com/IHR-GITHUB-USERNAME/IHR-REPO-NAME.git
git push -u origin main
```

Beim ersten `git push` werden Sie nach GitHub-Benutzername und Passwort/Token gefragt.  
**Hinweis:** Bei Passwort-Abfrage verwenden Sie ein **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens), nicht Ihr normales Passwort.

---

## Fertig

Wenn `git push` ohne Fehler durchläuft, ist Schritt 1 erledigt.  
Weiter mit **Schritt 2:** Auf [vercel.com](https://vercel.com) das Projekt importieren (siehe docs/DEPLOYMENT.md).
