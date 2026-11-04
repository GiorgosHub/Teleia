# teleia. — portfolio of George Sabanis & Asteris Pitas

A static site (HTML, CSS, plain JavaScript, no build step), ready for Vercel. Greek is the main language,
English is complete. Version 3: a new structure and a new way of moving, the same colours.

## The idea
*Teleia* is Greek for "full stop". One red dot is the hero's full stop. As you scroll, the hero holds still and the dot
grows until the whole window is red: you fall into the red section with the two projects. From there a dot travels
with you: it waits on a dotted rail in the left margin while you read, and jumps into place as the full stop of every
heading you reach. Headings it hasn't reached yet have no full stop.

## The page appears as you scroll (v4)
Around those signature moments, the rest of the page arrives in front of you as you read:
- **Paragraphs arrive line by line.** The script measures where each line breaks and gives every visual line its own
  mask; the lines rise one after another. Lines are rebuilt when a paragraph's width, its language or the font
  changes. Once a paragraph has arrived its masks stop clipping, so the finished page costs nothing extra to draw.
- **The four chapter leads fill in like ink:** each word goes from pale to full as the reading line (80% down the
  window) passes it.
- **Screens and the poster unveil from below,** as a curtain made only of transforms (a window rises while the screen
  inside it moves the other way), then drift a little against the scroll when there is a mouse.
- **The red index:** the rules draw themselves from the left, the names rise, and the big names drift sideways with
  the scroll.
- **Sticky notes** are stuck on one after the other, crooked at first; **questions** slide in; the **contact steps**
  pop in; the **form fields** follow each other.
- **Our story:** the rule above each step fills as you read it and its red dot lands when the rule starts.
- **The footer word** builds itself letter by letter as the footer comes up.

All of it is in `initScenes` (site.js) and the "scenes" part of motion.css. Hidden states exist only under
`html.scenes`, which is set at the end of a successful start: if the script fails, everything is simply visible.
Printing shows everything.
- **A new paragraph that should arrive line by line:** add its selector to `LINES` in site.js.
- **A new screen that should unveil:** add it to `UNVEIL` (it is wrapped in a `.uvm` window by the script; watch the
  box around it in `watchFor` if it is not inside `.film`, `.poster`, `.ba-block` or `.index-row`).

## Things to touch and drag (v5)
- **Glide:** a mouse wheel's notches glide to a soft stop (`initGlide`); trackpads, touch, the message box and
  sideways rows scroll natively; a key, a press or a link takes over at once.
- **The hero game:** a press anywhere in the hero (not on a link or a button) drops a red full stop; the pill counts
  them and, with a mouse, reads out the pointer's X/Y (`initPlay`).
- **In a few words:** a sentence with small project screens inside it, filling in as you read; under it four
  numbers that roll like an odometer (`initOdometers`). All four are real: 4 projects online, 25 versions of
  Giannotas, 15 languages in PROJECT 7o, 152 automated checks (54 + 51 + 47).
- **Our story** is a slider: a plain scrolling row of cards, with a 01 / 06 counter, a bar, two buttons and dragging
  (`makeSlider`).
- **Contact** reads as a conversation: every question is the field's own label, the four quick replies write the
  first line of the message and show as your answer. Nothing is sent from the page, as before.

## The big moves (v6)
- **The ball** (`initBall`): the hero's full stop is a giant red ball drawn on a canvas. Grab it and throw it: it
  bounces off the edges of the hero, squashes, spins, leaves ink where it hits, and a soft spring brings it home. A
  press on empty paper kicks it. On a phone it waits in the first screen, in the largest empty space beside the
  headline. When you scroll, the red zoom grows out of the ball (`ballView`, read by the traveler).
  Its canvas is only as big as the ball and moves by transform; it is redrawn only when its shape changes.
- **The first word turns over** (`initRotator`): websites, web apps, AI assistants. Its box is as wide as the longest
  word, so the headline never reflows; the full title stays in the page as text.
- **The four projects are a deck** of big tilted cards you slide, drag or step through (`makeSlider`), with a
  counter and a bar; with a mouse a card leans towards the pointer.
- **Two bands of huge outlined words** slide sideways with the scroll and lean with its speed (`initKinetic`).
- **A stack of cards:** every section slides up over the one before, with rounded top corners.
- **The footer word** steps away from the pointer, and its red full stop can be pulled like elastic.
- A full stop at the end of a heading is glued to the last word, so it never sits alone on a line.

## The page, top to bottom
1. **Hero** — the headline with the turning first word, the ball, stickers, a marquee.
2. **Work** (red) — the deck of the four projects.
3. **Giannotas** (matte black) — screens that slide sideways while you scroll down (pinned), the arrival in five
   frames, eight facts, before/after, three speedometers (25 versions, 54 checks, 60 fps), the version line.
4. **PROJECT 7o** — pinned screens, the welcome in 15 languages, sticky notes, the poster.
5. **MIRROR** (graphite) — the live site, five screens in the sideways gallery, six notes.
6. **DAYWIRE** (graphite, in progress) — the code on GitHub until it is live, five screens, six notes.
7. **From a line to a website** (pinned) — the scroll draws a sketch, colours it in, wipes the real site over it and
   stamps it "online", while the five steps of how we work light up.
8. **Team** — two cards that turn over, and our story so far.
9. **Lab** — find the bugs, draw a line, the real pre-delivery commands, this page measured live.
10. **Questions** and **Contact** (the form writes an email; nothing is stored or sent from the page).

## Files
- `index.html` — the whole page, in Greek. Every text has a key (`data-t`, `data-ta` for attributes).
- `assets/css/` — `tokens.css` (colours, type, spacing, motion), `base.css`, `components.css`, `sections.css`,
  `motion.css` (entrances and everything that moves).
- `assets/js/i18n.js` — the English for every key, plus texts only scripts show, in both languages.
- `assets/js/site.js` — every script of the page in one plain file, in sections: helpers and the one frame loop
  first, then one section per thing (`ui`, `extras`, `reveal`, `scenes` (the page appearing as you scroll),
  `traveler` (the dot and the zoom), `gallery`,
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
  stays sharp). Pinned scenes run on phones and desktop, with gallery cards and the process scene sized for each viewport. The hero film plays muted while visible and pauses offscreen.

## Put it online
On vercel.com: import the repository, root directory `portfolio`, framework "Other", no build command.
