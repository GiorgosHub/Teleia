// Receives the browser's reports about blocked content (Content Security Policy and Integrity Policy
// violations) and logs a short, cleaned summary, so an injection attempt or a breakage shows up in the
// Vercel logs. Nothing is stored and nothing is sent back. Bodies over 8 KB, other methods and other
// content types are refused before anything is parsed.
const MAX_BYTES = 8 * 1024;
const TYPES = /^application\/(csp-report|reports\+json|json)\s*(;|$)/i;
// control characters and line breaks are removed, so a report cannot forge extra log lines
const UNSAFE = new RegExp('[\\u0000-\\u001f\\u007f-\\u009f\\u2028\\u2029]', 'g');
const clip = (v, n) => String(v ?? '').replace(UNSAFE, '').slice(0, n);

module.exports = async function handler(req, res) {
  const done = (status, headers = {}) => {
    res.statusCode = status;
    for (const [k, v] of Object.entries({ 'cache-control': 'no-store', ...headers })) res.setHeader(k, v);
    res.end();
  };
  if (req.method !== 'POST') return done(405, { allow: 'POST' });
  if (!TYPES.test(String(req.headers['content-type'] ?? ''))) return done(415);
  if (Number(req.headers['content-length'] ?? 0) > MAX_BYTES) return done(413);

  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BYTES) return done(413);
      chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const items = Array.isArray(body) ? body.slice(0, 5) : [body];
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      const r = (item['csp-report'] ?? item.body) || {};
      if (typeof r !== 'object') continue;
      console.warn('blocked by policy', JSON.stringify({
        type: clip(item.type ?? 'csp-violation', 32),
        directive: clip(r['effective-directive'] ?? r.effectiveDirective ?? r.destination, 64),
        blocked: clip(r['blocked-uri'] ?? r.blockedURL, 200),
        page: clip(r['document-uri'] ?? r.documentURL, 200),
        sample: clip(r['script-sample'] ?? r.sample, 80),
      }));
    }
  } catch {
    return done(400);
  }
  return done(204);
};
