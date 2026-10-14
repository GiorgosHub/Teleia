# teleia. — portfolio of George Sabanis & Asteris Pitas

A static site (HTML, CSS, plain JavaScript, no build step), ready for Vercel.

- `index.html` — the whole site, in Greek (the main language). `assets/js/site.js` has the English texts (`EN`) and
  switches language (ΕΛ / EN buttons, remembered; `?lang=en` opens it in English).
- **Packages** ("Πακέτα", section `#prices` in `index.html`; English in `site.js`) are shown without prices until the business is registered. To add prices later, put a line like `<p class="price">από <b>350 €</b></p>` under each package name.
- **Email**: `tipsandgreeks@gmail.com`, in `index.html` (contact section, footer) and `EMAIL` in `site.js`.
  The form checks the fields and opens the visitor's email app with the message ready (nothing is stored).
- **Projects**: pictures in `assets/img/work/`.
- `vercel.json` — security headers (strict Content-Security-Policy, HTTPS only).

## Put it online
1. Upload the folder to a new GitHub repository.
2. On vercel.com: Add New → Project → import it (framework "Other", no build command) → Deploy.

## The lines
Every hand-drawn line is an SVG `<path class="d" pathLength="1">`: it draws itself when it scrolls into view.
The long line down the page (`.thread`) is built by `site.js` from where the sections are, and draws as you scroll
(computers only). Everything switches off for visitors who ask their device for less motion.
More lines: the hero leaves a fading line behind the pointer; "Από μια γραμμή σε ιστοσελίδα" draws a wireframe that
turns into a real site as you scroll; "Η ιστορία μας" draws its timeline as you read; the orange band has a moving
dashed line; the back-to-top button has a ring that fills as you scroll.
