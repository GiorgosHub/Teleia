# Security policy

teleia. is the website of George Sabanis and Asteris Pitas: https://teleia01.vercel.app

## Reporting a problem

If you find a security problem, please tell us privately first:

- **GitHub:** [report a vulnerability](https://github.com/GiorgosHub/teleia/security/advisories/new) (private to us), or
- **Email:** tipsandgreeks@gmail.com, with "Security" in the subject.

Please include the page or URL, what you did, what happened and, if you can, the browser you used. Greek or English
is fine. We will reply as soon as we can, tell you what we will do about it, and credit you when it is fixed (if you
want to be credited).

## Good-faith research

You are welcome to look for problems on teleia01.vercel.app, as long as you:

- do not try to slow down or take the site down (no load or denial-of-service tests, no automated floods);
- do not try to trick people (phishing, social engineering) or attack the services we use (GitHub, Vercel);
- give us reasonable time to fix a problem before you talk about it publicly.

We will not take action against research that follows these rules.

## What protects the site

A summary; details are in [portfolio/README.md](portfolio/README.md#security).

- A static site with no accounts, no database, no cookies and no tracking. The contact form stores and sends nothing:
  the visitor sends the email from their own email app.
- A strict Content Security Policy (`default-src 'none'`, scripts only from the site itself, Trusted Types with no
  policy), so injected scripts and HTML do not run.
- Every script and stylesheet carries a fingerprint (Subresource Integrity), enforced by the Integrity-Policy header.
- Cross-origin isolation (COOP, COEP, CORP), no framing, HSTS with preload, a closed Permissions-Policy.
- An edge firewall on Vercel: probes for admin pages and secret files are blocked, only GET and HEAD are allowed (plus
  the reporting endpoint), and the endpoint is rate-limited.
- `tools/build.mjs` checks all of this before every deployment and on every push; a failing check stops the deploy.

`/.well-known/security.txt` on the site points here.
