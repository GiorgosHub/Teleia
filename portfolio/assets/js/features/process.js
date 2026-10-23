/* "From a line to a website": while the section is pinned, the scroll draws the sketch, colours it in, then wipes
   the real website over it and stamps it "online". The five steps light up one after the other. */
import { $, $$, root, clamp } from "../core/dom.js";
import { frame, measure } from "../core/loop.js";

export function initProcess() {
  const sec = $("#process"); if (!sec) return;
  const paths = $$(".proc-sketch path", sec), design = $(".proc-design", sec), site = $(".proc-site", sec),
    stamp = $(".proc-stamp", sec), url = $(".proc-url", sec), steps = $$(".step", sec), phases = $$(".proc-phases li", sec);
  const URLS = ["sketch.teleia", "design.teleia", "7o-epal-project.vercel.app"];
  let top = 0, h = 0, vis = false, last = -1;
  measure((s) => { top = sec.getBoundingClientRect().top + s.y; h = sec.offsetHeight; last = -1; });

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
      const p = clamp((s.y - top) / Math.max(1, h - s.vh));
      if (p !== last) { last = p; paint(p); }
      return false;
    },
  });
}
