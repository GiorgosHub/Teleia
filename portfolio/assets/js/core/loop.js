/* One frame loop for everything that follows the scroll or the pointer.
   Each frame: (1) re-measure if something asked for it, (2) every module reads what it needs, (3) every module
   writes. Reads never come after a write in the same frame, so the browser lays the page out at most once.
   The loop sleeps when nothing moves: scrolling, resizing or a module that is still easing wakes it up. */

const parts = [];      // { read(state), write(state) -> true while it still wants frames }
const measures = [];   // fn(state): heavy measuring, only after resize, load, fonts, language
export const state = { y: 0, vh: 0, vw: 0, dy: 0, t: 0, px: -1, py: -1 };

let raf = 0, needMeasure = true, lastY = 0, awake = false;

export function frame(part) { parts.push(part); wake(); }
export function measure(fn) { measures.push(fn); remeasure(); }
export function remeasure() { needMeasure = true; wake(); }

export function wake() { if (!raf) raf = requestAnimationFrame(tick); }

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
export const isAwake = () => awake;
