/* teleia. v3 — every module of assets/js/core and assets/js/features in one plain script, so the page also works
   when index.html is opened straight from a folder (browsers block modules there). Same code, same order. */
(() => {
"use strict";

/* ===== core/dom.js ===== */
/* small helpers shared by every module */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;

const mq = (q) => matchMedia(q);
const fineMQ = mq("(hover: hover) and (pointer: fine)");
/* Scroll-pinned scenes run when the viewport is tall enough. */
const pinMQ = mq("(min-height: 360px)");

const fine = () => fineMQ.matches;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/* texts from i18n.js (Greek or English, whichever is on) */
const T = (k) => (window.I18N ? window.I18N.t(k) : k);
const lang = () => (window.I18N ? window.I18N.lang : "el");

/* run a callback when an element first comes into view */
function once(el, fn, opts = { threshold: .2 }) {
  if (!el) return;
  if (!("IntersectionObserver" in window)) { fn(el); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } }), opts);
  io.observe(el);
}

/* page position of an element's top, without layout thrash: read once, during measuring */
const docTop = (el) => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };


/* ===== core/loop.js ===== */
/* One frame loop for everything that follows the scroll or the pointer.
   Each frame: (1) re-measure if something asked for it, (2) every module reads what it needs, (3) every module
   writes. Reads never come after a write in the same frame, so the browser lays the page out at most once.
   The loop sleeps when nothing moves: scrolling, resizing or a module that is still easing wakes it up. */

const parts = [];      // { read(state), write(state) -> true while it still wants frames }
const measures = [];   // fn(state): heavy measuring, only after resize, load, fonts, language
const state = { y: 0, vh: 0, vw: 0, dy: 0, t: 0, px: -1, py: -1 };

let raf = 0, needMeasure = true, lastY = 0, awake = false;

function frame(part) { parts.push(part); wake(); }
function measure(fn) { measures.push(fn); remeasure(); }
function remeasure() { needMeasure = true; wake(); }

function wake() { if (!raf) raf = requestAnimationFrame(tick); }

function tick(t) {
  raf = 0;
  state.t = t;
  state.y = window.scrollY;
  state.dy = state.y - lastY; lastY = state.y;
  if (needMeasure) {
    needMeasure = false;
    state.vh = window.innerHeight; state.vw = document.documentElement.clientWidth;
    for (const m of measures) m(state);
  }
  for (const p of parts) p.read && p.read(state);
  let more = false;
  for (const p of parts) if (p.write && p.write(state)) more = true;
  awake = more;
  if (more) wake();
}

addEventListener("scroll", wake, { passive: true });
addEventListener("resize", remeasure, { passive: true });
addEventListener("pointermove", (e) => { state.px = e.clientX; state.py = e.clientY; wake(); }, { passive: true });
addEventListener("load", remeasure);
if (document.fonts) document.fonts.ready.then(remeasure);
document.addEventListener("langchange", remeasure);
/* images that arrive later change heights: measure again once each loads */
document.addEventListener("load", (e) => { if (e.target.tagName === "IMG") remeasure(); }, true);
if ("ResizeObserver" in window) {
  let first = true;
  new ResizeObserver(() => { if (first) { first = false; return; } remeasure(); }).observe(document.body);
}
const isAwake = () => awake;


/* ===== core/glide.js ===== */
/* A mouse wheel moves the page in notches; here each notch glides to a soft stop instead. Trackpads and touch are
   already smooth and stay native, and so does anything that scrolls by itself (the message box, sideways rows).
   A key, a press or a link takes over at once. The glide runs inside the one frame loop, so the pinned scenes,
   the travelling dot and the reveals simply follow it. */
function initGlide() {
  if (!fine()) return;
  const TAU = 115;                         // ms: how quickly a notch settles
  let target = 0, cur = 0, on = false, set = -1, lastT = 0;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const scrollsItself = (n) => {
    for (; n && n !== document.body && n !== root; n = n.parentElement) {
      if (n.scrollHeight > n.clientHeight + 1) { const o = getComputedStyle(n).overflowY; if (o === "auto" || o === "scroll") return true; }
    }
    return false;
  };
  addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const notch = e.deltaMode === 1 || Math.abs(e.deltaY) >= 40;
    if (!notch) { on = false; return; }
    if (scrollsItself(e.target)) return;
    e.preventDefault();
    if (!on) { cur = target = window.scrollY; lastT = 0; set = -1; }
    target = clamp(target + (e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY), 0, max());
    on = true; wake();
  }, { passive: false });
  const stop = () => { on = false; };
  addEventListener("keydown", stop); addEventListener("pointerdown", stop);
  frame({
    write(s) {
      if (!on) return false;
      /* someone else moved the page (a link, the scrollbar): let them */
      if (set >= 0 && Math.abs(s.y - set) > 3) { on = false; return false; }
      const dt = lastT ? Math.min(64, s.t - lastT) : 16; lastT = s.t;
      cur += (target - cur) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(target - cur) < .5) { cur = target; on = false; }
      set = Math.round(cur);
      window.scrollTo({ top: cur, left: 0, behavior: "instant" });
      return on;
    },
  });
}


/* ===== features/ui.js ===== */
/* The frame of the page: the opening, theme and language (a circle opens from the click), the menu, the header
   that steps aside while you read, the progress line, the menu link of the section you are in, the clock in
   Larissa, the toast and the copy buttons. */
function initIntro(done) {
  const intro = $("#intro");
  if (!intro || root.classList.contains("seen")) { intro && intro.remove(); done(); return; }
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
  if (!document.startViewTransition) { update(); return; }
  const x = e.clientX || innerWidth / 2, y = e.clientY || 0;
  const vt = document.startViewTransition(update);
  vt.ready.then(() => {
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 560, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" });
  }).catch(() => {});
}

function initTheme() {
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

function initLang() {
  $$("[data-lang]").forEach((b) => b.addEventListener("click", (e) => {
    if (b.dataset.lang === window.I18N.lang) return;
    circleSwap(e, () => window.I18N.set(b.dataset.lang));
  }));
}

function initNav() {
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

function initClock() {
  const els = $$("#clock");
  const tick = () => {
    const t = new Intl.DateTimeFormat(window.I18N?.lang === "en" ? "en-GB" : "el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" }).format(new Date());
    els.forEach((e) => { if (e.textContent !== t) e.textContent = t; });
  };
  tick(); setInterval(tick, 10000);
}

let toastT = 0;
function say(text) {
  const t = $("#toast"); t.textContent = text; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2400);
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); say(T("copied")); } catch { say(T("copyFail")); }
}
function initCopy() { $$("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy))); }


/* ===== features/extras.js ===== */
/* Smaller things that move: the marquee that speeds up with the scroll, numbers that count, the speedometers,
   before/after, the welcome in 15 languages, the versions you drag, the cards that turn, sparks. */
function initMarquee() {
  const tr = $(".marquee-track"); if (!tr) return;
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
function countUp(el, to, dur = 1400) {
  const t0 = performance.now();
  const step = (t) => { const k = clamp((t - t0) / dur); el.textContent = Math.round(to * ease.out(k)); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* the speedometers: ticks drawn once, then the needle sweeps past the mark and settles back, like the logo */
function initGauges() {
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

function initBeforeAfter() {
  const ba = $("#ba"); if (!ba) return;
  const r = $(".ba-range", ba), set = () => ba.style.setProperty("--p", r.value + "%");
  r.addEventListener("input", set); set();
  /* a first nudge so it is clear the handle moves */
  once(ba, () => {
    const t0 = performance.now();
    const nudge = (t) => { const k = Math.min(1, (t - t0) / 1800); r.value = 50 + Math.sin(k * Math.PI * 2) * 24 * (1 - k); set(); if (k < 1) requestAnimationFrame(nudge); };
    requestAnimationFrame(nudge);
  }, { threshold: .6 });
}

const HELLO = [["el", "Καλώς ήρθατε"], ["en", "Welcome"], ["de", "Willkommen"], ["es", "Bienvenidos"], ["ru", "Добро пожаловать"], ["sq", "Mirë se vini"], ["fa", "خوش آمدید"], ["he", "ברוכים הבאים"], ["fr", "Bienvenue"], ["zh", "欢迎"], ["hi", "स्वागत है"], ["ar", "أهلًا وسهلًا"], ["bn", "স্বাগতম"], ["pt", "Bem-vindos"], ["id", "Selamat datang"]];
function initHello() {
  const w = $("#hello"), l = $("#helloL"); if (!w) return;
  let i = 0, on = false;
  const show = () => { const [code, word] = HELLO[i]; w.textContent = word; w.lang = code; w.dir = ["fa", "he", "ar"].includes(code) ? "rtl" : "ltr"; l.textContent = (T("langNames") || {})[code] || code.toUpperCase(); };
  show();
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

function initVersions() {
  const vt = $(".ver-track"); if (!vt) return;
  let down = false, x0 = 0, s0 = 0;
  vt.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; x0 = e.clientX; s0 = vt.scrollLeft; vt.setPointerCapture(e.pointerId); vt.style.cursor = "grabbing"; });
  vt.addEventListener("pointermove", (e) => { if (down) vt.scrollLeft = s0 - (e.clientX - x0); });
  const up = () => { down = false; vt.style.cursor = ""; };
  vt.addEventListener("pointerup", up); vt.addEventListener("pointercancel", up);
}

function initFlips() {
  $$(".person").forEach((p) => p.addEventListener("click", () => p.setAttribute("aria-pressed", String(p.getAttribute("aria-pressed") !== "true"))));
}

/* sparks: red, yellow and green dots fly from a point */
function burst(x, y, n = 18) {
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
function initSparks() {
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn-red,.btn-yel"); if (!b || e.detail === 0) return;
    burst(e.clientX, e.clientY, 14);
  });
}


/* ===== features/play.js ===== */
/* The hero answers a press: wherever you click or tap (not on a link or a button), a red full stop drops onto the
   paper and settles with a bounce, and the pill counts them. With a mouse, the pill also reads out where the
   pointer is. Only a picture: the pill and the dots are aria-hidden. */
function initPlay() {
  const pin = $(".hero-pin"), pill = $("#play"); if (!pin || !pill) return;
  const hint = $("#playHint"), nEl = $("#playN"), xEl = $("#playX"), yEl = $("#playY");
  const label = () => { hint.textContent = T(fine() ? "playFine" : "playTouch"); };
  label(); document.addEventListener("langchange", label);
  pill.classList.toggle("touch", !fine());
  pill.hidden = false;

  /* where the pointer is, in the hero's own pixels, written once a frame at most */
  let px = -1, py = -1, shownX = "", shownY = "";
  pin.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = pin.getBoundingClientRect(); px = Math.max(0, Math.round(e.clientX - r.left)); py = Math.max(0, Math.round(e.clientY - r.top));
  }, { passive: true });
  frame({
    write() {
      if (px < 0) return false;
      const x = String(Math.min(9999, px)).padStart(4, "0"), y = String(Math.min(9999, py)).padStart(4, "0");
      if (x !== shownX) { shownX = x; xEl.textContent = x; }
      if (y !== shownY) { shownY = y; yEl.textContent = y; }
      return false;
    },
  });

  /* a press drops a full stop */
  const dots = []; let n = 0;
  pin.addEventListener("click", (e) => {
    if (e.detail === 0 || e.target.closest("a,button,input,textarea,select,label,summary,[contenteditable]")) return;
    if (getSelection && String(getSelection()).length) return;     // selecting text is not a press
    const r = pin.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const d = document.createElement("i"), ring = document.createElement("i");
    d.className = "drop"; ring.className = "drop-ring";
    const size = 14 + Math.random() * 22;
    for (const el of [d, ring]) { el.style.left = x + "px"; el.style.top = y + "px"; el.style.setProperty("--s", size + "px"); }
    pin.append(ring, d);
    d.animate([
      { transform: "translate(-50%,-50%) translateY(-70px) scale(.25)", opacity: 0 },
      { transform: "translate(-50%,-50%) scale(1.3,.8)", opacity: 1, offset: .55 },
      { transform: "translate(-50%,-50%) scale(.9,1.1)", offset: .78 },
      { transform: "translate(-50%,-50%) scale(1)" },
    ], { duration: 640, easing: "cubic-bezier(.3,.7,.2,1)", fill: "both" });
    ring.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: .9 }, { transform: "translate(-50%,-50%) scale(2.6)", opacity: 0 }],
      { duration: 700, delay: 300, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }).finished.then(() => ring.remove());
    dots.push(d);
    /* the paper only holds so many: the oldest one fades */
    if (dots.length > 24) { const old = dots.shift(); old.animate([{ opacity: 1 }, { opacity: 0, transform: "translate(-50%,-50%) scale(0)" }], { duration: 320, fill: "forwards" }).finished.then(() => old.remove()); }
    n++; nEl.textContent = n;
    pill.classList.remove("pop"); void pill.offsetWidth; pill.classList.add("pop");
    if (n === 10) say(T("play10"));
  });
}

/* ===== features/odometer.js ===== */
/* The numbers under the statement roll into place like an odometer the first time they are seen. Each digit is a
   strip 0–9 twice over, so it rolls past a full turn before it stops. The real figure is kept as .sr text. */
function initOdometers() {
  $$(".odo-num").forEach((el) => {
    const val = el.dataset.odo || el.textContent.trim();
    el.textContent = "";
    const strips = [...val].map((ch) => {
      const col = document.createElement("span"), strip = document.createElement("span");
      col.className = "odo-col"; strip.className = "odo-strip";
      if (/\d/.test(ch)) { strip.textContent = "01234567890123456789".split("").join("\n"); strip.dataset.d = ch; }
      else strip.textContent = ch;
      col.append(strip); el.append(col);
      return strip;
    });
    once(el, () => strips.forEach((s, i) => {
      if (!s.dataset.d) return;
      s.style.transitionDelay = (strips.length - 1 - i) * 120 + "ms";
      s.style.transform = `translate3d(0,${-(10 + +s.dataset.d) * 5}%,0)`;
    }), { threshold: .6 });
  });
}

/* ===== features/slider.js ===== */
/* Our story as a slider: a plain scrolling row (so a finger, a trackpad and the arrow keys just work), plus a
   counter, a bar, two buttons, and dragging with the mouse. */
function initStorySlider() {
  const line = $("#storyLine"); if (!line) return;
  const items = $$("li", line), now = $("#storyNow"), all = $("#storyAll"), bar = $("#storyBar"), prev = $("#storyPrev"), next = $("#storyNext");
  const pad = (k) => String(k).padStart(2, "0");
  all.textContent = pad(items.length);
  /* one step: from one card to the next */
  const step = () => { const a = items[0].getBoundingClientRect(), b = items[1] ? items[1].getBoundingClientRect() : a; return Math.abs(b.left - a.left) || a.width; };
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = line.scrollWidth - line.clientWidth, x = line.scrollLeft, p = max > 0 ? clamp(x / max) : 0;
    bar.style.transform = `scaleX(${Math.max(.08, p)})`;
    /* the card at the left edge; at the very end, the last card */
    const atEnd = x >= max - 8, i = atEnd ? items.length - 1 : Math.min(items.length - 1, Math.round(x / step()));
    now.textContent = pad(i + 1);
    prev.disabled = x <= 8; next.disabled = atEnd;
  };
  const later = () => { if (!raf) raf = requestAnimationFrame(update); };
  line.addEventListener("scroll", later, { passive: true });
  addEventListener("resize", later, { passive: true });
  update();
  prev.addEventListener("click", () => line.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => line.scrollBy({ left: step(), behavior: "smooth" }));
  /* drag with a mouse; the row settles on the nearest step when you let go */
  let down = false, x0 = 0, s0 = 0, moved = false;
  line.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.button) return; down = true; moved = false; x0 = e.clientX; s0 = line.scrollLeft; line.setPointerCapture(e.pointerId); line.classList.add("dragging"); });
  line.addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - x0; if (Math.abs(dx) > 3) moved = true; line.scrollLeft = s0 - dx; });
  const up = () => {
    if (!down) return; down = false;
    const st = step(), to = Math.round(line.scrollLeft / st) * st;
    line.classList.remove("dragging");
    line.scrollTo({ left: to, behavior: "smooth" });
  };
  line.addEventListener("pointerup", up); line.addEventListener("pointercancel", up);
  line.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
}

/* ===== features/reveal.js ===== */
/* Headings rise word by word; blocks settle in as they arrive. */
/* Blocks that settle in as a whole. Paragraphs that arrive line by line, images that unveil and the chapter leads
   that fill in with the scroll are handled by initScenes below, so they are not in this list. */
const BLOCKS = [
  ".index li", ".ch-kicker", ".ch-intro", ".shot", ".film figcaption", ".fact", ".ba-copy > .h3", ".gauge",
  ".versions-head", ".ver-track", ".built", ".hello-card", ".hello-block .h3", ".poster-copy > .h3", ".steps .step", ".proc-visual",
  ".person", ".plus", ".equals", ".story-line li", ".toy", ".qa details", ".contact-copy > :not(h2):not(.lead):not(.how)",
  ".contact-form .field", "#form > .btn", ".form-note", ".ftr-cols > div", ".how li",
  ".odo li", ".slider-tools", ".chat-head", "#form > .bubble.bot", "#form > .quick-services",
].join(",");

/* split a heading's words into masks; the language switch writes new text, so this runs again after it */
function splitWords(scope = document) {
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

function initReveal() {
  splitWords();
  const heads = $$("h1:has(.words), h2:has(.words)");
  const blocks = $$(BLOCKS);
  /* stagger siblings that arrive together */
  blocks.forEach((b) => {
    const sibs = [...b.parentElement.children].filter((c) => c.matches(BLOCKS));
    b.style.setProperty("--i", Math.min(sibs.indexOf(b), 6));
    b.classList.add(b.matches(".gauge, .person, .toy, .hello-card, .how li") ? "rv-scale" : b.matches(".qa details") ? "rv-x" : "rv");
  });
  if (!("IntersectionObserver" in window)) { [...heads, ...blocks].forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  [...heads, ...blocks].forEach((e) => { if (!e.closest(".hero")) io.observe(e); });
  $$("svg .d").forEach((d) => io.observe(d.closest("svg")));
  root.classList.add("reveal-ready");

  document.addEventListener("langchange", () => {
    splitWords();
    /* headings already on the page show at once in the new language */
    heads.forEach((h) => { if (h.classList.contains("in")) { h.classList.remove("in"); void h.offsetWidth; h.classList.add("in"); } });
  });
}


/* ===== features/scenes.js ===== */
/* The page appears in front of you as you scroll.
   - Paragraphs arrive line by line: each visual line rises out of its own mask, a beat after the line above.
     The lines are found by measuring the words, and found again when the paragraph's width or language changes.
     Once a paragraph has arrived its masks stop clipping, so the finished page costs nothing extra to draw.
   - The four chapter leads fill in like ink: each word darkens as the reading line passes it.
   - Screens and the poster unveil from below, then drift a little against the scroll (with a mouse only).
   - In the red index the rules draw themselves and the big names drift sideways with the scroll.
   - The statement fills in like the chapter leads, and its little project screens pop in as the reading line
     reaches them.
   - Sticky notes are stuck on one after the other; the footer word builds itself letter by letter.
   Hidden states exist only under html.scenes, which is added at the end of a successful start, so if anything here
   fails, everything is simply visible. */
const LINES = ".sec-head .lead, .story-head > .h3, .poster-copy > p:not(.built), .ba-copy > p, .hello-block p, .contact-copy > .lead, .index-name";
const INK = ".ch-intro .lead, .stmt [data-t]";
const UNVEIL = ".film img, .poster-img, .ba";

/* words into spans; the text itself stays the same string, so the language switch can compare it */
const plain = (el) => el.textContent.replace(/\s+/g, " ").trim();
function splitInto(el, cls) {
  const text = plain(el);
  if (el.dataset.split === text && el.querySelector("." + cls)) return false;
  el.dataset.split = text;
  el.textContent = "";
  text.split(" ").forEach((word, i, all) => {
    const w = document.createElement("span"); w.className = cls; w.textContent = word; el.append(w);
    if (i < all.length - 1) el.append(" ");
  });
  return true;
}

/* Paragraphs into visual lines, each its own mask. Built for a width; built again only when the width or the text
   changes. All paragraphs are done together: first every one is split into words (writes), then every word is
   measured (one layout), then the lines are written. */
function buildLines(els) {
  const widths = new Map();
  const todo = els.filter((el) => { const t = plain(el), w = el.clientWidth; widths.set(el, w); return el.dataset.split !== t || +el.dataset.lw !== w || !el.querySelector(".ll"); });
  if (!todo.length) return;
  todo.forEach((el) => { splitInto(el, "lwd"); });
  const groups = todo.map((el) => {
    const out = []; let top = null;
    $$(".lwd", el).forEach((w) => { const t = w.offsetTop; if (top === null || Math.abs(t - top) > 3) { top = t; out.push([]); } out[out.length - 1].push(w.textContent); });
    return out;
  });
  todo.forEach((el, k) => {
    /* (the width read before any write: splitting into words never changes it) */
    el.dataset.lw = widths.get(el);
    el.textContent = "";
    groups[k].forEach((words, l) => {
      const m = document.createElement("span"), inner = document.createElement("span");
      m.className = "ll"; inner.className = "lli"; inner.textContent = words.join(" "); inner.style.setProperty("--l", l);
      m.append(inner); el.append(m);
      if (l < groups[k].length - 1) el.append(" ");
    });
  });
}

function initScenes() {
  if (!("IntersectionObserver" in window)) return;
  const lines = $$(LINES), inks = $$(INK), unveils = $$(UNVEIL);
  inks.forEach((el) => splitInto(el, "iw"));
  buildLines(lines);
  lines.forEach((el) => el.classList.add("ls"));
  inks.forEach((el) => el.classList.add("ink"));

  /* phones: the thumbnails in the index are part of the rows, so they unveil too */
  if (!fine()) unveils.push(...$$(".index-thumb"));
  /* An unveil is a curtain made only of transforms (cheap: no repaint while it moves): a window (.uvm) rises
     from below while the screen inside it moves the other way, so the screen seems to stay put while it is
     uncovered. The window is a little larger than the screen, so hard shadows and tilted corners show. */
  const masks = unveils.map((el) => {
    const m = document.createElement(el.tagName === "DIV" ? "div" : "span");
    m.className = "uvm";
    el.before(m); m.append(el); el.classList.add("uv");
    return m;
  });

  /* one-shot arrivals; a curtain is watched through the box around it (its figure, block or row), which never moves */
  const watchFor = new Map();
  lines.forEach((el) => watchFor.set(el, el));
  masks.forEach((m) => watchFor.set(m.parentElement.closest(".film, .poster, .ba-block, .index-row") || m.parentElement, m));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = watchFor.get(e.target);
    if (el.classList.contains("ls")) {
      el.classList.add("ls-in");
      /* arrived: the masks stop clipping (the last line starts at --l × 90 ms and takes 1.1 s) */
      setTimeout(() => el.classList.add("ls-done"), 1400 + el.querySelectorAll(".ll").length * 90 + 400);
    }
    if (el.classList.contains("uvm")) {
      el.classList.add("uv-in");
      /* once it has opened, the window stops clipping, so the focus ring is never cut */
      setTimeout(() => el.classList.add("uv-done"), 1700);
    }
  }), { threshold: .15, rootMargin: "0px 0px -8% 0px" });
  watchFor.forEach((_, target) => io.observe(target));

  /* sticky notes keep their crooked rest; they arrive more crooked, from alternate sides */
  $$(".notes .fact").forEach((f, i) => f.style.setProperty("--tilt", (i % 2 ? 6 : -6) + "deg"));

  const pics = $$(".stmt-img");
  const names = $$(".index-name");
  const foot = $(".ftr-word");
  let letters = [];
  if (foot) {
    const txt = [...foot.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (txt) {
      const frag = document.createDocumentFragment();
      letters = [...txt.textContent.trim()].map((ch) => { const s = document.createElement("span"); s.className = "fl"; s.textContent = ch; frag.append(s); return s; });
      txt.replaceWith(frag);
    }
  }

  /* measured: the lines, where each ink word is, the names and screens that drift, the story rows, the footer */
  let inkWords = [], picsAt = [], drift = [], par = [], footTop = 0, parOn = false, footP = -1;
  measure((s) => {
    /* lines first (they can change heights, which everything below measures); then only reads, then writes */
    buildLines(lines);
    inkWords = inks.map((el) => ({ el, top: el.getBoundingClientRect().top + s.y, bot: el.getBoundingClientRect().bottom + s.y, words: $$(".iw", el).map((w) => ({ w, y: w.getBoundingClientRect().top + s.y, o: -1 })) }));
    drift = names.map((n, i) => { const r = n.getBoundingClientRect(); return { n, mid: r.top + s.y + r.height / 2, dir: i % 2 ? -1 : 1, x: null }; });
    parOn = fine() && s.vw >= 900;
    par = masks.filter((m) => !m.querySelector(".index-thumb")).map((u) => { const r = u.parentElement.getBoundingClientRect(); return { u, mid: r.top + s.y + r.height / 2, y: null }; });
    picsAt = pics.map((el) => { const r = el.getBoundingClientRect(); return { el, y: r.top + s.y + r.height * .3, on: null }; });
    footTop = foot ? foot.getBoundingClientRect().top + s.y : 0;
    drift.forEach((d) => { d.x = null; }); par.forEach((p) => { p.y = null; }); inkWords.forEach((k) => k.words.forEach((w) => { w.o = -1; }));
    root.classList.toggle("par", parOn); footP = -1;
  });

  frame({
    write(s) {
      const vh = s.vh, y = s.y;
      /* ink: each word darkens over a short stretch as the reading line (80% down the window) passes it */
      const line = y + vh * .8, span = vh * .14;
      for (const k of inkWords) {
        if (k.bot < y - vh * .2 || k.top > y + vh * 1.2) continue;
        for (const w of k.words) {
          const o = Math.round((.18 + .82 * clamp((line - w.y) / span)) * 100) / 100;
          if (o !== w.o) { w.o = o; w.w.style.opacity = String(o); }
        }
      }
      /* the big names in the index drift a little sideways, alternately, with the scroll */
      for (const d of drift) {
        const q = (d.mid - (y + vh / 2)) / vh;
        if (q < -1.2 || q > 1.2) continue;
        const x = Math.round(clamp(q, -1, 1) * s.vw * .028 * d.dir * 10) / 10;
        if (x !== d.x) { d.x = x; d.n.style.transform = `translate3d(${x}px,0,0)`; }
      }
      /* screens drift against the scroll, with a mouse and a wide window only */
      /* (the curtain uses transform; the drift uses the separate translate property, so the two never fight) */
      for (const p of par) {
        const q = p.mid - (y + vh / 2);
        if (Math.abs(q) > vh * 1.3) continue;
        const v = parOn ? Math.round(clamp(q * -.05, -24, 24)) : 0;
        if (v !== p.y) { p.y = v; p.u.style.translate = v ? `0 ${v}px` : ""; }
      }
      /* the screens inside the statement pop in when the reading line reaches them */
      for (const p of picsAt) {
        const on = line > p.y;
        if (on !== p.on) { p.on = on; p.el.classList.toggle("on", on); }
      }
      /* the footer word builds itself, letter by letter, as the footer comes up */
      if (letters.length && y + vh > footTop - 40) {
        const p = clamp((y + vh - footTop) / (vh * .55));
        if (p !== footP) {
          footP = p;
          letters.forEach((l, i) => {
            const k = Math.round(ease.out(clamp(p * 1.6 - i * .1)) * 1000) / 1000;
            l.style.transform = k >= 1 ? "" : `translate3d(0,${(1 - k) * 60}%,0) rotate(${(1 - k) * 10}deg)`;
            l.style.opacity = k >= 1 ? "" : String(k);
          });
          foot.classList.toggle("building", p > 0 && p < 1);
        }
      }
      return false;
    },
  });

  /* the real font changes where lines break: build them once more when it has loaded */
  if (document.fonts) document.fonts.ready.then(() => { lines.forEach((el) => { delete el.dataset.lw; }); remeasure(); });
  /* the language switch writes new text: split again, then the loop measures the new lines */
  document.addEventListener("langchange", () => {
    inks.forEach((el) => splitInto(el, "iw"));
    /* paragraphs that have already arrived are rebuilt in place, without rising again */
    buildLines(lines);
    remeasure();
  });
  /* printing shows everything */
  addEventListener("beforeprint", () => { lines.forEach((el) => el.classList.add("ls-in")); masks.forEach((m) => m.classList.add("uv-in", "uv-done")); });
  root.classList.add("scenes");
}


function initHeroVideo() {
  const hero = $(".hero");
  const background = $(".hero-background-video");
  const film = $(".hero-clip");
  const watch = (video, target, rootMargin) => {
    if (!video || !target) return;
    let inView = true;
    const sync = () => {
      if (!inView || document.hidden) { video.pause(); return; }
      video.play().catch(() => {});
    };
    if ("IntersectionObserver" in window) {
      inView = false;
      const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { rootMargin, threshold: .01 });
      io.observe(target);
    }
    document.addEventListener("visibilitychange", sync);
    sync();
  };
  watch(background, hero, "0px");
  watch(film, film, "80px");
}
/* ===== features/traveler.js ===== */
/* The travelling full stop.
   teleia is Greek for "full stop". One red dot is the hero's full stop; as you scroll it grows until the page falls
   into it (the red of the work section). From there a dot travels with you: it waits on the rail in the left margin
   while you read and jumps into place as the full stop of every heading you reach. Headings it has not reached yet
   have no full stop. Everything here is only a picture (aria-hidden). */
const ANCHOR = .36;      // the reading line, as a share of the window height
const RAIL_SIZE = 12;    // px, the dot while it waits on the rail

function initTraveler() {
  const dot = $("#traveler"), ball = $("i", dot), railEl = $("#rail"), zoom = $("#zoom");
  const heroStop = $('.stop[data-stop="hero"]'), work = $("#work");
  const all = $$(".stop[data-stop]").filter((s) => s !== heroStop);
  root.classList.add("travel");
  heroStop.classList.add("landed");

  /* measured: where each stop is reached, and the sections where the dot turns yellow (on red) */
  let stops = [], workTop = 0, zoomEnd = 0, zoomStart = 0, zoomable = false, colorZones = [], railX = 0, anchorY = 0, showRail = true;
  measure((s) => {
    anchorY = s.vh * ANCHOR;
    showRail = true;
    railX = parseFloat(getComputedStyle(root).getPropertyValue("--gutter")) || 16;
    railX = Math.max(s.vw >= 900 ? 14 : 8, railX / 2);
    const maxScroll = document.documentElement.scrollHeight - s.vh;
    /* the hero holds still while its full stop grows, if it fits in the window */
    const hero = $(".hero"), pin = $(".hero-pin");
    zoomable = pin.offsetHeight <= s.vh * 1.06 || s.vw < 960;
    root.classList.toggle("zoomable", zoomable);
    /* On phones, wait until the checklist scrolls clear before starting the red wipe. */
    const ticks = $(".ticks");
    zoomStart = s.vh * .04;
    if (s.vw < 960 && ticks) zoomStart = Math.max(zoomStart, docTop(ticks) + ticks.offsetHeight);
    zoomEnd = docTop(hero) + hero.offsetHeight - s.vh;
    workTop = docTop(work);
    const pinned = root.classList.contains("pin");
    let list = all.map((el) => {
      const r = el.getBoundingClientRect(), mid = r.top + r.height / 2;
      let trig;
      const pin = pinned && el.closest(".proc-pin");
      if (pin) {
        const sec = pin.parentElement, off = mid - pin.getBoundingClientRect().top;
        trig = docTop(sec) + Math.min(0, off - anchorY);
      } else trig = mid + s.y - anchorY;
      return { el, trig: Math.min(trig, maxScroll - 2) };
    });
    /* stops too close to the next one (the end of the page) are printed, not travelled to */
    for (let k = list.length - 2; k >= 0; k--) if (list[k].trig > list[k + 1].trig - 160) { list[k].el.classList.add("landed"); list.splice(k, 1); }
    stops = list;
    colorZones = $$("[data-dot-color]").map((z) => ({ top: docTop(z), bot: docTop(z) + z.offsetHeight, c: z.dataset.dotColor }));
  });
  work.dataset.dotColor = "yel";

  let A = null, B = null, k = -1, zoomOn = false, heroR = null;
  frame({
    read(s) {
      const y = s.y;
      heroR = y < workTop + 10 ? heroStop.getBoundingClientRect() : null;
      k = -1;
      for (let i = 0; i < stops.length; i++) if (y >= stops[i].trig) k = i;
      A = k >= 0 ? stops[k].el.getBoundingClientRect() : null;
      B = k + 1 < stops.length ? stops[k + 1].el.getBoundingClientRect() : null;
    },
    write(s) {
      const y = s.y;
      /* 1. the zoom: while the hero holds still, its full stop grows until the window is red; the red section
         then slides in underneath, red on red, and takes over */
      const p = clamp((y - zoomStart) / Math.max(1, zoomEnd - zoomStart));
      if (zoomable && heroR && p > 0 && y < workTop) {
        /* The phone copy has scrolled clear; grow the wipe from the held collage. */
        const mobile = s.vw < 960;
        const stageR = mobile ? $(".stage").getBoundingClientRect() : null;
        const ox = mobile ? stageR.left + stageR.width / 2 : heroR.left + heroR.width / 2,
          oy = mobile ? stageR.top + stageR.height / 2 : heroR.top + heroR.height / 2;
        const far = Math.hypot(Math.max(ox, s.vw - ox), Math.max(oy, s.vh - oy));
        const sc = lerp(heroR.width / 2000, far / 1000 + .01, Math.pow(p, 2.4));
        zoom.style.transform = `translate3d(${ox}px,${oy}px,0) scale(${sc})`;
        if (!zoomOn) { zoom.style.opacity = "1"; zoomOn = true; }
      } else if (zoomOn) { zoom.style.opacity = "0"; zoomOn = false; }

      /* 2. headings the dot has reached show their own full stop */
      stops.forEach((st, i) => st.el.classList.toggle("landed", i <= k));

      /* 3. the travelling dot */
      if (k < 0 && !B) { dot.style.opacity = "0"; return; }
      let x, yy, size;
      const rail = { x: railX, y: anchorY, size: showRail ? RAIL_SIZE : 0 };
      const at = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width });
      if (k < 0) {
        /* before the first stop (inside the red section): it waits, hidden, until it leaves for the first heading */
        const t = clamp((y - (stops[0].trig - s.vh * .5)) / (s.vh * .5));
        const b = at(B), q = ease.inOut(t);
        x = lerp(rail.x, b.x, q); yy = lerp(rail.y, b.y, q); size = lerp(0, b.size, q);
      } else {
        const a = at(A), segEnd = B ? stops[k + 1].trig : Infinity;
        const D = Math.min(s.vh * .45, (segEnd - stops[k].trig) / 3);
        const gone = y - stops[k].trig, left = segEnd - y;
        if (B && left < D) {
          const b = at(B), q = ease.inOut(1 - left / D);
          x = lerp(rail.x, b.x, q); yy = lerp(rail.y, b.y, q) - Math.sin(q * Math.PI) * 40; size = lerp(rail.size, b.size, q);
        } else if (gone < D) {
          const q = ease.inOut(gone / D);
          x = lerp(a.x, rail.x, q); yy = lerp(a.y, rail.y, q) - Math.sin(q * Math.PI) * 30; size = lerp(a.size, rail.size, q);
        } else { x = rail.x; yy = rail.y; size = rail.size; }
      }
      /* stretch a little in the direction it moves, like ink that is still wet */
      const v = clamp(Math.abs(s.dy) / 40, 0, .35);
      ball.style.transform = `translate3d(${x}px,${yy}px,0) scale(${(size / 100) * (1 - v * .4)},${(size / 100) * (1 + v)})`;
      dot.style.opacity = size > .5 ? "1" : "0";
      /* yellow over the red section */
      const docY = y + yy; let c = "";
      for (const z of colorZones) if (docY >= z.top && docY < z.bot) c = z.c;
      dot.dataset.c = c;
      railEl.classList.toggle("on", showRail && k >= 0);
      return false;
    },
  });
}


/* ===== features/gallery.js ===== */
/* The project screens travel sideways while the section is pinned. Touch momentum is eased so a fast swipe still
   carries the intervening screens through the viewport. On very short windows, the screenshots form a swipeable row. */
function initPin() {
  const set = () => { root.classList.toggle("pin", pinMQ.matches); remeasure(); };
  pinMQ.addEventListener("change", set);
  set();
}

function initGalleries() {
  $$("[data-gallery]").forEach((gal) => {
    const track = $(".gal-track", gal), shots = $$(".shot", track), now = $("[data-gal-now]", gal), bar = $("[data-gal-bar]", gal);
    const n = shots.length;
    gal.style.setProperty("--n", n);
    let top = 0, h = 0, range = 0, vis = false, p = 0, painted = -1, centers = [];
    measure((s) => {
      top = gal.getBoundingClientRect().top + s.y; h = gal.offsetHeight;
      range = Math.max(0, track.scrollWidth - s.vw);
      centers = shots.map((sh) => sh.offsetLeft + sh.offsetWidth / 2);
      painted = -1;
    });
    const show = (q) => {
      const i = Math.min(n - 1, Math.round(q * (n - 1)));
      if (now.textContent !== String(i + 1)) now.textContent = i + 1;
      bar.style.transform = `scaleX(${Math.max(.06, q)})`;
    };
    frame({
      read(s) { vis = s.y + s.vh > top && s.y < top + h; },
      write(s) {
        if (!vis || !root.classList.contains("pin")) return false;
        const target = clamp((s.y - top) / Math.max(1, h - s.vh));
        /* Touch momentum can move through several cards between frames. Ease the scrubber to
           the finger's new position so the intervening screens still travel across the viewport. */
        p = fine() ? target : lerp(p, target, .18);
        if (Math.abs(target - p) < .001) p = target;
        if (Math.abs(p - painted) > .0005) {
          painted = p;
          const x = p * range;
          track.style.transform = `translate3d(${-x}px,0,0)`;
          /* each screen leans as it travels through the window, and stands straight in the middle */
          const mid = x + s.vw / 2;
          shots.forEach((sh, i) => {
            const d = clamp((centers[i] - mid) / s.vw, -1, 1);
            sh.style.transform = `perspective(1400px) rotateY(${d * -14}deg) scale(${1 - Math.abs(d) * .08})`;
          });
          show(p);
        }
        return !fine() && Math.abs(target - p) >= .001;
      },
    });
    /* with the keyboard: while pinned, the arrows move one screen (by scrolling the page the right amount) */
    track.addEventListener("keydown", (e) => {
      if (!root.classList.contains("pin") || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      e.preventDefault();
      const step = (h - innerHeight) / Math.max(1, n - 1);
      window.scrollBy({ top: e.key === "ArrowRight" ? step : -step, behavior: "smooth" });
    });
    /* swiped by hand */
    track.addEventListener("scroll", () => {
      if (root.classList.contains("pin")) return;
      show(clamp(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)));
    }, { passive: true });
    pinMQ.addEventListener("change", () => { track.style.transform = ""; shots.forEach((sh) => (sh.style.transform = "")); p = 0; painted = -1; });
  });
}


/* ===== features/process.js ===== */
/* "From a line to a website": while the section is pinned, the scroll draws the sketch, colours it in, then wipes
   the real website over it and stamps it "online". The five steps light up one after the other. */
function initProcess() {
  const sec = $("#process"); if (!sec) return;
  const paths = $$(".proc-sketch path", sec), design = $(".proc-design", sec), site = $(".proc-site", sec),
    stamp = $(".proc-stamp", sec), url = $(".proc-url", sec), steps = $$(".step", sec), phases = $$(".proc-phases li", sec);
  const URLS = ["sketch.teleia", "design.teleia", "7o-epal-project.vercel.app"];
  let top = 0, h = 0, vis = false, last = -1;
  measure((s) => { top = sec.getBoundingClientRect().top + s.y; h = sec.offsetHeight; });

  const paint = (p) => {
    const draw = clamp(p / .3), col = clamp((p - .3) / .16), wipe = clamp((p - .52) / .22);
    paths.forEach((d, i) => { d.style.strokeDashoffset = String(1 - clamp(draw * paths.length - i * .6)); });
    design.style.opacity = String(col);
    sec.querySelector(".proc-sketch").style.opacity = String(1 - wipe * .9);
    site.style.clipPath = `inset(0 ${(1 - wipe) * 100}% 0 0)`;
    stamp.classList.toggle("on", p > .8);
    const ph = p < .3 ? 0 : p < .55 ? 1 : 2;
    if (url.textContent !== URLS[ph]) url.textContent = URLS[ph];
    phases.forEach((li, i) => li.classList.toggle("on", i === ph));
    const a = Math.min(steps.length - 1, Math.floor(p * steps.length * 1.05));
    steps.forEach((li, i) => { li.classList.toggle("on", i === a); li.classList.toggle("done", i < a); });
  };

  frame({
    read(s) { vis = s.y + s.vh > top && s.y < top + h; },
    write(s) {
      if (!root.classList.contains("pin")) {
        if (last !== 2) { paint(1); steps.forEach((li) => li.classList.remove("on", "done")); last = 2; }
        return false;
      }
      if (!vis) return false;
      const target = clamp((s.y - top) / Math.max(1, h - s.vh));
      const current = last >= 0 && last <= 1 ? last : 0;
      const p = fine() ? target : lerp(current, target, .18);
      if (Math.abs(target - p) < .001) {
        if (p !== last) { last = target; paint(target); }
        return false;
      }
      if (p !== last) { last = p; paint(p); }
      return true;
    },
  });
}


/* ===== features/pointer.js ===== */
/* Everything that answers the pointer: the screens in the hero (depth with the pointer and the scroll), buttons
   that lean towards it, the project thumbnail that follows it over the work list, and the ring that says what a
   click does. The ring and the thumbnail only on devices with a mouse. */
function initStage() {
  const stage = $("#stage"); if (!stage) return;
  const layers = $$(".layer", stage), depth = [.5, .9, 1.4, 1.8, 1.2, 1.6];
  let r = null, mx = 0, my = 0, tx = 0, ty = 0, vis = true, sy = 0;
  measure(() => { r = stage.getBoundingClientRect(); r = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 + window.scrollY }; });
  frame({
    read(s) { vis = s.y < s.vh * 1.2; sy = s.y; },
    write(s) {
      if (!vis || !r) return false;
      if (fine() && s.px >= 0) { tx = clamp((s.px - r.cx) / s.vw, -.5, .5); ty = clamp((s.py - (r.cy - sy)) / s.vh, -.5, .5); }
      mx = lerp(mx, tx, .08); my = lerp(my, ty, .08);
      layers.forEach((l, i) => {
        const d = depth[i] || 1;
        l.style.transform = `translate3d(${mx * -36 * d}px,${my * -26 * d - sy * .12 * d}px,0)`;
      });
      return Math.abs(mx - tx) > .001 || Math.abs(my - ty) > .001;
    },
  });
}

function initMagnets() {
  $$(".magnet").forEach((b) => {
    let box = null, on = false, x = 0, y = 0, tx = 0, ty = 0;
    b.addEventListener("pointerenter", (e) => { if (e.pointerType !== "mouse") return; box = b.getBoundingClientRect(); on = true; });
    b.addEventListener("pointerleave", () => { on = false; tx = ty = 0; });
    frame({
      write(s) {
        if (on && box) { tx = (s.px - (box.left + box.width / 2)) * .28; ty = (s.py - (box.top + box.height / 2)) * .38; }
        x = lerp(x, tx, .2); y = lerp(y, ty, .2);
        if (Math.abs(x) < .05 && Math.abs(y) < .05 && !on) { if (b.style.transform) b.style.transform = ""; return false; }
        b.style.transform = `translate3d(${x}px,${y}px,0)`;
        return true;
      },
    });
    /* the box moves with the page; measure again when the page scrolls under a hovering pointer */
    addEventListener("scroll", () => { if (on) box = b.getBoundingClientRect(); }, { passive: true });
  });
}

function initIndexThumbs() {
  if (!fine()) return;
  $$(".index-row").forEach((row) => {
    const th = $(".index-thumb", row);
    let on = false, x = 0, y = 0;
    row.addEventListener("pointerenter", () => { on = true; x = state.px; y = state.py; });
    row.addEventListener("pointerleave", () => { on = false; });
    frame({
      write(s) {
        if (!on) return false;
        x = lerp(x, s.px, .14); y = lerp(y, s.py, .14);
        th.style.left = "0"; th.style.top = "0";
        th.style.transform = `translate3d(${x + 28}px,${y - 120}px,0)`;
        return Math.abs(x - s.px) > .3 || Math.abs(y - s.py) > .3;
      },
    });
  });
}

function initCursor() {
  const c = $("#cursor"); if (!c || !fine()) return;
  const label = $(".cursor-label", c);
  let x = -100, y = -100, shown = false;
  const HOT = "a,button,summary,input[type=range],.pad,[data-cursor]";
  document.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    const t = e.target.closest(HOT), say = e.target.closest("[data-cursor]");
    c.classList.toggle("hot", !!t && !say);
    c.classList.toggle("says", !!say);
    if (say) label.textContent = T(say.dataset.cursor);
    /* over text fields the ring steps aside, so the text cursor is clear */
    c.classList.toggle("on", !e.target.closest("input:not([type=range]),textarea"));
    shown = true;
  });
  document.addEventListener("pointerleave", () => c.classList.remove("on"));
  document.addEventListener("pointerdown", () => c.classList.add("down"));
  document.addEventListener("pointerup", () => c.classList.remove("down"));
  frame({
    write(s) {
      if (!shown || s.px < 0) return false;
      x = lerp(x, s.px, .3); y = lerp(y, s.py, .3);
      c.style.transform = `translate3d(${x}px,${y}px,0)`;
      return Math.abs(x - s.px) > .2 || Math.abs(y - s.py) > .2;
    },
  });
}


/* ===== features/lab.js ===== */
/* The lab: find the bugs, draw a line, the commands that run before every delivery, this page measured live. */
function bugs() {
  const code = $("#bugCode"), n = $("#bugN"), why = $("#bugWhy"); if (!code) return;
  const lines = $$("li[data-bug]", code).map((li) => ({ li, orig: $("code", li).textContent }));
  let found = new Set();
  const hint = () => (window.I18N.lang === "en" ? window.I18N.keys.EN.bugHint : window.I18N.keys.EL.bugHint);
  const reset = () => {
    found = new Set();
    lines.forEach(({ li, orig }) => { li.classList.remove("fixed"); $("code", li).textContent = orig; $("button", li).disabled = false; });
    n.textContent = "0"; why.textContent = hint();
  };
  code.addEventListener("click", (e) => {
    const li = e.target.closest("li"); if (!li) return;
    if (!li.dataset.bug) { li.classList.remove("no"); void li.offsetWidth; li.classList.add("no"); why.textContent = T("bugNo"); return; }
    if (found.has(li.dataset.bug)) return;
    found.add(li.dataset.bug); li.classList.add("fixed"); $("code", li).textContent = li.dataset.fix; $("button", li).disabled = true;
    n.textContent = found.size; n.parentElement.classList.remove("pop"); void n.offsetWidth; n.parentElement.classList.add("pop");
    why.textContent = T("bug" + li.dataset.bug);
    const r = li.getBoundingClientRect(); burst(r.left + 60, r.top + r.height / 2, 12);
    if (found.size === 3) setTimeout(() => { why.textContent = T("bugDone"); const c = code.getBoundingClientRect(); burst(c.left + c.width / 2, c.top + c.height / 2, 60); }, 900);
  });
  $("#bugReset").addEventListener("click", reset);
}

function draw() {
  const pad = $("#pad"); if (!pad) return;
  const box = pad.parentElement, ctx = pad.getContext("2d");
  let pts = [], drawing = false, replay = 0;
  const ink = () => getComputedStyle(root).getPropertyValue("--ink").trim() || "#141414";
  const paint = (p, upto, dot) => {
    ctx.clearRect(0, 0, pad.width, pad.height);
    if (p.length < 2) return;
    ctx.lineCap = ctx.lineJoin = "round"; ctx.strokeStyle = ink(); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < Math.min(upto, p.length) - 1; i++) ctx.quadraticCurveTo(p[i].x, p[i].y, (p[i].x + p[i + 1].x) / 2, (p[i].y + p[i + 1].y) / 2);
    ctx.stroke();
    if (dot) { const e = p[p.length - 1]; ctx.fillStyle = "#B5172B"; ctx.beginPath(); ctx.arc(e.x + 12, e.y, dot, 0, 7); ctx.fill(); }
  };
  const size = () => { const r = box.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); pad.width = r.width * d; pad.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); paint(pts, pts.length); };
  const pos = (e) => { const r = pad.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  pad.addEventListener("pointerdown", (e) => { cancelAnimationFrame(replay); drawing = true; pts = [pos(e)]; box.classList.add("used"); pad.setPointerCapture(e.pointerId); });
  pad.addEventListener("pointermove", (e) => { if (!drawing) return; pts.push(pos(e)); paint(pts, pts.length); });
  const end = () => {
    if (!drawing) return; drawing = false;
    if (pts.length < 4) return;
    const t0 = performance.now(), dur = Math.min(1600, 300 + pts.length * 6);
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur); paint(pts, Math.max(2, Math.round(pts.length * k)));
      if (k < 1) { replay = requestAnimationFrame(step); return; }
      let s = 0;
      const grow = () => { s += 1.2; paint(pts, pts.length, Math.min(9, s));
        if (s < 9) replay = requestAnimationFrame(grow);
        else { const r = pad.getBoundingClientRect(), e2 = pts[pts.length - 1]; burst(r.left + e2.x + 12, r.top + e2.y, 14); say(T("drawDone")); } };
      grow();
    };
    replay = requestAnimationFrame(step);
  };
  pad.addEventListener("pointerup", end); pad.addEventListener("pointercancel", end);
  $("#padClear").addEventListener("click", () => { cancelAnimationFrame(replay); pts = []; box.classList.remove("used"); paint(pts, 0); });
  addEventListener("resize", size); size();
  document.addEventListener("themechange", () => paint(pts, pts.length, pts.length > 3 ? 9 : 0));
}

function terminal() {
  const tty = $("#tty"); if (!tty) return;
  const SCRIPT = [
    ["p", "$ ", "c", "python3 tools/version.py"], ["dim", "version e70c1a21b6 written to 6 pages\n"],
    ["p", "$ ", "c", "node tools/test_api.mjs"], ["dim", "  ok 1 … ok 20\n"], ["ok", "all 20 checks passed\n"],
    ["p", "$ ", "c", "python3 func22.py && python3 func23.py"], ["ok", "20 / 20 passed\n14 / 14 passed\n"],
    ["p", "$ ", "c", "python3 audit.py"], ["ok", "internal links: 134 bad: []\n"], ["p", "$ ", "c", "# ready to ship."],
  ];
  let run = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function type() {
    if (run) return; run = true;
    while (true) {
      tty.textContent = "";
      for (const part of SCRIPT) for (let j = 0; j < part.length; j += 2) {
        const cls = part[j], txt = part[j + 1], span = document.createElement("span");
        if (cls !== "c") span.className = cls; tty.append(span);
        if (cls === "c") { for (const ch of txt) { span.textContent += ch; await wait(26 + Math.random() * 40); } span.textContent += "\n"; await wait(360); }
        else { span.textContent = txt + (cls === "c" ? "\n" : ""); await wait(150); }
      }
      await wait(4200);
    }
  }
  once(tty, type, { threshold: .3 });
}

function meter() {
  const box = $(".meter"); if (!box) return;
  const fpsEl = $("#mFps"), spark = $("#mSpark"), sx = spark.getContext("2d"), hist = [];
  let on = false, raf = 0, frames = 0, t0 = 0;
  const files = () => {
    const n = performance.getEntriesByType("navigation")[0], res = performance.getEntriesByType("resource");
    $("#mLoad").textContent = n && n.loadEventEnd > 0 ? Math.round(n.loadEventEnd) : Math.round(performance.now());
    let bytes = n ? (n.transferSize || n.encodedBodySize || 0) : 0;
    res.forEach((r) => { bytes += r.transferSize || r.encodedBodySize || 0; });
    $("#mKb").textContent = bytes ? Math.round(bytes / 1024) : "–"; $("#mReq").textContent = res.length + 1;
  };
  const drawSpark = () => {
    const d = Math.min(2, devicePixelRatio || 1), w = spark.clientWidth, h = spark.clientHeight;
    if (spark.width !== Math.round(w * d)) { spark.width = Math.round(w * d); spark.height = Math.round(h * d); }
    sx.setTransform(d, 0, 0, d, 0, 0); sx.clearRect(0, 0, w, h);
    const max = 70, step = w / 39;
    sx.strokeStyle = getComputedStyle(box).getPropertyValue("--red-t").trim() || "#B5172B"; sx.lineWidth = 2.4; sx.lineJoin = sx.lineCap = "round";
    sx.beginPath(); hist.forEach((f, i) => { const x = i * step, y = h - 3 - (Math.min(f, max) / max) * (h - 6); i ? sx.lineTo(x, y) : sx.moveTo(x, y); }); sx.stroke();
    const last = hist[hist.length - 1];
    if (last != null) { sx.fillStyle = "#FFC93C"; sx.beginPath(); sx.arc((hist.length - 1) * step, h - 3 - (Math.min(last, max) / max) * (h - 6), 4, 0, 7); sx.fill(); }
  };
  const loop = (t) => {
    if (!on) { raf = 0; return; }
    if (!t0) t0 = t; frames++;
    if (t - t0 >= 500) { const f = Math.round((frames * 1000) / (t - t0)); fpsEl.textContent = f; hist.push(f); if (hist.length > 40) hist.shift(); drawSpark(); frames = 0; t0 = t; }
    raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { files(); t0 = 0; frames = 0; if (!raf) raf = requestAnimationFrame(loop); } }, { threshold: .2 }).observe(box);
  addEventListener("load", () => setTimeout(files, 50));
}

function initLab() { bugs(); draw(); terminal(); meter(); }


/* ===== features/form.js ===== */
/* The form: checked as you go, then written as an email. Nothing is stored or sent from the page: the visitor
   chooses Gmail, Outlook, their own email app, or copying the text. */
const EMAIL = "tipsandgreeks@gmail.com";

function initForm() {
  const form = $("#form"); if (!form) return;
  const rules = { name: (v) => v.trim().length > 1, email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: (v) => v.trim().length > 4 };
  const check = (n) => {
    const el = form.elements[n], ok = rules[n](el.value), f = el.closest(".field");
    f.classList.toggle("bad", !ok); el.setAttribute("aria-invalid", String(!ok));
    if (!ok) el.setAttribute("aria-describedby", "e-" + n); else el.removeAttribute("aria-describedby");
    return ok;
  };
  Object.keys(rules).forEach((n) => {
    const el = form.elements[n];
    el.addEventListener("blur", () => { if (el.value) check(n); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("bad")) check(n); });
  });
  /* a quick reply writes the first line of the message (only into an empty or untouched message), shows itself as
     your answer in the conversation, and moves on to the next question that is still empty */
  let planLine = "", picked = null;
  const pick = $("#chatPick");
  const showPick = () => { if (pick && picked) { pick.textContent = picked.textContent.trim(); pick.hidden = false; } };
  document.querySelectorAll("[data-plan]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const m = form.elements.msg, line = (window.I18N?.lang === "en" ? "Hello, I'm interested in " + (a.dataset.planEn || a.dataset.plan) : "Γεια σας, ενδιαφέρομαι για " + a.dataset.plan.toLowerCase()) + ".";
    if (!m.value.trim() || m.value === planLine) { m.value = line; planLine = line; }
    $$("[data-plan]").forEach((x) => x.classList.toggle("on", x === a));
    picked = a; showPick();
    if (pick) { pick.classList.remove("pop"); void pick.offsetWidth; pick.classList.add("pop"); }
    const nextEmpty = ["name", "email", "msg"].map((k) => form.elements[k]).find((el) => !el.value.trim()) || m;
    setTimeout(() => { try { nextEmpty.focus({ preventScroll: true }); nextEmpty.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (err) { } }, 380);
  }));
  document.addEventListener("langchange", showPick);
  let body = "";
  const ways = $("#ways");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((n) => !check(n));
    if (bad.length) { form.elements[bad[0]].focus(); return; }
    const v = (n) => form.elements[n].value.trim();
    const subject = T("mailSubject") + " — " + v("name");
    body = [T("mailHello"), "", v("msg"), "", `${T("mailName")}: ${v("name")}`, `${T("mailEmail")}: ${v("email")}`].join("\n");
    const su = encodeURIComponent(subject), bo = encodeURIComponent(body);
    /* web email first: "send" through an email program does nothing on a computer without one */
    $("#wGmail").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${su}&body=${bo}`;
    $("#wOutlook").href = `https://outlook.live.com/mail/0/deeplink/compose?to=${EMAIL}&subject=${su}&body=${bo}`;
    $("#wApp").href = `mailto:${EMAIL}?subject=${su}&body=${bo}`;
    ways.hidden = false;
    requestAnimationFrame(() => { ways.focus({ preventScroll: true }); ways.scrollIntoView({ block: "nearest", behavior: "smooth" }); });
    const r = e.submitter?.getBoundingClientRect?.(); if (r) burst(r.left + r.width / 2, r.top + r.height / 2, 30);
  });
  $("#copyMsg").addEventListener("click", () => copy(body));
  $$(".way[target=_blank]", ways).forEach((w) => w.addEventListener("click", () => say(T("mailOpening"))));
}


/* ===== main.js ===== */
/* teleia. v3 — the page's script, in small modules (no build step: the browser loads them as they are).
   core/dom.js     helpers, media queries, texts
   core/loop.js    the one frame loop: measure → read → write, asleep when nothing moves
   features/*.js   one file per thing that moves or answers
   Texts come from i18n.js (window.I18N). Nothing is stored or sent; the theme and the language are remembered on
   this device only. */
const safe = (name, fn) => { try { fn(); } catch (e) { console.warn("[teleia]", name, e); } };

safe("pin", initPin);
safe("reveal", initReveal);
safe("scenes", initScenes);
safe("glide", initGlide);
safe("play", initPlay);
safe("odometers", initOdometers);
safe("slider", initStorySlider);
safe("hero-video", initHeroVideo);
safe("theme", initTheme);
safe("lang", initLang);
safe("nav", initNav);
safe("clock", initClock);
safe("copy", initCopy);
safe("galleries", initGalleries);
safe("process", initProcess);
safe("traveler", initTraveler);
safe("stage", initStage);
safe("magnets", initMagnets);
safe("thumbs", initIndexThumbs);
safe("cursor", initCursor);
safe("marquee", initMarquee);
safe("gauges", initGauges);
safe("beforeAfter", initBeforeAfter);
safe("hello", initHello);
safe("versions", initVersions);
safe("flips", initFlips);
safe("sparks", initSparks);
safe("lab", initLab);
safe("form", initForm);
safe("intro", () => initIntro(() => { $(".hero").classList.add("in"); $(".hero-title").classList.add("in"); }));
root.classList.add("ready");

})();
