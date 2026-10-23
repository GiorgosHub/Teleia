/* teleia. — Greek (the language written in the page) and English.
   Every text has a key: data-t="key" (text), data-ta="attr:key|attr:key" (attributes: aria-label, alt, content …).
   The Greek is read from the page itself when it loads; the English is below. Texts that only scripts show (the
   pointer's labels, messages, the bug game) are in JS, in both languages.
   ?lang=en opens the page in English; the choice is remembered on this device. */
(() => {
  "use strict";
  const EN = {
    metaTitle: "teleia. — Websites down to the last dot · George Sabanis & Asteris Pitas",
    metaDesc: "The portfolio of George Sabanis and Asteris Pitas: websites and web apps from Larissa, Greece. See Giannotas Premium Auto Salon and PROJECT 7o.",
    ogTitle: "teleia. — Websites down to the last dot", ogDesc: "Websites and web apps from Larissa, Greece. See the projects.",
    skip: "Skip to content", brandAria: "teleia. — back to the top", navAria: "Main menu", langAria: "Language", menu: "Menu",
    themeDark: "Switch to the dark theme",
    navWork: "Work", navProcess: "How we work", navLab: "Lab", navTeam: "Us", navContact: "Contact",

    heroPlace: "Larissa, Greece", duoTxt: "One team, two people",
    heroTitle: "Websites down to the very last dot",
    heroLead: "George and Asteris build websites and web apps in Larissa, Greece. Two real projects, both live.",
    seeWork: "See the projects", writeUs: "Write to us",
    hk1: "Phone first", hk2: "Greek & English", hk3: "Code checked by us",
    stk1: "Real projects", stk2: "versions", stk3: "languages",
    mq1: "Websites", mq2: "Web apps", mq3: "AI assistants", mq4: "Greek & English", mq5: "Phone first", mq6: "Live data", mq7: "Larissa",

    workTitle: "Two projects, both live",
    workLead: "Real projects for real people, not templates. Pick one to see it up close.",
    ixG: "Car dealership and parts, Larissa", ixP: "Our school's website, in 15 languages", live: "Live",

    gLead: "A website for a car dealership and parts shop in Larissa. The owner posts his listings on car.gr, and the website shows them by itself.",
    openSite: "Open the website", galG: "Screens from Giannotas",
    g1h: "The speedometer", g1p: "The home page: the logo as a speedometer.",
    g2h: "X-ray", g2p: "The car in X-ray, to find the right part.",
    g3h: "Live numbers", g3p: "Numbers that count live, and a strip of the models.",
    g4h: "Chassis code", g4p: "Parts by the car's chassis code.",
    g5h: "End of page", g5p: "The end of every page: call and directions.",
    gA1: "The Giannotas home page with the speedometer logo", gA2: "The car in X-ray", gA3: "Live numbers and a strip of the models",
    gA4: "Search by chassis code", gA5: "The end of the page with call and directions",
    gIgn: "The arrival in five frames: the logo's needle sweeps and every line of the speedometer lights up the moment it passes over it.",
    gIgnA: "The arrival in five frames: the logo's needle sweeps the speedometer",
    gf1h: "Live from car.gr", gf1p: "Whatever sells and comes down from the listings leaves the website too, by itself.",
    gf2h: "A car in X-ray", gf2p: "Tap the engine, the brakes or the interior and see its parts.",
    gf3h: "By chassis code", gf3p: "E90, F10, R56: the search understands both Greek and Latin letters.",
    gf4h: "The real logo", gf4p: "Traced from a photo into clean lines, with the needle moving like a speedometer.",
    gf5h: "Call, your way", gf5p: "Landline or mobile, with the opening hours beside it, and a form for a visit or a test drive.",
    gf6h: "Ready for Google and Viber", gf6p: "Every car has its own title, preview picture and place in the sitemap.",
    gf7h: "Strict security", gf7p: "Content-Security-Policy, HTTPS, and every request checked before it reaches car.gr.",
    gf8h: "Tested", gf8p: "54 automated checks, sizes from 320 to 1920 pixels, a measured 60 frames per second.",
    baTitle: "Before and after",
    baSub: "Drag the handle. On the left, an older version with a glowing sign; on the right, today's: the real logo, matte black, letters you can read.",
    before: "Before", after: "After", baAria: "Before and after comparison", baAfterA: "Today's version", baBeforeA: "An older version",
    gg1: "versions until it was just right", gg2: "automated checks before every delivery", gg3: "frames per second while scrolling, measured",
    verTitle: "25 versions in one line", verSub: "From the first architecture to what the client wanted. Drag the line.",
    verAria: "The versions of Giannotas, scroll sideways",
    v1: "The architecture: pages, the car.gr connection, search.", v2: "The first big redesign, a call button with landline and mobile.",
    v3: "Smoother motion, a new headline.", v4: "The real logo everywhere, the moving needle, high resolution.",
    v5: "A commercial design, light and dark surfaces.", v6: "Matte black, the speedometer intro, live numbers, no 3D.",
    v7: "Inter everywhere, a still logo: just as the client wanted.",
    builtWith: "Built with",

    pLead: "An unofficial website for the 7th EPAL of Larissa, our school. Everything a student needs during the day, in one place.",
    galP: "Screens from PROJECT 7o",
    p1h: "Live clock", p1p: "The home page, with a live clock and the bells.",
    p2h: "Your space", p2p: "What a student needs for today.",
    p3h: "Timetable", p3p: "The timetable of every class.",
    p4h: "The school in 3D", p4p: "Turn around and explore the entrance, the yard and the buildings.",
    p5h: "Holidays", p5p: "The holiday calendar.",
    p6h: "Lab", p6p: "Study timer, a goal for the day, flashcards.",
    pA1: "The PROJECT 7o home page with a live clock", pA2: "The student's space", pA3: "A class timetable", pA4: "The school in 3D",
    pA5: "The holiday calendar", pA6: "The student lab",
    langTitle: "15 languages, one website",
    langP: "Greek, English, German, Spanish, Russian, Albanian, Persian, Hebrew, French, Chinese, Hindi, Arabic, Bengali, Portuguese and Indonesian: the ten most spoken languages in the world among them. Persian, Hebrew and Arabic are written right to left, and the whole page turns around.",
    pf1h: "Bells in real time", pf1p: "What period it is now and when the next bell rings, with a bar that fills up.",
    pf2h: "Find your class", pf2p: "Type your class and see what lesson you have now, and all week.",
    pf3h: "AI assistant", pf3p: "For questions and exercises. Its key stays on the server, never in the browser.",
    pf4h: "Works offline too", pf4p: "It installs like an app on your phone and opens without internet.",
    pf5h: "Handing in homework", pf5p: "Links to the PBworks spaces, protected with a password.",
    pf6h: "Report a bug", pf6p: "One button to tell us what doesn't work.",
    posterTitle: "And a poster for the hallways", posterP: "An A4 poster with a QR code, so anyone can open the website with their phone's camera.",
    posterA: "The A4 PROJECT 7o poster with a QR code",

    procTitle: "From a line to a website",
    st1h: "Planning", st1p: "What the project needs, in what order, and when.",
    st2h: "Sketch", st2p: "What goes where: menu, headline, buttons, photos.",
    st3h: "Design", st3p: "Colours, letters and motion that fit the content.",
    st4h: "Code and testing", st4p: "Written and fixed by us, with AI as a tool. Tested on phones and computers.",
    st5h: "Live", st5p: "It goes online, and the next version starts from here.",
    whoA: "Asteris", whoG: "George", whoBoth: "Together", stamp: "live", ph1: "sketch", ph2: "design", ph3: "live",

    teamTitle: "Two people, one team",
    teamLead: "Asteris plans what gets built and when. George designs it and writes the code. Tap a card to turn it over.",
    gName: "George Sabanis", gSum: "Designs and writes the code, from the first idea until it goes live.",
    gB1: "Debugs on his own: finds the mistakes in the code and fixes them.", gB2: "Uses AI as a tool, not to do the job for him.",
    gB3: "Checks every page on phones and computers.", gB4: "Loves computers and servers.",
    aName: "Asteris Pitas", aSum: "Runs the projects: what gets built and when.",
    aB1: "Puts in order what every project needs.", aB2: "Makes sure what was planned gets finished.", aB3: "Together we built PROJECT 7o for our school.",
    storyTitle: "Our story, so far",
    sy1: "Our first big website, for our school: timetable, announcements, an AI assistant, 15 languages, the school in 3D.",
    syOct: "Oct 2026", sy2: "Cars and parts live from car.gr, 25 versions, live since October.",
    sy3: "We give a name to what we already do: websites, down to the last dot.",
    syNext: "Next", sy4h: "The next project", sy4: "The next line goes here.",

    labTitle: "Lab", labSub: "Four little things to play with. And to see how we work.",
    bugTitle: "Find the 3 bugs", bugSub: "This code wants to add up prices, but it doesn't work. Tap the lines to blame.",
    bugHint: "Tip: look at the quotes, the <= and the letters.", again: "Again",
    drawTitle: "Draw a line", drawSub: "Every project starts with a line. Draw one: it will redraw itself and put a dot at the end.",
    padHint: "draw here", clear: "Clear", padAria: "Drawing board",
    termTitle: "Before every delivery", termSub: "The real commands that run before a version of Giannotas goes out.",
    termSr: "The commands: checking the functions (20 out of 20 passed), checks in the browser (34 out of 34), checking the links (none broken).",
    meterTitle: "This page, right now", liveWord: "live", meterSub: "Measured right now on your own device, not written in advance.",
    mFps: "frames per second", mLoad: "ms to load", mKb: "KB of files in total", mReq: "files loaded",

    faqTitle: "Questions",
    q1: "Who are you?", a1: "George Sabanis, who writes the code, and Asteris Pitas, who runs the projects. We're from Larissa, Greece.",
    q2: "Does AI build everything?", a2: "No. AI is a tool that makes us faster. We check the code ourselves: we debug, find the mistakes and fix them, and we test every page on phones and computers.",
    q3: "In which languages?", a3: "Greek and English, like this page, and as many more as needed: PROJECT 7o has 15.",
    q4: "Do they work on phones?", a4: "Phones first. Every page is checked from the smallest phones, 320 pixels wide, up to big screens.",
    q5: "Is this page safe?", a5: "Yes. It only opens over HTTPS, has a strict security policy, no third-party ads or trackers, and the form stores nothing.",
    q6: "Why “teleia.”?", a6: "Teleia is Greek for “full stop”: we finish every project down to the last dot. And every heading on this page waits for its own, the red dot that travels down with you.",

    contactTitle: "Got an idea? Write to us",
    contactSub: "Want to say something about one of our projects, or just hi? One message is enough.",
    copy: "Copy",
    h1h: "You write", h1p: "What's on your mind, in your own words.",
    h2h: "We read it", h2p: "We reply to the email you gave us.",
    h3h: "We talk it over", h3p: "If you like, we talk about your idea.",
    fName: "Name", eName: "Write your name.", fEmail: "Email", eEmail: "Write an email like name@example.com, so we can reply.",
    fMsg: "Message", eMsg: "Write a short message.", send: "Write the message",
    formNote: "Then you choose how it goes out: Gmail, Outlook or your email app. This page stores nothing.",
    waysTitle: "Your message is ready. Where do you want to send it from?",
    wApp: "Email app", copyMsg: "Copy message",
    waysNote: "It goes to tipsandgreeks@gmail.com. If you copy the message, you can paste it into any email you like.",

    fPage: "Page", fFaq: "Questions", fSign: "teleia. George Sabanis & Asteris Pitas, Larissa.",
    fNote: "Made with code, not a template. No cookies, no tracking.", toTop: "Top",

    nfMeta: "Not found — teleia.", nfTitle: "This page doesn't exist.", nfSub: "The line stopped before the dot. Let's go back to the start.", nfBtn: "To the home page",
  };

  /* texts only scripts show */
  const JS = {
    el: {
      cOpen: "Άνοιγμα", cVisit: "Επίσκεψη", cDrag: "Σύρετε", cDraw: "Ζωγραφίστε", cFlip: "Γυρίστε",
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
      langNames: { el: "ΕΛ", en: "EN", de: "DE", es: "ES", ru: "RU", sq: "SQ", fa: "FA", he: "HE", fr: "FR", zh: "ZH", hi: "HI", ar: "AR", bn: "BN", pt: "PT", id: "ID" },
    },
    en: {
      cOpen: "Open", cVisit: "Visit", cDrag: "Drag", cDraw: "Draw", cFlip: "Turn",
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
      langNames: { el: "EL", en: "EN", de: "DE", es: "ES", ru: "RU", sq: "SQ", fa: "FA", he: "HE", fr: "FR", zh: "ZH", hi: "HI", ar: "AR", bn: "BN", pt: "PT", id: "ID" },
    },
  };

  const $$ = (s) => [...document.querySelectorAll(s)];
  const EL = {};
  /* read the Greek from the page once */
  $$("[data-t]").forEach((e) => { if (!(e.dataset.t in EL)) EL[e.dataset.t] = e.textContent.trim(); });
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
    $$("[data-t]").forEach((e) => { const v = get(e.dataset.t); if (e.textContent.trim() !== v) e.textContent = v; });
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
