// GET /admin/export: downloads the sign-up list as a spreadsheet file (CSV).
//
// The browser asks for a username and password. Any username works; the
// password is the EXPORT_PASSWORD secret set in Cloudflare. Without that
// secret this page doesn't exist.

export async function onRequestGet({ request, env }) {
  if (!env.EXPORT_PASSWORD) return new Response('Not found', { status: 404 });

  if (!(await passwordMatches(request, env.EXPORT_PASSWORD))) {
    return new Response('Password needed', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Firn sign-ups", charset="UTF-8"' },
    });
  }

  const { results } = await env.DB
    .prepare('SELECT email, signed_up_on FROM signups ORDER BY signed_up_on, email')
    .all();

  const lines = ['email,signed_up_on', ...results.map((row) => `${csvCell(row.email)},${row.signed_up_on}`)];
  const today = new Date().toISOString().slice(0, 10);

  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="firn-signups-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

async function passwordMatches(request, expected) {
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Basic ')) return false;

  let given;
  try {
    const bytes = Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0));
    given = new TextDecoder().decode(bytes);
  } catch {
    return false;
  }
  given = given.slice(given.indexOf(':') + 1);

  // Compare fingerprints of equal length so the check takes the same time
  // whether the password is nearly right or completely wrong.
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(given)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

// Quote the address, and stop spreadsheet apps from treating one that starts
// with = + - or @ as a formula.
function csvCell(value) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
