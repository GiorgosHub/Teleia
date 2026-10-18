/* teleia. — Greek (the language written in the page) and English.
   Every text has a key: data-t="key" (text), data-th="key" (text with <b> marks), data-ta="attr:key|attr:key"
   (attributes: aria-label, alt, content …). The Greek is read from the page itself when it loads; the English is
   below. Texts that only scripts show (the pointer's labels, messages, the bug game) are in JS, in both languages.
   ?lang=en opens the page in English; the choice is remembered on this device. */
(() => {
  "use strict";
  const EN = {
    metaTitle: "teleia. — Websites down to the last dot · George Sabanis & Asteris Pitas",
    metaDesc: "The portfolio of George Sabanis and Asteris Pitas: websites and web apps from Larissa, Greece. See Giannotas Premium Auto Salon and PROJECT 7o.",
    ogTitle: "teleia. — Websites down to the last dot", ogDesc: "Websites and web apps from Larissa, Greece. See the projects.",
    skip: "Skip to content", brandAria: "teleia. — back to the top", navAria: "Main menu", langAria: "Language", menu: "Menu",
    themeAria: "Switch to the dark theme", sdotsAria: "Sections of the page",
    navWork: "Work", navLab: "Lab", navTeam: "Us", navContact: "Contact",
    sdTop: "Top", sdNumbers: "Numbers", sdSketch: "Sketch", sdStory: "Story", sdFaq: "Questions",

    heroPill: "Larissa, Greece", rot0: "Websites", heroB: "down to the last dot.",
    duoTxt: "One team, two people",
    seeWork: "See the projects", playLab: "Play in the lab",
    hk1: "Phone first", hk2: "Greek & English", hk3: "Code checked by us",
    stk1: "Real projects", stk2: "Made in Larissa", stk3: "8 languages", stk4: "25 versions", scrollHint: "scroll down",

    mq1: "Websites", mq2: "Web apps", mq3: "AI assistants", mq4: "Greek & English", mq5: "Phone first", mq6: "Live data", mq7: "Larissa",

    manTitle: "Our team",
    manText: "Two people, one team. Asteris plans what gets built and when. George designs it and writes the code. We check it on phones and computers, and we finish it down to the last dot.",

    numTitle: "In numbers",
    n1: "real projects, both live",
    n2: "languages in PROJECT 7o, including Persian and Hebrew, written right to left",
    n3: "versions of Giannotas until it was just right",
    n4: "automated checks run before every Giannotas delivery",
    n5: "frames per second while scrolling Giannotas, measured, not promised",
    n6: "console errors across every page of Giannotas",

    adAria: "Advertisement", adTag: "Advertisement", adOwn: "for our own project", adBurst: "NEW!",
    ad1k: "Now live",
    ad1h: "Giannotas Premium Auto Salon. Matte black, live data, a speedometer that lights up as you arrive.",
    ad1p: "Cars and parts straight from its car.gr listings, a car in X-ray to find the right part, and 25 versions down to the last detail.",
    ad1b: "See how it was made",
    ad2h: "Your school, on your phone.", ad2p: "Timetable, bells, announcements and an AI assistant, in 8 languages. It even opens without internet.", ad2b: "Open it",
    ad3h: "Got an idea for a website?", ad3p: "Write to us about what you have in mind. One message is enough.", ad3b: "Write to us",

    whatTitle: "What we build", whatSub: "Hover over a card or tap it: on the back is the project where we did it.",
    where: "We did it in", both: "both projects",
    w1: "Websites", w1t: "Fast, clean, phone first.", w1b: "Home page, cars, parts, a page for every listing.",
    w2: "Web apps", w2t: "Live timetables, search, tools.", w2b: "Real-time bells, find your class, a student lab.",
    w3: "AI assistants", w3t: "They answer right inside the page.", w3b: "An assistant for questions and exercises, with its key hidden on the server.",
    w4: "Many languages", w4t: "Greek, English and as many as needed.", w4b: "8 languages, right-to-left included.",
    w5: "Live data", w5t: "What changes elsewhere changes here too.", w5b: "The car.gr listings: whatever sells disappears by itself.",
    w6: "Security & speed", w6t: "HTTPS, a strict policy, 60 frames.", w6b: "No hidden tracking tools, no keys in the browser.",

    workTitle: "Work", workSub: "Real projects, not templates. Tap for the detailed look.",
    gAlt: "The home page of Giannotas Premium Auto Salon", p7Alt: "The home page of PROJECT 7o",
    statusWip: "In progress", statusLive: "Live",
    gShort: "A car showroom and parts shop in Larissa, live from car.gr.",
    tagCargr: "Live from car.gr", tagXray: "Car in X-ray", tagGauge: "Speedometer intro",
    p7Short: "An unofficial website for the 7th Vocational High School of Larissa: timetable, bells, AI assistant, 8 languages.",
    tag8: "8 languages", tagAI: "AI assistant", tag3d: "The school in 3D", lookClose: "Take a closer look",

    gKick: "A detailed look",
    gSub: "A website for a car showroom and parts shop in Larissa. The owner posts his listings on car.gr, and the website shows them by itself.",
    gS1t: "The speedometer", gS1: "The home page: the logo as a speedometer",
    gS2t: "X-ray", gS2: "The car in X-ray, to find parts",
    gS3t: "Live numbers", gS3: "Live numbers and a strip of every model",
    gS4t: "Chassis code", gS4: "Parts by the car's chassis code",
    gS5t: "End of the page", gS5: "The end of every page: call and directions",
    baTitle: "Before and after", baSub: "Drag the handle. On the left, an older version with a glowing sign; on the right, today's: the real logo, matte black, letters you can read.",
    baAfter: "Today's version", baBefore: "An older version", before: "Before", after: "After", baAria: "Before and after comparison",
    gaugeAlt: "Five moments of the intro: the needle sweeps and the ticks light up with it",
    gaugeCap: "The intro in five frames: the logo's needle sweeps and every tick of the speedometer lights up the moment it passes over it.",
    gf1: "Live from car.gr", gf1t: "Whatever sells and comes off the listings disappears from the website too, by itself.",
    gf2: "A car in X-ray", gf2t: "Tap a system, the brakes or the interior, and see its parts.",
    gf3: "By chassis code", gf3t: "E90, F10, R56: the search understands both Greek and Latin letters.",
    gf4: "The real logo", gf4t: "Traced from a photo into clean lines, with the needle moving like a speedometer.",
    gf5: "Call with a choice", gf5t: "Landline or mobile, with the opening hours next to them, and a form for a viewing or a test drive.",
    gf6: "Ready for Google and Viber", gf6t: "Every car has its own title, preview photo and place in the sitemap.",
    gf7: "Strict security", gf7t: "Content-Security-Policy, HTTPS, every request checked before it reaches car.gr.",
    gf8: "Tested", gf8t: "54 automated checks, sizes from 320 to 1920 pixels, measured smoothness.",
    verTitle: "25 versions in one line", verAria: "The versions of Giannotas, scroll sideways",
    v1: "The architecture: pages, the car.gr connection, search.",
    v2: "The first big redesign, a call button with landline and mobile.",
    v3: "Smoother motion, a new headline.",
    v4: "The real logo everywhere, the moving needle, high resolution.",
    v5: "A commercial design, light and dark surfaces.",
    v6: "Matte black, the speedometer intro, live numbers, no 3D.",
    v7: "Inter everywhere, a still logo: just as the client wanted.",
    builtWith: "Built with",

    p7Sub: "An unofficial website for the 7th Vocational High School of Larissa, our school. Everything a student needs during the day, in one place.",
    openSite: "Open the website",
    pS1t: "Live clock", pS1: "The home page with a live clock and bells",
    pS2t: "Your space", pS2: "The student's space for today",
    pS3t: "Timetable", pS3: "The timetable of every class",
    pS4t: "School in 3D", pS4: "The school in 3D",
    pS5t: "Holidays", pS5: "The holiday calendar",
    pS6t: "Lab", pS6: "The student lab with a study timer",
    lgTitle: "8 languages, one website",
    lgSub: "Greek, English, German, Spanish, Russian, Albanian, Persian and Hebrew. The last two are written right to left, and the whole page flips.",
    pf1: "Real-time bells", pf1t: "Which period it is now and when the next bell rings, with a bar that fills up.",
    pf2: "Find your class", pf2t: "Type your class and see which lesson you have now and all week.",
    pf3: "AI assistant", pf3t: "For questions and exercises. Its key stays on the server, not in the browser.",
    pf4: "The school in 3D", pf4t: "Turn around and explore the entrance, the yard and the buildings.",
    pf5: "Works offline too", pf5t: "Installs like an app on the phone and opens without internet.",
    pf6: "Assignment hand-in", pf6t: "Links to the class PBworks spaces, protected by a password.",
    pf7: "Student lab", pf7t: "Study timer, daily goal, flashcards, grade average.",
    pf8: "Report a mistake", pf8t: "One button to tell us what doesn't work, and a QR poster for the hallways.",
    posterAlt: "The A4 poster of PROJECT 7o with a QR code",
    posterTitle: "And a poster for the hallways", posterSub: "An A4 poster with a QR code, so anyone can open the website with their phone's camera.",
    visit: "Visit",

    mo1: "Sketch", mo2: "Design", mo3: "Code", mo4: "Debug", mo5: "Live",
    skTitle: "From a line to a website", skSub: "Every website starts as a sketch. Keep scrolling and watch it become real.",
    sk1: "Sketch", sk1t: "What goes where: menu, title, buttons, photos.",
    sk2: "Design", sk2t: "Colours, type and motion that suit the content.",
    sk3: "Website", sk3t: "The code, tested on phones and computers.",
    skL0: "sketch", skL1: "design", skL2: "live ✓",

    labTitle: "Lab", labSub: "Four little things to play with. And to see how we work.",
    bugTitle: "Find the 3 bugs", bugSub: "This code wants to add up prices, but it doesn't work. Tap the lines to blame.",
    bugHint: "Tip: look at the quotes, the <= and the letters.", again: "Again",
    drawTitle: "Draw a line", drawSub: "Every project starts with a line. Draw one: it will redraw itself and put a dot at the end.",
    padAria: "Drawing board", padHint: "draw here", clear: "Clear",
    termTitle: "Before every delivery", termSub: "The real commands that run before a version of Giannotas goes out.",
    termSr: "The commands: checking the functions (20 out of 20 passed), checks in the browser (34 out of 34), checking the links (none broken).",
    meterTitle: "This page, right now", liveWord: "live", meterSub: "Measured right now on your own device, not written in advance.",
    mFps: "frames per second", mLoad: "ms to load", mKb: "KB of files in total", mReq: "files loaded",

    teamTitle: "Who we are", teamSub: "George writes the code, Asteris plans the projects. Tap a card to flip it.",
    georgeIni: "GS", asterisIni: "AP", georgeName: "George Sabanis", georgeF: "Designs and writes the code, from the first idea until it goes live.",
    g1: "Debugs on his own: finds and fixes the mistakes in the code.", g2: "Uses AI as a tool, not to do the work for him.",
    g3: "Checks every page on phones and computers.", g4: "Loves computers and servers.",
    asterisName: "Asteris Pitas", asterisF: "Plans the projects: what gets built and when.",
    a1: "Puts in order what every project needs.", a2: "Makes sure what was planned gets finished.", a3: "Together we built PROJECT 7o for our school.",
    flowTitle: "How we work together",
    fl1: "Planning", fl1t: "What the project needs, in what order and when.",
    fl2: "Design", fl2t: "Colours, type, motion: how it will look.",
    fl3: "Code", fl3t: "Written and fixed by us, with AI as a tool.",
    fl4: "Testing", fl4t: "Phones, computers, automated checks, again if needed.",
    fl5: "Live", fl5t: "It goes online, and the next version starts from here.",
    asterisFirst: "Asteris", georgeFirst: "George", together: "Together",

    stTitle: "Our story", stSub: "Still short, but every part of it is real.",
    m1: "PROJECT 7o", m1t: "Our first big website, for our school: timetable, announcements, an AI assistant, 8 languages, the school in 3D.",
    m2t: "A website for a car showroom in Larissa: cars and parts live from car.gr, 25 versions. Live since October 2026.",
    m3w: "October 2026", m3t: "We give a name to what we already do: websites, down to the last dot.",
    m4w: "Next", m4: "The next project", m4t: "This is where the next line goes.",

    toolsTitle: "What we work with", toolsSub: "Modern, proven tools. AI helps us work faster; the code is checked and fixed by us.",
    tAI: "AI tools", tApi: "API integrations",

    faqTitle: "Questions",
    bub1: "I have a question…", askTitle: "Didn't find the answer?", askSub: "Ask us directly, in one message.", askBtn: "Ask us",
    q1: "Who are you?", a1x: "George Sabanis, who writes the code, and Asteris Pitas, who plans the projects. We're from Larissa, Greece.",
    q2: "Does AI build everything?", a2x: "No. AI is a tool that makes us faster. We check the code ourselves: we debug, find the mistakes and fix them, and test every page on phones and computers.",
    q3: "In which languages?", a3x: "Greek and English, like this page, and as many more as needed: PROJECT 7o has 8.",
    q4: "Do they work on phones?", a4x: "Phones first. Every page is checked from the smallest phones, 320 pixels, up to large screens.",
    q5: "Is this page safe?", a5x: "Yes. It only opens over HTTPS, has a strict security policy, no third-party ads or tracking tools, and the form stores nothing.",
    q6: "Why “teleia.”?", a6x: "“Teleia” is Greek for full stop: we finish every project down to the last dot. And every line on this page ends with one.",

    ctaS1: "Say hi", ctaS2: "No pressure", ctaTitle: "Got an idea? Let's build it.", ctaBtn: "Write to us",

    contactTitle: "Contact", contactSub: "Want to say something about one of our projects, or just hi? Write to us.",
    orEmail: "Or write to us directly:", copy: "Copy",
    ns1: "You write", ns1t: "What you have in mind, in your own words.",
    ns2: "We read it", ns2t: "We reply to the email you gave us.",
    ns3: "We talk it through", ns3t: "If you like, we talk about your idea.",
    fName: "Name", eName: "Write your name.", fEmail: "Email", eEmail: "Write an email like name@example.com, so we can reply.",
    fMsg: "Message", eMsg: "Write a short message.",
    send: "Send the message", formNote: "Then you choose how it goes out: Gmail, Outlook or your email app. This page stores nothing.",
    waysT: "Your message is ready. Where would you like to send it from?", wApp: "Email app", copyMsg: "Copy message",
    waysNote: "It goes to tipsandgreeks@gmail.com. If you copy the message, you can paste it into any email you like.",

    mf1: "down to the last dot", mf2: "made in Larissa",
    ftrDuo: "George & Asteris", fcPages: "Page", fcWork: "Projects", fcContact: "Contact", ftrCity: "Larissa, Greece",
    ftrName: "teleia. · George Sabanis & Asteris Pitas · Larissa", ftrMade: "Made with code, not a template. No cookies, no tracking.", toTop: "Top",

    nfMeta: "Not found — teleia.", nfTitle: "This page doesn't exist.", nfSub: "The line stopped before the dot. Let's go back to the start.", nfBtn: "To the home page",
    popAria: "New project", popT: "New: Giannotas is live", popS: "Matte black, a speedometer intro, Inter everywhere.", popB: "See the project", close: "Close",
  };

  /* texts only scripts show, in both languages */
  const JS = {
    el: {
      rot: ["Ιστοσελίδες", "Web εφαρμογές", "Βοηθοί AI"],
      cGo: "Πάμε", cLook: "Δείτε", cOpen: "Άνοιγμα", cPlay: "Παίξτε", cDrag: "Σύρετε", cDraw: "Ζωγραφίστε", cWrite: "Γράψτε",
      themeDark: "Αλλαγή σε σκούρο θέμα", themeLight: "Αλλαγή σε ανοιχτό θέμα",
      copied: "Αντιγράφηκε", copyFail: "Δεν έγινε αντιγραφή: επιλέξτε το κείμενο και αντιγράψτε το",
      mailSubject: "Μήνυμα από το teleia.", mailHello: "Γεια σας Γιώργο και Αστέρη,", mailName: "Όνομα", mailEmail: "Email",
      bug1: "Λάθος 1: το \"0\" είναι κείμενο, όχι αριθμός, οπότε οι τιμές κολλάνε η μία δίπλα στην άλλη.",
      bug2: "Λάθος 2: με <= ο βρόχος πάει μία θέση μετά το τέλος και προσθέτει undefined.",
      bug3: "Λάθος 3: sun αντί για sum. Ένα γράμμα, και η συνάρτηση σταματά.",
      bugDone: "Και τα 3! Έτσι δουλεύουμε κάθε μέρα: βρίσκουμε τα λάθη και τα διορθώνουμε μόνοι μας.",
      bugNo: "Αυτή η γραμμή είναι σωστή. Ψάξτε αλλού.",
      drawDone: "Και μια τελεία στο τέλος.",
      mailOpening: "Ανοίγει σε νέα καρτέλα· πατήστε «Αποστολή» εκεί.",
      langNames: { el: "ΕΛ", en: "EN", de: "DE", es: "ES", ru: "RU", sq: "SQ", fa: "FA", he: "HE" },
    },
    en: {
      rot: ["Websites", "Web apps", "AI assistants"],
      cGo: "Go", cLook: "Look", cOpen: "Open", cPlay: "Play", cDrag: "Drag", cDraw: "Draw", cWrite: "Write",
      themeDark: "Switch to the dark theme", themeLight: "Switch to the light theme",
      copied: "Copied", copyFail: "Couldn't copy: select the text and copy it yourself",
      mailSubject: "A message from teleia.", mailHello: "Hi George and Asteris,", mailName: "Name", mailEmail: "Email",
      bug1: "Bug 1: \"0\" is text, not a number, so the prices get glued together instead of added.",
      bug2: "Bug 2: with <= the loop goes one step past the end and adds undefined.",
      bug3: "Bug 3: sun instead of sum. One letter, and the function stops.",
      bugDone: "All 3! That's how we work every day: we find the mistakes and fix them ourselves.",
      bugNo: "This line is fine. Look elsewhere.",
      drawDone: "And a dot at the end.",
      mailOpening: "Opening in a new tab; press “Send” there.",
      langNames: { el: "EL", en: "EN", de: "DE", es: "ES", ru: "RU", sq: "SQ", fa: "FA", he: "HE" },
    },
  };

  const $$ = (s) => [...document.querySelectorAll(s)];
  const EL = {};
  /* read the Greek from the page once */
  $$("[data-t]").forEach((e) => { if (!(e.dataset.t in EL)) EL[e.dataset.t] = e.textContent; });
  $$("[data-th]").forEach((e) => { if (!(e.dataset.th in EL)) EL[e.dataset.th] = e.innerHTML; });
  const attrs = (e) => e.dataset.ta.split("|").map((p) => p.split(":"));
  $$("[data-ta]").forEach((e) => attrs(e).forEach(([a, k]) => { if (!(k in EL)) EL[k] = e.getAttribute(a); }));

  let lang = "el";
  const pick = () => {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "el") return q;
    try { const s = localStorage.getItem("lang"); if (s === "en" || s === "el") return s; } catch {}
    return "el";
  };
  function apply(l, save) {
    lang = l === "en" ? "en" : "el";
    const D = lang === "en" ? EN : EL, get = (k) => D[k] ?? EL[k] ?? "";
    document.documentElement.lang = lang;
    $$("[data-t]").forEach((e) => { const v = get(e.dataset.t); if (e.textContent !== v) e.textContent = v; });
    $$("[data-th]").forEach((e) => { const v = get(e.dataset.th); if (e.innerHTML !== v) e.innerHTML = v; });
    $$("[data-ta]").forEach((e) => attrs(e).forEach(([a, k]) => e.setAttribute(a, get(k))));
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    if (save) try { localStorage.setItem("lang", lang); } catch {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
    document.documentElement.classList.remove("i18n-wait");
  }
  window.I18N = {
    get lang() { return lang; },
    t: (k) => JS[lang][k] ?? JS.el[k] ?? EN[k] ?? k,
    set: (l) => apply(l, true),
    keys: { EN, EL, JS },
  };
  apply(pick(), false);
})();
