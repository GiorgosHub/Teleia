# teleia. — portfolio of George Sabanis & Asteris Pitas

A static site (HTML, CSS, plain JavaScript, no build step), ready for Vercel. Greek is the main language,
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
- `assets/js/site.js` — every script of the page in one plain file, in sections: helpers and the one frame loop
  first, then one section per thing (`ui`, `extras`, `reveal`, `traveler` (the dot and the zoom), `gallery`,
  `process`, `pointer`, `lab`, `form`) and the start-up at the end. It also works when `index.html` is opened
  straight from a folder.
- `assets/js/boot.js` — runs before the page is drawn (theme, intro once per visit, no Greek flash in English).
- `assets/video/hero.mp4` — the silent Higgsfield hero film, with a still project screenshot as its poster.
- `404.html` + `assets/js/nf.js` — the "not found" page.
- `vercel.json` — strict security headers. No inline scripts or styles anywhere, so they all hold.

## Change things
- **A text:** the Greek in `index.html`, the English under the same key in `assets/js/i18n.js`.
- **Email:** `tipsandgreeks@gmail.com` in `index.html` and `EMAIL` in `assets/js/site.js`.
- **A new heading that the dot should land on:** end it with `<span class="stop" data-stop aria-hidden="true"></span>`.

## Speed
- One frame loop for the whole page: measure (only after resize, load, fonts or language), then every module reads,
  then every module writes. The loop sleeps when nothing moves.
- Everything that moves uses `transform` and `opacity` (the zoom circle is drawn large and scaled down, so its edge
  stays sharp). Pinned scenes run on phones and desktop, with gallery cards and the process scene sized for each viewport. The hero film plays muted while visible and pauses offscreen; reduced-motion preferences keep its poster still.
- With "reduce motion": nothing pins, travels or sways; every full stop is simply printed.

## Put it online
On vercel.com: import the repository, root directory `portfolio`, framework "Other", no build command.
