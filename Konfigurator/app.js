const MAX_BUDGET = 42;

/** Partner-Referrer aus URL (?ref=PARTNER_ID oder ?partner=PARTNER_ID) – für Belohnung/Flyer */
const PARTNER_REF_STORAGE_KEY = "konfigurator_partner_ref";

let ITEMS = [];
let cart = [];

let editingItemId = null;

let pendingGloveItemId = null;
let pendingGloveMaterial = null;
let pendingGloveSize = null;

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

  ITEMS.forEach((item) => {
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
      const img = document.createElement("img");
      img.className = "item-image";
      img.src = item.imageUrl;
      img.alt = item.name;
      contentWrap.appendChild(img);
    }

    const header = document.createElement("div");
    header.className = "item-header";
    const nameSpan = document.createElement("span");
    nameSpan.className = "item-name";
    nameSpan.textContent = item.name;
    header.appendChild(nameSpan);
    contentWrap.appendChild(header);

    if (item.pieces || item.quantity || item.ml) {
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
      : (item.price || 0) <= remainingBefore;

    const footer = document.createElement("div");
    footer.className = "item-qty-row";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "item-qty-btn item-qty-btn--minus";
    minusBtn.textContent = "−";

    const qtyValue = document.createElement("span");
    qtyValue.className = "item-qty-value";
    qtyValue.textContent = String(countInCart);

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "item-qty-btn item-qty-btn--plus";
    plusBtn.textContent = "+";

    if (!canAddOneMore) {
      plusBtn.disabled = true;
      plusBtn.classList.add("item-qty-btn--disabled");
    }

    minusBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const selectedSize = sizeSelect ? sizeSelect.value : null;
      decrementItemInCart(item.id, selectedSize);
    });

    plusBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const selectedSize = sizeSelect ? sizeSelect.value : null;
      handleAddFromList(item.id, selectedSize);
    });

    if (countInCart > 0) {
      footer.appendChild(minusBtn);
    }
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

function tryAddToCart(itemId, selectedSize = null, material = null) {
  const item = ITEMS.find((it) => it.id === itemId);
  if (!item) return;

  if (item.bettschutzeinlage) {
    const count = cart.filter((c) => c.id === itemId).length;
    if (count >= MAX_BETTSCHUTZEINLAGE) return;
    const cartEntry = { ...item, selectedSize, material, price: 0 };
    cart.push(cartEntry);
  } else {
    const totalBefore = calculateCartTotal();
    const remainingBefore = MAX_BUDGET - totalBefore;
    if ((item.price || 0) > remainingBefore) return;
    const cartEntry = { ...item, selectedSize, material };
    cart.push(cartEntry);
  }
  renderCart();
  updateBudgetDisplay();
  triggerBoxIconWiggle();
  saveCartToStorage();
}

function decrementItemInCart(itemId, selectedSize = null) {
  const index = cart.findIndex(
    (entry) => entry.id === itemId && (entry.selectedSize || null) === selectedSize
  );
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

  incrementCartItem(itemId, selectedSize);
}

function openGloveModal(itemId) {
  const modal = document.getElementById("glove-modal");
  if (!modal) return;
  pendingGloveItemId = itemId;
  pendingGloveMaterial = null;
  pendingGloveSize = null;

  const materialRadios = document.querySelectorAll('input[name="glove-material"]');
  materialRadios.forEach((r) => (r.checked = false));

  const sizeButtons = document.querySelectorAll("#glove-size-buttons button");
  sizeButtons.forEach((btn) => btn.classList.remove("glove-size-selected"));

  modal.style.display = "flex";
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
      const img = document.createElement("img");
      img.className = "cart-item-image";
      img.src = item.imageUrl;
      img.alt = item.name;
      row.appendChild(img);
    }

    const main = document.createElement("div");
    main.className = "cart-item-main";
    const name = document.createElement("div");
    name.className = "cart-item-name";
    name.textContent = item.name;
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

    const qty = document.createElement("span");
    qty.className = "cart-qty-value";
    qty.textContent = String(count);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "item-qty-btn item-qty-btn--plus";
    plus.textContent = "+";
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
    if (!plusBtn) return;

    if (item.bettschutzeinlage) {
      const countInCart = cart.filter((c) => c.id === itemId).length;
      if (countInCart >= MAX_BETTSCHUTZEINLAGE) {
        plusBtn.disabled = true;
        plusBtn.classList.add("item-qty-btn--disabled");
        el.classList.add("item-unavailable");
        let label = el.querySelector(".item-unavailable-label");
        if (!label) {
          label = document.createElement("div");
          label.className = "item-unavailable-label";
          label.textContent = "Max. 4 möglich";
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

    if ((item.price || 0) > remainingBudget || remainingBudget <= 0) {
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

    if (editingItemId != null) {
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
    } else {
      const newId =
        ITEMS.length > 0 ? Math.max(...ITEMS.map((it) => Number(it.id))) + 1 : 1;
      ITEMS.push({
        id: newId,
        name,
        pieces,
        quantity,
        ml,
        price: effectivePrice,
        imageUrl,
        sizes,
        isGlove,
        bettschutzeinlage,
      });
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
  const s2 = document.getElementById("flow-step-2");
  const s3 = document.getElementById("flow-step-3");
  if (s1) s1.hidden = step !== 1;
  if (s2) s2.hidden = step !== 2;
  if (s3) s3.hidden = step !== 3;
  updateFlowStepIndicator(step);
  const adminPanel = document.getElementById("admin-panel");
  const adminBtn = document.getElementById("admin-toggle-btn");
  const hideAdmin = step !== 1;
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
      selectedSize: entry.selectedSize || null,
      material: entry.material || null,
      pieces: entry.pieces || null,
      quantity: entry.quantity || null,
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
  readAndStorePartnerRef();

  boxIconElement = document.getElementById("box-icon");
  boxIconBadgeElement = document.getElementById("box-icon-badge");

  loadItemsFromStorage();
  loadCartFromStorage();

  initAdminTool();
  renderItemList();
  renderCart();
  updateBudgetDisplay();
  initBoxChatbot();

  const adminToggleBtn = document.getElementById("admin-toggle-btn");
  const adminPanel = document.getElementById("admin-panel");
  if (adminToggleBtn && adminPanel) {
    adminToggleBtn.addEventListener("click", () => {
      adminPanel.classList.toggle("admin-panel--hidden");
    });
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
      }
    });
  }

  if (gloveSizeButtons) {
    gloveSizeButtons.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        gloveSizeButtons.querySelectorAll("button").forEach((b) =>
          b.classList.remove("glove-size-selected")
        );
        btn.classList.add("glove-size-selected");
        pendingGloveSize = btn.dataset.size || null;
      });
    });
  }

  if (gloveConfirm) {
    gloveConfirm.addEventListener("click", () => {
      if (!pendingGloveItemId || !pendingGloveMaterial || !pendingGloveSize) {
        return;
      }
      tryAddToCart(pendingGloveItemId, pendingGloveSize, pendingGloveMaterial);
      if (gloveModal) gloveModal.style.display = "none";
      pendingGloveItemId = null;
      pendingGloveMaterial = null;
      pendingGloveSize = null;
      renderItemList();
    });
  }

  if (gloveCancel) {
    gloveCancel.addEventListener("click", () => {
      if (gloveModal) gloveModal.style.display = "none";
      pendingGloveItemId = null;
      pendingGloveMaterial = null;
      pendingGloveSize = null;
    });
  }

  function openPflegeboxWizard() {
    if (!window.PflegeboxWizard || typeof window.PflegeboxWizard.open !== "function") return;
    window.PflegeboxWizard.open({
      getCartLines: buildCartLinesForApi,
      getTotal: calculateCartTotal,
      getPartnerRef: getPartnerRef,
    });
  }

  const btnNext = document.getElementById("btn-next-step");
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (cart.length === 0) {
        window.alert("Bitte wählen Sie zuerst Artikel für Ihre Pflegebox.");
        return;
      }
      setFlowStep(2);
      openPflegeboxWizard();
    });
  }

  const btnFlowBack = document.getElementById("btn-flow-back");
  if (btnFlowBack) {
    btnFlowBack.addEventListener("click", () => {
      window.PflegeboxWizard?.close?.();
      setFlowStep(1);
    });
  }

  const btnReopenWizard = document.getElementById("btn-reopen-wizard");
  if (btnReopenWizard) {
    btnReopenWizard.addEventListener("click", () => openPflegeboxWizard());
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

