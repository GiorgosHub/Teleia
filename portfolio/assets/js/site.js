/* teleia. — language (Greek first, English), menu, prices → form, the quote email, and the motion:
   drawn lines, the thread down the page, things rising into view.
   The site stores and sends nothing itself: the form writes an email in the visitor's own email app. */
(() => {
  "use strict";
  const EMAIL = "tipsandgreeks@gmail.com";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- English (the Greek is in the page itself) ---------- */
  const EN = {
    skip: "Skip to content", brandAria: "teleia. — top", navAria: "Main menu", langAria: "Language", menu: "Menu",
    navWork: "Work", navTeam: "Team", navServices: "What we build", navPrices: "Packages", navHow: "How we work", navStory: "Story", navContact: "Contact", ctaShort: "Get a quote",
    avail: "Taking new projects · Larisa, Greece", heroA: "Websites", heroB: "that bring you customers.",
    heroLead: "We are George and Asteris. We build websites and online shops for businesses: fast, clean, in Greek and English. And we finish every project down to the last full stop.",
    ctaLong: "Get a quote", seeWork: "See our work", heroNote: "real projects",
    factPlans: "packages, with or without an admin panel", factFreeB: "Free", factFree: "quote, with no commitment", factLang: "Greek and English", factProj: "projects: one live, one in progress",
    mq1: "Websites", mq2: "Greek & English", mq3: "Phone first", mq4: "Ready for Google", mq5: "Larisa",
    workTitle: "Our work", workSub: "Real projects, not templates. Tap to see them.",
    p7Open: "PROJECT 7o — open the website", p7Alt: "The home page of PROJECT 7o", statusLive: "Live", statusWip: "In progress",
    p7Desc: "An unofficial website for the 7th Vocational High School of Larisa. Live timetable and bells, the school's announcements, an AI assistant for questions and exercises, assignment hand-in through PBworks, and 8 languages.",
    tag8: "8 languages", tagAI: "AI assistant", tagLive: "Live timetable", tagPWA: "Works offline too", visit: "Visit",
    gAlt: "The home page of Giannotas Premium Auto Salon",
    gDesc: "A website for a car dealership and car parts shop in Larisa. Cars and parts come live from the shop's car.gr listings: whatever sells disappears by itself. Part search by make, model and chassis, and call, Viber or message in one tap.",
    tagCargr: "Live from car.gr", tagSearch: "Smart search", tagCall: "Call & Viber", tagSeo: "Ready for Google",
    nextTxt: "The next project could be yours.", nextBtn: "Let's talk",
    skTitle: "From a line to a website", skSub: "Every website starts as a sketch. Keep scrolling and watch it become real.",
    sk1: "Sketch", sk1t: "What goes where: menu, title, buttons, photos.", sk2: "Design", sk2t: "Colours, type and motion that suit you.",
    sk3: "Website", sk3t: "The code, tested on phones and computers.", skL0: "sketch", skL1: "design", skL2: "live ✓",
    stTitle: "Our story", stSub: "Still short, but every part of it is real.",
    m1w: "2026", m1: "PROJECT 7o", m1t: "Our first big website, for our school: timetable, announcements, an AI assistant, 8 languages.",
    m2w: "2026", m2: "The first client", m2t: "Giannotas Premium Auto Salon in Larisa: cars and parts live from car.gr.",
    m3w: "2026", m3: "teleia. is born", m3t: "We give a name to what we already do: websites, finished down to the last full stop.",
    m4w: "Next", m4: "Your project", m4t: "This is where the next line goes. ", m4a: "Let's write it together.",
    ctaBig: "Got an idea? Let's give it shape.", ctaBigBtn: "Start here",
    teamTitle: "The team", teamSub: "Two people, one goal: a website that works for you.",
    georgeName: "George Sabanis",
    georgeBio: "Designs and writes the code of the websites, from the first idea until they go live. He uses AI as a tool, not to do the work on its own: he debugs himself, finds and fixes the errors in the code and checks every detail.",
    asterisName: "Asteris Pitas", asterisBio: "Organises every project: what the client needs, what gets built and when. Makes sure what was agreed is what gets delivered.",
    servTitle: "What we build", servSub: "From a simple page for your shop to an online shop you run yourself.",
    sv1: "Business websites", sv1t: "For shops, professionals and services: who you are, what you do, where to find you.",
    sv2t: "Catalogue, cart and orders, so you can sell online.",
    sv3t: "Change texts, products, prices and stock yourself, with a secure sign-in.",
    sv4: "Multilingual websites", sv4t: "Greek and English, or as many languages as your customers need.",
    sv5: "Connected to other services", sv5t: "Like Giannotas, which reads its car.gr listings live: your details update by themselves.",
    sv6: "AI assistants", sv6t: "Like on PROJECT 7o: an assistant that answers your visitors' questions.",
    pricesTitle: "Packages", pricesSub: "Four main options. We price every project separately, depending on what you need: ask for a quote, with no commitment.",
    from: "from", askThis: "Get a quote",
    plan1: "Website", plan1For: "For businesses and professionals who want to be found.",
    p1a: "Pages for what you do, with your details", p1b: "Looks right on phone, tablet and computer", p1c: "Call, email and map in one tap", p1d: "Basic setup for Google",
    plan2: "Website with admin panel", plan2For: "To change texts and photos yourself.",
    p2a: "Everything the website has", p2b: "Admin panel with secure sign-in", p2c: "Change texts, photos, opening hours", p2d: "No need to ask us for every change",
    plan3For: "To sell your products online.",
    p3a: "Product catalogue with photos and prices", p3b: "Search and categories", p3c: "Cart and orders", p3d: "Everything the website has",
    ribbon: "You manage it yourself", plan4: "Online shop with admin panel", plan4For: "To change products, prices and stock without needing us.",
    p4a: "Everything the online shop has", p4b: "Admin panel with secure sign-in", p4c: "Add and change products, prices, stock", p4d: "All your orders in one place",
    howTitle: "How we work", howSub: "From the first message to your website going live.",
    s1: "We talk", s1t: "You tell us what you do and what the website should achieve. We ask whatever we need to.",
    s2: "Quote", s2t: "You get a written quote with the price and what it includes, before anything starts.",
    s3: "Design & build", s3t: "You see the website while we build it and tell us what you think. We change whatever you don't like.",
    s4: "Testing", s4t: "We test it on phones and computers and fix every bug before you see it finished.",
    s5: "Live", s5t: "The website goes live at your address and we show you how it works.",
    getTitle: "In every website",
    g1: "Fast", g1t: "Opens quickly even on mobile data, because nobody waits.",
    g2: "Phone first", g2t: "Most people will see you on their phone. That's where it has to be perfect.",
    g3: "Two languages", g3t: "Greek and English, for customers and visitors from abroad. More if you need them.",
    g4: "Easy to find", g4t: "Proper titles and descriptions for Google, and a nice preview when it's shared on Viber or Facebook.",
    g5: "Secure", g5t: "HTTPS and strict security settings. Your customers' data goes nowhere else.",
    g6: "Yours", g6t: "The website and its content belong to you.",
    toolsTitle: "What we work with", toolsSub: "Modern, proven tools. AI helps us work faster; the code is checked and fixed by us.",
    tAI: "AI tools", tApi: "API integrations", tTest: "Testing on phones",
    faqTitle: "Questions",
    q1: "How much does a website cost?", a1: "It depends on what you need: how many pages, which languages, whether you want an online shop or an admin panel, special features. Write to us what you want and we send you a quote, with no commitment.",
    q2: "How long does it take?", a2: "It depends on the size of the project. We'll give you a realistic time together with the quote.",
    q3: "What about the domain (e.g. mybusiness.gr) and hosting?", a3: "If you don't have them yet, we help you get them. We talk them through and they go into the quote, so you know the whole cost in advance.",
    q4: "Can I change things myself?", a4: "With an admin panel, yes: with the \"Website with admin panel\" you change texts and photos, with the \"Online shop with admin panel\" also products, prices and stock. Without an admin panel, you send us what you want changed.",
    q5: "Does AI build everything?", a5: "No. AI is a tool that makes us faster. We check the code ourselves: we debug, find the errors and fix them, and test the website on phones and computers.",
    q6: "I already have a website. Can you rebuild it?", a6: "Of course. Send us its address and what you don't like, and we'll tell you what can be done.",
    contactTitle: "Get a quote", contactSub: "Tell us what you need. We reply with a quote, with no commitment.",
    orEmail: "Or write to us directly:", copy: "Copy",
    fName: "Name", eName: "Write your name.", fEmail: "Email", eEmail: "Write an email like name@example.com, so we can reply.",
    fPlan: "What do you need?", oWeb: "Website", oWebAdmin: "Website with admin panel", oShop: "Online shop", oShopAdmin: "Online shop with admin panel", oOther: "Something else / not sure",
    fBiz: "Your business or current website", optional: "(optional)", fMsg: "What should your website do?", eMsg: "Write a few words about your project.",
    send: "Send by email", formNote: "Your email app opens with the message ready; press \"Send\" there. This website stores nothing.",
    sentTxt: "If your email app didn't open, copy the message and send it to tipsandgreeks@gmail.com.", copyMsg: "Copy message",
    ftrName: "teleia. · George Sabanis & Asteris Pitas · Websites & online shops · Larisa, Greece", toTop: "Top",
    copied: "Copied", copyFail: "Couldn't copy: select the text and copy it yourself",
    title: "teleia. — Websites & online shops, Larisa", desc: "teleia. is George Sabanis and Asteris Pitas: we build websites, online shops and sites with an admin panel for businesses. Larisa, Greece.",
    mailSubject: "Quote request", mailHello: "Hello teleia,", mailName: "Name", mailEmail: "Email", mailPlan: "Needs", mailBiz: "Business / website"
  };
  const EL = { copied: "Αντιγράφηκε", copyFail: "Δεν έγινε αντιγραφή: επιλέξτε το κείμενο και αντιγράψτε το",
    mailSubject: "Αίτημα προσφοράς", mailHello: "Γεια σας,", mailName: "Όνομα", mailEmail: "Email", mailPlan: "Χρειάζομαι", mailBiz: "Επιχείρηση / ιστοσελίδα",
    title: document.title, desc: $('meta[name="description"]').content };
  $$("[data-i18n]").forEach((e) => { EL[e.dataset.i18n] = e.textContent; });
  $$("[data-i18n-aria]").forEach((e) => { EL[e.dataset.i18nAria] = e.getAttribute("aria-label"); });
  $$("[data-i18n-alt]").forEach((e) => { EL[e.dataset.i18nAlt] = e.alt; });
  let lang = "el";
  const T = (k) => (lang === "en" ? EN : EL)[k] ?? EL[k] ?? k;

  function setLang(l, save = true) {
    lang = l === "en" ? "en" : "el";
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((e) => { e.textContent = T(e.dataset.i18n); });
    $$("[data-i18n-aria]").forEach((e) => e.setAttribute("aria-label", T(e.dataset.i18nAria)));
    $$("[data-i18n-alt]").forEach((e) => { e.alt = T(e.dataset.i18nAlt); });
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    document.title = T("title");
    $('meta[name="description"]').content = T("desc");
    if (save) try { localStorage.setItem("lang", lang); } catch {}
    rebuildAll();
  }
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.lang === lang) return;
    if (reduce) return setLang(b.dataset.lang);
    document.documentElement.classList.add("swapping");
    setTimeout(() => { setLang(b.dataset.lang); requestAnimationFrame(() => document.documentElement.classList.remove("swapping")); }, 220);
  }));

  /* ---------- menu (phones and tablets) ---------- */
  const nav = $("#nav"), mb = $(".menu-btn");
  const setMenu = (o) => { nav.classList.toggle("open", o); mb.setAttribute("aria-expanded", String(o)); };
  mb.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); mb.focus(); } });
  document.addEventListener("click", (e) => { if (nav.classList.contains("open") && !e.target.closest(".hdr")) setMenu(false); });

  /* ---------- toast + copy ---------- */
  const toast = $("#toast"); let tt = 0;
  const say = (t) => { toast.textContent = t; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("on"), 2200); };
  const copy = async (text) => { try { await navigator.clipboard.writeText(text); say(T("copied")); } catch { say(T("copyFail")); } };
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy)));

  /* ---------- a price card's button picks that package in the form ---------- */
  const form = $("#quote"), plan = $("#f-plan");
  $$("[data-plan]").forEach((a) => a.addEventListener("click", () => { plan.value = a.dataset.plan; setTimeout(() => $("#f-name").focus({ preventScroll: true }), 700); }));

  /* ---------- the quote: checked, then written as an email ---------- */
  const rules = { name: (v) => v.trim().length > 1, email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: (v) => v.trim().length > 4 };
  const check = (name) => {
    const el = form.elements[name], ok = rules[name](el.value), f = el.closest(".field");
    f.classList.toggle("bad", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    el.setAttribute("aria-describedby", "e-" + name);
    return ok;
  };
  Object.keys(rules).forEach((n) => {
    const el = form.elements[n];
    el.addEventListener("blur", () => { if (el.value) check(n); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("bad")) check(n); });
  });
  let lastBody = "";
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((n) => !check(n));
    if (bad.length) { form.elements[bad[0]].focus(); return; }
    const v = (n) => form.elements[n].value.trim();
    const planText = plan.options[plan.selectedIndex].textContent;
    const facts = [`${T("mailPlan")}: ${planText}`, `${T("mailName")}: ${v("name")}`, `${T("mailEmail")}: ${v("email")}`];
    if (v("biz")) facts.push(`${T("mailBiz")}: ${v("biz")}`);
    lastBody = [T("mailHello"), "", v("msg"), "", ...facts].join("\n");
    const subject = `${T("mailSubject")}: ${planText.split(" — ")[0]} — ${v("name")}`;
    $("#sent").hidden = false;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lastBody)}`;
  });
  $("#copyMsg").addEventListener("click", () => copy(lastBody));

  /* ================= motion ================= */
  const rebuildAll = () => window.dispatchEvent(new Event("resize"));
  const hdr = $(".hdr");

  /* the marquee repeats itself so it can loop without a seam */
  const mq = $(".mq-track"); if (mq) mq.innerHTML += mq.innerHTML;

  /* lines in the header and the hero draw as soon as the page is shown */
  requestAnimationFrame(() => requestAnimationFrame(() => { $$(".brand-mark, .hero .under, .stack .scribble").forEach((s) => s.classList.add("in")); }));

  /* things rise into place as they come into view; siblings follow one another; their lines draw */
  const groups = [".sec-head", ".proj", ".next", ".person", ".plan", ".fine", ".steps li", ".gets li", ".faq details", ".contact-copy", ".form", ".facts", ".services li", ".tools li"];
  const sel = groups.join(",");
  const items = $$(sel);
  /* drawn lines that are not inside a rising item are watched on their own */
  const loose = $$("svg").filter((s) => $(".d", s) && !s.closest(sel) && !s.closest(".hdr, .hero"));
  const done = (t) => t.classList.add("seen");
  if (!reduce && "IntersectionObserver" in window) {
    items.forEach((el) => {
      const sib = [...el.parentElement.children].filter((x) => x.matches(sel));
      el.style.setProperty("--d", Math.min(Math.max(0, sib.indexOf(el)), 6));
      el.classList.add("rv");
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target; t.classList.add("in"); io.unobserve(t);
      if (t.classList.contains("rv")) setTimeout(() => { t.classList.remove("rv"); done(t); }, 1700);
    }), { rootMargin: "0px 0px -10% 0px", threshold: .1 });
    items.concat(loose).forEach((el) => io.observe(el));
  } else items.concat(loose).forEach((el) => { el.classList.add("in"); done(el); });

  /* header: a tighter pill once the page moves */
  const onScroll = () => hdr.classList.toggle("scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* the hero's windows lean towards the pointer, then settle */
  const stack = $(".stack");
  if (stack && !reduce) {
    setTimeout(() => stack.classList.add("landed"), 1900);
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
      let raf = 0, px = 0, py = 0;
      addEventListener("pointermove", (e) => {
        px = (e.clientX / innerWidth - .5) * 2; py = (e.clientY / innerHeight - .5) * 2;
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; stack.style.setProperty("--px", px.toFixed(3)); stack.style.setProperty("--py", py.toFixed(3)); });
      }, { passive: true });
    }
  }

  /* the prices count up when they come into view */
  if (!reduce && "IntersectionObserver" in window) {
    const run = (el) => {
      const to = +el.dataset.count, t0 = performance.now(), dur = 1200;
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * e) + " €"; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }), { threshold: .6 });
    $$("[data-count]").forEach((el) => co.observe(el));
  }

  /* FAQ: answers slide open and closed */
  $$(".faq details").forEach((d) => {
    const sum = $("summary", d), body = $("p", d);
    sum.addEventListener("click", (e) => {
      if (reduce || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        const a = body.animate([{ height: body.offsetHeight + "px", opacity: 1 }, { height: "0px", opacity: 0, paddingBottom: "0px" }], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" });
        a.onfinish = () => { d.open = false; rebuildAll(); };
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: "0px", opacity: 0, paddingBottom: "0px" }, { height: h + "px", opacity: 1 }], { duration: 480, easing: "cubic-bezier(.22,1,.36,1)" }).onfinish = () => rebuildAll();
      }
    });
  });

  /* ---------- the thread: one line that winds down the page, drawn as you scroll ----------
     Its tip always sits where you are reading: the line is sampled once, so for any height on the page we know how
     much of it to draw (a line that swings across the page is longer than the distance it goes down). */
  const thread = $(".thread"), main = $("main"), fg = thread && $(".thread-fg", thread), tip = thread && $(".thread-tip", thread);
  let threadOn = false, samples = [], total = 1;
  function buildThread() {
    if (!thread || getComputedStyle(thread).display === "none") { threadOn = false; return; }
    const mr = main.getBoundingClientRect(), W = main.clientWidth, H = main.scrollHeight;
    const wrap = $(".sec .wrap").getBoundingClientRect();
    const L = Math.max(18, (wrap.left - mr.left) / 2), R = W - L;
    /* it runs down one side margin and crosses to the other side in the empty space at the top of each section */
    const secs = $$(".sec, .cta-band").map((x) => { const r = x.getBoundingClientRect(); return { top: r.top - mr.top, pad: Math.min(parseFloat(getComputedStyle(x).paddingTop) || 80, 120) }; });
    if (!secs.length) return;
    let side = R, d = `M${R} ${Math.max(40, secs[0].top - 380)}`;
    secs.forEach((s, i) => {
      const to = side === R ? L : R, y = s.top + s.pad * .42, dip = 26 * (i % 2 ? 1 : -1), mx = (L + R) / 2, k = to - side;
      d += ` L${side} ${y - 70}`;
      d += ` C${side} ${y - 10} ${mx - k * .2} ${y + dip} ${mx} ${y}`;
      d += ` c${k * .06} ${-dip * .6} ${k * .1} ${dip * .9} ${k * .04} ${dip * 1.1}`;
      d += ` S${mx - k * .05} ${y - dip * .8} ${mx + k * .12} ${y - dip * .3}`;
      d += ` C${mx + k * .35} ${y + 10} ${to} ${y - 4} ${to} ${y + 70}`;
      side = to;
    });
    d += ` L${side} ${H - 30}`;
    thread.setAttribute("viewBox", `0 0 ${W} ${H}`);
    thread.style.height = H + "px";
    $$("path", thread).forEach((p) => p.setAttribute("d", d));
    /* sample: [length, the lowest point reached so far] */
    total = fg.getTotalLength(); samples = []; let maxY = 0;
    for (let l = 0; l <= total; l += 12) { const pt = fg.getPointAtLength(l); maxY = Math.max(maxY, pt.y); samples.push([l, maxY]); }
    fg.style.strokeDasharray = `${total} ${total}`;
    threadOn = true; thread.classList.add("live");
    drawThread();
  }
  function drawThread() {
    if (!threadOn) return;
    const mr = main.getBoundingClientRect();
    const target = innerHeight * .62 - mr.top;                 /* the height on the page we are reading at */
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (samples[m][1] < target) lo = m + 1; else hi = m; }
    const len = reduce ? total : samples[lo][0];
    fg.style.strokeDashoffset = String(total - len);
    const pt = fg.getPointAtLength(len); tip.setAttribute("cx", pt.x); tip.setAttribute("cy", pt.y);
  }

  /* ---------- the story's timeline draws as you read it ---------- */
  const story = $(".story"), sfg = story && $(".story-fg", story), sbg = story && $(".story-bg", story), stops = $$(".milestones li");
  let storyH = 0;
  function buildStory() {
    if (!story) return;
    const r = story.getBoundingClientRect(), dots = $$(".ms-dot", story).map((d) => { const q = d.getBoundingClientRect(); return [q.left - r.left + q.width / 2, q.top - r.top + q.height / 2]; });
    if (!dots.length) return;
    let d = `M${dots[0][0]} ${dots[0][1]}`;
    for (let i = 1; i < dots.length; i++) { const [x, y] = dots[i], py = dots[i - 1][1], m = (py + y) / 2, w = i % 2 ? 22 : -22; d += ` C${x + w} ${py + (m - py) * .6} ${x - w} ${m + (y - m) * .4} ${x} ${y}`; }
    sfg.setAttribute("d", d); sbg.setAttribute("d", d);
    storyH = r.height; drawStory();
  }
  function drawStory() {
    if (!story) return;
    const r = story.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight * .62 - r.top) / Math.max(1, r.height - 20)));
    sfg.style.strokeDashoffset = reduce ? "0" : String(1 - k);
    stops.forEach((li) => { const q = $(".ms-dot", li).getBoundingClientRect(); li.classList.toggle("lit", reduce || q.top < innerHeight * .62); });
  }

  /* ---------- sketch → website, driven by the scroll (computers); on phones it simply draws ---------- */
  const sk = $(".sketch"), frame = sk && $(".sk-frame", sk), wires = sk ? $$(".sk-draw path", sk) : [], note = sk && $(".sk-notes path", sk);
  const skSteps = sk ? $$(".sk-steps li", sk) : [], skLabels = sk ? $$(".sk-label span", sk) : [];
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  function drawSketch() {
    if (!sk) return;
    const wide = innerWidth >= 900;
    let p;
    if (wide) { const r = sk.getBoundingClientRect(); p = clamp01(-r.top / Math.max(1, r.height - innerHeight)); }
    else { const r = frame.getBoundingClientRect(); p = clamp01((innerHeight * .9 - r.top) / (innerHeight * .9)); }
    if (reduce) p = 1;
    wires.forEach((w, i) => { w.style.strokeDashoffset = String(1 - clamp01((p - i * .045) / .32)); });
    note.style.strokeDashoffset = String(1 - clamp01((p - .42) / .12));
    frame.style.setProperty("--real", clamp01((p - .55) / .3).toFixed(3));
    frame.style.setProperty("--sat", clamp01((p - .7) / .25).toFixed(3));
    frame.style.setProperty("--wire", (1 - clamp01((p - .75) / .2) * .85).toFixed(3));
    const stage = p < .4 ? 0 : p < .78 ? 1 : 2;
    skSteps.forEach((li, i) => li.classList.toggle("on", i === stage));
    skLabels.forEach((l, i) => l.classList.toggle("on", i === stage));
  }

  /* ---------- back to top: the ring fills as you read ---------- */
  const totop = $(".totop");
  function drawRing() {
    const room = Math.max(1, document.documentElement.scrollHeight - innerHeight), k = scrollY / room;
    totop.style.setProperty("--ro", String(1 - k));
    totop.classList.toggle("on", scrollY > 600);
  }

  /* ---------- the pointer leaves a fading line in the hero ---------- */
  const cv = $(".trail");
  if (cv && !reduce && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const ctx = cv.getContext("2d"), hero = $(".hero"), pts = [];
    let raf = 0;
    const size = () => { const r = hero.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener("resize", size);
    hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); pts.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }); if (!raf) raf = requestAnimationFrame(paint); });
    function paint() {
      raf = 0; const now = performance.now();
      while (pts.length && now - pts[0].t > 900) pts.shift();
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1], b = pts[i], c = pts[i + 1], age = (now - b.t) / 900;
        ctx.beginPath(); ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2); ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        ctx.strokeStyle = `rgba(217,119,87,${(1 - age) * .85})`; ctx.lineWidth = 3.2 * (1 - age) + .6; ctx.lineCap = "round"; ctx.stroke();
      }
      if (pts.length) raf = requestAnimationFrame(paint);
    }
  }

  /* one scroll handler for everything that follows the scroll */
  let tick = 0;
  const onFrame = () => { tick = 0; drawThread(); drawStory(); drawSketch(); drawRing(); };
  addEventListener("scroll", () => { if (!tick) tick = requestAnimationFrame(onFrame); }, { passive: true });
  const rebuild = () => requestAnimationFrame(() => { buildThread(); buildStory(); onFrame(); });
  addEventListener("resize", rebuild);
  addEventListener("load", rebuild);
  if (document.fonts) document.fonts.ready.then(rebuild);
  setTimeout(rebuild, 2000);
  onFrame();

  /* start in the remembered language (or ?lang=en) */
  let start = new URLSearchParams(location.search).get("lang");
  if (!start) try { start = localStorage.getItem("lang"); } catch {}
  if (start === "en") setLang("en", false);
})();
