/* The lab: find the bugs, draw a line, the commands that run before every delivery, this page measured live. */
import { $, $$, root, reduce, T, once } from "../core/dom.js";
import { burst } from "./extras.js";
import { say } from "./ui.js";

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
    if (reduce()) { paint(pts, pts.length, 9); return; }
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
        if (cls === "c" && !reduce()) { for (const ch of txt) { span.textContent += ch; await wait(26 + Math.random() * 40); } span.textContent += "\n"; await wait(360); }
        else { span.textContent = txt + (cls === "c" ? "\n" : ""); if (!reduce()) await wait(150); }
      }
      if (reduce()) return;
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

export function initLab() { bugs(); draw(); terminal(); meter(); }
