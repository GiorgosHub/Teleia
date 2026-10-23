/* The travelling full stop.
   teleia is Greek for "full stop". One red dot is the hero's full stop; as you scroll it grows until the page falls
   into it (the red of the work section). From there a dot travels with you: it waits on the rail in the left margin
   while you read and jumps into place as the full stop of every heading you reach. Headings it has not reached yet
   have no full stop. Everything here is only a picture (aria-hidden); with "reduce motion" the full stops are simply
   printed and nothing travels. */
import { $, $$, root, clamp, lerp, ease, reduce, docTop } from "../core/dom.js";
import { frame, measure } from "../core/loop.js";

const ANCHOR = .36;      // the reading line, as a share of the window height
const RAIL_SIZE = 12;    // px, the dot while it waits on the rail

export function initTraveler() {
  if (reduce()) return;
  const dot = $("#traveler"), ball = $("i", dot), railEl = $("#rail"), zoom = $("#zoom");
  const heroStop = $('.stop[data-stop="hero"]'), work = $("#work");
  const all = $$(".stop[data-stop]").filter((s) => s !== heroStop);
  root.classList.add("travel");
  heroStop.classList.add("landed");

  /* measured: where each stop is reached, and the sections where the dot turns yellow (on red) */
  let stops = [], workTop = 0, zoomEnd = 0, zoomable = false, colorZones = [], railX = 0, anchorY = 0, showRail = true;
  measure((s) => {
    anchorY = s.vh * ANCHOR;
    showRail = s.vw >= 900;
    railX = parseFloat(getComputedStyle(root).getPropertyValue("--gutter")) || 16;
    railX = showRail ? Math.max(14, railX / 2) : 8;
    const maxScroll = document.documentElement.scrollHeight - s.vh;
    /* the hero holds still while its full stop grows, if it fits in the window */
    const hero = $(".hero"), pin = $(".hero-pin");
    zoomable = pin.offsetHeight <= s.vh * 1.06;
    root.classList.toggle("zoomable", zoomable);
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
      const start = s.vh * .04, p = clamp((y - start) / Math.max(1, zoomEnd - start));
      if (zoomable && heroR && p > 0 && y < workTop) {
        const ox = heroR.left + heroR.width / 2, oy = heroR.top + heroR.height / 2;
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
