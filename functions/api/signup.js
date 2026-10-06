// POST /api/signup: adds one email address to the sign-up list.
//
// Stores only the address and today's date, in the D1 database bound as DB.
// Spam protection: a hidden trap field, a same-site check, and a daily cap.
// Per-visitor rate limiting is a Cloudflare rule on /api/signup (no IPs are
// stored here).

const DAILY_LIMIT = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');

  const reply = (ok, error, status) => {
    if (wantsJson) {
      return Response.json(ok ? { ok } : { ok, error }, { status, headers: { 'Cache-Control': 'no-store' } });
    }
    if (ok) return Response.redirect(new URL('/thanks', request.url), 303);
    const text = {
      invalid: "That doesn't look like an email address. Please go back and check it.",
      busy: 'Too many sign-ups right now. Please try again later.',
    }[error] || 'Something went wrong. Please go back and try again in a minute.';
    return new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  };

  // Only accept the form from this site.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return reply(false, 'error', 403);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'invalid', 400);
  }

  // A filled-in trap field means a bot. Pretend it worked and save nothing.
  if (form.get('website')) return reply(true);

  const email = String(form.get('email') || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return reply(false, 'invalid', 400);

  const today = new Date().toISOString().slice(0, 10);
  try {
    const signupsToday = await env.DB
      .prepare('SELECT COUNT(*) AS n FROM signups WHERE signed_up_on = ?')
      .bind(today)
      .first('n');
    if (signupsToday >= DAILY_LIMIT) return reply(false, 'busy', 503);

    // Signing up twice is fine: the first date is kept, and the visitor sees
    // the same thank-you either way.
    await env.DB
      .prepare('INSERT OR IGNORE INTO signups (email, signed_up_on) VALUES (?, ?)')
      .bind(email, today)
      .run();
  } catch (err) {
    console.error('signup failed', err);
    return reply(false, 'error', 500);
  }

  return reply(true);
}
