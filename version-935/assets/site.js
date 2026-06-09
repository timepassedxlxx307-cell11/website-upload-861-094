const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function setupMenu() {
  const toggle = qs(".menu-toggle");
  const mobile = qs(".mobile-nav");
  if (!toggle || !mobile) {
    return;
  }
  toggle.addEventListener("click", () => {
    const next = !mobile.classList.contains("is-open");
    mobile.classList.toggle("is-open", next);
    toggle.setAttribute("aria-expanded", String(next));
  });
}

function setupHero() {
  const slides = qsa("[data-hero-slide]");
  const dots = qsa("[data-hero-dot]");
  if (!slides.length) {
    return;
  }
  let index = 0;
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };
  dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
  setInterval(() => show(index + 1), 5200);
}

function setupFilters() {
  const pages = qsa(".library-page");
  pages.forEach((page) => {
    const input = qs("[data-search-input]", page);
    const chips = qsa("[data-filter-value]", page);
    const cards = qsa("[data-card]", page);
    const empty = qs("[data-empty-result]", page);
    let active = "all";
    const apply = () => {
      const term = input ? input.value.trim().toLowerCase() : "";
      let visible = 0;
      cards.forEach((card) => {
        const text = (card.getAttribute("data-search") || "").toLowerCase();
        const category = card.getAttribute("data-category") || "";
        const matchedText = !term || text.includes(term);
        const matchedCategory = active === "all" || category === active;
        const ok = matchedText && matchedCategory;
        card.classList.toggle("is-hidden", !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    };
    if (input) {
      input.addEventListener("input", apply);
      const params = new URLSearchParams(location.search);
      const query = params.get("q");
      if (query) {
        input.value = query;
      }
    }
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        active = chip.getAttribute("data-filter-value") || "all";
        chips.forEach((item) => item.classList.toggle("is-active", item === chip));
        apply();
      });
    });
    apply();
  });
}

setupMenu();
setupHero();
setupFilters();
