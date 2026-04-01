const MAX_BUDGET = 42;

/** Internes Artikel-Tool (Admin-Panel): ausgeschaltet und unsichtbar. */
const ARTICLE_ADMIN_TOOL_ENABLED = false;

/** Lesbare Anzeigenamen (Unterstriche → Leerzeichen); API/Korb behalten `item.name`. */
function formatProductDisplayName(name) {
  return String(name || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Im Repo gepflegte Artikel (feste IDs; 9106 entfällt); Reihenfolge = Darstellung im Konfigurator. */
const BUNDLED_CATALOG_ITEMS = [
  {
    id: 9102,
    name: "Flächendesinfektionstücher",
    pieces: "150",
    quantity: null,
    ml: null,
    price: 17.85,
    imageUrl: "images/Flächendesinfektionstücher.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9109,
    name: "Einmalhandschuhe",
    pieces: "100",
    quantity: null,
    ml: null,
    price: 9.52,
    imageUrl: "images/Einmalhandschuhe.webp",
    sizes: [],
    isGlove: true,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9111,
    name: "Flächendesinfektionsmittel",
    pieces: null,
    quantity: null,
    ml: null,
    price: 3.39,
    imageUrl: "images/Flächendesinfektionsmittel.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: [
      { ml: 250, price: 3.39 },
      { ml: 500, price: 6.78 },
      { ml: 1000, price: 13.57 },
    ],
  },
  {
    id: 9112,
    name: "Händedesinfektionsmittel",
    pieces: null,
    quantity: null,
    ml: null,
    price: 1.43,
    imageUrl: "images/Händedesinfektionsmittel.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: [
      { ml: 100, price: 1.43 },
      { ml: 500, price: 7.14 },
      { ml: 1000, price: 14.28 },
    ],
  },
  {
    id: 9104,
    name: "FFP2 Masken",
    pieces: "20",
    quantity: null,
    ml: null,
    price: 15.47,
    imageUrl: "images/FFP2 Masken.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9113,
    name: "Händedesinfektionstücher",
    pieces: "50",
    quantity: null,
    ml: null,
    price: 5.95,
    imageUrl: "images/Händedesinfektionstücher.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9101,
    name: "Mundschutz",
    pieces: "50",
    quantity: null,
    ml: null,
    price: 8.33,
    imageUrl: "images/Mundschutz.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9110,
    name: "Fingerling",
    pieces: "100",
    quantity: null,
    ml: null,
    price: 5.95,
    imageUrl: "images/Fingerling.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9103,
    name: "Schutzschürze_wiederverwendbar",
    pieces: "1",
    quantity: null,
    ml: null,
    price: 25.59,
    imageUrl: "images/Schutzschürtze_wiederverwendbar.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9107,
    name: "Einmallätzchen",
    pieces: "100",
    quantity: null,
    ml: null,
    price: 14.28,
    imageUrl: "images/Einmallätzchen.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9105,
    name: "Bettschutzeinlagen",
    pieces: "25",
    quantity: null,
    ml: null,
    price: 12.2,
    imageUrl: "images/Bettschutzeinlagen.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: false,
    mlVariants: null,
  },
  {
    id: 9108,
    name: "Wiederverwendbare Bettschutzeinlage",
    pieces: null,
    quantity: null,
    ml: null,
    price: 0,
    imageUrl: "images/Bettschutzeinlage_wiederverwendbar.webp",
    sizes: [],
    isGlove: false,
    bettschutzeinlage: true,
    mlVariants: null,
    description:
      "Sie erhalten pro Jahr zusätzlich bis zu 4 wiederverwendbare Bettschutzeinlagen. Diese werden nicht auf die 42 € der Pflegebox angerechnet.",
  },
];

/** Nur diese IDs sind erlaubt; alles andere wird aus Speicher und Warenkorb entfernt. */
const BUNDLED_CATALOG_IDS = new Set(BUNDLED_CATALOG_ITEMS.map((b) => Number(b.id)));

/** Partner-Referrer aus URL (?ref=PARTNER_ID oder ?partner=PARTNER_ID) – für Belohnung/Flyer */
const PARTNER_REF_STORAGE_KEY = "konfigurator_partner_ref";

let ITEMS = [];
let cart = [];

let editingItemId = null;

let pendingGloveItemId = null;
let pendingGloveSize = null;
let pendingGloveMaterial = null;

let pendingMlItemId = null;
let pendingMlChoiceMl = null;

/** Voreinstellung im Bettschutz-Hinweis-Modal (1–4). */
let bettschutzHintQty = 4;

let boxIconElement = null;
let boxIconBadgeElement = null;

function triggerBoxIconWiggle() {
  if (!boxIconElement) return;
  boxIconElement.classList.remove("wiggle");
  void boxIconElement.offsetWidth;
  boxIconElement.classList.add("wiggle");
}

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

function calculateCartTotal() {
  return cart.reduce((sum, entry) => {
    if (entry.bettschutzeinlage) return sum;
    return sum + (entry.price || 0);
  }, 0);
}

function saveItemsToStorage() {
  try {
    window.localStorage.setItem("konfigurator_items", JSON.stringify(ITEMS));
  } catch (_) {}
}

function loadItemsFromStorage() {
  try {
    const raw = window.localStorage.getItem("konfigurator_items");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      ITEMS = parsed;
    }
  } catch (_) {}
}

/** Ersetzt die Artikelliste vollständig durch das Bundle (keine zusätzlichen Admin-/Alt-Artikel). */
function mergeBundledCatalogItems() {
  ITEMS = BUNDLED_CATALOG_ITEMS.map((b) => ({ ...b }));
  saveItemsToStorage();
}

/** Entfernt Warenkorb-Zeilen zu Artikeln, die nicht mehr im Bundle existieren. */
function pruneCartToBundledCatalog() {
  const before = cart.length;
  cart = cart.filter((entry) => BUNDLED_CATALOG_IDS.has(Number(entry.id)));
  if (cart.length !== before) saveCartToStorage();
}

function saveCartToStorage() {
  try {
    window.localStorage.setItem("konfigurator_cart", JSON.stringify(cart));
  } catch (_) {}
}

function loadCartFromStorage() {
  try {
    const raw = window.localStorage.getItem("konfigurator_cart");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cart = parsed;
    }
  } catch (_) {}
}

function updateBudgetDisplay() {
  const total = calculateCartTotal();
  const percent = Math.min(100, Math.round((total / MAX_BUDGET) * 100));

  const bar = document.getElementById("budget-progress-fill");
  const label = document.getElementById("budget-percent");
  const barMobile = document.getElementById("budget-progress-fill-mobile");
  const labelMobile = document.getElementById("budget-percent-mobile");

  if (bar) bar.style.width = `${percent}%`;
  if (label) label.textContent = `${percent} %`;
  if (barMobile) barMobile.style.width = `${percent}%`;
  if (labelMobile) labelMobile.textContent = `${percent} %`;

  const remaining = MAX_BUDGET - total;
  updateItemAvailability(remaining);
  updateBoxIconBadge();

  const btnNextStep = document.getElementById("btn-next-step");
  if (btnNextStep) {
    const hasItems = cart.length > 0;
    btnNextStep.hidden = !hasItems;
    btnNextStep.disabled = !hasItems;
    btnNextStep.title = hasItems
      ? ""
      : "Bitte wählen Sie mindestens einen Artikel für Ihre Pflegebox.";
    const boxPanel = btnNextStep.closest(".panel");
    if (boxPanel) {
      boxPanel.classList.toggle("panel--next-step-visible", hasItems);
    }
  }
}

function updateBoxIconBadge() {
  if (!boxIconBadgeElement) return;
  const count = cart.length;
  if (count <= 0) {
    boxIconBadgeElement.style.visibility = "hidden";
  } else {
    boxIconBadgeElement.style.visibility = "visible";
    boxIconBadgeElement.textContent = String(count);
  }
}

function renderItemList() {
  const container = document.getElementById("item-list");
  if (!container) return;
  container.innerHTML = "";

  const displayItems = [
    ...ITEMS.filter((item) => !item.bettschutzeinlage),
    ...ITEMS.filter((item) => item.bettschutzeinlage),
  ];

  displayItems.forEach((item) => {
    const hasSizes = Array.isArray(item.sizes) && item.sizes.length > 0;

    const element = document.createElement("div");
    element.className = "item" + (item.bettschutzeinlage ? " item--double-width" : "");
    element.dataset.itemId = String(item.id);

    const inner = document.createElement("div");
    inner.className = "item-inner";
    element.appendChild(inner);

    const contentWrap = document.createElement("div");
    contentWrap.className = "item-inner-content";
    inner.appendChild(contentWrap);

    const countInCart = cart.filter((c) => c.id === item.id).length;

    if (item.imageUrl) {
      const frame = document.createElement("div");
      frame.className = "item-image-frame";
      const img = document.createElement("img");
      img.className = "item-image";
      img.src = item.imageUrl;
      img.alt = formatProductDisplayName(item.name);
      frame.appendChild(img);
      contentWrap.appendChild(frame);
    }

    const header = document.createElement("div");
    header.className = "item-header";
    const nameSpan = document.createElement("span");
    nameSpan.className = "item-name";
    nameSpan.textContent = formatProductDisplayName(item.name);
    header.appendChild(nameSpan);
    contentWrap.appendChild(header);

    if (hasMlVariants(item)) {
      const metaMl = document.createElement("div");
      metaMl.className = "item-meta-row";
      metaMl.textContent = `Gebinde: ${item.mlVariants.map((v) => `${v.ml} ml`).join(", ")}`;
      contentWrap.appendChild(metaMl);
    } else if (item.pieces || item.quantity || item.ml) {
      const meta = document.createElement("div");
      meta.className = "item-meta-row";
      const parts = [];
      if (item.pieces) parts.push(`Stück: ${item.pieces}`);
      if (item.quantity) parts.push(`Menge: ${item.quantity}`);
      if (item.ml) parts.push(`ml: ${item.ml}`);
      meta.textContent = parts.join(" · ");
      contentWrap.appendChild(meta);
    }

    if (item.description) {
      const desc = document.createElement("p");
      desc.className = "item-description";
      desc.textContent = item.description;
      contentWrap.appendChild(desc);
    }

    let sizeSelect = null;
    if (hasSizes) {
      sizeSelect = document.createElement("select");
      sizeSelect.className = "item-size-select";
      item.sizes.forEach((size) => {
        const opt = document.createElement("option");
        opt.value = size;
        opt.textContent = size;
        sizeSelect.appendChild(opt);
      });
      contentWrap.appendChild(sizeSelect);
    }

    const totalBefore = calculateCartTotal();
    const remainingBefore = MAX_BUDGET - totalBefore;
    const canAddOneMore = item.bettschutzeinlage
      ? countInCart < MAX_BETTSCHUTZEINLAGE
      : hasMlVariants(item)
        ? canAffordAnyMlVariant(item, remainingBefore)
        : (item.price || 0) <= remainingBefore;

    const footer = document.createElement("div");
    footer.className = "item-qty-row";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "item-qty-btn item-qty-btn--minus";
    minusBtn.textContent = "−";
    minusBtn.setAttribute("aria-label", "Menge verringern");

    const qtyValue = document.createElement("span");
    qtyValue.className = "item-qty-value";
    qtyValue.textContent = String(countInCart);

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "item-qty-btn item-qty-btn--plus";
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", "Menge erhöhen");

    if (!canAddOneMore) {
      plusBtn.disabled = true;
      plusBtn.classList.add("item-qty-btn--disabled");
    }

    minusBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (minusBtn.disabled) return;
      const selectedSize = sizeSelect ? sizeSelect.value : null;
      decrementItemInCart(item.id, selectedSize);
    });

    plusBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const selectedSize = sizeSelect ? sizeSelect.value : null;
      handleAddFromList(item.id, selectedSize);
    });

    if (countInCart === 0) {
      minusBtn.disabled = true;
      minusBtn.classList.add("item-qty-btn--disabled");
      minusBtn.setAttribute("aria-label", "Menge verringern (aktuell nicht im Warenkorb)");
    }
    footer.appendChild(minusBtn);
    footer.appendChild(qtyValue);
    footer.appendChild(plusBtn);
    inner.appendChild(footer);

    element.addEventListener("click", () => {
      const selectedSize = sizeSelect ? sizeSelect.value : null;
      handleAddFromList(item.id, selectedSize);
    });

    container.appendChild(element);
  });

  const initialRemaining = MAX_BUDGET - calculateCartTotal();
  updateItemAvailability(initialRemaining);
}

const MAX_BETTSCHUTZEINLAGE = 4;

function hasMlVariants(item) {
  return Array.isArray(item?.mlVariants) && item.mlVariants.length > 0;
}

function canAffordAnyMlVariant(item, remainingBudget) {
  if (!hasMlVariants(item)) return false;
  return item.mlVariants.some((v) => v.price <= remainingBudget);
}

function countBettschutzeinlageInCart() {
  return cart.filter((c) => c.bettschutzeinlage).length;
}

/** Fügt n wiederverwendbare Bettschutzeinlagen hinzu (max. MAX_BETTSCHUTZEINLAGE gesamt). */
function addBettschutzeinlagenCount(n) {
  const bettItem = ITEMS.find((i) => i.bettschutzeinlage);
  if (!bettItem) return;
  let want = Math.max(0, Math.min(MAX_BETTSCHUTZEINLAGE, Math.floor(Number(n) || 0)));
  while (want > 0 && countBettschutzeinlageInCart() < MAX_BETTSCHUTZEINLAGE) {
    const cartEntry = { ...bettItem, selectedSize: null, material: null, price: 0 };
    delete cartEntry.mlVariants;
    cart.push(cartEntry);
    want -= 1;
  }
  renderCart();
  updateBudgetDisplay();
  triggerBoxIconWiggle();
  saveCartToStorage();
}

function tryAddToCart(itemId, selectedSize = null, material = null) {
  const item = ITEMS.find((it) => it.id === itemId);
  if (!item) return;

  if (item.bettschutzeinlage) {
    const count = cart.filter((c) => c.id === itemId).length;
    if (count >= MAX_BETTSCHUTZEINLAGE) return;
    const cartEntry = { ...item, selectedSize, material, price: 0 };
    delete cartEntry.mlVariants;
    cart.push(cartEntry);
  } else {
    const totalBefore = calculateCartTotal();
    const remainingBefore = MAX_BUDGET - totalBefore;
    let unitPrice = item.price || 0;
    let mlVal = item.ml != null ? item.ml : null;
    let sizeForLine = selectedSize;

    if (hasMlVariants(item)) {
      let mlNum = Number(selectedSize);
      if (!Number.isFinite(mlNum)) {
        const m = /^(\d+)\s*ml$/i.exec(String(selectedSize || "").trim());
        mlNum = m ? Number(m[1]) : NaN;
      }
      const v = item.mlVariants.find((x) => x.ml === mlNum);
      if (!v) return;
      unitPrice = v.price;
      mlVal = v.ml;
      sizeForLine = `${v.ml} ml`;
    }

    if (unitPrice > remainingBefore) return;
    const cartEntry = { ...item, selectedSize: sizeForLine, material, price: unitPrice, ml: mlVal };
    delete cartEntry.mlVariants;
    cart.push(cartEntry);
  }
  renderCart();
  updateBudgetDisplay();
  triggerBoxIconWiggle();
  saveCartToStorage();
}

function decrementItemInCart(itemId, selectedSize = null) {
  let index = -1;
  if (selectedSize != null && selectedSize !== "") {
    index = cart.findIndex(
      (entry) => entry.id === itemId && (entry.selectedSize || null) === selectedSize
    );
  } else {
    for (let i = cart.length - 1; i >= 0; i--) {
      if (cart[i].id === itemId) {
        index = i;
        break;
      }
    }
  }
  if (index === -1) return;
  cart.splice(index, 1);
  renderCart();
  updateBudgetDisplay();
  renderItemList();
  saveCartToStorage();
}

function incrementCartItem(itemId, selectedSize = null) {
  tryAddToCart(itemId, selectedSize);
  renderItemList();
}

function handleAddFromList(itemId, selectedSize = null) {
  const item = ITEMS.find((it) => it.id === itemId);
  if (!item) return;

  if (item.isGlove) {
    openGloveModal(itemId);
    return;
  }
  if (hasMlVariants(item)) {
    openMlModal(itemId);
    return;
  }

  incrementCartItem(itemId, selectedSize);
}

function updateGloveConfirmButton() {
  const btn = document.getElementById("glove-confirm");
  if (btn) btn.disabled = !pendingGloveSize;
}

function closeGloveModal() {
  const modal = document.getElementById("glove-modal");
  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  pendingGloveItemId = null;
  pendingGloveSize = null;
  pendingGloveMaterial = null;
  updateGloveConfirmButton();
}

function updateMlConfirmButton() {
  const btn = document.getElementById("ml-variant-confirm");
  if (btn) btn.disabled = pendingMlChoiceMl == null;
}

function closeMlModal() {
  const modal = document.getElementById("ml-variant-modal");
  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  pendingMlItemId = null;
  pendingMlChoiceMl = null;
  updateMlConfirmButton();
}

function openMlModal(itemId) {
  const modal = document.getElementById("ml-variant-modal");
  const wrap = document.getElementById("ml-variant-buttons");
  if (!modal || !wrap) return;
  const item = ITEMS.find((it) => it.id === itemId);
  if (!item || !hasMlVariants(item)) return;

  pendingMlItemId = itemId;
  pendingMlChoiceMl = null;

  const remaining = MAX_BUDGET - calculateCartTotal();
  wrap.innerHTML = "";
  item.mlVariants.forEach((v) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "handschuh-size-btn ml-variant-btn";
    btn.dataset.ml = String(v.ml);
    btn.setAttribute("aria-label", `${v.ml} Milliliter`);
    const stack = document.createElement("span");
    stack.className = "ml-variant-btn-stack";
    const num = document.createElement("span");
    num.className = "ml-variant-num";
    num.textContent = String(v.ml);
    const unit = document.createElement("span");
    unit.className = "ml-variant-unit";
    unit.textContent = "ml";
    stack.appendChild(num);
    stack.appendChild(unit);
    btn.appendChild(stack);
    const affordable = v.price <= remaining;
    btn.disabled = !affordable;
    if (!affordable) btn.classList.add("handschuh-size-btn--disabled");
    btn.addEventListener("click", () => {
      wrap.querySelectorAll("button").forEach((b) => b.classList.remove("is-selected"));
      if (btn.disabled) return;
      btn.classList.add("is-selected");
      pendingMlChoiceMl = v.ml;
      updateMlConfirmButton();
    });
    wrap.appendChild(btn);
  });

  updateMlConfirmButton();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    modal.querySelector(".handschuh-dialog")?.focus();
  });
}

function openGloveModal(itemId) {
  const modal = document.getElementById("glove-modal");
  if (!modal) return;
  pendingGloveItemId = itemId;
  pendingGloveSize = null;

  document.querySelectorAll("#glove-size-buttons button").forEach((btn) => {
    btn.classList.remove("is-selected");
  });

  updateGloveConfirmButton();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    modal.querySelector(".handschuh-dialog")?.focus();
  });
}

function renderCart() {
  const cartContainer = document.getElementById("cart");
  if (!cartContainer) return;
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent = "Noch keine Artikel ausgewählt.";
    cartContainer.appendChild(empty);
    return;
  }

  const groups = new Map();
  cart.forEach((entry) => {
    const key = `${entry.id}|${entry.selectedSize || ""}|${entry.material || ""}`;
    if (!groups.has(key)) {
      groups.set(key, { item: entry, count: 0 });
    }
    groups.get(key).count += 1;
  });

  groups.forEach(({ item, count }) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    if (item.imageUrl) {
      const frame = document.createElement("div");
      frame.className = "cart-item-image-frame";
      const img = document.createElement("img");
      img.className = "cart-item-image";
      img.src = item.imageUrl;
      img.alt = formatProductDisplayName(item.name);
      frame.appendChild(img);
      row.appendChild(frame);
    }

    const main = document.createElement("div");
    main.className = "cart-item-main";
    const name = document.createElement("div");
    name.className = "cart-item-name";
    name.textContent = formatProductDisplayName(item.name);
    main.appendChild(name);

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    const parts = [];
    if (item.pieces) parts.push(item.pieces);
    if (item.quantity) parts.push(item.quantity);
    if (item.ml) parts.push(`${item.ml} ml`);
    if (item.selectedSize) parts.push(`Größe: ${item.selectedSize}`);
    if (item.material) parts.push(`Material: ${item.material}`);
    meta.textContent = parts.join(" · ");
    main.appendChild(meta);

    row.appendChild(main);

    const right = document.createElement("div");
    right.className = "cart-qty-row";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "item-qty-btn item-qty-btn--minus";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Menge verringern");

    const qty = document.createElement("span");
    qty.className = "cart-qty-value";
    qty.textContent = String(count);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "item-qty-btn item-qty-btn--plus";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Menge erhöhen");
    if (item.bettschutzeinlage && count >= MAX_BETTSCHUTZEINLAGE) {
      plus.disabled = true;
      plus.classList.add("item-qty-btn--disabled");
    }

    minus.addEventListener("click", () => {
      decrementItemInCart(item.id, item.selectedSize || null);
    });

    plus.addEventListener("click", () => {
      incrementCartItem(item.id, item.selectedSize || null);
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "cart-item-remove";
    removeBtn.textContent = "🗑";
    removeBtn.addEventListener("click", () => {
      const key = `${item.id}|${item.selectedSize || ""}|${item.material || ""}`;
      cart = cart.filter((entry) => {
        const k = `${entry.id}|${entry.selectedSize || ""}|${entry.material || ""}`;
        return k !== key;
      });
      renderCart();
      updateBudgetDisplay();
      saveCartToStorage();
    });

    right.appendChild(minus);
    right.appendChild(qty);
    right.appendChild(plus);
    right.appendChild(removeBtn);
    row.appendChild(right);

    cartContainer.appendChild(row);
  });
}

function updateItemAvailability(remainingBudget) {
  const container = document.getElementById("item-list");
  if (!container) return;
  const itemElements = container.querySelectorAll(".item");
  const limitMessage = document.getElementById("item-limit-message");

  let canAddAny = false;

  itemElements.forEach((el) => {
    const itemId = Number(el.dataset.itemId);
    const item = ITEMS.find((it) => it.id === itemId);
    if (!item) return;

    const plusBtn = el.querySelector(".item-qty-btn--plus");
    const minusBtn = el.querySelector(".item-qty-btn--minus");
    if (!plusBtn) return;

    const countInCart = cart.filter((c) => c.id === itemId).length;
    if (minusBtn) {
      if (countInCart === 0) {
        minusBtn.disabled = true;
        minusBtn.classList.add("item-qty-btn--disabled");
        minusBtn.setAttribute("aria-label", "Menge verringern (aktuell nicht im Warenkorb)");
      } else {
        minusBtn.disabled = false;
        minusBtn.classList.remove("item-qty-btn--disabled");
        minusBtn.setAttribute("aria-label", "Menge verringern");
      }
    }

    if (item.bettschutzeinlage) {
      if (countInCart >= MAX_BETTSCHUTZEINLAGE) {
        plusBtn.disabled = true;
        plusBtn.classList.add("item-qty-btn--disabled");
        el.classList.add("item-unavailable");
        let label = el.querySelector(".item-unavailable-label");
        if (!label) {
          label = document.createElement("div");
          label.className = "item-unavailable-label";
          label.textContent = "Max. 4 Stück möglich";
          el.appendChild(label);
        }
      } else {
        plusBtn.disabled = false;
        plusBtn.classList.remove("item-qty-btn--disabled");
        el.classList.remove("item-unavailable");
        const label = el.querySelector(".item-unavailable-label");
        if (label) label.remove();
        canAddAny = true;
      }
      return;
    }

    const affordAnyVariant = hasMlVariants(item)
      ? canAffordAnyMlVariant(item, remainingBudget)
      : remainingBudget > 0 && (item.price || 0) <= remainingBudget;

    if (hasMlVariants(item)) {
      if (!affordAnyVariant && countInCart === 0) {
        plusBtn.disabled = true;
        plusBtn.classList.add("item-qty-btn--disabled");
        el.classList.add("item-unavailable");
        let label = el.querySelector(".item-unavailable-label");
        if (!label) {
          label = document.createElement("div");
          label.className = "item-unavailable-label";
          label.textContent = "Die Box wäre damit zu voll";
          el.appendChild(label);
        }
      } else if (!affordAnyVariant && countInCart > 0) {
        plusBtn.disabled = true;
        plusBtn.classList.add("item-qty-btn--disabled");
        el.classList.remove("item-unavailable");
        const label = el.querySelector(".item-unavailable-label");
        if (label) label.remove();
      } else {
        plusBtn.disabled = false;
        plusBtn.classList.remove("item-qty-btn--disabled");
        el.classList.remove("item-unavailable");
        const label = el.querySelector(".item-unavailable-label");
        if (label) label.remove();
        canAddAny = true;
      }
      return;
    }

    if (!affordAnyVariant) {
      plusBtn.disabled = true;
      plusBtn.classList.add("item-qty-btn--disabled");
      el.classList.add("item-unavailable");
      let label = el.querySelector(".item-unavailable-label");
      if (!label) {
        label = document.createElement("div");
        label.className = "item-unavailable-label";
        label.textContent = "Die Box wäre damit zu voll";
        el.appendChild(label);
      }
    } else {
      plusBtn.disabled = false;
      plusBtn.classList.remove("item-qty-btn--disabled");
      el.classList.remove("item-unavailable");
      const label = el.querySelector(".item-unavailable-label");
      if (label) {
        label.remove();
      }
      canAddAny = true;
    }
  });

  if (limitMessage) {
    if (!canAddAny && ITEMS.length > 0) {
      limitMessage.style.display = "block";
    } else {
      limitMessage.style.display = "none";
    }
  }
}

function initAdminTool() {
  if (!ARTICLE_ADMIN_TOOL_ENABLED) return;
  const form = document.getElementById("admin-item-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("admin-item-name");
    const piecesInput = document.getElementById("admin-item-pieces");
    const quantityInput = document.getElementById("admin-item-quantity");
    const mlInput = document.getElementById("admin-item-ml");
    const priceInput = document.getElementById("admin-item-price");
    const imageInput = document.getElementById("admin-item-image");
    const sizeCheckboxes = document.querySelectorAll(
      'input[name="admin-item-size"]:checked'
    );
    const gloveCheckbox = document.getElementById("admin-item-glove");
    const bettschutzeinlageCheckbox = document.getElementById("admin-item-bettschutzeinlage");

    const name = nameInput.value.trim();
    const pieces = piecesInput.value.trim() || null;
    const quantity = quantityInput.value.trim() || null;
    const mlRaw = mlInput.value.trim();
    const ml = mlRaw ? Number(mlRaw) : null;
    const priceRaw = priceInput.value.trim().replace(",", ".");
    const price = Number(priceRaw);
    const imageUrl = imageInput.value.trim() || null;

    const sizes = Array.from(sizeCheckboxes).map((el) => el.value);
    const isGlove = gloveCheckbox ? gloveCheckbox.checked : false;
    const bettschutzeinlage = bettschutzeinlageCheckbox ? bettschutzeinlageCheckbox.checked : false;
    const effectivePrice = bettschutzeinlage ? 0 : price;

    if (!name) return;
    if (!bettschutzeinlage && (!Number.isFinite(price) || price < 0)) return;

    if (editingItemId == null) {
      window.alert("Neue Artikel können nicht angelegt werden. Es gilt nur der feste Katalog mit 12 Produkten.");
      return;
    }

    const idx = ITEMS.findIndex((it) => it.id === editingItemId);
    if (idx !== -1) {
      ITEMS[idx] = {
        ...ITEMS[idx],
        name,
        pieces,
        quantity,
        ml,
        price: effectivePrice,
        imageUrl,
        sizes,
        isGlove,
        bettschutzeinlage,
      };
    }

    editingItemId = null;
    saveItemsToStorage();
    renderItemList();
    renderAdminItemList();
    form.reset();
  });

  renderAdminItemList();
}

function renderAdminItemList() {
  if (!ARTICLE_ADMIN_TOOL_ENABLED) return;
  const list = document.getElementById("admin-item-list");
  if (!list) return;
  list.innerHTML = "";

  if (ITEMS.length === 0) {
    const p = document.createElement("p");
    p.className = "panel-subtitle";
    p.textContent = "Noch keine Artikel angelegt.";
    list.appendChild(p);
    return;
  }

  ITEMS.forEach((item) => {
    const row = document.createElement("div");
    row.className = "admin-item-row";

    const main = document.createElement("div");
    main.className = "admin-item-main";
    const name = document.createElement("div");
    name.className = "admin-item-name";
    name.textContent = item.name;
    main.appendChild(name);
    const meta = document.createElement("div");
    meta.className = "admin-item-meta";
    const parts = [];
    if (item.price) parts.push(euroFormatter.format(item.price));
    if (item.pieces) parts.push(item.pieces);
    if (item.quantity) parts.push(item.quantity);
    if (item.ml) parts.push(`${item.ml} ml`);
    if (item.isGlove) parts.push("Handschuhe");
    if (item.bettschutzeinlage) parts.push("Bettschutzeinlage");
    meta.textContent = parts.join(" · ");
    main.appendChild(meta);
    row.appendChild(main);

    const actions = document.createElement("div");
    actions.className = "admin-item-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "admin-btn";
    editBtn.textContent = "Bearbeiten";
    editBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("admin-item-name");
      const piecesInput = document.getElementById("admin-item-pieces");
      const quantityInput = document.getElementById("admin-item-quantity");
      const mlInput = document.getElementById("admin-item-ml");
      const priceInput = document.getElementById("admin-item-price");
      const imageInput = document.getElementById("admin-item-image");
      const gloveCheckbox = document.getElementById("admin-item-glove");
      const bettschutzeinlageCheckbox = document.getElementById("admin-item-bettschutzeinlage");
      const sizeCheckboxes = document.querySelectorAll(
        'input[name="admin-item-size"]'
      );

      nameInput.value = item.name || "";
      piecesInput.value = item.pieces || "";
      quantityInput.value = item.quantity || "";
      mlInput.value = item.ml != null ? String(item.ml) : "";
      priceInput.value = item.price != null ? String(item.price).replace(".", ",") : "";
      imageInput.value = item.imageUrl || "";
      if (gloveCheckbox) gloveCheckbox.checked = !!item.isGlove;
      if (bettschutzeinlageCheckbox) bettschutzeinlageCheckbox.checked = !!item.bettschutzeinlage;
      sizeCheckboxes.forEach((el) => {
        el.checked = Array.isArray(item.sizes)
          ? item.sizes.includes(el.value)
          : false;
      });

      editingItemId = item.id;
    });
    actions.appendChild(editBtn);

    const idNum = Number(item.id);
    if (!BUNDLED_CATALOG_IDS.has(idNum)) {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "admin-btn";
      deleteBtn.textContent = "Löschen";
      deleteBtn.addEventListener("click", () => {
        ITEMS = ITEMS.filter((it) => it.id !== item.id);
        saveItemsToStorage();
        renderItemList();
        renderAdminItemList();
      });
      actions.appendChild(deleteBtn);

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "admin-btn";
      copyBtn.textContent = "Kopieren";
      copyBtn.addEventListener("click", () => {
        const newId =
          ITEMS.length > 0 ? Math.max(...ITEMS.map((it) => Number(it.id))) + 1 : 1;
        const clone = {
          ...item,
          id: newId,
          name: `${item.name} (Kopie)`,
        };
        ITEMS.push(clone);
        saveItemsToStorage();
        renderItemList();
        renderAdminItemList();
      });
      actions.appendChild(copyBtn);
    }

    row.appendChild(actions);
    list.appendChild(row);
  });
}

function initBoxChatbot() {
  const root = document.getElementById("box-chatbot");
  if (!root) return;
  const avatar = root.querySelector(".box-chatbot-avatar");
  const avatarImage = root.querySelector(".box-chatbot-image");
  const windowEl = document.getElementById("box-chatbot-window");
  const form = document.getElementById("box-chatbot-form");
  const input = document.getElementById("box-chatbot-input");
  const messages = document.getElementById("box-chatbot-messages");

  function addChatMessage(from, text) {
    const wrap = document.createElement("div");
    wrap.className = `box-chatbot-message ${from}`;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function buildReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes("budget") || lower.includes("42")) {
      return "Für die Pflegebox stehen dir hier 42,00 € pro Monat zur Verfügung. Du kannst Produkte so lange hinzufügen, bis das Budget ausgeschöpft ist.";
    }
    if (lower.includes("handschuh")) {
      return "Bei Handschuhen kannst du Material wie Latex, Vinyl oder Nitril und Größen wie S, M, L oder XL wählen, damit sie optimal passen.";
    }
    if (lower.includes("pflegebox")) {
      return "Eine Pflegebox enthält monatlich benötigte Pflegehilfsmittel, die von der Pflegekasse übernommen werden können – wir helfen dir bei der passenden Zusammenstellung.";
    }
    return "Ich bin Pflegeboxi 🤍 und helfe dir bei Fragen zu Pflegeboxen und Pflegehilfsmitteln. Frag mich einfach zu Budget, Produkten oder Handschuhen.";
  }

  function toggleChatbot() {
    root.classList.toggle("box-chatbot--collapsed");
    root.classList.toggle("box-chatbot--expanded");
    if (windowEl) {
      windowEl.style.display = root.classList.contains("box-chatbot--expanded")
        ? "flex"
        : "none";
    }
  }

  if (avatarImage) {
    avatarImage.addEventListener("click", () => {
      if (root.classList.contains("box-chatbot--expanded")) {
        // Geöffnet: Pflegeboxi vor Freude hüpfen
        avatarImage.classList.remove("pflegeboxi-jump");
        void avatarImage.offsetWidth;
        avatarImage.classList.add("pflegeboxi-jump");
        avatarImage.addEventListener("animationend", function removeJump() {
          avatarImage.classList.remove("pflegeboxi-jump");
          avatarImage.removeEventListener("animationend", removeJump);
        }, { once: true });
      } else {
        toggleChatbot();
      }
    });
    avatarImage.style.cursor = "pointer";
  }

  const closeBtn = document.getElementById("box-chatbot-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      toggleChatbot();
    });
  }

  const hideMobileBtn = document.getElementById("box-chatbot-hide-mobile");
  if (hideMobileBtn && root) {
    hideMobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      root.classList.add("box-chatbot--hidden");
    });
  }

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      addChatMessage("user", value);
      input.value = "";
      const reply = buildReply(value);
      setTimeout(() => {
        addChatMessage("bot", reply);
        if (avatarImage) {
          avatarImage.classList.remove("wiggle");
          void avatarImage.offsetWidth;
          avatarImage.classList.add("wiggle");
        }
      }, 300);
    });
  }
}

function readAndStorePartnerRef() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref") || params.get("partner") || "";
  if (ref && ref.trim()) {
    try {
      window.localStorage.setItem(PARTNER_REF_STORAGE_KEY, ref.trim());
    } catch (_) {}
  }
}

/** Liefert die gespeicherte Partner-ID (für Formular-Absendung / Belohnung). Beim Formular-Submit z. B. in ein verstecktes Feld schreiben. */
function getPartnerRef() {
  try {
    return window.localStorage.getItem(PARTNER_REF_STORAGE_KEY) || "";
  } catch (_) {
    return "";
  }
}

function updateFlowStepIndicator(step) {
  const root = document.getElementById("flow-step-indicator");
  if (!root) return;
  root.querySelectorAll(".step").forEach((el) => {
    const n = Number(el.getAttribute("data-flow-step"));
    el.classList.toggle("step--active", n === step);
  });
}

function setFlowStep(step) {
  const s1 = document.getElementById("flow-step-1");
  const s3 = document.getElementById("flow-step-3");
  if (s1) s1.hidden = step !== 1;
  if (s3) s3.hidden = step !== 3;
  /* Schritt 2 ist nur das Pflegebox-Pop-up über Schritt 1 – keine eigene Seite. */
  updateFlowStepIndicator(step === 3 ? 3 : 1);
  const adminPanel = document.getElementById("admin-panel");
  const adminBtn = document.getElementById("admin-toggle-btn");
  const hideAdmin = !ARTICLE_ADMIN_TOOL_ENABLED || step !== 1;
  if (adminPanel) adminPanel.hidden = hideAdmin;
  if (adminBtn) adminBtn.hidden = hideAdmin;
}

function buildCartLinesForApi() {
  const groups = new Map();
  cart.forEach((entry) => {
    const key = `${entry.id}|${entry.selectedSize || ""}|${entry.material || ""}`;
    if (!groups.has(key)) {
      groups.set(key, { entry, count: 0 });
    }
    groups.get(key).count += 1;
  });
  const lines = [];
  groups.forEach(({ entry, count }) => {
    lines.push({
      id: entry.id,
      name: String(entry.name || "Artikel").slice(0, 200),
      price: typeof entry.price === "number" && !Number.isNaN(entry.price) ? entry.price : 0,
      selectedSize: entry.selectedSize != null && entry.selectedSize !== "" ? String(entry.selectedSize).slice(0, 20) : null,
      material: entry.material != null && entry.material !== "" ? String(entry.material).slice(0, 40) : null,
      pieces: entry.pieces != null && entry.pieces !== "" ? String(entry.pieces).slice(0, 80) : null,
      quantity: entry.quantity != null && entry.quantity !== "" ? String(entry.quantity).slice(0, 80) : null,
      ml: (() => {
        if (entry.ml == null || entry.ml === "") return null;
        const n = Number(entry.ml);
        return Number.isFinite(n) ? n : null;
      })(),
      bettschutzeinlage: Boolean(entry.bettschutzeinlage),
      count,
    });
  });
  return lines;
}

document.addEventListener("DOMContentLoaded", () => {
  function isEmbed() {
    try {
      return new URLSearchParams(window.location.search).get("embed") === "1";
    } catch {
      return false;
    }
  }

  function setupEmbedMobileProgressFloating() {
    if (!isEmbed()) return;
    const wrap = document.querySelector(".hero-wrapper");
    const mobileProgress = document.querySelector(".budget-progress-mobile-wrapper");
    if (!wrap || !mobileProgress) return;

    const updateFloatingState = () => {
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      const triggerOffset = Math.max(96, mobileProgress.offsetTop + mobileProgress.offsetHeight);
      document.documentElement.classList.toggle("kfg-embed-mobile-progress-floating", isMobile && wrap.scrollTop > triggerOffset);
    };

    wrap.addEventListener("scroll", updateFloatingState, { passive: true });
    window.addEventListener("resize", updateFloatingState);
    updateFloatingState();
  }

  readAndStorePartnerRef();

  boxIconElement = document.getElementById("box-icon");
  boxIconBadgeElement = document.getElementById("box-icon-badge");

  loadItemsFromStorage();
  mergeBundledCatalogItems();
  loadCartFromStorage();
  pruneCartToBundledCatalog();

  if (ARTICLE_ADMIN_TOOL_ENABLED) {
    initAdminTool();
  } else {
    const ap = document.getElementById("admin-panel");
    const ab = document.getElementById("admin-toggle-btn");
    if (ap) ap.hidden = true;
    if (ab) ab.hidden = true;
  }
  renderItemList();
  renderCart();
  updateBudgetDisplay();
  setupEmbedMobileProgressFloating();
  initBoxChatbot();

  if (ARTICLE_ADMIN_TOOL_ENABLED) {
    const adminToggleBtn = document.getElementById("admin-toggle-btn");
    const adminPanel = document.getElementById("admin-panel");
    if (adminToggleBtn && adminPanel) {
      adminToggleBtn.addEventListener("click", () => {
        adminPanel.classList.toggle("admin-panel--hidden");
      });
    }
  }

  const gloveMaterialOptions = document.getElementById("glove-material-options");
  const gloveSizeButtons = document.getElementById("glove-size-buttons");
  const gloveConfirm = document.getElementById("glove-confirm");
  const gloveCancel = document.getElementById("glove-cancel");
  const gloveModal = document.getElementById("glove-modal");

  if (gloveMaterialOptions) {
    gloveMaterialOptions.addEventListener("change", (e) => {
      const target = e.target;
      if (target && target.name === "glove-material") {
        pendingGloveMaterial = target.value;
        syncGloveMaterialHighlight();
        updateGloveConfirmButton();
      }
    });
  }

  if (gloveSizeButtons) {
    gloveSizeButtons.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        gloveSizeButtons.querySelectorAll("button").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        pendingGloveSize = btn.dataset.size || null;
        updateGloveConfirmButton();
      });
    });
  }

  if (gloveConfirm) {
    gloveConfirm.addEventListener("click", () => {
      if (!pendingGloveItemId || !pendingGloveSize) {
        return;
      }
      tryAddToCart(pendingGloveItemId, pendingGloveSize, null);
      closeGloveModal();
      renderItemList();
    });
  }

  if (gloveCancel) {
    gloveCancel.addEventListener("click", () => closeGloveModal());
  }

  document.getElementById("handschuh-close-btn")?.addEventListener("click", () => closeGloveModal());

  gloveModal?.addEventListener("click", (e) => {
    if (e.target === gloveModal) closeGloveModal();
  });

  const mlVariantModal = document.getElementById("ml-variant-modal");
  document.getElementById("ml-variant-confirm")?.addEventListener("click", () => {
    if (pendingMlItemId == null || pendingMlChoiceMl == null) return;
    tryAddToCart(pendingMlItemId, String(pendingMlChoiceMl), null);
    closeMlModal();
    renderItemList();
  });
  document.getElementById("ml-variant-cancel")?.addEventListener("click", () => closeMlModal());
  document.getElementById("ml-variant-close-btn")?.addEventListener("click", () => closeMlModal());
  mlVariantModal?.addEventListener("click", (e) => {
    if (e.target === mlVariantModal) closeMlModal();
  });

  const bettschutzHintModal = document.getElementById("bettschutz-hint-modal");
  function syncBettschutzHintQtyDisplay() {
    const valEl = document.getElementById("bettschutz-qty-value");
    if (valEl) valEl.textContent = String(bettschutzHintQty);
    const minus = document.getElementById("bettschutz-qty-minus");
    const plus = document.getElementById("bettschutz-qty-plus");
    if (minus) {
      minus.disabled = bettschutzHintQty <= 1;
      minus.classList.toggle("item-qty-btn--disabled", bettschutzHintQty <= 1);
    }
    if (plus) {
      plus.disabled = bettschutzHintQty >= MAX_BETTSCHUTZEINLAGE;
      plus.classList.toggle("item-qty-btn--disabled", bettschutzHintQty >= MAX_BETTSCHUTZEINLAGE);
    }
  }
  function triggerBettschutzImgPulse() {
    const img = document.querySelector("#bettschutz-hint-modal .bettschutz-hint-img");
    if (!img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    img.classList.remove("bettschutz-hint-img--pulse");
    void img.offsetWidth;
    img.classList.add("bettschutz-hint-img--pulse");
    function onEnd() {
      img.classList.remove("bettschutz-hint-img--pulse");
      img.removeEventListener("animationend", onEnd);
    }
    img.addEventListener("animationend", onEnd);
  }
  function closeBettschutzHintModal() {
    if (!bettschutzHintModal) return;
    bettschutzHintModal.classList.remove("is-open");
    bettschutzHintModal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }
  function openBettschutzHintModal() {
    if (!bettschutzHintModal) {
      openPflegeboxWizardCore();
      return;
    }
    bettschutzHintQty = 4;
    syncBettschutzHintQtyDisplay();
    bettschutzHintModal.classList.add("is-open");
    bettschutzHintModal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      triggerBettschutzImgPulse();
      document.getElementById("bettschutz-hint-add")?.focus();
    });
  }
  document.getElementById("bettschutz-qty-minus")?.addEventListener("click", () => {
    if (bettschutzHintQty > 1) {
      bettschutzHintQty -= 1;
      syncBettschutzHintQtyDisplay();
    }
  });
  document.getElementById("bettschutz-qty-plus")?.addEventListener("click", () => {
    if (bettschutzHintQty < MAX_BETTSCHUTZEINLAGE) {
      bettschutzHintQty += 1;
      syncBettschutzHintQtyDisplay();
    }
  });
  document.getElementById("bettschutz-hint-add")?.addEventListener("click", () => {
    const qty = Math.max(1, Math.min(MAX_BETTSCHUTZEINLAGE, bettschutzHintQty));
    addBettschutzeinlagenCount(qty);
    renderItemList();
    closeBettschutzHintModal();
    openPflegeboxWizardCore();
  });
  document.getElementById("bettschutz-hint-skip")?.addEventListener("click", () => {
    closeBettschutzHintModal();
    openPflegeboxWizardCore();
  });
  document.getElementById("bettschutz-hint-close")?.addEventListener("click", () => closeBettschutzHintModal());
  bettschutzHintModal?.addEventListener("click", (e) => {
    if (e.target === bettschutzHintModal) closeBettschutzHintModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (mlVariantModal?.classList.contains("is-open")) {
      e.preventDefault();
      closeMlModal();
      return;
    }
    if (bettschutzHintModal?.classList.contains("is-open")) {
      e.preventDefault();
      closeBettschutzHintModal();
      return;
    }
    if (!gloveModal?.classList.contains("is-open")) return;
    e.preventDefault();
    closeGloveModal();
  });

  function openPflegeboxWizardCore() {
    if (cart.length === 0) {
      window.alert("Bitte wählen Sie zuerst Artikel für Ihre Pflegebox.");
      return;
    }
    if (!window.PflegeboxWizard || typeof window.PflegeboxWizard.open !== "function") return;
    window.PflegeboxWizard.open({
      getCartLines: buildCartLinesForApi,
      getTotal: calculateCartTotal,
      getPartnerRef: getPartnerRef,
    });
  }

  function openPflegeboxWizard() {
    if (cart.length === 0) {
      window.alert("Bitte wählen Sie zuerst Artikel für Ihre Pflegebox.");
      return;
    }
    if (countBettschutzeinlageInCart() === 0) {
      openBettschutzHintModal();
      return;
    }
    openPflegeboxWizardCore();
  }

  const btnNext = document.getElementById("btn-next-step");
  if (btnNext) {
    btnNext.addEventListener("click", () => openPflegeboxWizard());
  }

  document.addEventListener("pflegebox-wizard-cancel", () => {
    setFlowStep(1);
  });

  document.addEventListener("pflegebox-wizard-success", (ev) => {
    const ref = ev.detail && ev.detail.reference;
    const refEl = document.getElementById("flow-step-3-ref");
    if (refEl) {
      if (ref) {
        refEl.textContent = "Ihre Referenz: " + ref;
        refEl.hidden = false;
      } else {
        refEl.hidden = true;
      }
    }
    setFlowStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const btnFlowNew = document.getElementById("btn-flow-new");
  if (btnFlowNew) {
    btnFlowNew.addEventListener("click", () => {
      setFlowStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

});

(function setupPflegeboxEmbedHeightPostMessage() {
  function isEmbed() {
    try {
      return new URLSearchParams(window.location.search).get("embed") === "1";
    } catch {
      return false;
    }
  }

  if (!isEmbed() || window.parent === window) return;

  function measureContentHeight() {
    var wrap = document.querySelector(".hero-wrapper");
    var overlay = document.querySelector(".hero-overlay");
    if (!wrap || !overlay) return 0;
    /*
     * .hero-overlay hat im Embed zoom: 0.823 — scrollHeight/scrollHeight des Wrappers
     * ist oft zu groß, dann wirkt das Iframe zu hoch und darunter entsteht ein weißer Streifen.
     * Ohne inneren Overflow: sichtbare Höhe per getBoundingClientRect (zoom berücksichtigt).
     */
    var needsInnerScroll = wrap.scrollHeight > wrap.clientHeight + 1;
    if (needsInnerScroll) {
      return Math.ceil(wrap.scrollHeight);
    }
    return Math.ceil(overlay.getBoundingClientRect().height);
  }

  function postHeight() {
    requestAnimationFrame(function () {
      var h = measureContentHeight();
      if (h < 80) return;
      window.parent.postMessage({ type: "ahs-kfg-height", height: h }, "*");
    });
  }

  function start() {
    postHeight();
    window.addEventListener("resize", postHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", postHeight);
    }
    setTimeout(postHeight, 50);
    setTimeout(postHeight, 320);
    var wrap = document.querySelector(".hero-wrapper");
    var overlay = document.querySelector(".hero-overlay");
    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(postHeight);
      if (wrap) ro.observe(wrap);
      if (overlay) ro.observe(overlay);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

