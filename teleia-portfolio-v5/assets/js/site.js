/* teleia. — everything that moves or answers on the page.
   Texts come from i18n.js (window.I18N). Nothing is stored or sent: the form writes an email in the visitor's own
   email app; the theme and the language are remembered on this device only. With "reduce motion" nothing moves. */
(() => {
  "use strict";
  const EMAIL = "tipsandgreeks@gmail.com";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const T = (k) => window.I18N.t(k);
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const root = document.documentElement;

  /* ================= decorations written by the script (they are only pictures, hidden from screen readers) ================= */
  /* a big outlined number behind every numbered section, and two little drawings in its corners */
  const DOODLES = [
    '<path d="M40 6l9 22 24 2-18 15 6 24-21-13-21 13 6-24L7 30l24-2z"/>',
    '<path d="M40 40m-4 0a4 4 0 1 0 8 0a10 10 0 1 0-20 0a16 16 0 1 0 32 0a22 22 0 1 0-44 0"/>',
    '<path d="M4 50l12-20 12 20 12-20 12 20 12-20 12 20"/>',
    '<circle cx="40" cy="40" r="26"/><circle cx="40" cy="40" r="6" class="fill"/>',
    '<path d="M40 10v60M10 40h60"/>',
    '<path d="M40 10L72 66H8z"/>',
    '<path d="M10 60C20 20 60 20 70 60"/><circle cx="70" cy="60" r="5" class="fill"/>',
    '<rect x="14" y="14" width="52" height="52" rx="12"/>',
  ];
  $$("main > .sec").forEach((sec, i) => {
    if (sec.matches(".sketch")) return;
    const n = $(".sec-head > .num, .contact-copy > .num", sec);
    if (n) { const g = document.createElement("span"); g.className = "ghost"; g.setAttribute("aria-hidden", "true"); g.dataset.speed = i % 2 ? "-.1" : ".1"; g.textContent = n.textContent; sec.prepend(g); }
    const box = document.createElement("div"); box.className = "cnr"; box.setAttribute("aria-hidden", "true");
    const a = DOODLES[i % DOODLES.length], b = DOODLES[(i * 3 + 2) % DOODLES.length], tone = ["t-red", "t-yel", "t-grn", "t-ink"];
    box.innerHTML = `<svg class="cn cn-a ${tone[i % 4]}" data-speed=".22" viewBox="0 0 80 80">${a}</svg><svg class="cn cn-b ${tone[(i + 2) % 4]}" data-speed="-.18" viewBox="0 0 80 80">${b}</svg>`;
    sec.prepend(box);
  });
  /* footer word: letters that jump one by one */
  const fw = $(".ftr-word");
  if (fw) { const t = fw.firstChild; if (t && t.nodeType === 3) { const frag = document.createDocumentFragment(); [...t.textContent].forEach((c, i) => { const s = document.createElement("span"); s.className = "fl"; s.textContent = c; s.style.setProperty("--i", i); frag.append(s); }); t.replaceWith(frag); } }

  /* ================= the first seconds ================= */
  const intro = $("#intro");
  if (intro && !root.classList.contains("seen") && !reduce) {
    const out = () => { intro.classList.add("out"); try { sessionStorage.setItem("intro", "1"); } catch {} };
    intro.addEventListener("click", out);
    setTimeout(out, 1150);
  } else if (intro) intro.remove();

  /* ================= the circle that opens the new look (theme and language) ================= */
  /* the click point goes straight into the animation: putting it on the page as a variable made the browser
     recalculate the style of every element on the page once more */
  function circleSwap(e, update) {
    if (reduce || !document.startViewTransition) { update(); return null; }
    const x = e.clientX || innerWidth / 2, y = e.clientY || 0;
    const vt = document.startViewTransition(update);
    vt.ready.then(() => {
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 480, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
    return vt;
  }

  /* ================= theme (paper / night) ================= */
  const themeBtn = $("#theme");
  const themeLabel = () => { const dark = root.dataset.theme === "dark"; themeBtn.setAttribute("aria-pressed", String(dark)); themeBtn.setAttribute("aria-label", T(dark ? "themeLight" : "themeDark")); };
  themeBtn.addEventListener("click", (e) => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const go = () => { root.dataset.theme = next; try { localStorage.setItem("theme", next); } catch {} themeLabel(); $('meta[name="theme-color"]').content = next === "dark" ? "#131313" : "#F5F0E6"; };
    circleSwap(e, go);
  });
  themeLabel();

  /* ================= language ================= */
  /* while the circle opens, the page is only re-measured after it (so the circle runs without a pause) */
  let vtDone = null;
  $$("[data-lang]").forEach((b) => b.addEventListener("click", (e) => {
    if (b.dataset.lang === window.I18N.lang) return;
    const vt = circleSwap(e, () => window.I18N.set(b.dataset.lang));
    if (vt) vtDone = vt.finished.catch(() => {}).then(() => { vtDone = null; });
  }));

  /* ================= menu (phones and tablets) ================= */
  const nav = $("#nav"), mb = $(".menu-btn");
  const setMenu = (o) => { nav.classList.toggle("open", o); mb.setAttribute("aria-expanded", String(o)); };
  mb.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); mb.focus(); } });
  document.addEventListener("click", (e) => { if (nav.classList.contains("open") && !e.target.closest(".hdr")) setMenu(false); });

  /* ================= toast, copy ================= */
  const toast = $("#toast"); let tt = 0;
  const say = (t) => { toast.textContent = t; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("on"), 2400); };
  const copy = async (text) => { try { await navigator.clipboard.writeText(text); say(T("copied")); } catch { say(T("copyFail")); } };
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy)));

  /* ================= the form: checked, then written as an email ================= */
  const form = $("#form");
  const rules = { name: (v) => v.trim().length > 1, email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: (v) => v.trim().length > 4 };
  const check = (n) => {
    const el = form.elements[n], ok = rules[n](el.value), f = el.closest(".field");
    f.classList.toggle("bad", !ok); el.setAttribute("aria-invalid", String(!ok)); el.setAttribute("aria-describedby", "e-" + n);
    return ok;
  };
  Object.keys(rules).forEach((n) => {
    const el = form.elements[n];
    el.addEventListener("blur", () => { if (el.value) check(n); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("bad")) check(n); });
  });
  let lastBody = "";
  const ways = $("#ways"), plane = $(".plane-box");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((n) => !check(n));
    if (bad.length) { form.elements[bad[0]].focus(); return; }
    const v = (n) => form.elements[n].value.trim();
    const subject = T("mailSubject") + " — " + v("name");
    lastBody = [T("mailHello"), "", v("msg"), "", `${T("mailName")}: ${v("name")}`, `${T("mailEmail")}: ${v("email")}`].join("\n");
    const su = encodeURIComponent(subject), bo = encodeURIComponent(lastBody);
    /* web email first: a click on "send" that relies on an email program does nothing on a computer without one */
    $("#wGmail").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${su}&body=${bo}`;
    $("#wOutlook").href = `https://outlook.live.com/mail/0/deeplink/compose?to=${EMAIL}&subject=${su}&body=${bo}`;
    $("#wApp").href = `mailto:${EMAIL}?subject=${su}&body=${bo}`;
    ways.hidden = false; form.classList.add("ready");
    requestAnimationFrame(() => { ways.classList.add("on"); ways.focus({ preventScroll: true }); ways.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); });
    if (plane && !reduce) { plane.classList.remove("fly"); void plane.offsetWidth; plane.classList.add("fly"); }
    const r = e.submitter?.getBoundingClientRect?.(); if (r) burst(r.left + r.width / 2, r.top + r.height / 2, 30, true);
  });
  $("#copyMsg").addEventListener("click", () => copy(lastBody));
  $$(".way[target=_blank]", ways).forEach((w) => w.addEventListener("click", () => say(T("mailOpening"))));

  /* ================= headings: letter by letter ================= */
  /* (the letters' --i is written by the script, so it is allowed by the page's security policy) */
  function splitAll() {
    $$(".split").forEach((h) => {
      const text = h.textContent.trim(); h.textContent = "";
      const frag = document.createDocumentFragment(); let i = 0;
      text.split(/(\s+)/).forEach((w) => {
        if (/^\s+$/.test(w)) { frag.append(" "); return; }
        const ws = document.createElement("span"); ws.className = "w"; ws.setAttribute("aria-hidden", "true");
        [...w].forEach((c) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; s.style.setProperty("--i", i++); ws.append(s); });
        frag.append(ws);
      });
      h.append(frag); h.setAttribute("aria-label", text);
    });
  }

  const manText = $("#manText"); let manWords = [];
  function splitMan() {
    if (!manText) return;
    const text = manText.textContent.trim(); manText.textContent = "";
    const KEY = /^(Αστέρης|Γιώργος|Asteris|George|ομάδα|team|τελεία|dot)$/i;
    manWords = text.split(/\s+/).map((w) => { const s = document.createElement("span"); s.className = KEY.test(w.replace(/[.,;:!?·]/g, "")) ? "mw key" : "mw"; s.textContent = w; return s; });
    manWords.forEach((s, i) => { if (i) manText.append(" "); manText.append(s); });
    manText.setAttribute("aria-label", text); manWords.forEach((s) => s.setAttribute("aria-hidden", "true"));
  }

  /* ================= things settle in as they arrive ================= */
  const groups = [".sec-head", ".man-sign", ".flow", ".flow-steps li", ".faq-side", ".next-steps li", ".nums li", ".flip", ".proj", ".browser", ".shot-list li", ".ba-wrap", ".gauge", ".feats li", ".ver-track li", ".langs", ".poster", ".card", ".bill > div", ".tv", ".ad-copy", ".person", ".milestones li", ".orbit", ".faq details", ".contact-copy", ".form", ".ftr-cols > div", ".cta h2"];
  const SEL = groups.join(",");
  let io = null;
  function watch() {
    const items = $$(SEL).filter((el) => !el.classList.contains("rv"));
    const loose = $$("svg").filter((s) => $(".d", s) && !s.closest(SEL) && !s.closest(".hdr") && !s.classList.contains("seen-svg"));
    if (reduce || !("IntersectionObserver" in window)) { items.concat(loose).forEach((el) => el.classList.add("in")); return; }
    io ||= new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target); }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    items.forEach((el) => {
      const sib = [...el.parentElement.children].filter((x) => x.matches(SEL));
      el.style.setProperty("--dl", (Math.min(Math.max(0, sib.indexOf(el)), 6) * .08) + "s");
      el.classList.add("rv"); io.observe(el);
    });
    loose.forEach((s) => { s.classList.add("seen-svg"); io.observe(s); });
    /* headings outside a rising block watch themselves */
    $$(".split").filter((h) => !h.closest(SEL)).forEach((h) => io.observe(h));
  }
  requestAnimationFrame(() => requestAnimationFrame(() => $$(".brand-mark, .hero .under, .stack .scribble").forEach((s) => s.classList.add("in"))));

  /* ================= numbers count up ================= */
  if (!reduce && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; co.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1400;
      if (!to) { el.animate?.([{ transform: "scale(1.6) rotate(-10deg)" }, { transform: "none" }], { duration: 700, easing: "cubic-bezier(.34,1.56,.64,1)" }); return; }
      const step = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(step); };
      el.textContent = "0"; requestAnimationFrame(step);
    }), { threshold: .6 });
    $$("[data-count]").forEach((el) => co.observe(el));
  }

  /* ================= hero: the changing word, the clock in Larissa ================= */
  const rot = $("#rot"); let rotI = 0, rotTimer = 0;
  function startRot() {
    clearInterval(rotTimer); rotI = 0; rot.textContent = T("rot")[0]; rot.className = "rot";
    if (reduce) return;
    rotTimer = setInterval(() => {
      if (document.hidden) return;
      rot.classList.add("out");
      setTimeout(() => {
        rotI = (rotI + 1) % T("rot").length; rot.textContent = T("rot")[rotI];
        rot.className = "rot pre"; void rot.offsetWidth; rot.className = "rot";
      }, 230);
    }, 2800);
  }
  const clocks = $$(".clock");
  const tickClock = () => { let t = ""; try { t = new Intl.DateTimeFormat(window.I18N.lang === "en" ? "en-GB" : "el-GR", { timeZone: "Europe/Athens", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date()); } catch {} clocks.forEach((c) => { c.textContent = t; }); };
  tickClock(); setInterval(tickClock, 15000);

  /* ================= the pointer: a dot, a ring that grows and says what a click does ================= */
  const cur = $(".cur"), ring = $(".cur-ring"), dot = $(".cur-dot"), curT = $(".cur-t");
  if (fine && !reduce) {
    let mx = -100, my = -100, rx = -100, ry = -100, moving = false;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; if (!moving) { moving = true; requestAnimationFrame(follow); } }, { passive: true });
    function follow() { rx += (mx - rx) * .34; ry += (my - ry) * .34; ring.style.transform = `translate(${rx}px,${ry}px)`; if (Math.abs(mx - rx) + Math.abs(my - ry) > .3) requestAnimationFrame(follow); else moving = false; }
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest?.("[data-cursor]"), any = e.target.closest?.("a,button,summary,input[type=range],.pad");
      cur.classList.toggle("big", !!t); curT.textContent = t ? T(t.dataset.cursor) : "";
      ring.style.borderColor = any && !t ? "var(--red)" : "";
    });
    addEventListener("pointerdown", () => cur.classList.add("press")); addEventListener("pointerup", () => cur.classList.remove("press"));
    document.addEventListener("pointerleave", () => { dot.style.transform = ring.style.transform = "translate(-100px,-100px)"; });
  } else cur.remove();

  /* ================= sparks on every click, confetti on buttons ================= */
  const sp = $(".sparks"), spc = sp.getContext("2d"); let sparks = [], spRaf = 0;
  const sizeSp = () => { const dpr = Math.min(2, devicePixelRatio || 1); sp.width = innerWidth * dpr; sp.height = innerHeight * dpr; spc.setTransform(dpr, 0, 0, dpr, 0, 0); };
  sizeSp(); addEventListener("resize", sizeSp);
  const COLS = ["#B5172B", "#FFC93C", "#137A43", "#141414"];
  function burst(x, y, n, big) {
    if (reduce) return;
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = (big ? 4 : 2.2) + Math.random() * (big ? 5 : 2.5); sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (big ? 3 : 1), r: big ? 3 + Math.random() * 4 : 1.6 + Math.random() * 2, c: COLS[i % 4], life: 1, rot: Math.random() * 6, sq: big && i % 2 }); }
    if (!spRaf) { sp.classList.add("on"); spRaf = requestAnimationFrame(drawSp); }
  }
  function drawSp() {
    spc.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter((s) => s.life > 0);
    for (const s of sparks) {
      s.x += s.vx; s.y += s.vy; s.vy += .22; s.vx *= .98; s.life -= .022; s.rot += .2;
      spc.globalAlpha = Math.max(0, s.life); spc.fillStyle = s.c;
      if (s.sq) { spc.save(); spc.translate(s.x, s.y); spc.rotate(s.rot); spc.fillRect(-s.r, -s.r * 1.6, s.r * 2, s.r * 3.2); spc.restore(); }
      else { spc.beginPath(); spc.arc(s.x, s.y, s.r, 0, 7); spc.fill(); }
    }
    spc.globalAlpha = 1;
    spRaf = sparks.length ? requestAnimationFrame(drawSp) : 0;
    if (!spRaf) sp.classList.remove("on"); /* the canvas is only on the screen while sparks fly */
  }
  document.addEventListener("click", (e) => { if (!e.clientX && !e.clientY) return; const b = e.target.closest?.(".btn"); burst(e.clientX, e.clientY, b ? 34 : 10, !!b); });

  /* ================= buttons lean towards the pointer ================= */
  if (fine && !reduce) $$(".btn").forEach((b) => {
    /* the button is measured once when the pointer arrives, not on every movement. It lifts when the pointer
       arrives and comes down only when the pointer leaves the place where the button was: so a lifted button can't
       slip out from under a resting pointer and start flickering */
    let r = null, raf = 0, ex = 0, ey = 0;
    const inside = (x, y) => r && x > r.left - 1 && x < r.right + 1 && y > r.top - 1 && y < r.bottom + 1;
    const off = () => { b.classList.remove("hov"); r = null; cancelAnimationFrame(raf); raf = 0; b.style.translate = ""; removeEventListener("pointermove", watchOut); };
    const watchOut = (e) => { if (!inside(e.clientX, e.clientY)) off(); };
    b.addEventListener("pointerenter", () => { removeEventListener("pointermove", watchOut); if (!r) r = b.getBoundingClientRect(); b.classList.add("hov"); });
    b.addEventListener("pointermove", (e) => { ex = e.clientX; ey = e.clientY; if (!r) r = b.getBoundingClientRect();
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (r) b.style.translate = `${((ex - r.left - r.width / 2) * .18).toFixed(1)}px ${((ey - r.top - r.height / 2) * .28).toFixed(1)}px`; }); });
    b.addEventListener("pointerleave", (e) => { if (inside(e.clientX, e.clientY)) addEventListener("pointermove", watchOut, { passive: true }); else off(); });
    addEventListener("scroll", () => { if (r) off(); }, { passive: true });
  });

  /* ================= cards tilt, features glow where the pointer is ================= */
  if (fine && !reduce) {
    $$("[data-tilt]").forEach((el) => {
      let r = null, raf = 0, ex = 0, ey = 0;
      const paint = () => { raf = 0; if (!r) return; const x = (ex - r.left) / r.width - .5, y = (ey - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 9).toFixed(2)}deg) translateZ(0)`;
        if (glow) { el.style.setProperty("--mx", ((x + .5) * 100).toFixed(1) + "%"); el.style.setProperty("--my", ((y + .5) * 100).toFixed(1) + "%"); } };
      /* only cards that show a light under the pointer need its position as a variable */
      const glow = el.matches(".feats li, .nums li");
      el.addEventListener("pointerenter", () => { r = el.getBoundingClientRect(); });
      el.addEventListener("pointermove", (e) => { ex = e.clientX; ey = e.clientY; if (!r) r = el.getBoundingClientRect(); if (!raf) raf = requestAnimationFrame(paint); });
      el.addEventListener("pointerleave", () => { r = null; cancelAnimationFrame(raf); raf = 0; el.style.transform = ""; });
    });
  }

  /* ================= scrambled letters on the menu ================= */
  const GL = "ΑΒΓΔΕΖΗΘΚΛΜΝΞΠΡΣΤΦΧΨΩabcdefghijklmnopqrstuvwxyz0123456789";
  if (!reduce) $$("[data-scramble]").forEach((a) => {
    let run = 0;
    a.addEventListener("pointerenter", () => {
      const final = a.textContent; if (a.dataset.busy) return; a.dataset.busy = "1"; let f = 0; cancelAnimationFrame(run);
      const step = () => { f++; a.textContent = [...final].map((c, i) => c === " " || i < f / 2 ? c : GL[(Math.random() * GL.length) | 0]).join("");
        if (f / 2 < final.length) run = requestAnimationFrame(step); else { a.textContent = final; delete a.dataset.busy; } };
      step();
    });
  });

  /* ================= the flip cards turn on a tap too ================= */
  $$(".flip").forEach((f) => f.addEventListener("click", () => f.setAttribute("aria-pressed", String(f.getAttribute("aria-pressed") !== "true"))));

  /* ================= marquees: they repeat without a seam and run faster while you scroll ================= */
  /* the steady movement is a browser animation (it runs off the main thread); scrolling only changes its speed */
  const mqs = $$(".mq-track").map((t) => { t.innerHTML += t.innerHTML; $$(":scope > *", t).forEach((c, i) => { if (i >= t.children.length / 2) c.setAttribute("aria-hidden", "true"); }); return { t, anim: null, dir: t.classList.contains("mq-rev") ? 1 : -1, vis: false, half: 0 }; });
  const MQ_SPEED = 46; /* px per second when the page is still */
  let mqVel = 0, mqDy = 0, mqRaf = 0, lastY = scrollY;
  function buildMq() {
    if (reduce || !mqs.length || !Element.prototype.animate) return;
    for (const m of mqs) {
      const half = m.t.scrollWidth / 2; if (!half) continue;
      if (m.anim && Math.abs(half - m.half) < 1) continue;
      const k = m.anim ? (m.anim.currentTime % m.dur) / m.dur : 0; m.anim?.cancel();
      m.half = half; m.dur = (half / MQ_SPEED) * 1000;
      const a = m.dir < 0 ? 0 : -half, z = m.dir < 0 ? -half : 0;
      m.anim = m.t.animate([{ transform: `translate3d(${a}px,0,0)` }, { transform: `translate3d(${z}px,0,0)` }], { duration: m.dur, iterations: Infinity });
      m.anim.currentTime = k * m.dur; if (!m.vis) m.anim.pause();
    }
  }
  if ("IntersectionObserver" in window) {
    const mio = new IntersectionObserver((es) => es.forEach((e) => { const m = mqs.find((q) => q.t === e.target); if (!m) return; m.vis = e.isIntersecting; if (m.anim) m.vis ? m.anim.play() : m.anim.pause(); }));
    mqs.forEach((m) => mio.observe(m.t));
  } else mqs.forEach((m) => { m.vis = true; });
  /* called from the scroll handler; a short loop eases the speed back to normal once the scrolling stops */
  function mqScroll() {
    if (reduce) return;
    mqDy += SY - lastY; lastY = SY;
    if (!mqRaf) mqRaf = requestAnimationFrame(mqEase);
  }
  function mqEase() {
    mqRaf = 0; mqVel += (mqDy - mqVel) * .12; mqDy = 0;
    const rate = (1 + Math.min(10, Math.abs(mqVel) * .45)) * (mqVel < -1 ? -1 : 1);
    for (const m of mqs) if (m.anim && m.vis) m.anim.playbackRate = rate;
    if (Math.abs(mqVel) > .05) mqRaf = requestAnimationFrame(mqEase);
    else { mqVel = 0; for (const m of mqs) if (m.anim) m.anim.playbackRate = 1; }
  }

  /* ================= screenshots: they change by themselves, a bar shows when ================= */
  $$("[data-shots]").forEach((box) => {
    const imgs = $$(".shot-stage img", box), btns = $$(".shot-list button", box), DUR = 5200;
    let i = 0, timer = 0, vis = false;
    const show = (k, user) => {
      i = (k + imgs.length) % imgs.length;
      imgs.forEach((im, j) => im.classList.toggle("on", j === i));
      btns.forEach((b, j) => { b.setAttribute("aria-pressed", String(j === i)); const bar = $(".bar-p", b); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; });
      box.style.setProperty("--dur", DUR + "ms");
      clearTimeout(timer); if (!reduce && vis && !box.matches(":hover")) timer = setTimeout(() => show(i + 1), user ? DUR * 1.4 : DUR);
    };
    btns.forEach((b, j) => b.addEventListener("click", () => show(j, true)));
    box.addEventListener("pointerenter", () => { box.classList.add("paused"); clearTimeout(timer); });
    box.addEventListener("pointerleave", () => { box.classList.remove("paused"); show(i); });
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) show(i); else clearTimeout(timer); }, { threshold: .35 }).observe(box);
  });

  /* ================= before / after ================= */
  const ba = $("#ba");
  if (ba) { const r = $(".ba-range", ba), set = () => ba.style.setProperty("--p", r.value + "%"); r.addEventListener("input", set); set();
    /* a first nudge so it's obvious the handle moves */
    if (!reduce) new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; o.disconnect(); let t0 = performance.now();
      const nudge = (t) => { const k = Math.min(1, (t - t0) / 1600); r.value = 50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k); set(); if (k < 1) requestAnimationFrame(nudge); }; requestAnimationFrame(nudge); }, { threshold: .6 }).observe(ba);
  }

  /* ================= PROJECT 7o: welcome in its 8 languages ================= */
  const HELLO = [["el", "Καλώς ήρθατε"], ["en", "Welcome"], ["de", "Willkommen"], ["es", "Bienvenidos"], ["ru", "Добро пожаловать"], ["sq", "Mirë se vini"], ["fa", "خوش آمدید"], ["he", "ברוכים הבאים"]];
  const hw = $("#hello"), hl = $("#helloL"); let hi = 0;
  const setHello = () => { const [code, word] = HELLO[hi]; hw.textContent = word; hw.lang = code; hw.dir = code === "fa" || code === "he" ? "rtl" : "ltr"; hl.textContent = T("langNames")[code]; };
  setHello();
  if (!reduce) setInterval(() => { if (document.hidden) return; hw.classList.add("swap"); setTimeout(() => { hi = (hi + 1) % HELLO.length; setHello(); hw.classList.remove("swap"); }, 320); }, 1900);

  /* ================= the versions: drag sideways ================= */
  const vt = $(".ver-track");
  if (vt) { let down = false, x0 = 0, s0 = 0;
    vt.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; x0 = e.clientX; s0 = vt.scrollLeft; vt.setPointerCapture(e.pointerId); });
    vt.addEventListener("pointermove", (e) => { if (down) vt.scrollLeft = s0 - (e.clientX - x0); });
    vt.addEventListener("pointerup", () => { down = false; });
  }

  /* ================= tools orbit the dot ================= */
  function placeOrbit() {
    $$(".orbit .ring").forEach((r) => { const items = $$("i", r), rad = r.offsetWidth / 2;
      items.forEach((it, k) => { it.style.setProperty("--a0", (360 / items.length) * k + (r.classList.contains("r2") ? 20 : 0) + "deg"); it.style.setProperty("--rad", rad + "px"); }); });
  }

  /* ================= lab 1: find the bugs ================= */
  const bugCode = $("#bugCode"), bugN = $("#bugN"), bugWhy = $("#bugWhy");
  const bugLines = $$("li[data-bug]", bugCode).map((li) => ({ li, orig: $("code", li).textContent }));
  let found = new Set();
  function resetBugs() { found = new Set(); bugLines.forEach(({ li, orig }) => { li.classList.remove("fixed"); $("code", li).textContent = orig; $("button", li).disabled = false; }); bugN.textContent = "0"; bugWhy.textContent = window.I18N.lang === "en" ? window.I18N.keys.EN.bugHint : window.I18N.keys.EL.bugHint; }
  bugCode.addEventListener("click", (e) => {
    const li = e.target.closest("li"); if (!li) return;
    if (!li.dataset.bug) { li.classList.remove("no"); void li.offsetWidth; li.classList.add("no"); bugWhy.textContent = T("bugNo"); return; }
    if (found.has(li.dataset.bug)) return;
    found.add(li.dataset.bug); li.classList.add("fixed"); $("code", li).textContent = li.dataset.fix; $("button", li).disabled = true;
    bugN.textContent = found.size; bugN.parentElement.classList.remove("pop"); void bugN.offsetWidth; bugN.parentElement.classList.add("pop");
    bugWhy.textContent = T("bug" + li.dataset.bug);
    const r = li.getBoundingClientRect(); burst(r.left + 60, r.top + r.height / 2, 14, false);
    if (found.size === 3) { setTimeout(() => { bugWhy.textContent = T("bugDone"); const c = bugCode.getBoundingClientRect(); burst(c.left + c.width / 2, c.top + c.height / 2, 80, true); }, 900); }
  });
  /* the plain lines answer too: "this one is fine" */
  $$("li:not([data-bug])", bugCode).forEach((li) => { li.tabIndex = -1; });
  $("#bugReset").addEventListener("click", resetBugs);

  /* ================= lab 2: draw a line; it redraws itself and ends with a dot ================= */
  const pad = $("#pad"), padBox = pad.parentElement, pctx = pad.getContext("2d");
  let pts = [], drawing = false, replay = 0;
  const sizePad = () => { const r = padBox.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); pad.width = r.width * dpr; pad.height = r.height * dpr; pctx.setTransform(dpr, 0, 0, dpr, 0, 0); paintLine(pts, pts.length); };
  const ink = () => getComputedStyle(root).getPropertyValue("--ink").trim() || "#141414";
  function paintLine(p, upto, dotIt) {
    pctx.clearRect(0, 0, pad.width, pad.height);
    if (p.length < 2) return;
    pctx.lineCap = pctx.lineJoin = "round"; pctx.strokeStyle = ink(); pctx.lineWidth = 4;
    pctx.beginPath(); pctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < Math.min(upto, p.length) - 1; i++) pctx.quadraticCurveTo(p[i].x, p[i].y, (p[i].x + p[i + 1].x) / 2, (p[i].y + p[i + 1].y) / 2);
    pctx.stroke();
    if (dotIt) { const e = p[p.length - 1]; pctx.fillStyle = "#B5172B"; pctx.beginPath(); pctx.arc(e.x + 12, e.y, dotIt, 0, 7); pctx.fill(); }
  }
  const pos = (e) => { const r = pad.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  pad.addEventListener("pointerdown", (e) => { cancelAnimationFrame(replay); drawing = true; pts = [pos(e)]; padBox.classList.add("used"); pad.setPointerCapture(e.pointerId); });
  pad.addEventListener("pointermove", (e) => { if (!drawing) return; pts.push(pos(e)); paintLine(pts, pts.length); });
  const endDraw = () => {
    if (!drawing) return; drawing = false;
    if (pts.length < 4) return;
    if (reduce) { paintLine(pts, pts.length, 9); return; }
    const t0 = performance.now(), dur = Math.min(1600, 300 + pts.length * 6);
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); paintLine(pts, Math.max(2, Math.round(pts.length * k)));
      if (k < 1) replay = requestAnimationFrame(step); else { let s = 0; const grow = () => { s += 1.2; paintLine(pts, pts.length, Math.min(9, s)); if (s < 9) replay = requestAnimationFrame(grow); else { const r = pad.getBoundingClientRect(), e2 = pts[pts.length - 1]; burst(r.left + e2.x + 12, r.top + e2.y, 16, false); say(T("drawDone")); } }; grow(); } };
    replay = requestAnimationFrame(step);
  };
  pad.addEventListener("pointerup", endDraw); pad.addEventListener("pointercancel", endDraw);
  $("#padClear").addEventListener("click", () => { cancelAnimationFrame(replay); pts = []; padBox.classList.remove("used"); paintLine(pts, 0); });
  addEventListener("resize", sizePad); sizePad();

  /* ================= lab 3: the commands that run before every delivery (their real output) ================= */
  const tty = $("#tty");
  const SCRIPT = [
    ["p", "$ ", "c", "python3 tools/version.py"], ["dim", "version e70c1a21b6 written to 6 pages\n"],
    ["p", "$ ", "c", "node tools/test_api.mjs"], ["dim", "  ok 1 … ok 20\n"], ["ok", "all 20 checks passed\n"],
    ["p", "$ ", "c", "python3 func22.py && python3 func23.py"], ["ok", "20 / 20 passed\n14 / 14 passed\n"],
    ["p", "$ ", "c", "python3 audit.py"], ["ok", "internal links: 134 bad: []\n"], ["p", "$ ", "c", "# ready to ship."],
  ];
  let ttyRun = false;
  async function typeTty() {
    if (ttyRun) return; ttyRun = true;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    while (true) {
      tty.textContent = "";
      for (const part of SCRIPT) {
        for (let j = 0; j < part.length; j += 2) {
          const cls = part[j], txt = part[j + 1], span = document.createElement("span");
          if (cls !== "c") span.className = cls; tty.append(span);
          if (cls === "c" && !reduce) { for (const ch of txt) { span.textContent += ch; await wait(28 + Math.random() * 40); } span.textContent += "\n"; await wait(380); }
          else { span.textContent = txt + (cls === "c" ? "\n" : ""); if (!reduce) await wait(160); }
        }
      }
      if (reduce) return;
      await wait(4200);
    }
  }
  new IntersectionObserver(([e]) => { if (e.isIntersecting) typeTty(); }, { threshold: .3 }).observe(tty);

  /* ================= the thread down the page, the story line, the sketch ================= */
  class ThreadPath {
    constructor(x, y) { this.x = x; this.y = y; this.d = `M${x.toFixed(1)} ${y.toFixed(1)}`; this.pts = [[x, y]]; this.c2 = null; }
    L(x, y) { this.d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; this.pts.push([x, y]); this.x = x; this.y = y; this.c2 = null; }
    C(x1, y1, x2, y2, x, y) {
      const x0 = this.x, y0 = this.y;
      this.d += ` C${x1.toFixed(1)} ${y1.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
      for (let i = 1; i <= 20; i++) { const t = i / 20, u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, e = t * t * t;
        this.pts.push([a * x0 + b * x1 + c * x2 + e * x, a * y0 + b * y1 + c * y2 + e * y]); }
      this.x = x; this.y = y; this.c2 = [x2, y2];
    }
    c(dx1, dy1, dx2, dy2, dx, dy) { const x = this.x, y = this.y; this.C(x + dx1, y + dy1, x + dx2, y + dy2, x + dx, y + dy); }
    S(x2, y2, x, y) { const r = this.c2 ? [2 * this.x - this.c2[0], 2 * this.y - this.c2[1]] : [this.x, this.y]; this.C(r[0], r[1], x2, y2, x, y); }
    get len() { if (this._len == null) { let l = 0; this._cum = [0]; for (let i = 1; i < this.pts.length; i++) { const [a, b] = this.pts[i - 1], [c, d] = this.pts[i]; l += Math.hypot(c - a, d - b); this._cum.push(l); } this._len = l; } return this._len; }
    /* [length so far, lowest point reached so far, x, y] every `step` px along the line */
    samples(step) {
      const total = this.len, cum = this._cum, pts = this.pts, out = []; let j = 1, maxY = 0;
      for (let l = 0; l <= total; l += step) {
        while (j < cum.length - 1 && cum[j] < l) j++;
        const seg = cum[j] - cum[j - 1] || 1, k = Math.min(1, Math.max(0, (l - cum[j - 1]) / seg)), a = pts[j - 1], b = pts[j];
        const x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k; maxY = Math.max(maxY, y); out.push([l, maxY, x, y]);
      }
      return out;
    }
  }
  const thread = $(".thread"), main = $("main"), fg = $(".thread-fg", thread), tip = $(".thread-dot");
  let threadOn = false, samples = [], total = 1;
  /* the line is drawn once, as big as the page, and scrolls with it like the text does: nothing in it is redrawn
     while scrolling. It is cut into one piece per section, and each piece draws itself once when its section comes
     up; only the little dot moves on each frame, and it moves on the graphics card (a transform). */
  let segs = [], segOn = 0;
  let threadTop = 0;
  function buildThread() {
    if (getComputedStyle(thread).display === "none") { threadOn = false; return; }
    const mr = main.getBoundingClientRect(), W = main.clientWidth, H = main.scrollHeight;
    threadTop = mr.top + scrollY;
    const wrap = $(".sec .wrap").getBoundingClientRect();
    const L = Math.max(18, (wrap.left - mr.left) / 2), R = W - L;
    const secs = $$(".sec, .ad, .cta").map((x) => { const r = x.getBoundingClientRect(); return { top: r.top - mr.top, pad: Math.min(parseFloat(getComputedStyle(x).paddingTop) || 80, 120) }; }).filter((s) => s.pad > 20);
    if (!secs.length) return;
    /* the line is built and measured here, in plain arithmetic: each curve is cut into short straight pieces, so the
       length and the points along it are known without asking the browser (asking it was the slow part) */
    const P = new ThreadPath(R, Math.max(40, secs[0].top - 380)), marks = [];
    let side = R;
    secs.forEach((s, i) => {
      marks.push({ x: P.x, y: P.y, at: P.d.length });
      const to = side === R ? L : R, y = s.top + s.pad * .42, dip = 26 * (i % 2 ? 1 : -1), mx = (L + R) / 2, k = to - side;
      P.L(side, y - 70); P.C(side, y - 10, mx - k * .2, y + dip, mx, y);
      P.c(k * .06, -dip * .6, k * .1, dip * .9, k * .04, dip * 1.1); P.S(mx - k * .05, y - dip * .8, mx + k * .12, y - dip * .3);
      P.C(mx + k * .35, y + 10, to, y - 4, to, y + 70);
      side = to;
    });
    P.L(side, H - 30);
    thread.setAttribute("viewBox", `0 0 ${W} ${H}`); thread.style.width = W + "px"; thread.style.height = H + "px";
    $(".thread-bg", thread).setAttribute("d", P.d);
    /* one path per section: from where the line is when the section starts to where the next one starts */
    const ds = marks.map((m, i) => (i ? `M${m.x.toFixed(1)} ${m.y.toFixed(1)}` : "") + P.d.slice(i ? m.at : 0, i < marks.length - 1 ? marks[i + 1].at : undefined));
    const had = segOn; fg.textContent = "";
    segs = ds.map((d, i) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el.setAttribute("d", d); el.setAttribute("pathLength", "1"); el.setAttribute("class", "seg" + (i < had ? " on now" : "")); fg.append(el);
      return { el, y: i ? marks[i].y : 0 };
    });
    segOn = Math.min(had, segs.length);
    total = P.len; samples = P.samples(14); threadOn = true; drawThread();
  }
  let tipX = -1, tipY = -1;
  function drawThread() {
    if (!threadOn) return;
    const top = SY - threadTop, target = top + VH * .62;
    while (segOn < segs.length && segs[segOn].y < top + VH * .8) segs[segOn++].el.classList.add("on");
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (samples[m][1] < target) lo = m + 1; else hi = m; }
    const q = samples[lo], x = Math.round(q[2] * 2) / 2, y = Math.round(q[3] * 2) / 2;
    if (x !== tipX || y !== tipY) { tipX = x; tipY = y; tip.style.transform = `translate3d(${x}px,${y}px,0)`; }
  }
  const story = $(".story"), sfg = $(".story-fg", story), sbg = $(".story-bg", story), stops = $$(".milestones li");
  function buildStory() {
    const r = story.getBoundingClientRect(), dots = $$(".ms-dot", story).map((d) => { const q = d.getBoundingClientRect(); return [q.left - r.left + q.width / 2, q.top - r.top + q.height / 2]; });
    if (!dots.length) return;
    let d = `M${dots[0][0]} ${dots[0][1]}`;
    for (let i = 1; i < dots.length; i++) { const [x, y] = dots[i], py = dots[i - 1][1], m = (py + y) / 2, w = i % 2 ? 22 : -22; d += ` C${x + w} ${py + (m - py) * .6} ${x - w} ${m + (y - m) * .4} ${x} ${y}`; }
    sfg.setAttribute("d", d); sbg.setAttribute("d", d);
  }
  /* everything that follows the scroll is measured once (at load, resize, language or theme change) in page
     coordinates; on each frame only arithmetic and writes happen, so the browser never has to lay out mid-frame */
  const M = { story: { top: 0, h: 1, dots: [] }, sk: { top: 0, h: 1, frameTop: 0 }, para: [], man: { top: 0, h: 1 }, room: 1 };
  const pageTop = (el) => el.getBoundingClientRect().top + scrollY;
  function measure() {
    M.room = Math.max(1, root.scrollHeight - innerHeight);
    M.story.top = pageTop(story); M.story.h = story.offsetHeight; M.story.dots = stops.map((li) => pageTop($(".ms-dot", li)));
    M.sk.top = pageTop(sk); M.sk.h = sk.offsetHeight; M.sk.frameTop = pageTop(frame);
    if (manText) { M.man.top = pageTop(manText); M.man.h = manText.offsetHeight; manLast = -1; }
    para.forEach((el) => { el.style.translate = ""; });
    M.para = para.map((el) => { const r = el.getBoundingClientRect(); return { el, c: r.top + scrollY + r.height / 2, h: r.height, k: +el.dataset.speed }; });
  }
  let storyK = -1;
  function drawStory() {
    const top = M.story.top - SY, k = clamp01((VH * .62 - top) / Math.max(1, M.story.h - 20));
    const v = reduce ? 1 : Math.round(k * 400) / 400; if (v !== storyK) { storyK = v; sfg.style.strokeDashoffset = String(1 - v); }
    stops.forEach((li, i) => li.classList.toggle("lit", reduce || M.story.dots[i] - SY < VH * .62));
  }
  const sk = $(".sketch"), frame = $(".sk-frame", sk), skGray = $(".sk-gray", sk), skReal = $(".sk-real", sk), skDraw = $(".sk-draw", sk), wires = $$(".sk-draw path", sk), skSteps = $$(".sk-steps li", sk), skLabels = $$(".sk-label span", sk);
  let skLast = -1;
  function drawSketch() {
    let p;
    if (innerWidth >= 900 && !reduce) p = clamp01((SY - M.sk.top) / Math.max(1, M.sk.h - VH));
    else p = reduce ? 1 : clamp01((VH * .9 - (M.sk.frameTop - SY)) / (VH * .9));
    if (Math.abs(p - skLast) < .002) return; skLast = p;
    wires.forEach((w, i) => { w.style.strokeDashoffset = String(1 - clamp01((p - i * .045) / .32)); });
    /* only the opacity of three layers changes (the grey picture, the colour picture, the drawing): no repaint */
    const real = clamp01((p - .55) / .3), sat = clamp01((p - .7) / .25);
    skGray.style.opacity = real.toFixed(3); skReal.style.opacity = (real * sat).toFixed(3); skDraw.style.opacity = (1 - real).toFixed(3);
    const stage = p < .4 ? 0 : p < .78 ? 1 : 2;
    skSteps.forEach((li, i) => li.classList.toggle("on", i === stage)); skLabels.forEach((l, i) => l.classList.toggle("on", i === stage));
  }

  const man = $(".manifesto"); let manLast = -1;
  function drawMan() {
    if (!manWords.length) return;
    const k = reduce ? 1 : clamp01((VH * .78 - (M.man.top - SY)) / (M.man.h * .9 + VH * .25));
    const n = Math.round(k * manWords.length); if (n === manLast) return; manLast = n;
    manWords.forEach((w, i) => w.classList.toggle("lit", i < n));
  }

  /* ================= parallax stickers and doodles ================= */
  const para = $$("[data-speed]");
  function drawPara() {
    if (reduce) return;
    const mid = SY + VH / 2;
    for (const q of M.para) { const c = q.c - mid; if (Math.abs(c) > VH) continue; const v = Math.round(-c * q.k); if (v !== q.v) { q.v = v; q.el.style.translate = `0 ${v}px`; } }
  }

  /* ================= the soft colours of the hero lean towards the pointer ================= */
  const hero = $(".hero"), blobs = $$(".blobs i");
  if (fine && !reduce) {
    hero.addEventListener("pointermove", (e) => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; blobs.forEach((b, i) => { b.style.transform = `translate(${x * (i % 2 ? -70 : 70)}px,${y * 50}px)`; }); });
  }

  /* ================= dark sections: a soft light follows the pointer ================= */
  if (fine && !reduce) $$(".case-dark, #contact").forEach((secEl) => {
    const spot = document.createElement("i"); spot.className = "spot"; spot.setAttribute("aria-hidden", "true"); secEl.prepend(spot);
    let x = 0, y = 0, raf = 0, top = 0;
    secEl.addEventListener("pointerenter", () => { top = secEl.getBoundingClientRect().top + scrollY; secEl.classList.add("lit"); });
    secEl.addEventListener("pointerleave", () => secEl.classList.remove("lit"));
    secEl.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY + scrollY - top; if (!raf) raf = requestAnimationFrame(() => { raf = 0; spot.style.transform = `translate(${x - 300}px,${y - 300}px)`; }); }, { passive: true });
  });

  /* ================= lab 4: this page measured live, on the visitor's own device ================= */
  const meter = $(".meter");
  if (meter) {
    const fpsEl = $("#mFps"), spark = $("#mSpark"), sx = spark.getContext("2d"), hist = [];
    let on = false, raf = 0, frames = 0, t0 = 0;
    const fillFiles = () => {
      const n = performance.getEntriesByType("navigation")[0], res = performance.getEntriesByType("resource");
      $("#mLoad").textContent = n && n.loadEventEnd > 0 ? Math.round(n.loadEventEnd) : Math.round(performance.now());
      let bytes = n ? (n.transferSize || n.encodedBodySize || 0) : 0;
      res.forEach((r) => { bytes += r.transferSize || r.encodedBodySize || 0; });
      $("#mKb").textContent = bytes ? Math.round(bytes / 1024) : "–"; $("#mReq").textContent = res.length + 1;
    };
    const drawSpark = () => {
      const dpr = Math.min(2, devicePixelRatio || 1), w = spark.clientWidth, h = spark.clientHeight;
      if (spark.width !== Math.round(w * dpr)) { spark.width = Math.round(w * dpr); spark.height = Math.round(h * dpr); }
      sx.setTransform(dpr, 0, 0, dpr, 0, 0); sx.clearRect(0, 0, w, h);
      const max = 70, step = w / 39;
      sx.strokeStyle = getComputedStyle(meter).getPropertyValue("--red-t").trim() || "#B5172B"; sx.lineWidth = 2.4; sx.lineJoin = sx.lineCap = "round";
      sx.beginPath(); hist.forEach((f, i) => { const x = i * step, y = h - 3 - (Math.min(f, max) / max) * (h - 6); i ? sx.lineTo(x, y) : sx.moveTo(x, y); }); sx.stroke();
      const last = hist[hist.length - 1]; if (last != null) { sx.fillStyle = "#FFC93C"; sx.beginPath(); sx.arc((hist.length - 1) * step, h - 3 - (Math.min(last, max) / max) * (h - 6), 4, 0, 7); sx.fill(); }
    };
    const loop = (t) => {
      if (!on) { raf = 0; return; }
      if (!t0) t0 = t; frames++;
      if (t - t0 >= 500) { const f = Math.round((frames * 1000) / (t - t0)); fpsEl.textContent = f; hist.push(f); if (hist.length > 40) hist.shift(); drawSpark(); frames = 0; t0 = t; }
      raf = requestAnimationFrame(loop);
    };
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { fillFiles(); t0 = 0; frames = 0; if (!raf) raf = requestAnimationFrame(loop); } }, { threshold: .2 }).observe(meter);
    addEventListener("load", () => setTimeout(fillFiles, 50));
  }

  /* ================= header, progress, side dots, back to top ================= */
  const hdr = $("#hdr"), prog = $(".progress i"), totop = $(".totop");
  let lastS = scrollY;
  let topK = -1; const topRing = $(".ring", totop);
  function drawChrome() {
    const k = SY / M.room;
    prog.style.transform = `scaleX(${k.toFixed(4)})`;
    const kr = Math.round(k * 500) / 500; if (kr !== topK) { topK = kr; topRing.style.strokeDashoffset = String(1 - kr); } totop.classList.toggle("on", SY > 600);
    if (!nav.classList.contains("open")) hdr.classList.toggle("away", SY > lastS + 2 && SY > 300);
    if (SY < lastS - 2) hdr.classList.remove("away");
    lastS = SY;
  }
  const navLinks = $$(".nav a, .sdots a"), secIds = [...new Set(navLinks.map((a) => a.hash.slice(1)))];
  if ("IntersectionObserver" in window) {
    const sio = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; navLinks.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    secIds.forEach((id) => { const s = document.getElementById(id); if (s) sio.observe(s); });
  }
  const labelDots = () => $$(".sdots a").forEach((a) => a.setAttribute("data-label", a.textContent));

  /* ================= the small ad: once per visit, past the middle of the page ================= */
  const pop = $("#pop"); let popShown = false;
  try { popShown = !!sessionStorage.getItem("pop"); } catch {}
  const closePop = () => { pop.classList.remove("on"); setTimeout(() => { pop.hidden = true; }, 700); try { sessionStorage.setItem("pop", "1"); } catch {} };
  $(".pop-x", pop).addEventListener("click", closePop); $$("a", pop).forEach((a) => a.addEventListener("click", closePop));
  $(".pop-time", pop).addEventListener("animationend", closePop);
  function maybePop() { if (popShown) return; const k = SY / M.room; if (k > .38) { popShown = true; pop.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add("on"))); if (reduce) setTimeout(closePop, 9000); } }

  /* ================= one scroll handler, one rebuild ================= */
  let tick = 0, SY = scrollY, VH = innerHeight; /* read once per frame: reading it after a style change would make the browser lay out the page again */
  /* blocks off the screen pause their endless animations */
  if ("IntersectionObserver" in window) { const oio = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("off", !e.isIntersecting)), { rootMargin: "100px 0px" }); $$("main > section, main > aside, main > .marquee, .ftr").forEach((el) => oio.observe(el)); }
  /* the story and the sketch are only redrawn while they are on (or near) the screen */
  const near = new Set();
  if ("IntersectionObserver" in window) { const nio = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting ? near.add(e.target) : near.delete(e.target)), { rootMargin: "200px 0px" }); [story, sk, man].forEach((el) => el && nio.observe(el)); }
  else { near.add(story); near.add(sk); near.add(man); }
  const onFrame = () => { tick = 0; SY = scrollY; VH = innerHeight; mqScroll(); drawThread(); if (near.has(story)) drawStory(); if (near.has(sk)) drawSketch(); if (near.has(man)) drawMan(); drawPara(); drawChrome(); maybePop(); };
  /* a safety net: after a jump (a link, the address with #, a fast scroll) everything on the screen is shown */
  let restT = 0;
  const atRest = () => { for (const el of $$(".rv:not(.in), .split:not(.in), svg.seen-svg:not(.in)")) { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add("in"); } };
  addEventListener("scroll", () => { if (!tick) tick = requestAnimationFrame(onFrame); clearTimeout(restT); restT = setTimeout(atRest, 140); }, { passive: true });
  /* opening the page with an address like …/#tools lands on that section, even after the late layout changes */
  addEventListener("load", () => {
    const id = decodeURIComponent(location.hash.slice(1)), target = id && document.getElementById(id);
    if (target) { document.documentElement.style.scrollBehavior = "auto"; target.scrollIntoView(); document.documentElement.style.scrollBehavior = ""; }
    setTimeout(atRest, 300);
  });
  /* several reasons to re-measure can arrive together (fonts, load, a language change): they share one frame */
  let rb = 0;
  const rebuild = () => { if (rb) return; rb = requestAnimationFrame(() => { rb = 0; buildMq(); buildThread(); buildStory(); placeOrbit(); measure(); skLast = -1; drawSketch(); onFrame(); }); };
  addEventListener("resize", rebuild); addEventListener("load", rebuild);
  if (document.fonts) document.fonts.ready.then(rebuild);
  setTimeout(rebuild, 1800);
  $$(".faq details").forEach((d) => d.addEventListener("toggle", rebuild));

  /* ================= start, and again after every language change ================= */
  function afterLang(first) {
    splitAll(); splitMan(); startRot(); tickClock(); themeLabel(); labelDots(); setHello(); resetBugs();
    if (first === true) watch(); /* the blocks themselves don't change with the language: they are watched once */
    $$(".split").forEach((h) => { if (h.closest(".in") || h.classList.contains("in")) h.classList.add("in"); });
    if (vtDone) vtDone.then(rebuild); else rebuild();
  }
  document.addEventListener("langchange", afterLang);
  afterLang(true);
})();
