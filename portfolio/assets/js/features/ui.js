/* The frame of the page: the opening, theme and language (a circle opens from the click), the menu, the header
   that steps aside while you read, the progress line, the menu link of the section you are in, the clock in
   Larissa, the toast and the copy buttons. */
import { $, $$, root, reduce, T, docTop } from "../core/dom.js";
import { frame, measure } from "../core/loop.js";

export function initIntro(done) {
  const intro = $("#intro");
  if (!intro || root.classList.contains("seen") || reduce()) { intro && intro.remove(); done(); return; }
  let out = false;
  const go = () => {
    if (out) return; out = true;
    intro.classList.add("out");
    try { sessionStorage.setItem("intro", "1"); } catch {}
    setTimeout(done, 200);
    setTimeout(() => intro.remove(), 700);
  };
  intro.addEventListener("click", go);
  setTimeout(go, 1500);
}

/* the circle that opens the new look; the click point goes straight into the animation */
function circleSwap(e, update) {
  if (reduce() || !document.startViewTransition) { update(); return; }
  const x = e.clientX || innerWidth / 2, y = e.clientY || 0;
  const vt = document.startViewTransition(update);
  vt.ready.then(() => {
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 560, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" });
  }).catch(() => {});
}

export function initTheme() {
  const btn = $("#theme"), meta = $('meta[name="theme-color"]');
  const label = () => {
    const dark = root.dataset.theme === "dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", T(dark ? "themeLight" : "themeDark"));
    meta.content = dark ? "#131313" : "#F5F0E6";
  };
  btn.addEventListener("click", (e) => circleSwap(e, () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next; document.dispatchEvent(new Event("themechange"));
    try { localStorage.setItem("theme", next); } catch {}
    label();
  }));
  document.addEventListener("langchange", label);
  label();
}

export function initLang() {
  $$("[data-lang]").forEach((b) => b.addEventListener("click", (e) => {
    if (b.dataset.lang === window.I18N.lang) return;
    circleSwap(e, () => window.I18N.set(b.dataset.lang));
  }));
}

export function initNav() {
  const hdr = $("#hdr"), nav = $("#nav"), btn = $("#menuBtn"), bar = $("#progress");
  const close = () => { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", String(o)); if (o) $("a", nav).focus(); });
  $$("a", nav).forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { close(); btn.focus(); } });
  document.addEventListener("click", (e) => { if (nav.classList.contains("open") && !e.target.closest(".hdr")) close(); });

  /* which section are we in: the link of that section is marked */
  const links = $$("a[href^='#']", nav), secs = links.map((a) => $(a.getAttribute("href")));
  let tops = [], max = 1, away = false, acc = 0, cur = -1;
  measure((s) => { tops = secs.map((el) => (el ? docTop(el) : 1e9)); max = Math.max(1, document.documentElement.scrollHeight - s.vh); });
  frame({
    write(s) {
      bar.style.transform = `scaleX(${Math.min(1, s.y / max)})`;
      /* the header steps aside on the way down and comes back on the way up */
      acc = Math.sign(s.dy) === Math.sign(acc) ? acc + s.dy : s.dy;
      const want = s.y > 200 && acc > 40 && !nav.classList.contains("open") && !hdr.contains(document.activeElement);
      const back = s.y < 200 || acc < -24;
      if (want && !away) { away = true; hdr.classList.add("away"); }
      else if (back && away) { away = false; hdr.classList.remove("away"); }
      let k = -1; tops.forEach((t, i) => { if (s.y + s.vh * .4 >= t) k = i; });
      if (k !== cur) { cur = k; links.forEach((a, i) => (i === k ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"))); }
      return false;
    },
  });
  hdr.addEventListener("focusin", () => { away = false; hdr.classList.remove("away"); });
}

export function initClock() {
  const els = $$("#clock");
  const tick = () => {
    const t = new Intl.DateTimeFormat(window.I18N?.lang === "en" ? "en-GB" : "el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" }).format(new Date());
    els.forEach((e) => { if (e.textContent !== t) e.textContent = t; });
  };
  tick(); setInterval(tick, 10000);
}

let toastT = 0;
export function say(text) {
  const t = $("#toast"); t.textContent = text; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2400);
}
export async function copy(text) {
  try { await navigator.clipboard.writeText(text); say(T("copied")); } catch { say(T("copyFail")); }
}
export function initCopy() { $$("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy))); }
