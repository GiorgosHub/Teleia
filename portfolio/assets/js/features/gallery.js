/* The screenshots of each project. On wide screens the section is pinned: you keep scrolling down and the screens
   slide sideways, each one turning a little as it passes the middle. On phones (and with less motion) it is an
   ordinary row you swipe, which snaps to each screen. */
import { $, $$, root, clamp, pinMQ } from "../core/dom.js";
import { frame, measure, remeasure } from "../core/loop.js";

export function initPin() {
  const set = () => { root.classList.toggle("pin", pinMQ.matches); remeasure(); };
  pinMQ.addEventListener("change", set);
  set();
}

export function initGalleries() {
  $$("[data-gallery]").forEach((gal) => {
    const track = $(".gal-track", gal), shots = $$(".shot", track), now = $("[data-gal-now]", gal), bar = $("[data-gal-bar]", gal);
    const n = shots.length;
    gal.style.setProperty("--n", n);
    let top = 0, h = 0, range = 0, vis = false, p = -1, centers = [];
    measure((s) => {
      top = gal.getBoundingClientRect().top + s.y; h = gal.offsetHeight;
      range = Math.max(0, track.scrollWidth - s.vw);
      centers = shots.map((sh) => sh.offsetLeft + sh.offsetWidth / 2);
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
        const q = clamp((s.y - top) / Math.max(1, h - s.vh));
        if (q === p) return false;
        p = q;
        const x = q * range;
        track.style.transform = `translate3d(${-x}px,0,0)`;
        /* each screen leans as it travels through the window, and stands straight in the middle */
        const mid = x + s.vw / 2;
        shots.forEach((sh, i) => {
          const d = clamp((centers[i] - mid) / s.vw, -1, 1);
          sh.style.transform = `perspective(1400px) rotateY(${d * -14}deg) scale(${1 - Math.abs(d) * .08})`;
        });
        show(q);
        return false;
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
    pinMQ.addEventListener("change", () => { track.style.transform = ""; shots.forEach((sh) => (sh.style.transform = "")); p = -1; });
  });
}
