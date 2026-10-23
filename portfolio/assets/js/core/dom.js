/* small helpers shared by every module */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const root = document.documentElement;

const mq = (q) => matchMedia(q);
export const reduceMQ = mq("(prefers-reduced-motion: reduce)");
export const fineMQ = mq("(hover: hover) and (pointer: fine)");
/* the scroll-pinned scenes (galleries, process) only on screens wide enough for them, and only with motion */
export const pinMQ = mq("(min-width: 960px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)");

export const reduce = () => reduceMQ.matches;
export const fine = () => fineMQ.matches;

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/* texts from i18n.js (Greek or English, whichever is on) */
export const T = (k) => (window.I18N ? window.I18N.t(k) : k);
export const lang = () => (window.I18N ? window.I18N.lang : "el");

/* run a callback when an element first comes into view */
export function once(el, fn, opts = { threshold: .2 }) {
  if (!el) return;
  if (!("IntersectionObserver" in window)) { fn(el); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } }), opts);
  io.observe(el);
}

/* page position of an element's top, without layout thrash: read once, during measuring */
export const docTop = (el) => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
