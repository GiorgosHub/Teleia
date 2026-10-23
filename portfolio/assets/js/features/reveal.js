/* Headings rise word by word; blocks settle in as they arrive. */
import { $$, reduce } from "../core/dom.js";

const BLOCKS = [
  ".sec-head .lead", ".index li", ".ch-kicker", ".ch-intro", ".shot", ".film", ".fact", ".ba-block > *", ".gauge",
  ".versions-head", ".ver-track", ".built", ".hello-block > *", ".poster > *", ".steps .step", ".proc-visual",
  ".person", ".plus", ".equals", ".story > .h3", ".story-line li", ".toy", ".qa details", ".contact-copy > :not(h2)",
  ".contact-form", ".ftr-cols > div",
].join(",");

/* split a heading's words into masks; the language switch writes new text, so this runs again after it */
export function splitWords(scope = document) {
  $$(".words", scope).forEach((el) => {
    const text = el.textContent.trim();
    if (el.dataset.split === text) return;
    el.dataset.split = text;
    el.textContent = "";
    text.split(/\s+/).forEach((word, i, all) => {
      const w = document.createElement("span"), inner = document.createElement("span");
      w.className = "w"; inner.textContent = word; inner.style.setProperty("--i", i);
      w.append(inner); el.append(w);
      if (i < all.length - 1) el.append(" ");
    });
  });
}

export function initReveal() {
  splitWords();
  const heads = $$("h1:has(.words), h2:has(.words)");
  const blocks = $$(BLOCKS);
  /* stagger siblings that arrive together */
  blocks.forEach((b) => {
    const sibs = [...b.parentElement.children].filter((c) => c.matches(BLOCKS));
    b.style.setProperty("--i", Math.min(sibs.indexOf(b), 6));
    b.classList.add(b.matches(".gauge, .person, .toy, .hello-card, .poster-img") ? "rv-scale" : "rv");
  });
  if (reduce() || !("IntersectionObserver" in window)) { [...heads, ...blocks].forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  [...heads, ...blocks].forEach((e) => { if (!e.closest(".hero")) io.observe(e); });
  $$("svg .d").forEach((d) => io.observe(d.closest("svg")));

  document.addEventListener("langchange", () => {
    splitWords();
    /* headings already on the page show at once in the new language */
    heads.forEach((h) => { if (h.classList.contains("in")) { h.classList.remove("in"); void h.offsetWidth; h.classList.add("in"); } });
  });
}
