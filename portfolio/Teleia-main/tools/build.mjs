#!/usr/bin/env node
// teleia. — build and security check. Vercel runs this before every deployment (portfolio/vercel.json,
// "buildCommand"), GitHub runs it on every push and once a week (.github/workflows/security.yml), and you can run it
// yourself:   node tools/build.mjs
//
// 1. Copies only what visitors need from portfolio/ into portfolio/dist: the pages, robots.txt, .well-known and
//    assets/. Nothing else is published (no README, no config, no source of the functions).
// 2. Gives every script and stylesheet in those pages its fingerprint (integrity="sha384-…", crossorigin) and a ?v=
//    cache key taken from the same fingerprint. The browser refuses a file whose bytes changed anywhere on the way, and
//    a cached old copy is never used. The source pages stay plain, so they still open straight from a folder.
// 3. Checks everything below. If anything is wrong the build fails, Vercel does not deploy, and the site stays on its
//    last good version:
//    - the security headers in portfolio/vercel.json are all there and none was loosened;
//    - the pages have no inline script or style, no event-handler attributes, no javascript: links, load nothing from
//      another site, and every new-tab link carries rel="noopener noreferrer";
//    - the scripts never use the APIs that turn text into code or HTML (Trusted Types would block them anyway) and
//      make no network requests (connect-src is 'none');
//    - the stylesheets load nothing from elsewhere and contain no data: URLs;
//    - security.txt is present and valid (it must be renewed before it expires: the weekly run warns 30 days ahead);
//    - no secret (keys, tokens, private keys) and no stray file (.env, backups, source maps) is in the repository.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'portfolio');
const OUT = path.join(SRC, 'dist');
const STRICT_EXPIRY = process.argv.includes('--strict');   // the weekly run: fail 30 days before security.txt expires
const problems = [];
const notes = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const rel = (p) => path.relative(ROOT, p);
const ext = (f) => path.extname(f).toLowerCase();

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === '.vercel') continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/* ---------- 1. copy the public files ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const PUBLIC = (name) => name === 'assets' || name === '.well-known' || name === 'robots.txt' || /\.html$/.test(name);
for (const name of readdirSync(SRC)) if (PUBLIC(name)) cpSync(path.join(SRC, name), path.join(OUT, name), { recursive: true });

/* ---------- 2. fingerprints ---------- */
const sri = (buf) => 'sha384-' + createHash('sha384').update(buf).digest('base64');
const key = (buf) => createHash('sha384').update(buf).digest('hex').slice(0, 10);
const attr = (tag, name) => { const m = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag); return m ? m[1] : null; };
const setAttr = (t, name, value) => (attr(t, name) != null
  ? t.replace(new RegExp(`(\\s${name}=")[^"]*(")`, 'i'), `$1${value}$2`)
  : t.replace(/\s*\/?>$/, (end) => ` ${name}="${value}"${end.trim() === '/>' ? ' />' : '>'}`));
const outFiles = walk(OUT);
for (const page of outFiles.filter((f) => ext(f) === '.html')) {
  const where = rel(page);
  const s = readFileSync(page, 'utf8').replace(/<(script|link)\b[^>]*>/gi, (tag, kind) => {
    const isScript = kind.toLowerCase() === 'script';
    if (!isScript && !/\srel="stylesheet"/i.test(tag)) return tag;
    const name = isScript ? 'src' : 'href', url = attr(tag, name);
    if (!url) { fail(where, `inline ${kind} is not allowed`); return tag; }
    if (/^(?:[a-z]+:)?\/\//i.test(url)) { fail(where, `${kind} from another site: ${url}`); return tag; }
    const clean = url.split(/[?#]/)[0];
    const file = clean.startsWith('/') ? path.join(OUT, clean) : path.join(path.dirname(page), clean);
    if (!existsSync(file)) { fail(where, `${kind} points to a missing file: ${url}`); return tag; }
    const buf = readFileSync(file);
    /* crossorigin: under the Integrity-Policy header the browser checks fingerprints only for files fetched in CORS
       mode; for files from this same site it changes nothing else */
    return setAttr(setAttr(setAttr(tag, name, `${clean}?v=${key(buf)}`), 'integrity', sri(buf)), 'crossorigin', 'anonymous');
  });
  writeFileSync(page, s);
}

/* ---------- 3a. headers ---------- */
{
  const where = 'portfolio/vercel.json';
  const conf = JSON.parse(readFileSync(path.join(SRC, 'vercel.json'), 'utf8'));
  const all = (conf.headers || []).find((r) => r.source === '/(.*)');
  const h = new Map((all ? all.headers : []).map((x) => [x.key.toLowerCase(), x.value]));
  const need = (k, test, why) => {
    const v = h.get(k);
    if (v == null) fail(where, `missing header ${k}`);
    else if (!test(v)) fail(where, `${k} is weaker than it must be: ${why}`);
  };
  const csp = h.get('content-security-policy') || '';
  const dir = new Map(csp.split(';').map((d) => d.trim()).filter(Boolean).map((d) => { const [k, ...v] = d.split(/\s+/); return [k.toLowerCase(), v.join(' ')]; }));
  const want = {
    'default-src': "'none'", 'script-src': "'self'", 'style-src': "'self'", 'img-src': "'self'", 'font-src': "'self'", 'media-src': "'self'",
    'connect-src': "'none'", 'object-src': "'none'", 'base-uri': "'none'", 'form-action': "'none'", 'frame-ancestors': "'none'",
    'frame-src': "'none'", 'worker-src': "'none'", 'require-trusted-types-for': "'script'", 'trusted-types': "'none'",
  };
  if (!csp) fail(where, 'missing header content-security-policy');
  for (const [k, v] of Object.entries(want)) if (dir.get(k) !== v) fail(where, `CSP ${k} must be exactly ${v} (is ${dir.has(k) ? dir.get(k) || '(empty)' : 'missing'})`);
  if (!dir.has('upgrade-insecure-requests')) fail(where, 'CSP lacks upgrade-insecure-requests');
  if (/unsafe-|\*|data:|blob:|https?:|'strict-dynamic'/i.test(csp.replace(/report-uri\s+\S+/, ''))) fail(where, 'CSP allows unsafe-*, a wildcard, data:, blob: or another site');
  need('strict-transport-security', (v) => Number((/max-age=(\d+)/.exec(v) || [])[1]) >= 31536000 && /includeSubDomains/i.test(v) && /preload/i.test(v), 'needs max-age ≥ 1 year, includeSubDomains and preload');
  need('x-content-type-options', (v) => v === 'nosniff', 'must be nosniff');
  need('x-frame-options', (v) => v === 'DENY', 'must be DENY');
  need('referrer-policy', (v) => v === 'no-referrer', 'must be no-referrer');
  need('cross-origin-opener-policy', (v) => v === 'same-origin', 'must be same-origin');
  need('cross-origin-embedder-policy', (v) => v === 'require-corp', 'must be require-corp');
  need('origin-agent-cluster', (v) => v === '?1', 'must be ?1');
  need('integrity-policy', (v) => /blocked-destinations=\([^)]*\bscript\b/.test(v), 'must block scripts without a fingerprint');
  need('permissions-policy', (v) => ['camera=()', 'microphone=()', 'geolocation=()', 'payment=()', 'usb=()', 'clipboard-read=()'].every((f) => v.includes(f)), 'camera, microphone, geolocation, payment, usb and clipboard reading must be off');
  need('access-control-allow-origin', (v) => v !== '*' && /^https:\/\/[a-z0-9.-]+$/.test(v), 'must name the site, never *');
  if (!(conf.headers || []).some((r) => r.headers.some((x) => x.key.toLowerCase() === 'cross-origin-resource-policy' && x.value === 'same-origin'))) fail(where, 'no rule sets Cross-Origin-Resource-Policy: same-origin');
  if (conf.outputDirectory !== 'dist' || !/tools\/build\.mjs/.test(conf.buildCommand || '')) fail(where, 'Vercel must build with tools/build.mjs and publish portfolio/dist only');
}

/* ---------- 3b. pages ---------- */
for (const page of outFiles.filter((f) => ext(f) === '.html')) {
  const where = rel(page).replace(`portfolio${path.sep}dist${path.sep}`, 'portfolio/');
  const s = readFileSync(page, 'utf8');
  for (const tag of s.match(/<(?:script|link)\b[^>]*>/gi) || []) {
    if (/^<script/i.test(tag) || /\srel="stylesheet"/i.test(tag)) {
      if (!/\sintegrity="sha384-[A-Za-z0-9+/=]{64}"/.test(tag) || attr(tag, 'crossorigin') !== 'anonymous') fail(where, `no fingerprint on ${tag.slice(0, 80)}`);
    }
  }
  if (/<script\b(?![^>]*\ssrc=)[^>]*>/i.test(s)) fail(where, 'inline <script> found');
  if (/<style\b/i.test(s) || /\sstyle\s*=/i.test(s)) fail(where, 'inline style found (style-src forbids it)');
  const handler = /<[a-z][^>]*\s(on[a-z]+)\s*=/i.exec(s);
  if (handler) fail(where, `event-handler attribute ${handler[1]} found`);
  if (/javascript:/i.test(s)) fail(where, 'javascript: URL found');
  if (/<(iframe|object|embed|base|frame|applet)\b/i.test(s)) fail(where, 'iframe, object, embed, base or frame element found');
  const form = /<form\b[^>]*\saction="([^"]*)"/i.exec(s);
  if (form) fail(where, `a form posts to ${form[1]} (form-action is 'none')`);
  for (const tag of s.match(/<a\b[^>]*\starget="_blank"[^>]*>/gi) || []) {
    const r = (attr(tag, 'rel') || '').split(/\s+/);
    if (!r.includes('noopener') || !r.includes('noreferrer')) fail(where, `new-tab link without rel="noopener noreferrer": ${tag.slice(0, 90)}`);
  }
  for (const m of s.matchAll(/<(img|video|source|audio|track|input)\b[^>]*\s(?:src|poster|srcset)="([^"]*)"/gi)) {
    if (/^(?:[a-z]+:)?\/\//i.test(m[2]) || /^data:/i.test(m[2])) fail(where, `${m[1]} loads from another site or a data: URL: ${m[2].slice(0, 80)}`);
  }
}

/* ---------- 3c. scripts (the site's and the functions') ---------- */
const SINKS = [
  [/\.innerHTML\s*[+]?=|\.outerHTML\s*[+]?=|insertAdjacentHTML\s*\(/, 'writes HTML from text'],
  [/document\.write(ln)?\s*\(/, 'uses document.write'],
  [/(^|[^.\w])eval\s*\(|new\s+Function\s*\(/, 'turns text into code'],
  [/set(Timeout|Interval)\s*\(\s*["'`]/, 'gives a timer a string of code'],
  [/DOMParser|createContextualFragment|parseHTMLUnsafe|setHTMLUnsafe|\.srcdoc\s*=/, 'parses HTML from text'],
  [/trustedTypes\.createPolicy/, 'creates a Trusted Types policy (the CSP allows none)'],
  [/\bimport\s*\(/, 'imports code at run time'],
  [/child_process|\bexecSync\b|\bspawn\s*\(/, 'runs programs'],
];
const NET = /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/;
const scripts = [...outFiles.filter((f) => ext(f) === '.js'), ...walk(path.join(SRC, 'api')).filter((f) => ext(f) === '.js')];
for (const f of scripts) {
  const where = rel(f).replace(`portfolio${path.sep}dist${path.sep}`, 'portfolio/');
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '');
    for (const [re, why] of SINKS) if (re.test(code)) fail(`${where}:${i + 1}`, why);
    if (!f.startsWith(path.join(SRC, 'api')) && NET.test(code)) fail(`${where}:${i + 1}`, "makes a network request (connect-src is 'none')");
  });
}

/* ---------- 3d. stylesheets ---------- */
for (const f of outFiles.filter((x) => ext(x) === '.css')) {
  const where = rel(f).replace(`portfolio${path.sep}dist${path.sep}`, 'portfolio/');
  const s = readFileSync(f, 'utf8');
  if (/url\(\s*["']?data:/i.test(s)) fail(where, 'data: URL in a stylesheet (img-src is self only)');
  if (/url\(\s*["']?(?:[a-z]+:)?\/\//i.test(s)) fail(where, 'loads something from another site');
  if (/@import/i.test(s)) fail(where, '@import is not used here');
  if (/expression\s*\(|(?<![-\w])behavior\s*:|-moz-binding/i.test(s)) fail(where, 'legacy script-in-CSS feature');
}

/* ---------- 3e. security.txt ---------- */
{
  const p = path.join(OUT, '.well-known', 'security.txt');
  if (!existsSync(p)) fail('portfolio/.well-known/security.txt', 'missing');
  else {
    const s = readFileSync(p, 'utf8');
    if (!/^Contact:\s*\S+/m.test(s)) fail('security.txt', 'no Contact line');
    const exp = /^Expires:\s*(\S+)/m.exec(s);
    const days = exp ? (Date.parse(exp[1]) - Date.now()) / 864e5 : NaN;
    if (!exp || Number.isNaN(days)) fail('security.txt', 'no valid Expires line');
    else if (days > 366) fail('security.txt', 'Expires must be less than a year away (RFC 9116)');
    else if (days < 30) (STRICT_EXPIRY || days < 0 ? fail : (w, m) => notes.push(`${w}: ${m}`))('security.txt', `expires in ${Math.floor(days)} days: set a new Expires date, under a year away`);
    else if (days < 90) notes.push(`security.txt expires in ${Math.floor(days)} days`);
  }
}

/* ---------- 3f. secrets and stray files, in the whole repository ---------- */
const SECRETS = [
  [/AKIA[0-9A-Z]{16}/, 'an AWS access key'], [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'a private key'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}/, 'a GitHub token'], [/\bgithub_pat_[A-Za-z0-9_]{40,}/, 'a GitHub token'],
  [/\bxox[abposr]-[A-Za-z0-9-]{10,}/, 'a Slack token'], [/\bAIza[0-9A-Za-z_-]{35}\b/, 'a Google API key'],
  [/\b[sr]k_live_[0-9A-Za-z]{16,}/, 'a Stripe key'], [/\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{32,}/, 'an AI provider key'],
];
const TEXT = new Set(['.html', '.js', '.mjs', '.cjs', '.css', '.json', '.md', '.txt', '.yml', '.yaml', '.svg', '']);
const self = fileURLToPath(import.meta.url);
for (const f of walk(ROOT)) {
  if (f.startsWith(OUT + path.sep)) continue;
  const where = rel(f), base = path.basename(f).toLowerCase();
  if (/^\.env(\..*)?$/.test(base) || /\.(bak|old|orig|swp|map|pem|key|p12|pfx|sqlite|db)$/.test(base)) fail(where, 'this kind of file must not be in the repository');
  if (f === self || !TEXT.has(ext(f)) || statSync(f).size > 2e6) continue;
  const s = readFileSync(f, 'utf8');
  for (const [re, what] of SECRETS) if (re.test(s)) fail(where, `looks like it contains ${what}`);
}

for (const n of notes) console.log(`note: ${n}`);
if (problems.length) {
  console.error(`\nBuild stopped: ${problems.length} security problem${problems.length > 1 ? 's' : ''}:`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`built portfolio/dist (${walk(OUT).length} files) · security check passed: headers, pages, fingerprints, scripts, stylesheets, security.txt, secrets`);
