"use strict";

const products = [
  { id: "planner", name: "Ежедневник A5", category: "Для учёбы", price: 1000, oldPrice: null, rating: "4,8", stock: true, stockText: "В наличии", badge: "Хит", badgeClass: "text-bg-primary", image: "images/product-1.webp", description: "Недатированный ежедневник для планов, заметок и повседневных задач.", color: "Красный", material: "Бумага, картон", guarantee: "6 месяцев", delivery: "По договорённости" },
  { id: "organizer", name: "Органайзер для стола", category: "Рабочее место", price: 1500, oldPrice: null, rating: "4,6", stock: true, stockText: "В наличии", badge: "Новинка", badgeClass: "text-bg-success", image: "images/product-2.webp", description: "Помогает держать ручки, заметки и небольшие принадлежности под рукой.", color: "Чёрный", material: "Пластик", guarantee: "6 месяцев", delivery: "По договорённости" },
  { id: "backpack", name: "Городской рюкзак", category: "Аксессуары", price: 2000, oldPrice: 2500, rating: "4,9", stock: true, stockText: "Осталось мало", badge: "−20%", badgeClass: "badge-sale", image: "images/product-3.webp", description: "Вместительный рюкзак для учёбы, поездок по городу и повседневных вещей.", color: "Песочный", material: "Текстиль", guarantee: "12 месяцев", delivery: "По договорённости" },
  { id: "lamp", name: "Настольная лампа", category: "Рабочее место", price: 1800, oldPrice: null, rating: "4,4", stock: true, stockText: "В наличии", badge: "", badgeClass: "", image: "images/product-4.webp", description: "Компактная лампа для освещения рабочей поверхности во время занятий.", color: "Белый", material: "Металл и пластик", guarantee: "12 месяцев", delivery: "По договорённости" },
  { id: "pencil-case", name: "Пенал на молнии", category: "Для учёбы", price: 900, oldPrice: null, rating: "4,7", stock: true, stockText: "В наличии", badge: "Популярное", badgeClass: "badge-soft", image: "images/product-5.jpg", description: "Небольшой пенал с отделением для ручек, карандашей и других мелочей.", color: "Ярко-розовый", material: "Текстиль", guarantee: "6 месяцев", delivery: "По договорённости" },
  { id: "bottle", name: "Бутылка для воды", category: "Аксессуары", price: 2200, oldPrice: null, rating: "4,5", stock: false, stockText: "Нет в наличии", badge: "Нет в наличии", badgeClass: "badge-unavailable", image: "images/product-6.webp", description: "Многоразовая бутылка для воды, которую удобно брать с собой.", color: "Чёрный", material: "Пластик", guarantee: "6 месяцев", delivery: "Уточняется после поступления" }
];

const money = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} руб.`;

function fillProductPage() {
  const title = document.getElementById("productTitle");
  if (!title) return;

  const requestedId = new URLSearchParams(window.location.search).get("id") || "planner";
  const product = products.find((item) => item.id === requestedId) || products[0];
  document.title = `${product.name} — ShopProject`;
  title.textContent = product.name;
  document.getElementById("productBreadcrumb").textContent = product.name;
  document.getElementById("productImage").src = product.image;
  document.getElementById("productImage").alt = product.name;
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productDescription").textContent = product.description;
  document.getElementById("productRating").textContent = `★ ${product.rating} / 5`;
  document.getElementById("productPrice").textContent = product.oldPrice
    ? `${money(product.price)} (вместо ${money(product.oldPrice)})`
    : money(product.price);

  const badge = document.getElementById("productBadge");
  badge.textContent = product.badge || "Товар";
  badge.className = `badge mb-3 ${product.badgeClass || "badge-soft"}`;
  if (!product.badge) badge.classList.add("d-none");

  const stock = document.getElementById("productStock");
  stock.textContent = product.stockText;
  stock.className = `badge ${product.stock ? "text-bg-success" : "badge-unavailable"}`;
  const orderLink = document.getElementById("productOrderLink");
  orderLink.href = `order.html?product=${encodeURIComponent(product.id)}`;
  if (!product.stock) {
    orderLink.classList.add("disabled");
    orderLink.setAttribute("aria-disabled", "true");
    orderLink.href = "#productTitle";
    orderLink.textContent = "Временно нет в наличии";
  }

  const specs = {
    specCategory: product.category,
    specPrice: money(product.price),
    specColor: product.color,
    specMaterial: product.material,
    specGuarantee: product.guarantee,
    specStock: product.stockText,
    specDelivery: product.delivery
  };
  Object.entries(specs).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

function setupCatalog() {
  const grid = document.getElementById("catalogGrid");
  const filterForm = document.getElementById("catalogFilters");
  if (!grid || !filterForm) return;

  const cards = Array.from(grid.querySelectorAll("[data-product-card]"));
  const count = document.getElementById("catalogCount");
  const empty = document.getElementById("catalogEmpty");
  const search = document.getElementById("catalogSearch");
  const sort = document.getElementById("catalogSort");

  function applyFilters(event) {
    if (event) event.preventDefault();
    const categories = Array.from(filterForm.querySelectorAll('input[name="category"]:checked')).map((input) => input.value);
    const min = Number(document.getElementById("priceMin").value || 0);
    const maxValue = document.getElementById("priceMax").value;
    const max = maxValue === "" ? Infinity : Number(maxValue);
    const saleOnly = document.getElementById("filterSale").checked;
    const newOnly = document.getElementById("filterNew").checked;
    const stock = filterForm.querySelector('input[name="stock"]:checked')?.value || "all";
    const term = search.value.trim().toLocaleLowerCase("ru");

    cards.forEach((card) => {
      const price = Number(card.dataset.price);
      const cardTags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
      const matchesCategory = categories.length === 0 || categories.includes(card.dataset.category);
      const matchesPrice = price >= min && price <= max;
      const matchesSale = !saleOnly || cardTags.includes("sale");
      const matchesNew = !newOnly || cardTags.includes("new");
      const matchesStock = stock !== "yes" || card.dataset.stock === "yes";
      const matchesSearch = (card.dataset.name || "").toLocaleLowerCase("ru").includes(term);
      card.closest(".catalog-item").classList.toggle("d-none", !(matchesCategory && matchesPrice && matchesSale && matchesNew && matchesStock && matchesSearch));
    });

    const visibleCount = cards.filter((card) => !card.closest(".catalog-item").classList.contains("d-none")).length;
    count.textContent = `Найдено: ${visibleCount} из ${cards.length}`;
    empty.classList.toggle("d-none", visibleCount > 0);
  }

  function applySort() {
    const mode = sort.value;
    const ordered = [...cards].sort((a, b) => {
      const aPrice = Number(a.dataset.price);
      const bPrice = Number(b.dataset.price);
      if (mode === "price-asc") return aPrice - bPrice;
      if (mode === "price-desc") return bPrice - aPrice;
      if (mode === "name") return a.dataset.name.localeCompare(b.dataset.name, "ru");
      const popularOrder = ["planner", "backpack", "pencil-case", "organizer", "lamp", "bottle"];
      return popularOrder.indexOf(a.dataset.id) - popularOrder.indexOf(b.dataset.id);
    });
    ordered.forEach((card) => grid.appendChild(card.closest(".catalog-item")));
  }

  filterForm.addEventListener("submit", applyFilters);
  filterForm.addEventListener("change", applyFilters);
  search.addEventListener("input", applyFilters);
  sort.addEventListener("change", () => { applySort(); applyFilters(); });
  filterForm.addEventListener("reset", () => window.setTimeout(() => { search.value = ""; sort.value = "default"; applySort(); applyFilters(); }, 0));
  document.getElementById("resetFilters").addEventListener("click", () => window.setTimeout(() => { search.value = ""; sort.value = "default"; applySort(); applyFilters(); }, 0));
  applySort();
  applyFilters();
}

function setupQuickOrder() {
  const modal = document.getElementById("quickOrderModal");
  const form = document.getElementById("quickOrderForm");
  if (!modal || !form) return;
  const productSelect = document.getElementById("quickProduct");
  const success = document.getElementById("quickOrderSuccess");

  modal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    if (button?.dataset.product) productSelect.value = button.dataset.product;
    success.classList.add("d-none");
    form.classList.remove("was-validated");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    success.classList.remove("d-none");
    success.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}

function setupOrderForm() {
  const form = document.getElementById("orderForm");
  if (!form) return;
  const productSelect = document.getElementById("orderProduct");
  const queryProduct = new URLSearchParams(window.location.search).get("product");
  if (queryProduct && products.some((product) => product.id === queryProduct)) productSelect.value = queryProduct;

  const date = document.getElementById("orderDate");
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  date.min = localToday;

  const success = document.getElementById("orderSuccess");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(":invalid");
      firstInvalid?.focus();
      success.classList.add("d-none");
      return;
    }
    success.classList.remove("d-none");
    success.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  form.addEventListener("reset", () => window.setTimeout(() => {
    form.classList.remove("was-validated");
    success.classList.add("d-none");
    if (queryProduct && products.some((product) => product.id === queryProduct)) productSelect.value = queryProduct;
  }, 0));
}

document.addEventListener("DOMContentLoaded", () => {
  fillProductPage();
  setupCatalog();
  setupQuickOrder();
  setupOrderForm();
});
