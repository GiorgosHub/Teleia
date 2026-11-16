/* the "not found" page: only the language buttons (the red pill slides once the page has drawn) */
document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => window.I18N.set(b.dataset.lang)));
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("lang-anim")));
