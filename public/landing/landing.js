(() => {
  "use strict";

  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");

  if (toggle && menu) {
    const setMenuOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      menu.hidden = !open;
    };

    toggle.hidden = false;
    setMenuOpen(false);
    toggle.addEventListener("click", () => setMenuOpen(menu.hidden));
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !menu.hidden) {
        setMenuOpen(false);
        toggle.focus();
      }
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) || reducedMotion.matches) return;

  const elements = [...document.querySelectorAll("[data-reveal]")];
  const revealed = new WeakSet();
  const finish = (element) => {
    revealed.add(element);
    observer.unobserve(element);
    element.classList.remove("reveal-ready", "is-revealed");
    element.style.removeProperty("--reveal-delay");
  };

  const observer = new IntersectionObserver((entries) => {
    const groups = new Map();
    for (const entry of entries) {
      if (!entry.isIntersecting || revealed.has(entry.target)) continue;
      const group = entry.target.closest("[data-reveal-group]");
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(entry.target);
    }

    // Each viewport batch starts a fresh local cascade, including on first load.
    for (const items of groups.values()) {
      items.sort((a, b) => Number(a.dataset.revealOrder) - Number(b.dataset.revealOrder));
      items.forEach((element, index) => {
        revealed.add(element);
        observer.unobserve(element);
        element.style.setProperty("--reveal-delay", `${index * 200}ms`);
        element.classList.remove("reveal-ready");
        element.classList.add("is-revealed");
      });
    }
  }, { threshold: 0, rootMargin: "0px" });

  for (const element of elements) {
    element.classList.add("reveal-ready");
    element.addEventListener("animationend", (event) => {
      if (event.target === element && event.animationName === "landing-reveal") finish(element);
    });
    observer.observe(element);
  }

  // Never leave a keyboard user focused on an invisible control.
  document.addEventListener("focusin", (event) => {
    const element = event.target.closest("[data-reveal]");
    if (element) finish(element);
  });

  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    elements.forEach(finish);
  });
})();
