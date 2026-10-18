/* the "not found" page: only the language buttons */
document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => window.I18N.set(b.dataset.lang)));
