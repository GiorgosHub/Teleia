# teleia. — portfolio of George Sabanis & Asteris Pitas

A static site (HTML, CSS, plain JavaScript), ready for Vercel. Greek is the main language, English is complete. The
only build step is a security one (`tools/build.mjs`, see [Security](#security)); the pages also open straight from a
folder.

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
  numbers that roll like an odometer (`initOdometers`). All four are real: 5 projects online, 25 versions of
  Giannotas, 15 languages in PROJECT 7o, 203 automated checks (54 + 51 + 47 + 51).
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
- **The five projects are a deck** of big tilted cards you slide, drag or step through (`makeSlider`), with a
  counter and a bar; with a mouse a card leans towards the pointer.
- **Two bands of huge outlined words** slide sideways with the scroll and lean with its speed (`initKinetic`).
- **A stack of cards:** every section slides up over the one before, with rounded top corners.
- **The footer word** steps away from the pointer, and its red full stop can be pulled like elastic.
- A full stop at the end of a heading is glued to the last word, so it never sits alone on a line.

## Small interactions (v7)
Every control answers the finger and the pointer in its own way, and the press works on phones too (iOS shows
`:active` only on pages that listen to touches, so the page does).
- **Buttons** lift under a mouse, press down onto their shadow under a finger or a click (quickly), and spring back.
  Hover effects exist only where a pointer can hover, so a tap never leaves a button stuck in the air.
- **The header:** the logo's full stop hops; the red language pill slides between ΕΛ and EN; the moon sets and the sun
  rises; on a phone the menu's two lines fold into a cross and the links follow the panel down one by one.
- **The menu marks the section you are reading**, by page position (the menu's order is not the page's order).
- **Questions open and close smoothly:** the box follows the answer's height and the answer rises in; a second click
  halfway turns it around (`initDetails`). Without the script they simply open.
- **The form:** an answer that is right turns the field green with a tick; a send with gaps shakes the missing fields,
  shows the errors sliding in and focuses the first one; the ways to send arrive one after the other.
- **Copy** says "Copied" with a tick on the button itself, at the same width, then goes back; the toast is a yellow
  note, readable on the cream paper and on the black contact section.
- **Sliders:** the counter's digit drops in, the arrows lean the way they go, and an arrow with nothing more that way
  sinks into the paper.
- **Cards** lift (and their screen zooms a little) under a mouse and press under a finger; **team cards** lean away
  when pointed at, a hint that they turn.
- **The Lab:** a found bug flashes and slides in fixed, and keeps the keyboard focus; drawing never selects the text
  around the pad.
- **Between the two pages** the old page lifts away and the new one rises in (cross-document View Transitions, in
  Chrome, Edge and Safari; elsewhere a normal page load).

## Two pages
The first page stays short; the projects up close live on a page of their own, so the screens of every project are
not all stacked on the first page.

**`index.html`, top to bottom**
1. **Hero** — the headline with the turning first word, the ball, stickers, a marquee.
2. **Work** (red) — the deck of the five projects. Each card opens that project on the projects page.
3. **In a few words** — the sentence with small screens in it, and the four numbers.
4. **From a line to a website** (pinned) — the scroll draws a sketch, colours it in, wipes the real site over it and
   stamps it "online", while the five steps of how we work light up.
5. **Team** — two cards that turn over, and our story so far.
6. **Lab** — find the bugs, draw a line, the real pre-delivery commands, this page measured live.
7. **Questions** and **Contact** (the form writes an email; nothing is stored or sent from the page).

**`erga.html` (online as `/erga`): the projects up close**
1. A red head with a way back and a link to each project.
2. **Giannotas** (matte black) — screens that slide sideways while you scroll down (pinned), the arrival in five
   frames, eight facts, before/after, three speedometers (25 versions, 54 checks, 60 fps), the version line.
3. **PROJECT 7o** — pinned screens, the welcome in 15 languages, sticky notes, the poster.
4. **MIRROR** (graphite) — the live site, five screens in the sideways gallery, six notes.
5. **DAYWIRE** (graphite, in progress) — the code on GitHub until it is live, five screens, six notes.
6. **Dubdeck** (ink) — the live site, five screens in the sideways gallery, six notes.
7. A way to write to us or go back.

Both pages use the same styles and the same script; a part that is not on a page simply does not start there.

## Files
- `index.html` and `erga.html` — the two pages, in Greek. Every text has a key (`data-t`, `data-ta` for attributes).
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
- `vercel.json` — the security headers and the build (see [Security](#security)).
- `api/csp-report.js` — receives the browser's reports of blocked content and logs a cleaned summary.
- `.well-known/security.txt` — how to report a security problem (renew its `Expires` date within a year).

## Change things
- **Then check:** `node tools/build.mjs` (from the repository's root) builds `portfolio/dist` and runs the security
  check. Vercel runs the same command before every deployment, so you never have to update fingerprints by hand.
- **A text:** the Greek in `index.html`, the English under the same key in `assets/js/i18n.js`.
- **Email:** `tipsandgreeks@gmail.com` in `index.html` and `EMAIL` in `assets/js/site.js`.
- **A new heading that the dot should land on:** end it with `<span class="stop" data-stop aria-hidden="true"></span>`.

## Speed
- One frame loop for the whole page: measure (only after resize, load, fonts or language), then every module reads,
  then every module writes. The loop sleeps when nothing moves.
- Everything that moves uses `transform` and `opacity` (the zoom circle is drawn large and scaled down, so its edge
  stays sharp). Pinned scenes run on phones and desktop, with gallery cards and the process scene sized for each viewport. The hero film plays muted while visible and pauses offscreen.

## Security
The site has no accounts, no database, no cookies and no tracking, and the form stores and sends nothing. What is left
to protect is the page itself, its visitors and the way it is built. The layers, from the browser outwards:

**In the browser (headers in `vercel.json`)**
- **Content Security Policy:** `default-src 'none'`, then only what the site uses, all from the site itself (scripts,
  styles, images, the font, the video). No inline code, no `eval`, no `data:` or `blob:` URLs, no connections out
  (`connect-src 'none'`), no forms posting anywhere (`form-action 'none'`), no plugins, no `<base>`, and no framing.
- **Trusted Types** with no policy at all: the APIs that turn text into HTML or code (`innerHTML`, `eval`, a script's
  `src` from text...) throw. The site builds every element with `createElement` and `textContent`, so nothing breaks.
- **Fingerprints:** every script and stylesheet carries `integrity="sha384-…"`, and the `Integrity-Policy` header
  makes the browser refuse any script without one. A file changed anywhere on the way is refused.
- **Isolation:** `Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy` and `Cross-Origin-Resource-Policy`
  (`same-origin`; only the sharing picture and the touch icon may be shown elsewhere), `Origin-Agent-Cluster`, and
  `Access-Control-Allow-Origin` naming only this site (instead of Vercel's default `*`).
- **Everything else:** HSTS for two years with preload, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy:
  no-referrer` (and `rel="noopener noreferrer"` on every new-tab link), and a Permissions-Policy that turns off the
  camera, microphone, location, payments, USB, reading the clipboard and more.
- **Reports:** a blocked script or file is reported to `/api/csp-report`, which logs a short, cleaned line in the
  Vercel logs (POST only, 8 KB at most, known types only; nothing stored).

**At the edge (Vercel Firewall, project "teleia")**
- Probes for admin pages, secret files and other platforms (`/.env`, `/.git`, `/wp-admin`, `.php` and similar) are
  denied, and the address that sent them is blocked for an hour.
- Only `GET` and `HEAD` are allowed, plus `POST` to the reporting endpoint.
- The reporting endpoint is rate-limited per address.
- Vercel's own DDoS protection is always on.

**Before anything goes live**
- `tools/build.mjs` copies only the public files into `portfolio/dist` (no README, config or function source is ever
  published), writes the fingerprints, then checks the headers, the pages, the scripts, the stylesheets,
  `security.txt` and the whole repository for secrets. Vercel runs it as the build command: if a check fails, the
  deployment fails and the site stays on its last good version.
- GitHub runs the same check on every push and pull request and every Monday (`.github/workflows/security.yml`,
  read-only, its action pinned to an exact commit), plus CodeQL code scanning, secret scanning with push protection,
  and Dependabot for the pinned action. `main` cannot be force-pushed or deleted.
- How to report a problem: `SECURITY.md` at the root of the repository and `/.well-known/security.txt`.

## Put it online
On vercel.com: import the repository, root directory `portfolio`, framework "Other". The build command and the output
directory come from `vercel.json` (`node ../tools/build.mjs`, `dist`).
