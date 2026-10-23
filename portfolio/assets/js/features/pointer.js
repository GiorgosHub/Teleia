/* Everything that answers the pointer: the screens in the hero (depth with the pointer and the scroll), buttons
   that lean towards it, the project thumbnail that follows it over the work list, and the ring that says what a
   click does. Only on devices with a mouse; nothing here moves with "reduce motion". */
import { $, $$, fine, reduce, T, clamp, lerp } from "../core/dom.js";
import { frame, measure, state } from "../core/loop.js";

export function initStage() {
  const stage = $("#stage"); if (!stage || reduce()) return;
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

export function initMagnets() {
  if (reduce()) return;
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

export function initIndexThumbs() {
  if (!fine() || reduce()) return;
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

export function initCursor() {
  const c = $("#cursor"); if (!c || !fine() || reduce()) return;
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
