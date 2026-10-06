# firn-site
The website for Firn, a calm browser for everyone. firnbrowser.com

## What's where

- `public/`: the website itself (what Cloudflare publishes).
- `functions/`: the small programs that run on Cloudflare.
  - `api/signup.js` saves an email address from the sign-up form.
  - `admin/export.js` downloads the sign-up list at `/admin/export` (password protected).
- `migrations/`: the setup for the sign-up database (one table: email and date).
- `design/`, `CLAUDE.md`: the design reference and project brief. Not published.
