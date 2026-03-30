/**
 * Pflegebox Schritt 2: mehrteiliger Dialog (Persönliche Daten, Versichertendaten, Beratung, AGB, Partner-Code, Unterschrift).
 * Erwartet im DOM: #pflegebox-wizard-backdrop und Kinder (siehe index.html).
 */
(function () {
  const STEPS = [
    { key: "p1", section: "Persönliche Daten", title: "Ihre Person", motivation: "Los geht’s – nur wenige Angaben zu Ihrer Person." },
    { key: "p2", section: "Persönliche Daten", title: "Adresse & Geburtsdatum", motivation: "Super – gleich geht’s weiter!" },
    { key: "v1", section: "Versichertendaten", title: "Krankenversicherung", motivation: "Versichertendaten – dieser Teil ist gleich erledigt." },
    { key: "v2", section: "Versichertendaten", title: "Pflegegrad", motivation: "Noch eine Angabe zu Ihrem Pflegegrad – dann geht es weiter." },
    { key: "b1", section: "Beratung", title: "Persönliche Beratung", motivation: "Noch ein Schritt – Sie sind schon sehr weit." },
    { key: "n1", section: "Bestellung", title: "Anmerkung", motivation: "Fast am Ziel – nur noch Formalien." },
    { key: "l1", section: "Rechtliches", title: "AGB & Datenschutz", motivation: "Bitte bestätigen Sie die rechtlichen Hinweise." },
    { key: "r1", section: "Empfehlung", title: "Partner-Code (optional)", motivation: "Wurden Sie empfohlen? Optional – Sie können überspringen." },
    { key: "s1", section: "Unterschrift", title: "Unterschrift", motivation: "Zum Schluss: bitte unterschreiben Sie hier." },
  ];

  /** Pflegeboxi: beschreibt die gerade geöffnete Seite (nicht den nächsten Schritt). */
  const BOXI_STEP_INTROS = [
    "Hier noch schnell Ihre persönlichen Daten: Anrede, Vor- und Nachname.",
    "Jetzt Ihre Adresse, PLZ, Ort und Ihr Geburtsdatum.",
    "Hier geht es um Ihre Krankenversicherung, gesetzlich oder privat.",
    "Auf dieser Seite wählen Sie Ihren Pflegegrad.",
    "Hier sagen Sie, ob Sie eine persönliche Beratung wünschen und wie wir Sie erreichen dürfen.",
    "Optional: Hier dürfen Sie eine Anmerkung zu Ihrer Bestellung schreiben.",
    "Bitte lesen und bestätigen Sie die AGB und die Datenschutzhinweise.",
    "Optional: Tragen Sie einen Partner-Code ein, falls Sie empfohlen wurden.",
    "Zum Schluss unterschreiben Sie bitte im Feld, dann können wir Ihre Bestellung entgegennehmen.",
  ];

  function $(id) {
    return document.getElementById(id);
  }

  let config = null;
  let stepIndex = 0;
  let kkList = [];

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function splitBirthDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || "").trim());
    if (!m) return { y: "", mo: "", d: "" };
    return { y: m[1], mo: m[2], d: m[3] };
  }

  function daysInMonth(yearStr, monthStr) {
    const y = Number(yearStr);
    const mo = Number(monthStr);
    if (!yearStr || !monthStr || !Number.isFinite(y) || !Number.isFinite(mo) || mo < 1 || mo > 12) {
      return 31;
    }
    return new Date(Date.UTC(y, mo, 0)).getUTCDate();
  }

  function isValidBirthIso(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return false;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const cy = new Date().getFullYear();
    if (y < 1900 || y > cy) return false;
    if (mo < 1 || mo > 12) return false;
    const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate();
    if (d < 1 || d > dim) return false;
    return true;
  }

  const BIRTH_MONTHS_DE = [
    ["01", "Januar"],
    ["02", "Februar"],
    ["03", "März"],
    ["04", "April"],
    ["05", "Mai"],
    ["06", "Juni"],
    ["07", "Juli"],
    ["08", "August"],
    ["09", "September"],
    ["10", "Oktober"],
    ["11", "November"],
    ["12", "Dezember"],
  ];

  function buildBirthDayOptions(parts) {
    const dim = parts.y && parts.mo ? daysInMonth(parts.y, parts.mo) : 31;
    let s = '<option value="">—</option>';
    for (let day = 1; day <= dim; day++) {
      const v = pad2(day);
      s += "<option value=\"" + v + "\"" + (v === parts.d ? " selected" : "") + ">" + day + ".</option>";
    }
    return s;
  }

  function buildBirthMonthOptions(parts) {
    let s = '<option value="">—</option>';
    for (const [val, label] of BIRTH_MONTHS_DE) {
      s += "<option value=\"" + val + "\"" + (val === parts.mo ? " selected" : "") + ">" + label + "</option>";
    }
    return s;
  }

  function buildBirthYearOptions(parts) {
    const cy = new Date().getFullYear();
    let s = '<option value="">—</option>';
    for (let y = cy; y >= 1900; y--) {
      s += "<option value=\"" + y + "\"" + (String(y) === parts.y ? " selected" : "") + ">" + y + "</option>";
    }
    return s;
  }

  const data = {
    salutation: "herr",
    firstName: "",
    lastName: "",
    street: "",
    postalCode: "",
    city: "",
    birthDate: "",
    versichertennummer: "",
    krankenkasse: "",
    privatversichert: false,
    pflegegrad: 1,
    beihilfeberechtigt: false,
    personalBeratungWunsch: false,
    keinBeratungGrund: "",
    beratungKanal: "",
    orderNote: "",
    agbAccepted: false,
    privacyAccepted: false,
    partnerCode: "",
    partnerLookupOk: null,
  };

  let sigCanvas = null;
  let sigCtx = null;
  let sigDrawing = false;
  let sigHadStroke = false;

  function showError(msg) {
    const el = $("pflege-wizard-error");
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  async function loadKrankenkassen() {
    try {
      const res = await fetch(new URL("krankenkassen.json", document.baseURI).href, { cache: "force-cache" });
      const j = await res.json();
      kkList = Array.isArray(j.krankenkassen) ? j.krankenkassen : [];
    } catch {
      kkList = [];
    }
  }

  /** Nach erfolgreichem „Weiter“: Pflegeboxi freudig hüpfen lassen. */
  function triggerBoxiHop() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bd = $("pflegebox-wizard-backdrop");
    const img = bd?.querySelector(".pflege-wizard-boxi-img");
    if (!img) return;
    img.classList.remove("pflege-wizard-boxi-hop");
    void img.offsetWidth;
    img.classList.add("pflege-wizard-boxi-hop");
    function onEnd() {
      img.classList.remove("pflege-wizard-boxi-hop");
      img.removeEventListener("animationend", onEnd);
    }
    img.addEventListener("animationend", onEnd);
  }

  function buildKkDatalist() {
    const dl = $("pflege-wizard-kk-datalist");
    if (!dl) return;
    dl.innerHTML = "";
    const frag = document.createDocumentFragment();
    kkList.forEach((name) => {
      const o = document.createElement("option");
      o.value = name;
      frag.appendChild(o);
    });
    dl.appendChild(frag);
  }

  function validateCurrentStep() {
    const s = STEPS[stepIndex];
    showError("");
    if (s.key === "p1") {
      if (!data.firstName.trim() || !data.lastName.trim()) return "Bitte Vor- und Nachname ausfüllen.";
    }
    if (s.key === "p2") {
      if (!data.street.trim() || !data.postalCode.trim() || !data.city.trim()) return "Bitte vollständige Adresse angeben.";
      if (!data.birthDate || !isValidBirthIso(data.birthDate)) {
        return "Bitte gültiges Geburtsdatum wählen (Tag, Monat und Jahr).";
      }
    }
    if (s.key === "v1") {
      if (data.privatversichert) return "";
      const raw = data.versichertennummer.trim();
      if (!/^[A-Za-z]\d{9}$/.test(raw)) {
        return "Versichertennummer ungültig: bitte genau ein Buchstabe und 9 Ziffern (z. B. A123456789).";
      }
      if (!data.krankenkasse.trim()) return "Bitte Krankenkasse auswählen oder eintragen.";
    }
    if (s.key === "b1") {
      if (!data.personalBeratungWunsch) {
        if (data.keinBeratungGrund.trim().length < 5) return "Bitte geben Sie einen kurzen Grund an.";
      } else if (!data.beratungKanal) {
        return "Bitte wählen Sie eine Beratungsform.";
      }
    }
    if (s.key === "l1") {
      if (!data.agbAccepted || !data.privacyAccepted) return "Bitte AGB und Datenschutz bestätigen.";
    }
    if (s.key === "r1") {
      const c = data.partnerCode.trim();
      if (c && data.partnerLookupOk === false) return "Partner konnte nicht zugeteilt werden.";
    }
    if (s.key === "s1") {
      if (!sigHadStroke) return "Bitte unterschreiben Sie im Feld.";
    }
    return "";
  }

  async function lookupPartnerCode() {
    const c = data.partnerCode.trim();
    if (!c) {
      data.partnerLookupOk = true;
      return;
    }
    try {
      const res = await fetch(`/api/pflegebox-partner-code?code=${encodeURIComponent(c)}`, { cache: "no-store" });
      const j = await res.json().catch(() => ({}));
      data.partnerLookupOk = Boolean(j.valid);
    } catch {
      data.partnerLookupOk = false;
    }
  }

  function syncFromDom() {
    const s = STEPS[stepIndex];
    if (s.key === "p1") {
      const sal = document.querySelector('input[name="wiz-salutation"]:checked');
      data.salutation = sal ? sal.value : "herr";
      data.firstName = $("wiz-firstname")?.value ?? "";
      data.lastName = $("wiz-lastname")?.value ?? "";
    }
    if (s.key === "p2") {
      data.street = $("wiz-street")?.value ?? "";
      data.postalCode = $("wiz-plz")?.value ?? "";
      data.city = $("wiz-city")?.value ?? "";
      const y = $("wiz-birth-y")?.value ?? "";
      const mo = $("wiz-birth-m")?.value ?? "";
      const d = $("wiz-birth-d")?.value ?? "";
      data.birthDate = y && mo && d ? `${y}-${pad2(mo)}-${pad2(d)}` : "";
    }
    if (s.key === "v1") {
      const pv = document.querySelector('input[name="wiz-privat"]:checked');
      data.privatversichert = pv?.value === "ja";
      data.versichertennummer = $("wiz-vsnr")?.value ?? "";
      data.krankenkasse = $("wiz-kk")?.value ?? "";
      if (data.privatversichert) {
        const bh = document.querySelector('input[name="wiz-beihilfe"]:checked');
        data.beihilfeberechtigt = bh?.value === "ja";
      } else {
        data.beihilfeberechtigt = false;
      }
    }
    if (s.key === "v2") {
      data.pflegegrad = Number($("wiz-pg")?.value ?? "1");
    }
    if (s.key === "b1") {
      data.personalBeratungWunsch = $("wiz-ber-ja")?.checked === true;
      data.keinBeratungGrund = $("wiz-ber-grund")?.value ?? "";
      const kanal = document.querySelector('input[name="wiz-ber-kanal"]:checked');
      data.beratungKanal = kanal?.value ?? "";
    }
    if (s.key === "n1") {
      data.orderNote = $("wiz-note")?.value ?? "";
    }
    if (s.key === "l1") {
      data.agbAccepted = $("wiz-agb")?.checked === true;
      data.privacyAccepted = $("wiz-privacy")?.checked === true;
    }
    if (s.key === "r1") {
      data.partnerCode = $("wiz-partner")?.value ?? "";
    }
  }

  function render() {
    const meta = STEPS[stepIndex] ?? STEPS[0];
    const bd = $("pflegebox-wizard-backdrop");
    /** Im Modal verankern, damit immer die richtigen Knoten befüllt werden (kein Abbruch wenn z. B. nur Titel/Motivation fehlen). */
    const q = (sel) => (bd?.querySelector(sel) ?? document.querySelector(sel));
    const sec = q("#pflege-wizard-section");
    const title = q("#pflege-wizard-title");
    const mot = q("#pflege-wizard-motivation");
    const body = q("#pflege-wizard-body");
    const backBtn = q("#pflege-wizard-back");
    const nextBtn = q("#pflege-wizard-next");
    if (!body) return;

    if (sec) sec.textContent = meta.section;
    if (title) title.textContent = meta.title;
    if (mot) mot.textContent = meta.motivation;

    const boxiBubble = q("#pflege-wizard-boxi-bubble");
    if (boxiBubble) boxiBubble.textContent = BOXI_STEP_INTROS[stepIndex] ?? "";

    if (backBtn) backBtn.textContent = stepIndex === 0 ? "Abbrechen" : "Zurück";
    if (nextBtn) nextBtn.textContent = meta.key === "s1" ? "Bestellung absenden" : "Weiter";

    let html = "";
    if (meta.key === "p1") {
      html = `
        <div class="wiz-field-group">
          <span class="wiz-label">Anrede</span>
          <div class="wiz-radio-row">
            <label><input type="radio" name="wiz-salutation" value="herr" ${data.salutation === "herr" ? "checked" : ""}/> Herr</label>
            <label><input type="radio" name="wiz-salutation" value="frau" ${data.salutation === "frau" ? "checked" : ""}/> Frau</label>
            <label><input type="radio" name="wiz-salutation" value="divers" ${data.salutation === "divers" ? "checked" : ""}/> divers</label>
          </div>
        </div>
        <div class="wiz-field-row">
          <div class="wiz-field">
            <label for="wiz-firstname">Vorname *</label>
            <input type="text" id="wiz-firstname" maxlength="80" autocomplete="given-name" value="${escapeAttr(data.firstName)}" />
          </div>
          <div class="wiz-field">
            <label for="wiz-lastname">Nachname *</label>
            <input type="text" id="wiz-lastname" maxlength="80" autocomplete="family-name" value="${escapeAttr(data.lastName)}" />
          </div>
        </div>`;
    } else if (meta.key === "p2") {
      html = `
        <div class="wiz-field">
          <label for="wiz-street">Straße und Hausnummer *</label>
          <input type="text" id="wiz-street" maxlength="120" autocomplete="street-address" value="${escapeAttr(data.street)}" />
        </div>
        <div class="wiz-field-row">
          <div class="wiz-field wiz-field--narrow">
            <label for="wiz-plz">PLZ *</label>
            <input type="text" id="wiz-plz" maxlength="12" autocomplete="postal-code" value="${escapeAttr(data.postalCode)}" />
          </div>
          <div class="wiz-field">
            <label for="wiz-city">Stadt *</label>
            <input type="text" id="wiz-city" maxlength="80" autocomplete="address-level2" value="${escapeAttr(data.city)}" />
          </div>
        </div>
        <fieldset class="wiz-birth-fieldset">
          <legend class="wiz-label">Geburtsdatum *</legend>
          <div class="wiz-birth-grid">
            <div class="wiz-field wiz-field--birth">
              <label for="wiz-birth-d">Tag</label>
              <select id="wiz-birth-d" autocomplete="bday-day" aria-label="Geburtstag">${buildBirthDayOptions(splitBirthDate(data.birthDate))}</select>
            </div>
            <div class="wiz-field wiz-field--birth">
              <label for="wiz-birth-m">Monat</label>
              <select id="wiz-birth-m" autocomplete="bday-month" aria-label="Geburtsmonat">${buildBirthMonthOptions(splitBirthDate(data.birthDate))}</select>
            </div>
            <div class="wiz-field wiz-field--birth">
              <label for="wiz-birth-y">Jahr</label>
              <select id="wiz-birth-y" autocomplete="bday-year" aria-label="Geburtsjahr">${buildBirthYearOptions(splitBirthDate(data.birthDate))}</select>
            </div>
          </div>
        </fieldset>`;
    } else if (meta.key === "v1") {
      const gkvHidden = data.privatversichert ? "hidden" : "";
      const beihHidden = data.privatversichert ? "" : "hidden";
      html = `
        <div class="wiz-field-group wiz-privat-wrap">
          <span class="wiz-label wiz-label--prominent" id="wiz-privat-legend">Privatversichert?</span>
          <div class="wiz-radio-row wiz-radio-row--emphasis" role="group" aria-labelledby="wiz-privat-legend">
            <label><input type="radio" name="wiz-privat" id="wiz-privat-nein" value="nein" ${!data.privatversichert ? "checked" : ""}/> Nein</label>
            <label><input type="radio" name="wiz-privat" id="wiz-privat-ja" value="ja" ${data.privatversichert ? "checked" : ""}/> Ja</label>
          </div>
        </div>
        <div id="wiz-beihilfe-block" class="wiz-beihilfe-block" ${beihHidden}>
          <div class="wiz-field-group wiz-beihilfe-inner">
            <span class="wiz-label" id="wiz-beihilfe-legend">Beihilfeberechtigt?</span>
            <p class="wiz-hint wiz-beihilfe-hint">Nur relevant, wenn Sie privat versichert sind und Anspruch auf Beihilfe haben.</p>
            <div class="wiz-radio-row" role="group" aria-labelledby="wiz-beihilfe-legend">
              <label><input type="radio" name="wiz-beihilfe" id="wiz-beihilfe-nein" value="nein" ${!data.beihilfeberechtigt ? "checked" : ""}/> Nein</label>
              <label><input type="radio" name="wiz-beihilfe" id="wiz-beihilfe-ja" value="ja" ${data.beihilfeberechtigt ? "checked" : ""}/> Ja</label>
            </div>
          </div>
        </div>
        <div id="wiz-gkv-block" class="wiz-gkv-block" ${gkvHidden}>
          <div class="wiz-field">
            <label for="wiz-vsnr">Versichertennummer *</label>
            <input type="text" id="wiz-vsnr" maxlength="10" inputmode="text" autocomplete="off" spellcheck="false" placeholder="z. B. A123456789" value="${escapeAttr(data.versichertennummer)}" />
            <p class="wiz-hint">Ein Buchstabe am Anfang, danach genau 9 Ziffern.</p>
          </div>
          <div class="wiz-field">
            <label for="wiz-kk">Krankenkasse *</label>
            <input type="text" id="wiz-kk" maxlength="200" list="pflege-wizard-kk-datalist" autocomplete="off" placeholder="Tippen zum Suchen …" value="${escapeAttr(data.krankenkasse)}" />
            <datalist id="pflege-wizard-kk-datalist"></datalist>
            <p class="wiz-hint">Alle gesetzlichen Krankenkassen stehen zur Auswahl; Sie können auch frei ergänzen.</p>
          </div>
        </div>`;
    } else if (meta.key === "v2") {
      html = `
        <div class="wiz-field">
          <label for="wiz-pg">Pflegegrad *</label>
          <select id="wiz-pg">
            ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${data.pflegegrad === n ? "selected" : ""}>Pflegegrad ${n}</option>`).join("")}
          </select>
        </div>`;
    } else if (meta.key === "b1") {
      const w = data.personalBeratungWunsch;
      html = `
        <div class="wiz-field-group">
          <span class="wiz-label">Ich wünsche eine persönliche Beratung</span>
          <div class="wiz-radio-row">
            <label><input type="radio" name="wiz-ber-wunsch" id="wiz-ber-nein" value="nein" ${!w ? "checked" : ""}/> Nein</label>
            <label><input type="radio" name="wiz-ber-wunsch" id="wiz-ber-ja" value="ja" ${w ? "checked" : ""}/> Ja</label>
          </div>
        </div>
        <div id="wiz-ber-block-nein" class="wiz-conditional wiz-ber-grund-card" ${w ? 'style="display:none"' : ""}>
          <div class="wiz-ber-grund-card__accent" aria-hidden="true"></div>
          <div class="wiz-ber-grund-card__body">
            <p class="wiz-ber-grund-lead">Ihre Angabe hilft uns, Ihre Bestellung passend zu bearbeiten.</p>
            <label for="wiz-ber-grund" class="wiz-ber-grund-label">Warum wünschen Sie keine Beratung? *</label>
            <textarea id="wiz-ber-grund" class="wiz-textarea-premium" rows="4" maxlength="2000" spellcheck="true" placeholder="Kurz beschreiben, z. B. bereits beraten worden, bewusst ohne Beratung …">${escHtml(data.keinBeratungGrund)}</textarea>
            <p class="wiz-ber-grund-foot">Mindestens 5 Zeichen · maximal 2.000 Zeichen</p>
          </div>
        </div>
        <div id="wiz-ber-block-ja" class="wiz-conditional" ${w ? "" : 'style="display:none"'}>
          <span class="wiz-label">Wie dürfen wir beraten?</span>
          <div class="wiz-radio-col">
            <label><input type="radio" name="wiz-ber-kanal" value="telefon" ${data.beratungKanal === "telefon" ? "checked" : ""}/> Telefonisch</label>
            <label><input type="radio" name="wiz-ber-kanal" value="video" ${data.beratungKanal === "video" ? "checked" : ""}/> Per Videocall</label>
            <label><input type="radio" name="wiz-ber-kanal" value="vor_ort" ${data.beratungKanal === "vor_ort" ? "checked" : ""}/> In den Geschäftsräumen</label>
          </div>
        </div>`;
    } else if (meta.key === "n1") {
      html = `
        <div class="wiz-field">
          <label for="wiz-note">Haben Sie eine Anmerkung zu Ihrer Bestellung?</label>
          <textarea id="wiz-note" rows="4" maxlength="2000" placeholder="Optional">${escHtml(data.orderNote)}</textarea>
        </div>`;
    } else if (meta.key === "l1") {
      html = `
        <div class="wiz-check-row">
          <label class="wiz-check">
            <input type="checkbox" id="wiz-agb" ${data.agbAccepted ? "checked" : ""} />
            <span>Ich habe die <a href="/impressum" target="_blank" rel="noopener noreferrer" class="inline-link">AGB</a> zur Kenntnis genommen und akzeptiere sie. *</span>
          </label>
        </div>
        <div class="wiz-check-row">
          <label class="wiz-check">
            <input type="checkbox" id="wiz-privacy" ${data.privacyAccepted ? "checked" : ""} />
            <span>Ich habe die <a href="/datenschutz" target="_blank" rel="noopener noreferrer" class="inline-link">Datenschutzerklärung</a> zur Kenntnis genommen. *</span>
          </label>
        </div>`;
    } else if (meta.key === "r1") {
      html = `
        <p class="wiz-hint">Wurden wir von einer Person empfohlen? Optional.</p>
        <div class="wiz-field">
          <label for="wiz-partner">Partner-Code</label>
          <input type="text" id="wiz-partner" maxlength="40" autocomplete="off" placeholder="Optional z.B. MM1234" value="${escapeAttr(data.partnerCode)}" />
          <p id="wiz-partner-msg" class="wiz-partner-msg" hidden></p>
        </div>`;
    } else if (meta.key === "s1") {
      html = `
        <p class="wiz-hint">Unterschreiben Sie mit Maus, Touch oder Stift im Kasten.</p>
        <div class="wiz-sig-wrap">
          <canvas id="wiz-signature" width="400" height="160" class="wiz-signature-canvas"></canvas>
        </div>
        <button type="button" class="admin-btn wiz-sig-clear" id="wiz-sig-clear">Unterschrift löschen</button>`;
    }

    body.innerHTML = html;
    if (meta.key === "p2") {
      wireBirthSelects();
    }
    if (meta.key === "v1") {
      buildKkDatalist();
      wirePrivatToggle();
    }
    if (meta.key === "b1") {
      wireBeratungToggles();
    }
    if (meta.key === "r1") {
      wirePartnerField();
    }
    if (meta.key === "s1") {
      initSignature();
    }
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function escHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function wireBirthSelects() {
    const ys = $("wiz-birth-y");
    const ms = $("wiz-birth-m");
    const ds = $("wiz-birth-d");
    if (!ys || !ms || !ds) return;
    function rebuildDays() {
      const y = ys.value;
      const mo = ms.value;
      const cur = ds.value;
      if (!y || !mo) {
        ds.innerHTML = "<option value=\"\">—</option>";
        return;
      }
      const dim = daysInMonth(y, mo);
      let s = "<option value=\"\">—</option>";
      for (let day = 1; day <= dim; day++) {
        const v = pad2(day);
        s += "<option value=\"" + v + "\"" + (v === cur ? " selected" : "") + ">" + day + ".</option>";
      }
      ds.innerHTML = s;
    }
    ys.addEventListener("change", rebuildDays);
    ms.addEventListener("change", rebuildDays);
  }

  function wirePrivatToggle() {
    const block = $("wiz-gkv-block");
    const beihBlock = $("wiz-beihilfe-block");
    const ja = $("wiz-privat-ja");
    const nein = $("wiz-privat-nein");
    if (!ja) return;
    function sync() {
      const isPriv = ja.checked === true;
      if (block) block.hidden = isPriv;
      if (beihBlock) beihBlock.hidden = !isPriv;
      if (!isPriv) {
        const rNein = $("wiz-beihilfe-nein");
        const rJa = $("wiz-beihilfe-ja");
        if (rNein) rNein.checked = true;
        if (rJa) rJa.checked = false;
      }
    }
    ja.addEventListener("change", sync);
    nein?.addEventListener("change", sync);
    sync();
  }

  function wireBeratungToggles() {
    const nein = $("wiz-ber-nein");
    const ja = $("wiz-ber-ja");
    const bn = $("wiz-ber-block-nein");
    const bj = $("wiz-ber-block-ja");
    function sync() {
      const w = ja && ja.checked;
      if (bn) bn.style.display = w ? "none" : "block";
      if (bj) bj.style.display = w ? "block" : "none";
    }
    nein?.addEventListener("change", sync);
    ja?.addEventListener("change", sync);
  }

  function wirePartnerField() {
    const inp = $("wiz-partner");
    const msg = $("wiz-partner-msg");
    if (!inp) return;
    inp.onfocus = () => {
      inp.placeholder = "";
    };
    inp.onblur = async () => {
      const v = inp.value.trim();
      data.partnerCode = v;
      if (msg) msg.hidden = true;
      await lookupPartnerCode();
      if (msg && v && data.partnerLookupOk === false) {
        msg.textContent = "Partner konnte nicht zugeteilt werden.";
        msg.hidden = false;
      }
    };
  }

  function initSignature() {
    sigCanvas = $("wiz-signature");
    if (!sigCanvas || !sigCanvas.getContext) return;
    sigCtx = sigCanvas.getContext("2d");
    sigHadStroke = false;
    sigCtx.fillStyle = "#fff";
    sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
    sigCtx.strokeStyle = "#0f172a";
    sigCtx.lineWidth = 2;
    sigCtx.lineCap = "round";

    function pos(e) {
      const r = sigCanvas.getBoundingClientRect();
      const scaleX = sigCanvas.width / r.width;
      const scaleY = sigCanvas.height / r.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: (clientX - r.left) * scaleX, y: (clientY - r.top) * scaleY };
    }

    function start(e) {
      e.preventDefault();
      sigDrawing = true;
      const p = pos(e);
      sigCtx.beginPath();
      sigCtx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!sigDrawing) return;
      e.preventDefault();
      const p = pos(e);
      sigCtx.lineTo(p.x, p.y);
      sigCtx.stroke();
      sigHadStroke = true;
    }
    function end(e) {
      e.preventDefault();
      sigDrawing = false;
    }

    sigCanvas.addEventListener("mousedown", start);
    sigCanvas.addEventListener("mousemove", move);
    sigCanvas.addEventListener("mouseup", end);
    sigCanvas.addEventListener("mouseleave", end);
    sigCanvas.addEventListener("touchstart", start, { passive: false });
    sigCanvas.addEventListener("touchmove", move, { passive: false });
    sigCanvas.addEventListener("touchend", end);

    $("wiz-sig-clear")?.addEventListener("click", () => {
      sigCtx.fillStyle = "#fff";
      sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
      sigHadStroke = false;
    });
  }

  async function goNext() {
    syncFromDom();
    const meta = STEPS[stepIndex];
    if (meta.key === "r1") {
      await lookupPartnerCode();
      const c = data.partnerCode.trim();
      if (c && data.partnerLookupOk === false) {
        showError("Partner konnte nicht zugeteilt werden.");
        const m = $("wiz-partner-msg");
        if (m) {
          m.textContent = "Partner konnte nicht zugeteilt werden.";
          m.hidden = false;
        }
        return;
      }
    }
    const err = validateCurrentStep();
    if (err) {
      showError(err);
      return;
    }
    if (meta.key === "s1") {
      void submitOrder();
      return;
    }
    stepIndex += 1;
    render();
    triggerBoxiHop();
  }

  function goBack() {
    if (stepIndex === 0) {
      close();
      window.dispatchEvent(new CustomEvent("pflegebox-wizard-cancel"));
      return;
    }
    syncFromDom();
    stepIndex -= 1;
    render();
  }

  async function submitOrder() {
    if (!sigCanvas) return;
    syncFromDom();
    const err = validateCurrentStep();
    if (err) {
      showError(err);
      return;
    }
    const signatureDataUrl = sigCanvas.toDataURL("image/png");
    const nextBtn = $("pflege-wizard-next");
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = "Wird gesendet…";
    }
    showError("");

    const storedRef = typeof config.getPartnerRef === "function" ? config.getPartnerRef().trim() : "";
    const code = data.partnerCode.trim();
    const partnerRef = code || storedRef;

    const contact = {
      salutation: data.salutation,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      street: data.street.trim(),
      postalCode: data.postalCode.trim(),
      city: data.city.trim(),
      birthDate: data.birthDate,
      privatversichert: data.privatversichert,
      versichertennummer: data.privatversichert ? "" : data.versichertennummer.trim().toUpperCase(),
      krankenkasse: data.privatversichert ? "Privatversichert" : data.krankenkasse.trim(),
      pflegegrad: data.pflegegrad,
      beihilfeberechtigt: data.privatversichert ? data.beihilfeberechtigt : false,
      personalBeratungWunsch: data.personalBeratungWunsch,
    };
    if (data.personalBeratungWunsch) {
      contact.beratungKanal = data.beratungKanal;
    } else {
      contact.keinBeratungGrund = data.keinBeratungGrund.trim();
    }
    const note = data.orderNote.trim();
    if (note) contact.orderNote = note;

    const payload = {
      cartLines: config.getCartLines(),
      totalBudgetUsed: config.getTotal(),
      partnerRef,
      contact,
      website: "",
      agbAccepted: true,
      privacyAccepted: true,
      signatureDataUrl,
    };

    try {
      const res = await fetch("/api/pflegebox-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) {
        let msg =
          "Die Übermittlung ist fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben oder versuchen Sie es später erneut.";
        if (res.status === 429) msg = "Zu viele Anfragen. Bitte warten Sie einen Moment.";
        if (res.status === 503 || j.error === "not_configured") {
          msg = "Der Speicherdienst ist noch nicht eingerichtet. Bitte kontaktieren Sie uns telefonisch.";
        }
        if (res.status === 400 && j.error === "invalid_partner_code") {
          msg = "Partner konnte nicht zugeteilt werden.";
        }
        showError(msg);
        return;
      }
      close();
      window.dispatchEvent(
        new CustomEvent("pflegebox-wizard-success", {
          detail: { reference: j.reference || null },
        }),
      );
    } catch {
      showError("Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.");
    } finally {
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = "Bestellung absenden";
      }
    }
  }

  function open(cfg) {
    config = cfg;
    stepIndex = 0;
    Object.assign(data, {
      salutation: "herr",
      firstName: "",
      lastName: "",
      street: "",
      postalCode: "",
      city: "",
      birthDate: "",
      versichertennummer: "",
      krankenkasse: "",
      pflegegrad: 1,
      beihilfeberechtigt: false,
      personalBeratungWunsch: false,
      keinBeratungGrund: "",
      beratungKanal: "",
      orderNote: "",
      agbAccepted: false,
      privacyAccepted: false,
      partnerCode: "",
      partnerLookupOk: null,
      privatversichert: false,
    });
    const bd = $("pflegebox-wizard-backdrop");
    if (bd) bd.hidden = false;
    showError("");
    render();
    void loadKrankenkassen().then(() => {
      if (STEPS[stepIndex] && STEPS[stepIndex].key === "v1") render();
    });
    document.body.classList.add("pflege-wizard-open");
    document.addEventListener("keydown", onDocKeydown);
  }

  function hideCancelConfirm() {
    const layer = $("pflege-wizard-cancel-layer");
    const modal = document.querySelector("#pflegebox-wizard-backdrop .pflege-wizard-modal");
    if (layer) layer.hidden = true;
    if (modal) modal.removeAttribute("inert");
  }

  function showCancelConfirm() {
    const layer = $("pflege-wizard-cancel-layer");
    const modal = document.querySelector("#pflegebox-wizard-backdrop .pflege-wizard-modal");
    if (!layer) {
      if (window.confirm("Möchten Sie den Vorgang wirklich abbrechen?")) {
        confirmAbortWizard();
      }
      return;
    }
    layer.hidden = false;
    if (modal) modal.setAttribute("inert", "");
    requestAnimationFrame(() => {
      $("pflege-wizard-cancel-no")?.focus();
    });
  }

  function confirmAbortWizard() {
    hideCancelConfirm();
    close();
    window.dispatchEvent(new CustomEvent("pflegebox-wizard-cancel"));
  }

  function onDocKeydown(e) {
    const bd = $("pflegebox-wizard-backdrop");
    if (!bd || bd.hidden) return;
    if (e.key !== "Escape") return;
    const layer = $("pflege-wizard-cancel-layer");
    if (layer && !layer.hidden) {
      e.preventDefault();
      hideCancelConfirm();
      $("pflege-wizard-close")?.focus();
      return;
    }
    e.preventDefault();
    showCancelConfirm();
  }

  function close() {
    document.removeEventListener("keydown", onDocKeydown);
    hideCancelConfirm();
    const bd = $("pflegebox-wizard-backdrop");
    if (bd) bd.hidden = true;
    document.body.classList.remove("pflege-wizard-open");
    config = null;
  }

  /** Schließen-Button (X): Abbruch-Dialog im Layout der Seite. */
  function requestCloseWizard() {
    showCancelConfirm();
  }

  function wireCancelDialog() {
    const layer = $("pflege-wizard-cancel-layer");
    $("pflege-wizard-cancel-yes")?.addEventListener("click", confirmAbortWizard);
    $("pflege-wizard-cancel-no")?.addEventListener("click", () => {
      hideCancelConfirm();
      $("pflege-wizard-close")?.focus();
    });
    layer?.addEventListener("click", (e) => {
      if (e.target === layer) {
        hideCancelConfirm();
        $("pflege-wizard-close")?.focus();
      }
    });
  }

  function wireNav() {
    $("pflege-wizard-next")?.addEventListener("click", () => void goNext());
    $("pflege-wizard-back")?.addEventListener("click", goBack);
    $("pflege-wizard-close")?.addEventListener("click", requestCloseWizard);
    wireCancelDialog();
  }

  document.addEventListener("DOMContentLoaded", wireNav);

  window.PflegeboxWizard = { open, close };
})();
