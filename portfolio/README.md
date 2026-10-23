# teleia. — portfolio of George Sabanis & Asteris Pitas

A static site (HTML, CSS, plain JavaScript, no build step), ready for Vercel. Greek is the main language, English
is complete.

## Files
- `index.html` — the whole page, written in Greek. Every text has a key (`data-t`, `data-th` for text with bold,
  `data-ta` for attributes such as `aria-label`, `alt` and the meta tags).
- `assets/js/i18n.js` — the English for every key, plus the texts only scripts show (pointer labels, the bug game,
  messages), in both languages. `?lang=en` opens the page in English; the choice is remembered on the device.
- `assets/js/site.js` — everything that moves or answers: the opening line, the pointer, sparks and confetti,
  letter-by-letter headings, the drawn lines, the thread down the page, marquees that speed up with the scroll,
  counters, tilting cards, the screenshot carousels, before/after, the 8-language welcome, the lab (find the bugs,
  draw a line, the terminal, the live meter of the page itself), the team sentence that lights up word by word, the
  outlined section numbers and corner drawings, the light in the dark sections, the story line, the sketch that
  becomes a website, the orbit, the small ad, the form.
- `assets/js/boot.js` — runs before the page is drawn (theme, opening animation once per visit).
- `assets/css/site.css` — the look. Light paper and a night theme (the moon button).
- `assets/fonts/Inter-var.woff2` — Inter, one variable file with Greek (SIL OFL licence next to it).
- `assets/img/work/` — real screenshots of Giannotas (v25 and an older version for the before/after) and PROJECT 7ο.
- Live sites linked from the page: https://www.giannotaspremiumautosalon.gr/ and https://7o-epal-project.vercel.app/
- `404.html` + `assets/js/nf.js` — the "not found" page, in both languages.
- `vercel.json` — strict security headers. The page has no inline scripts or styles, so they all work.

## Change things
- **A text:** change the Greek in `index.html` and the English under the same key in `assets/js/i18n.js`.
- **Email:** `tipsandgreeks@gmail.com` in `index.html` (contact, footer) and `EMAIL` in `assets/js/site.js`.
- **The small ad** (bottom left, once per visit, closes by itself): the `#pop` block at the end of `index.html`.
- **The ad breaks:** `#ad1` and `#ad2` in `index.html`. They only advertise our own projects.
- **Numbers:** the `.nums` list (`data-count` is the number it counts up to).

## Put it online
1. Upload this folder to a GitHub repository.
2. On vercel.com: Add New → Project → import it (framework "Other", no build command) → Deploy.

## Speed
- Everything that loops moves with `transform` and `opacity` only (the graphics card draws it), and parts of the
  page that are off the screen pause.
- The red line down the page is measured with plain arithmetic, once per load, resize or language change (asking
  the browser to measure it was what froze the page for about 3 seconds in v2).
- The marquees are browser animations; scrolling only changes their speed.
- The line down the page is as tall as the page and scrolls with it; each section's piece draws itself once, and
  only the little dot moves (a transform). The dotted paper is the page's own background, not a layer on top.
- On each frame the scroll position and window height are read once, before anything is written, and only values
  that changed are written; hovered cards and buttons are measured once when the pointer arrives.
- The theme and language circle gets the click point directly (no page-wide variable), so a switch restyles the
  page once, not twice.

Everything that moves stops for visitors who ask their device for less motion. Nothing is stored or sent: after
"Send the message" the visitor chooses Gmail, Outlook, their email app, or copying the text, with the message
already written in.
