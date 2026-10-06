# Project Brief: firnbrowser.com

The website for **Firn**, a calm, minimalist desktop browser (the app lives in
the separate `dwurgy/firn` repo). Built by David with Claude. David is not a
professional developer: explain decisions in plain language, keep changes
small, and stop after each step so he can look at it.

Right now this is a **coming-soon page**: one page that says what Firn is,
shows what it looks like, and collects emails from people who want to try it.
A fuller site (download button, features, privacy page) comes later, when Firn
has an installer ready for testers.

---

## The design is decided: follow it

The design was made in Claude Design and is final unless David changes it.

- `design/coming-soon-reference.html`: the page as plain HTML with inline
  styles. It's the source of truth for layout, sizes, spacing, colors and copy.
  Rebuild it cleanly (move styles into a stylesheet), but the result should
  look identical.
- `design/coming-soon-desktop.png` and `design/coming-soon-phone.png`: how it
  should look at 1440px and at phone width.
- `design/share-preview-reference.html` and `assets/firn-share-preview-v3.png`:
  the 1200×630 image shown when someone shares the link (Open Graph / Twitter
  card).

**Copy is final.** Don't rewrite headlines or reword claims. Every privacy
claim on the page has been checked to be true; changing the wording can make it
untrue.

### The idea behind it (so new parts fit)

- **The site is a Firn window.** A warm sand frame (`#E9E3DA`) surrounds a
  page-white sheet (`#FBFAF8`) that floats inside it: 12px inset, 14px corners,
  Firn's warm-brown shadow. Same as a web page inside the app.
- **The snow layers** (`assets/firn-snow-layers.svg`) are the snow-to-firn-to-ice
  cross-section in five glacier tints. They sit at the bottom of the hero,
  full width, at their natural height (`background-size: 100% auto`, pinned to
  the bottom), never stretched to cover the hero. The window mockup overlaps
  them so it looks like it's resting on the snow. The few faint crystals in
  that art must not sit on top of text: adjust the hero spacing if one does.
- **Blue is for branding only.** It appears in the logo, the snow layers and
  the link preview. Buttons, links and text stay in warm neutrals. The main
  button is ink (`#241F1B`) with page-white text.
- **Calm.** Generous space, nothing busy, no animations beyond a gentle 200ms
  ease-out on hover/focus. No carousels, pop-ups, cookie banners (there are no
  cookies), chat widgets or stock photos.

### Tokens

```
Colors   frame #E9E3DA · page #FBFAF8 · ink #241F1B · ink-muted #5E564E
         ink-faint #9D9389 (placeholders only) · glacier #7F9CB0
         glacier-deep #6E98B2 · frost rgba(130,168,190,0.45) (focus ring)
         space colors (used in the window mockup): Sage #8FAE8B,
         Sand #C9A27E, Lagoon #6FA3A0, Glacier #7F9CB0
Type     Headlines: Fraunces with soft corners on and wonky letters off
         (font-variation-settings 'SOFT' 100, 'WONK' 0; optical sizing auto),
         weight 360–400. Everything else: system-ui, -apple-system,
         'Segoe UI', sans-serif.
Radius   10px fields and buttons · 12px the floating page · 14px cards/panels
Shadows  page: 0 1px 3px rgba(60,40,20,.14), 0 6px 20px rgba(60,40,20,.2)
         window: 0 2px 8px rgba(40,28,16,.14), 0 18px 48px rgba(40,28,16,.22)
```

### Dark mode

The page follows the visitor's system setting (`prefers-color-scheme: dark`),
the same way Firn follows the OS. No toggle. Layout, spacing and copy are the
same in both modes; only colours, shadows and two images change. All colours
are CSS variables in `public/styles.css`, with one dark block that redefines
them. Reference: `design/coming-soon-dark-reference.html` and the
`coming-soon-dark-*.png` screenshots.

```
Colors   frame #3A3734 · page #2B2826 · ink #F5F1EC · ink-muted #D4CDC5
         ink-faint #958D85 (placeholders) · links #F5F1EC, hover #D4CDC5
         main button: background #F5F1EC, text #2B2826
         email field: background rgba(255,250,245,.08),
         border 1px rgba(255,250,245,.12)
         focus ring rgba(160,196,214,.45)
         mockup tiles rgba(255,250,245,.08) · highlighted tab
         rgba(255,250,245,.14) · footer border rgba(255,250,245,.08)
         "thanks" background rgba(43,40,38,.85)
         space colours in the mockup are the same in both modes
Shadows  page: 0 1px 3px rgba(0,0,0,.3), 0 6px 22px rgba(0,0,0,.35)
         window: 0 2px 8px rgba(0,0,0,.3), 0 18px 48px rgba(0,0,0,.4)
         small (highlighted tab): 0 1px 2px rgba(0,0,0,.15)
Images   header logo: assets/firn-lockup-on-dark.svg (via <picture>)
         hero: assets/firn-snow-layers-dark.svg, same sizing rules as light
Meta     color-scheme "light dark"; theme-color #E9E3DA light, #3A3734 dark
```

Feature cards use the frame colour (#3A3734), as in the dark reference file.
The link preview image stays light in both modes, because it shows up in
other people's apps.

### Fonts

Self-host Fraunces from `assets/fonts/fraunces.woff2` (a variable font; keep
`Fraunces-OFL.txt` next to it, the license requires it). The reference file
loads it from Google Fonts only for convenience: the real site must not call
Google or any other third party.

### Logo and icons

Use only the files in `assets/`. They're final; never redraw or re-type the
logo. `firn-lockup.svg` is the header logo (about 34px tall). Favicons are in
`assets/favicon/`.

Tab favicon = bare flake (glacier-deep, lighter on dark). Home-screen icons
(180/192/512) = glacier tile.
The 180 icon is the iPhone home-screen icon (`apple-touch-icon`); 192 and 512
are listed in `public/site.webmanifest` for Android. They're marked
`purpose: any` (not maskable), because the flake reaches too close to the
edges to survive Android's circle crop.

---

## Privacy rules (non-negotiable)

Firn's promise is privacy, so the website keeps it too:

- No third-party scripts, fonts, trackers, embeds or analytics. Everything
  loads from firnbrowser.com.
- Visitor counts, if any, only via Cloudflare Web Analytics (cookieless).
  Ask David before turning it on.
- No cookies.
- Email sign-ups are stored on David's own Cloudflare account (a small Worker
  plus a D1 database), never a third-party form or mailing-list service. Store
  only the email address and the date. Add a simple way for David to export
  the list. Basic protection against spam (rate limit, honeypot field).

---

## Hosting

- Cloudflare Pages, connected to this GitHub repo, so every push publishes.
- The domain firnbrowser.com is already on David's Cloudflare account (his
  personal site is there too). Walk him through connecting the custom domain
  step by step, in plain words.
- Keep it a simple static site: plain HTML and CSS, plus the one Worker for
  sign-ups. No framework unless there's a strong reason; ask first.

## Cloudflare setup

These settings live in David's Cloudflare dashboard, not in this repo. They're
written down here so the setup can be understood or rebuilt. Never put the
export password (or any other secret) in this repo.

- **Pages project** `firn-site`, connected to GitHub `dwurgy/firn-site` (the
  Cloudflare GitHub app only has access to this repo). Production branch
  `main`, framework preset None, no build command, build output directory
  `public`. Every merge to `main` publishes; other branches get preview
  addresses.
- **Domains:** firnbrowser.com and www.firnbrowser.com, added under the
  project's Custom domains. The project's own address,
  `firn-site-e8s.pages.dev`, redirects to firnbrowser.com (see below).
- **Database:** D1 database `firn-signups`, created by running
  `migrations/0001_create_signups.sql` in its Console. Bound to the project
  as `DB` (Settings → Bindings, Production only).
- **Export password:** secret `EXPORT_PASSWORD` (Settings → Variables and
  Secrets, Production only). It protects `/admin/export`; without it that page
  doesn't exist. To change it, edit the secret, then redeploy.
- Changes to bindings or secrets only take effect after a new deployment
  (Deployments → ⋯ → Retry deployment).
- Preview deployments have no database, so sign-ups there show an error.
  That's expected.
- **Spam limit:** a rate limiting rule on the firnbrowser.com zone
  (Security → WAF), named "Sign-up limit". When URI Path equals
  `/api/signup`, per IP, more than 5 requests in 10 seconds: block for 10
  seconds. The free plan allows one such rule.
- **pages.dev redirect:** account-level Bulk Redirects. The list
  `pages_dev_redirect` sends `firn-site-e8s.pages.dev` to
  `https://firnbrowser.com` (301), with preserve query string, subpath
  matching and preserve path suffix on, and "include subdomains" off so
  preview addresses keep working. An enabled Bulk Redirect rule uses that
  list. This is done in the dashboard rather than in code so that static
  files don't count against the Functions request allowance.

## Must-haves

- Works and looks right at phone width (see the phone screenshot). On phones,
  the window mockup should shrink as one picture rather than squash its
  sidebar. It will become a real screenshot image later.
- Accessible: real `<label>` for the email field, visible focus ring (frost),
  good contrast, alt text on the logo.
- Page title, description, Open Graph and Twitter tags using
  `assets/firn-share-preview-v3.png`.
- Fast: no build step needed to view it; images and fonts sized sensibly.

## Placeholders to fill later

- `[Screenshot of Firn goes here]` in the window mockup: David will provide a
  real screenshot.
- The "Coming soon to Windows, then macOS and Linux" line may change.

## Project layout

The published site lives in `public/` (so the assets above are at
`public/assets/`). Sign-up code is in `functions/` (Cloudflare Pages
Functions, D1 database bound as `DB`), the database setup in `migrations/`.
See README.md.

## How to work

- Small steps, one at a time. After each, say in plain words what changed and
  how to check it.
- Ask before adding any dependency or service.
- Commit to Git after each working step with a clear message.
