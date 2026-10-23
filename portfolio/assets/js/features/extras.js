/* Smaller things that move: the marquee that speeds up with the scroll, numbers that count, the speedometers,
   before/after, the welcome in 15 languages, the versions you drag, the cards that turn, sparks. */
import { $, $$, reduce, T, once, clamp, lerp, ease } from "../core/dom.js";
import { frame } from "../core/loop.js";

export function initMarquee() {
  const tr = $(".marquee-track"); if (!tr || reduce()) return;
  /* the track holds its words twice, so moving it by half loops without a seam */
  tr.append(...[...tr.childNodes].map((n) => n.cloneNode(true)));
  let rate = 1;
  frame({
    write(s) {
      const a = tr.getAnimations()[0]; if (!a) return false;
      const want = 1 + Math.min(6, Math.abs(s.dy) / 6);
      rate = lerp(rate, want, .12);
      a.playbackRate = rate;
      return rate > 1.02;
    },
  });
}

/* numbers count up once, when they arrive */
export function countUp(el, to, dur = 1400) {
  if (reduce()) { el.textContent = to; return; }
  const t0 = performance.now();
  const step = (t) => { const k = clamp((t - t0) / dur); el.textContent = Math.round(to * ease.out(k)); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* the speedometers: ticks drawn once, then the needle sweeps past the mark and settles back, like the logo */
export function initGauges() {
  $$(".gauge").forEach((g) => {
    const val = +g.dataset.gauge, max = +g.dataset.max, ticks = $(".g-ticks", g), needle = $(".g-needle", g), fill = $(".g-fill", g), num = $("[data-count]", g);
    const NS = "http://www.w3.org/2000/svg";
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI * (1 - i / 10), l = document.createElementNS(NS, "line");
      const r1 = i % 5 ? 64 : 58;
      l.setAttribute("x1", 100 + Math.cos(a) * 70); l.setAttribute("y1", 110 - Math.sin(a) * 70);
      l.setAttribute("x2", 100 + Math.cos(a) * r1); l.setAttribute("y2", 110 - Math.sin(a) * r1);
      ticks.append(l);
    }
    const end = val / max;
    const set = (k) => { needle.style.transform = `rotate(${-90 + 180 * k}deg)`; fill.style.strokeDashoffset = String(1 - k); };
    if (reduce()) { set(end); return; }
    num.textContent = "0"; set(0);
    once(g, () => {
      countUp(num, val, 1600);
      const t0 = performance.now();
      const step = (t) => {
        const k = clamp((t - t0) / 1900);
        /* sweep to the end of the dial, then fall back onto the value */
        const v = k < .45 ? ease.out(k / .45) * 1 : lerp(1, end, ease.out((k - .45) / .55));
        set(v); if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: .5 });
  });
}

export function initBeforeAfter() {
  const ba = $("#ba"); if (!ba) return;
  const r = $(".ba-range", ba), set = () => ba.style.setProperty("--p", r.value + "%");
  r.addEventListener("input", set); set();
  /* a first nudge so it is clear the handle moves */
  if (!reduce()) once(ba, () => {
    const t0 = performance.now();
    const nudge = (t) => { const k = Math.min(1, (t - t0) / 1800); r.value = 50 + Math.sin(k * Math.PI * 2) * 24 * (1 - k); set(); if (k < 1) requestAnimationFrame(nudge); };
    requestAnimationFrame(nudge);
  }, { threshold: .6 });
}

const HELLO = [["el", "Καλώς ήρθατε"], ["en", "Welcome"], ["de", "Willkommen"], ["es", "Bienvenidos"], ["ru", "Добро пожаловать"], ["sq", "Mirë se vini"], ["fa", "خوش آمدید"], ["he", "ברוכים הבאים"], ["fr", "Bienvenue"], ["zh", "欢迎"], ["hi", "स्वागत है"], ["ar", "أهلًا وسهلًا"], ["bn", "স্বাগতম"], ["pt", "Bem-vindos"], ["id", "Selamat datang"]];
export function initHello() {
  const w = $("#hello"), l = $("#helloL"); if (!w) return;
  let i = 0, on = false;
  const show = () => { const [code, word] = HELLO[i]; w.textContent = word; w.lang = code; w.dir = ["fa", "he", "ar"].includes(code) ? "rtl" : "ltr"; l.textContent = (T("langNames") || {})[code] || code.toUpperCase(); };
  show();
  if (reduce()) return;
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { on = e.isIntersecting; }).observe(w);
  setInterval(() => {
    if (!on || document.hidden) return;
    w.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-40%) rotate(-4deg)", opacity: 0 }], { duration: 260, easing: "ease-in" }).finished.then(() => {
      i = (i + 1) % HELLO.length; show();
      w.animate([{ transform: "translateY(40%) rotate(4deg)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.34,1.56,.64,1)" });
    });
  }, 1800);
  document.addEventListener("langchange", show);
}

export function initVersions() {
  const vt = $(".ver-track"); if (!vt) return;
  let down = false, x0 = 0, s0 = 0;
  vt.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; x0 = e.clientX; s0 = vt.scrollLeft; vt.setPointerCapture(e.pointerId); vt.style.cursor = "grabbing"; });
  vt.addEventListener("pointermove", (e) => { if (down) vt.scrollLeft = s0 - (e.clientX - x0); });
  const up = () => { down = false; vt.style.cursor = ""; };
  vt.addEventListener("pointerup", up); vt.addEventListener("pointercancel", up);
}

export function initFlips() {
  $$(".person").forEach((p) => p.addEventListener("click", () => p.setAttribute("aria-pressed", String(p.getAttribute("aria-pressed") !== "true"))));
}

/* sparks: red, yellow and green dots fly from a point */
export function burst(x, y, n = 18) {
  if (reduce()) return;
  const C = ["#B5172B", "#FFC93C", "#137A43", "#F3B6B0"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i"); s.className = "spark";
    s.style.left = x + "px"; s.style.top = y + "px"; s.style.background = C[i % C.length];
    document.body.append(s);
    const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 90, sz = .6 + Math.random() * .9;
    s.animate([{ transform: `scale(${sz})`, opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 40}px) scale(0)`, opacity: 1 }],
      { duration: 700 + Math.random() * 400, easing: "cubic-bezier(.16,1,.3,1)" }).finished.then(() => s.remove());
  }
}
export function initSparks() {
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn-red,.btn-yel"); if (!b || e.detail === 0) return;
    burst(e.clientX, e.clientY, 14);
  });
}
