# teleia. — portfolio of George Sabanis & Asteris Pitas

A static site (HTML, CSS, plain JavaScript modules, no build step), ready for Vercel. Greek is the main language,
English is complete. Version 3: a new structure and a new way of moving, the same colours.

## The idea
*Teleia* is Greek for "full stop". One red dot is the hero's full stop. As you scroll, the hero holds still and the dot
grows until the whole window is red: you fall into the red section with the two projects. From there a dot travels
with you: it waits on a dotted rail in the left margin while you read, and jumps into place as the full stop of every
heading you reach. Headings it hasn't reached yet have no full stop.

## The page, top to bottom
1. **Hero** — the headline, three real screens at three depths (they follow the pointer), a marquee.
2. **Work** (red) — the index of the two projects; on a computer the screenshot follows the pointer.
3. **Giannotas** (matte black) — screens that slide sideways while you scroll down (pinned), the arrival in five
   frames, eight facts, before/after, three speedometers (25 versions, 54 checks, 60 fps), the version line.
4. **PROJECT 7o** — pinned screens, the welcome in 15 languages, sticky notes, the poster.
5. **From a line to a website** (pinned) — the scroll draws a sketch, colours it in, wipes the real site over it and
   stamps it "online", while the five steps of how we work light up.
6. **Team** — two cards that turn over, and our story so far.
7. **Lab** — find the bugs, draw a line, the real pre-delivery commands, this page measured live.
8. **Questions** and **Contact** (the form writes an email; nothing is stored or sent from the page).

## Files
- `index.html` — the whole page, in Greek. Every text has a key (`data-t`, `data-ta` for attributes).
- `assets/css/` — `tokens.css` (colours, type, spacing, motion), `base.css`, `components.css`, `sections.css`,
  `motion.css` (entrances, and what stops with "reduce motion").
- `assets/js/i18n.js` — the English for every key, plus texts only scripts show, in both languages.
- `assets/js/main.js` — starts every module. `core/dom.js` (helpers), `core/loop.js` (the one frame loop).
- `assets/js/features/` — one file per thing: `traveler.js` (the dot and the zoom), `gallery.js` (pinned screens),
  `process.js`, `reveal.js` (words rising, blocks settling), `pointer.js` (depth, magnets, cursor, thumbnails),
  `extras.js` (marquee, counters, speedometers, before/after, 15 languages, cards, sparks), `lab.js`, `form.js`,
  `ui.js` (intro, theme and language with a circle, menu, header, clock, toast).
- `assets/js/boot.js` — runs before the page is drawn (theme, intro once per visit, no Greek flash in English).
- `404.html` + `assets/js/nf.js` — the "not found" page.
- `vercel.json` — strict security headers. No inline scripts or styles anywhere, so they all hold.

## Change things
- **A text:** the Greek in `index.html`, the English under the same key in `assets/js/i18n.js`.
- **Email:** `tipsandgreeks@gmail.com` in `index.html` and `EMAIL` in `assets/js/features/form.js`.
- **A new heading that the dot should land on:** end it with `<span class="stop" data-stop aria-hidden="true"></span>`.

## Speed
- One frame loop for the whole page: measure (only after resize, load, fonts or language), then every module reads,
  then every module writes. The loop sleeps when nothing moves.
- Everything that moves uses `transform` and `opacity` (the zoom circle is drawn large and scaled down, so its edge
  stays sharp). Pinned scenes only on screens at least 960px wide; on phones the screens are a row you swipe.
- With "reduce motion": nothing pins, travels or sways; every full stop is simply printed.

## Put it online
On vercel.com: import the repository, root directory `portfolio`, framework "Other", no build command.
