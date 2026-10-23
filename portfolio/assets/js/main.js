/* teleia. v3 — the page's script, in small modules (no build step: the browser loads them as they are).
   core/dom.js     helpers, media queries, texts
   core/loop.js    the one frame loop: measure → read → write, asleep when nothing moves
   features/*.js   one file per thing that moves or answers
   Texts come from i18n.js (window.I18N). Nothing is stored or sent; the theme and the language are remembered on
   this device only. With "reduce motion" nothing travels, pins or sways: everything is simply there. */
import { $, root } from "./core/dom.js";
import { initPin, initGalleries } from "./features/gallery.js";
import { initReveal } from "./features/reveal.js";
import { initTraveler } from "./features/traveler.js";
import { initProcess } from "./features/process.js";
import { initStage, initMagnets, initIndexThumbs, initCursor } from "./features/pointer.js";
import { initIntro, initTheme, initLang, initNav, initClock, initCopy } from "./features/ui.js";
import { initMarquee, initGauges, initBeforeAfter, initHello, initVersions, initFlips, initSparks } from "./features/extras.js";
import { initLab } from "./features/lab.js";
import { initForm } from "./features/form.js";

const safe = (name, fn) => { try { fn(); } catch (e) { console.warn("[teleia]", name, e); } };

safe("pin", initPin);
safe("reveal", initReveal);
safe("theme", initTheme);
safe("lang", initLang);
safe("nav", initNav);
safe("clock", initClock);
safe("copy", initCopy);
safe("galleries", initGalleries);
safe("process", initProcess);
safe("traveler", initTraveler);
safe("stage", initStage);
safe("magnets", initMagnets);
safe("thumbs", initIndexThumbs);
safe("cursor", initCursor);
safe("marquee", initMarquee);
safe("gauges", initGauges);
safe("beforeAfter", initBeforeAfter);
safe("hello", initHello);
safe("versions", initVersions);
safe("flips", initFlips);
safe("sparks", initSparks);
safe("lab", initLab);
safe("form", initForm);
safe("intro", () => initIntro(() => { $(".hero").classList.add("in"); $(".hero-title").classList.add("in"); }));
root.classList.add("ready");
